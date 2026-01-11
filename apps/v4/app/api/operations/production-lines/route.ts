import { NextResponse } from 'next/server'
import { Client } from 'pg'

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'ocean-erp',
  user: process.env.DB_USER || 'mac',
  password: process.env.DB_PASSWORD || '',
})

client.connect()

export async function GET() {
  try {
    const result = await client.query(`
      SELECT * FROM production_lines 
      WHERE status = 'active'
      ORDER BY line_name ASC
    `)
    
    return NextResponse.json({ lines: result.rows })
  } catch (error) {
    console.error('Error fetching production lines:', error)
    return NextResponse.json(
      { error: 'Failed to fetch production lines' },
      { status: 500 }
    )
  }
}
