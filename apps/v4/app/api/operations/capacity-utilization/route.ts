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

// GET - Fetch utilization for a capacity plan
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const planId = searchParams.get('planId')

    if (!planId) {
      return NextResponse.json({ error: 'Plan ID is required' }, { status: 400 })
    }

    const result = await client.query(
      `SELECT 
        cu.*,
        rc.resource_name,
        rc.resource_type,
        rc.capacity_unit
       FROM capacity_utilization cu
       JOIN resource_capacity rc ON cu.resource_capacity_id = rc.id
       WHERE cu.capacity_plan_id = $1 
       ORDER BY cu.date DESC, rc.resource_name`,
      [planId]
    )
    
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching capacity utilization:', error)
    return NextResponse.json({ error: 'Failed to fetch capacity utilization' }, { status: 500 })
  }
}

// POST - Create new utilization record
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      capacity_plan_id, resource_capacity_id, date, 
      planned_utilization, actual_utilization, status, notes 
    } = body

    const result = await client.query(
      `INSERT INTO capacity_utilization 
       (capacity_plan_id, resource_capacity_id, date, planned_utilization, 
        actual_utilization, status, notes) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [capacity_plan_id, resource_capacity_id, date, planned_utilization, 
       actual_utilization, status || 'planned', notes]
    )
    
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error creating capacity utilization:', error)
    return NextResponse.json({ error: 'Failed to create capacity utilization' }, { status: 500 })
  }
}

// PATCH - Update utilization record
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, planned_utilization, actual_utilization, status, notes } = body

    if (!id) {
      return NextResponse.json({ error: 'Utilization ID is required' }, { status: 400 })
    }

    const result = await client.query(
      `UPDATE capacity_utilization 
       SET planned_utilization = COALESCE($1, planned_utilization),
           actual_utilization = COALESCE($2, actual_utilization),
           status = COALESCE($3, status),
           notes = COALESCE($4, notes),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [planned_utilization, actual_utilization, status, notes, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Utilization record not found' }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating capacity utilization:', error)
    return NextResponse.json({ error: 'Failed to update capacity utilization' }, { status: 500 })
  }
}

// DELETE - Remove utilization record
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Utilization ID is required' }, { status: 400 })
    }

    await client.query('DELETE FROM capacity_utilization WHERE id = $1', [id])
    return NextResponse.json({ message: 'Utilization record deleted successfully' })
  } catch (error) {
    console.error('Error deleting capacity utilization:', error)
    return NextResponse.json({ error: 'Failed to delete capacity utilization' }, { status: 500 })
  }
}
