import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function GET(request: NextRequest) {
  try {
    const client = await pool.connect()

    try {
      const result = await client.query(
        `SELECT 
          l.id,
          l.code,
          l.name,
          l.type,
          l.address,
          l.city,
          l.province,
          l.is_active,
          COALESCE(m.total_inventory_value, 0) as total_inventory_value,
          COALESCE(m.total_items, 0) as total_items,
          COALESCE(m.capacity_utilization, 0) as capacity_utilization
        FROM locations l
        LEFT JOIN location_metrics m ON l.id = m.location_id AND m.metric_date = CURRENT_DATE
        ORDER BY l.type, l.name`
      )

      return NextResponse.json(result.rows)
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error fetching locations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { code, name, type, address, city, province } = await request.json()

    if (!code || !name || !type || !address || !city || !province) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    const client = await pool.connect()

    try {
      const result = await client.query(
        `INSERT INTO locations (code, name, type, address, city, province)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [code, name, type, address, city, province]
      )

      return NextResponse.json(result.rows[0], { status: 201 })
    } finally {
      client.release()
    }
  } catch (error: any) {
    console.error('Error creating location:', error)
    
    if (error.code === '23505') { // Unique violation
      return NextResponse.json(
        { error: 'Location code already exists' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create location' },
      { status: 500 }
    )
  }
}
