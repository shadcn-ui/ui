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
          it.id,
          i.sku,
          i.name as product_name,
          it.transaction_type as action,
          it.quantity,
          it.created_at as timestamp,
          'Mobile User' as user
        FROM inventory_transactions it
        JOIN inventory i ON it.inventory_id = i.id
        WHERE it.created_at >= CURRENT_DATE
        ORDER BY it.created_at DESC
        LIMIT 50`
      )

      const history = result.rows.map(row => ({
        id: row.id,
        sku: row.sku,
        product_name: row.product_name,
        action: row.action === 'stock_in' ? 'add' : row.action === 'stock_out' ? 'remove' : 'scan',
        quantity: row.quantity,
        timestamp: row.timestamp,
        user: row.user
      }))

      return NextResponse.json(history)
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error fetching scan history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch scan history' },
      { status: 500 }
    )
  }
}
