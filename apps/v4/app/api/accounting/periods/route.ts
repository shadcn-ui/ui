import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

/**
 * GET /api/accounting/periods
 * 
 * List accounting periods with filtering
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const fiscalYear = searchParams.get('fiscal_year')
    const status = searchParams.get('status')
    const periodType = searchParams.get('period_type')

    let sql = `
      SELECT 
        ap.*,
        acj.id as closing_journal_id,
        acj.journal_entry_id,
        acj.total_revenue,
        acj.total_expense,
        acj.net_result,
        je.entry_number as closing_entry_number,
        u.first_name || ' ' || u.last_name as closed_by_name,
        pl_user.first_name || ' ' || pl_user.last_name as pl_closed_by_name,
        bs_user.first_name || ' ' || bs_user.last_name as bs_closed_by_name,
        inv_user.first_name || ' ' || inv_user.last_name as inventory_closed_by_name
      FROM accounting_periods ap
      LEFT JOIN accounting_closing_journals acj ON ap.id = acj.period_id AND acj.closing_type = 'PL_CLOSING'
      LEFT JOIN journal_entries je ON acj.journal_entry_id = je.id
      LEFT JOIN users u ON acj.closed_by = u.id
      LEFT JOIN users pl_user ON ap.pl_closed_by = pl_user.id
      LEFT JOIN users bs_user ON ap.bs_closed_by = bs_user.id
      LEFT JOIN users inv_user ON ap.inventory_closed_by = inv_user.id
      WHERE 1=1
    `

    const params: any[] = []
    let paramIndex = 1

    if (fiscalYear) {
      sql += ` AND ap.fiscal_year = $${paramIndex}`
      params.push(parseInt(fiscalYear))
      paramIndex++
    }

    if (status) {
      sql += ` AND ap.status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }

    if (periodType) {
      sql += ` AND ap.period_type = $${paramIndex}`
      params.push(periodType)
      paramIndex++
    }

    sql += ` ORDER BY ap.start_date DESC`

    const result = await query(sql, params)

    return NextResponse.json({
      success: true,
      periods: result.rows
    })

  } catch (error) {
    console.error('Error fetching periods:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch periods' },
      { status: 500 }
    )
  }
}
