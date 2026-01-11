import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/pos/dashboard - Get POS dashboard metrics and statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");
    const terminalId = searchParams.get("terminal_id");
    const warehouseId = searchParams.get("warehouse_id");
    const period = searchParams.get("period") || "today"; // today, week, month
    const cashierId = searchParams.get("cashier_id");

    // Date range based on period
    let dateCondition = "";
    switch (period) {
      case "today":
        dateCondition = "AND t.transaction_date >= CURRENT_DATE";
        break;
      case "week":
        dateCondition = "AND t.transaction_date >= CURRENT_DATE - INTERVAL '7 days'";
        break;
      case "month":
        dateCondition = "AND t.transaction_date >= CURRENT_DATE - INTERVAL '30 days'";
        break;
      case "year":
        dateCondition = "AND t.transaction_date >= CURRENT_DATE - INTERVAL '365 days'";
        break;
    }

    // Build WHERE clause
    let whereClause = "WHERE 1=1";
    const params: any[] = [];
    let paramIndex = 1;

    if (sessionId) {
      whereClause += ` AND t.session_id = $${paramIndex}`;
      params.push(parseInt(sessionId));
      paramIndex++;
    }

    if (terminalId) {
      whereClause += ` AND t.terminal_id = $${paramIndex}`;
      params.push(parseInt(terminalId));
      paramIndex++;
    }

    if (warehouseId) {
      whereClause += ` AND t.warehouse_id = $${paramIndex}`;
      params.push(parseInt(warehouseId));
      paramIndex++;
    }

    if (cashierId) {
      whereClause += ` AND t.cashier_id = $${paramIndex}`;
      params.push(cashierId);
      paramIndex++;
    }

    // Summary statistics
    const summaryQuery = `
      SELECT 
        COUNT(DISTINCT t.id) as total_transactions,
        COALESCE(SUM(t.grand_total), 0) as total_sales,
        COALESCE(AVG(t.grand_total), 0) as avg_transaction_value,
        COALESCE(SUM(t.subtotal), 0) as total_subtotal,
        COALESCE(SUM(t.discount_amount), 0) as total_discounts,
        COALESCE(SUM(t.tax_amount), 0) as total_tax,
        COALESCE(SUM(t.loyalty_points_redeemed), 0) as total_points_redeemed,
        COALESCE(SUM(t.loyalty_points_earned), 0) as total_points_earned,
        COUNT(DISTINCT t.customer_id) as unique_customers,
        COUNT(DISTINCT CASE WHEN t.transaction_type = 'refund' THEN t.id END) as total_refunds,
        COALESCE(SUM(CASE WHEN t.transaction_type = 'refund' THEN t.grand_total ELSE 0 END), 0) as total_refund_amount
      FROM pos_transactions t
      ${whereClause} ${dateCondition}
      AND t.transaction_status = 'completed'
    `;

    const summaryResult = await pool.query(summaryQuery, params);
    const summary = summaryResult.rows[0];

    // Payment method breakdown
    const paymentBreakdownQuery = `
      SELECT 
        tp.payment_method,
        COUNT(DISTINCT t.id) as transaction_count,
        COALESCE(SUM(tp.amount_received), 0) as total_amount
      FROM pos_transactions t
      JOIN transaction_payments tp ON t.id = tp.transaction_id
      ${whereClause} ${dateCondition}
      AND t.transaction_status = 'completed'
      GROUP BY tp.payment_method
      ORDER BY total_amount DESC
    `;

    const paymentBreakdownResult = await pool.query(paymentBreakdownQuery, params);

    // Top selling products
    const topProductsQuery = `
      SELECT 
        p.id,
        p.name,
        p.sku,
        p.primary_image_url,
        SUM(ti.quantity) as total_quantity_sold,
        COUNT(DISTINCT t.id) as transaction_count,
        COALESCE(SUM(ti.line_total), 0) as total_revenue
      FROM pos_transactions t
      JOIN transaction_items ti ON t.id = ti.transaction_id
      JOIN products p ON ti.product_id = p.id
      ${whereClause} ${dateCondition}
      AND t.transaction_status = 'completed'
      GROUP BY p.id, p.name, p.sku, p.primary_image_url
      ORDER BY total_revenue DESC
      LIMIT 10
    `;

    const topProductsResult = await pool.query(topProductsQuery, params);

    // Hourly sales trend (for today only)
    let hourlySales = [];
    if (period === "today") {
      const hourlySalesQuery = `
        SELECT 
          EXTRACT(HOUR FROM t.transaction_date) as hour,
          COUNT(DISTINCT t.id) as transaction_count,
          COALESCE(SUM(t.grand_total), 0) as total_sales
        FROM pos_transactions t
        ${whereClause}
        AND t.transaction_date >= CURRENT_DATE
        AND t.transaction_status = 'completed'
        GROUP BY EXTRACT(HOUR FROM t.transaction_date)
        ORDER BY hour ASC
      `;

      const hourlySalesResult = await pool.query(hourlySalesQuery, params);
      hourlySales = hourlySalesResult.rows;
    }

    // Recent transactions
    const recentTransactionsQuery = `
      SELECT 
        t.id,
        t.transaction_number,
        t.transaction_date,
        t.grand_total,
        t.payment_status,
        c.name as customer_name,
        CONCAT(u.first_name, ' ', u.last_name) as cashier_name,
        COUNT(ti.id) as item_count
      FROM pos_transactions t
      LEFT JOIN customers c ON t.customer_id = c.id
      LEFT JOIN users u ON t.cashier_id = u.id
      LEFT JOIN transaction_items ti ON t.id = ti.transaction_id
      ${whereClause} ${dateCondition}
      AND t.transaction_status = 'completed'
      GROUP BY t.id, t.transaction_number, t.transaction_date, t.grand_total, t.payment_status, c.name, u.first_name, u.last_name
      ORDER BY t.transaction_date DESC
      LIMIT 20
    `;

    const recentTransactionsResult = await pool.query(recentTransactionsQuery, params);

    // Session summary (if session_id provided)
    let sessionSummary = null;
    if (sessionId) {
      const sessionSummaryQuery = `
        SELECT 
          s.*,
          t.terminal_name,
          w.name as warehouse_name,
          CONCAT(u.first_name, ' ', u.last_name) as cashier_name,
          (s.closing_cash - s.opening_cash) as cash_difference,
          (
            SELECT COALESCE(SUM(grand_total), 0)
            FROM pos_transactions
            WHERE session_id = s.id AND transaction_status = 'completed'
          ) as total_sales_amount,
          (
            SELECT COUNT(*)
            FROM pos_transactions
            WHERE session_id = s.id AND transaction_status = 'completed'
          ) as total_transactions_count
        FROM pos_sessions s
        JOIN pos_terminals t ON s.terminal_id = t.id
        JOIN warehouses w ON s.warehouse_id = w.id
        JOIN users u ON s.cashier_id = u.id
        WHERE s.id = $1
      `;

      const sessionSummaryResult = await pool.query(sessionSummaryQuery, [parseInt(sessionId)]);
      if (sessionSummaryResult.rows.length > 0) {
        sessionSummary = sessionSummaryResult.rows[0];
      }
    }

    return NextResponse.json({
      success: true,
      period,
      summary: {
        total_transactions: parseInt(summary.total_transactions),
        total_sales: parseFloat(summary.total_sales),
        avg_transaction_value: parseFloat(summary.avg_transaction_value),
        total_subtotal: parseFloat(summary.total_subtotal),
        total_discounts: parseFloat(summary.total_discounts),
        total_tax: parseFloat(summary.total_tax),
        total_points_redeemed: parseFloat(summary.total_points_redeemed),
        total_points_earned: parseFloat(summary.total_points_earned),
        unique_customers: parseInt(summary.unique_customers),
        total_refunds: parseInt(summary.total_refunds),
        total_refund_amount: parseFloat(summary.total_refund_amount),
        net_sales: parseFloat(summary.total_sales) - parseFloat(summary.total_refund_amount),
      },
      payment_breakdown: paymentBreakdownResult.rows,
      top_products: topProductsResult.rows,
      hourly_sales: hourlySales,
      recent_transactions: recentTransactionsResult.rows,
      session_summary: sessionSummary,
    });

  } catch (error: any) {
    console.error("Error fetching POS dashboard data:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
