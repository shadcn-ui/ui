import { NextRequest, NextResponse } from "next/server"
import { Pool } from "pg"

const pool = new Pool({
  user: process.env.DB_USER || "mac",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "ocean-erp",
  password: process.env.DB_PASSWORD || "",
  port: parseInt(process.env.DB_PORT || "5432"),
})

// GET /api/suppliers/performance - Get detailed supplier performance analytics
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const supplierId = searchParams.get("supplier_id")
    const timeRange = searchParams.get("time_range") || "all" // all, year, quarter, month
    const metrics = searchParams.get("metrics") || "summary" // summary, trends, comparison

    let dateFilter = ""
    const params: any[] = []
    let paramCount = 1

    // Build date filter based on time range
    switch (timeRange) {
      case "year":
        dateFilter = `AND po.order_date >= NOW() - INTERVAL '1 year'`
        break
      case "quarter":
        dateFilter = `AND po.order_date >= NOW() - INTERVAL '3 months'`
        break
      case "month":
        dateFilter = `AND po.order_date >= NOW() - INTERVAL '1 month'`
        break
      default:
        dateFilter = ""
    }

    if (metrics === "trends") {
      // Get monthly performance trends
      const trendsQuery = `
        SELECT 
          s.id,
          s.supplier_code,
          s.company_name,
          DATE_TRUNC('month', po.order_date) as month,
          COUNT(po.id) as orders_count,
          SUM(po.total_amount) as total_value,
          AVG(po.total_amount) as avg_order_value,
          COUNT(CASE WHEN po.status = 'Received' THEN 1 END) as completed_orders,
          COUNT(CASE WHEN po.actual_delivery_date <= po.expected_delivery_date THEN 1 END) as on_time_deliveries,
          ROUND(
            COUNT(CASE WHEN po.actual_delivery_date <= po.expected_delivery_date THEN 1 END)::numeric / 
            NULLIF(COUNT(CASE WHEN po.actual_delivery_date IS NOT NULL THEN 1 END), 0)::numeric * 100,
            2
          ) as on_time_rate
        FROM suppliers s
        LEFT JOIN purchase_orders po ON s.id = po.supplier_id
        WHERE s.status != 'Inactive' ${dateFilter}
        ${supplierId ? `AND s.id = $${paramCount}` : ""}
        GROUP BY s.id, s.supplier_code, s.company_name, DATE_TRUNC('month', po.order_date)
        ORDER BY s.company_name, month DESC
      `
      
      const queryParams = supplierId ? [supplierId] : []
      const result = await pool.query(trendsQuery, queryParams)
      return NextResponse.json(result.rows)
    }

    if (metrics === "comparison") {
      // Get comparative metrics between suppliers
      const comparisonQuery = `
        SELECT 
          s.id,
          s.supplier_code,
          s.company_name,
          s.rating,
          COUNT(DISTINCT po.id) as total_orders,
          SUM(po.total_amount) as total_purchase_value,
          AVG(po.total_amount) as avg_order_value,
          COUNT(DISTINCT CASE WHEN po.status = 'Received' THEN po.id END) as completed_orders,
          COUNT(DISTINCT CASE WHEN po.actual_delivery_date <= po.expected_delivery_date THEN po.id END) as on_time_deliveries,
          CASE 
            WHEN COUNT(DISTINCT CASE WHEN po.actual_delivery_date IS NOT NULL THEN po.id END) = 0 THEN 0
            ELSE ROUND(
              COUNT(DISTINCT CASE WHEN po.actual_delivery_date <= po.expected_delivery_date THEN po.id END)::numeric / 
              NULLIF(COUNT(DISTINCT CASE WHEN po.actual_delivery_date IS NOT NULL THEN po.id END), 0)::numeric * 100,
              2
            )
          END as on_time_delivery_rate,
          -- Payment metrics
          COUNT(CASE WHEN po.payment_status = 'Paid' THEN 1 END) as paid_orders,
          COUNT(CASE WHEN po.payment_status = 'Pending' THEN 1 END) as pending_payments,
          ROUND(
            COUNT(CASE WHEN po.payment_status = 'Paid' THEN 1 END)::numeric / 
            NULLIF(COUNT(po.id), 0)::numeric * 100,
            2
          ) as payment_completion_rate,
          -- Lead time metrics
          AVG(CASE 
            WHEN po.actual_delivery_date IS NOT NULL AND po.order_date IS NOT NULL 
            THEN EXTRACT(DAY FROM (po.actual_delivery_date::timestamp - po.order_date::timestamp))
          END) as avg_lead_time_days,
          -- Cost metrics
          MIN(po.total_amount) as min_order_value,
          MAX(po.total_amount) as max_order_value,
          STDDEV(po.total_amount) as order_value_stddev
        FROM suppliers s
        LEFT JOIN purchase_orders po ON s.id = po.supplier_id ${dateFilter}
        WHERE s.status != 'Inactive'
        GROUP BY s.id, s.supplier_code, s.company_name, s.rating
        HAVING COUNT(DISTINCT po.id) > 0
        ORDER BY total_purchase_value DESC
      `
      
      const result = await pool.query(comparisonQuery)
      return NextResponse.json(result.rows)
    }

    // Default: Return summary from view
    const summaryQuery = supplierId
      ? `SELECT * FROM supplier_performance_summary WHERE id = $1`
      : `SELECT * FROM supplier_performance_summary ORDER BY total_purchase_value DESC`
    
    const queryParams = supplierId ? [supplierId] : []
    const result = await pool.query(summaryQuery, queryParams)
    
    return NextResponse.json(supplierId ? result.rows[0] : result.rows)
  } catch (error) {
    console.error("Error fetching supplier performance:", error)
    return NextResponse.json(
      { error: "Failed to fetch supplier performance data" },
      { status: 500 }
    )
  }
}

// POST /api/suppliers/performance - Update supplier rating or performance notes
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { supplier_id, rating, performance_notes, updated_by } = body

    if (!supplier_id) {
      return NextResponse.json(
        { error: "Supplier ID is required" },
        { status: 400 }
      )
    }

    // Update supplier rating
    if (rating !== undefined) {
      await pool.query(
        `UPDATE suppliers SET rating = $1, updated_at = NOW(), updated_by = $2 WHERE id = $3`,
        [rating, updated_by, supplier_id]
      )
    }

    // Add performance note if provided
    if (performance_notes) {
      await pool.query(
        `INSERT INTO supplier_performance_notes (supplier_id, notes, created_by, created_at)
         VALUES ($1, $2, $3, NOW())`,
        [supplier_id, performance_notes, updated_by]
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: "Supplier performance updated successfully" 
    })
  } catch (error) {
    console.error("Error updating supplier performance:", error)
    return NextResponse.json(
      { error: "Failed to update supplier performance" },
      { status: 500 }
    )
  }
}
