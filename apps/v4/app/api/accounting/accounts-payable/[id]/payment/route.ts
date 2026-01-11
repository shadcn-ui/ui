import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// POST /api/accounting/accounts-payable/[id]/payment - Record payment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const payableId = parseInt(id)
    const body = await request.json()
    const {
      payment_date,
      payment_amount,
      payment_method,
      bank_account_id,
      reference_number,
      notes
    } = body

    // Validate required fields
    if (!payment_date || !payment_amount || !payment_method) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (payment_amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Payment amount must be greater than zero' },
        { status: 400 }
      )
    }

    // Get the bill
    const billResult = await query(
      `SELECT ap.*, s.name as supplier_name 
       FROM accounts_payable ap
       LEFT JOIN suppliers s ON ap.supplier_id = s.id
       WHERE ap.id = $1`,
      [payableId]
    )

    if (billResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Bill not found' },
        { status: 404 }
      )
    }

    const bill = billResult.rows[0]
    const outstanding = parseFloat(bill.total_amount) - parseFloat(bill.paid_amount)

    // Validate payment amount
    if (payment_amount > outstanding) {
      return NextResponse.json(
        { success: false, error: `Payment amount exceeds outstanding balance of ${outstanding}` },
        { status: 400 }
      )
    }

    // Get bank/cash account for payment
    let paymentAccountId = bank_account_id
    if (!paymentAccountId) {
      // Default to first cash/bank account
      const cashAccount = await query(
        `SELECT id FROM chart_of_accounts 
         WHERE account_type = 'Asset' 
         AND (account_name ILIKE '%cash%' OR account_name ILIKE '%bank%')
         ORDER BY account_code LIMIT 1`
      )
      
      if (cashAccount.rows.length === 0) {
        return NextResponse.json(
          { success: false, error: 'No cash/bank account found' },
          { status: 500 }
        )
      }
      paymentAccountId = cashAccount.rows[0].id
    }

    // Get AP liability account
    const apAccount = await query(
      `SELECT id FROM chart_of_accounts 
       WHERE account_type = 'Liability' 
       AND account_code LIKE '2%' 
       ORDER BY account_code LIMIT 1`
    )

    if (apAccount.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Accounts Payable account not found' },
        { status: 500 }
      )
    }

    // Calculate new payment status
    const newPaidAmount = parseFloat(bill.paid_amount) + parseFloat(payment_amount)
    const totalAmount = parseFloat(bill.total_amount)
    let newStatus = 'Unpaid'
    
    if (newPaidAmount >= totalAmount) {
      newStatus = 'Paid'
    } else if (newPaidAmount > 0) {
      newStatus = 'Partially Paid'
    }

    // Update the bill
    await query(
      `UPDATE accounts_payable 
       SET paid_amount = paid_amount + $1,
           payment_status = $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3`,
      [payment_amount, newStatus, payableId]
    )

    // Create payment record
    const paymentResult = await query(
      `INSERT INTO ap_payments (
        payable_id, payment_date, payment_amount,
        payment_method, reference_number, notes
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [payableId, payment_date, payment_amount, payment_method, reference_number, notes]
    )

    // Create journal entry for payment
    const entryYear = new Date(payment_date).getFullYear()
    const lastEntry = await query(
      `SELECT entry_number FROM journal_entries 
       WHERE entry_number LIKE $1 
       ORDER BY entry_number DESC LIMIT 1`,
      [`JE-${entryYear}-%`]
    )
    
    let entryNumber
    if (lastEntry.rows.length > 0) {
      const lastNumber = parseInt(lastEntry.rows[0].entry_number.split('-')[2])
      entryNumber = `JE-${entryYear}-${String(lastNumber + 1).padStart(4, '0')}`
    } else {
      entryNumber = `JE-${entryYear}-0001`
    }

    const journalEntry = await query(
      `INSERT INTO journal_entries (
        entry_number, entry_date, entry_type, description, status
      ) VALUES ($1, $2, 'Payment', $3, 'Posted')
      RETURNING id`,
      [
        entryNumber,
        payment_date,
        `Payment for ${bill.bill_number} - ${bill.supplier_name}`
      ]
    )

    const journalEntryId = journalEntry.rows[0].id

    // Create journal entry lines (Debit AP, Credit Cash/Bank)
    await query(
      `INSERT INTO journal_entry_lines (
        journal_entry_id, line_number, account_id, 
        description, debit_amount, credit_amount
      ) VALUES 
        ($1, 1, $2, $3, $4, 0),
        ($1, 2, $5, $3, 0, $4)`,
      [
        journalEntryId,
        apAccount.rows[0].id,
        `Payment ${bill.bill_number}`,
        payment_amount,
        paymentAccountId
      ]
    )

    return NextResponse.json({
      success: true,
      payment: paymentResult.rows[0],
      new_status: newStatus,
      outstanding_balance: totalAmount - newPaidAmount,
      journal_entry_id: journalEntryId,
      message: 'Payment recorded successfully'
    })

  } catch (error) {
    console.error('Error recording payment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to record payment' },
      { status: 500 }
    )
  }
}

// GET /api/accounting/accounts-payable/[id]/payment - Get payment history
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const payableId = parseInt(id)

    const result = await query(
      `SELECT * FROM ap_payments 
       WHERE payable_id = $1 
       ORDER BY payment_date DESC`,
      [payableId]
    )

    return NextResponse.json({
      success: true,
      payments: result.rows
    })

  } catch (error) {
    console.error('Error fetching payment history:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payment history' },
      { status: 500 }
    )
  }
}
