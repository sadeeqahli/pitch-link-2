import sql from "@/app/api/utils/sql";

// Get all bookings for owner's pitches
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const owner_id = searchParams.get('owner_id') || 'owner1'; // Default for demo
    const status = searchParams.get('status'); // active, completed, cancelled
    const date = searchParams.get('date'); // specific date filter

    let whereClause = `WHERE p.owner_id = $1`;
    const values = [owner_id];
    let paramIndex = 2;

    if (status) {
      whereClause += ` AND b.booking_status = $${paramIndex}`;
      values.push(status);
      paramIndex++;
    }

    if (date) {
      whereClause += ` AND b.booking_date = $${paramIndex}`;
      values.push(date);
      paramIndex++;
    }

    const query = `
      SELECT 
        b.*,
        p.name as pitch_name,
        p.location as pitch_location,
        py.payment_status as payment_method
      FROM bookings b
      JOIN pitches p ON b.pitch_id = p.id
      LEFT JOIN payments py ON b.id = py.booking_id
      ${whereClause}
      ORDER BY b.booking_date DESC, b.start_time DESC
    `;

    const bookings = await sql(query, values);

    return Response.json({ success: true, data: bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Create a new manual booking
export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      pitch_id, 
      player_name, 
      player_email, 
      player_phone, 
      booking_date, 
      start_time, 
      end_time, 
      total_amount,
      payment_status = 'pending'
    } = body;

    const [booking] = await sql`
      INSERT INTO bookings (pitch_id, player_name, player_email, player_phone, booking_date, start_time, end_time, total_amount, payment_status)
      VALUES (${pitch_id}, ${player_name}, ${player_email}, ${player_phone}, ${booking_date}, ${start_time}, ${end_time}, ${total_amount}, ${payment_status})
      RETURNING *
    `;

    return Response.json({ success: true, data: booking });
  } catch (error) {
    console.error('Error creating booking:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}