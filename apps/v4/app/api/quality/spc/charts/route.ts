import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://mac@localhost:5432/ocean-erp',
});

// GET /api/quality/spc/charts - List SPC charts
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const chartType = searchParams.get('chart_type');
    const productId = searchParams.get('product_id');
    const processStep = searchParams.get('process_step');
    const isActive = searchParams.get('is_active');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = `
      SELECT 
        sc.*,
        COUNT(sm.id) AS measurement_count,
        COUNT(CASE WHEN sm.is_out_of_control = true THEN 1 END) AS out_of_control_count,
        MAX(sm.measured_at) AS last_measurement_date
      FROM spc_charts sc
      LEFT JOIN spc_measurements sm ON sm.chart_id = sc.id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramIndex = 1;

    if (chartType) {
      query += ` AND sc.chart_type = $${paramIndex}`;
      params.push(chartType);
      paramIndex++;
    }

    if (productId) {
      query += ` AND sc.product_id = $${paramIndex}`;
      params.push(parseInt(productId));
      paramIndex++;
    }

    if (processStep) {
      query += ` AND sc.process_step = $${paramIndex}`;
      params.push(processStep);
      paramIndex++;
    }

    if (isActive !== null) {
      query += ` AND sc.is_active = $${paramIndex}`;
      params.push(isActive === 'true');
      paramIndex++;
    }

    query += `
      GROUP BY sc.id
      ORDER BY sc.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    return NextResponse.json({
      charts: result.rows,
      pagination: {
        limit,
        offset,
      },
    });
  } catch (error: any) {
    console.error('Error fetching SPC charts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SPC charts', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/quality/spc/charts - Create new SPC chart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      chart_name,
      chart_type,
      characteristic_measured,
      unit_of_measure,
      product_id,
      process_step,
      target_value,
      usl, // Upper Specification Limit
      lsl, // Lower Specification Limit
      sample_size,
      created_by,
    } = body;

    if (!chart_name || !chart_type || !characteristic_measured || !created_by) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate chart type
    const validChartTypes = ['xbar_r', 'xbar_s', 'individuals', 'p_chart', 'c_chart', 'u_chart'];
    if (!validChartTypes.includes(chart_type)) {
      return NextResponse.json(
        { error: `Invalid chart_type. Must be one of: ${validChartTypes.join(', ')}` },
        { status: 400 }
      );
    }

    const result = await pool.query(`
      INSERT INTO spc_charts (
        chart_name,
        chart_type,
        characteristic_measured,
        unit_of_measure,
        product_id,
        process_step,
        target_value,
        usl,
        lsl,
        sample_size,
        is_active,
        created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true, $11)
      RETURNING *
    `, [
      chart_name,
      chart_type,
      characteristic_measured,
      unit_of_measure,
      product_id,
      process_step,
      target_value,
      usl,
      lsl,
      sample_size,
      created_by,
    ]);

    return NextResponse.json({
      message: 'SPC chart created successfully',
      chart: result.rows[0],
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating SPC chart:', error);
    return NextResponse.json(
      { error: 'Failed to create SPC chart', details: error.message },
      { status: 500 }
    );
  }
}
