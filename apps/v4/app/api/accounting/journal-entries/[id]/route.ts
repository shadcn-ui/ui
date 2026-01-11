import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// GET /api/accounting/journal-entries/[id] - Get single journal entry
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const id = parseInt(resolvedParams.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid journal entry ID' },
        { status: 400 }
      )
    }

    const result = await query(`
      SELECT 
        je.*,
        u1.first_name || ' ' || u1.last_name as created_by_name,
        u2.first_name || ' ' || u2.last_name as posted_by_name,
        json_agg(
          json_build_object(
            'id', jel.id,
            'line_number', jel.line_number,
            'account_id', jel.account_id,
            'account_code', coa.account_code,
            'account_name', coa.account_name,
            'account_type', coa.account_type,
            'description', jel.description,
            'debit_amount', jel.debit_amount,
            'credit_amount', jel.credit_amount
          ) ORDER BY jel.line_number
        ) as lines
      FROM journal_entries je
      LEFT JOIN users u1 ON je.created_by = u1.id
      LEFT JOIN users u2 ON je.posted_by = u2.id
      LEFT JOIN journal_entry_lines jel ON je.id = jel.journal_entry_id
      LEFT JOIN chart_of_accounts coa ON jel.account_id = coa.id
      WHERE je.id = $1
      GROUP BY je.id, u1.first_name, u1.last_name, u2.first_name, u2.last_name
    `, [id])

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Journal entry not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      entry: result.rows[0]
    })

  } catch (error) {
    console.error('Error fetching journal entry:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch journal entry' },
      { status: 500 }
    )
  }
}

// DELETE /api/accounting/journal-entries/[id] - Delete draft journal entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const id = parseInt(resolvedParams.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid journal entry ID' },
        { status: 400 }
      )
    }

    // Check if entry is posted or in locked period
    const checkResult = await query(
      `SELECT je.status, je.entry_date,
              EXISTS(
                SELECT 1 FROM accounting_periods ap
                WHERE je.entry_date BETWEEN ap.start_date AND ap.end_date
                AND ap.pl_closed = true
              ) as period_locked
       FROM journal_entries je
       WHERE je.id = $1`,
      [id]
    )

    if (checkResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Journal entry not found' },
        { status: 404 }
      )
    }

    const entry = checkResult.rows[0]

    if (entry.status === 'Posted') {
      return NextResponse.json(
        { success: false, error: 'Cannot delete posted journal entry' },
        { status: 409 }
      )
    }

    if (entry.period_locked === true) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete journal entry in closed period' },
        { status: 403 }
      )
    }

    // Delete entry (cascade will delete lines)
    await query('DELETE FROM journal_entries WHERE id = $1', [id])

    return NextResponse.json({
      success: true,
      message: 'Journal entry deleted successfully'
    })

  } catch (error: any) {
    console.error('Error deleting journal entry:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete journal entry',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
