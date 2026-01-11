import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

/**
 * GET /api/analytics/kpis
 * List all KPIs with their current values and status
 * 
 * Query parameters:
 * - category: Filter by KPI category (financial, sales, operations, etc.)
 * - is_active: Filter by active status (true/false)
 * - status: Filter by performance status (green, yellow, red)
 * - include_metrics: Include latest metric values (true/false)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const is_active = searchParams.get('is_active');
    const status = searchParams.get('status');
    const include_metrics = searchParams.get('include_metrics') === 'true';
    
    let query = `
      SELECT 
        kd.id,
        kd.kpi_code,
        kd.kpi_name,
        kd.kpi_category,
        kd.description,
        kd.unit_of_measure,
        kd.target_value,
        kd.target_operator,
        kd.green_threshold,
        kd.yellow_threshold,
        kd.red_threshold,
        kd.aggregation_level,
        kd.is_active,
        kd.refresh_frequency_minutes,
        kd.owner_id
    `;

    if (include_metrics) {
      query += `,
        (
          SELECT jsonb_build_object(
            'latest_value', km.metric_value,
            'latest_date', km.metric_date,
            'target_value', km.target_value,
            'variance', km.variance,
            'variance_percent', km.variance_percent,
            'status', km.status,
            'calculated_at', km.calculated_at
          )
          FROM kpi_metrics km
          WHERE km.kpi_id = kd.id
          ORDER BY km.metric_date DESC, km.calculated_at DESC
          LIMIT 1
        ) as latest_metric,
        (
          SELECT COUNT(*)
          FROM kpi_alerts ka
          WHERE ka.kpi_id = kd.id
            AND ka.is_resolved = false
        ) as active_alerts
      `;
    }

    query += `
      FROM kpi_definitions kd
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (category) {
      query += ` AND kd.kpi_category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (is_active !== null) {
      query += ` AND kd.is_active = $${paramIndex}`;
      params.push(is_active === 'true');
      paramIndex++;
    }

    // Filter by latest metric status if requested
    if (status && include_metrics) {
      query += `
        AND EXISTS (
          SELECT 1 FROM kpi_metrics km
          WHERE km.kpi_id = kd.id
            AND km.status = $${paramIndex}
          ORDER BY km.metric_date DESC
          LIMIT 1
        )
      `;
      params.push(status);
      paramIndex++;
    }

    query += ' ORDER BY kd.kpi_category, kd.kpi_name';

    const result = await pool.query(query, params);

    return NextResponse.json({
      success: true,
      count: result.rows.length,
      kpis: result.rows
    });

  } catch (error: any) {
    console.error('Error fetching KPIs:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/analytics/kpis
 * Create a new KPI definition
 */
export async function POST(request: Request) {
  const client = await pool.connect();
  
  try {
    const body = await request.json();
    const {
      kpi_code,
      kpi_name,
      kpi_category,
      description,
      calculation_method,
      data_source,
      unit_of_measure,
      target_value,
      target_operator,
      green_threshold,
      yellow_threshold,
      red_threshold,
      aggregation_level = 'daily',
      refresh_frequency_minutes = 60,
      owner_id,
      notes
    } = body;

    // Validate required fields
    if (!kpi_code || !kpi_name || !kpi_category || !calculation_method) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: kpi_code, kpi_name, kpi_category, calculation_method' },
        { status: 400 }
      );
    }

    // Check for duplicate kpi_code
    const checkQuery = 'SELECT id FROM kpi_definitions WHERE kpi_code = $1';
    const checkResult = await client.query(checkQuery, [kpi_code]);
    
    if (checkResult.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'KPI code already exists' },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO kpi_definitions (
        kpi_code, kpi_name, kpi_category, description,
        calculation_method, data_source, unit_of_measure,
        target_value, target_operator,
        green_threshold, yellow_threshold, red_threshold,
        aggregation_level, refresh_frequency_minutes,
        owner_id, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
    `;

    const values = [
      kpi_code, kpi_name, kpi_category, description,
      calculation_method, data_source, unit_of_measure,
      target_value, target_operator,
      green_threshold, yellow_threshold, red_threshold,
      aggregation_level, refresh_frequency_minutes,
      owner_id, notes
    ];

    const result = await client.query(query, values);

    return NextResponse.json({
      success: true,
      message: 'KPI created successfully',
      kpi: result.rows[0]
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating KPI:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
