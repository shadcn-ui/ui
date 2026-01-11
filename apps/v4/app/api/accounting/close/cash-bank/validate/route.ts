import { NextRequest, NextResponse } from 'next/server'
import { getClient } from '@/lib/db'
import { validateCashBankClose } from '@/lib/accounting/cashBankClose'
import { rejectWithIssue } from '@/lib/issues'

export async function GET(request: NextRequest) {
  const client = await getClient()
  try {
    const searchParams = request.nextUrl.searchParams
    const periodId = searchParams.get('period_id')

    if (!periodId) {
      const rejection = await rejectWithIssue({
        client,
        type: 'JOURNAL',
        reference_id: 'cashbank-validate-missing-period',
        error_code: 'INVALID_SEQUENCE',
        human_message: 'period_id is required to validate cash/bank close.',
        suggested_next_action: 'Provide a valid period_id and retry validation.',
        statusCode: 400,
      })
      return NextResponse.json(rejection.body, { status: rejection.statusCode })
    }

    const result = await validateCashBankClose(client, periodId)

    return NextResponse.json({
      success: true,
      canClose: result.canClose,
      checks: result.checks,
      period: result.period,
      ending_balances: result.ending_balances,
      clearing_balance: result.clearing_balance,
    })
  } catch (error: any) {
    const rejection = await rejectWithIssue({
      client,
      type: 'JOURNAL',
      reference_id: 'cashbank-validate-error',
      error_code: 'INVALID_SEQUENCE',
      human_message: 'Failed to validate cash/bank close due to an unexpected error.',
      suggested_next_action: 'Review server logs, fix the blocker, or re-run validation.',
      metadata: { details: error?.message || 'Unknown error' },
      statusCode: 400,
    })
    return NextResponse.json(rejection.body, { status: rejection.statusCode })
  } finally {
    client.release()
  }
}
