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
          lt.id,
          lt.transfer_number,
          fl.name as from_location,
          tl.name as to_location,
          lt.total_items,
          lt.status,
          lt.requested_date as created_at,
          lt.estimated_arrival
        FROM location_transfers lt
        JOIN locations fl ON lt.from_location_id = fl.id
        JOIN locations tl ON lt.to_location_id = tl.id
        WHERE lt.requested_date >= CURRENT_DATE - INTERVAL '30 days'
        ORDER BY lt.requested_date DESC`
      )

      return NextResponse.json(result.rows)
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error fetching transfers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transfers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { from_location_id, to_location_id, items, notes } = await request.json()

    if (!from_location_id || !to_location_id || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'From location, to location, and items are required' },
        { status: 400 }
      )
    }

    const client = await pool.connect()

    try {
      await client.query('BEGIN')

      // Generate transfer number
      const transferNumber = `TRF-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Date.now().toString().slice(-4)}`

      // Create transfer
      const transferResult = await client.query(
        `INSERT INTO location_transfers 
         (transfer_number, from_location_id, to_location_id, total_items, estimated_arrival, notes)
         VALUES ($1, $2, $3, $4, NOW() + INTERVAL '3 days', $5)
         RETURNING *`,
        [transferNumber, from_location_id, to_location_id, items.length, notes]
      )

      const transfer = transferResult.rows[0]

      // Create transfer items
      for (const item of items) {
        await client.query(
          `INSERT INTO location_transfer_items 
           (transfer_id, product_id, sku, product_name, quantity_requested, unit_cost)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [transfer.id, item.product_id, item.sku, item.product_name, item.quantity, item.unit_cost || 0]
        )
      }

      await client.query('COMMIT')

      return NextResponse.json(transfer, { status: 201 })
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error creating transfer:', error)
    return NextResponse.json(
      { error: 'Failed to create transfer' },
      { status: 500 }
    )
  }
}
