import { NextRequest, NextResponse } from 'next/server'
import { query, withTransaction } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: leadId } = await params

    // Fetch the lead with related information
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
      WHERE l.id = $1
    `, [leadId])

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      lead: result.rows[0]
    })

  } catch (error) {
    console.error('Error fetching lead:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch lead' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: leadId } = await params
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'company', 'source']
    const missingFields = requiredFields.filter(field => !body[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Update the lead in the database
    const result = await withTransaction(async (client) => {
      // Get the source_id and status_id from lookup tables
      const sourceResult = await client.query(
        'SELECT id FROM lead_sources WHERE name = $1',
        [body.source]
      )
      
      if (sourceResult.rows.length === 0) {
        throw new Error(`Invalid lead source: ${body.source}`)
      }
      
      let statusId = null
      if (body.status) {
        const statusResult = await client.query(
          'SELECT id FROM lead_statuses WHERE name = $1',
          [body.status]
        )
        
        if (statusResult.rows.length === 0) {
          throw new Error(`Invalid lead status: ${body.status}`)
        }
        statusId = statusResult.rows[0].id
      }

      // Get assigned user ID if provided
      let assignedToId = null
      if (body.assignedTo) {
        const userResult = await client.query(
          'SELECT id FROM users WHERE first_name || \' \' || last_name = $1',
          [body.assignedTo]
        )
        if (userResult.rows.length > 0) {
          assignedToId = userResult.rows[0].id
        }
      }

      // Update the lead
      const updateResult = await client.query(`
        UPDATE leads SET
          first_name = $1,
          last_name = $2,
          email = $3,
          phone = $4,
          company = $5,
          job_title = $6,
          website = $7,
          address = $8,
          city = $9,
          state = $10,
          zip_code = $11,
          country = $12,
          source_id = $13,
          status_id = COALESCE($14, status_id),
          assigned_to = $15,
          estimated_value = $16,
          notes = $17,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $18
        RETURNING *
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
        statusId,
        assignedToId,
        parseFloat(body.estimatedValue) || 0,
        body.notes || null,
        leadId
      ])

      if (updateResult.rows.length === 0) {
        throw new Error('Lead not found or could not be updated')
      }

      return updateResult.rows[0]
    })

    // Fetch the updated lead data with related information
    const leadWithDetails = await query(`
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
      WHERE l.id = $1
    `, [leadId])

    return NextResponse.json({
      success: true,
      lead: leadWithDetails.rows[0],
      message: 'Lead updated successfully'
    })

  } catch (error) {
    console.error('Error updating lead:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to update lead' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: leadId } = await params

    // Check if lead exists first
    const checkResult = await query('SELECT id FROM leads WHERE id = $1', [leadId])
    
    if (checkResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      )
    }

    // Delete the lead
    await query('DELETE FROM leads WHERE id = $1', [leadId])

    return NextResponse.json({
      success: true,
      message: 'Lead deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting lead:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete lead' },
      { status: 500 }
    )
  }
}