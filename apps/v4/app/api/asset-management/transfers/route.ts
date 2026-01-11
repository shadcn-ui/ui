import { NextRequest, NextResponse } from "next/server"
import { Pool } from "pg"
import { WorkflowEngine } from "@/lib/workflow-engine"

const pool = new Pool({
  user: process.env.DB_USER || "mac",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "ocean-erp",
  password: process.env.DB_PASSWORD || "",
  port: parseInt(process.env.DB_PORT || "5432"),
})

// GET /api/asset-management/transfers - List asset transfers
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const asset_id = searchParams.get("asset_id")

    // Check if assets table exists first
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'assets'
      );
    `)
    
    if (!tableCheck.rows[0].exists) {
      // Return empty array if table doesn't exist yet
      return NextResponse.json({ transfers: [] })
    }

    let query = `
      SELECT 
        at.*,
        fl.location_name as from_location_name,
        tl.location_name as to_location_name
      FROM asset_transfers at
      LEFT JOIN asset_locations fl ON at.from_location_id = fl.location_id
      LEFT JOIN asset_locations tl ON at.to_location_id = tl.location_id
      WHERE 1=1
    `
    const params: any[] = []
    let paramCount = 1

    if (status) {
      query += ` AND at.transfer_status = $${paramCount}`
      params.push(status)
      paramCount++
    }

    if (asset_id) {
      query += ` AND at.asset_id = $${paramCount}`
      params.push(asset_id)
      paramCount++
    }

    query += ` ORDER BY at.requested_date DESC`

    const result = await pool.query(query, params)
    return NextResponse.json({ transfers: result.rows })
  } catch (error) {
    console.error("Error fetching asset transfers:", error)
    return NextResponse.json({ transfers: [] })
  }
}

// POST /api/asset-management/transfers - Create asset transfer
export async function POST(request: NextRequest) {
  const client = await pool.connect()
  try {
    const body = await request.json()
    const {
      asset_id,
      from_location_id,
      to_location_id,
      from_employee_id,
      to_employee_id,
      from_department_id,
      to_department_id,
      transfer_reason,
      notes,
      requested_by = 1,
      created_by = 1
    } = body

    await client.query('BEGIN')

    // Generate transfer number
    const transferNumberResult = await client.query(`
      SELECT 'AT-' || LPAD((COALESCE(MAX(CAST(SUBSTRING(transfer_number FROM 4) AS INTEGER)), 0) + 1)::TEXT, 6, '0') as transfer_number
      FROM asset_transfers
      WHERE transfer_number ~ '^AT-\\d{6}$'
    `)
    const transfer_number = transferNumberResult.rows[0].transfer_number

    // Insert asset transfer
    const transferResult = await client.query(
      `INSERT INTO asset_transfers 
       (transfer_number, asset_id, from_location_id, to_location_id, 
        from_employee_id, to_employee_id, from_department_id, to_department_id,
        requested_by, transfer_reason, notes, transfer_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [
        transfer_number,
        asset_id,
        from_location_id,
        to_location_id,
        from_employee_id || null,
        to_employee_id || null,
        from_department_id || null,
        to_department_id || null,
        requested_by,
        transfer_reason,
        notes || null,
        'pending'
      ]
    )

    const transfer = transferResult.rows[0]

    await client.query('COMMIT')

    // Start workflow
    try {
      await WorkflowEngine.startWorkflow(
        'asset_transfer',
        transfer.transfer_id,
        requested_by,
        { 
          asset_id,
          from_location_id,
          to_location_id,
          from_department_id,
          to_department_id
        }
      )
    } catch (workflowError) {
      console.error('Workflow start failed:', workflowError)
    }

    return NextResponse.json({ transfer }, { status: 201 })
  } catch (error) {
    await client.query('ROLLBACK')
    console.error("Error creating asset transfer:", error)
    return NextResponse.json(
      { error: "Failed to create asset transfer" },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}
