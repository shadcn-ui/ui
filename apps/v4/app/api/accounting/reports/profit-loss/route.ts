import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// GET /api/accounting/reports/profit-loss - Profit & Loss Statement
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')

    if (!startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: 'start_date and end_date are required' },
        { status: 400 }
      )
    }

    // Get Revenue accounts with balances
    const revenueResult = await query(`
      SELECT 
        coa.id,
        coa.account_code,
        coa.account_name,
        coa.account_subtype,
        COALESCE(SUM(jel.credit_amount - jel.debit_amount), 0) as amount
      FROM chart_of_accounts coa
      LEFT JOIN journal_entry_lines jel ON coa.id = jel.account_id
      LEFT JOIN journal_entries je ON jel.journal_entry_id = je.id
      WHERE coa.account_type = 'Revenue'
        AND je.status = 'Posted'
        AND je.entry_date BETWEEN $1 AND $2
      GROUP BY coa.id, coa.account_code, coa.account_name, coa.account_subtype
      ORDER BY coa.account_code
    `, [startDate, endDate])

    // Get Expense accounts with balances
    const expenseResult = await query(`
      SELECT 
        coa.id,
        coa.account_code,
        coa.account_name,
        coa.account_subtype,
        COALESCE(SUM(jel.debit_amount - jel.credit_amount), 0) as amount
      FROM chart_of_accounts coa
      LEFT JOIN journal_entry_lines jel ON coa.id = jel.account_id
      LEFT JOIN journal_entries je ON jel.journal_entry_id = je.id
      WHERE coa.account_type = 'Expense'
        AND je.status = 'Posted'
        AND je.entry_date BETWEEN $1 AND $2
      GROUP BY coa.id, coa.account_code, coa.account_name, coa.account_subtype
      ORDER BY coa.account_code
    `, [startDate, endDate])

    // Calculate totals
    const totalRevenue = revenueResult.rows.reduce((sum, row) => sum + parseFloat(row.amount), 0)
    const totalExpense = expenseResult.rows.reduce((sum, row) => sum + parseFloat(row.amount), 0)
    const netIncome = totalRevenue - totalExpense

    // Group by subtype
    const revenueBySubtype = revenueResult.rows.reduce((acc: any, row: any) => {
      const subtype = row.account_subtype || 'Other Revenue'
      if (!acc[subtype]) {
        acc[subtype] = { accounts: [], subtotal: 0 }
      }
      acc[subtype].accounts.push(row)
      acc[subtype].subtotal += parseFloat(row.amount)
      return acc
    }, {})

    const expenseBySubtype = expenseResult.rows.reduce((acc: any, row: any) => {
      const subtype = row.account_subtype || 'Other Expense'
      if (!acc[subtype]) {
        acc[subtype] = { accounts: [], subtotal: 0 }
      }
      acc[subtype].accounts.push(row)
      acc[subtype].subtotal += parseFloat(row.amount)
      return acc
    }, {})

    return NextResponse.json({
      success: true,
      report_type: 'Profit & Loss Statement',
      period: {
        start_date: startDate,
        end_date: endDate
      },
      revenue: {
        by_subtype: revenueBySubtype,
        accounts: revenueResult.rows,
        total: totalRevenue
      },
      expenses: {
        by_subtype: expenseBySubtype,
        accounts: expenseResult.rows,
        total: totalExpense
      },
      net_income: netIncome,
      net_income_percentage: totalRevenue > 0 ? (netIncome / totalRevenue * 100).toFixed(2) : 0
    })

  } catch (error) {
    console.error('Error generating P&L report:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate P&L report' },
      { status: 500 }
    )
  }
}
