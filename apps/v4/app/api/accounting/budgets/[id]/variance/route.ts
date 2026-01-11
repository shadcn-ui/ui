import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// GET /api/accounting/budgets/[id]/variance - Variance analysis
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const budgetId = parseInt(id)

    // Get budget details
    const budgetResult = await query(
      'SELECT * FROM budgets WHERE id = $1',
      [budgetId]
    )

    if (budgetResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Budget not found' },
        { status: 404 }
      )
    }

    const budget = budgetResult.rows[0]

    // Get budget lines with account details and calculate actual amounts
    const linesResult = await query(`
      SELECT 
        bl.*,
        coa.account_code,
        coa.account_name,
        coa.account_type,
        coa.account_subtype,
        CASE 
          WHEN coa.account_type IN ('Revenue') THEN
            COALESCE((
              SELECT SUM(jel.credit_amount - jel.debit_amount)
              FROM journal_entry_lines jel
              JOIN journal_entries je ON jel.journal_entry_id = je.id
              WHERE jel.account_id = bl.account_id
                AND je.status = 'Posted'
                AND je.entry_date BETWEEN $2 AND $3
            ), 0)
          WHEN coa.account_type IN ('Expense') THEN
            COALESCE((
              SELECT SUM(jel.debit_amount - jel.credit_amount)
              FROM journal_entry_lines jel
              JOIN journal_entries je ON jel.journal_entry_id = je.id
              WHERE jel.account_id = bl.account_id
                AND je.status = 'Posted'
                AND je.entry_date BETWEEN $2 AND $3
            ), 0)
          ELSE 0
        END as calculated_actual,
        bl.budgeted_amount - CASE 
          WHEN coa.account_type IN ('Revenue') THEN
            COALESCE((
              SELECT SUM(jel.credit_amount - jel.debit_amount)
              FROM journal_entry_lines jel
              JOIN journal_entries je ON jel.journal_entry_id = je.id
              WHERE jel.account_id = bl.account_id
                AND je.status = 'Posted'
                AND je.entry_date BETWEEN $2 AND $3
            ), 0)
          WHEN coa.account_type IN ('Expense') THEN
            COALESCE((
              SELECT SUM(jel.debit_amount - jel.credit_amount)
              FROM journal_entry_lines jel
              JOIN journal_entries je ON jel.journal_entry_id = je.id
              WHERE jel.account_id = bl.account_id
                AND je.status = 'Posted'
                AND je.entry_date BETWEEN $2 AND $3
            ), 0)
          ELSE 0
        END as variance,
        CASE
          WHEN bl.budgeted_amount = 0 THEN 0
          ELSE ((bl.budgeted_amount - CASE 
            WHEN coa.account_type IN ('Revenue') THEN
              COALESCE((
                SELECT SUM(jel.credit_amount - jel.debit_amount)
                FROM journal_entry_lines jel
                JOIN journal_entries je ON jel.journal_entry_id = je.id
                WHERE jel.account_id = bl.account_id
                  AND je.status = 'Posted'
                  AND je.entry_date BETWEEN $2 AND $3
              ), 0)
            WHEN coa.account_type IN ('Expense') THEN
              COALESCE((
                SELECT SUM(jel.debit_amount - jel.credit_amount)
                FROM journal_entry_lines jel
                JOIN journal_entries je ON jel.journal_entry_id = je.id
                WHERE jel.account_id = bl.account_id
                  AND je.status = 'Posted'
                  AND je.entry_date BETWEEN $2 AND $3
              ), 0)
            ELSE 0
          END) / bl.budgeted_amount * 100)
        END as variance_percentage
      FROM budget_lines bl
      JOIN chart_of_accounts coa ON bl.account_id = coa.id
      WHERE bl.budget_id = $1
      ORDER BY bl.line_number
    `, [budgetId, budget.start_date, budget.end_date])

    // Update actual amounts in budget lines
    for (const line of linesResult.rows) {
      await query(
        'UPDATE budget_lines SET actual_amount = $1 WHERE id = $2',
        [line.calculated_actual, line.id]
      )
    }

    // Calculate totals by account type
    const summary = {
      revenue: {
        budgeted: 0,
        actual: 0,
        variance: 0,
        variance_percentage: 0
      },
      expense: {
        budgeted: 0,
        actual: 0,
        variance: 0,
        variance_percentage: 0
      },
      net: {
        budgeted: 0,
        actual: 0,
        variance: 0,
        variance_percentage: 0
      }
    }

    linesResult.rows.forEach((line: any) => {
      const budgeted = parseFloat(line.budgeted_amount)
      const actual = parseFloat(line.calculated_actual)
      const variance = parseFloat(line.variance)

      if (line.account_type === 'Revenue') {
        summary.revenue.budgeted += budgeted
        summary.revenue.actual += actual
        summary.revenue.variance += variance
      } else if (line.account_type === 'Expense') {
        summary.expense.budgeted += budgeted
        summary.expense.actual += actual
        summary.expense.variance += variance
      }
    })

    // Calculate net (Revenue - Expense)
    summary.net.budgeted = summary.revenue.budgeted - summary.expense.budgeted
    summary.net.actual = summary.revenue.actual - summary.expense.actual
    summary.net.variance = summary.net.budgeted - summary.net.actual

    // Calculate variance percentages
    if (summary.revenue.budgeted !== 0) {
      summary.revenue.variance_percentage = (summary.revenue.variance / summary.revenue.budgeted * 100)
    }
    if (summary.expense.budgeted !== 0) {
      summary.expense.variance_percentage = (summary.expense.variance / summary.expense.budgeted * 100)
    }
    if (summary.net.budgeted !== 0) {
      summary.net.variance_percentage = (summary.net.variance / summary.net.budgeted * 100)
    }

    // Group by account type and subtype
    const byAccountType: any = {}
    linesResult.rows.forEach((line: any) => {
      const type = line.account_type
      if (!byAccountType[type]) {
        byAccountType[type] = {
          lines: [],
          budgeted: 0,
          actual: 0,
          variance: 0
        }
      }
      byAccountType[type].lines.push(line)
      byAccountType[type].budgeted += parseFloat(line.budgeted_amount)
      byAccountType[type].actual += parseFloat(line.calculated_actual)
      byAccountType[type].variance += parseFloat(line.variance)
    })

    return NextResponse.json({
      success: true,
      budget,
      lines: linesResult.rows,
      summary,
      by_account_type: byAccountType
    })

  } catch (error) {
    console.error('Error generating variance analysis:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate variance analysis' },
      { status: 500 }
    )
  }
}

// PUT /api/accounting/budgets/[id]/variance - Update budget status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const budgetId = parseInt(id)
    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Status is required' },
        { status: 400 }
      )
    }

    const validStatuses = ['Draft', 'Active', 'Closed']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status. Must be Draft, Active, or Closed' },
        { status: 400 }
      )
    }

    const result = await query(
      'UPDATE budgets SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, budgetId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Budget not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      budget: result.rows[0],
      message: 'Budget status updated successfully'
    })

  } catch (error) {
    console.error('Error updating budget status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update budget status' },
      { status: 500 }
    )
  }
}
