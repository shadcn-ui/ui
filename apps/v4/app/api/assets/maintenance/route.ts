import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/assets/maintenance - List maintenance records
// POST /api/assets/maintenance - Create maintenance record
export async function GET(request: NextRequest) {
  const client = await pool.connect();

  try {
    const { searchParams } = new URL(request.url);
    const asset_id = searchParams.get("asset_id");
    const maintenance_status = searchParams.get("maintenance_status");
    const maintenance_type = searchParams.get("maintenance_type");
    const start_date = searchParams.get("start_date");
    const end_date = searchParams.get("end_date");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    let conditions = [];
    const params: any[] = [];
    let paramCount = 1;

    if (asset_id) {
      conditions.push(`mr.asset_id = $${paramCount}`);
      params.push(asset_id);
      paramCount++;
    }

    if (maintenance_status) {
      conditions.push(`mr.maintenance_status = $${paramCount}`);
      params.push(maintenance_status);
      paramCount++;
    }

    if (maintenance_type) {
      conditions.push(`mr.maintenance_type = $${paramCount}`);
      params.push(maintenance_type);
      paramCount++;
    }

    if (start_date) {
      conditions.push(`mr.maintenance_date >= $${paramCount}`);
      params.push(start_date);
      paramCount++;
    }

    if (end_date) {
      conditions.push(`mr.maintenance_date <= $${paramCount}`);
      params.push(end_date);
      paramCount++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM asset_maintenance_records mr
      ${whereClause}
    `;
    const countResult = await client.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);

    // Get maintenance records
    params.push(limit, offset);
    const recordsQuery = `
      SELECT 
        mr.*,
        a.asset_number,
        a.asset_name,
        a.category_id,
        ac.category_name,
        e.first_name || ' ' || e.last_name as performed_by_name
      FROM asset_maintenance_records mr
      LEFT JOIN assets a ON mr.asset_id = a.asset_id
      LEFT JOIN asset_categories ac ON a.category_id = ac.category_id
      LEFT JOIN hrm_employees e ON mr.performed_by_employee_id = e.employee_id
      ${whereClause}
      ORDER BY mr.maintenance_date DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    const result = await client.query(recordsQuery, params);

    // Get summary statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_records,
        COUNT(CASE WHEN maintenance_status = 'completed' THEN 1 END) as completed_count,
        COUNT(CASE WHEN maintenance_status = 'scheduled' THEN 1 END) as scheduled_count,
        COUNT(CASE WHEN maintenance_status = 'in_progress' THEN 1 END) as in_progress_count,
        SUM(total_cost) as total_cost,
        AVG(total_cost) as avg_cost,
        SUM(asset_downtime_hours) as total_downtime_hours
      FROM asset_maintenance_records mr
      ${whereClause}
    `;
    const statsResult = await client.query(statsQuery, params.slice(0, -2));

    return NextResponse.json({
      maintenance_records: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      statistics: statsResult.rows[0],
    });
  } catch (error: any) {
    console.error("Error fetching maintenance records:", error);
    return NextResponse.json(
      { error: "Failed to fetch maintenance records", details: error.message },
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
      maintenance_type,
      maintenance_date,
      start_time,
      end_time,
      performed_by_employee_id,
      performed_by_vendor,
      priority,
      issue_description,
      work_performed,
      parts_used,
      parts_cost,
      labor_cost,
      other_costs,
      condition_before,
      condition_after,
      is_resolved,
      requires_followup,
      followup_date,
      asset_downtime_hours,
      notes,
      created_by,
    } = body;

    if (!asset_id || !maintenance_type || !maintenance_date) {
      return NextResponse.json(
        { error: "Missing required fields: asset_id, maintenance_type, maintenance_date" },
        { status: 400 }
      );
    }

    // Generate maintenance number
    const sequenceQuery = `
      SELECT COALESCE(MAX(CAST(SUBSTRING(maintenance_number FROM '[0-9]+') AS INTEGER)), 0) + 1 as next_num
      FROM asset_maintenance_records
      WHERE maintenance_number ~ '^MAINT-[0-9]{6}$'
    `;
    const sequenceResult = await client.query(sequenceQuery);
    const maintenance_number = `MAINT-${String(sequenceResult.rows[0].next_num).padStart(6, "0")}`;

    // Calculate actual duration if both start and end time provided
    let actual_duration_hours = null;
    if (start_time && end_time) {
      const start = new Date(start_time);
      const end = new Date(end_time);
      actual_duration_hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }

    // Insert maintenance record
    const insertQuery = `
      INSERT INTO asset_maintenance_records (
        maintenance_number, asset_id, maintenance_type,
        maintenance_date, start_time, end_time, actual_duration_hours,
        performed_by_employee_id, performed_by_vendor, priority,
        issue_description, work_performed, parts_used,
        parts_cost, labor_cost, other_costs,
        condition_before, condition_after, is_resolved,
        requires_followup, followup_date, asset_downtime_hours,
        notes, created_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
        $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24
      )
      RETURNING *
    `;

    const result = await client.query(insertQuery, [
      maintenance_number,
      asset_id,
      maintenance_type,
      maintenance_date,
      start_time || null,
      end_time || null,
      actual_duration_hours,
      performed_by_employee_id || null,
      performed_by_vendor || null,
      priority || "medium",
      issue_description || null,
      work_performed || null,
      parts_used || null,
      parts_cost || 0,
      labor_cost || 0,
      other_costs || 0,
      condition_before || null,
      condition_after || null,
      is_resolved || false,
      requires_followup || false,
      followup_date || null,
      asset_downtime_hours || null,
      notes || null,
      created_by || null,
    ]);

    return NextResponse.json({
      message: "Maintenance record created successfully",
      maintenance_record: result.rows[0],
    }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating maintenance record:", error);
    return NextResponse.json(
      { error: "Failed to create maintenance record", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
