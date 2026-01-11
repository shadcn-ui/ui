import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/assets/transfers - List asset transfers
// POST /api/assets/transfers - Create transfer request
export async function GET(request: NextRequest) {
  const client = await pool.connect();

  try {
    const { searchParams } = new URL(request.url);
    const asset_id = searchParams.get("asset_id");
    const transfer_status = searchParams.get("transfer_status");
    const from_location_id = searchParams.get("from_location_id");
    const to_location_id = searchParams.get("to_location_id");

    let conditions = [];
    const params: any[] = [];
    let paramCount = 1;

    if (asset_id) {
      conditions.push(`t.asset_id = $${paramCount}`);
      params.push(asset_id);
      paramCount++;
    }

    if (transfer_status) {
      conditions.push(`t.transfer_status = $${paramCount}`);
      params.push(transfer_status);
      paramCount++;
    }

    if (from_location_id) {
      conditions.push(`t.from_location_id = $${paramCount}`);
      params.push(from_location_id);
      paramCount++;
    }

    if (to_location_id) {
      conditions.push(`t.to_location_id = $${paramCount}`);
      params.push(to_location_id);
      paramCount++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `
      SELECT 
        t.*,
        a.asset_number,
        a.asset_name,
        fl.location_name as from_location_name,
        tl.location_name as to_location_name,
        fe.first_name || ' ' || fe.last_name as from_employee_name,
        te.first_name || ' ' || te.last_name as to_employee_name,
        rb.first_name || ' ' || rb.last_name as requested_by_name,
        ab.first_name || ' ' || ab.last_name as approved_by_name
      FROM asset_transfers t
      LEFT JOIN assets a ON t.asset_id = a.asset_id
      LEFT JOIN asset_locations fl ON t.from_location_id = fl.location_id
      LEFT JOIN asset_locations tl ON t.to_location_id = tl.location_id
      LEFT JOIN hrm_employees fe ON t.from_employee_id = fe.employee_id
      LEFT JOIN hrm_employees te ON t.to_employee_id = te.employee_id
      LEFT JOIN hrm_employees rb ON t.requested_by = rb.employee_id
      LEFT JOIN hrm_employees ab ON t.approved_by = ab.employee_id
      ${whereClause}
      ORDER BY t.requested_date DESC
    `;

    const result = await client.query(query, params);

    return NextResponse.json({
      transfers: result.rows,
    });
  } catch (error: any) {
    console.error("Error fetching transfers:", error);
    return NextResponse.json(
      { error: "Failed to fetch transfers", details: error.message },
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
      asset_id,
      from_location_id,
      to_location_id,
      from_employee_id,
      to_employee_id,
      from_department_id,
      to_department_id,
      requested_by,
      transfer_reason,
      notes,
      condition_at_transfer,
    } = body;

    if (!asset_id || !to_location_id) {
      return NextResponse.json(
        { error: "Missing required fields: asset_id, to_location_id" },
        { status: 400 }
      );
    }

    // Generate transfer number
    const sequenceQuery = `
      SELECT COALESCE(MAX(CAST(SUBSTRING(transfer_number FROM '[0-9]+') AS INTEGER)), 0) + 1 as next_num
      FROM asset_transfers
      WHERE transfer_number ~ '^TRANS-[0-9]{6}$'
    `;
    const sequenceResult = await client.query(sequenceQuery);
    const transfer_number = `TRANS-${String(sequenceResult.rows[0].next_num).padStart(6, "0")}`;

    // Insert transfer
    const insertQuery = `
      INSERT INTO asset_transfers (
        transfer_number, asset_id, from_location_id, to_location_id,
        from_employee_id, to_employee_id, from_department_id, to_department_id,
        requested_by, transfer_reason, notes, condition_at_transfer
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const result = await client.query(insertQuery, [
      transfer_number,
      asset_id,
      from_location_id || null,
      to_location_id,
      from_employee_id || null,
      to_employee_id || null,
      from_department_id || null,
      to_department_id || null,
      requested_by || null,
      transfer_reason || null,
      notes || null,
      condition_at_transfer || null,
    ]);

    return NextResponse.json({
      message: "Transfer request created successfully",
      transfer: result.rows[0],
    }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating transfer:", error);
    return NextResponse.json(
      { error: "Failed to create transfer", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
