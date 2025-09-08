import sql from "@/app/api/utils/sql";

// Get all pitches for an owner
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const owner_id = searchParams.get('owner_id') || 'owner1'; // Default for demo

    const pitches = await sql`
      SELECT * FROM pitches 
      WHERE owner_id = ${owner_id}
      ORDER BY created_at DESC
    `;

    return Response.json({ success: true, data: pitches });
  } catch (error) {
    console.error('Error fetching pitches:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Create a new pitch
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, location, price_per_hour, amenities, rules, photos, is_active } = body;
    const owner_id = 'owner1'; // Default for demo

    const [pitch] = await sql`
      INSERT INTO pitches (owner_id, name, description, location, price_per_hour, amenities, rules, photos, is_active)
      VALUES (${owner_id}, ${name}, ${description}, ${location}, ${price_per_hour}, ${amenities}, ${rules}, ${photos}, ${is_active || true})
      RETURNING *
    `;

    return Response.json({ success: true, data: pitch });
  } catch (error) {
    console.error('Error creating pitch:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}