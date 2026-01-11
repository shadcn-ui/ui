import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

/**
 * GET /api/analytics/reports/executions
 * Get report execution history
 * 
 * Query parameters:
 * - report_template_id: Filter by report template
 * - status: Filter by status (running, completed, failed, cancelled)
 * - start_date: Filter executions from this date
 * - end_date: Filter executions to this date
 * - limit: Maximum number of results (default 50)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const report_template_id = searchParams.get('report_template_id');
    const status = searchParams.get('status');
    const start_date = searchParams.get('start_date');
    const end_date = searchParams.get('end_date');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = `
      SELECT 
        re.*,
        rt.report_name,
        rt.report_category,
        rt.report_format as default_format
      FROM report_executions re
      JOIN report_templates rt ON re.report_template_id = rt.id
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (report_template_id) {
      query += ` AND re.report_template_id = $${paramIndex}`;
      params.push(report_template_id);
      paramIndex++;
    }

    if (status) {
      query += ` AND re.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (start_date) {
      query += ` AND re.started_at >= $${paramIndex}`;
      params.push(start_date);
      paramIndex++;
    }

    if (end_date) {
      query += ` AND re.started_at <= $${paramIndex}`;
      params.push(end_date);
      paramIndex++;
    }

    query += ` ORDER BY re.started_at DESC LIMIT $${paramIndex}`;
    params.push(limit);

    const result = await pool.query(query, params);

    // Calculate summary statistics
    const summaryQuery = `
      SELECT 
        COUNT(*) as total_executions,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
        COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed,
        COUNT(CASE WHEN status = 'running' THEN 1 END) as running,
        AVG(CASE WHEN status = 'completed' THEN duration_seconds END) as avg_duration_seconds,
        SUM(CASE WHEN status = 'completed' THEN rows_returned ELSE 0 END) as total_rows_returned
      FROM report_executions
      WHERE started_at >= CURRENT_DATE - INTERVAL '30 days'
    `;

    const summaryResult = await pool.query(summaryQuery);

    return NextResponse.json({
      success: true,
      count: result.rows.length,
      executions: result.rows,
      summary: summaryResult.rows[0]
    });

  } catch (error: any) {
    console.error('Error fetching report executions:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
