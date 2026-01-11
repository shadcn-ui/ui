import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// POST /api/accounting/accounts-receivable/[id]/payment - Record payment received
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const receivableId = parseInt(id)
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

    // Get the invoice
    const invoiceResult = await query(
      `SELECT ar.*, c.name as customer_name 
       FROM accounts_receivable ar
       LEFT JOIN customers c ON ar.customer_id = c.id
       WHERE ar.id = $1`,
      [receivableId]
    )

    if (invoiceResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      )
    }

    const invoice = invoiceResult.rows[0]
    const outstanding = parseFloat(invoice.total_amount) - parseFloat(invoice.paid_amount)

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

    // Get AR asset account
    const arAccount = await query(
      `SELECT id FROM chart_of_accounts 
       WHERE account_type = 'Asset' 
       AND (account_name ILIKE '%receivable%' OR account_code LIKE '1103%')
       ORDER BY account_code LIMIT 1`
    )

    if (arAccount.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Accounts Receivable account not found' },
        { status: 500 }
      )
    }

    // Calculate new payment status
    const newPaidAmount = parseFloat(invoice.paid_amount) + parseFloat(payment_amount)
    const totalAmount = parseFloat(invoice.total_amount)
    let newStatus = 'Unpaid'
    
    if (newPaidAmount >= totalAmount) {
      newStatus = 'Paid'
    } else if (newPaidAmount > 0) {
      newStatus = 'Partially Paid'
    }

    // Update the invoice
    await query(
      `UPDATE accounts_receivable 
       SET paid_amount = paid_amount + $1,
           payment_status = $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3`,
      [payment_amount, newStatus, receivableId]
    )

    // Create payment record
    const paymentResult = await query(
      `INSERT INTO ar_payments (
        receivable_id, payment_date, payment_amount,
        payment_method, reference_number, notes
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [receivableId, payment_date, payment_amount, payment_method, reference_number, notes]
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
      ) VALUES ($1, $2, 'Receipt', $3, 'Posted')
      RETURNING id`,
      [
        entryNumber,
        payment_date,
        `Payment received for ${invoice.invoice_number} - ${invoice.customer_name}`
      ]
    )

    const journalEntryId = journalEntry.rows[0].id

    // Create journal entry lines (Debit Cash/Bank, Credit AR)
    await query(
      `INSERT INTO journal_entry_lines (
        journal_entry_id, line_number, account_id, 
        description, debit_amount, credit_amount
      ) VALUES 
        ($1, 1, $2, $3, $4, 0),
        ($1, 2, $5, $3, 0, $4)`,
      [
        journalEntryId,
        paymentAccountId,
        `Payment received ${invoice.invoice_number}`,
        payment_amount,
        arAccount.rows[0].id
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

// GET /api/accounting/accounts-receivable/[id]/payment - Get payment history
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const receivableId = parseInt(id)

    const result = await query(
      `SELECT * FROM ar_payments 
       WHERE receivable_id = $1 
       ORDER BY payment_date DESC`,
      [receivableId]
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
