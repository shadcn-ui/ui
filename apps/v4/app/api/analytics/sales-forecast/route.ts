import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/analytics/sales-forecast - Simple sales forecasting using moving averages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30"); // Forecast period
    const historical = parseInt(searchParams.get("historical") || "90"); // Historical data period

    // Get historical sales data
    const historicalData = await pool.query(
      `SELECT 
        DATE(created_at) as date,
        COUNT(*) as order_count,
        SUM(total_amount) as total_sales
       FROM sales_orders
       WHERE created_at >= CURRENT_DATE - INTERVAL '${historical} days'
         AND status NOT IN ('cancelled', 'draft')
       GROUP BY DATE(created_at)
       ORDER BY date`
    );

    if (historicalData.rows.length < 7) {
      return NextResponse.json({
        success: false,
        error: "Insufficient historical data for forecasting (minimum 7 days required)",
      }, { status: 400 });
    }

    const sales = historicalData.rows;
    
    // Calculate moving average (simple forecasting)
    const windowSize = Math.min(14, Math.floor(sales.length / 2)); // 14-day moving average
    let forecast: any[] = [];

    // Calculate average daily sales
    const avgDailySales = sales.reduce((sum, s) => sum + parseFloat(s.total_sales), 0) / sales.length;
    const avgDailyOrders = sales.reduce((sum, s) => sum + parseInt(s.order_count), 0) / sales.length;

    // Detect trend (simple linear regression)
    const n = sales.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    
    sales.forEach((s, i) => {
      const x = i;
      const y = parseFloat(s.total_sales);
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Generate forecast
    const lastDate = new Date(sales[sales.length - 1].date);
    for (let i = 1; i <= days; i++) {
      const forecastDate = new Date(lastDate);
      forecastDate.setDate(forecastDate.getDate() + i);
      
      const trendValue = intercept + slope * (sales.length + i);
      const forecastValue = Math.max(0, trendValue);
      
      forecast.push({
        date: forecastDate.toISOString().split('T')[0],
        forecasted_sales: Math.round(forecastValue),
        forecasted_orders: Math.round(avgDailyOrders),
        confidence: i <= 7 ? 'high' : i <= 14 ? 'medium' : 'low',
      });
    }

    // Calculate growth rate
    const recentAvg = sales.slice(-7).reduce((sum, s) => sum + parseFloat(s.total_sales), 0) / 7;
    const olderAvg = sales.slice(0, 7).reduce((sum, s) => sum + parseFloat(s.total_sales), 0) / 7;
    const growthRate = ((recentAvg - olderAvg) / olderAvg) * 100;

    return NextResponse.json({
      success: true,
      forecast: forecast,
      insights: {
        avg_daily_sales: Math.round(avgDailySales),
        avg_daily_orders: Math.round(avgDailyOrders),
        growth_rate: Math.round(growthRate * 100) / 100,
        trend: slope > 0 ? 'increasing' : slope < 0 ? 'decreasing' : 'stable',
        historical_period: historical,
        forecast_period: days,
      }
    });

  } catch (error: any) {
    console.error("Error generating sales forecast:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
