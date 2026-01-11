import { NextRequest, NextResponse } from 'next/server'
import { getClient } from '@/lib/db'
import { computeCashFlow } from '@/lib/accounting/reports'

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

    const result = await computeCashFlow(client, { period_id: periodId })

    return NextResponse.json({ success: true, period: result.range, ...result })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate cash flow report' },
      { status: 400 }
    )
  } finally {
    client.release()
  }
}
