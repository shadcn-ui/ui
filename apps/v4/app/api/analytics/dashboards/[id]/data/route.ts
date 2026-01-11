import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * GET /api/analytics/dashboards/[id]/data
 * Get real-time data for all widgets in a dashboard
 * 
 * Query parameters:
 * - start_date: Start date for time-based queries (defaults to 30 days ago)
 * - end_date: End date for time-based queries (defaults to today)
 * - filters: Additional filters as JSON string
 */
export async function GET(
  request: Request,
  context: RouteContext
) {
  const client = await pool.connect();
  
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    
    const start_date = searchParams.get('start_date') || 
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const end_date = searchParams.get('end_date') || 
      new Date().toISOString().split('T')[0];
    const filters = searchParams.get('filters') ? JSON.parse(searchParams.get('filters')!) : {};

    // Get dashboard and widgets
    const dashboardQuery = `
      SELECT 
        d.*,
        (
          SELECT jsonb_agg(
            jsonb_build_object(
              'id', w.id,
              'widget_code', w.widget_code,
              'widget_name', w.widget_name,
              'widget_type', w.widget_type,
              'data_source_type', w.data_source_type,
              'kpi_id', w.kpi_id,
              'query_sql', w.query_sql,
              'api_endpoint', w.api_endpoint,
              'static_data', w.static_data,
              'widget_config', w.widget_config
            ) ORDER BY w.display_order
          )
          FROM dashboard_widgets w
          WHERE w.dashboard_id = d.id AND w.is_visible = true
        ) as widgets
      FROM dashboards d
      WHERE d.id = $1
    `;

    const dashboardResult = await client.query(dashboardQuery, [id]);

    if (dashboardResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Dashboard not found' },
        { status: 404 }
      );
    }

    const dashboard = dashboardResult.rows[0];
    const widgets = dashboard.widgets || [];

    // Fetch data for each widget
    const widgetDataPromises = widgets.map(async (widget: any) => {
      try {
        let data = null;

        switch (widget.data_source_type) {
          case 'kpi':
            if (widget.kpi_id) {
              // Fetch latest KPI metric
              const kpiQuery = `
                SELECT 
                  kd.kpi_name,
                  kd.unit_of_measure,
                  kd.target_value,
                  km.metric_value,
                  km.metric_date,
                  km.variance,
                  km.variance_percent,
                  km.status
                FROM kpi_metrics km
                JOIN kpi_definitions kd ON km.kpi_id = kd.id
                WHERE km.kpi_id = $1
                ORDER BY km.metric_date DESC, km.calculated_at DESC
                LIMIT 1
              `;
              const kpiResult = await client.query(kpiQuery, [widget.kpi_id]);
              data = kpiResult.rows[0] || null;
            }
            break;

          case 'query':
            if (widget.query_sql) {
              // Execute custom SQL query
              let query = widget.query_sql;
              // Replace date placeholders
              query = query.replace(/:start_date/g, `'${start_date}'`);
              query = query.replace(/:end_date/g, `'${end_date}'`);
              
              const queryResult = await client.query(query);
              data = queryResult.rows;
            }
            break;

          case 'static':
            data = widget.static_data;
            break;

          case 'api':
            // For API endpoints, return the endpoint URL
            // The frontend will fetch the data
            data = {
              endpoint: widget.api_endpoint,
              parameters: { start_date, end_date, ...filters }
            };
            break;

          default:
            data = null;
        }

        return {
          widget_id: widget.id,
          widget_code: widget.widget_code,
          widget_name: widget.widget_name,
          widget_type: widget.widget_type,
          data: data,
          config: widget.widget_config,
          timestamp: new Date().toISOString()
        };

      } catch (widgetError: any) {
        console.error(`Error fetching data for widget ${widget.widget_code}:`, widgetError);
        return {
          widget_id: widget.id,
          widget_code: widget.widget_code,
          widget_name: widget.widget_name,
          widget_type: widget.widget_type,
          data: null,
          error: widgetError.message,
          timestamp: new Date().toISOString()
        };
      }
    });

    const widgetData = await Promise.all(widgetDataPromises);

    // Log dashboard access
    try {
      await client.query(
        `INSERT INTO dashboard_access_log (dashboard_id, access_timestamp, filters_applied)
         VALUES ($1, CURRENT_TIMESTAMP, $2)`,
        [id, JSON.stringify(filters)]
      );
    } catch (logError) {
      // Non-critical error, continue
      console.error('Error logging dashboard access:', logError);
    }

    return NextResponse.json({
      success: true,
      dashboard: {
        id: dashboard.id,
        dashboard_name: dashboard.dashboard_name,
        dashboard_type: dashboard.dashboard_type,
        refresh_interval_seconds: dashboard.refresh_interval_seconds
      },
      date_range: {
        start_date,
        end_date
      },
      filters: filters,
      widgets: widgetData,
      generated_at: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

/**
 * POST /api/analytics/dashboards/[id]/data
 * Refresh/recalculate dashboard data (useful for triggering manual refresh)
 */
export async function POST(
  request: Request,
  context: RouteContext
) {
  // Same as GET but with explicit refresh action
  return GET(request, context);
}
