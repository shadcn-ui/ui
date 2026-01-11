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
      SELECT * FROM quality_inspections 
      ORDER BY inspection_date DESC, created_at DESC
    `)
    
    return NextResponse.json({ inspections: result.rows })
  } catch (error) {
    console.error('Error fetching quality inspections:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quality inspections' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      product_name,
      inspection_date,
      inspector_name,
      pass_quantity,
      fail_quantity,
      notes,
    } = body

    // Generate inspection number
    const countResult = await client.query(
      'SELECT COUNT(*) as count FROM quality_inspections'
    )
    const count = parseInt(countResult.rows[0].count) + 1
    const year = new Date().getFullYear()
    const inspection_number = `QI-${year}-${count.toString().padStart(4, '0')}`

    const result = await client.query(
      `INSERT INTO quality_inspections 
       (inspection_number, product_name, inspection_date, inspector_name, status, pass_quantity, fail_quantity, notes) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [inspection_number, product_name, inspection_date, inspector_name, 'pending', pass_quantity, fail_quantity, notes]
    )

    return NextResponse.json({ inspection: result.rows[0] }, { status: 201 })
  } catch (error) {
    console.error('Error creating quality inspection:', error)
    return NextResponse.json(
      { error: 'Failed to create quality inspection' },
      { status: 500 }
    )
  }
}
