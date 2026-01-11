import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// GET /api/accounting/chart-of-accounts/[id] - Get single account
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const id = parseInt(resolvedParams.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid account ID' },
        { status: 400 }
      )
    }

    const result = await query(`
      SELECT 
        coa.*,
        parent.account_name as parent_account_name,
        parent.account_code as parent_account_code,
        (
          SELECT COUNT(*) 
          FROM chart_of_accounts child 
          WHERE child.parent_account_id = coa.id
        ) as child_count,
        (
          SELECT JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', child.id,
              'account_code', child.account_code,
              'account_name', child.account_name,
              'current_balance', child.current_balance
            )
          )
          FROM chart_of_accounts child 
          WHERE child.parent_account_id = coa.id
        ) as child_accounts
      FROM chart_of_accounts coa
      LEFT JOIN chart_of_accounts parent ON coa.parent_account_id = parent.id
      WHERE coa.id = $1
    `, [id])

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Account not found' },
        { status: 404 }
      )
    }

    // Get recent transactions
    const transactions = await query(`
      SELECT 
        je.id,
        je.entry_number,
        je.entry_date,
        je.entry_type,
        je.description,
        jel.debit_amount,
        jel.credit_amount
      FROM journal_entry_lines jel
      JOIN journal_entries je ON jel.journal_entry_id = je.id
      WHERE jel.account_id = $1
      AND je.status = 'Posted'
      ORDER BY je.entry_date DESC
      LIMIT 10
    `, [id])

    return NextResponse.json({
      success: true,
      account: result.rows[0],
      recent_transactions: transactions.rows
    })

  } catch (error) {
    console.error('Error fetching account:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch account' },
      { status: 500 }
    )
  }
}

// PUT /api/accounting/chart-of-accounts/[id] - Update account
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const id = parseInt(resolvedParams.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid account ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    
    const allowed = [
      'account_name', 'account_subtype', 'parent_account_id',
      'description', 'is_active'
    ]
    
    const fields: string[] = []
    const values: any[] = []
    let paramIndex = 1

    for (const key of Object.keys(body)) {
      if (allowed.includes(key)) {
        fields.push(`${key} = $${paramIndex}`)
        values.push(body[key])
        paramIndex++
      }
    }

    if (fields.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    fields.push('updated_at = CURRENT_TIMESTAMP')
    values.push(id)

    const result = await query(`
      UPDATE chart_of_accounts 
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `, values)

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Account not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      account: result.rows[0],
      message: 'Account updated successfully'
    })

  } catch (error: any) {
    console.error('Error updating account:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update account',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

// DELETE /api/accounting/chart-of-accounts/[id] - Delete/deactivate account
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const id = parseInt(resolvedParams.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid account ID' },
        { status: 400 }
      )
    }

    // Check if account has child accounts
    const childCheck = await query(
      'SELECT COUNT(*) as count FROM chart_of_accounts WHERE parent_account_id = $1',
      [id]
    )

    if (parseInt(childCheck.rows[0].count) > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete account with child accounts' },
        { status: 409 }
      )
    }

    // Check if account has transactions
    const transactionCheck = await query(
      'SELECT COUNT(*) as count FROM journal_entry_lines WHERE account_id = $1',
      [id]
    )

    if (parseInt(transactionCheck.rows[0].count) > 0) {
      // Deactivate instead of delete
      const result = await query(`
        UPDATE chart_of_accounts 
        SET is_active = false, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *
      `, [id])

      return NextResponse.json({
        success: true,
        message: 'Account deactivated (has transactions)',
        account: result.rows[0]
      })
    }

    // Safe to delete
    const result = await query(
      'DELETE FROM chart_of_accounts WHERE id = $1 RETURNING *',
      [id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Account not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully'
    })

  } catch (error: any) {
    console.error('Error deleting account:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete account',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
