import { NextRequest, NextResponse } from 'next/server'
import { getClient, query } from '@/lib/db'
import { closeCashBankPeriod, validateCashBankClose } from '@/lib/accounting/cashBankClose'
import { rejectWithIssue } from '@/lib/issues'
import { blockAdminOverride, requireIssueTrail } from '@/lib/runtime-flags'

export async function POST(request: NextRequest) {
  const adminOverride = blockAdminOverride(request)
  if (adminOverride) return adminOverride

  const issueTrail = requireIssueTrail(request, 'Cash/Bank close action')
  if (!issueTrail.ok && issueTrail.response) return issueTrail.response

  const client = await getClient()
  try {
    const body = await request.json()
    const { periodId, userId } = body

    if (!periodId) {
      const rejection = await rejectWithIssue({
        client,
        type: 'JOURNAL',
        reference_id: 'cashbank-close-missing-period',
        error_code: 'INVALID_SEQUENCE',
        human_message: 'periodId is required to close cash/bank.',
        suggested_next_action: 'Provide a valid periodId and retry the close.',
        statusCode: 400,
      })
      return NextResponse.json(rejection.body, { status: rejection.statusCode })
    }

    const fallbackUser = await query(`SELECT id FROM users ORDER BY created_at ASC LIMIT 1`)
    const actingUserId = userId || fallbackUser.rows[0]?.id

    if (!actingUserId) {
      const rejection = await rejectWithIssue({
        client,
        type: 'JOURNAL',
        reference_id: String(periodId),
        error_code: 'MISSING_DEPENDENCY',
        human_message: 'No users found to attribute closing action.',
        suggested_next_action: 'Create at least one user and retry the close.',
        statusCode: 500,
      })
      return NextResponse.json(rejection.body, { status: rejection.statusCode })
    }

    // Re-validate before closing
    const validation = await validateCashBankClose(client, periodId)
    if (!validation.canClose) {
      const rejection = await rejectWithIssue({
        client,
        type: 'JOURNAL',
        reference_id: String(periodId),
        error_code: 'INVALID_SEQUENCE',
        human_message: 'Cash/Bank close failed validation. Resolve blocking checks and retry.',
        suggested_next_action: 'Fix the failed validation checks or post a forward adjustment in the next open period.',
        metadata: { validation },
        statusCode: 400,
      })
      return NextResponse.json(rejection.body, { status: rejection.statusCode })
    }

    const result = await closeCashBankPeriod(client, periodId, actingUserId)
    if (!result.success) {
      const rejection = await rejectWithIssue({
        client,
        type: 'JOURNAL',
        reference_id: String(periodId),
        error_code: 'INVALID_SEQUENCE',
        human_message: result.error || 'Cash/Bank close failed.',
        suggested_next_action: 'Review the failure reason and retry, or post a forward adjustment in the next open period.',
        metadata: { result },
        statusCode: 400,
      })
      return NextResponse.json(rejection.body, { status: rejection.statusCode })
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error: any) {
    const rejection = await rejectWithIssue({
      client,
      type: 'JOURNAL',
      reference_id: 'cashbank-close-error',
      error_code: 'INVALID_SEQUENCE',
      human_message: 'Failed to close cash/bank due to an unexpected error.',
      suggested_next_action: 'Review server logs, fix the blocker, or post a forward adjustment in the next open period.',
      metadata: { details: error?.message || 'Unknown error' },
      statusCode: 500,
    })
    return NextResponse.json(rejection.body, { status: rejection.statusCode })
  } finally {
    client.release()
  }
}
