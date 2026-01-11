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

// GET - Fetch bottleneck analysis for a capacity plan
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const planId = searchParams.get('planId')

    if (!planId) {
      return NextResponse.json({ error: 'Plan ID is required' }, { status: 400 })
    }

    const result = await client.query(
      `SELECT * FROM bottleneck_analysis 
       WHERE capacity_plan_id = $1 
       ORDER BY severity DESC, identified_date DESC`,
      [planId]
    )
    
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching bottleneck analysis:', error)
    return NextResponse.json({ error: 'Failed to fetch bottleneck analysis' }, { status: 500 })
  }
}

// POST - Create new bottleneck analysis
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      capacity_plan_id, resource_name, bottleneck_type, severity,
      impact_description, recommended_action, status 
    } = body

    const result = await client.query(
      `INSERT INTO bottleneck_analysis 
       (capacity_plan_id, resource_name, bottleneck_type, severity, 
        impact_description, recommended_action, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [
        capacity_plan_id, resource_name, bottleneck_type, severity || 'medium',
        impact_description || null, recommended_action || null, status || 'identified'
      ]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error('Error creating bottleneck analysis:', error)
    return NextResponse.json({ error: 'Failed to create bottleneck analysis' }, { status: 500 })
  }
}

// PATCH - Update bottleneck analysis
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { 
      id, resource_name, bottleneck_type, severity, impact_description, 
      recommended_action, status, resolved_date 
    } = body

    const result = await client.query(
      `UPDATE bottleneck_analysis 
       SET resource_name = $1, 
           bottleneck_type = $2, 
           severity = $3, 
           impact_description = $4,
           recommended_action = $5,
           status = $6,
           resolved_date = $7,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8 
       RETURNING *`,
      [resource_name, bottleneck_type, severity, impact_description, recommended_action, status, resolved_date, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Bottleneck analysis not found' }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating bottleneck analysis:', error)
    return NextResponse.json({ error: 'Failed to update bottleneck analysis' }, { status: 500 })
  }
}

// DELETE - Delete bottleneck analysis
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Bottleneck ID is required' }, { status: 400 })
    }

    const result = await client.query(
      'DELETE FROM bottleneck_analysis WHERE id = $1 RETURNING *',
      [id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Bottleneck analysis not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Bottleneck analysis deleted successfully' })
  } catch (error) {
    console.error('Error deleting bottleneck analysis:', error)
    return NextResponse.json({ error: 'Failed to delete bottleneck analysis' }, { status: 500 })
  }
}
