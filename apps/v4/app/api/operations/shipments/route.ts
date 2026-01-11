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
      SELECT * FROM shipments 
      ORDER BY shipment_date DESC, created_at DESC
    `)
    
    return NextResponse.json({ shipments: result.rows })
  } catch (error) {
    console.error('Error fetching shipments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shipments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customer_name,
      destination_address,
      shipping_method,
      carrier_name,
      tracking_number,
      shipment_date,
      estimated_delivery,
      notes,
    } = body

    // Generate shipment number
    const countResult = await client.query(
      'SELECT COUNT(*) as count FROM shipments'
    )
    const count = parseInt(countResult.rows[0].count) + 1
    const year = new Date().getFullYear()
    const shipment_number = `SH-${year}-${count.toString().padStart(4, '0')}`

    const result = await client.query(
      `INSERT INTO shipments 
       (shipment_number, customer_name, destination_address, shipping_method, carrier_name, tracking_number, status, shipment_date, estimated_delivery, notes) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING *`,
      [shipment_number, customer_name, destination_address, shipping_method, carrier_name, tracking_number, 'pending', shipment_date, estimated_delivery, notes]
    )

    return NextResponse.json({ shipment: result.rows[0] }, { status: 201 })
  } catch (error) {
    console.error('Error creating shipment:', error)
    return NextResponse.json(
      { error: 'Failed to create shipment' },
      { status: 500 }
    )
  }
}
