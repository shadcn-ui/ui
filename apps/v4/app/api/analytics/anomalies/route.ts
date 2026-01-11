import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

/**
 * GET /api/analytics/anomalies
 * List detected anomalies
 * 
 * Query parameters:
 * - is_resolved: Filter by resolution status (true/false)
 * - severity: Filter by severity (critical, high, medium, low)
 * - anomaly_type: Filter by type (spike, drop, outlier, missing_data, pattern_break, trend_change)
 * - start_date: Filter from this date
 * - end_date: Filter to this date
 * - limit: Maximum results (default 100)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const is_resolved = searchParams.get('is_resolved');
    const severity = searchParams.get('severity');
    const anomaly_type = searchParams.get('anomaly_type');
    const start_date = searchParams.get('start_date');
    const end_date = searchParams.get('end_date');
    const limit = parseInt(searchParams.get('limit') || '100');

    let query = `
      SELECT 
        da.*,
        adr.rule_name,
        adr.detection_method,
        adr.target_metric
      FROM detected_anomalies da
      JOIN anomaly_detection_rules adr ON da.rule_id = adr.id
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (is_resolved !== null) {
      query += ` AND da.is_resolved = $${paramIndex}`;
      params.push(is_resolved === 'true');
      paramIndex++;
    }

    if (severity) {
      query += ` AND da.severity = $${paramIndex}`;
      params.push(severity);
      paramIndex++;
    }

    if (anomaly_type) {
      query += ` AND da.anomaly_type = $${paramIndex}`;
      params.push(anomaly_type);
      paramIndex++;
    }

    if (start_date) {
      query += ` AND da.anomaly_date >= $${paramIndex}`;
      params.push(start_date);
      paramIndex++;
    }

    if (end_date) {
      query += ` AND da.anomaly_date <= $${paramIndex}`;
      params.push(end_date);
      paramIndex++;
    }

    query += ` ORDER BY da.detected_at DESC LIMIT $${paramIndex}`;
    params.push(limit);

    const result = await pool.query(query, params);

    // Get summary statistics
    const summaryQuery = `
      SELECT 
        COUNT(*) as total_anomalies,
        COUNT(CASE WHEN is_resolved = false THEN 1 END) as active_anomalies,
        COUNT(CASE WHEN severity = 'critical' AND is_resolved = false THEN 1 END) as critical_active,
        COUNT(CASE WHEN is_false_positive = true THEN 1 END) as false_positives,
        AVG(CASE WHEN is_investigated = true THEN 
          EXTRACT(EPOCH FROM (investigated_at - detected_at))/3600 
        END) as avg_investigation_time_hours
      FROM detected_anomalies
      WHERE detected_at >= CURRENT_DATE - INTERVAL '30 days'
    `;

    const summaryResult = await pool.query(summaryQuery);

    return NextResponse.json({
      success: true,
      count: result.rows.length,
      anomalies: result.rows,
      summary: summaryResult.rows[0]
    });

  } catch (error: any) {
    console.error('Error fetching anomalies:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
