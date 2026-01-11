import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  user: process.env.DB_USER || 'mac',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'ocean-erp',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '5432'),
})

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const quotationId = Number(id)
  try {
    const client = await pool.connect()
    try {
      const res = await client.query('SELECT * FROM quotation_items WHERE quotation_id = $1 ORDER BY id', [quotationId])
      return NextResponse.json({ items: res.rows })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('GET /api/quotations/[id]/items error', error)
    return NextResponse.json({ items: [] })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const quotationId = Number(id)
  try {
    const body = await request.json()
    const description = body.description || ''
    const quantity = parseFloat(body.quantity) || 1
    const unit_price = parseFloat(body.unit_price) || 0
    const line_total = Number((quantity * unit_price).toFixed(2))

    const client = await pool.connect()
    try {
      const res = await client.query(
        `INSERT INTO quotation_items (quotation_id, description, quantity, unit_price, line_total, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,NOW(),NOW()) RETURNING *`,
        [quotationId, description, quantity, unit_price, line_total]
      )

      // Recalculate quotation total
      const sumRes = await client.query('SELECT SUM(line_total) as total FROM quotation_items WHERE quotation_id = $1', [quotationId])
      const totalValue = parseFloat(sumRes.rows[0].total) || 0
      await client.query('UPDATE quotations SET total_value = $1, updated_at = NOW() WHERE id = $2', [totalValue, quotationId])

      return NextResponse.json({ item: res.rows[0], total: totalValue }, { status: 201 })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('POST /api/quotations/[id]/items error', error)
    return NextResponse.json({ error: 'Failed to add item' }, { status: 500 })
  }
}
