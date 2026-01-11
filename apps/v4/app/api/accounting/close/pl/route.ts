import { NextRequest, NextResponse } from 'next/server'
import { getClient, query } from '@/lib/db'
import { rejectWithIssue } from '@/lib/issues'
import { blockAdminOverride, requireIssueTrail } from '@/lib/runtime-flags'

/**
 * POST /api/accounting/close/pl
 * 
 * Execute P&L period closing.
 * 
 * Process:
 * 1. Run validation checks
 * 2. Calculate P&L totals
 * 3. Generate system closing journal
 * 4. Lock period P&L accounts
 * 5. Update period status
 * 6. Log audit trail
 * 
 * Request body: {
 *   periodId: number,
 *   userId?: string (from session)
 * }
 */
export async function POST(request: NextRequest) {
  let issueClient: any = null
  try {
    issueClient = await getClient()

    const adminOverride = blockAdminOverride(request)
    if (adminOverride) return adminOverride

    const issueTrail = requireIssueTrail(request, 'P&L close action')
    if (!issueTrail.ok && issueTrail.response) return issueTrail.response

    const body = await request.json()
    const { periodId, userId } = body

    if (!periodId) {
      const rejection = await rejectWithIssue({
        client: issueClient,
        type: 'JOURNAL',
        reference_id: 'pl-close-missing-period',
        error_code: 'INVALID_SEQUENCE',
        human_message: 'periodId is required to close the period.',
        suggested_next_action: 'Provide a valid periodId and retry the close.',
        statusCode: 400,
      })
      issueClient.release()
      issueClient = null
      return NextResponse.json(rejection.body, { status: rejection.statusCode })
    }

    const fallbackUser = await query(
      `SELECT id FROM users ORDER BY created_at ASC LIMIT 1`
    )
    const actingUserId = userId || fallbackUser.rows[0]?.id

    if (!actingUserId) {
      const rejection = await rejectWithIssue({
        client: issueClient,
        type: 'JOURNAL',
        reference_id: String(periodId),
        error_code: 'MISSING_DEPENDENCY',
        human_message: 'No users found to attribute closing action.',
        suggested_next_action: 'Create at least one user and retry the close.',
        statusCode: 500,
      })
      issueClient.release()
      issueClient = null
      return NextResponse.json(rejection.body, { status: rejection.statusCode })
    }

    // ==========================================
    // STEP 1: Run validation
    // ==========================================
    const validationResponse = await fetch(
      `${request.nextUrl.origin}/api/accounting/close/validate?period_id=${periodId}`
    )
    const validation = await validationResponse.json()

    if (!validation.canClose) {
      // Log failed validation
      await query(
        `SELECT log_audit_event($1, $2, $3, $4, NULL, NULL, NULL, $5)`,
        [
          'VALIDATION_FAILED',
          'VALIDATION',
          actingUserId,
          periodId,
          JSON.stringify(validation.validation)
        ]
      )

      const rejection = await rejectWithIssue({
        client: issueClient,
        type: 'JOURNAL',
        reference_id: String(periodId),
        error_code: 'INVALID_SEQUENCE',
        human_message: 'Validation failed for P&L close. Resolve blocking checks and retry with a forward adjustment if needed.',
        suggested_next_action: 'Review the failed checks, correct data, or post a forward adjustment in the next open period.',
        metadata: { validation: validation.validation },
        statusCode: 400,
      })
      issueClient.release()
      issueClient = null
      return NextResponse.json(rejection.body, { status: rejection.statusCode })
    }

    const period = validation.periodInfo
    const summary = validation.summary

    // ==========================================
    // STEP 2: Begin transaction
    // ==========================================
    await query('BEGIN')

    try {
      // ==========================================
      // STEP 3: Generate closing journal entry
      // ==========================================
      
      // Get Retained Earnings account
      const retainedEarningsResult = await query(
        `SELECT id FROM chart_of_accounts 
         WHERE account_type = 'Equity' 
         AND (account_name ILIKE '%retained earnings%' OR account_code = '3030')
         LIMIT 1`
      )

      if (retainedEarningsResult.rows.length === 0) {
        throw new Error('Retained Earnings account not found. Please create account code 3030.')
      }

      const retainedEarningsAccountId = retainedEarningsResult.rows[0].id

      // Generate journal entry number
      const jeNumberResult = await query(
        `SELECT COALESCE(MAX(CAST(SUBSTRING(entry_number FROM '[0-9]+$') AS INTEGER)), 0) + 1 as next_num
         FROM journal_entries 
         WHERE entry_number LIKE 'CLOSE-%'`
      )
      const nextNum = jeNumberResult.rows[0].next_num
      const entryNumber = `CLOSE-${String(nextNum).padStart(6, '0')}`

      // Create journal entry header
      const jeResult = await query(
        `INSERT INTO journal_entries (
          entry_number,
          entry_date,
          entry_type,
          reference_number,
          description,
          status,
          created_by,
          posted_at,
          posted_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), $7)
        RETURNING id`,
        [
          entryNumber,
          period.endDate,
          'SYSTEM_CLOSING',
          `Period Close: ${period.periodName}`,
          `P&L Closing for ${period.periodName} - Auto-generated system journal`,
          'Posted',
          actingUserId
        ]
      )

      const journalId = jeResult.rows[0].id

      // ==========================================
      // STEP 4: Create journal lines
      // ==========================================
      
      // Get all revenue accounts with balances
      const revenueAccounts = await query(
        `SELECT 
          coa.id, 
          coa.account_code, 
          coa.account_name,
          COALESCE(SUM(jel.credit_amount - jel.debit_amount), 0) as balance
         FROM chart_of_accounts coa
         LEFT JOIN journal_entry_lines jel ON coa.id = jel.account_id
         LEFT JOIN journal_entries je ON jel.journal_entry_id = je.id
         WHERE coa.account_type = 'Revenue'
         AND je.entry_date BETWEEN $1 AND $2
         AND je.status = 'Posted'
         GROUP BY coa.id, coa.account_code, coa.account_name
         HAVING SUM(jel.credit_amount - jel.debit_amount) != 0`,
        [period.startDate, period.endDate]
      )

      // Debit revenue accounts (close them to zero)
      let lineNumber = 1
      for (const account of revenueAccounts.rows) {
        const balance = parseFloat(account.balance)
        if (balance > 0) {
          await query(
            `INSERT INTO journal_entry_lines (
              journal_entry_id, line_number, account_id, description, debit_amount, credit_amount
            ) VALUES ($1, $2, $3, $4, $5, 0)`,
            [
              journalId,
              lineNumber++,
              account.id,
              `Close ${account.account_name} to Retained Earnings`,
              balance
            ]
          )
        }
      }

      // Get all expense accounts with balances
      const expenseAccounts = await query(
        `SELECT 
          coa.id, 
          coa.account_code, 
          coa.account_name,
          COALESCE(SUM(jel.debit_amount - jel.credit_amount), 0) as balance
         FROM chart_of_accounts coa
         LEFT JOIN journal_entry_lines jel ON coa.id = jel.account_id
         LEFT JOIN journal_entries je ON jel.journal_entry_id = je.id
         WHERE coa.account_type = 'Expense'
         AND je.entry_date BETWEEN $1 AND $2
         AND je.status = 'Posted'
         GROUP BY coa.id, coa.account_code, coa.account_name
         HAVING SUM(jel.debit_amount - jel.credit_amount) != 0`,
        [period.startDate, period.endDate]
      )

      // Credit expense accounts (close them to zero)
      for (const account of expenseAccounts.rows) {
        const balance = parseFloat(account.balance)
        if (balance > 0) {
          await query(
            `INSERT INTO journal_entry_lines (
              journal_entry_id, line_number, account_id, description, debit_amount, credit_amount
            ) VALUES ($1, $2, $3, $4, 0, $5)`,
            [
              journalId,
              lineNumber++,
              account.id,
              `Close ${account.account_name} to Retained Earnings`,
              balance
            ]
          )
        }
      }

      // Offset to Retained Earnings
      const netResult = summary.netResult
      if (netResult !== 0) {
        if (netResult > 0) {
          // Profit - Credit Retained Earnings
          await query(
            `INSERT INTO journal_entry_lines (
              journal_entry_id, line_number, account_id, description, debit_amount, credit_amount
            ) VALUES ($1, $2, $3, $4, 0, $5)`,
            [
              journalId,
              lineNumber++,
              retainedEarningsAccountId,
              `Net Profit for ${period.periodName}`,
              Math.abs(netResult)
            ]
          )
        } else {
          // Loss - Debit Retained Earnings
          await query(
            `INSERT INTO journal_entry_lines (
              journal_entry_id, line_number, account_id, description, debit_amount, credit_amount
            ) VALUES ($1, $2, $3, $4, $5, 0)`,
            [
              journalId,
              lineNumber++,
              retainedEarningsAccountId,
              `Net Loss for ${period.periodName}`,
              Math.abs(netResult)
            ]
          )
        }
      }

      // ==========================================
      // STEP 5: Create closing journal record
      // ==========================================
      const closingJournalResult = await query(
        `INSERT INTO accounting_closing_journals (
          period_id,
          journal_entry_id,
          closing_type,
          total_revenue,
          total_expense,
          total_cogs,
          net_result,
          closed_by,
          validation_snapshot,
          is_locked
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)
        RETURNING id`,
        [
          periodId,
          journalId,
          'PL_CLOSING',
          summary.totalRevenue,
          summary.totalExpense,
          summary.totalCogs,
          summary.netResult,
          actingUserId,
          JSON.stringify(validation.validation)
        ]
      )

      const closingJournalId = closingJournalResult.rows[0].id

      // ==========================================
      // STEP 6: Lock period P&L accounts
      // ==========================================
      const accountTypesToLock = ['Revenue', 'Expense']
      
      for (const accountType of accountTypesToLock) {
        await query(
          `INSERT INTO accounting_period_locks (period_id, account_type, is_locked, locked_at, locked_by)
           VALUES ($1, $2, true, NOW(), $3)
           ON CONFLICT (period_id, account_type) 
           DO UPDATE SET is_locked = true, locked_at = NOW(), locked_by = $3`,
            [periodId, accountType, actingUserId]
        )
      }

      // ==========================================
      // STEP 7: Update period status
      // ==========================================
      await query(
        `UPDATE accounting_periods 
         SET pl_closed = true,
             pl_closed_at = NOW(),
             pl_closed_by = $1,
             pl_closing_journal_id = $2,
             status = 'CLOSED',
             updated_at = NOW()
         WHERE id = $3`,
        [actingUserId, journalId, periodId]
      )

      // ==========================================
      // STEP 8: Log audit event
      // ==========================================
      await query(
        `SELECT log_audit_event($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          'PERIOD_CLOSED',
          'CLOSING',
          actingUserId,
          periodId,
          journalId,
          closingJournalId,
          JSON.stringify({
            periodName: period.periodName,
            entryNumber,
            summary
          }),
          JSON.stringify(validation.validation)
        ]
      )

      // ==========================================
      // STEP 9: Commit transaction
      // ==========================================
      await query('COMMIT')

      return NextResponse.json({
        success: true,
        message: `Period ${period.periodName} closed successfully`,
        data: {
          periodId,
          periodName: period.periodName,
          journalId,
          entryNumber,
          closingJournalId,
          summary: {
            totalRevenue: summary.totalRevenue,
            totalExpense: summary.totalExpense,
            totalCogs: summary.totalCogs,
            netResult: summary.netResult,
            netResultType: summary.netResultType
          },
          closedAt: new Date().toISOString(),
          closedBy: actingUserId
        }
      })

    } catch (error) {
      // Rollback on error
      await query('ROLLBACK')
      throw error
    }

  } catch (error) {
    console.error('Error closing period:', error)
    if (issueClient) {
      const rejection = await rejectWithIssue({
        client: issueClient,
        type: 'JOURNAL',
        reference_id: 'pl-close-error',
        error_code: 'INVALID_SEQUENCE',
        human_message: 'Failed to close period due to an unexpected error.',
        suggested_next_action: 'Review server logs, fix the blocker, or post a forward adjustment in the next open period.',
        metadata: { details: error instanceof Error ? error.message : 'Unknown error' },
        statusCode: 500,
      })
      issueClient.release()
      issueClient = null
      return NextResponse.json(rejection.body, { status: rejection.statusCode })
    }
    return NextResponse.json(
      { success: false, error: 'Failed to close period' },
      { status: 500 }
    )
  } finally {
    if (issueClient) {
      issueClient.release()
    }
  }
}

/**
 * GET /api/accounting/close/pl?period_id={id}
 * 
 * Get P&L closing status for a period
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const periodId = searchParams.get('period_id')

    if (!periodId) {
      return NextResponse.json(
        { success: false, error: 'period_id is required' },
        { status: 400 }
      )
    }

    // Get period and closing info
    const result = await query(
      `SELECT 
        ap.*,
        acj.id as closing_journal_id,
        acj.journal_entry_id,
        acj.total_revenue,
        acj.total_expense,
        acj.total_cogs,
        acj.net_result,
        acj.closed_at,
        je.entry_number,
        u.first_name || ' ' || u.last_name as closed_by_name
      FROM accounting_periods ap
      LEFT JOIN accounting_closing_journals acj ON ap.id = acj.period_id AND acj.closing_type = 'PL_CLOSING'
      LEFT JOIN journal_entries je ON acj.journal_entry_id = je.id
      LEFT JOIN users u ON acj.closed_by = u.id
      WHERE ap.id = $1`,
      [periodId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Period not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })

  } catch (error) {
    console.error('Error fetching closing status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch closing status' },
      { status: 500 }
    )
  }
}
