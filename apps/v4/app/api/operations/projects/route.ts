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

export async function GET() {
  try {
    const result = await client.query(`
      SELECT * FROM projects 
      ORDER BY created_at DESC
    `)
    
    return NextResponse.json({ projects: result.rows })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      project_name,
      description,
      priority,
      start_date,
      end_date,
      budget,
      manager_name,
    } = body

    // Generate project number
    const countResult = await client.query(
      'SELECT COUNT(*) as count FROM projects'
    )
    const count = parseInt(countResult.rows[0].count) + 1
    const year = new Date().getFullYear()
    const project_number = `PRJ-${year}-${count.toString().padStart(4, '0')}`

    const result = await client.query(
      `INSERT INTO projects 
       (project_number, project_name, description, status, priority, start_date, end_date, budget, progress, manager_name) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING *`,
      [project_number, project_name, description, 'planning', priority, start_date, end_date, budget, 0, manager_name]
    )

    return NextResponse.json({ project: result.rows[0] }, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
