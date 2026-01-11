import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

/**
 * GET /api/supply-chain/analytics/spend
 * Spend analysis by supplier, category, department
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30"; // days
    const group_by = searchParams.get("group_by") || "supplier"; // supplier, category, department
    const supplier_id = searchParams.get("supplier_id");

    const startDate = `CURRENT_DATE - INTERVAL '${period} days'`;

    let groupByClause = "s.id, s.company_name";
    let selectClause = "s.company_name AS group_name";

    if (group_by === "category") {
      groupByClause = "p.category_id";
      selectClause = "COALESCE(pc.name, 'Uncategorized') AS group_name";
    } else if (group_by === "department") {
      groupByClause = "po.department_id";
      selectClause = "COALESCE(d.name, 'Unassigned') AS group_name";
    }

    const conditions = [`po.order_date >= ${startDate}`];
    const params: any[] = [];
    let paramIndex = 1;

    if (supplier_id) {
      conditions.push(`po.supplier_id = $${paramIndex}`);
      params.push(parseInt(supplier_id));
      paramIndex++;
    }

    const whereClause = conditions.join(" AND ");

    const result = await query(
      `SELECT 
        ${selectClause},
        COUNT(DISTINCT po.id) AS order_count,
        SUM(po.total_amount) AS total_spend,
        AVG(po.total_amount) AS avg_order_value,
        MIN(po.order_date) AS first_order_date,
        MAX(po.order_date) AS last_order_date,
        SUM(CASE WHEN po.status = 'completed' THEN 1 ELSE 0 END) AS completed_orders,
        SUM(CASE WHEN po.status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled_orders
      FROM purchase_orders po
      JOIN suppliers s ON s.id = po.supplier_id
      LEFT JOIN purchase_order_items poi ON poi.purchase_order_id = po.id
      LEFT JOIN products p ON p.id = poi.product_id
      LEFT JOIN product_categories pc ON pc.id = p.category_id
      LEFT JOIN departments d ON d.id = po.department_id
      WHERE ${whereClause}
      GROUP BY ${groupByClause}
      ORDER BY total_spend DESC
      LIMIT 50`,
      params
    );

    // Calculate totals
    const totalSpend = result.rows.reduce((sum, r) => sum + parseFloat(r.total_spend || 0), 0);
    const totalOrders = result.rows.reduce((sum, r) => sum + parseInt(r.order_count || 0), 0);

    // Add percentage
    const spendAnalysis = result.rows.map((row) => ({
      ...row,
      total_spend: parseFloat(row.total_spend).toFixed(2),
      avg_order_value: parseFloat(row.avg_order_value).toFixed(2),
      spend_percentage: ((parseFloat(row.total_spend) / totalSpend) * 100).toFixed(2),
    }));

    return NextResponse.json({
      period_days: period,
      group_by,
      total_spend: totalSpend.toFixed(2),
      total_orders: totalOrders,
      spend_analysis: spendAnalysis,
    });
  } catch (error: any) {
    console.error("Error in spend analysis:", error);
    return NextResponse.json(
      { error: "Failed to perform spend analysis", details: error.message },
      { status: 500 }
    );
  }
}
