import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// GET /api/accounting/ledger - View general ledger
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const accountId = searchParams.get('account_id')
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    const accountType = searchParams.get('account_type')

    let sql = `
      SELECT 
        jel.id,
        je.entry_number,
        je.entry_date,
        je.entry_type,
        je.description as entry_description,
        jel.description as line_description,
        coa.id as account_id,
        coa.account_code,
        coa.account_name,
        coa.account_type,
        jel.debit_amount,
        jel.credit_amount,
        je.status,
        je.created_at
      FROM journal_entry_lines jel
      JOIN journal_entries je ON jel.journal_entry_id = je.id
      JOIN chart_of_accounts coa ON jel.account_id = coa.id
      WHERE je.status = 'Posted'
    `
    
    const params: any[] = []
    let paramIndex = 1

    if (accountId) {
      sql += ` AND jel.account_id = $${paramIndex}`
      params.push(parseInt(accountId))
      paramIndex++
    }

    if (accountType) {
      sql += ` AND coa.account_type = $${paramIndex}`
      params.push(accountType)
      paramIndex++
    }

    if (startDate) {
      sql += ` AND je.entry_date >= $${paramIndex}`
      params.push(startDate)
      paramIndex++
    }

    if (endDate) {
      sql += ` AND je.entry_date <= $${paramIndex}`
      params.push(endDate)
      paramIndex++
    }

    sql += ` ORDER BY je.entry_date DESC, je.id DESC, jel.line_number`

    const result = await query(sql, params)

    // Calculate running balances if specific account is selected
    let transactions = result.rows
    if (accountId) {
      let runningBalance = 0
      const accountInfo = await query(
        'SELECT account_type, opening_balance FROM chart_of_accounts WHERE id = $1',
        [accountId]
      )
      
      if (accountInfo.rows.length > 0) {
        runningBalance = parseFloat(accountInfo.rows[0].opening_balance || 0)
        const accountType = accountInfo.rows[0].account_type

        // For each transaction, calculate running balance
        transactions = transactions.map(txn => {
          const debit = parseFloat(txn.debit_amount || 0)
          const credit = parseFloat(txn.credit_amount || 0)
          
          // Assets and Expenses increase with debits
          if (accountType === 'Asset' || accountType === 'Expense') {
            runningBalance += debit - credit
          } else {
            // Liabilities, Equity, Revenue increase with credits
            runningBalance += credit - debit
          }
          
          return {
            ...txn,
            running_balance: runningBalance
          }
        })
      }
    }

    // Get summary statistics
    const stats = await query(`
      SELECT 
        COUNT(DISTINCT jel.account_id) as total_accounts,
        COUNT(*) as total_transactions,
        SUM(jel.debit_amount) as total_debits,
        SUM(jel.credit_amount) as total_credits
      FROM journal_entry_lines jel
      JOIN journal_entries je ON jel.journal_entry_id = je.id
      WHERE je.status = 'Posted'
      ${accountId ? 'AND jel.account_id = $1' : ''}
      ${startDate ? `AND je.entry_date >= $${accountId ? '2' : '1'}` : ''}
      ${endDate ? `AND je.entry_date <= $${accountId ? (startDate ? '3' : '2') : (startDate ? '2' : '1')}` : ''}
    `, accountId ? [parseInt(accountId), ...(startDate ? [startDate] : []), ...(endDate ? [endDate] : [])] : [...(startDate ? [startDate] : []), ...(endDate ? [endDate] : [])])

    return NextResponse.json({
      success: true,
      transactions,
      stats: stats.rows[0]
    })

  } catch (error) {
    console.error('Error fetching ledger:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ledger' },
      { status: 500 }
    )
  }
}
