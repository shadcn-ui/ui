import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// GET /api/accounting/budgets - List all budgets
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const year = searchParams.get('year')
    const period = searchParams.get('period')
    const status = searchParams.get('status')

    let sql = `
      SELECT 
        b.*,
        COUNT(bl.id) as line_count,
        COALESCE(SUM(bl.budgeted_amount), 0) as total_budgeted,
        COALESCE(SUM(bl.actual_amount), 0) as total_actual,
        COALESCE(SUM(bl.budgeted_amount - bl.actual_amount), 0) as total_variance
      FROM budgets b
      LEFT JOIN budget_lines bl ON b.id = bl.budget_id
      WHERE 1=1
    `
    
    const params: any[] = []
    let paramIndex = 1

    if (year) {
      sql += ` AND EXTRACT(YEAR FROM b.start_date) = $${paramIndex}`
      params.push(parseInt(year))
      paramIndex++
    }

    if (period) {
      sql += ` AND b.period_type = $${paramIndex}`
      params.push(period)
      paramIndex++
    }

    if (status) {
      sql += ` AND b.status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }

    sql += ` GROUP BY b.id ORDER BY b.start_date DESC`

    const result = await query(sql, params)

    // Get summary statistics
    const stats = await query(`
      SELECT 
        COUNT(*) as total_budgets,
        COUNT(CASE WHEN status = 'Draft' THEN 1 END) as draft_count,
        COUNT(CASE WHEN status = 'Active' THEN 1 END) as active_count,
        COUNT(CASE WHEN status = 'Closed' THEN 1 END) as closed_count
      FROM budgets
      WHERE 1=1
      ${year ? 'AND EXTRACT(YEAR FROM start_date) = $1' : ''}
    `, year ? [parseInt(year)] : [])

    return NextResponse.json({
      success: true,
      budgets: result.rows,
      stats: stats.rows[0]
    })

  } catch (error) {
    console.error('Error fetching budgets:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch budgets' },
      { status: 500 }
    )
  }
}

// POST /api/accounting/budgets - Create new budget
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      budget_name,
      period_type,
      start_date,
      end_date,
      description,
      lines
    } = body

    // Validate required fields
    if (!budget_name || !period_type || !start_date || !end_date) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate period type
    const validPeriods = ['Monthly', 'Quarterly', 'Yearly']
    if (!validPeriods.includes(period_type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid period_type. Must be Monthly, Quarterly, or Yearly' },
        { status: 400 }
      )
    }

    // Validate lines
    if (!lines || !Array.isArray(lines) || lines.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one budget line is required' },
        { status: 400 }
      )
    }

    // Validate all accounts exist
    for (const line of lines) {
      if (!line.account_id || !line.budgeted_amount) {
        return NextResponse.json(
          { success: false, error: 'Each line must have account_id and budgeted_amount' },
          { status: 400 }
        )
      }

      const accountCheck = await query(
        'SELECT id FROM chart_of_accounts WHERE id = $1',
        [line.account_id]
      )
      if (accountCheck.rows.length === 0) {
        return NextResponse.json(
          { success: false, error: `Account ${line.account_id} not found` },
          { status: 404 }
        )
      }
    }

    // Create the budget
    const result = await query(
      `INSERT INTO budgets (
        budget_name, period_type, start_date, end_date, 
        description, status
      ) VALUES ($1, $2, $3, $4, $5, 'Draft')
      RETURNING *`,
      [budget_name, period_type, start_date, end_date, description]
    )

    const newBudget = result.rows[0]
    const budgetId = newBudget.id

    // Create budget lines
    const createdLines = []
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const lineResult = await query(
        `INSERT INTO budget_lines (
          budget_id, line_number, account_id, 
          budgeted_amount, actual_amount, notes
        ) VALUES ($1, $2, $3, $4, 0, $5)
        RETURNING *`,
        [
          budgetId,
          i + 1,
          line.account_id,
          line.budgeted_amount,
          line.notes
        ]
      )
      createdLines.push(lineResult.rows[0])
    }

    return NextResponse.json({
      success: true,
      budget: newBudget,
      lines: createdLines,
      message: 'Budget created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating budget:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create budget' },
      { status: 500 }
    )
  }
}
