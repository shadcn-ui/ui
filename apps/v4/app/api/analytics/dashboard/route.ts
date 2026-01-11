import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const range = searchParams.get('range') || '30d'

    // Calculate date range
    const daysMap: Record<string, number> = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    }
    const days = daysMap[range] || 30

    const client = await pool.connect()

    try {
      // Production Analytics
      const productionQuery = await client.query(`
        SELECT 
          COUNT(*) as total_batches,
          COUNT(*) FILTER (WHERE status = 'completed') as completed_batches,
          COUNT(*) FILTER (WHERE status = 'in_progress') as active_batches,
          AVG(CASE 
            WHEN status = 'completed' AND actual_start_date IS NOT NULL AND actual_end_date IS NOT NULL 
            THEN EXTRACT(EPOCH FROM (actual_end_date - actual_start_date)) / 86400 
          END) as avg_cycle_time,
          (COUNT(*) FILTER (WHERE status = 'completed')::float / NULLIF(COUNT(*), 0)::float * 100) as efficiency_rate
        FROM work_orders
        WHERE created_at >= NOW() - INTERVAL '${days} days'
      `)

      // Quality Analytics
      const qualityQuery = await client.query(`
        SELECT 
          COUNT(*) as total_tests,
          COUNT(*) FILTER (WHERE test_result = 'pass') as passed_tests,
          COUNT(*) FILTER (WHERE test_result = 'fail') as failed_tests,
          (COUNT(*) FILTER (WHERE test_result = 'pass')::float / NULLIF(COUNT(*), 0)::float * 100) as pass_rate,
          (COUNT(*) FILTER (WHERE test_result = 'pass')::float / NULLIF(COUNT(*), 0)::float * 100) as compliance_rate
        FROM product_quality_tests
        WHERE test_date >= NOW() - INTERVAL '${days} days'
      `)

      // Inventory Analytics
      const inventoryQuery = await client.query(`
        SELECT 
          SUM(i.total_value) as total_value,
          COUNT(DISTINCT i.product_id) as total_items,
          COUNT(DISTINCT i.product_id) FILTER (WHERE i.quantity_on_hand <= p.reorder_level) as low_stock_items
        FROM inventory i
        LEFT JOIN products p ON i.product_id = p.id
      `)

      // Sales Analytics (mock data for now)
      const salesData = {
        total_revenue: 906000000,
        total_orders: 1248,
        avg_order_value: 725960,
        growth_rate: 12.5,
        trend: 8.1
      }

      // Supplier Analytics
      const supplierQuery = await client.query(`
        SELECT 
          COUNT(DISTINCT supplier_id) as total_suppliers,
          COUNT(DISTINCT supplier_id) FILTER (WHERE status = 'approved' OR status = 'completed') as active_suppliers,
          AVG(EXTRACT(EPOCH FROM (updated_at - created_at)) / 86400) as avg_lead_time,
          (COUNT(*) FILTER (WHERE status = 'completed')::float / NULLIF(COUNT(*), 0)::float * 100) as on_time_delivery_rate
        FROM purchase_orders
        WHERE created_at >= NOW() - INTERVAL '${days} days'
      `)

      const production = productionQuery.rows[0]
      const quality = qualityQuery.rows[0]
      const inventory = inventoryQuery.rows[0]
      const supplier = supplierQuery.rows[0]

      const analytics = {
        production: {
          total_batches: parseInt(production.total_batches) || 0,
          completed_batches: parseInt(production.completed_batches) || 0,
          active_batches: parseInt(production.active_batches) || 0,
          avg_cycle_time: parseFloat(production.avg_cycle_time) || 0,
          efficiency_rate: parseFloat(production.efficiency_rate) || 0,
          trend: 5.2
        },
        quality: {
          total_tests: parseInt(quality.total_tests) || 0,
          passed_tests: parseInt(quality.passed_tests) || 0,
          failed_tests: parseInt(quality.failed_tests) || 0,
          pass_rate: parseFloat(quality.pass_rate) || 0,
          compliance_rate: parseFloat(quality.compliance_rate) || 0,
          trend: 2.1
        },
        inventory: {
          total_value: parseFloat(inventory.total_value) || 0,
          total_items: parseInt(inventory.total_items) || 0,
          low_stock_items: parseInt(inventory.low_stock_items) || 0,
          turnover_rate: 3.2,
          trend: -3.2
        },
        sales: salesData,
        supplier: {
          total_suppliers: parseInt(supplier.total_suppliers) || 0,
          active_suppliers: parseInt(supplier.active_suppliers) || 0,
          avg_lead_time: parseFloat(supplier.avg_lead_time) || 0,
          on_time_delivery_rate: parseFloat(supplier.on_time_delivery_rate) || 0,
          trend: 3.2
        }
      }

      return NextResponse.json(analytics)
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}
