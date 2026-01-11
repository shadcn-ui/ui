import { NextRequest, NextResponse } from 'next/server'
import { Client } from 'pg'

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'ocean-erp',
  user: process.env.DB_USER || 'mac',
  password: process.env.DB_PASSWORD || '',
})

client.connect()

export async function GET() {
  try {
    const result = await client.query(`
      SELECT * FROM suppliers 
      ORDER BY company_name ASC
    `)
    
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching suppliers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch suppliers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      company_name,
      supplier_code,
      contact_person,
      email,
      phone,
      address,
      city,
      state,
      country,
      postal_code,
      payment_terms,
      notes,
    } = body

    // Auto-generate supplier code if not provided
    const code = supplier_code || `SUP-${Date.now().toString().slice(-6)}`

    const result = await client.query(
      `INSERT INTO suppliers 
       (supplier_code, company_name, contact_person, email, phone, address, 
        city, state, country, postal_code, payment_terms, status, notes) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
       RETURNING *`,
      [code, company_name, contact_person, email, phone, address,
       city, state, country, postal_code, payment_terms || 'Net 30', 'Active', notes]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error('Error creating supplier:', error)
    return NextResponse.json(
      { error: 'Failed to create supplier' },
      { status: 500 }
    )
  }
}
