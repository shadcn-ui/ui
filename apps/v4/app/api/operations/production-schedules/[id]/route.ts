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
    const { status } = body

    const result = await client.query(
      'UPDATE production_schedules SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Production schedule not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ schedule: result.rows[0] })
  } catch (error) {
    console.error('Error updating production schedule:', error)
    return NextResponse.json(
      { error: 'Failed to update production schedule' },
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
      'DELETE FROM production_schedules WHERE id = $1 RETURNING id',
      [id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Production schedule not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Production schedule deleted successfully' })
  } catch (error) {
    console.error('Error deleting production schedule:', error)
    return NextResponse.json(
      { error: 'Failed to delete production schedule' },
      { status: 500 }
    )
  }
}
