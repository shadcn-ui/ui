import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/ecommerce/analytics - Get e-commerce analytics and KPIs
export async function GET(request: NextRequest) {
  const client = await pool.connect();

  try {
    const { searchParams } = new URL(request.url);
    const storefront_id = searchParams.get("storefront_id");
    const from_date = searchParams.get("from_date") || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const to_date = searchParams.get("to_date") || new Date().toISOString();

    let whereConditions = ["1=1"];
    let params: any[] = [from_date, to_date];
    let paramCount = 3;

    if (storefront_id) {
      params.push(storefront_id);
      whereConditions.push(`storefront_id = $${paramCount++}`);
    }

    const whereClause = whereConditions.join(" AND ");

    // Get sales metrics
    const salesQuery = `
      SELECT 
        COUNT(*) as total_orders,
        COALESCE(SUM(total_amount), 0) as total_revenue,
        COALESCE(AVG(total_amount), 0) as average_order_value,
        COUNT(DISTINCT ecommerce_customer_id) as unique_customers,
        SUM(CASE WHEN order_status = 'fulfilled' THEN 1 ELSE 0 END) as fulfilled_orders,
        SUM(CASE WHEN order_status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_orders,
        SUM(CASE WHEN payment_status = 'paid' THEN 1 ELSE 0 END) as paid_orders,
        SUM(CASE WHEN payment_status = 'pending' THEN 1 ELSE 0 END) as pending_payments
      FROM ecommerce_orders
      WHERE order_date BETWEEN $1 AND $2
      AND ${whereClause}
    `;
    const salesResult = await client.query(salesQuery, params);

    // Get product performance
    const productsQuery = `
      SELECT 
        ep.product_name,
        ep.erp_sku,
        SUM(eoi.quantity) as total_sold,
        SUM(eoi.total_amount) as total_revenue,
        COUNT(DISTINCT eoi.ecommerce_order_id) as order_count
      FROM ecommerce_order_items eoi
      JOIN ecommerce_products ep ON eoi.ecommerce_product_id = ep.ecommerce_product_id
      JOIN ecommerce_orders eo ON eoi.ecommerce_order_id = eo.ecommerce_order_id
      WHERE eo.order_date BETWEEN $1 AND $2
      AND ${whereClause.replace('storefront_id', 'eo.storefront_id')}
      GROUP BY ep.ecommerce_product_id, ep.product_name, ep.erp_sku
      ORDER BY total_revenue DESC
      LIMIT 10
    `;
    const productsResult = await client.query(productsQuery, params);

    // Get daily sales trend
    const trendQuery = `
      SELECT 
        DATE(order_date) as date,
        COUNT(*) as order_count,
        SUM(total_amount) as revenue
      FROM ecommerce_orders
      WHERE order_date BETWEEN $1 AND $2
      AND ${whereClause}
      GROUP BY DATE(order_date)
      ORDER BY DATE(order_date)
    `;
    const trendResult = await client.query(trendQuery, params);

    // Get abandoned cart metrics
    const abandonedCartsQuery = `
      SELECT 
        COUNT(*) as total_abandoned,
        SUM(total_amount) as potential_revenue,
        AVG(total_amount) as average_cart_value,
        SUM(CASE WHEN recovery_email_sent THEN 1 ELSE 0 END) as recovery_emails_sent,
        SUM(CASE WHEN converted_to_order THEN 1 ELSE 0 END) as recovered_carts,
        SUM(CASE WHEN converted_to_order THEN total_amount ELSE 0 END) as recovered_revenue
      FROM ecommerce_carts
      WHERE abandoned_at BETWEEN $1 AND $2
      AND ${whereClause}
    `;
    const abandonedCartsResult = await client.query(abandonedCartsQuery, params);

    // Get inventory status
    const inventoryQuery = `
      SELECT 
        COUNT(*) as total_products,
        SUM(inventory_quantity) as total_inventory,
        SUM(CASE WHEN inventory_quantity = 0 THEN 1 ELSE 0 END) as out_of_stock_count,
        SUM(CASE WHEN inventory_quantity < low_stock_threshold THEN 1 ELSE 0 END) as low_stock_count,
        SUM(CASE WHEN is_published THEN 1 ELSE 0 END) as published_count
      FROM ecommerce_products
      WHERE ${whereClause}
    `;
    const inventoryResult = await client.query(inventoryQuery, params.slice(2));

    // Get conversion rate
    const conversionQuery = `
      SELECT 
        (SELECT COUNT(*) FROM ecommerce_orders WHERE order_date BETWEEN $1 AND $2 AND ${whereClause}) as orders,
        (SELECT COUNT(DISTINCT customer_email) FROM ecommerce_carts WHERE created_at BETWEEN $1 AND $2 AND ${whereClause}) as unique_visitors
    `;
    const conversionResult = await client.query(conversionQuery, params);
    const orders = parseInt(conversionResult.rows[0].orders);
    const visitors = parseInt(conversionResult.rows[0].unique_visitors);
    const conversionRate = visitors > 0 ? (orders / visitors) * 100 : 0;

    // Calculate growth rates (compare to previous period)
    const previousFromDate = new Date(new Date(from_date).getTime() - (new Date(to_date).getTime() - new Date(from_date).getTime()));
    const previousParams = [previousFromDate.toISOString(), from_date, ...params.slice(2)];

    const previousSalesQuery = `
      SELECT COALESCE(SUM(total_amount), 0) as previous_revenue
      FROM ecommerce_orders
      WHERE order_date BETWEEN $1 AND $2
      AND ${whereClause}
    `;
    const previousSalesResult = await client.query(previousSalesQuery, previousParams);
    const currentRevenue = parseFloat(salesResult.rows[0].total_revenue);
    const previousRevenue = parseFloat(previousSalesResult.rows[0].previous_revenue);
    const revenueGrowth = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;

    return NextResponse.json({
      sales_metrics: {
        ...salesResult.rows[0],
        conversion_rate: conversionRate.toFixed(2),
        revenue_growth: revenueGrowth.toFixed(2),
      },
      top_products: productsResult.rows,
      daily_trend: trendResult.rows,
      abandoned_carts: abandonedCartsResult.rows[0],
      inventory_status: inventoryResult.rows[0],
      period: {
        from_date,
        to_date,
      },
    });
  } catch (error: any) {
    console.error("Error fetching e-commerce analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch e-commerce analytics", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
