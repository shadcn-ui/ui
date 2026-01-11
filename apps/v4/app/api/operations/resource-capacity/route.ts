import { NextResponse } from 'next/server'
import { Client } from 'pg'

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'ocean-erp',
  user: process.env.DB_USER || 'mac',
  password: process.env.DB_PASSWORD || '',
})

client.connect().catch((err) => console.error('Database connection error:', err))

// GET - Fetch resources for a capacity plan
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const planId = searchParams.get('planId')

    if (!planId) {
      return NextResponse.json({ error: 'Plan ID is required' }, { status: 400 })
    }

    const result = await client.query(
      `SELECT * FROM resource_capacity 
       WHERE capacity_plan_id = $1 
       ORDER BY resource_type, resource_name`,
      [planId]
    )
    
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching resource capacity:', error)
    return NextResponse.json({ error: 'Failed to fetch resource capacity' }, { status: 500 })
  }
}

// POST - Create new resource capacity
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      capacity_plan_id, resource_type, resource_name, resource_id, 
      available_capacity, capacity_unit, efficiency_rate, cost_per_unit, notes 
    } = body

    const result = await client.query(
      `INSERT INTO resource_capacity 
       (capacity_plan_id, resource_type, resource_name, resource_id, available_capacity, 
        capacity_unit, efficiency_rate, cost_per_unit, notes) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [
        capacity_plan_id, resource_type, resource_name, resource_id || null,
        available_capacity, capacity_unit, efficiency_rate || 100, cost_per_unit || 0, notes || null
      ]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error('Error creating resource capacity:', error)
    return NextResponse.json({ error: 'Failed to create resource capacity' }, { status: 500 })
  }
}

// PATCH - Update resource capacity
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { 
      id, resource_type, resource_name, resource_id, available_capacity, 
      capacity_unit, efficiency_rate, cost_per_unit, notes 
    } = body

    const result = await client.query(
      `UPDATE resource_capacity 
       SET resource_type = $1, 
           resource_name = $2, 
           resource_id = $3, 
           available_capacity = $4,
           capacity_unit = $5,
           efficiency_rate = $6,
           cost_per_unit = $7,
           notes = $8,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9 
       RETURNING *`,
      [resource_type, resource_name, resource_id, available_capacity, capacity_unit, efficiency_rate, cost_per_unit, notes, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Resource capacity not found' }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating resource capacity:', error)
    return NextResponse.json({ error: 'Failed to update resource capacity' }, { status: 500 })
  }
}

// DELETE - Delete resource capacity
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Resource ID is required' }, { status: 400 })
    }

    const result = await client.query(
      'DELETE FROM resource_capacity WHERE id = $1 RETURNING *',
      [id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Resource capacity not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Resource capacity deleted successfully' })
  } catch (error) {
    console.error('Error deleting resource capacity:', error)
    return NextResponse.json({ error: 'Failed to delete resource capacity' }, { status: 500 })
  }
}
