import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

/**
 * GET /api/analytics/forecasts/models
 * List all forecasting models
 * 
 * Query parameters:
 * - forecast_category: Filter by category (demand, revenue, inventory, cost, churn, quality)
 * - is_active: Filter by active status (true/false)
 * - model_type: Filter by model type
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const forecast_category = searchParams.get('forecast_category');
    const is_active = searchParams.get('is_active');
    const model_type = searchParams.get('model_type');

    let query = `
      SELECT 
        fm.*,
        (
          SELECT COUNT(*) FROM forecast_results fr
          WHERE fr.model_id = fm.id
            AND fr.forecast_date >= CURRENT_DATE
        ) as active_forecasts,
        (
          SELECT COUNT(*) FROM forecast_results fr
          WHERE fr.model_id = fm.id
            AND fr.forecast_date < CURRENT_DATE
            AND fr.actual_value IS NOT NULL
        ) as verified_forecasts
      FROM forecast_models fm
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (forecast_category) {
      query += ` AND fm.forecast_category = $${paramIndex}`;
      params.push(forecast_category);
      paramIndex++;
    }

    if (is_active !== null) {
      query += ` AND fm.is_active = $${paramIndex}`;
      params.push(is_active === 'true');
      paramIndex++;
    }

    if (model_type) {
      query += ` AND fm.model_type = $${paramIndex}`;
      params.push(model_type);
      paramIndex++;
    }

    query += ' ORDER BY fm.forecast_category, fm.model_name';

    const result = await pool.query(query, params);

    return NextResponse.json({
      success: true,
      count: result.rows.length,
      models: result.rows
    });

  } catch (error: any) {
    console.error('Error fetching forecast models:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/analytics/forecasts/models
 * Create a new forecasting model
 */
export async function POST(request: Request) {
  const client = await pool.connect();
  
  try {
    const body = await request.json();
    const {
      model_code,
      model_name,
      model_type,
      forecast_target,
      forecast_category,
      model_parameters = {},
      training_data_source,
      training_period_days = 365,
      forecast_horizon_days = 90,
      is_auto_retrain = false,
      retrain_frequency_days = 30,
      owner_id
    } = body;

    // Validate required fields
    if (!model_code || !model_name || !model_type || !forecast_target || !forecast_category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check for duplicate model_code
    const checkQuery = 'SELECT id FROM forecast_models WHERE model_code = $1';
    const checkResult = await client.query(checkQuery, [model_code]);
    
    if (checkResult.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Model code already exists' },
        { status: 400 }
      );
    }

    const insertQuery = `
      INSERT INTO forecast_models (
        model_code, model_name, model_type, forecast_target,
        forecast_category, model_parameters, training_data_source,
        training_period_days, forecast_horizon_days,
        is_auto_retrain, retrain_frequency_days, owner_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const result = await client.query(insertQuery, [
      model_code, model_name, model_type, forecast_target,
      forecast_category, JSON.stringify(model_parameters), training_data_source,
      training_period_days, forecast_horizon_days,
      is_auto_retrain, retrain_frequency_days, owner_id
    ]);

    return NextResponse.json({
      success: true,
      message: 'Forecast model created successfully',
      model: result.rows[0]
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating forecast model:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
