import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/hrm/shifts - List shifts
// POST /api/hrm/shifts - Create shift
export async function GET(request: NextRequest) {
  const client = await pool.connect();

  try {
    const { searchParams } = new URL(request.url);
    const shift_type = searchParams.get("shift_type");
    const is_active = searchParams.get("is_active");

    let conditions = [];
    const params: any[] = [];
    let paramCount = 1;

    if (shift_type) {
      conditions.push(`shift_type = $${paramCount}`);
      params.push(shift_type);
      paramCount++;
    }

    if (is_active !== null) {
      conditions.push(`is_active = $${paramCount}`);
      params.push(is_active === "true");
      paramCount++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `
      SELECT 
        *,
        (
          SELECT COUNT(*) 
          FROM hrm_work_schedules ws
          WHERE ws.monday_shift_id = s.shift_id 
            OR ws.tuesday_shift_id = s.shift_id
            OR ws.wednesday_shift_id = s.shift_id
            OR ws.thursday_shift_id = s.shift_id
            OR ws.friday_shift_id = s.shift_id
            OR ws.saturday_shift_id = s.shift_id
            OR ws.sunday_shift_id = s.shift_id
        ) as employees_assigned
      FROM hrm_shifts s
      ${whereClause}
      ORDER BY shift_name
    `;

    const result = await client.query(query, params);

    return NextResponse.json({
      shifts: result.rows,
      total: result.rows.length,
    });
  } catch (error: any) {
    console.error("Error fetching shifts:", error);
    return NextResponse.json(
      { error: "Failed to fetch shifts", details: error.message },
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
      shift_code,
      shift_name,
      shift_type,
      start_time,
      end_time,
      break_duration_minutes,
      is_overnight,
      late_grace_period,
      early_departure_grace_period,
      regular_pay_multiplier,
      overtime_pay_multiplier,
      description,
    } = body;

    if (!shift_code || !shift_name || !start_time || !end_time) {
      return NextResponse.json(
        { error: "Missing required fields: shift_code, shift_name, start_time, end_time" },
        { status: 400 }
      );
    }

    // Check if shift code already exists
    const checkQuery = `
      SELECT * FROM hrm_shifts WHERE shift_code = $1
    `;
    const checkResult = await client.query(checkQuery, [shift_code]);

    if (checkResult.rows.length > 0) {
      return NextResponse.json(
        { error: "Shift code already exists" },
        { status: 400 }
      );
    }

    // Insert shift (trigger will calculate work_hours)
    const insertQuery = `
      INSERT INTO hrm_shifts (
        shift_code, shift_name, shift_type,
        start_time, end_time, break_duration_minutes,
        is_overnight, late_grace_period, early_departure_grace_period,
        regular_pay_multiplier, overtime_pay_multiplier, description
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const result = await client.query(insertQuery, [
      shift_code,
      shift_name,
      shift_type || "regular",
      start_time,
      end_time,
      break_duration_minutes || 60,
      is_overnight || false,
      late_grace_period || 15,
      early_departure_grace_period || 15,
      regular_pay_multiplier || 1.0,
      overtime_pay_multiplier || 1.5,
      description || null,
    ]);

    return NextResponse.json({
      message: "Shift created successfully",
      shift: result.rows[0],
    }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating shift:", error);
    return NextResponse.json(
      { error: "Failed to create shift", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
