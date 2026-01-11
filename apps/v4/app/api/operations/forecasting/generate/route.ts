import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

/**
 * GET /api/operations/forecasting/generate
 * Generate demand forecast using specified method
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get('product_id');
    const method = searchParams.get('method') || 'auto'; // auto, sma, es, lr
    const periods = parseInt(searchParams.get('periods') || '12');
    const forecastPeriods = parseInt(searchParams.get('forecast_periods') || '4');
    const alpha = parseFloat(searchParams.get('alpha') || '0.3');

    if (!productId) {
      return NextResponse.json(
        { error: 'Missing required parameter: product_id' },
        { status: 400 }
      );
    }

    let forecastResult;
    let selectedMethod = method;

    // Auto-select best method
    if (method === 'auto') {
      const autoSelectResult = await query(
        'SELECT * FROM auto_select_forecast_method($1, $2)',
        [productId, 6]
      );
      
      if (autoSelectResult.rows.length > 0) {
        const recommendation = autoSelectResult.rows[0];
        selectedMethod = recommendation.best_method.includes('Moving') ? 'sma' :
                        recommendation.best_method.includes('Exponential') ? 'es' : 'lr';
      } else {
        selectedMethod = 'sma'; // Default fallback
      }
    }

    // Generate forecast based on selected method
    switch (selectedMethod.toLowerCase()) {
      case 'sma':
        forecastResult = await query(
          'SELECT * FROM forecast_moving_average($1, $2, $3)',
          [productId, periods, forecastPeriods]
        );
        break;
      
      case 'es':
        forecastResult = await query(
          'SELECT * FROM forecast_exponential_smoothing($1, $2, $3)',
          [productId, alpha, forecastPeriods]
        );
        break;
      
      case 'lr':
        forecastResult = await query(
          'SELECT * FROM forecast_linear_regression($1, $2, $3)',
          [productId, periods, forecastPeriods]
        );
        break;
      
      default:
        return NextResponse.json(
          { error: 'Invalid forecasting method. Use: auto, sma, es, or lr' },
          { status: 400 }
        );
    }

    // Get product info
    const productResult = await query(
      'SELECT id, sku, name FROM products WHERE id = $1',
      [productId]
    );

    if (productResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const product = productResult.rows[0];

    // Get historical data for context
    const historicalResult = await query(
      `SELECT 
        period_date,
        actual_quantity,
        forecast_quantity
       FROM demand_forecast_details
       WHERE product_id = $1
       AND actual_quantity IS NOT NULL
       ORDER BY period_date DESC
       LIMIT $2`,
      [productId, periods]
    );

    return NextResponse.json({
      product: {
        id: product.id,
        sku: product.sku,
        name: product.name,
      },
      method_used: selectedMethod,
      method_name: forecastResult.rows[0]?.method || selectedMethod.toUpperCase(),
      parameters: {
        periods_analyzed: periods,
        forecast_periods: forecastPeriods,
        ...(selectedMethod === 'es' && { alpha }),
        ...(selectedMethod === 'lr' && forecastResult.rows[0] && {
          slope: Number(forecastResult.rows[0].slope || 0),
          intercept: Number(forecastResult.rows[0].intercept || 0),
        }),
      },
      forecast: forecastResult.rows.map(row => ({
        date: row.forecast_date,
        quantity: Math.round(Number(row.forecast_quantity || 0)),
      })),
      historical: historicalResult.rows.map(row => ({
        date: row.period_date,
        actual: Number(row.actual_quantity),
        forecast: row.forecast_quantity ? Number(row.forecast_quantity) : null,
      })),
      generated_at: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Forecast generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate forecast', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/operations/forecasting/generate
 * Generate and save forecast to database
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      product_id,
      forecast_name,
      method = 'auto',
      periods = 12,
      forecast_periods = 4,
      alpha = 0.3,
      created_by,
    } = body;

    if (!product_id) {
      return NextResponse.json(
        { error: 'Missing required field: product_id' },
        { status: 400 }
      );
    }

    // Generate forecast
    const searchParams = new URLSearchParams({
      product_id: product_id.toString(),
      method,
      periods: periods.toString(),
      forecast_periods: forecast_periods.toString(),
      alpha: alpha.toString(),
    });

    const generateResponse = await fetch(
      `${request.nextUrl.origin}/api/operations/forecasting/generate?${searchParams}`
    );
    
    if (!generateResponse.ok) {
      throw new Error('Failed to generate forecast');
    }

    const forecastData = await generateResponse.json();

    // Save forecast to database
    const forecastResult = await query(
      `INSERT INTO demand_forecasts (
        product_id,
        forecast_name,
        forecast_method,
        forecast_type,
        start_date,
        end_date,
        parameters,
        status,
        created_by
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'active', $8)
       RETURNING id, forecast_name, forecast_method, start_date, end_date, created_at`,
      [
        product_id,
        forecast_name || `Forecast ${new Date().toISOString().split('T')[0]}`,
        forecastData.method_name,
        'demand',
        forecastData.forecast[0].date,
        forecastData.forecast[forecastData.forecast.length - 1].date,
        JSON.stringify(forecastData.parameters),
        created_by,
      ]
    );

    const savedForecast = forecastResult.rows[0];

    // Save forecast details
    for (const item of forecastData.forecast) {
      await query(
        `INSERT INTO demand_forecast_details (
          forecast_id,
          product_id,
          period_date,
          forecast_quantity,
          confidence_lower,
          confidence_upper
         ) VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          savedForecast.id,
          product_id,
          item.date,
          item.quantity,
          Math.round(item.quantity * 0.8), // Simple confidence interval
          Math.round(item.quantity * 1.2),
        ]
      );
    }

    return NextResponse.json(
      {
        message: 'Forecast generated and saved successfully',
        forecast: {
          id: savedForecast.id,
          name: savedForecast.forecast_name,
          method: savedForecast.forecast_method,
          start_date: savedForecast.start_date,
          end_date: savedForecast.end_date,
          created_at: savedForecast.created_at,
        },
        forecast_points: forecastData.forecast.length,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Forecast save error:', error);
    return NextResponse.json(
      { error: 'Failed to save forecast', details: error.message },
      { status: 500 }
    );
  }
}
