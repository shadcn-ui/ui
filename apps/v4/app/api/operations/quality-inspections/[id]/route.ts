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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = Number((await params).id)
    const body = await request.json()
    const { status, result } = body

    const updates: string[] = []
    const values: any[] = []
    let paramCount = 1

    if (status) {
      updates.push(`status = $${paramCount}`)
      values.push(status)
      paramCount++
    }

    if (result) {
      updates.push(`result = $${paramCount}`)
      values.push(result)
      paramCount++
    }

    updates.push(`updated_at = NOW()`)
    values.push(id)

    const result_query = await client.query(
      `UPDATE quality_inspections SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    )

    if (result_query.rows.length === 0) {
      return NextResponse.json(
        { error: 'Quality inspection not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ inspection: result_query.rows[0] })
  } catch (error) {
    console.error('Error updating quality inspection:', error)
    return NextResponse.json(
      { error: 'Failed to update quality inspection' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = Number((await params).id)

    const result = await client.query(
      'DELETE FROM quality_inspections WHERE id = $1 RETURNING id',
      [id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Quality inspection not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Quality inspection deleted successfully' })
  } catch (error) {
    console.error('Error deleting quality inspection:', error)
    return NextResponse.json(
      { error: 'Failed to delete quality inspection' },
      { status: 500 }
    )
  }
}
