import sql from "@/app/api/utils/sql";

// Get a specific pitch
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const [pitch] = await sql`
      SELECT * FROM pitches WHERE id = ${id}
    `;

    if (!pitch) {
      return Response.json({ success: false, error: 'Pitch not found' }, { status: 404 });
    }

    return Response.json({ success: true, data: pitch });
  } catch (error) {
    console.error('Error fetching pitch:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Update a pitch
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const updateFields = [];
    const values = [];
    let paramIndex = 1;

    // Build dynamic update query
    const allowedFields = ['name', 'description', 'location', 'price_per_hour', 'amenities', 'rules', 'photos', 'is_active'];
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateFields.push(`${field} = $${paramIndex}`);
        values.push(body[field]);
        paramIndex++;
      }
    }

    if (updateFields.length === 0) {
      return Response.json({ success: false, error: 'No fields to update' }, { status: 400 });
    }

    updateFields.push(`updated_at = $${paramIndex}`);
    values.push(new Date());
    values.push(id); // Add id for WHERE clause

    const query = `
      UPDATE pitches 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex + 1}
      RETURNING *
    `;

    const [updatedPitch] = await sql(query, values);

    return Response.json({ success: true, data: updatedPitch });
  } catch (error) {
    console.error('Error updating pitch:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}