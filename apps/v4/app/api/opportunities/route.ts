import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  user: process.env.DB_USER || 'mac',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'ocean_erp',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '5432'),
})

interface OpportunityData {
  title: string
  company: string
  contact: string
  email?: string
  phone?: string
  stage: string
  value: number
  probability: number
  expected_close_date?: string
  assigned_to?: string
  source?: string
  description?: string
  notes?: string
}

export async function GET() {
  try {
    const client = await pool.connect()
    
    try {
      const result = await client.query(`
        SELECT 
          id,
          title,
          company,
          contact,
          email,
          phone,
          stage,
          value,
          probability,
          expected_close_date,
          assigned_to,
          source,
          description,
          notes,
          created_at,
          updated_at
        FROM opportunities 
        ORDER BY created_at DESC
      `)
      
      return NextResponse.json({
        opportunities: result.rows,
        total: result.rows.length
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch opportunities' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['title', 'company', 'contact', 'stage', 'value']
    const missingFields = requiredFields.filter(field => !body[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          missingFields 
        },
        { status: 400 }
      )
    }

    // Validate stage
    const validStages = ['Discovery', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost']
    if (!validStages.includes(body.stage)) {
      return NextResponse.json(
        { error: 'Invalid stage' },
        { status: 400 }
      )
    }

    // Validate probability
    const probability = parseInt(body.probability) || 0
    if (probability < 0 || probability > 100) {
      return NextResponse.json(
        { error: 'Probability must be between 0 and 100' },
        { status: 400 }
      )
    }

    // Validate value
    const value = parseFloat(body.value)
    if (isNaN(value) || value < 0) {
      return NextResponse.json(
        { error: 'Value must be a positive number' },
        { status: 400 }
      )
    }

    const client = await pool.connect()
    
    try {
      await client.query('BEGIN')
      
      const opportunityData: OpportunityData = {
        title: body.title.trim(),
        company: body.company.trim(),
        contact: body.contact.trim(),
        email: body.email?.trim() || null,
        phone: body.phone?.trim() || null,
        stage: body.stage,
        value,
        probability,
        expected_close_date: body.expectedCloseDate || null,
        assigned_to: body.assignedTo?.trim() || null,
        source: body.source?.trim() || null,
        description: body.description?.trim() || null,
        notes: body.notes?.trim() || null
      }

      const result = await client.query(`
        INSERT INTO opportunities (
          title, company, contact, email, phone, stage, value, 
          probability, expected_close_date, assigned_to, source, 
          description, notes, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW()
        ) RETURNING *
      `, [
        opportunityData.title,
        opportunityData.company,
        opportunityData.contact,
        opportunityData.email,
        opportunityData.phone,
        opportunityData.stage,
        opportunityData.value,
        opportunityData.probability,
        opportunityData.expected_close_date,
        opportunityData.assigned_to,
        opportunityData.source,
        opportunityData.description,
        opportunityData.notes
      ])

      await client.query('COMMIT')
      
      return NextResponse.json({
        message: 'Opportunity created successfully',
        opportunity: result.rows[0]
      }, { status: 201 })
      
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
    
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to create opportunity' },
      { status: 500 }
    )
  }
}