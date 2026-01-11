import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/reports/schedules - List scheduled reports
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reportId = searchParams.get("report_id");
    const isActive = searchParams.get("is_active");

    let query = `
      SELECT 
        rs.*,
        rd.name as report_name,
        rd.category as report_category,
        CONCAT(u.first_name, ' ', u.last_name) as created_by_name
      FROM report_schedules rs
      JOIN report_definitions rd ON rs.report_id = rd.id
      LEFT JOIN users u ON rs.created_by = u.id
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (reportId) {
      query += ` AND rs.report_id = $${paramIndex}`;
      params.push(parseInt(reportId));
      paramIndex++;
    }

    if (isActive !== null) {
      query += ` AND rs.is_active = $${paramIndex}`;
      params.push(isActive === 'true');
      paramIndex++;
    }

    query += ` ORDER BY rs.next_run_at ASC NULLS LAST`;

    const result = await pool.query(query, params);

    return NextResponse.json({
      success: true,
      schedules: result.rows,
    });
  } catch (error: any) {
    console.error("Error fetching report schedules:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/reports/schedules - Create scheduled report
export async function POST(request: NextRequest) {
  const client = await pool.connect();

  try {
    const body = await request.json();
    const {
      report_id,
      schedule_name,
      frequency,
      schedule_time,
      schedule_day,
      timezone,
      parameters,
      recipients,
      output_format,
      created_by,
    } = body;

    // Validation
    if (!report_id || !schedule_name || !frequency || !schedule_time) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    await client.query("BEGIN");

    // Calculate next run time
    const nextRunResult = await client.query(
      `SELECT calculate_next_run_time($1, $2, $3, NULL) as next_run`,
      [frequency, schedule_time, schedule_day || null]
    );

    const nextRunAt = nextRunResult.rows[0].next_run;

    const result = await client.query(
      `INSERT INTO report_schedules (
        report_id, schedule_name, frequency, schedule_time, schedule_day,
        timezone, parameters, recipients, output_format, next_run_at, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        report_id,
        schedule_name,
        frequency,
        schedule_time,
        schedule_day || null,
        timezone || 'Asia/Jakarta',
        parameters ? JSON.stringify(parameters) : null,
        recipients || [],
        output_format || 'pdf',
        nextRunAt,
        created_by,
      ]
    );

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      schedule: result.rows[0],
      message: "Report scheduled successfully",
    }, { status: 201 });

  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Error creating report schedule:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// PATCH /api/reports/schedules/[id] - Update schedule (toggle active, change frequency)
export async function PATCH(request: NextRequest) {
  const client = await pool.connect();

  try {
    const body = await request.json();
    const { id, is_active, frequency, schedule_time, schedule_day, recipients } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Schedule ID is required" },
        { status: 400 }
      );
    }

    await client.query("BEGIN");

    let updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (is_active !== undefined) {
      updates.push(`is_active = $${paramIndex}`);
      params.push(is_active);
      paramIndex++;
    }

    if (frequency) {
      updates.push(`frequency = $${paramIndex}`);
      params.push(frequency);
      paramIndex++;
    }

    if (schedule_time) {
      updates.push(`schedule_time = $${paramIndex}`);
      params.push(schedule_time);
      paramIndex++;
    }

    if (schedule_day) {
      updates.push(`schedule_day = $${paramIndex}`);
      params.push(schedule_day);
      paramIndex++;
    }

    if (recipients) {
      updates.push(`recipients = $${paramIndex}`);
      params.push(recipients);
      paramIndex++;
    }

    // Recalculate next run time if frequency or time changed
    if (frequency || schedule_time || schedule_day) {
      const scheduleData = await client.query(
        `SELECT frequency, schedule_time, schedule_day FROM report_schedules WHERE id = $1`,
        [id]
      );
      
      const nextRunResult = await client.query(
        `SELECT calculate_next_run_time($1, $2, $3, CURRENT_TIMESTAMP) as next_run`,
        [
          frequency || scheduleData.rows[0].frequency,
          schedule_time || scheduleData.rows[0].schedule_time,
          schedule_day || scheduleData.rows[0].schedule_day,
        ]
      );

      updates.push(`next_run_at = $${paramIndex}`);
      params.push(nextRunResult.rows[0].next_run);
      paramIndex++;
    }

    if (updates.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { success: false, error: "No updates provided" },
        { status: 400 }
      );
    }

    params.push(id);
    const result = await client.query(
      `UPDATE report_schedules 
       SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${paramIndex}
       RETURNING *`,
      params
    );

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      schedule: result.rows[0],
      message: "Schedule updated successfully",
    });

  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Error updating report schedule:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
