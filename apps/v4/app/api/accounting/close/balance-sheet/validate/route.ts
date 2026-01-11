import { NextRequest, NextResponse } from 'next/server'
import { getClient } from '@/lib/db'
import { rejectWithIssue } from '@/lib/issues'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const periodId = searchParams.get('periodId');

  if (!periodId) {
    const client = await getClient()
    const rejection = await rejectWithIssue({
      client,
      type: 'JOURNAL',
      reference_id: 'bs-validate-missing-period',
      error_code: 'INVALID_SEQUENCE',
      human_message: 'periodId is required to validate Balance Sheet close.',
      suggested_next_action: 'Provide a valid periodId and retry validation.',
      statusCode: 400,
    })
    client.release()
    return NextResponse.json(rejection.body, { status: rejection.statusCode })
  }
  const client = await getClient();

  try {
    // Get validation results from database function
    const validationQuery = `
      SELECT * FROM validate_bs_closing($1)
    `;
    
    const validationResult = await client.query(validationQuery, [periodId]);
    const checks = validationResult.rows;

    // Determine if closing is allowed
    const canClose = checks.every((check) => check.is_valid);

    // Get period info
    const periodQuery = `
      SELECT 
        id,
        period_name,
        period_type,
        start_date,
        end_date,
        fiscal_year,
        status,
        pl_closed,
        pl_closed_at,
        bs_closed,
        bs_closed_at
      FROM accounting_periods
      WHERE id = $1
    `;
    
    const periodResult = await client.query(periodQuery, [periodId]);
    const period = periodResult.rows[0];

    if (!period) {
      const rejection = await rejectWithIssue({
        client,
        type: 'JOURNAL',
        reference_id: String(periodId),
        error_code: 'MISSING_DEPENDENCY',
        human_message: 'Period not found for Balance Sheet validation.',
        suggested_next_action: 'Create or select a valid period, then retry validation.',
        statusCode: 404,
      })
      return NextResponse.json(rejection.body, { status: rejection.statusCode })
    }

    // Get BS summary (Assets, Liabilities, Equity)
    const summaryQuery = `
      SELECT 
        coa.account_type,
        SUM(CASE 
          WHEN coa.account_type = 'Asset' THEN jel.debit - jel.credit
          WHEN coa.account_type = 'Liability' THEN jel.credit - jel.debit
          WHEN coa.account_type = 'Equity' THEN jel.credit - jel.debit
          ELSE 0
        END) as total
      FROM journal_entries je
      JOIN journal_entry_lines jel ON je.id = jel.journal_entry_id
      JOIN chart_of_accounts coa ON jel.account_id = coa.id
      WHERE coa.account_type IN ('Asset', 'Liability', 'Equity')
      AND je.entry_date <= $1
      AND je.status = 'POSTED'
      GROUP BY coa.account_type
    `;
    
    const summaryResult = await client.query(summaryQuery, [period.end_date]);
    
    const summary = {
      totalAssets: 0,
      totalLiabilities: 0,
      totalEquity: 0,
    };

    summaryResult.rows.forEach((row) => {
      if (row.account_type === 'Asset') {
        summary.totalAssets = parseFloat(row.total) || 0;
      } else if (row.account_type === 'Liability') {
        summary.totalLiabilities = parseFloat(row.total) || 0;
      } else if (row.account_type === 'Equity') {
        summary.totalEquity = parseFloat(row.total) || 0;
      }
    });

    // Get count of accounts to carry forward
    const carryForwardQuery = `
      SELECT COUNT(*) as account_count
      FROM (
        SELECT coa.id
        FROM chart_of_accounts coa
        JOIN journal_entry_lines jel ON coa.id = jel.account_id
        JOIN journal_entries je ON jel.journal_entry_id = je.id
        WHERE coa.account_type IN ('Asset', 'Liability', 'Equity')
        AND je.entry_date <= $1
        AND je.status = 'POSTED'
        GROUP BY coa.id
        HAVING SUM(jel.debit - jel.credit) != 0
      ) accounts_with_balance
    `;
    
    const carryForwardResult = await client.query(carryForwardQuery, [period.end_date]);
    const accountsToCarryForward = parseInt(carryForwardResult.rows[0]?.account_count || '0');

    return NextResponse.json({
      canClose,
      period,
      validationChecks: checks,
      summary: {
        ...summary,
        equation: `${summary.totalAssets.toFixed(2)} = ${summary.totalLiabilities.toFixed(2)} + ${summary.totalEquity.toFixed(2)}`,
        isBalanced: Math.abs(summary.totalAssets - (summary.totalLiabilities + summary.totalEquity)) < 0.01,
      },
      carryForward: {
        accountCount: accountsToCarryForward,
        estimatedLines: accountsToCarryForward * 2, // Each account needs debit + credit
      },
    });
  } catch (error) {
    console.error('BS validation error:', error);
    const rejection = await rejectWithIssue({
      client,
      type: 'JOURNAL',
      reference_id: 'bs-validate-error',
      error_code: 'INVALID_SEQUENCE',
      human_message: 'Failed to validate Balance Sheet close due to an unexpected error.',
      suggested_next_action: 'Review server logs, fix the blocker, or retry validation.',
      metadata: { details: error instanceof Error ? error.message : 'Unknown error' },
      statusCode: 500,
    })
    return NextResponse.json(rejection.body, { status: rejection.statusCode })
  } finally {
    client.release();
  }
}
