import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * GET /api/analytics/forecasts/[id]/accuracy
 * Get forecast accuracy metrics by comparing predictions with actual values
 * 
 * Query parameters:
 * - start_date: Start date for accuracy analysis
 * - end_date: End date for accuracy analysis
 */
export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    
    const start_date = searchParams.get('start_date') || 
      new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const end_date = searchParams.get('end_date') || 
      new Date().toISOString().split('T')[0];

    // Get forecast model
    const modelQuery = 'SELECT * FROM forecast_models WHERE id = $1';
    const modelResult = await pool.query(modelQuery, [id]);

    if (modelResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Forecast model not found' },
        { status: 404 }
      );
    }

    const model = modelResult.rows[0];

    // Get forecasts with actual values
    const accuracyQuery = `
      SELECT 
        forecast_date,
        forecast_value,
        actual_value,
        forecast_error,
        forecast_accuracy_percent,
        confidence_interval_lower,
        confidence_interval_upper,
        dimension_product_id,
        dimension_customer_id
      FROM forecast_results
      WHERE model_id = $1
        AND forecast_date BETWEEN $2 AND $3
        AND actual_value IS NOT NULL
      ORDER BY forecast_date ASC
    `;

    const accuracyResult = await pool.query(accuracyQuery, [id, start_date, end_date]);
    const forecasts = accuracyResult.rows;

    if (forecasts.length === 0) {
      return NextResponse.json({
        success: true,
        model: {
          id: model.id,
          model_code: model.model_code,
          model_name: model.model_name,
          model_type: model.model_type
        },
        message: 'No actual values available for accuracy calculation',
        forecasts: [],
        accuracy_metrics: null
      });
    }

    // Calculate accuracy metrics
    const errors = forecasts.map(f => parseFloat(f.forecast_error) || 0);
    const absoluteErrors = errors.map(e => Math.abs(e));
    const squaredErrors = errors.map(e => e * e);
    const percentErrors = forecasts.map(f => {
      const actual = parseFloat(f.actual_value);
      const error = parseFloat(f.forecast_error);
      return actual !== 0 ? Math.abs(error / actual) * 100 : 0;
    });

    // Mean Absolute Error
    const mae = absoluteErrors.reduce((a, b) => a + b, 0) / absoluteErrors.length;

    // Mean Absolute Percentage Error
    const mape = percentErrors.reduce((a, b) => a + b, 0) / percentErrors.length;

    // Root Mean Square Error
    const rmse = Math.sqrt(squaredErrors.reduce((a, b) => a + b, 0) / squaredErrors.length);

    // R-squared
    const actualValues = forecasts.map(f => parseFloat(f.actual_value));
    const meanActual = actualValues.reduce((a, b) => a + b, 0) / actualValues.length;
    const totalSS = actualValues.reduce((sum, val) => sum + Math.pow(val - meanActual, 2), 0);
    const residualSS = squaredErrors.reduce((a, b) => a + b, 0);
    const rSquared = 1 - (residualSS / totalSS);

    // Forecast bias
    const bias = errors.reduce((a, b) => a + b, 0) / errors.length;

    // Count forecasts within confidence interval
    const withinInterval = forecasts.filter(f => {
      const actual = parseFloat(f.actual_value);
      const lower = parseFloat(f.confidence_interval_lower);
      const upper = parseFloat(f.confidence_interval_upper);
      return actual >= lower && actual <= upper;
    }).length;

    const intervalCoverage = (withinInterval / forecasts.length) * 100;

    // Update model with accuracy metrics
    await pool.query(
      `UPDATE forecast_models 
       SET accuracy_mae = $1,
           accuracy_mape = $2,
           accuracy_rmse = $3,
           r_squared = $4
       WHERE id = $5`,
      [mae, mape, rmse, rSquared, id]
    );

    return NextResponse.json({
      success: true,
      model: {
        id: model.id,
        model_code: model.model_code,
        model_name: model.model_name,
        model_type: model.model_type,
        forecast_category: model.forecast_category
      },
      date_range: {
        start_date,
        end_date,
        data_points: forecasts.length
      },
      accuracy_metrics: {
        mae: Math.round(mae * 100) / 100,
        mape: Math.round(mape * 100) / 100,
        rmse: Math.round(rmse * 100) / 100,
        r_squared: Math.round(rSquared * 10000) / 10000,
        bias: Math.round(bias * 100) / 100,
        confidence_interval_coverage: Math.round(intervalCoverage * 100) / 100
      },
      forecasts: forecasts,
      interpretation: {
        overall_accuracy: mape < 10 ? 'Excellent' : mape < 20 ? 'Good' : mape < 30 ? 'Fair' : 'Poor',
        bias_direction: bias > 1 ? 'Over-forecasting' : bias < -1 ? 'Under-forecasting' : 'Minimal bias',
        confidence_quality: intervalCoverage > 90 ? 'High' : intervalCoverage > 80 ? 'Moderate' : 'Low'
      }
    });

  } catch (error: any) {
    console.error('Error calculating forecast accuracy:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
