import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * GET /api/analytics/kpis/[id]/history
 * Get historical trend data for a KPI
 * 
 * Query parameters:
 * - start_date: Start date for historical data (defaults to 30 days ago)
 * - end_date: End date for historical data (defaults to today)
 * - product_id: Filter by product dimension
 * - customer_id: Filter by customer dimension
 * - supplier_id: Filter by supplier dimension
 * - location_id: Filter by location dimension
 * - department: Filter by department dimension
 * - include_forecast: Include forecasted values (true/false)
 */
export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    
    const start_date = searchParams.get('start_date') || 
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const end_date = searchParams.get('end_date') || 
      new Date().toISOString().split('T')[0];
    const product_id = searchParams.get('product_id');
    const customer_id = searchParams.get('customer_id');
    const supplier_id = searchParams.get('supplier_id');
    const location_id = searchParams.get('location_id');
    const department = searchParams.get('department');
    const include_forecast = searchParams.get('include_forecast') === 'true';

    // Get KPI definition
    const kpiQuery = 'SELECT * FROM kpi_definitions WHERE id = $1';
    const kpiResult = await pool.query(kpiQuery, [id]);

    if (kpiResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'KPI not found' },
        { status: 404 }
      );
    }

    const kpi = kpiResult.rows[0];

    // Build metrics query
    let metricsQuery = `
      SELECT 
        metric_date,
        metric_value,
        target_value,
        variance,
        variance_percent,
        status,
        calculated_at
      FROM kpi_metrics
      WHERE kpi_id = $1
        AND metric_date BETWEEN $2 AND $3
    `;

    const params: any[] = [id, start_date, end_date];
    let paramIndex = 4;

    if (product_id) {
      metricsQuery += ` AND dimension_product_id = $${paramIndex}`;
      params.push(product_id);
      paramIndex++;
    }

    if (customer_id) {
      metricsQuery += ` AND dimension_customer_id = $${paramIndex}`;
      params.push(customer_id);
      paramIndex++;
    }

    if (supplier_id) {
      metricsQuery += ` AND dimension_supplier_id = $${paramIndex}`;
      params.push(supplier_id);
      paramIndex++;
    }

    if (location_id) {
      metricsQuery += ` AND dimension_location_id = $${paramIndex}`;
      params.push(location_id);
      paramIndex++;
    }

    if (department) {
      metricsQuery += ` AND dimension_department = $${paramIndex}`;
      params.push(department);
      paramIndex++;
    }

    metricsQuery += ' ORDER BY metric_date ASC';

    const metricsResult = await pool.query(metricsQuery, params);
    const metrics = metricsResult.rows;

    // Calculate trend statistics
    const values = metrics.map(m => parseFloat(m.metric_value));
    const avgValue = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    const minValue = values.length > 0 ? Math.min(...values) : 0;
    const maxValue = values.length > 0 ? Math.max(...values) : 0;
    
    // Calculate trend direction (linear regression slope)
    let trend = 'stable';
    if (values.length >= 2) {
      const n = values.length;
      const xSum = (n * (n - 1)) / 2; // Sum of 0,1,2,...,n-1
      const ySum = values.reduce((a, b) => a + b, 0);
      const xySum = values.reduce((sum, y, x) => sum + x * y, 0);
      const xSquaredSum = (n * (n - 1) * (2 * n - 1)) / 6;
      
      const slope = (n * xySum - xSum * ySum) / (n * xSquaredSum - xSum * xSum);
      
      if (slope > 0.01) trend = 'increasing';
      else if (slope < -0.01) trend = 'decreasing';
    }

    // Count status distribution
    const statusDistribution = {
      green: metrics.filter(m => m.status === 'green').length,
      yellow: metrics.filter(m => m.status === 'yellow').length,
      red: metrics.filter(m => m.status === 'red').length,
      neutral: metrics.filter(m => m.status === 'neutral').length
    };

    // Get forecast data if requested
    let forecast = null;
    if (include_forecast) {
      // Simple moving average forecast for next 7 days
      const recentValues = values.slice(-7); // Last 7 days
      const forecastValue = recentValues.length > 0 
        ? recentValues.reduce((a, b) => a + b, 0) / recentValues.length 
        : avgValue;
      
      const forecastDays = 7;
      const forecastData = [];
      const lastDate = new Date(end_date);
      
      for (let i = 1; i <= forecastDays; i++) {
        const forecastDate = new Date(lastDate);
        forecastDate.setDate(forecastDate.getDate() + i);
        
        forecastData.push({
          date: forecastDate.toISOString().split('T')[0],
          forecasted_value: forecastValue,
          confidence_interval_lower: forecastValue * 0.9,
          confidence_interval_upper: forecastValue * 1.1
        });
      }
      
      forecast = {
        method: 'moving_average',
        horizon_days: forecastDays,
        data: forecastData
      };
    }

    return NextResponse.json({
      success: true,
      kpi: {
        id: kpi.id,
        kpi_code: kpi.kpi_code,
        kpi_name: kpi.kpi_name,
        unit_of_measure: kpi.unit_of_measure,
        target_value: kpi.target_value
      },
      date_range: {
        start_date,
        end_date,
        days: metrics.length
      },
      metrics: metrics,
      statistics: {
        current_value: values[values.length - 1] || 0,
        average_value: avgValue,
        min_value: minValue,
        max_value: maxValue,
        trend: trend,
        status_distribution: statusDistribution
      },
      forecast: forecast
    });

  } catch (error: any) {
    console.error('Error fetching KPI history:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
