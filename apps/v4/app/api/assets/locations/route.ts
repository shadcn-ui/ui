import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/assets/locations - List asset locations
// POST /api/assets/locations - Create location
export async function GET(request: NextRequest) {
  const client = await pool.connect();

  try {
    const query = `
      SELECT 
        al.*,
        pl.location_name as parent_location_name,
        (
          SELECT COUNT(*) 
          FROM assets a 
          WHERE a.current_location_id = al.location_id
        ) as asset_count
      FROM asset_locations al
      LEFT JOIN asset_locations pl ON al.parent_location_id = pl.location_id
      WHERE al.is_active = true
      ORDER BY al.location_name
    `;

    const result = await client.query(query);

    return NextResponse.json({
      locations: result.rows,
    });
  } catch (error: any) {
    console.error("Error fetching locations:", error);
    return NextResponse.json(
      { error: "Failed to fetch locations", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function POST(request: NextRequest) {
  const client = await pool.connect();

  try {
    const body = await request.json();
    const {
      location_code,
      location_name,
      location_type,
      parent_location_id,
      building,
      floor,
      room_number,
      address_line1,
      address_line2,
      city,
      state_province,
      postal_code,
      country,
      latitude,
      longitude,
      manager_employee_id,
      phone_number,
      email,
      description,
      created_by,
    } = body;

    if (!location_code || !location_name) {
      return NextResponse.json(
        { error: "Missing required fields: location_code, location_name" },
        { status: 400 }
      );
    }

    const insertQuery = `
      INSERT INTO asset_locations (
        location_code, location_name, location_type, parent_location_id,
        building, floor, room_number, address_line1, address_line2,
        city, state_province, postal_code, country, latitude, longitude,
        manager_employee_id, phone_number, email, description, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      RETURNING *
    `;

    const result = await client.query(insertQuery, [
      location_code,
      location_name,
      location_type || "office",
      parent_location_id || null,
      building || null,
      floor || null,
      room_number || null,
      address_line1 || null,
      address_line2 || null,
      city || null,
      state_province || null,
      postal_code || null,
      country || null,
      latitude || null,
      longitude || null,
      manager_employee_id || null,
      phone_number || null,
      email || null,
      description || null,
      created_by || null,
    ]);

    return NextResponse.json({
      message: "Location created successfully",
      location: result.rows[0],
    }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating location:", error);
    return NextResponse.json(
      { error: "Failed to create location", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
