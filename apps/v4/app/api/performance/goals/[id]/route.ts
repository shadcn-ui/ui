import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  user: process.env.DB_USER || 'mac',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'ocean-erp',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '5432'),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const goalId = parseInt(id)

    const client = await pool.connect()
    try {
      const result = await client.query(
        `SELECT pg.*, CONCAT(u.first_name, ' ', u.last_name) as user_name, u.email
         FROM performance_goals pg
         JOIN users u ON pg.user_id = u.id
         WHERE pg.id = $1`,
        [goalId]
      )

      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
      }

      return NextResponse.json({ goal: result.rows[0] })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Failed to fetch goal:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch goal',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const goalId = parseInt(id)
    const body = await request.json()

    const allowedFields = [
      'target_value',
      'current_value',
      'status',
      'description'
    ]

    const updates: string[] = []
    const values: any[] = []
    let paramIndex = 1

    Object.keys(body).forEach(key => {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = $${paramIndex}`)
        values.push(body[key])
        paramIndex++
      }
    })

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    values.push(goalId)

    const client = await pool.connect()
    try {
      const result = await client.query(
        `UPDATE performance_goals 
         SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
         WHERE id = $${paramIndex}
         RETURNING *`,
        values
      )

      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
      }

      return NextResponse.json({ 
        message: 'Goal updated successfully',
        goal: result.rows[0]
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Failed to update goal:', error)
    return NextResponse.json({ 
      error: 'Failed to update goal',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const goalId = parseInt(id)

    const client = await pool.connect()
    try {
      const result = await client.query(
        'DELETE FROM performance_goals WHERE id = $1 RETURNING id',
        [goalId]
      )

      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
      }

      return NextResponse.json({ 
        message: 'Goal deleted successfully'
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Failed to delete goal:', error)
    return NextResponse.json({ 
      error: 'Failed to delete goal',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
