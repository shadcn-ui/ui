import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

/**
 * POST /api/analytics/forecasts/demand
 * Generate demand forecast for products
 * 
 * Request body:
 * - product_ids: Array of product IDs (optional, defaults to all active)
 * - forecast_horizon_days: Number of days to forecast (default 90)
 * - model_type: Statistical model to use (default 'moving_average')
 * - training_period_days: Historical data period (default 365)
 * - confidence_level: Confidence interval level (default 95)
 */
export async function POST(request: Request) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const body = await request.json();
    const {
      product_ids,
      forecast_horizon_days = 90,
      model_type = 'moving_average',
      training_period_days = 365,
      confidence_level = 95.0,
      customer_id,
      location_id
    } = body;

    // Get or create forecast model
    let modelQuery = `
      SELECT * FROM forecast_models 
      WHERE forecast_category = 'demand' 
        AND model_type = $1 
        AND is_active = true
      LIMIT 1
    `;
    
    let modelResult = await client.query(modelQuery, [model_type]);
    let model;

    if (modelResult.rows.length === 0) {
      // Create default model
      const createModelQuery = `
        INSERT INTO forecast_models (
          model_code, model_name, model_type, forecast_target,
          forecast_category, model_parameters, training_period_days,
          forecast_horizon_days
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;
      
      const newModel = await client.query(createModelQuery, [
        `demand_${model_type}_auto`,
        `Demand Forecast - ${model_type}`,
        model_type,
        'product_demand',
        'demand',
        JSON.stringify({ auto_created: true }),
        training_period_days,
        forecast_horizon_days
      ]);
      
      model = newModel.rows[0];
    } else {
      model = modelResult.rows[0];
    }

    // Get products to forecast
    let productsQuery = 'SELECT id, sku, name FROM products WHERE 1=1';
    const productParams: any[] = [];
    
    if (product_ids && product_ids.length > 0) {
      productsQuery += ' AND id = ANY($1)';
      productParams.push(product_ids);
    }
    
    const productsResult = await client.query(productsQuery, productParams);
    const products = productsResult.rows;

    const forecastResults = [];

    // Generate forecast for each product
    for (const product of products) {
      try {
        // Get historical sales data
        const historicalQuery = `
          SELECT 
            DATE(so.created_at) as sale_date,
            SUM(soi.quantity) as quantity_sold
          FROM sales_orders so
          JOIN sales_order_items soi ON so.id = soi.sales_order_id
          WHERE soi.product_code = $1
            AND so.status IN ('completed', 'shipped', 'delivered')
            AND so.created_at >= CURRENT_DATE - INTERVAL '${training_period_days} days'
          GROUP BY DATE(so.created_at)
          ORDER BY sale_date ASC
        `;

        const historicalResult = await client.query(historicalQuery, [product.sku]);
        const historicalData = historicalResult.rows;

        if (historicalData.length < 7) {
          // Not enough data, skip this product
          continue;
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
            forecast = calculateMovingAverage(historicalData, forecast_horizon_days, 7);
        }

        // Insert forecast results
        for (const forecastPoint of forecast) {
          const insertQuery = `
            INSERT INTO forecast_results (
              model_id, forecast_date, forecast_value,
              confidence_interval_lower, confidence_interval_upper,
              confidence_level, dimension_product_id,
              dimension_customer_id, dimension_location_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
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
            confidence_level,
            product.id,
            customer_id || null,
            location_id || null
          ]);

          forecastResults.push({
            product_id: product.id,
            product_sku: product.sku,
            product_name: product.name,
            ...result.rows[0]
          });
        }

      } catch (productError: any) {
        console.error(`Error forecasting for product ${product.sku}:`, productError);
        // Continue with other products
      }
    }

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
      message: `Generated ${forecastResults.length} demand forecasts`,
      model: {
        id: model.id,
        model_code: model.model_code,
        model_type: model.model_type
      },
      forecasts: forecastResults,
      summary: {
        products_forecasted: products.length,
        forecast_points: forecastResults.length,
        horizon_days: forecast_horizon_days
      }
    });

  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error generating demand forecast:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

/**
 * Moving Average forecast
 */
function calculateMovingAverage(
  historicalData: any[],
  horizon: number,
  window: number
): any[] {
  const quantities = historicalData.map(d => parseFloat(d.quantity_sold));
  const lastDate = new Date(historicalData[historicalData.length - 1].sale_date);
  
  // Calculate moving average from last 'window' days
  const recentData = quantities.slice(-window);
  const avgValue = recentData.reduce((a, b) => a + b, 0) / recentData.length;
  
  // Calculate standard deviation for confidence intervals
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

/**
 * Exponential Smoothing forecast
 */
function calculateExponentialSmoothing(
  historicalData: any[],
  horizon: number,
  alpha: number
): any[] {
  const quantities = historicalData.map(d => parseFloat(d.quantity_sold));
  const lastDate = new Date(historicalData[historicalData.length - 1].sale_date);
  
  // Calculate smoothed values
  let smoothed = quantities[0];
  for (let i = 1; i < quantities.length; i++) {
    smoothed = alpha * quantities[i] + (1 - alpha) * smoothed;
  }
  
  // Calculate standard deviation
  const errors = quantities.map((val, i) => {
    let s = quantities[0];
    for (let j = 1; j <= i; j++) {
      s = alpha * quantities[j] + (1 - alpha) * s;
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

/**
 * Linear Regression forecast
 */
function calculateLinearRegression(
  historicalData: any[],
  horizon: number
): any[] {
  const n = historicalData.length;
  const quantities = historicalData.map(d => parseFloat(d.quantity_sold));
  const lastDate = new Date(historicalData[historicalData.length - 1].sale_date);
  
  // Calculate linear regression (y = mx + b)
  const xSum = (n * (n - 1)) / 2;
  const ySum = quantities.reduce((a, b) => a + b, 0);
  const xySum = quantities.reduce((sum, y, x) => sum + x * y, 0);
  const xSquaredSum = (n * (n - 1) * (2 * n - 1)) / 6;
  
  const slope = (n * xySum - xSum * ySum) / (n * xSquaredSum - xSum * xSum);
  const intercept = (ySum - slope * xSum) / n;
  
  // Calculate residuals for confidence intervals
  const residuals = quantities.map((y, x) => y - (slope * x + intercept));
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
