import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/hrm/attendance - List attendance records
// POST /api/hrm/attendance - Mark attendance
export async function GET(request: NextRequest) {
  const client = await pool.connect();

  try {
    const { searchParams } = new URL(request.url);
    const employee_id = searchParams.get("employee_id");
    const department_id = searchParams.get("department_id");
    const start_date = searchParams.get("start_date");
    const end_date = searchParams.get("end_date");
    const status = searchParams.get("status");
    const work_location = searchParams.get("work_location");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    let conditions = [];
    const params: any[] = [];
    let paramCount = 1;

    if (employee_id) {
      conditions.push(`ar.employee_id = $${paramCount}`);
      params.push(employee_id);
      paramCount++;
    }

    if (department_id) {
      conditions.push(`e.department_id = $${paramCount}`);
      params.push(department_id);
      paramCount++;
    }

    if (start_date) {
      conditions.push(`ar.attendance_date >= $${paramCount}`);
      params.push(start_date);
      paramCount++;
    }

    if (end_date) {
      conditions.push(`ar.attendance_date <= $${paramCount}`);
      params.push(end_date);
      paramCount++;
    }

    if (status) {
      conditions.push(`ar.status = $${paramCount}`);
      params.push(status);
      paramCount++;
    }

    if (work_location) {
      conditions.push(`ar.work_location = $${paramCount}`);
      params.push(work_location);
      paramCount++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM hrm_attendance_records ar
      LEFT JOIN hrm_employees e ON ar.employee_id = e.employee_id
      ${whereClause}
    `;
    const countResult = await client.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);

    // Get attendance records
    params.push(limit, offset);
    const recordsQuery = `
      SELECT 
        ar.*,
        e.employee_number,
        e.first_name || ' ' || e.last_name as employee_name,
        d.department_name,
        s.shift_name,
        s.start_time as scheduled_start_time,
        s.end_time as scheduled_end_time,
        m.first_name || ' ' || m.last_name as marked_by_name,
        a.first_name || ' ' || a.last_name as approved_by_name
      FROM hrm_attendance_records ar
      LEFT JOIN hrm_employees e ON ar.employee_id = e.employee_id
      LEFT JOIN hrm_departments d ON e.department_id = d.department_id
      LEFT JOIN hrm_shifts s ON ar.shift_id = s.shift_id
      LEFT JOIN hrm_employees m ON ar.marked_by = m.employee_id
      LEFT JOIN hrm_employees a ON ar.approved_by = a.employee_id
      ${whereClause}
      ORDER BY ar.attendance_date DESC, e.employee_number
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    const result = await client.query(recordsQuery, params);

    // Get summary statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_records,
        COUNT(CASE WHEN status = 'present' THEN 1 END) as present_count,
        COUNT(CASE WHEN status = 'absent' THEN 1 END) as absent_count,
        COUNT(CASE WHEN status = 'late' THEN 1 END) as late_count,
        COUNT(CASE WHEN status = 'on_leave' THEN 1 END) as on_leave_count,
        COUNT(CASE WHEN status = 'remote' THEN 1 END) as remote_count,
        COUNT(CASE WHEN is_late = true THEN 1 END) as total_late,
        COUNT(CASE WHEN is_overtime = true THEN 1 END) as total_overtime,
        SUM(total_work_hours) as total_work_hours,
        AVG(total_work_hours) as avg_work_hours,
        SUM(late_by_minutes) as total_late_minutes,
        SUM(early_departure_minutes) as total_early_departure_minutes
      FROM hrm_attendance_records ar
      LEFT JOIN hrm_employees e ON ar.employee_id = e.employee_id
      ${whereClause}
    `;
    const statsResult = await client.query(statsQuery, params.slice(0, -2));

    return NextResponse.json({
      attendance_records: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      statistics: statsResult.rows[0],
    });
  } catch (error: any) {
    console.error("Error fetching attendance records:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendance records", details: error.message },
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
      attendance_date,
      status,
      shift_id,
      scheduled_in_time,
      actual_in_time,
      actual_out_time,
      work_location,
      notes,
      marked_by,
    } = body;

    if (!employee_id || !attendance_date || !status) {
      return NextResponse.json(
        { error: "Missing required fields: employee_id, attendance_date, status" },
        { status: 400 }
      );
    }

    // Check if attendance already exists
    const checkQuery = `
      SELECT * FROM hrm_attendance_records
      WHERE employee_id = $1 AND attendance_date = $2
    `;
    const checkResult = await client.query(checkQuery, [employee_id, attendance_date]);

    if (checkResult.rows.length > 0) {
      return NextResponse.json(
        { error: "Attendance already marked for this date" },
        { status: 400 }
      );
    }

    // Calculate late/early departure if times provided
    let late_by_minutes = null;
    let early_departure_minutes = null;
    let is_late = false;
    let is_early_departure = false;
    let total_work_hours = null;

    if (scheduled_in_time && actual_in_time) {
      const scheduledIn = new Date(`2000-01-01 ${scheduled_in_time}`);
      const actualIn = new Date(`2000-01-01 ${actual_in_time}`);
      const diffMs = actualIn.getTime() - scheduledIn.getTime();
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins > 0) {
        late_by_minutes = diffMins;
        is_late = true;
      }
    }

    if (actual_in_time && actual_out_time) {
      const actualIn = new Date(`2000-01-01 ${actual_in_time}`);
      const actualOut = new Date(`2000-01-01 ${actual_out_time}`);
      const diffMs = actualOut.getTime() - actualIn.getTime();
      total_work_hours = diffMs / (1000 * 60 * 60); // Convert to hours
    }

    // Insert attendance record
    const insertQuery = `
      INSERT INTO hrm_attendance_records (
        employee_id, attendance_date, status, shift_id,
        scheduled_in_time, scheduled_out_time,
        actual_in_time, actual_out_time,
        late_by_minutes, early_departure_minutes,
        total_work_hours, work_location,
        is_late, is_early_departure, notes, marked_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
    `;

    const result = await client.query(insertQuery, [
      employee_id,
      attendance_date,
      status,
      shift_id || null,
      scheduled_in_time || null,
      body.scheduled_out_time || null,
      actual_in_time || null,
      actual_out_time || null,
      late_by_minutes,
      early_departure_minutes,
      total_work_hours,
      work_location || "office",
      is_late,
      is_early_departure,
      notes || null,
      marked_by || null,
    ]);

    return NextResponse.json({
      message: "Attendance marked successfully",
      attendance_record: result.rows[0],
    }, { status: 201 });
  } catch (error: any) {
    console.error("Error marking attendance:", error);
    return NextResponse.json(
      { error: "Failed to mark attendance", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
