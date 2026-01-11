import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

/**
 * GET /api/accounting/period-status?date=YYYY-MM-DD
 * 
 * Pre-flight check for period and inventory status.
 * Used by UIs to disable buttons and show warnings before submission.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]

    const result = await query(
      `SELECT 
        id,
        period_name,
        status,
        pl_closed,
        inventory_closed,
        start_date,
        end_date
       FROM accounting_periods
       WHERE $1::date BETWEEN start_date AND end_date
       LIMIT 1`,
      [date]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({
        success: false,
        canSubmit: false,
        human_message: 'No accounting period found for this date.',
        suggested_next_action: 'Create an accounting period that covers this date, or select a different date.',
        period: null,
      })
    }

    const period = result.rows[0]
    const isOpen = period.status && period.status.toUpperCase() === 'OPEN'
    const canSubmitJournal = isOpen && !period.pl_closed
    const canSubmitInventory = isOpen && !period.inventory_closed

    let human_message = 'Period is open and ready.'
    let suggested_next_action = ''

    if (!isOpen) {
      human_message = 'The accounting period is closed.'
      suggested_next_action = 'Period is closed. Post correction in next period as a forward adjustment.'
    } else if (period.pl_closed) {
      human_message = 'P&L period is closed. Revenue/COGS posting blocked.'
      suggested_next_action = 'Revenue/COGS blocked. Post correction in next period and reference original date.'
    } else if (period.inventory_closed) {
      human_message = 'Inventory period is closed.'
      suggested_next_action = 'Inventory is closed. Post correction in next period or reopen per finance policy.'
    }

    return NextResponse.json({
      success: true,
      canSubmit: isOpen,
      canSubmitJournal,
      canSubmitInventory,
      human_message,
      suggested_next_action,
      period: {
        id: period.id,
        period_name: period.period_name,
        status: period.status,
        pl_closed: period.pl_closed,
        inventory_closed: period.inventory_closed,
        start_date: period.start_date,
        end_date: period.end_date,
      },
    })
  } catch (error) {
    console.error('Error checking period status:', error)
    return NextResponse.json(
      {
        success: false,
        canSubmit: false,
        human_message: 'Unable to check period status.',
        suggested_next_action: 'Contact support if this persists.',
      },
      { status: 500 }
    )
  }
}
