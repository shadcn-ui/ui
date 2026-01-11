import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://mac@localhost:5432/ocean-erp',
});

// POST /api/quality/spc/measurements - Add SPC measurement
export async function POST(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const body = await request.json();
    
    const {
      chart_id,
      measured_value,
      sample_values,
      work_order_id,
      operator_id,
      measured_by,
      notes,
    } = body;

    if (!chart_id || measured_value === undefined || !measured_by) {
      return NextResponse.json(
        { error: 'Missing required fields (chart_id, measured_value, measured_by)' },
        { status: 400 }
      );
    }

    await client.query('BEGIN');

    // Fetch chart to determine calculation method
    const chartResult = await client.query(`
      SELECT * FROM spc_charts WHERE id = $1
    `, [chart_id]);

    if (chartResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json(
        { error: 'SPC chart not found' },
        { status: 404 }
      );
    }

    const chart = chartResult.rows[0];

    // Calculate sample statistics if sample_values provided
    let sampleMean = measured_value;
    let sampleRange = null;

    if (sample_values && Array.isArray(sample_values) && sample_values.length > 0) {
      sampleMean = sample_values.reduce((sum: number, val: number) => sum + val, 0) / sample_values.length;
      const max = Math.max(...sample_values);
      const min = Math.min(...sample_values);
      sampleRange = max - min;
    }

    // Insert measurement
    const measurementResult = await client.query(`
      INSERT INTO spc_measurements (
        chart_id,
        measured_value,
        sample_values,
        sample_mean,
        sample_range,
        work_order_id,
        operator_id,
        measured_by,
        notes,
        measured_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
      RETURNING *
    `, [
      chart_id,
      measured_value,
      sample_values ? JSON.stringify(sample_values) : null,
      sampleMean,
      sampleRange,
      work_order_id,
      operator_id,
      measured_by,
      notes,
    ]);

    const measurement = measurementResult.rows[0];

    // Detect out-of-control conditions using database function
    const detectionResult = await client.query(`
      SELECT * FROM detect_out_of_control($1, $2)
    `, [chart_id, measurement.id]);

    const detection = detectionResult.rows[0];

    // Update measurement with detection results
    if (detection) {
      await client.query(`
        UPDATE spc_measurements
        SET 
          is_out_of_control = $1,
          violation_rules = $2,
          rule_descriptions = $3
        WHERE id = $4
      `, [
        detection.is_out_of_control,
        detection.violated_rules,
        detection.rule_descriptions,
        measurement.id,
      ]);
    }

    await client.query('COMMIT');

    // Fetch updated measurement
    const updatedMeasurement = await client.query(`
      SELECT * FROM spc_measurements WHERE id = $1
    `, [measurement.id]);

    return NextResponse.json({
      message: 'SPC measurement recorded successfully',
      measurement: updatedMeasurement.rows[0],
      out_of_control: detection?.is_out_of_control || false,
      violations: detection?.rule_descriptions || [],
    }, { status: 201 });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error recording SPC measurement:', error);
    return NextResponse.json(
      { error: 'Failed to record SPC measurement', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// GET /api/quality/spc/measurements - Get recent measurements
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const chartId = searchParams.get('chart_id');
    const outOfControl = searchParams.get('out_of_control') === 'true';
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const limit = parseInt(searchParams.get('limit') || '100');

    let query = `
      SELECT 
        sm.*,
        sc.chart_name,
        sc.chart_type,
        sc.characteristic_measured
      FROM spc_measurements sm
      JOIN spc_charts sc ON sc.id = sm.chart_id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramIndex = 1;

    if (chartId) {
      query += ` AND sm.chart_id = $${paramIndex}`;
      params.push(parseInt(chartId));
      paramIndex++;
    }

    if (outOfControl) {
      query += ` AND sm.is_out_of_control = true`;
    }

    if (startDate) {
      query += ` AND sm.measured_at >= $${paramIndex}`;
      params.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      query += ` AND sm.measured_at <= $${paramIndex}`;
      params.push(endDate);
      paramIndex++;
    }

    query += `
      ORDER BY sm.measured_at DESC
      LIMIT $${paramIndex}
    `;
    params.push(limit);

    const result = await pool.query(query, params);

    return NextResponse.json({
      measurements: result.rows,
      count: result.rows.length,
    });
  } catch (error: any) {
    console.error('Error fetching SPC measurements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SPC measurements', details: error.message },
      { status: 500 }
    );
  }
}
