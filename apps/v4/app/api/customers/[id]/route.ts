import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  user: process.env.DB_USER || 'mac',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'ocean-erp',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '5432'),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const client = await pool.connect()
    try {
      const result = await client.query('SELECT * FROM customers WHERE id = $1', [id])
      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
      }
      return NextResponse.json({ customer: result.rows[0] })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('GET /api/customers/[id] error', error)
    return NextResponse.json({ error: 'Failed to fetch customer' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const body = await request.json()
    
    const client = await pool.connect()
    try {
      const fields: string[] = []
      const values: any[] = []
      let idx = 1

      const allowedFields = [
        'company_name', 'contact_person', 'email', 'phone', 'mobile', 'website',
        'customer_type', 'industry', 'customer_status',
        'billing_address', 'billing_city', 'billing_state', 'billing_country', 'billing_postal_code',
        'shipping_address', 'shipping_city', 'shipping_state', 'shipping_country', 'shipping_postal_code',
        'credit_limit', 'payment_terms', 'tax_id',
        'lead_id', 'assigned_to', 'notes', 'tags'
      ]

      // normalize some incoming fields to actual DB columns
      if (body.contact_person !== undefined) {
        // split into first/last (best effort)
        const parts = String(body.contact_person).trim().split(/\s+/)
        body.contact_first_name = parts.shift() || null
        body.contact_last_name = parts.join(' ') || null
      }
      if (body.status !== undefined) {
        // map status -> is_active boolean
        body.is_active = String(body.status).toLowerCase() === 'active'
      }

      // Allowed DB column mapping: accept contact_first_name/contact_last_name as writable
      const dbAllowed = new Set([
        'company_name', 'contact_first_name', 'contact_last_name', 'email', 'phone', 'mobile', 'website',
        'customer_type', 'industry', 'customer_status',
        'billing_address', 'billing_city', 'billing_state', 'billing_country', 'billing_postal_code',
        'shipping_address', 'shipping_city', 'shipping_state', 'shipping_country', 'shipping_postal_code',
        'credit_limit', 'payment_terms', 'tax_id',
        'lead_id', 'assigned_to', 'notes', 'tags', 'is_active'
      ])

      for (const key of Object.keys(body)) {
        if (dbAllowed.has(key)) {
          fields.push(`${key} = $${idx}`)
          values.push(body[key])
          idx++
        }
      }

      if (fields.length === 0) {
        return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
      }

      values.push(id)
      const query = `UPDATE customers SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${idx} RETURNING *`
      
      const result = await client.query(query, values)
      
      return NextResponse.json({ 
        message: 'Customer updated', 
        customer: result.rows[0] 
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('PATCH /api/customers/[id] error', error)
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const client = await pool.connect()
    try {
      await client.query('DELETE FROM customers WHERE id = $1', [id])
      return NextResponse.json({ message: 'Customer deleted' })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('DELETE /api/customers/[id] error', error)
    return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 })
  }
}
