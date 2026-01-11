import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

/**
 * POST /api/analytics/kpis/calculate
 * Calculate KPI values for a specific date or date range
 * 
 * Request body:
 * - kpi_ids: Array of KPI IDs to calculate (optional, defaults to all active)
 * - start_date: Start date for calculation (defaults to today)
 * - end_date: End date for calculation (defaults to start_date)
 * - dimensions: Object with dimensional filters (product_id, customer_id, etc.)
 */
export async function POST(request: Request) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const body = await request.json();
    const {
      kpi_ids,
      start_date = new Date().toISOString().split('T')[0],
      end_date = start_date,
      dimensions = {}
    } = body;

    // Get KPIs to calculate
    let kpiQuery = 'SELECT * FROM kpi_definitions WHERE is_active = true';
    const params: any[] = [];
    
    if (kpi_ids && kpi_ids.length > 0) {
      kpiQuery += ' AND id = ANY($1)';
      params.push(kpi_ids);
    }

    const kpisResult = await client.query(kpiQuery, params);
    const kpis = kpisResult.rows;

    if (kpis.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No active KPIs found' },
        { status: 404 }
      );
    }

    const calculatedMetrics = [];
    const alerts = [];

    // Calculate each KPI
    for (const kpi of kpis) {
      try {
        // Parse calculation method and execute
        let calculationQuery = kpi.calculation_method;
        
        // Replace date placeholders
        calculationQuery = calculationQuery.replace(/:date/g, `'${start_date}'`);
        calculationQuery = calculationQuery.replace(/:start_date/g, `'${start_date}'`);
        calculationQuery = calculationQuery.replace(/:end_date/g, `'${end_date}'`);

        // Execute calculation
        const calcResult = await client.query(`SELECT (${calculationQuery}) as metric_value`);
        const metric_value = calcResult.rows[0]?.metric_value || 0;

        // Calculate variance
        const target_value = kpi.target_value || 0;
        const variance = metric_value - target_value;
        const variance_percent = target_value !== 0 ? (variance / target_value) * 100 : 0;

        // Determine status based on thresholds
        let status = 'neutral';
        if (kpi.green_threshold !== null && kpi.yellow_threshold !== null && kpi.red_threshold !== null) {
          if (kpi.target_operator === '>=') {
            if (metric_value >= kpi.green_threshold) status = 'green';
            else if (metric_value >= kpi.yellow_threshold) status = 'yellow';
            else status = 'red';
          } else if (kpi.target_operator === '<=') {
            if (metric_value <= kpi.green_threshold) status = 'green';
            else if (metric_value <= kpi.yellow_threshold) status = 'yellow';
            else status = 'red';
          } else if (kpi.target_operator === '>') {
            if (metric_value > kpi.green_threshold) status = 'green';
            else if (metric_value > kpi.yellow_threshold) status = 'yellow';
            else status = 'red';
          } else if (kpi.target_operator === '<') {
            if (metric_value < kpi.green_threshold) status = 'green';
            else if (metric_value < kpi.yellow_threshold) status = 'yellow';
            else status = 'red';
          }
        }

        // Insert or update metric
        const insertQuery = `
          INSERT INTO kpi_metrics (
            kpi_id, metric_date, metric_value, target_value,
            variance, variance_percent, status,
            dimension_product_id, dimension_customer_id,
            dimension_supplier_id, dimension_location_id,
            dimension_department, dimension_category, dimension_region,
            calculated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, CURRENT_TIMESTAMP)
          ON CONFLICT (kpi_id, metric_date, dimension_product_id, dimension_customer_id, 
                       dimension_supplier_id, dimension_location_id, dimension_department)
          DO UPDATE SET
            metric_value = EXCLUDED.metric_value,
            target_value = EXCLUDED.target_value,
            variance = EXCLUDED.variance,
            variance_percent = EXCLUDED.variance_percent,
            status = EXCLUDED.status,
            calculated_at = CURRENT_TIMESTAMP
          RETURNING *
        `;

        const metricResult = await client.query(insertQuery, [
          kpi.id,
          start_date,
          metric_value,
          target_value,
          variance,
          variance_percent,
          status,
          dimensions.product_id || null,
          dimensions.customer_id || null,
          dimensions.supplier_id || null,
          dimensions.location_id || null,
          dimensions.department || null,
          dimensions.category || null,
          dimensions.region || null
        ]);

        calculatedMetrics.push(metricResult.rows[0]);

        // Create alert if threshold breached
        if (status === 'red' || status === 'yellow') {
          const severity = status === 'red' ? 'critical' : 'warning';
          const alertMessage = `KPI "${kpi.kpi_name}" is ${status.toUpperCase()}: ${metric_value} ${kpi.unit_of_measure} (Target: ${target_value})`;

          const alertQuery = `
            INSERT INTO kpi_alerts (
              kpi_id, metric_id, alert_type, severity,
              alert_message, alert_date, metric_value, threshold_value
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
          `;

          const alertResult = await client.query(alertQuery, [
            kpi.id,
            metricResult.rows[0].id,
            'threshold_breach',
            severity,
            alertMessage,
            start_date,
            metric_value,
            status === 'red' ? kpi.red_threshold : kpi.yellow_threshold
          ]);

          alerts.push(alertResult.rows[0]);
        }

      } catch (kpiError: any) {
        console.error(`Error calculating KPI ${kpi.kpi_code}:`, kpiError);
        // Continue with other KPIs
      }
    }

    await client.query('COMMIT');

    return NextResponse.json({
      success: true,
      message: `Calculated ${calculatedMetrics.length} KPI metrics`,
      metrics: calculatedMetrics,
      alerts: alerts,
      summary: {
        total_calculated: calculatedMetrics.length,
        green: calculatedMetrics.filter(m => m.status === 'green').length,
        yellow: calculatedMetrics.filter(m => m.status === 'yellow').length,
        red: calculatedMetrics.filter(m => m.status === 'red').length,
        alerts_generated: alerts.length
      }
    });

  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error calculating KPIs:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
