import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/hrm/time-entries - List time clock entries
// POST /api/hrm/time-entries - Clock in/out
export async function GET(request: NextRequest) {
  const client = await pool.connect();

  try {
    const { searchParams } = new URL(request.url);
    const employee_id = searchParams.get("employee_id");
    const start_date = searchParams.get("start_date");
    const end_date = searchParams.get("end_date");
    const status = searchParams.get("status");
    const entry_type = searchParams.get("entry_type");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    let conditions = [];
    const params: any[] = [];
    let paramCount = 1;

    if (employee_id) {
      conditions.push(`te.employee_id = $${paramCount}`);
      params.push(employee_id);
      paramCount++;
    }

    if (start_date) {
      conditions.push(`te.entry_date >= $${paramCount}`);
      params.push(start_date);
      paramCount++;
    }

    if (end_date) {
      conditions.push(`te.entry_date <= $${paramCount}`);
      params.push(end_date);
      paramCount++;
    }

    if (status) {
      conditions.push(`te.status = $${paramCount}`);
      params.push(status);
      paramCount++;
    }

    if (entry_type) {
      conditions.push(`te.entry_type = $${paramCount}`);
      params.push(entry_type);
      paramCount++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM hrm_time_entries te
      ${whereClause}
    `;
    const countResult = await client.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);

    // Get time entries
    params.push(limit, offset);
    const entriesQuery = `
      SELECT 
        te.*,
        e.employee_number,
        e.first_name || ' ' || e.last_name as employee_name,
        d.department_name,
        s.shift_name,
        s.start_time as scheduled_start_time,
        s.end_time as scheduled_end_time,
        a.first_name || ' ' || a.last_name as approved_by_name
      FROM hrm_time_entries te
      LEFT JOIN hrm_employees e ON te.employee_id = e.employee_id
      LEFT JOIN hrm_departments d ON e.department_id = d.department_id
      LEFT JOIN hrm_shifts s ON te.shift_id = s.shift_id
      LEFT JOIN hrm_employees a ON te.approved_by = a.employee_id
      ${whereClause}
      ORDER BY te.entry_date DESC, te.clock_in_time DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    const result = await client.query(entriesQuery, params);

    // Get summary statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_entries,
        COUNT(CASE WHEN status = 'open' THEN 1 END) as open_count,
        COUNT(CASE WHEN status = 'closed' THEN 1 END) as closed_count,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_count,
        SUM(total_hours) as total_hours,
        SUM(regular_hours) as total_regular_hours,
        SUM(overtime_hours) as total_overtime_hours,
        AVG(total_hours) as avg_hours_per_entry
      FROM hrm_time_entries te
      ${whereClause}
    `;
    const statsResult = await client.query(statsQuery, params.slice(0, -2));

    return NextResponse.json({
      time_entries: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      statistics: statsResult.rows[0],
    });
  } catch (error: any) {
    console.error("Error fetching time entries:", error);
    return NextResponse.json(
      { error: "Failed to fetch time entries", details: error.message },
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
    const { employee_id, action } = body; // action: 'clock_in' or 'clock_out'

    if (!employee_id || !action) {
      return NextResponse.json(
        { error: "Missing required fields: employee_id, action" },
        { status: 400 }
      );
    }

    const now = new Date();
    const today = now.toISOString().split("T")[0];

    if (action === "clock_in") {
      // Check if already clocked in today
      const checkQuery = `
        SELECT * FROM hrm_time_entries
        WHERE employee_id = $1 
          AND entry_date = $2 
          AND status = 'open'
      `;
      const checkResult = await client.query(checkQuery, [employee_id, today]);

      if (checkResult.rows.length > 0) {
        return NextResponse.json(
          { error: "Already clocked in. Please clock out first." },
          { status: 400 }
        );
      }

      // Get employee's schedule for today
      const dayOfWeek = now.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
      const shiftQuery = `
        SELECT ${dayOfWeek}_shift_id as shift_id
        FROM hrm_work_schedules
        WHERE employee_id = $1 
          AND effective_date <= $2
          AND (end_date IS NULL OR end_date >= $2)
          AND is_active = true
        ORDER BY effective_date DESC
        LIMIT 1
      `;
      const shiftResult = await client.query(shiftQuery, [employee_id, today]);
      const shift_id = shiftResult.rows[0]?.shift_id || null;

      // Clock in
      const insertQuery = `
        INSERT INTO hrm_time_entries (
          employee_id, entry_date, clock_in_time, shift_id,
          entry_type, clock_in_location, is_remote,
          clock_in_device, clock_in_ip
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `;

      const result = await client.query(insertQuery, [
        employee_id,
        today,
        now,
        shift_id,
        body.entry_type || "regular",
        body.location || null,
        body.is_remote || false,
        body.device || null,
        body.ip_address || null,
      ]);

      return NextResponse.json({
        message: "Clocked in successfully",
        time_entry: result.rows[0],
      }, { status: 201 });

    } else if (action === "clock_out") {
      // Find open entry for today
      const findQuery = `
        SELECT * FROM hrm_time_entries
        WHERE employee_id = $1 
          AND entry_date = $2 
          AND status = 'open'
        ORDER BY clock_in_time DESC
        LIMIT 1
      `;
      const findResult = await client.query(findQuery, [employee_id, today]);

      if (findResult.rows.length === 0) {
        return NextResponse.json(
          { error: "No open clock-in entry found. Please clock in first." },
          { status: 400 }
        );
      }

      const entry = findResult.rows[0];

      // Clock out (trigger will calculate hours)
      const updateQuery = `
        UPDATE hrm_time_entries
        SET 
          clock_out_time = $1,
          clock_out_location = $2,
          clock_out_device = $3,
          clock_out_ip = $4,
          notes = $5
        WHERE entry_id = $6
        RETURNING *
      `;

      const result = await client.query(updateQuery, [
        now,
        body.location || null,
        body.device || null,
        body.ip_address || null,
        body.notes || null,
        entry.entry_id,
      ]);

      return NextResponse.json({
        message: "Clocked out successfully",
        time_entry: result.rows[0],
      });

    } else {
      return NextResponse.json(
        { error: "Invalid action. Must be 'clock_in' or 'clock_out'" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error processing time entry:", error);
    return NextResponse.json(
      { error: "Failed to process time entry", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
