import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// GET /api/accounting/accounts-receivable/aging - Aging report
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const asOfDate = searchParams.get('as_of_date') || new Date().toISOString().split('T')[0]
    const customerId = searchParams.get('customer_id')

    let sql = `
      SELECT 
        ar.id,
        ar.customer_id,
        c.name as customer_name,
        ar.invoice_number,
        ar.invoice_date,
        ar.due_date,
        ar.total_amount,
        ar.paid_amount,
        (ar.total_amount - ar.paid_amount) as outstanding_amount,
        CAST($1 AS DATE) - ar.due_date as days_past_due,
        CASE
          WHEN ar.payment_status = 'Paid' THEN 'Paid'
          WHEN CAST($1 AS DATE) <= ar.due_date THEN 'Current'
          WHEN CAST($1 AS DATE) - ar.due_date BETWEEN 1 AND 30 THEN '1-30 Days'
          WHEN CAST($1 AS DATE) - ar.due_date BETWEEN 31 AND 60 THEN '31-60 Days'
          WHEN CAST($1 AS DATE) - ar.due_date BETWEEN 61 AND 90 THEN '61-90 Days'
          ELSE '90+ Days'
        END as aging_bucket
      FROM accounts_receivable ar
      LEFT JOIN customers c ON ar.customer_id = c.id
      WHERE ar.payment_status != 'Paid'
    `

    const params: any[] = [asOfDate]
    let paramIndex = 2

    if (customerId) {
      sql += ` AND ar.customer_id = $${paramIndex}`
      params.push(parseInt(customerId))
      paramIndex++
    }

    sql += ` ORDER BY c.name, ar.due_date`

    const result = await query(sql, params)

    // Calculate aging summary
    const summary = {
      current: 0,
      days_1_30: 0,
      days_31_60: 0,
      days_61_90: 0,
      days_90_plus: 0,
      total: 0
    }

    result.rows.forEach(row => {
      const outstanding = parseFloat(row.outstanding_amount)
      summary.total += outstanding

      switch (row.aging_bucket) {
        case 'Current':
          summary.current += outstanding
          break
        case '1-30 Days':
          summary.days_1_30 += outstanding
          break
        case '31-60 Days':
          summary.days_31_60 += outstanding
          break
        case '61-90 Days':
          summary.days_61_90 += outstanding
          break
        case '90+ Days':
          summary.days_90_plus += outstanding
          break
      }
    })

    // Group by customer if not filtering by customer
    let byCustomer: any[] = []
    if (!customerId) {
      const customerGroups = result.rows.reduce((acc: any, row: any) => {
        const custId = row.customer_id
        if (!acc[custId]) {
          acc[custId] = {
            customer_id: custId,
            customer_name: row.customer_name,
            current: 0,
            days_1_30: 0,
            days_31_60: 0,
            days_61_90: 0,
            days_90_plus: 0,
            total: 0,
            invoice_count: 0
          }
        }

        const outstanding = parseFloat(row.outstanding_amount)
        acc[custId].total += outstanding
        acc[custId].invoice_count++

        switch (row.aging_bucket) {
          case 'Current':
            acc[custId].current += outstanding
            break
          case '1-30 Days':
            acc[custId].days_1_30 += outstanding
            break
          case '31-60 Days':
            acc[custId].days_31_60 += outstanding
            break
          case '61-90 Days':
            acc[custId].days_61_90 += outstanding
            break
          case '90+ Days':
            acc[custId].days_90_plus += outstanding
            break
        }

        return acc
      }, {})

      byCustomer = Object.values(customerGroups)
    }

    return NextResponse.json({
      success: true,
      as_of_date: asOfDate,
      invoices: result.rows,
      summary,
      by_customer: byCustomer
    })

  } catch (error) {
    console.error('Error generating aging report:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate aging report' },
      { status: 500 }
    )
  }
}
