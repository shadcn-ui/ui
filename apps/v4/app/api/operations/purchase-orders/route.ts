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

// GET - Fetch all purchase orders with details
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let query = `
      SELECT 
        po.*,
        s.company_name as supplier_name,
        s.supplier_code,
        (SELECT COUNT(*) FROM purchase_order_items WHERE purchase_order_id = po.id) as item_count
      FROM purchase_orders po
      LEFT JOIN suppliers s ON po.supplier_id = s.id
    `

    if (status) {
      query += ` WHERE po.status = $1`
    }

    query += ` ORDER BY po.order_date DESC, po.id DESC`

    const result = status 
      ? await client.query(query, [status])
      : await client.query(query)
    
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching purchase orders:', error)
    return NextResponse.json({ error: 'Failed to fetch purchase orders' }, { status: 500 })
  }
}

// POST - Create new purchase order
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      supplier_id, warehouse_id, order_date, expected_delivery_date,
      status, currency, payment_terms, shipping_method, shipping_address,
      notes, terms_and_conditions, items
    } = body

    // Generate PO number
    const poResult = await client.query(
      `SELECT COUNT(*) as count FROM purchase_orders`
    )
    const poCount = parseInt(poResult.rows[0].count) + 1
    const po_number = `PO-${new Date().getFullYear()}-${String(poCount).padStart(5, '0')}`

    // Insert purchase order
    const result = await client.query(
      `INSERT INTO purchase_orders 
       (po_number, supplier_id, warehouse_id, order_date, expected_delivery_date,
        status, currency, payment_terms, shipping_method, shipping_address,
        notes, terms_and_conditions) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
       RETURNING *`,
      [po_number, supplier_id, warehouse_id, order_date, expected_delivery_date,
       status || 'Draft', currency || 'IDR', payment_terms, shipping_method, 
       shipping_address, notes, terms_and_conditions]
    )

    const purchase_order_id = result.rows[0].id

    // Insert purchase order items if provided
    if (items && items.length > 0) {
      for (const item of items) {
        await client.query(
          `INSERT INTO purchase_order_items 
           (purchase_order_id, product_id, quantity_ordered, unit_price, 
            discount_percent, discount_amount, tax_percent, tax_amount, notes) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [purchase_order_id, item.product_id, item.quantity_ordered, item.unit_price,
           item.discount_percent || 0, item.discount_amount || 0, 
           item.tax_percent || 0, item.tax_amount || 0, item.notes]
        )
      }
    }

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error('Error creating purchase order:', error)
    return NextResponse.json({ error: 'Failed to create purchase order' }, { status: 500 })
  }
}

// PATCH - Update purchase order
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { 
      id, supplier_id, warehouse_id, order_date, expected_delivery_date,
      actual_delivery_date, status, payment_terms, shipping_method, 
      shipping_address, tracking_number, notes, terms_and_conditions
    } = body

    if (!id) {
      return NextResponse.json({ error: 'Purchase order ID is required' }, { status: 400 })
    }

    const result = await client.query(
      `UPDATE purchase_orders 
       SET supplier_id = COALESCE($1, supplier_id),
           warehouse_id = COALESCE($2, warehouse_id),
           order_date = COALESCE($3, order_date),
           expected_delivery_date = COALESCE($4, expected_delivery_date),
           actual_delivery_date = COALESCE($5, actual_delivery_date),
           status = COALESCE($6, status),
           payment_terms = COALESCE($7, payment_terms),
           shipping_method = COALESCE($8, shipping_method),
           shipping_address = COALESCE($9, shipping_address),
           tracking_number = COALESCE($10, tracking_number),
           notes = COALESCE($11, notes),
           terms_and_conditions = COALESCE($12, terms_and_conditions),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $13
       RETURNING *`,
      [supplier_id, warehouse_id, order_date, expected_delivery_date, actual_delivery_date,
       status, payment_terms, shipping_method, shipping_address, tracking_number,
       notes, terms_and_conditions, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Purchase order not found' }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating purchase order:', error)
    return NextResponse.json({ error: 'Failed to update purchase order' }, { status: 500 })
  }
}

// DELETE - Delete purchase order
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Purchase order ID is required' }, { status: 400 })
    }

    // Check if PO can be deleted (only Draft or Cancelled status)
    const checkResult = await client.query(
      `SELECT status FROM purchase_orders WHERE id = $1`,
      [id]
    )

    if (checkResult.rows.length === 0) {
      return NextResponse.json({ error: 'Purchase order not found' }, { status: 404 })
    }

    const status = checkResult.rows[0].status
    if (status !== 'Draft' && status !== 'Cancelled') {
      return NextResponse.json({ 
        error: 'Only Draft or Cancelled purchase orders can be deleted' 
      }, { status: 400 })
    }

    await client.query('DELETE FROM purchase_orders WHERE id = $1', [id])
    return NextResponse.json({ message: 'Purchase order deleted successfully' })
  } catch (error) {
    console.error('Error deleting purchase order:', error)
    return NextResponse.json({ error: 'Failed to delete purchase order' }, { status: 500 })
  }
}
