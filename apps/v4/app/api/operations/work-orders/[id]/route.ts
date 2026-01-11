import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  user: process.env.DB_USER || 'mac',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'ocean-erp',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '5432'),
})

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const id = Number(resolvedParams.id)
  
  try {
    const body = await request.json()
    const { status } = body

    const client = await pool.connect()
    try {
      const result = await client.query(
        `UPDATE work_orders 
        SET status = $1, updated_at = NOW() 
        WHERE id = $2 
        RETURNING *`,
        [status, id]
      )
      
      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Work order not found' }, { status: 404 })
      }
      
      return NextResponse.json({ workOrder: result.rows[0] })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error updating work order:', error)
    return NextResponse.json({ error: 'Failed to update work order' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const id = Number(resolvedParams.id)
  
  try {
    const client = await pool.connect()
    try {
      const result = await client.query('DELETE FROM work_orders WHERE id = $1 RETURNING id', [id])
      
      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Work order not found' }, { status: 404 })
      }
      
      return NextResponse.json({ message: 'Work order deleted successfully' })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error deleting work order:', error)
    return NextResponse.json({ error: 'Failed to delete work order' }, { status: 500 })
  }
}
