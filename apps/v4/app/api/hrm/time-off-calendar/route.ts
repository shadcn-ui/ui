import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/hrm/time-off-calendar - Get time-off calendar view
export async function GET(request: NextRequest) {
  const client = await pool.connect();

  try {
    const { searchParams } = new URL(request.url);
    const employee_id = searchParams.get("employee_id");
    const department_id = searchParams.get("department_id");
    const start_date = searchParams.get("start_date");
    const end_date = searchParams.get("end_date");
    const entry_type = searchParams.get("entry_type");

    if (!start_date || !end_date) {
      return NextResponse.json(
        { error: "Missing required fields: start_date, end_date" },
        { status: 400 }
      );
    }

    let conditions = ["toc.entry_date BETWEEN $1 AND $2"];
    const params: any[] = [start_date, end_date];
    let paramCount = 3;

    if (employee_id) {
      conditions.push(`toc.employee_id = $${paramCount}`);
      params.push(employee_id);
      paramCount++;
    }

    if (department_id) {
      conditions.push(`e.department_id = $${paramCount}`);
      params.push(department_id);
      paramCount++;
    }

    if (entry_type) {
      conditions.push(`toc.entry_type = $${paramCount}`);
      params.push(entry_type);
      paramCount++;
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`;

    const query = `
      SELECT 
        toc.*,
        e.employee_number,
        e.first_name || ' ' || e.last_name as employee_name,
        d.department_name,
        lt.leave_type_name,
        lt.leave_type_code,
        h.holiday_name,
        lr.request_number,
        lr.leave_reason
      FROM hrm_time_off_calendar toc
      LEFT JOIN hrm_employees e ON toc.employee_id = e.employee_id
      LEFT JOIN hrm_departments d ON e.department_id = d.department_id
      LEFT JOIN hrm_leave_requests lr ON toc.leave_request_id = lr.leave_request_id
      LEFT JOIN hrm_leave_types lt ON lr.leave_type_id = lt.leave_type_id
      LEFT JOIN hrm_holidays h ON toc.holiday_id = h.holiday_id
      ${whereClause}
      ORDER BY toc.entry_date, e.employee_number
    `;

    const result = await client.query(query, params);

    // Group by date for calendar view
    const groupedByDate: any = {};
    result.rows.forEach((entry) => {
      const dateKey = entry.entry_date.toISOString().split("T")[0];
      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = [];
      }
      groupedByDate[dateKey].push(entry);
    });

    // Get statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_entries,
        COUNT(CASE WHEN entry_type = 'leave' THEN 1 END) as leave_count,
        COUNT(CASE WHEN entry_type = 'holiday' THEN 1 END) as holiday_count,
        COUNT(CASE WHEN entry_type = 'absence' THEN 1 END) as absence_count,
        COUNT(CASE WHEN entry_type = 'remote_work' THEN 1 END) as remote_work_count,
        COUNT(DISTINCT employee_id) as employees_affected
      FROM hrm_time_off_calendar toc
      LEFT JOIN hrm_employees e ON toc.employee_id = e.employee_id
      ${whereClause}
    `;
    const statsResult = await client.query(statsQuery, params);

    return NextResponse.json({
      calendar_entries: result.rows,
      grouped_by_date: groupedByDate,
      statistics: statsResult.rows[0],
      date_range: {
        start: start_date,
        end: end_date,
      },
    });
  } catch (error: any) {
    console.error("Error fetching time-off calendar:", error);
    return NextResponse.json(
      { error: "Failed to fetch time-off calendar", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// POST /api/hrm/time-off-calendar - Manually add calendar entry
export async function POST(request: NextRequest) {
  const client = await pool.connect();

  try {
    const body = await request.json();
    const {
      employee_id,
      entry_date,
      entry_type,
      leave_request_id,
      holiday_id,
      status,
      notes,
    } = body;

    if (!employee_id || !entry_date || !entry_type) {
      return NextResponse.json(
        { error: "Missing required fields: employee_id, entry_date, entry_type" },
        { status: 400 }
      );
    }

    // Check if entry already exists
    const checkQuery = `
      SELECT * FROM hrm_time_off_calendar
      WHERE employee_id = $1 AND entry_date = $2 AND entry_type = $3
    `;
    const checkResult = await client.query(checkQuery, [employee_id, entry_date, entry_type]);

    if (checkResult.rows.length > 0) {
      return NextResponse.json(
        { error: "Calendar entry already exists for this date and type" },
        { status: 400 }
      );
    }

    // Insert calendar entry
    const insertQuery = `
      INSERT INTO hrm_time_off_calendar (
        employee_id, entry_date, entry_type,
        leave_request_id, holiday_id, status, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const result = await client.query(insertQuery, [
      employee_id,
      entry_date,
      entry_type,
      leave_request_id || null,
      holiday_id || null,
      status || "confirmed",
      notes || null,
    ]);

    return NextResponse.json({
      message: "Calendar entry created successfully",
      calendar_entry: result.rows[0],
    }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating calendar entry:", error);
    return NextResponse.json(
      { error: "Failed to create calendar entry", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
