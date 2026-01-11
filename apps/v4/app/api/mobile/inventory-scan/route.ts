import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sku = searchParams.get('sku')

    if (!sku) {
      return NextResponse.json(
        { error: 'SKU parameter is required' },
        { status: 400 }
      )
    }

    const client = await pool.connect()

    try {
      const result = await client.query(
        `SELECT 
          id,
          sku,
          name as product_name,
          quantity,
          location,
          CASE 
            WHEN quantity = 0 THEN 'out_of_stock'
            WHEN quantity <= reorder_point THEN 'low_stock'
            ELSE 'available'
          END as status,
          updated_at as last_updated
        FROM inventory
        WHERE sku = $1 OR barcode = $1
        LIMIT 1`,
        [sku]
      )

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'Item not found' },
          { status: 404 }
        )
      }

      const item = result.rows[0]
      
      return NextResponse.json({
        id: item.id,
        sku: item.sku,
        name: item.product_name,
        quantity: item.quantity,
        location: item.location || 'Warehouse A',
        status: item.status,
        last_updated: item.last_updated
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error scanning inventory:', error)
    return NextResponse.json(
      { error: 'Failed to scan item' },
      { status: 500 }
    )
  }
}
