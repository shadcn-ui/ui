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
      const res = await client.query('SELECT * FROM quotations WHERE id = $1', [quotationId])
      if (res.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      const quotation = res.rows[0]
      return NextResponse.json({ quotation })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('GET /api/quotations/[id] error', error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const quotationId = Number(id)
  try {
    const body = await request.json()
    const fields: string[] = []
    const values: any[] = []
    let idx = 1
    for (const key of ['reference_number', 'customer', 'status', 'valid_until', 'total_value']) {
      if (body[key] !== undefined) {
        fields.push(`${key} = $${idx}`)
        values.push(body[key])
        idx++
      }
    }
    if (fields.length === 0) return NextResponse.json({ error: 'No fields' }, { status: 400 })
    values.push(quotationId)
    const client = await pool.connect()
    try {
      const query = `UPDATE quotations SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${idx} RETURNING *`
      const res = await client.query(query, values)
      return NextResponse.json({ quotation: res.rows[0] })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('PATCH /api/quotations/[id] error', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
