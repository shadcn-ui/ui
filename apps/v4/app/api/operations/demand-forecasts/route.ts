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

// GET - Fetch demand forecasts for a capacity plan
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const planId = searchParams.get('planId')

    if (!planId) {
      return NextResponse.json({ error: 'Plan ID is required' }, { status: 400 })
    }

    const result = await client.query(
      `SELECT * FROM demand_forecasts 
       WHERE capacity_plan_id = $1 
       ORDER BY priority DESC, product_name`,
      [planId]
    )
    
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching demand forecasts:', error)
    return NextResponse.json({ error: 'Failed to fetch demand forecasts' }, { status: 500 })
  }
}

// POST - Create new demand forecast
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      capacity_plan_id, product_name, product_code, forecasted_demand, 
      demand_unit, priority, required_capacity, notes 
    } = body

    const result = await client.query(
      `INSERT INTO demand_forecasts 
       (capacity_plan_id, product_name, product_code, forecasted_demand, demand_unit, 
        priority, required_capacity, notes) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [
        capacity_plan_id, product_name, product_code || null, forecasted_demand,
        demand_unit, priority || 'medium', required_capacity, notes || null
      ]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error('Error creating demand forecast:', error)
    return NextResponse.json({ error: 'Failed to create demand forecast' }, { status: 500 })
  }
}

// PATCH - Update demand forecast
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { 
      id, product_name, product_code, forecasted_demand, demand_unit, 
      priority, required_capacity, notes 
    } = body

    const result = await client.query(
      `UPDATE demand_forecasts 
       SET product_name = $1, 
           product_code = $2, 
           forecasted_demand = $3, 
           demand_unit = $4,
           priority = $5,
           required_capacity = $6,
           notes = $7,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8 
       RETURNING *`,
      [product_name, product_code, forecasted_demand, demand_unit, priority, required_capacity, notes, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Demand forecast not found' }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating demand forecast:', error)
    return NextResponse.json({ error: 'Failed to update demand forecast' }, { status: 500 })
  }
}

// DELETE - Delete demand forecast
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Forecast ID is required' }, { status: 400 })
    }

    const result = await client.query(
      'DELETE FROM demand_forecasts WHERE id = $1 RETURNING *',
      [id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Demand forecast not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Demand forecast deleted successfully' })
  } catch (error) {
    console.error('Error deleting demand forecast:', error)
    return NextResponse.json({ error: 'Failed to delete demand forecast' }, { status: 500 })
  }
}
