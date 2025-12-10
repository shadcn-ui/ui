import { NextRequest, NextResponse } from 'next/server'
import { query, withTransaction } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'company', 'source']
    const missingFields = requiredFields.filter(field => !body[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Create the lead in the database
    const result = await withTransaction(async (client) => {
      // First, get the source_id and status_id from lookup tables
      const sourceResult = await client.query(
        'SELECT id FROM lead_sources WHERE name = $1',
        [body.source]
      )
      
      if (sourceResult.rows.length === 0) {
        throw new Error(`Invalid lead source: ${body.source}`)
      }
      
      const statusResult = await client.query(
        'SELECT id FROM lead_statuses WHERE name = $1',
        [body.status || 'New']
      )
      
      if (statusResult.rows.length === 0) {
        throw new Error(`Invalid lead status: ${body.status || 'New'}`)
      }

      // Get assigned user ID if provided
      let assignedToId = null
      if (body.assignedTo) {
        const userResult = await client.query(
          'SELECT id FROM users WHERE email = $1',
          [body.assignedTo]
        )
        if (userResult.rows.length > 0) {
          assignedToId = userResult.rows[0].id
        }
      }

      // Insert the new lead
      const insertResult = await client.query(`
        INSERT INTO leads (
          first_name, last_name, email, phone, company, job_title, website,
          address, city, state, zip_code, country,
          source_id, status_id, assigned_to, estimated_value, notes
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
        ) RETURNING *
      `, [
        body.firstName,
        body.lastName,
        body.email,
        body.phone || null,
        body.company,
        body.jobTitle || null,
        body.website || null,
        body.address || null,
        body.city || null,
        body.state || null,
        body.zipCode || null,
        // Ensure country is always a valid 2-character code
        (body.country && body.country.length === 2) ? body.country : 'US',
        sourceResult.rows[0].id,
        statusResult.rows[0].id,
        assignedToId,
        parseFloat(body.estimatedValue) || 0,
        body.notes || null
      ])

      return insertResult.rows[0]
    })

    // Fetch the complete lead data with related information
    const leadWithDetails = await query(`
      SELECT 
        l.*,
        ls.name as source_name,
        lst.name as status_name,
        u.first_name || ' ' || u.last_name as assigned_name
      FROM leads l
      LEFT JOIN lead_sources ls ON l.source_id = ls.id
      LEFT JOIN lead_statuses lst ON l.status_id = lst.id
      LEFT JOIN users u ON l.assigned_to = u.id
      WHERE l.id = $1
    `, [result.id])

    return NextResponse.json({
      success: true,
      lead: leadWithDetails.rows[0],
      message: 'Lead created successfully'
    })

  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json(
      { error: 'Failed to create lead', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Fetch all leads with related data
    const result = await query(`
      SELECT 
        l.*,
        ls.name as source_name,
        lst.name as status_name,
        lst.color as status_color,
        u.first_name || ' ' || u.last_name as assigned_name
      FROM leads l
      LEFT JOIN lead_sources ls ON l.source_id = ls.id
      LEFT JOIN lead_statuses lst ON l.status_id = lst.id
      LEFT JOIN users u ON l.assigned_to = u.id
      ORDER BY l.created_at DESC
    `)

    return NextResponse.json({
      success: true,
      leads: result.rows
    })

  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}