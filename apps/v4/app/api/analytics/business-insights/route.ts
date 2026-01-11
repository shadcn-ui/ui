import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/analytics/business-insights - AI-powered business insights and recommendations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = parseInt(searchParams.get("period") || "30"); // Analysis period in days

    // Gather key metrics
    const metricsResult = await pool.query(
      `SELECT
        -- Sales metrics
        COUNT(DISTINCT CASE WHEN o.status NOT IN ('cancelled', 'draft') THEN o.id END) as total_orders,
        SUM(CASE WHEN o.status NOT IN ('cancelled', 'draft') THEN o.total_amount ELSE 0 END) as total_revenue,
        AVG(CASE WHEN o.status NOT IN ('cancelled', 'draft') THEN o.total_amount END) as avg_order_value,
        
        -- Customer metrics
        COUNT(DISTINCT o.customer_id) as active_customers,
        COUNT(DISTINCT CASE WHEN o.created_at >= CURRENT_DATE - INTERVAL '7 days' THEN o.customer_id END) as recent_customers,
        
        -- Order status distribution
        COUNT(CASE WHEN o.status = 'completed' THEN 1 END) as completed_orders,
        COUNT(CASE WHEN o.status = 'cancelled' THEN 1 END) as cancelled_orders,
        COUNT(CASE WHEN o.status = 'pending' THEN 1 END) as pending_orders
        
       FROM sales_orders o
       WHERE o.created_at >= CURRENT_DATE - INTERVAL '${period} days'`
    );

    const metrics = metricsResult.rows[0];

    // Get top products
    const topProductsResult = await pool.query(
      `SELECT 
        p.name,
        COUNT(oi.id) as times_sold,
        SUM(oi.quantity) as total_quantity,
        SUM(oi.line_total) as total_revenue
       FROM sales_order_items oi
       JOIN products p ON oi.product_id = p.id
       JOIN sales_orders o ON oi.sales_order_id = o.id
       WHERE o.created_at >= CURRENT_DATE - INTERVAL '${period} days'
         AND o.status NOT IN ('cancelled', 'draft')
       GROUP BY p.id, p.name
       ORDER BY total_revenue DESC
       LIMIT 5`
    );

    // Get slow-moving inventory
    const slowInventoryResult = await pool.query(
      `SELECT 
        p.name,
        p.current_stock,
        p.cost_price * p.current_stock as inventory_value,
        COALESCE(SUM(oi.quantity), 0) as sold_quantity
       FROM products p
       LEFT JOIN sales_order_items oi ON p.id = oi.product_id
       LEFT JOIN sales_orders o ON oi.sales_order_id = o.id 
         AND o.created_at >= CURRENT_DATE - INTERVAL '${period} days'
         AND o.status NOT IN ('cancelled', 'draft')
       WHERE p.current_stock > 0
       GROUP BY p.id, p.name, p.current_stock, p.cost_price
       HAVING COALESCE(SUM(oi.quantity), 0) = 0
       ORDER BY inventory_value DESC
       LIMIT 10`
    );

    // Get revenue trend (compare to previous period)
    const previousPeriodResult = await pool.query(
      `SELECT
        SUM(CASE WHEN o.status NOT IN ('cancelled', 'draft') THEN o.total_amount ELSE 0 END) as prev_revenue
       FROM sales_orders o
       WHERE o.created_at >= CURRENT_DATE - INTERVAL '${period * 2} days'
         AND o.created_at < CURRENT_DATE - INTERVAL '${period} days'`
    );

    const prevRevenue = parseFloat(previousPeriodResult.rows[0].prev_revenue || 0);
    const currentRevenue = parseFloat(metrics.total_revenue || 0);
    const revenueGrowth = prevRevenue > 0 ? ((currentRevenue - prevRevenue) / prevRevenue) * 100 : 0;

    // Calculate conversion rate
    const conversionRate = metrics.total_orders > 0 
      ? (parseInt(metrics.completed_orders) / parseInt(metrics.total_orders)) * 100 
      : 0;

    // Generate insights
    const insights: any[] = [];

    // Revenue insights
    if (revenueGrowth > 10) {
      insights.push({
        type: 'positive',
        category: 'revenue',
        title: 'Strong Revenue Growth',
        message: `Revenue increased by ${Math.round(revenueGrowth)}% compared to previous period. Keep the momentum going!`,
        impact: 'high',
      });
    } else if (revenueGrowth < -10) {
      insights.push({
        type: 'warning',
        category: 'revenue',
        title: 'Revenue Decline',
        message: `Revenue decreased by ${Math.abs(Math.round(revenueGrowth))}% compared to previous period. Consider promotional campaigns.`,
        impact: 'high',
        actions: [
          'Launch targeted marketing campaigns',
          'Offer seasonal discounts',
          'Analyze customer feedback',
          'Review pricing strategy',
        ],
      });
    }

    // Customer retention insight
    const retentionRate = metrics.active_customers > 0 
      ? (parseInt(metrics.recent_customers) / parseInt(metrics.active_customers)) * 100 
      : 0;
    
    if (retentionRate < 30) {
      insights.push({
        type: 'warning',
        category: 'customers',
        title: 'Low Customer Retention',
        message: `Only ${Math.round(retentionRate)}% of customers made recent purchases. Focus on retention strategies.`,
        impact: 'high',
        actions: [
          'Implement loyalty program',
          'Send re-engagement emails',
          'Offer personalized recommendations',
          'Improve customer service',
        ],
      });
    }

    // Conversion rate insight
    if (conversionRate < 50) {
      insights.push({
        type: 'warning',
        category: 'operations',
        title: 'Low Order Completion Rate',
        message: `Only ${Math.round(conversionRate)}% of orders are completed. ${parseInt(metrics.pending_orders)} orders pending.`,
        impact: 'medium',
        actions: [
          'Streamline checkout process',
          'Follow up on pending orders',
          'Analyze cancellation reasons',
          'Improve payment options',
        ],
      });
    }

    // Inventory insights
    if (slowInventoryResult.rows.length > 0) {
      const totalSlowValue = slowInventoryResult.rows.reduce(
        (sum, item) => sum + parseFloat(item.inventory_value), 0
      );
      
      insights.push({
        type: 'info',
        category: 'inventory',
        title: 'Slow-Moving Inventory',
        message: `${slowInventoryResult.rows.length} products with no sales worth Rp ${Math.round(totalSlowValue).toLocaleString()}.`,
        impact: 'medium',
        actions: [
          'Create clearance bundles',
          'Offer volume discounts',
          'Use in promotional campaigns',
          'Consider markdown pricing',
        ],
        items: slowInventoryResult.rows.slice(0, 5).map(i => i.name),
      });
    }

    // Best performers insight
    if (topProductsResult.rows.length > 0) {
      insights.push({
        type: 'positive',
        category: 'products',
        title: 'Top Performing Products',
        message: `Your top 5 products generated Rp ${Math.round(
          topProductsResult.rows.reduce((sum, p) => sum + parseFloat(p.total_revenue), 0)
        ).toLocaleString()} in revenue.`,
        impact: 'high',
        actions: [
          'Ensure adequate stock levels',
          'Create related product bundles',
          'Feature in marketing materials',
          'Analyze success factors',
        ],
        items: topProductsResult.rows.map(p => `${p.name} (${p.times_sold} sales)`),
      });
    }

    // Average order value insight
    const avgOrderValue = parseFloat(metrics.avg_order_value || 0);
    if (avgOrderValue < 100000) {
      insights.push({
        type: 'info',
        category: 'revenue',
        title: 'Opportunity to Increase AOV',
        message: `Average order value is Rp ${Math.round(avgOrderValue).toLocaleString()}. Consider upselling strategies.`,
        impact: 'medium',
        actions: [
          'Offer free shipping thresholds',
          'Create product bundles',
          'Implement "Frequently bought together"',
          'Suggest premium alternatives',
        ],
      });
    }

    // Cancellation rate insight
    const cancellationRate = metrics.total_orders > 0 
      ? (parseInt(metrics.cancelled_orders) / parseInt(metrics.total_orders)) * 100 
      : 0;
    
    if (cancellationRate > 10) {
      insights.push({
        type: 'warning',
        category: 'operations',
        title: 'High Cancellation Rate',
        message: `${Math.round(cancellationRate)}% of orders are cancelled. Investigate root causes.`,
        impact: 'high',
        actions: [
          'Survey cancelled order customers',
          'Review product descriptions accuracy',
          'Check delivery time expectations',
          'Improve order confirmation process',
        ],
      });
    }

    // Generate recommendations
    const recommendations: any[] = [];

    if (revenueGrowth > 0) {
      recommendations.push({
        priority: 'high',
        title: 'Scale Marketing Efforts',
        description: 'With positive growth, now is the time to increase marketing spend and acquire more customers.',
      });
    }

    if (topProductsResult.rows.length > 0) {
      recommendations.push({
        priority: 'high',
        title: 'Stock Up Best Sellers',
        description: 'Ensure your top products are always in stock to maximize revenue opportunities.',
      });
    }

    if (retentionRate < 50) {
      recommendations.push({
        priority: 'high',
        title: 'Launch Loyalty Program',
        description: 'Improve customer retention with points, rewards, and exclusive benefits.',
      });
    }

    if (slowInventoryResult.rows.length > 5) {
      recommendations.push({
        priority: 'medium',
        title: 'Clear Slow Inventory',
        description: 'Free up capital by running promotions on slow-moving products.',
      });
    }

    if (avgOrderValue < 200000) {
      recommendations.push({
        priority: 'medium',
        title: 'Increase Average Order Value',
        description: 'Implement cross-selling and bundle strategies to boost revenue per transaction.',
      });
    }

    return NextResponse.json({
      success: true,
      summary: {
        period_days: period,
        total_orders: parseInt(metrics.total_orders),
        total_revenue: Math.round(currentRevenue),
        avg_order_value: Math.round(avgOrderValue),
        active_customers: parseInt(metrics.active_customers),
        revenue_growth: Math.round(revenueGrowth * 100) / 100,
        conversion_rate: Math.round(conversionRate * 100) / 100,
        cancellation_rate: Math.round(cancellationRate * 100) / 100,
      },
      insights: insights,
      recommendations: recommendations,
      top_products: topProductsResult.rows,
      slow_inventory: slowInventoryResult.rows,
    });

  } catch (error: any) {
    console.error("Error generating business insights:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
