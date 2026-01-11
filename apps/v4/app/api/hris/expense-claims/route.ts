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

// GET /api/hris/expense-claims - List expense claims
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const employee_id = searchParams.get("employee_id")

    let query = `
      SELECT 
        ec.*,
        CONCAT(e.first_name, ' ', e.last_name) as employee_name,
        e.employee_number,
        d.department_name,
        COUNT(eci.id) as items_count
      FROM expense_claims ec
      JOIN hrm_employees e ON ec.employee_id = e.employee_id
      LEFT JOIN hrm_departments d ON ec.department_id = d.department_id
      LEFT JOIN expense_claim_items eci ON ec.id = eci.expense_claim_id
      WHERE 1=1
    `
    const params: any[] = []
    let paramCount = 1

    if (status) {
      query += ` AND ec.status = $${paramCount}`
      params.push(status)
      paramCount++
    }

    if (employee_id) {
      query += ` AND ec.employee_id = $${paramCount}`
      params.push(employee_id)
      paramCount++
    }

    query += ` GROUP BY ec.id, e.first_name, e.last_name, e.employee_number, d.department_name
               ORDER BY ec.submission_date DESC`

    const result = await pool.query(query, params)
    return NextResponse.json({ claims: result.rows })
  } catch (error) {
    console.error("Error fetching expense claims:", error)
    return NextResponse.json(
      { error: "Failed to fetch expense claims" },
      { status: 500 }
    )
  }
}

// POST /api/hris/expense-claims - Create expense claim
export async function POST(request: NextRequest) {
  const client = await pool.connect()
  try {
    const body = await request.json()
    const {
      employee_id,
      department_id,
      claim_date,
      purpose,
      notes,
      items = [],
      created_by = 1
    } = body

    await client.query('BEGIN')

    // Generate claim number
    const claimNumberResult = await client.query('SELECT generate_expense_claim_number() as claim_number')
    const claim_number = claimNumberResult.rows[0].claim_number

    // Calculate total amount from items
    const total_amount = items.reduce((sum: number, item: any) => sum + parseFloat(item.amount || 0), 0)

    // Insert expense claim
    const claimResult = await client.query(
      `INSERT INTO expense_claims 
       (claim_number, employee_id, department_id, claim_date, total_amount, purpose, notes, status, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [claim_number, employee_id, department_id, claim_date, total_amount, purpose, notes, 'Draft', created_by]
    )

    const expenseClaim = claimResult.rows[0]

    // Insert items
    for (const item of items) {
      await client.query(
        `INSERT INTO expense_claim_items 
         (expense_claim_id, expense_date, category, description, amount, receipt_number, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          expenseClaim.id,
          item.expense_date,
          item.category,
          item.description,
          item.amount,
          item.receipt_number || null,
          item.notes || null
        ]
      )
    }

    await client.query('COMMIT')

    // Start workflow if status is Submitted
    if (body.status === 'Submitted') {
      try {
        await WorkflowEngine.startWorkflow(
          'expense_claim',
          expenseClaim.id,
          created_by,
          { amount: total_amount, employee_id, department_id }
        )
      } catch (workflowError) {
        console.error('Workflow start failed:', workflowError)
      }
    }

    return NextResponse.json({ claim: expenseClaim }, { status: 201 })
  } catch (error) {
    await client.query('ROLLBACK')
    console.error("Error creating expense claim:", error)
    return NextResponse.json(
      { error: "Failed to create expense claim" },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}
