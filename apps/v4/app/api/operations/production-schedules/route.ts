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
      SELECT * FROM production_schedules 
      ORDER BY scheduled_date DESC, created_at DESC
    `)
    
    return NextResponse.json({ schedules: result.rows })
  } catch (error) {
    console.error('Error fetching production schedules:', error)
    return NextResponse.json(
      { error: 'Failed to fetch production schedules' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      product_name,
      planned_quantity,
      production_line_id,
      scheduled_date,
      shift,
      notes,
    } = body

    // Generate schedule number
    const countResult = await client.query(
      'SELECT COUNT(*) as count FROM production_schedules'
    )
    const count = parseInt(countResult.rows[0].count) + 1
    const year = new Date().getFullYear()
    const schedule_number = `PS-${year}-${count.toString().padStart(4, '0')}`

    const result = await client.query(
      `INSERT INTO production_schedules 
       (schedule_number, product_name, planned_quantity, production_line_id, scheduled_date, shift, status, notes) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [schedule_number, product_name, planned_quantity, production_line_id, scheduled_date, shift, 'scheduled', notes]
    )

    return NextResponse.json({ schedule: result.rows[0] }, { status: 201 })
  } catch (error) {
    console.error('Error creating production schedule:', error)
    return NextResponse.json(
      { error: 'Failed to create production schedule' },
      { status: 500 }
    )
  }
}
