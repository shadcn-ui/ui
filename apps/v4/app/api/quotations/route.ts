import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { WorkflowEngine } from '@/lib/workflow-engine'

const pool = new Pool({
  user: process.env.DB_USER || 'mac',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'ocean-erp',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '5432'),
})

export async function GET() {
  try {
    const client = await pool.connect()
    try {
      const result = await client.query(`SELECT id, reference_number, customer, total_value, status, valid_until, lead_id, created_at FROM quotations ORDER BY created_at DESC`)
      return NextResponse.json({ quotations: result.rows })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Failed to fetch quotations:', error)
    // If table doesn't exist or other DB errors, return empty list gracefully
    return NextResponse.json({ quotations: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const customer = body.customer || 'Unknown'
    const total_value = parseFloat(body.total_value) || 0
    const valid_until = body.valid_until || null
    const lead_id = body.lead_id || null
    const customer_id = body.customer_id || null
    const created_by = body.created_by || null

    const client = await pool.connect()
    try {
      // Try to insert into quotations table if it exists
      const result = await client.query(
        `INSERT INTO quotations (reference_number, customer, customer_id, total_value, status, valid_until, lead_id, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) RETURNING *`,
        [null, customer, customer_id, total_value, 'Draft', valid_until, lead_id]
      )

      const quotation = result.rows[0]

      // Start approval workflow if quotation is submitted (not draft)
      if (quotation.status === 'Pending Approval' || quotation.status === 'Submitted') {
        try {
          await WorkflowEngine.startWorkflow(
            'quotation',
            quotation.id,
            created_by,
            {
              total_value: quotation.total_value,
              customer_id: quotation.customer_id,
              lead_id: quotation.lead_id,
              created_by: created_by
            },
            pool
          )
        } catch (workflowError) {
          console.error('Error starting workflow:', workflowError)
          // Don't fail quotation creation if workflow fails
        }
      }

      return NextResponse.json({ message: 'Quotation created', quotation }, { status: 201 })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Failed to create quotation:', error)
    return NextResponse.json({ error: 'Failed to create quotation' }, { status: 500 })
  }
}
