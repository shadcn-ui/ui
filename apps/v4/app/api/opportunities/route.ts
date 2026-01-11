import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  user: process.env.DB_USER || 'mac',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'ocean-erp',
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
  assigned_to?: string | null
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
          o.id,
          o.name,
          o.lead_id,
          o.stage,
          o.probability,
          o.amount,
          o.expected_close_date,
          o.assigned_to,
          o.description,
          o.notes,
          o.is_closed,
          o.is_won,
          o.closed_at,
          o.created_at,
          o.updated_at,
          l.first_name || ' ' || l.last_name as lead_name,
          l.company as lead_company,
          l.email as lead_email
        FROM opportunities o
        LEFT JOIN leads l ON o.lead_id = l.id
        ORDER BY o.created_at DESC
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
    const { name, amount, stage = 'prospecting', lead_id, probability = 0, expected_close_date, description, notes, assigned_to } = body
    
    if (!name || amount === undefined) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          missingFields: !name ? ['name'] : ['amount']
        },
        { status: 400 }
      )
    }

    // Validate probability
    const prob = parseInt(probability) || 0
    if (prob < 0 || prob > 100) {
      return NextResponse.json(
        { error: 'Probability must be between 0 and 100' },
        { status: 400 }
      )
    }

    // Validate amount
    const amountValue = parseFloat(amount)
    if (isNaN(amountValue) || amountValue < 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number' },
        { status: 400 }
      )
    }

    const client = await pool.connect()
    
    try {
      const result = await client.query(`
        INSERT INTO opportunities (
          name,
          lead_id,
          stage,
          probability,
          amount,
          expected_close_date,
          assigned_to,
          description,
          notes,
          is_closed,
          is_won,
          created_at,
          updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, false, false, NOW(), NOW())
        RETURNING *
      `, [
        name,
        lead_id || null,
        stage,
        prob,
        amountValue,
        expected_close_date || null,
        assigned_to || null,
        description || null,
        notes || null
      ])
      
      return NextResponse.json({
        message: 'Opportunity created successfully',
        opportunity: result.rows[0]
      }, { status: 201 })
      
    } catch (error) {
      console.error('Database error creating opportunity:', error)
      throw error
    } finally {
      client.release()
    }
    
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create opportunity',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}