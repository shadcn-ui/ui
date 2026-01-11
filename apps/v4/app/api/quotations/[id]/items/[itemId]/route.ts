import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  user: process.env.DB_USER || 'mac',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'ocean-erp',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '5432'),
})

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string; itemId: string }> }) {
  const { id, itemId } = await params
  const quotationId = Number(id)
  const itemIdNum = Number(itemId)
  try {
    const body = await request.json()
    const description = body.description || null
    const quantity = body.quantity !== undefined ? parseFloat(body.quantity) : null
    const unit_price = body.unit_price !== undefined ? parseFloat(body.unit_price) : null

    const client = await pool.connect()
    try {
      // Build update dynamically
      const sets: string[] = []
      const values: any[] = []
      let idx = 1
      if (description !== null) { sets.push(`description = $${idx++}`); values.push(description) }
      if (quantity !== null) { sets.push(`quantity = $${idx++}`); values.push(quantity) }
      if (unit_price !== null) { sets.push(`unit_price = $${idx++}`); values.push(unit_price) }

      if (sets.length === 0) return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })

      // If quantity or unit_price changes, recompute line_total
      let recomputeLineTotal = false
      if (quantity !== null || unit_price !== null) recomputeLineTotal = true

      if (recomputeLineTotal) {
        // fetch existing values if necessary
        const cur = await client.query('SELECT quantity, unit_price FROM quotation_items WHERE id = $1 AND quotation_id = $2', [itemIdNum, quotationId])
        if (cur.rowCount === 0) return NextResponse.json({ error: 'Item not found' }, { status: 404 })
        const curQty = quantity !== null ? quantity : parseFloat(cur.rows[0].quantity)
        const curUnit = unit_price !== null ? unit_price : parseFloat(cur.rows[0].unit_price)
        const line_total = Number((curQty * curUnit).toFixed(2))
        sets.push(`line_total = $${idx++}`)
        values.push(line_total)
      }

      values.push(itemIdNum)
      values.push(quotationId)
      const query = `UPDATE quotation_items SET ${sets.join(', ')}, updated_at = NOW() WHERE id = $${idx++} AND quotation_id = $${idx++} RETURNING *`
      const res = await client.query(query, values)
      if (res.rowCount === 0) return NextResponse.json({ error: 'Item not found' }, { status: 404 })

      // Recalculate quotation total
      const sumRes = await client.query('SELECT SUM(line_total) as total FROM quotation_items WHERE quotation_id = $1', [quotationId])
      const totalValue = parseFloat(sumRes.rows[0].total) || 0
      await client.query('UPDATE quotations SET total_value = $1, updated_at = NOW() WHERE id = $2', [totalValue, quotationId])

      return NextResponse.json({ item: res.rows[0], total: totalValue })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('PATCH /api/quotations/[id]/items/[itemId] error', error)
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string; itemId: string }> }) {
  const { id, itemId } = await params
  const quotationId = Number(id)
  const itemIdNum = Number(itemId)
  try {
    const client = await pool.connect()
    try {
      const del = await client.query('DELETE FROM quotation_items WHERE id = $1 AND quotation_id = $2 RETURNING *', [itemIdNum, quotationId])
      if (del.rowCount === 0) return NextResponse.json({ error: 'Item not found' }, { status: 404 })

      // Recalculate quotation total
      const sumRes = await client.query('SELECT SUM(line_total) as total FROM quotation_items WHERE quotation_id = $1', [quotationId])
      const totalValue = parseFloat(sumRes.rows[0].total) || 0
      await client.query('UPDATE quotations SET total_value = $1, updated_at = NOW() WHERE id = $2', [totalValue, quotationId])

      return NextResponse.json({ success: true, total: totalValue })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('DELETE /api/quotations/[id]/items/[itemId] error', error)
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 })
  }
}
