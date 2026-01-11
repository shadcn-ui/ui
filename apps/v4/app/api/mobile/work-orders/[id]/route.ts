import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json()
    const workOrderId = params.id

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    const client = await pool.connect()

    try {
      await client.query('BEGIN')

      // Update work order status
      const updateQuery = `
        UPDATE work_orders 
        SET 
          status = $1,
          ${status === 'in_progress' ? 'started_at = COALESCE(started_at, NOW()),' : ''}
          ${status === 'completed' ? 'completed_at = NOW(),' : ''}
          updated_at = NOW()
        WHERE id = $2
        RETURNING *
      `

      const result = await client.query(updateQuery, [status, workOrderId])

      if (result.rows.length === 0) {
        await client.query('ROLLBACK')
        return NextResponse.json(
          { error: 'Work order not found' },
          { status: 404 }
        )
      }

      await client.query('COMMIT')

      return NextResponse.json({
        success: true,
        message: `Work order ${status === 'in_progress' ? 'started' : status === 'paused' ? 'paused' : 'completed'} successfully`
      })
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error updating work order:', error)
    return NextResponse.json(
      { error: 'Failed to update work order' },
      { status: 500 }
    )
  }
}
