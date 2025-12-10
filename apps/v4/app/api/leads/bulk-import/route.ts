import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  user: 'mac',
  password: '',
  host: 'localhost',
  port: 5432,
  database: 'ocean-erp',
})

interface LeadImportData {
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  jobTitle: string
  website: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  source: string
  status: string
  assignedTo: string
  estimatedValue: string
  notes: string
}

export async function POST(request: NextRequest) {
  try {
    const { leads }: { leads: LeadImportData[] } = await request.json()

    if (!leads || !Array.isArray(leads) || leads.length === 0) {
      return NextResponse.json(
        { error: 'No valid leads provided' },
        { status: 400 }
      )
    }

    const client = await pool.connect()
    
    try {
      // Start transaction
      await client.query('BEGIN')

      // Get lookup data for foreign keys
      const sourcesResult = await client.query('SELECT id, name FROM lead_sources')
      const statusesResult = await client.query('SELECT id, name FROM lead_statuses')
      const usersResult = await client.query('SELECT id, email, first_name, last_name FROM users')

      const sources = sourcesResult.rows.reduce((acc: any, row: any) => {
        acc[row.name.toLowerCase()] = row.id
        return acc
      }, {})

      const statuses = statusesResult.rows.reduce((acc: any, row: any) => {
        acc[row.name.toLowerCase()] = row.id
        return acc
      }, {})

      const users = usersResult.rows.reduce((acc: any, row: any) => {
        const fullName = `${row.first_name} ${row.last_name}`.toLowerCase()
        const email = row.email.toLowerCase()
        acc[fullName] = row.id
        acc[email] = row.id
        return acc
      }, {})

      let successCount = 0
      let errorCount = 0
      const errors: string[] = []

      // Process each lead
      for (const [index, lead] of leads.entries()) {
        try {
          // Convert source, status, and assignedTo to IDs
          const sourceId = lead.source ? sources[lead.source.toLowerCase()] || null : null
          const statusId = lead.status ? statuses[lead.status.toLowerCase()] || null : null
          const assignedToId = lead.assignedTo ? users[lead.assignedTo.toLowerCase()] || null : null
          
          // Convert estimated value to number
          const estimatedValue = lead.estimatedValue ? parseFloat(lead.estimatedValue) : null

          const insertQuery = `
            INSERT INTO leads (
              first_name, last_name, email, phone, company, job_title, website,
              address, city, state, zip_code, country,
              source_id, status_id, assigned_to, estimated_value, notes,
              created_at, updated_at
            ) VALUES (
              $1, $2, $3, $4, $5, $6, $7,
              $8, $9, $10, $11, $12,
              $13, $14, $15, $16, $17,
              NOW(), NOW()
            )
          `

          const values = [
            lead.firstName,
            lead.lastName,
            lead.email,
            lead.phone || null,
            lead.company || null,
            lead.jobTitle || null,
            lead.website || null,
            lead.address || null,
            lead.city || null,
            lead.state || null,
            lead.zipCode || null,
            lead.country || null,
            sourceId,
            statusId,
            assignedToId,
            estimatedValue,
            lead.notes || null
          ]

          await client.query(insertQuery, values)
          successCount++

        } catch (error: any) {
          errorCount++
          errors.push(`Row ${index + 1}: ${error.message}`)
          console.error(`Error inserting lead at row ${index + 1}:`, error)
        }
      }

      // Commit transaction if at least some leads were successful
      if (successCount > 0) {
        await client.query('COMMIT')
      } else {
        await client.query('ROLLBACK')
      }

      return NextResponse.json({
        success: true,
        message: `Successfully imported ${successCount} leads`,
        imported: successCount,
        errors: errorCount,
        errorDetails: errors.length > 0 ? errors : undefined
      })

    } catch (error: any) {
      await client.query('ROLLBACK')
      console.error('Database error during bulk import:', error)
      return NextResponse.json(
        { error: 'Database error occurred during import' },
        { status: 500 }
      )
    } finally {
      client.release()
    }

  } catch (error: any) {
    console.error('Error in bulk import:', error)
    return NextResponse.json(
      { error: 'Failed to process bulk import request' },
      { status: 500 }
    )
  }
}