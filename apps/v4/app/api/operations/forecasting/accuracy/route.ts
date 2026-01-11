import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

/**
 * GET /api/operations/forecasting/accuracy
 * Calculate and return forecast accuracy metrics
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const forecastId = searchParams.get('forecast_id');
    const productId = searchParams.get('product_id');

    if (forecastId) {
      // Get accuracy for specific forecast
      const accuracyResult = await query(
        'SELECT * FROM calculate_forecast_accuracy($1)',
        [forecastId]
      );

      if (accuracyResult.rows.length === 0 || accuracyResult.rows[0].data_points === 0) {
        return NextResponse.json({
          forecast_id: forecastId,
          message: 'No actual data available yet to calculate accuracy',
          mae: null,
          mape: null,
          rmse: null,
          data_points: 0,
        });
      }

      const accuracy = accuracyResult.rows[0];

      // Get forecast info
      const forecastResult = await query(
        `SELECT 
          df.id,
          df.forecast_name,
          df.forecast_method,
          df.start_date,
          df.end_date,
          p.sku,
          p.name as product_name
         FROM demand_forecasts df
         JOIN products p ON p.id = df.product_id
         WHERE df.id = $1`,
        [forecastId]
      );

      if (forecastResult.rows.length === 0) {
        return NextResponse.json(
          { error: 'Forecast not found' },
          { status: 404 }
        );
      }

      const forecast = forecastResult.rows[0];

      // Get detailed comparison
      const detailsResult = await query(
        `SELECT 
          period_date,
          forecast_quantity,
          actual_quantity,
          ABS(forecast_quantity - actual_quantity) as absolute_error,
          CASE 
            WHEN actual_quantity > 0 THEN 
              ABS((forecast_quantity - actual_quantity) / actual_quantity * 100)
            ELSE NULL
          END as percentage_error
         FROM demand_forecast_details
         WHERE forecast_id = $1
         AND actual_quantity IS NOT NULL
         ORDER BY period_date`,
        [forecastId]
      );

      return NextResponse.json({
        forecast: {
          id: forecast.id,
          name: forecast.forecast_name,
          method: forecast.forecast_method,
          product: {
            sku: forecast.sku,
            name: forecast.product_name,
          },
          start_date: forecast.start_date,
          end_date: forecast.end_date,
        },
        accuracy: {
          mae: Math.round(Number(accuracy.mae || 0) * 100) / 100,
          mape: Math.round(Number(accuracy.mape || 0) * 100) / 100,
          rmse: Math.round(Number(accuracy.rmse || 0) * 100) / 100,
          data_points: Number(accuracy.data_points),
          interpretation: {
            mae: 'Mean Absolute Error - Average prediction error',
            mape: 'Mean Absolute Percentage Error - Average % error',
            rmse: 'Root Mean Square Error - Penalizes large errors',
          },
          rating: Number(accuracy.mape || 100) < 10 ? 'Excellent' :
                  Number(accuracy.mape || 100) < 20 ? 'Good' :
                  Number(accuracy.mape || 100) < 30 ? 'Fair' : 'Poor',
        },
        comparison: detailsResult.rows.map(row => ({
          date: row.period_date,
          forecast: Number(row.forecast_quantity),
          actual: Number(row.actual_quantity),
          absolute_error: Math.round(Number(row.absolute_error) * 100) / 100,
          percentage_error: row.percentage_error 
            ? Math.round(Number(row.percentage_error) * 100) / 100 
            : null,
        })),
      });
    }

    // Get accuracy for all forecasts of a product
    if (productId) {
      const result = await query(
        `SELECT 
          df.id,
          df.forecast_name,
          df.forecast_method,
          df.start_date,
          df.end_date,
          df.status,
          (SELECT COUNT(*) FROM demand_forecast_details WHERE forecast_id = df.id) as total_periods,
          (SELECT COUNT(*) FROM demand_forecast_details WHERE forecast_id = df.id AND actual_quantity IS NOT NULL) as actual_periods
         FROM demand_forecasts df
         WHERE df.product_id = $1
         ORDER BY df.created_at DESC`,
        [productId]
      );

      const forecastsWithAccuracy = [];

      for (const forecast of result.rows) {
        if (Number(forecast.actual_periods) > 0) {
          const accuracyResult = await query(
            'SELECT * FROM calculate_forecast_accuracy($1)',
            [forecast.id]
          );

          const accuracy = accuracyResult.rows[0];
          
          forecastsWithAccuracy.push({
            id: forecast.id,
            name: forecast.forecast_name,
            method: forecast.forecast_method,
            start_date: forecast.start_date,
            end_date: forecast.end_date,
            status: forecast.status,
            total_periods: Number(forecast.total_periods),
            actual_periods: Number(forecast.actual_periods),
            mae: Math.round(Number(accuracy?.mae || 0) * 100) / 100,
            mape: Math.round(Number(accuracy?.mape || 0) * 100) / 100,
            rmse: Math.round(Number(accuracy?.rmse || 0) * 100) / 100,
          });
        } else {
          forecastsWithAccuracy.push({
            id: forecast.id,
            name: forecast.forecast_name,
            method: forecast.forecast_method,
            start_date: forecast.start_date,
            end_date: forecast.end_date,
            status: forecast.status,
            total_periods: Number(forecast.total_periods),
            actual_periods: 0,
            mae: null,
            mape: null,
            rmse: null,
          });
        }
      }

      return NextResponse.json({
        product_id: productId,
        forecasts: forecastsWithAccuracy,
      });
    }

    return NextResponse.json(
      { error: 'Either forecast_id or product_id is required' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Forecast accuracy error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate forecast accuracy', details: error.message },
      { status: 500 }
    );
  }
}
