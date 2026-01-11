import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * POST /api/analytics/kpis/[id]/alert
 * Configure or trigger alerts for a KPI
 * 
 * Request body:
 * - alert_type: 'threshold_breach', 'trend_change', 'anomaly', 'target_missed', 'target_achieved'
 * - severity: 'critical', 'warning', 'info'
 * - alert_message: Custom alert message
 * - notify_users: Array of user IDs to notify
 */
export async function POST(
  request: Request,
  context: RouteContext
) {
  const client = await pool.connect();
  
  try {
    const { id } = await context.params;
    const body = await request.json();
    const {
      alert_type = 'threshold_breach',
      severity,
      alert_message,
      notify_users = []
    } = body;

    // Validate required fields
    if (!severity || !alert_message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: severity, alert_message' },
        { status: 400 }
      );
    }

    // Get KPI and latest metric
    const kpiQuery = `
      SELECT 
        kd.*,
        (
          SELECT jsonb_build_object(
            'id', km.id,
            'metric_value', km.metric_value,
            'target_value', km.target_value,
            'metric_date', km.metric_date,
            'status', km.status
          )
          FROM kpi_metrics km
          WHERE km.kpi_id = kd.id
          ORDER BY km.metric_date DESC, km.calculated_at DESC
          LIMIT 1
        ) as latest_metric
      FROM kpi_definitions kd
      WHERE kd.id = $1
    `;

    const kpiResult = await client.query(kpiQuery, [id]);

    if (kpiResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'KPI not found' },
        { status: 404 }
      );
    }

    const kpi = kpiResult.rows[0];
    const latestMetric = kpi.latest_metric;

    if (!latestMetric) {
      return NextResponse.json(
        { success: false, error: 'No metric data available for this KPI' },
        { status: 400 }
      );
    }

    // Create alert
    const insertQuery = `
      INSERT INTO kpi_alerts (
        kpi_id, metric_id, alert_type, severity,
        alert_message, alert_date,
        metric_value, threshold_value,
        notified_users
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const threshold_value = latestMetric.status === 'red' 
      ? kpi.red_threshold 
      : kpi.yellow_threshold;

    const result = await client.query(insertQuery, [
      id,
      latestMetric.id,
      alert_type,
      severity,
      alert_message,
      latestMetric.metric_date,
      latestMetric.metric_value,
      threshold_value,
      notify_users
    ]);

    return NextResponse.json({
      success: true,
      message: 'Alert created successfully',
      alert: result.rows[0]
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating KPI alert:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

/**
 * GET /api/analytics/kpis/[id]/alert
 * Get all alerts for a specific KPI
 * 
 * Query parameters:
 * - is_resolved: Filter by resolution status (true/false)
 * - severity: Filter by severity (critical, warning, info)
 * - limit: Maximum number of alerts to return (default 50)
 */
export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    
    const is_resolved = searchParams.get('is_resolved');
    const severity = searchParams.get('severity');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = `
      SELECT 
        ka.*,
        kd.kpi_code,
        kd.kpi_name
      FROM kpi_alerts ka
      JOIN kpi_definitions kd ON ka.kpi_id = kd.id
      WHERE ka.kpi_id = $1
    `;

    const params: any[] = [id];
    let paramIndex = 2;

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

    query += ` ORDER BY ka.created_at DESC LIMIT $${paramIndex}`;
    params.push(limit);

    const result = await pool.query(query, params);

    return NextResponse.json({
      success: true,
      count: result.rows.length,
      alerts: result.rows
    });

  } catch (error: any) {
    console.error('Error fetching KPI alerts:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
