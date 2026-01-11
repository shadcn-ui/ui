import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function POST(request: NextRequest) {
  try {
    const { sku, action, quantity } = await request.json()

    if (!sku || !action || !quantity) {
      return NextResponse.json(
        { error: 'SKU, action, and quantity are required' },
        { status: 400 }
      )
    }

    const client = await pool.connect()

    try {
      await client.query('BEGIN')

      // Get current item
      const currentItem = await client.query(
        'SELECT * FROM inventory WHERE sku = $1',
        [sku]
      )

      if (currentItem.rows.length === 0) {
        await client.query('ROLLBACK')
        return NextResponse.json(
          { error: 'Item not found' },
          { status: 404 }
        )
      }

      const item = currentItem.rows[0]
      const newQuantity = action === 'add' 
        ? item.quantity + quantity 
        : Math.max(0, item.quantity - quantity)

      // Update inventory
      await client.query(
        `UPDATE inventory 
         SET quantity = $1, 
             updated_at = NOW()
         WHERE sku = $2`,
        [newQuantity, sku]
      )

      // Log the transaction
      await client.query(
        `INSERT INTO inventory_transactions 
         (inventory_id, transaction_type, quantity, notes, created_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [
          item.id,
          action === 'add' ? 'stock_in' : 'stock_out',
          quantity,
          `Mobile scanner ${action}`
        ]
      )

      await client.query('COMMIT')

      // Return updated item
      const updatedItem = await client.query(
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
        WHERE sku = $1`,
        [sku]
      )

      return NextResponse.json({
        id: updatedItem.rows[0].id,
        sku: updatedItem.rows[0].sku,
        name: updatedItem.rows[0].product_name,
        quantity: updatedItem.rows[0].quantity,
        location: updatedItem.rows[0].location || 'Warehouse A',
        status: updatedItem.rows[0].status,
        last_updated: updatedItem.rows[0].last_updated
      })
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error adjusting inventory:', error)
    return NextResponse.json(
      { error: 'Failed to adjust inventory' },
      { status: 500 }
    )
  }
}
