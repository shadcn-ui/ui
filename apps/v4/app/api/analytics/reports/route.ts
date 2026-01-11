import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

/**
 * GET /api/analytics/reports
 * List all report templates
 * 
 * Query parameters:
 * - report_category: Filter by category (financial, sales, operations, etc.)
 * - is_active: Filter by active status (true/false)
 * - is_scheduled: Filter by scheduled reports (true/false)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const report_category = searchParams.get('report_category');
    const is_active = searchParams.get('is_active');
    const is_scheduled = searchParams.get('is_scheduled');

    let query = `
      SELECT 
        rt.*,
        (
          SELECT COUNT(*) FROM report_schedules rs
          WHERE rs.report_template_id = rt.id AND rs.is_active = true
        ) as active_schedules,
        (
          SELECT COUNT(*) FROM report_executions re
          WHERE re.report_template_id = rt.id
            AND re.started_at >= CURRENT_DATE - INTERVAL '30 days'
        ) as executions_last_30_days
      FROM report_templates rt
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (report_category) {
      query += ` AND rt.report_category = $${paramIndex}`;
      params.push(report_category);
      paramIndex++;
    }

    if (is_active !== null) {
      query += ` AND rt.is_active = $${paramIndex}`;
      params.push(is_active === 'true');
      paramIndex++;
    }

    if (is_scheduled !== null) {
      query += ` AND rt.is_scheduled = $${paramIndex}`;
      params.push(is_scheduled === 'true');
      paramIndex++;
    }

    query += ' ORDER BY rt.report_category, rt.report_name';

    const result = await pool.query(query, params);

    return NextResponse.json({
      success: true,
      count: result.rows.length,
      reports: result.rows
    });

  } catch (error: any) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/analytics/reports
 * Create a new report template
 */
export async function POST(request: Request) {
  const client = await pool.connect();
  
  try {
    const body = await request.json();
    const {
      report_code,
      report_name,
      report_category,
      description,
      query_sql,
      report_format = 'pdf',
      parameters,
      default_parameters,
      template_layout,
      chart_configs,
      is_scheduled = false,
      is_public = false,
      owner_id,
      allowed_roles = []
    } = body;

    // Validate required fields
    if (!report_code || !report_name || !report_category || !query_sql) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: report_code, report_name, report_category, query_sql' },
        { status: 400 }
      );
    }

    // Check for duplicate report_code
    const checkQuery = 'SELECT id FROM report_templates WHERE report_code = $1';
    const checkResult = await client.query(checkQuery, [report_code]);
    
    if (checkResult.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Report code already exists' },
        { status: 400 }
      );
    }

    const insertQuery = `
      INSERT INTO report_templates (
        report_code, report_name, report_category, description,
        query_sql, report_format, parameters, default_parameters,
        template_layout, chart_configs, is_scheduled, is_public,
        owner_id, allowed_roles
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;

    const result = await client.query(insertQuery, [
      report_code, report_name, report_category, description,
      query_sql, report_format,
      parameters ? JSON.stringify(parameters) : null,
      default_parameters ? JSON.stringify(default_parameters) : null,
      template_layout ? JSON.stringify(template_layout) : null,
      chart_configs ? JSON.stringify(chart_configs) : null,
      is_scheduled, is_public, owner_id, allowed_roles
    ]);

    return NextResponse.json({
      success: true,
      message: 'Report template created successfully',
      report: result.rows[0]
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
