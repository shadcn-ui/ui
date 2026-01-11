import { NextRequest, NextResponse } from 'next/server'
import { getClient, query } from '@/lib/db'
import { rejectWithIssue } from '@/lib/issues'

/**
 * GET /api/accounting/close/validate?period_id={id}
 * 
 * Pre-close validation for P&L period closing.
 * 
 * Mandatory validation checks:
 * 1. All revenue journals posted (no DRAFT)
 * 2. All expense journals posted (no DRAFT)
 * 3. All COGS postings completed for the period
 * 4. No open approval/workflow affecting P&L accounts
 * 5. Accruals & deferrals (if any) already posted
 * 6. No unbalanced P&L journals
 * 7. Period status = OPEN
 * 
 * Returns: {
 *   success: boolean,
 *   canClose: boolean,
 *   validation: {
 *     check1: { pass: boolean, message: string, details: any },
 *     ...
 *   },
 *   periodInfo: { ... }
 * }
 */
export async function GET(request: NextRequest) {
  let issueClient: any = null
  try {
    issueClient = await getClient()
    const searchParams = request.nextUrl.searchParams
    const periodId = searchParams.get('period_id')

    if (!periodId) {
      const rejection = await rejectWithIssue({
        client: issueClient,
        type: 'JOURNAL',
        reference_id: 'pl-validate-missing-period',
        error_code: 'INVALID_SEQUENCE',
        human_message: 'period_id is required to validate P&L close.',
        suggested_next_action: 'Provide a valid period_id and retry validation.',
        statusCode: 400,
      })
      return NextResponse.json(rejection.body, { status: rejection.statusCode })
    }

    // Get period information
    const periodResult = await query(
      `SELECT 
        id, 
        period_name, 
        period_type, 
        start_date, 
        end_date, 
        fiscal_year,
        status,
        pl_closed,
        pl_closed_at,
        pl_closed_by
      FROM accounting_periods 
      WHERE id = $1`,
      [periodId]
    )

    if (periodResult.rows.length === 0) {
      const rejection = await rejectWithIssue({
        client: issueClient,
        type: 'JOURNAL',
        reference_id: String(periodId),
        error_code: 'MISSING_DEPENDENCY',
        human_message: 'Period not found for P&L validation.',
        suggested_next_action: 'Create or select a valid period, then retry validation.',
        statusCode: 404,
      })
      return NextResponse.json(rejection.body, { status: rejection.statusCode })
    }

    const period = periodResult.rows[0]
    const validation: any = {}

    // ==========================================
    // CHECK 1: All revenue journals posted
    // ==========================================
    const revenueCheck = await query(
      `SELECT COUNT(*) as draft_count
       FROM journal_entries je
       JOIN journal_entry_lines jel ON je.id = jel.journal_entry_id
       JOIN chart_of_accounts coa ON jel.account_id = coa.id
       WHERE je.entry_date BETWEEN $1 AND $2
       AND coa.account_type = 'Revenue'
       AND je.status = 'Draft'`,
      [period.start_date, period.end_date]
    )

    validation.revenueJournalsPosted = {
      pass: parseInt(revenueCheck.rows[0].draft_count) === 0,
      message: parseInt(revenueCheck.rows[0].draft_count) === 0
        ? 'All revenue journals are posted'
        : `${revenueCheck.rows[0].draft_count} draft revenue journal(s) found`,
      details: {
        draftCount: parseInt(revenueCheck.rows[0].draft_count)
      }
    }

    // ==========================================
    // CHECK 2: All expense journals posted
    // ==========================================
    const expenseCheck = await query(
      `SELECT COUNT(*) as draft_count
       FROM journal_entries je
       JOIN journal_entry_lines jel ON je.id = jel.journal_entry_id
       JOIN chart_of_accounts coa ON jel.account_id = coa.id
       WHERE je.entry_date BETWEEN $1 AND $2
       AND coa.account_type = 'Expense'
       AND je.status = 'Draft'`,
      [period.start_date, period.end_date]
    )

    validation.expenseJournalsPosted = {
      pass: parseInt(expenseCheck.rows[0].draft_count) === 0,
      message: parseInt(expenseCheck.rows[0].draft_count) === 0
        ? 'All expense journals are posted'
        : `${expenseCheck.rows[0].draft_count} draft expense journal(s) found`,
      details: {
        draftCount: parseInt(expenseCheck.rows[0].draft_count)
      }
    }

    // ==========================================
    // CHECK 3: All COGS postings completed
    // ==========================================
    // COGS may be tracked via specific account subtypes or entry types
    const cogsCheck = await query(
      `SELECT COUNT(*) as draft_count
       FROM journal_entries je
       JOIN journal_entry_lines jel ON je.id = jel.journal_entry_id
       JOIN chart_of_accounts coa ON jel.account_id = coa.id
       WHERE je.entry_date BETWEEN $1 AND $2
       AND (coa.account_subtype ILIKE '%COGS%' OR coa.account_name ILIKE '%cost of goods%')
       AND je.status = 'Draft'`,
      [period.start_date, period.end_date]
    )

    validation.cogsPostingsCompleted = {
      pass: parseInt(cogsCheck.rows[0].draft_count) === 0,
      message: parseInt(cogsCheck.rows[0].draft_count) === 0
        ? 'All COGS postings are completed'
        : `${cogsCheck.rows[0].draft_count} draft COGS journal(s) found`,
      details: {
        draftCount: parseInt(cogsCheck.rows[0].draft_count)
      }
    }

    // ==========================================
    // CHECK 4: No open approvals (future phase)
    // ==========================================
    // For now, assume pass (workflow not yet implemented)
    validation.noOpenApprovals = {
      pass: true,
      message: 'No open approval workflows (feature not yet active)',
      details: {}
    }

    // ==========================================
    // CHECK 5: Accruals & deferrals posted
    // ==========================================
    // Check for any draft journals with "accrual" or "deferral" in description
    const accrualCheck = await query(
      `SELECT COUNT(*) as draft_count
       FROM journal_entries je
       WHERE je.entry_date BETWEEN $1 AND $2
       AND (je.description ILIKE '%accrual%' OR je.description ILIKE '%deferral%')
       AND je.status = 'Draft'`,
      [period.start_date, period.end_date]
    )

    validation.accrualsPosted = {
      pass: parseInt(accrualCheck.rows[0].draft_count) === 0,
      message: parseInt(accrualCheck.rows[0].draft_count) === 0
        ? 'All accruals and deferrals are posted'
        : `${accrualCheck.rows[0].draft_count} draft accrual/deferral journal(s) found`,
      details: {
        draftCount: parseInt(accrualCheck.rows[0].draft_count)
      }
    }

    // ==========================================
    // CHECK 6: No unbalanced P&L journals
    // ==========================================
    const balanceCheck = await query(
      `SELECT COUNT(*) as unbalanced_count
       FROM journal_entries je
       WHERE je.entry_date BETWEEN $1 AND $2
       AND je.status = 'Posted'
       AND ABS(je.total_debit - je.total_credit) > 0.01`,
      [period.start_date, period.end_date]
    )

    validation.journalsBalanced = {
      pass: parseInt(balanceCheck.rows[0].unbalanced_count) === 0,
      message: parseInt(balanceCheck.rows[0].unbalanced_count) === 0
        ? 'All P&L journals are balanced'
        : `${balanceCheck.rows[0].unbalanced_count} unbalanced journal(s) found`,
      details: {
        unbalancedCount: parseInt(balanceCheck.rows[0].unbalanced_count)
      }
    }

    // ==========================================
    // CHECK 7: Period status = OPEN
    // ==========================================
    validation.periodOpen = {
      pass: period.status === 'OPEN' && period.pl_closed === false,
      message: period.status === 'OPEN' && period.pl_closed === false
        ? 'Period is open for closing'
        : period.pl_closed === true
          ? 'Period P&L is already closed'
          : `Period status is ${period.status}`,
      details: {
        status: period.status,
        plClosed: period.pl_closed
      }
    }

    // ==========================================
    // Calculate summary
    // ==========================================
    const canClose = Object.values(validation).every((check: any) => check.pass === true)

    // Get P&L summary for preview
    const summary = await query(
      `SELECT 
        COALESCE(SUM(CASE WHEN coa.account_type = 'Revenue' THEN jel.credit_amount - jel.debit_amount ELSE 0 END), 0) as total_revenue,
        COALESCE(SUM(CASE WHEN coa.account_type = 'Expense' THEN jel.debit_amount - jel.credit_amount ELSE 0 END), 0) as total_expense,
        COALESCE(SUM(CASE WHEN coa.account_subtype ILIKE '%COGS%' THEN jel.debit_amount - jel.credit_amount ELSE 0 END), 0) as total_cogs
       FROM journal_entries je
       JOIN journal_entry_lines jel ON je.id = jel.journal_entry_id
       JOIN chart_of_accounts coa ON jel.account_id = coa.id
       WHERE je.entry_date BETWEEN $1 AND $2
       AND je.status = 'Posted'`,
      [period.start_date, period.end_date]
    )

    const totalRevenue = parseFloat(summary.rows[0].total_revenue)
    const totalExpense = parseFloat(summary.rows[0].total_expense)
    const totalCogs = parseFloat(summary.rows[0].total_cogs)
    const netResult = totalRevenue - totalExpense - totalCogs

    return NextResponse.json({
      success: true,
      canClose,
      validation,
      periodInfo: {
        id: period.id,
        periodName: period.period_name,
        periodType: period.period_type,
        startDate: period.start_date,
        endDate: period.end_date,
        fiscalYear: period.fiscal_year,
        status: period.status,
        plClosed: period.pl_closed
      },
      summary: {
        totalRevenue,
        totalExpense,
        totalCogs,
        netResult,
        netResultType: netResult >= 0 ? 'Profit' : 'Loss'
      }
    })

  } catch (error) {
    console.error('Error validating period close:', error)
    if (issueClient) {
      const rejection = await rejectWithIssue({
        client: issueClient,
        type: 'JOURNAL',
        reference_id: 'pl-validate-error',
        error_code: 'INVALID_SEQUENCE',
        human_message: 'Failed to validate period close due to an unexpected error.',
        suggested_next_action: 'Review server logs, fix the blocker, or retry validation.',
        metadata: { details: error instanceof Error ? error.message : 'Unknown error' },
        statusCode: 500,
      })
      return NextResponse.json(rejection.body, { status: rejection.statusCode })
    }
    return NextResponse.json(
      { success: false, error: 'Failed to validate period close' },
      { status: 500 }
    )
  } finally {
    if (issueClient) {
      issueClient.release()
    }
  }
}
