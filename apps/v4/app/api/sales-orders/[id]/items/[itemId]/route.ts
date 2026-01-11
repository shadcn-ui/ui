import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  user: process.env.DB_USER || 'mac',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'ocean-erp',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '5432'),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  try {
    const { id: orderId, itemId } = await params
    const body = await request.json()
    
    const client = await pool.connect()
    try {
      const fields: string[] = []
      const values: any[] = []
      let idx = 1

      const allowedFields = [
        'product_code', 'product_name', 'description',
        'quantity', 'unit_price', 'discount_percent', 'discount_amount',
        'tax_percent', 'tax_amount', 'line_total',
        'warehouse_location', 'serial_number'
      ]

      for (const field of allowedFields) {
        if (body[field] !== undefined) {
          fields.push(`${field} = $${idx}`)
          values.push(body[field])
          idx++
        }
      }

      if (fields.length === 0) {
        return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
      }

      values.push(itemId)
      const query = `UPDATE sales_order_items SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${idx} RETURNING *`
      
      const result = await client.query(query, values)

      // Recalculate order totals
      const totalsResult = await client.query(
        `SELECT 
          COALESCE(SUM(line_total), 0) as subtotal,
          COALESCE(SUM(tax_amount), 0) as tax_total,
          COALESCE(SUM(discount_amount), 0) as discount_total
        FROM sales_order_items WHERE sales_order_id = $1`,
        [orderId]
      )
      
      const { subtotal, tax_total, discount_total } = totalsResult.rows[0]
      const total = parseFloat(subtotal) + parseFloat(tax_total) - parseFloat(discount_total)

      await client.query(
        `UPDATE sales_orders 
         SET subtotal = $1, tax_amount = $2, discount_amount = $3, total_amount = $4, updated_at = NOW() 
         WHERE id = $5`,
        [subtotal, tax_total, discount_total, total, orderId]
      )

      return NextResponse.json({ 
        message: 'Order item updated', 
        item: result.rows[0] 
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('PATCH /api/sales-orders/[id]/items/[itemId] error', error)
    return NextResponse.json({ error: 'Failed to update order item' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  try {
    const { id: orderId, itemId } = await params
    const client = await pool.connect()
    try {
      await client.query('DELETE FROM sales_order_items WHERE id = $1', [itemId])

      // Recalculate order totals
      const totalsResult = await client.query(
        `SELECT 
          COALESCE(SUM(line_total), 0) as subtotal,
          COALESCE(SUM(tax_amount), 0) as tax_total,
          COALESCE(SUM(discount_amount), 0) as discount_total
        FROM sales_order_items WHERE sales_order_id = $1`,
        [orderId]
      )
      
      const { subtotal, tax_total, discount_total } = totalsResult.rows[0]
      const total = parseFloat(subtotal) + parseFloat(tax_total) - parseFloat(discount_total)

      await client.query(
        `UPDATE sales_orders 
         SET subtotal = $1, tax_amount = $2, discount_amount = $3, total_amount = $4, updated_at = NOW() 
         WHERE id = $5`,
        [subtotal, tax_total, discount_total, total, orderId]
      )

      return NextResponse.json({ message: 'Order item deleted' })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('DELETE /api/sales-orders/[id]/items/[itemId] error', error)
    return NextResponse.json({ error: 'Failed to delete order item' }, { status: 500 })
  }
}
