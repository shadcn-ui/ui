import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/reports - List all reports or filter by category
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const userId = searchParams.get("user_id");
    const isPublic = searchParams.get("is_public");

    let query = `
      SELECT 
        rd.*,
        CONCAT(u.first_name, ' ', u.last_name) as created_by_name,
        (
          SELECT COUNT(*) FROM report_executions 
          WHERE report_id = rd.id
        ) as execution_count,
        (
          SELECT MAX(executed_at) FROM report_executions 
          WHERE report_id = rd.id
        ) as last_executed_at
      FROM report_definitions rd
      LEFT JOIN users u ON rd.created_by = u.id
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (category) {
      query += ` AND rd.category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (isPublic !== null) {
      query += ` AND rd.is_public = $${paramIndex}`;
      params.push(isPublic === 'true');
      paramIndex++;
    }

    query += ` ORDER BY rd.created_at DESC`;

    const result = await pool.query(query, params);

    // Get user's saved reports if user_id provided
    let savedReports = [];
    if (userId) {
      const savedResult = await pool.query(
        `SELECT report_id, saved_name, is_favorite 
         FROM user_saved_reports 
         WHERE user_id = $1`,
        [userId]
      );
      savedReports = savedResult.rows;
    }

    return NextResponse.json({
      success: true,
      reports: result.rows.map(report => ({
        ...report,
        is_saved: savedReports.some(s => s.report_id === report.id),
        is_favorite: savedReports.find(s => s.report_id === report.id)?.is_favorite || false,
      })),
    });
  } catch (error: any) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/reports - Create new custom report
export async function POST(request: NextRequest) {
  const client = await pool.connect();

  try {
    const body = await request.json();
    const {
      report_code,
      name,
      description,
      category,
      report_type,
      data_source,
      query_config,
      chart_config,
      parameters,
      output_formats,
      is_public,
      created_by,
    } = body;

    // Validation
    if (!report_code || !name || !report_type || !data_source || !query_config) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    await client.query("BEGIN");

    // Check if report code already exists
    const existing = await client.query(
      `SELECT id FROM report_definitions WHERE report_code = $1`,
      [report_code]
    );

    if (existing.rows.length > 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { success: false, error: "Report code already exists" },
        { status: 400 }
      );
    }

    const result = await client.query(
      `INSERT INTO report_definitions (
        report_code, name, description, category, report_type,
        data_source, query_config, chart_config, parameters,
        output_formats, is_public, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        report_code,
        name,
        description || null,
        category || 'other',
        report_type,
        data_source,
        JSON.stringify(query_config),
        chart_config ? JSON.stringify(chart_config) : null,
        parameters ? JSON.stringify(parameters) : null,
        output_formats || ['pdf', 'excel', 'csv'],
        is_public || false,
        created_by,
      ]
    );

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      report: result.rows[0],
      message: "Report created successfully",
    }, { status: 201 });

  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Error creating report:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
