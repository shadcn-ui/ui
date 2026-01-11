import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://mac@localhost:5432/ocean-erp',
});

// GET /api/quality/spc/charts/[id]/data - Get chart data with control limits
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const routeParams = await context.params;
    const chartId = parseInt(routeParams.id);
    const searchParams = request.nextUrl.searchParams;
    
    const periods = parseInt(searchParams.get('periods') || '30');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    if (isNaN(chartId)) {
      return NextResponse.json(
        { error: 'Invalid chart ID' },
        { status: 400 }
      );
    }

    // Fetch chart details
    const chartResult = await pool.query(`
      SELECT * FROM spc_charts WHERE id = $1
    `, [chartId]);

    if (chartResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'SPC chart not found' },
        { status: 404 }
      );
    }

    const chart = chartResult.rows[0];

    // Calculate control limits
    const limitsResult = await pool.query(`
      SELECT * FROM calculate_control_limits($1, $2)
    `, [chartId, periods]);

    const limits = limitsResult.rows[0] || {
      centerline: null,
      ucl: null,
      lcl: null,
      sigma: null,
    };

    // Update chart with calculated limits
    if (limits.ucl && limits.lcl) {
      await pool.query(`
        UPDATE spc_charts
        SET 
          ucl = $1,
          lcl = $2,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
      `, [limits.ucl, limits.lcl, chartId]);
    }

    // Fetch measurements
    let measurementQuery = `
      SELECT 
        sm.*,
        CASE WHEN sm.is_out_of_control THEN sm.violation_rules ELSE NULL END as rule_violations
      FROM spc_measurements sm
      WHERE sm.chart_id = $1
    `;
    
    const measurementParams: any[] = [chartId];
    let paramIndex = 2;

    if (startDate) {
      measurementQuery += ` AND sm.measured_at >= $${paramIndex}`;
      measurementParams.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      measurementQuery += ` AND sm.measured_at <= $${paramIndex}`;
      measurementParams.push(endDate);
      paramIndex++;
    }

    measurementQuery += ` ORDER BY sm.measured_at ASC LIMIT ${periods}`;

    const measurementsResult = await pool.query(measurementQuery, measurementParams);

    // Calculate process capability (Cpk)
    const cpkResult = await pool.query(`
      SELECT * FROM calculate_cpk($1, $2)
    `, [chartId, periods]);

    const cpk = cpkResult.rows[0] || null;

    return NextResponse.json({
      chart,
      control_limits: {
        centerline: limits.centerline,
        ucl: limits.ucl,
        lcl: limits.lcl,
        sigma: limits.sigma,
        usl: chart.usl,
        lsl: chart.lsl,
      },
      measurements: measurementsResult.rows,
      process_capability: cpk,
      statistics: {
        total_measurements: measurementsResult.rows.length,
        out_of_control_count: measurementsResult.rows.filter((m: any) => m.is_out_of_control).length,
      },
    });
  } catch (error: any) {
    console.error('Error fetching SPC chart data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SPC chart data', details: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/quality/spc/charts/[id]/data - Update chart settings
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const routeParams = await context.params;
    const chartId = parseInt(routeParams.id);
    const body = await request.json();

    if (isNaN(chartId)) {
      return NextResponse.json(
        { error: 'Invalid chart ID' },
        { status: 400 }
      );
    }

    const {
      target_value,
      usl,
      lsl,
      sample_size,
      is_active,
    } = body;

    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (target_value !== undefined) {
      updates.push(`target_value = $${paramIndex}`);
      params.push(target_value);
      paramIndex++;
    }
    if (usl !== undefined) {
      updates.push(`usl = $${paramIndex}`);
      params.push(usl);
      paramIndex++;
    }
    if (lsl !== undefined) {
      updates.push(`lsl = $${paramIndex}`);
      params.push(lsl);
      paramIndex++;
    }
    if (sample_size !== undefined) {
      updates.push(`sample_size = $${paramIndex}`);
      params.push(sample_size);
      paramIndex++;
    }
    if (is_active !== undefined) {
      updates.push(`is_active = $${paramIndex}`);
      params.push(is_active);
      paramIndex++;
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(chartId);

    const result = await pool.query(`
      UPDATE spc_charts
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `, params);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'SPC chart not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'SPC chart updated successfully',
      chart: result.rows[0],
    });
  } catch (error: any) {
    console.error('Error updating SPC chart:', error);
    return NextResponse.json(
      { error: 'Failed to update SPC chart', details: error.message },
      { status: 500 }
    );
  }
}
