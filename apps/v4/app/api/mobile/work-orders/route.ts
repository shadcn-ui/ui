import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function GET(request: NextRequest) {
  try {
    const client = await pool.connect()

    try {
      const result = await client.query(
        `SELECT 
          wo.id,
          wo.work_order_number,
          p.name as product_name,
          wo.quantity_planned,
          wo.quantity_produced,
          wo.status,
          wo.started_at,
          wo.production_line,
          CASE 
            WHEN wo.quantity_planned > 0 
            THEN (wo.quantity_produced::float / wo.quantity_planned::float * 100)
            ELSE 0
          END as progress_percentage
        FROM work_orders wo
        LEFT JOIN products p ON wo.product_id = p.id
        WHERE wo.status IN ('pending', 'in_progress', 'paused', 'completed')
          AND (wo.status != 'completed' OR wo.completed_at >= CURRENT_DATE)
        ORDER BY 
          CASE wo.status
            WHEN 'in_progress' THEN 1
            WHEN 'paused' THEN 2
            WHEN 'pending' THEN 3
            WHEN 'completed' THEN 4
          END,
          wo.started_at DESC NULLS LAST`
      )

      const workOrders = result.rows.map(row => ({
        id: row.id,
        work_order_number: row.work_order_number,
        product_name: row.product_name,
        quantity_planned: row.quantity_planned,
        quantity_produced: row.quantity_produced,
        status: row.status,
        started_at: row.started_at,
        production_line: row.production_line || 'Line 1',
        progress_percentage: Math.round(parseFloat(row.progress_percentage) || 0)
      }))

      return NextResponse.json(workOrders)
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error fetching work orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch work orders' },
      { status: 500 }
    )
  }
}
