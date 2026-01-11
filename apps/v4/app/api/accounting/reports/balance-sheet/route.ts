import { NextRequest, NextResponse } from 'next/server'
import { getClient } from '@/lib/db'
import { computeBalanceSheet } from '@/lib/accounting/reports'

export async function GET(request: NextRequest) {
  const client = await getClient()
  try {
    const searchParams = request.nextUrl.searchParams
    const periodId = searchParams.get('period_id')

    if (!periodId) {
      return NextResponse.json(
        { success: false, error: 'period_id is required' },
        { status: 400 }
      )
    }

    const result = await computeBalanceSheet(client, { period_id: periodId })

    return NextResponse.json({
      success: true,
      as_of_period: result.range,
      assets_total: result.assets_total,
      liabilities_total: result.liabilities_total,
      equity_total: result.equity_total,
      retained_earnings: result.retained_earnings,
      current_period_net_income: result.current_period_net_income,
      balanced: result.balanced,
      imbalance_delta: result.imbalance_delta,
      sections: result.sections,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate balance sheet' },
      { status: 400 }
    )
  } finally {
    client.release()
  }
}
