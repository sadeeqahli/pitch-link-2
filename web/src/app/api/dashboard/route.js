import sql from "@/app/api/utils/sql";

// Get dashboard analytics data
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const owner_id = searchParams.get('owner_id') || 'owner1'; // Default for demo

    // Get today's earnings
    const [todayEarnings] = await sql`
      SELECT COALESCE(SUM(b.total_amount), 0) as today_earnings
      FROM bookings b
      JOIN pitches p ON b.pitch_id = p.id
      WHERE p.owner_id = ${owner_id} 
      AND b.booking_date = CURRENT_DATE
      AND b.payment_status = 'confirmed'
    `;

    // Get weekly earnings
    const [weeklyEarnings] = await sql`
      SELECT COALESCE(SUM(b.total_amount), 0) as weekly_earnings
      FROM bookings b
      JOIN pitches p ON b.pitch_id = p.id
      WHERE p.owner_id = ${owner_id}
      AND b.booking_date >= CURRENT_DATE - INTERVAL '7 days'
      AND b.payment_status = 'confirmed'
    `;

    // Get monthly earnings
    const [monthlyEarnings] = await sql`
      SELECT COALESCE(SUM(b.total_amount), 0) as monthly_earnings
      FROM bookings b
      JOIN pitches p ON b.pitch_id = p.id
      WHERE p.owner_id = ${owner_id}
      AND DATE_TRUNC('month', b.booking_date) = DATE_TRUNC('month', CURRENT_DATE)
      AND b.payment_status = 'confirmed'
    `;

    // Get pending bookings count
    const [pendingBookings] = await sql`
      SELECT COUNT(*) as pending_count
      FROM bookings b
      JOIN pitches p ON b.pitch_id = p.id
      WHERE p.owner_id = ${owner_id}
      AND b.booking_status = 'active'
      AND b.payment_status = 'pending'
    `;

    // Get upcoming bookings count
    const [upcomingBookings] = await sql`
      SELECT COUNT(*) as upcoming_count
      FROM bookings b
      JOIN pitches p ON b.pitch_id = p.id
      WHERE p.owner_id = ${owner_id}
      AND b.booking_date >= CURRENT_DATE
      AND b.booking_status = 'active'
    `;

    // Get total active pitches
    const [activePitches] = await sql`
      SELECT COUNT(*) as active_pitches
      FROM pitches
      WHERE owner_id = ${owner_id}
      AND is_active = true
    `;

    // Get recent bookings for activity feed
    const recentBookings = await sql`
      SELECT 
        b.*,
        p.name as pitch_name,
        p.location as pitch_location
      FROM bookings b
      JOIN pitches p ON b.pitch_id = p.id
      WHERE p.owner_id = ${owner_id}
      ORDER BY b.created_at DESC
      LIMIT 10
    `;

    // Get booking trends for the last 7 days
    const bookingTrends = await sql`
      SELECT 
        DATE(b.booking_date) as booking_date,
        COUNT(*) as booking_count,
        COALESCE(SUM(b.total_amount), 0) as daily_revenue
      FROM bookings b
      JOIN pitches p ON b.pitch_id = p.id
      WHERE p.owner_id = ${owner_id}
      AND b.booking_date >= CURRENT_DATE - INTERVAL '7 days'
      AND b.payment_status = 'confirmed'
      GROUP BY DATE(b.booking_date)
      ORDER BY booking_date ASC
    `;

    const dashboardData = {
      earnings: {
        today: parseFloat(todayEarnings.today_earnings || 0),
        weekly: parseFloat(weeklyEarnings.weekly_earnings || 0),
        monthly: parseFloat(monthlyEarnings.monthly_earnings || 0)
      },
      bookings: {
        pending: parseInt(pendingBookings.pending_count || 0),
        upcoming: parseInt(upcomingBookings.upcoming_count || 0)
      },
      pitches: {
        active: parseInt(activePitches.active_pitches || 0)
      },
      recentActivity: recentBookings,
      trends: bookingTrends.map(trend => ({
        date: trend.booking_date,
        bookings: parseInt(trend.booking_count),
        revenue: parseFloat(trend.daily_revenue)
      }))
    };

    return Response.json({ success: true, data: dashboardData });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}