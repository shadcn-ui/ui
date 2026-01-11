import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

/**
 * POST /api/analytics/forecasts/revenue
 * Generate revenue forecast
 * 
 * Request body:
 * - forecast_horizon_days: Number of days to forecast (default 90)
 * - model_type: Statistical model to use (default 'linear_regression')
 * - training_period_days: Historical data period (default 365)
 * - group_by: Grouping dimension (customer, product, category, location)
 */
export async function POST(request: Request) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const body = await request.json();
    const {
      forecast_horizon_days = 90,
      model_type = 'linear_regression',
      training_period_days = 365,
      group_by,
      confidence_level = 95.0
    } = body;

    // Get or create forecast model
    let modelQuery = `
      SELECT * FROM forecast_models 
      WHERE forecast_category = 'revenue' 
        AND model_type = $1 
        AND is_active = true
      LIMIT 1
    `;
    
    let modelResult = await client.query(modelQuery, [model_type]);
    let model;

    if (modelResult.rows.length === 0) {
      const createModelQuery = `
        INSERT INTO forecast_models (
          model_code, model_name, model_type, forecast_target,
          forecast_category, model_parameters, training_period_days,
          forecast_horizon_days
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;
      
      const newModel = await client.query(createModelQuery, [
        `revenue_${model_type}_auto`,
        `Revenue Forecast - ${model_type}`,
        model_type,
        'revenue',
        'revenue',
        JSON.stringify({ auto_created: true }),
        training_period_days,
        forecast_horizon_days
      ]);
      
      model = newModel.rows[0];
    } else {
      model = modelResult.rows[0];
    }

    // Get historical revenue data
    let historicalQuery = `
      SELECT 
        DATE(created_at) as revenue_date,
        SUM(total_amount) as revenue
    `;

    // Add grouping dimensions
    if (group_by === 'customer') {
      historicalQuery += `, customer_id`;
    } else if (group_by === 'product') {
      historicalQuery += `, (
        SELECT soi.product_code 
        FROM sales_order_items soi 
        WHERE soi.sales_order_id = sales_orders.id 
        LIMIT 1
      ) as product_code`;
    }

    historicalQuery += `
      FROM sales_orders
      WHERE status IN ('completed', 'shipped', 'delivered')
        AND created_at >= CURRENT_DATE - INTERVAL '${training_period_days} days'
      GROUP BY DATE(created_at)
    `;

    if (group_by === 'customer') {
      historicalQuery += `, customer_id`;
    } else if (group_by === 'product') {
      historicalQuery += `, product_code`;
    }

    historicalQuery += ' ORDER BY revenue_date ASC';

    const historicalResult = await client.query(historicalQuery);
    const historicalData = historicalResult.rows;

    if (historicalData.length < 7) {
      return NextResponse.json(
        { success: false, error: 'Insufficient historical data (minimum 7 days required)' },
        { status: 400 }
      );
    }

    // Calculate forecast based on model type
    let forecast;
    switch (model_type) {
      case 'moving_average':
        forecast = calculateMovingAverage(historicalData, forecast_horizon_days, 7);
        break;
      case 'exponential_smoothing':
        forecast = calculateExponentialSmoothing(historicalData, forecast_horizon_days, 0.3);
        break;
      case 'linear_regression':
        forecast = calculateLinearRegression(historicalData, forecast_horizon_days);
        break;
      default:
        forecast = calculateLinearRegression(historicalData, forecast_horizon_days);
    }

    // Insert forecast results
    const forecastResults = [];
    for (const forecastPoint of forecast) {
      const insertQuery = `
        INSERT INTO forecast_results (
          model_id, forecast_date, forecast_value,
          confidence_interval_lower, confidence_interval_upper,
          confidence_level
        ) VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (model_id, forecast_date, dimension_product_id, dimension_customer_id, dimension_location_id)
        DO UPDATE SET
          forecast_value = EXCLUDED.forecast_value,
          confidence_interval_lower = EXCLUDED.confidence_interval_lower,
          confidence_interval_upper = EXCLUDED.confidence_interval_upper
        RETURNING *
      `;

      const result = await client.query(insertQuery, [
        model.id,
        forecastPoint.date,
        forecastPoint.value,
        forecastPoint.lower,
        forecastPoint.upper,
        confidence_level
      ]);

      forecastResults.push(result.rows[0]);
    }

    // Calculate total forecasted revenue
    const totalForecastedRevenue = forecastResults.reduce(
      (sum, f) => sum + parseFloat(f.forecast_value), 
      0
    );

    // Update model training info
    await client.query(
      `UPDATE forecast_models 
       SET last_trained_at = CURRENT_TIMESTAMP,
           last_trained_records = $1
       WHERE id = $2`,
      [forecastResults.length, model.id]
    );

    await client.query('COMMIT');

    return NextResponse.json({
      success: true,
      message: `Generated revenue forecast for ${forecast_horizon_days} days`,
      model: {
        id: model.id,
        model_code: model.model_code,
        model_type: model.model_type
      },
      forecasts: forecastResults,
      summary: {
        forecast_horizon_days: forecast_horizon_days,
        total_forecasted_revenue: Math.round(totalForecastedRevenue * 100) / 100,
        avg_daily_revenue: Math.round((totalForecastedRevenue / forecast_horizon_days) * 100) / 100,
        data_points: forecastResults.length
      }
    });

  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error generating revenue forecast:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// Statistical functions (same as demand forecast)
function calculateMovingAverage(historicalData: any[], horizon: number, window: number): any[] {
  const revenues = historicalData.map(d => parseFloat(d.revenue));
  const lastDate = new Date(historicalData[historicalData.length - 1].revenue_date);
  
  const recentData = revenues.slice(-window);
  const avgValue = recentData.reduce((a, b) => a + b, 0) / recentData.length;
  const variance = recentData.reduce((sum, val) => sum + Math.pow(val - avgValue, 2), 0) / recentData.length;
  const stdDev = Math.sqrt(variance);
  
  const forecasts = [];
  for (let i = 1; i <= horizon; i++) {
    const forecastDate = new Date(lastDate);
    forecastDate.setDate(forecastDate.getDate() + i);
    
    forecasts.push({
      date: forecastDate.toISOString().split('T')[0],
      value: Math.round(avgValue * 100) / 100,
      lower: Math.max(0, Math.round((avgValue - 1.96 * stdDev) * 100) / 100),
      upper: Math.round((avgValue + 1.96 * stdDev) * 100) / 100
    });
  }
  
  return forecasts;
}

function calculateExponentialSmoothing(historicalData: any[], horizon: number, alpha: number): any[] {
  const revenues = historicalData.map(d => parseFloat(d.revenue));
  const lastDate = new Date(historicalData[historicalData.length - 1].revenue_date);
  
  let smoothed = revenues[0];
  for (let i = 1; i < revenues.length; i++) {
    smoothed = alpha * revenues[i] + (1 - alpha) * smoothed;
  }
  
  const errors = revenues.map((val, i) => {
    let s = revenues[0];
    for (let j = 1; j <= i; j++) {
      s = alpha * revenues[j] + (1 - alpha) * s;
    }
    return val - s;
  });
  
  const variance = errors.reduce((sum, err) => sum + err * err, 0) / errors.length;
  const stdDev = Math.sqrt(variance);
  
  const forecasts = [];
  for (let i = 1; i <= horizon; i++) {
    const forecastDate = new Date(lastDate);
    forecastDate.setDate(forecastDate.getDate() + i);
    
    forecasts.push({
      date: forecastDate.toISOString().split('T')[0],
      value: Math.round(smoothed * 100) / 100,
      lower: Math.max(0, Math.round((smoothed - 1.96 * stdDev) * 100) / 100),
      upper: Math.round((smoothed + 1.96 * stdDev) * 100) / 100
    });
  }
  
  return forecasts;
}

function calculateLinearRegression(historicalData: any[], horizon: number): any[] {
  const n = historicalData.length;
  const revenues = historicalData.map(d => parseFloat(d.revenue));
  const lastDate = new Date(historicalData[historicalData.length - 1].revenue_date);
  
  const xSum = (n * (n - 1)) / 2;
  const ySum = revenues.reduce((a, b) => a + b, 0);
  const xySum = revenues.reduce((sum, y, x) => sum + x * y, 0);
  const xSquaredSum = (n * (n - 1) * (2 * n - 1)) / 6;
  
  const slope = (n * xySum - xSum * ySum) / (n * xSquaredSum - xSum * xSum);
  const intercept = (ySum - slope * xSum) / n;
  
  const residuals = revenues.map((y, x) => y - (slope * x + intercept));
  const variance = residuals.reduce((sum, r) => sum + r * r, 0) / n;
  const stdDev = Math.sqrt(variance);
  
  const forecasts = [];
  for (let i = 1; i <= horizon; i++) {
    const forecastDate = new Date(lastDate);
    forecastDate.setDate(forecastDate.getDate() + i);
    
    const x = n + i - 1;
    const forecastValue = slope * x + intercept;
    
    forecasts.push({
      date: forecastDate.toISOString().split('T')[0],
      value: Math.max(0, Math.round(forecastValue * 100) / 100),
      lower: Math.max(0, Math.round((forecastValue - 1.96 * stdDev) * 100) / 100),
      upper: Math.round((forecastValue + 1.96 * stdDev) * 100) / 100
    });
  }
  
  return forecasts;
}
