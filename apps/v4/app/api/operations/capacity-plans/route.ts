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

// GET - Fetch all capacity plans
export async function GET() {
  try {
    const result = await client.query(`
      SELECT 
        cp.*,
        COUNT(DISTINCT rc.id) as resource_count,
        COUNT(DISTINCT df.id) as demand_count,
        COUNT(DISTINCT ba.id) as bottleneck_count,
        COALESCE(SUM(rc.available_capacity), 0) as total_capacity,
        COALESCE(SUM(rc.effective_capacity), 0) as total_effective_capacity,
        COALESCE(SUM(df.required_capacity), 0) as total_demand,
        CASE 
          WHEN SUM(rc.effective_capacity) > 0 
          THEN (SUM(df.required_capacity) / SUM(rc.effective_capacity) * 100)
          ELSE 0
        END as utilization_rate
      FROM capacity_plans cp
      LEFT JOIN resource_capacity rc ON cp.id = rc.capacity_plan_id
      LEFT JOIN demand_forecasts df ON cp.id = df.capacity_plan_id
      LEFT JOIN bottleneck_analysis ba ON cp.id = ba.capacity_plan_id AND ba.status != 'resolved'
      GROUP BY cp.id
      ORDER BY cp.created_at DESC
    `)
    
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching capacity plans:', error)
    return NextResponse.json({ error: 'Failed to fetch capacity plans' }, { status: 500 })
  }
}

// POST - Create new capacity plan
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { plan_name, plan_code, planning_period, start_date, end_date, status, notes } = body

    const result = await client.query(
      `INSERT INTO capacity_plans 
       (plan_name, plan_code, planning_period, start_date, end_date, status, notes) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [plan_name, plan_code || null, planning_period, start_date, end_date, status || 'draft', notes || null]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error('Error creating capacity plan:', error)
    return NextResponse.json({ error: 'Failed to create capacity plan' }, { status: 500 })
  }
}

// PATCH - Update capacity plan
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, plan_name, plan_code, planning_period, start_date, end_date, status, notes } = body

    const result = await client.query(
      `UPDATE capacity_plans 
       SET plan_name = $1, 
           plan_code = $2, 
           planning_period = $3, 
           start_date = $4,
           end_date = $5,
           status = $6, 
           notes = $7,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8 
       RETURNING *`,
      [plan_name, plan_code, planning_period, start_date, end_date, status, notes, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Capacity plan not found' }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating capacity plan:', error)
    return NextResponse.json({ error: 'Failed to update capacity plan' }, { status: 500 })
  }
}

// DELETE - Delete capacity plan
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Capacity plan ID is required' }, { status: 400 })
    }

    const result = await client.query(
      'DELETE FROM capacity_plans WHERE id = $1 RETURNING *',
      [id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Capacity plan not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Capacity plan deleted successfully' })
  } catch (error) {
    console.error('Error deleting capacity plan:', error)
    return NextResponse.json({ error: 'Failed to delete capacity plan' }, { status: 500 })
  }
}
