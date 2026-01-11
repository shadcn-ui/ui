import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/hrm/overtime - List overtime records
// POST /api/hrm/overtime - Submit overtime request
export async function GET(request: NextRequest) {
  const client = await pool.connect();

  try {
    const { searchParams } = new URL(request.url);
    const employee_id = searchParams.get("employee_id");
    const start_date = searchParams.get("start_date");
    const end_date = searchParams.get("end_date");
    const overtime_type = searchParams.get("overtime_type");
    const status = searchParams.get("status");
    const is_paid = searchParams.get("is_paid");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    let conditions = [];
    const params: any[] = [];
    let paramCount = 1;

    if (employee_id) {
      conditions.push(`ot.employee_id = $${paramCount}`);
      params.push(employee_id);
      paramCount++;
    }

    if (start_date) {
      conditions.push(`ot.overtime_date >= $${paramCount}`);
      params.push(start_date);
      paramCount++;
    }

    if (end_date) {
      conditions.push(`ot.overtime_date <= $${paramCount}`);
      params.push(end_date);
      paramCount++;
    }

    if (overtime_type) {
      conditions.push(`ot.overtime_type = $${paramCount}`);
      params.push(overtime_type);
      paramCount++;
    }

    if (status) {
      conditions.push(`ot.status = $${paramCount}`);
      params.push(status);
      paramCount++;
    }

    if (is_paid) {
      conditions.push(`ot.is_paid = $${paramCount}`);
      params.push(is_paid === "true");
      paramCount++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM hrm_overtime_records ot
      ${whereClause}
    `;
    const countResult = await client.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);

    // Get overtime records
    params.push(limit, offset);
    const recordsQuery = `
      SELECT 
        ot.*,
        e.employee_number,
        e.first_name || ' ' || e.last_name as employee_name,
        d.department_name,
        pa.first_name || ' ' || pa.last_name as pre_approved_by_name,
        ab.first_name || ' ' || ab.last_name as approved_by_name
      FROM hrm_overtime_records ot
      LEFT JOIN hrm_employees e ON ot.employee_id = e.employee_id
      LEFT JOIN hrm_departments d ON e.department_id = d.department_id
      LEFT JOIN hrm_employees pa ON ot.pre_approved_by = pa.employee_id
      LEFT JOIN hrm_employees ab ON ot.approved_by = ab.employee_id
      ${whereClause}
      ORDER BY ot.overtime_date DESC, ot.start_time DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    const result = await client.query(recordsQuery, params);

    // Get summary statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_records,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_count,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_count,
        COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_count,
        SUM(total_hours) as total_hours,
        SUM(approved_hours) as total_approved_hours,
        SUM(CASE WHEN is_paid = true THEN payment_amount ELSE 0 END) as total_paid_amount,
        AVG(pay_multiplier) as avg_pay_multiplier
      FROM hrm_overtime_records ot
      ${whereClause}
    `;
    const statsResult = await client.query(statsQuery, params.slice(0, -2));

    return NextResponse.json({
      overtime_records: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      statistics: statsResult.rows[0],
    });
  } catch (error: any) {
    console.error("Error fetching overtime records:", error);
    return NextResponse.json(
      { error: "Failed to fetch overtime records", details: error.message },
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
      employee_id,
      overtime_date,
      start_time,
      end_time,
      overtime_type,
      project_code,
      task_description,
      reason,
      is_pre_approved,
      pre_approved_by,
    } = body;

    if (!employee_id || !overtime_date || !start_time || !end_time) {
      return NextResponse.json(
        { error: "Missing required fields: employee_id, overtime_date, start_time, end_time" },
        { status: 400 }
      );
    }

    // Calculate total hours
    const startDateTime = new Date(`${overtime_date} ${start_time}`);
    const endDateTime = new Date(`${overtime_date} ${end_time}`);
    const diffMs = endDateTime.getTime() - startDateTime.getTime();
    const total_hours = diffMs / (1000 * 60 * 60);

    if (total_hours <= 0) {
      return NextResponse.json(
        { error: "End time must be after start time" },
        { status: 400 }
      );
    }

    // Determine pay multiplier based on overtime type
    let pay_multiplier = 1.5; // Default
    if (overtime_type === "weekend") {
      pay_multiplier = 2.0;
    } else if (overtime_type === "holiday") {
      pay_multiplier = 2.5;
    } else if (overtime_type === "night_shift") {
      pay_multiplier = 1.75;
    }

    // Insert overtime record
    const insertQuery = `
      INSERT INTO hrm_overtime_records (
        employee_id, overtime_date, start_time, end_time,
        total_hours, overtime_type, pay_multiplier,
        project_code, task_description, reason,
        is_pre_approved, pre_approved_by, pre_approved_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;

    const result = await client.query(insertQuery, [
      employee_id,
      overtime_date,
      start_time,
      end_time,
      total_hours,
      overtime_type || "weekday",
      body.pay_multiplier || pay_multiplier,
      project_code || null,
      task_description || null,
      reason || null,
      is_pre_approved || false,
      pre_approved_by || null,
      is_pre_approved ? new Date() : null,
    ]);

    return NextResponse.json({
      message: "Overtime request submitted successfully",
      overtime_record: result.rows[0],
    }, { status: 201 });
  } catch (error: any) {
    console.error("Error submitting overtime request:", error);
    return NextResponse.json(
      { error: "Failed to submit overtime request", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
