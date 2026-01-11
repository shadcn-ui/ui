import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

/**
 * GET /api/analytics/alerts
 * Get all KPI alerts across the system
 * 
 * Query parameters:
 * - is_resolved: Filter by resolution status (true/false)
 * - severity: Filter by severity (critical, warning, info)
 * - kpi_category: Filter by KPI category
 * - start_date: Filter alerts from this date
 * - end_date: Filter alerts to this date
 * - limit: Maximum number of alerts (default 100)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const is_resolved = searchParams.get('is_resolved');
    const severity = searchParams.get('severity');
    const kpi_category = searchParams.get('kpi_category');
    const start_date = searchParams.get('start_date');
    const end_date = searchParams.get('end_date');
    const limit = parseInt(searchParams.get('limit') || '100');

    let query = `
      SELECT 
        ka.*,
        kd.kpi_code,
        kd.kpi_name,
        kd.kpi_category,
        kd.unit_of_measure
      FROM kpi_alerts ka
      JOIN kpi_definitions kd ON ka.kpi_id = kd.id
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (is_resolved !== null) {
      query += ` AND ka.is_resolved = $${paramIndex}`;
      params.push(is_resolved === 'true');
      paramIndex++;
    }

    if (severity) {
      query += ` AND ka.severity = $${paramIndex}`;
      params.push(severity);
      paramIndex++;
    }

    if (kpi_category) {
      query += ` AND kd.kpi_category = $${paramIndex}`;
      params.push(kpi_category);
      paramIndex++;
    }

    if (start_date) {
      query += ` AND ka.alert_date >= $${paramIndex}`;
      params.push(start_date);
      paramIndex++;
    }

    if (end_date) {
      query += ` AND ka.alert_date <= $${paramIndex}`;
      params.push(end_date);
      paramIndex++;
    }

    query += ` ORDER BY ka.created_at DESC LIMIT $${paramIndex}`;
    params.push(limit);

    const result = await pool.query(query, params);

    // Get summary statistics
    const summaryQuery = `
      SELECT 
        COUNT(*) as total_alerts,
        COUNT(CASE WHEN is_resolved = false THEN 1 END) as active_alerts,
        COUNT(CASE WHEN is_resolved = true THEN 1 END) as resolved_alerts,
        COUNT(CASE WHEN severity = 'critical' AND is_resolved = false THEN 1 END) as critical_active,
        COUNT(CASE WHEN severity = 'warning' AND is_resolved = false THEN 1 END) as warning_active,
        COUNT(CASE WHEN severity = 'info' AND is_resolved = false THEN 1 END) as info_active
      FROM kpi_alerts
      WHERE 1=1
      ${is_resolved !== null ? `AND is_resolved = ${is_resolved === 'true'}` : ''}
      ${severity ? `AND severity = '${severity}'` : ''}
    `;

    const summaryResult = await pool.query(summaryQuery);

    return NextResponse.json({
      success: true,
      count: result.rows.length,
      alerts: result.rows,
      summary: summaryResult.rows[0]
    });

  } catch (error: any) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
