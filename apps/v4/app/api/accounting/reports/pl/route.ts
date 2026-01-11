import { NextRequest, NextResponse } from 'next/server'
import { getClient } from '@/lib/db'
import { computeProfitAndLoss } from '@/lib/accounting/reports'

export async function GET(request: NextRequest) {
  const client = await getClient()
  try {
    const searchParams = request.nextUrl.searchParams
    const periodId = searchParams.get('period_id')
    const fromDate = searchParams.get('from_date')
    const toDate = searchParams.get('to_date')

    const result = await computeProfitAndLoss(client, {
      period_id: periodId,
      from_date: fromDate,
      to_date: toDate,
    })

    return NextResponse.json({
      success: true,
      period: result.range,
      revenue_total: result.revenue_total,
      expense_total: result.expense_total,
      net_profit: result.net_profit,
      breakdown: result.breakdown,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate P&L report' },
      { status: 400 }
    )
  } finally {
    client.release()
  }
}
