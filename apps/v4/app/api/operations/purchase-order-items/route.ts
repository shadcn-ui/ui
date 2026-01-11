import { NextResponse } from 'next/server'
import { Client } from 'pg'

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'ocean-erp',
  user: process.env.DB_USER || 'mac',
  password: process.env.DB_PASSWORD || '',
})

client.connect().catch((err) => console.error('Database connection error:', err))

// GET - Fetch items for a purchase order
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const po_id = searchParams.get('po_id')

    if (!po_id) {
      return NextResponse.json({ error: 'Purchase order ID is required' }, { status: 400 })
    }

    const result = await client.query(
      `SELECT 
        poi.*,
        p.product_name,
        p.sku,
        p.unit
       FROM purchase_order_items poi
       LEFT JOIN products p ON poi.product_id = p.id
       WHERE poi.purchase_order_id = $1 
       ORDER BY poi.id ASC`,
      [po_id]
    )
    
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching purchase order items:', error)
    return NextResponse.json({ error: 'Failed to fetch purchase order items' }, { status: 500 })
  }
}

// POST - Add item to purchase order
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      purchase_order_id, product_id, quantity_ordered, unit_price,
      discount_percent, discount_amount, tax_percent, tax_amount, notes
    } = body

    if (!purchase_order_id || !product_id || !quantity_ordered || !unit_price) {
      return NextResponse.json({ 
        error: 'Purchase order ID, product ID, quantity, and unit price are required' 
      }, { status: 400 })
    }

    const result = await client.query(
      `INSERT INTO purchase_order_items 
       (purchase_order_id, product_id, quantity_ordered, unit_price, 
        discount_percent, discount_amount, tax_percent, tax_amount, notes) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [purchase_order_id, product_id, quantity_ordered, unit_price,
       discount_percent || 0, discount_amount || 0, 
       tax_percent || 0, tax_amount || 0, notes]
    )
    
    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error('Error creating purchase order item:', error)
    return NextResponse.json({ error: 'Failed to create purchase order item' }, { status: 500 })
  }
}

// PATCH - Update purchase order item
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { 
      id, product_id, quantity_ordered, unit_price,
      discount_percent, discount_amount, tax_percent, tax_amount, notes
    } = body

    if (!id) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 })
    }

    const result = await client.query(
      `UPDATE purchase_order_items 
       SET product_id = COALESCE($1, product_id),
           quantity_ordered = COALESCE($2, quantity_ordered),
           unit_price = COALESCE($3, unit_price),
           discount_percent = COALESCE($4, discount_percent),
           discount_amount = COALESCE($5, discount_amount),
           tax_percent = COALESCE($6, tax_percent),
           tax_amount = COALESCE($7, tax_amount),
           notes = COALESCE($8, notes),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [product_id, quantity_ordered, unit_price, discount_percent, 
       discount_amount, tax_percent, tax_amount, notes, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Purchase order item not found' }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating purchase order item:', error)
    return NextResponse.json({ error: 'Failed to update purchase order item' }, { status: 500 })
  }
}

// DELETE - Remove item from purchase order
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 })
    }

    await client.query('DELETE FROM purchase_order_items WHERE id = $1', [id])
    return NextResponse.json({ message: 'Purchase order item deleted successfully' })
  } catch (error) {
    console.error('Error deleting purchase order item:', error)
    return NextResponse.json({ error: 'Failed to delete purchase order item' }, { status: 500 })
  }
}
