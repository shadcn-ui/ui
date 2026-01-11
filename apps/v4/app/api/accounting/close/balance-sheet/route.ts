import { NextRequest, NextResponse } from 'next/server'
import { getClient } from '@/lib/db'
import { rejectWithIssue } from '@/lib/issues'
import { blockAdminOverride, requireIssueTrail } from '@/lib/runtime-flags'

async function resolveUserId(client: any) {
  // If auth is wired, the caller should pass userId; otherwise fallback to the first user
  const fallback = await client.query(
    `SELECT id FROM users ORDER BY created_at ASC LIMIT 1`
  );
  const fallbackId = fallback.rows[0]?.id;
  if (!fallbackId) {
    throw new Error('No users found to attribute closing action');
  }
  return fallbackId as string;
}

export async function POST(request: NextRequest) {
  const adminOverride = blockAdminOverride(request)
  if (adminOverride) return adminOverride

  const issueTrail = requireIssueTrail(request, 'Balance Sheet close action')
  if (!issueTrail.ok && issueTrail.response) return issueTrail.response

  const { periodId, userId, description } = await request.json();

  let client: any = null

  try {
    client = await getClient()

    if (!periodId) {
      const rejection = await rejectWithIssue({
        client,
        type: 'JOURNAL',
        reference_id: 'bs-close-missing-period',
        error_code: 'INVALID_SEQUENCE',
        human_message: 'periodId is required to close the Balance Sheet.',
        suggested_next_action: 'Provide a valid periodId and retry the Balance Sheet close.',
        statusCode: 400,
      })
      client.release()
      client = null
      return NextResponse.json(rejection.body, { status: rejection.statusCode })
    }

    await client.query('BEGIN');

    const actingUserId = userId || (await resolveUserId(client));

    // 1. Validate prerequisites
    const validationQuery = `SELECT * FROM validate_bs_closing($1)`;
    const validationResult = await client.query(validationQuery, [periodId]);
    const checks = validationResult.rows;
    const canClose = checks.every((check) => check.is_valid);

    if (!canClose) {
      await client.query('ROLLBACK');
      const rejection = await rejectWithIssue({
        client,
        type: 'JOURNAL',
        reference_id: String(periodId),
        error_code: 'INVALID_SEQUENCE',
        human_message: 'Balance Sheet close failed validation. Resolve blocking checks and retry.',
        suggested_next_action: 'Fix the failed validation checks or post a forward adjustment in the next open period.',
        metadata: { validationChecks: checks },
        statusCode: 400,
      })
      return NextResponse.json(rejection.body, { status: rejection.statusCode })
    }

    // 2. Get period info
    const periodQuery = `
      SELECT id, period_name, start_date, end_date, fiscal_year
      FROM accounting_periods
      WHERE id = $1
    `;
    const periodResult = await client.query(periodQuery, [periodId]);
    const period = periodResult.rows[0];

    if (!period) {
      await client.query('ROLLBACK')
      const rejection = await rejectWithIssue({
        client,
        type: 'JOURNAL',
        reference_id: String(periodId),
        error_code: 'MISSING_DEPENDENCY',
        human_message: 'Period not found for Balance Sheet close.',
        suggested_next_action: 'Create or select a valid period, then retry the close.',
        statusCode: 404,
      })
      return NextResponse.json(rejection.body, { status: rejection.statusCode })
    }

    // 3. Get next period for carry-forward
    const nextPeriodQuery = `
      SELECT id, start_date
      FROM accounting_periods
      WHERE start_date > $1
      AND fiscal_year = $2
      ORDER BY start_date ASC
      LIMIT 1
    `;
    const nextPeriodResult = await client.query(nextPeriodQuery, [
      period.end_date,
      period.fiscal_year,
    ]);

    if (nextPeriodResult.rows.length === 0) {
      await client.query('ROLLBACK');
      const rejection = await rejectWithIssue({
        client,
        type: 'JOURNAL',
        reference_id: String(periodId),
        error_code: 'MISSING_DEPENDENCY',
        human_message: 'No next period found for Balance Sheet carry-forward.',
        suggested_next_action: 'Create the subsequent period or adjust in the next open period, then retry.',
        statusCode: 400,
      })
      return NextResponse.json(rejection.body, { status: rejection.statusCode })
    }

    const nextPeriod = nextPeriodResult.rows[0];

    // 4. Get BS account balances
    const balancesQuery = `SELECT * FROM get_bs_account_balances($1)`;
    const balancesResult = await client.query(balancesQuery, [periodId]);
    const accountBalances = balancesResult.rows;

    if (accountBalances.length === 0) {
      await client.query('ROLLBACK');
      const rejection = await rejectWithIssue({
        client,
        type: 'JOURNAL',
        reference_id: String(periodId),
        error_code: 'MISSING_DEPENDENCY',
        human_message: 'No Balance Sheet accounts with balances found for carry-forward.',
        suggested_next_action: 'Review account balances and retry, or post adjustments in the next period.',
        statusCode: 400,
      })
      return NextResponse.json(rejection.body, { status: rejection.statusCode })
    }

    // 5. Create carry-forward journal entry
    const carryForwardDescription = 
      description || 
      `Balance Sheet Carry-Forward from ${period.period_name} to next period`;

    const journalQuery = `
      INSERT INTO journal_entries (
        entry_date,
        description,
        status,
        entry_type,
        created_by,
        created_at,
        updated_at
      ) VALUES ($1, $2, 'POSTED', 'SYSTEM_CARRY_FORWARD', $3, NOW(), NOW())
      RETURNING id
    `;

    const journalResult = await client.query(journalQuery, [
      nextPeriod.start_date,
      carryForwardDescription,
      actingUserId,
    ]);

    const carryForwardJournalId = journalResult.rows[0].id;

    // 6. Create journal entry lines for carry-forward
    let lineNumber = 0;
    let totalDebits = 0;
    let totalCredits = 0;

    for (const account of accountBalances) {
      lineNumber++;
      const balance = parseFloat(account.ending_balance);

      // For Assets: positive balance = debit, negative = credit
      // For Liabilities/Equity: positive balance = credit, negative = debit
      let debit = 0;
      let credit = 0;

      if (account.account_type === 'Asset') {
        if (balance >= 0) {
          debit = balance;
        } else {
          credit = Math.abs(balance);
        }
      } else {
        // Liability or Equity
        if (balance >= 0) {
          credit = balance;
        } else {
          debit = Math.abs(balance);
        }
      }

      await client.query(
        `
        INSERT INTO journal_entry_lines (
          journal_entry_id,
          line_number,
          account_id,
          description,
          debit,
          credit,
          created_at,
          updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        `,
        [
          carryForwardJournalId,
          lineNumber,
          account.account_id,
          `Opening balance from ${period.period_name}`,
          debit,
          credit,
        ]
      );

      totalDebits += debit;
      totalCredits += credit;

      // 7. Create snapshot record
      await client.query(
        `
        INSERT INTO accounting_bs_snapshots (
          period_id,
          account_id,
          account_code,
          account_name,
          account_type,
          ending_balance,
          debit_balance,
          credit_balance,
          snapshot_at,
          snapshot_by,
          carry_forward_journal_id,
          created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), $9, $10, NOW())
        `,
        [
          periodId,
          account.account_id,
          account.account_code,
          account.account_name,
          account.account_type,
          balance,
          parseFloat(account.debit_balance),
          parseFloat(account.credit_balance),
          actingUserId,
          carryForwardJournalId,
        ]
      );
    }

    // 8. Calculate BS totals for summary
    const summaryQuery = `
      SELECT 
        SUM(CASE WHEN account_type = 'Asset' THEN ending_balance ELSE 0 END) as total_assets,
        SUM(CASE WHEN account_type = 'Liability' THEN ending_balance ELSE 0 END) as total_liabilities,
        SUM(CASE WHEN account_type = 'Equity' THEN ending_balance ELSE 0 END) as total_equity
      FROM accounting_bs_snapshots
      WHERE period_id = $1
    `;
    const summaryResult = await client.query(summaryQuery, [periodId]);
    const summary = summaryResult.rows[0];

    // 9. Create closing journal record
    const closingJournalQuery = `
      INSERT INTO accounting_closing_journals (
        period_id,
        journal_entry_id,
        closing_type,
        total_assets,
        total_liabilities,
        total_equity,
        carry_forward_count,
        closed_at,
        closed_by,
        validation_snapshot,
        is_locked,
        created_at
      ) VALUES ($1, $2, 'BS_CLOSING', $3, $4, $5, $6, NOW(), $7, $8, true, NOW())
      RETURNING id
    `;

    const closingJournalResult = await client.query(closingJournalQuery, [
      periodId,
      carryForwardJournalId,
      summary.total_assets,
      summary.total_liabilities,
      summary.total_equity,
      accountBalances.length,
      actingUserId,
      JSON.stringify({ validationChecks: checks }),
    ]);

    const closingJournalRecordId = closingJournalResult.rows[0].id;

    // 10. Lock BS accounts for this period
    await client.query(
      `
      INSERT INTO accounting_period_locks (
        period_id,
        account_type,
        is_locked,
        locked_at,
        locked_by,
        created_at,
        updated_at
      ) VALUES 
        ($1, 'Asset', true, NOW(), $2, NOW(), NOW()),
        ($1, 'Liability', true, NOW(), $2, NOW(), NOW()),
        ($1, 'Equity', true, NOW(), $2, NOW(), NOW())
      ON CONFLICT (period_id, account_type) 
      DO UPDATE SET
        is_locked = true,
        locked_at = NOW(),
        locked_by = $2,
        updated_at = NOW()
      `,
      [periodId, actingUserId]
    );

    // 11. Update period status
    await client.query(
      `
      UPDATE accounting_periods
      SET 
        bs_closed = true,
        bs_closed_at = NOW(),
        bs_closed_by = $1,
        bs_closing_journal_id = $2,
        status = CASE 
          WHEN pl_closed = true AND bs_closed = false THEN 'CLOSED'
          ELSE status
        END,
        updated_at = NOW()
      WHERE id = $3
      `,
      [actingUserId, carryForwardJournalId, periodId]
    );

    // 12. Log audit event
    await client.query(
      `
      INSERT INTO accounting_audit_log (
        event_type,
        event_category,
        period_id,
        journal_entry_id,
        closing_journal_id,
        user_id,
        event_data,
        validation_results,
        event_timestamp,
        created_at
      ) VALUES (
        'BS_CLOSED',
        'CLOSING',
        $1, $2, $3, $4,
        $5::jsonb,
        $6::jsonb,
        NOW(),
        NOW()
      )
      `,
      [
        periodId,
        carryForwardJournalId,
        closingJournalRecordId,
        actingUserId,
        JSON.stringify({
          period_name: period.period_name,
          accounts_carried_forward: accountBalances.length,
          total_assets: summary.total_assets,
          total_liabilities: summary.total_liabilities,
          total_equity: summary.total_equity,
          carry_forward_journal_id: carryForwardJournalId,
          next_period_id: nextPeriod.id,
        }),
        JSON.stringify({ validationChecks: checks }),
      ]
    );

    await client.query('COMMIT');

    return NextResponse.json({
      success: true,
      message: `Balance Sheet closed for ${period.period_name}`,
      data: {
        periodId,
        periodName: period.period_name,
        carryForwardJournalId,
        closingJournalRecordId,
        accountsCarriedForward: accountBalances.length,
        summary: {
          totalAssets: parseFloat(summary.total_assets),
          totalLiabilities: parseFloat(summary.total_liabilities),
          totalEquity: parseFloat(summary.total_equity),
        },
        nextPeriod: {
          id: nextPeriod.id,
          startDate: nextPeriod.start_date,
        },
        lockedAccountTypes: ['Asset', 'Liability', 'Equity'],
      },
    });
  } catch (error) {
    if (client) {
      await client.query('ROLLBACK');
      const rejection = await rejectWithIssue({
        client,
        type: 'JOURNAL',
        reference_id: 'bs-close-error',
        error_code: 'INVALID_SEQUENCE',
        human_message: 'Failed to close Balance Sheet due to an unexpected error.',
        suggested_next_action: 'Review server logs, fix the blocker, or post a forward adjustment in the next open period.',
        metadata: { details: error instanceof Error ? error.message : 'Unknown error' },
        statusCode: 500,
      })
      return NextResponse.json(rejection.body, { status: rejection.statusCode })
    }
    console.error('BS closing error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to close Balance Sheet',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  } finally {
    if (client) {
      client.release();
    }
  }
}

// GET endpoint to check BS closing status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const periodId = searchParams.get('periodId');

  if (!periodId) {
    return NextResponse.json(
      { error: 'periodId is required' },
      { status: 400 }
    );
  }

  const client = await getClient();

  try {
    const query = `
      SELECT 
        ap.id,
        ap.period_name,
        ap.bs_closed,
        ap.bs_closed_at,
        u.username as closed_by_username,
        acj.id as closing_journal_record_id,
        je.id as carry_forward_journal_id,
        acj.total_assets,
        acj.total_liabilities,
        acj.total_equity,
        acj.carry_forward_count
      FROM accounting_periods ap
      LEFT JOIN users u ON ap.bs_closed_by = u.id
      LEFT JOIN accounting_closing_journals acj ON acj.period_id = ap.id AND acj.closing_type = 'BS_CLOSING'
      LEFT JOIN journal_entries je ON ap.bs_closing_journal_id = je.id
      WHERE ap.id = $1
    `;

    const result = await client.query(query, [periodId]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Period not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('BS status check error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to check BS status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
