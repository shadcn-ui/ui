import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// GET /api/accounting/accounts-receivable - List all receivables
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const customerId = searchParams.get('customer_id')
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    const overdue = searchParams.get('overdue') === 'true'

    let sql = `
      SELECT 
        ar.*,
        c.name as customer_name,
        coa.account_name as revenue_account_name,
        CASE 
          WHEN ar.payment_status = 'Unpaid' AND ar.due_date < CURRENT_DATE THEN true
          ELSE false
        END as is_overdue,
        CASE 
          WHEN ar.payment_status = 'Unpaid' AND ar.due_date < CURRENT_DATE 
          THEN CURRENT_DATE - ar.due_date
          ELSE 0
        END as days_overdue
      FROM accounts_receivable ar
      LEFT JOIN customers c ON ar.customer_id = c.id
      LEFT JOIN chart_of_accounts coa ON ar.revenue_account_id = coa.id
      WHERE 1=1
    `
    
    const params: any[] = []
    let paramIndex = 1

    if (status) {
      sql += ` AND ar.payment_status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }

    if (customerId) {
      sql += ` AND ar.customer_id = $${paramIndex}`
      params.push(parseInt(customerId))
      paramIndex++
    }

    if (startDate) {
      sql += ` AND ar.invoice_date >= $${paramIndex}`
      params.push(startDate)
      paramIndex++
    }

    if (endDate) {
      sql += ` AND ar.invoice_date <= $${paramIndex}`
      params.push(endDate)
      paramIndex++
    }

    if (overdue) {
      sql += ` AND ar.payment_status != 'Paid' AND ar.due_date < CURRENT_DATE`
    }

    sql += ` ORDER BY ar.due_date ASC, ar.invoice_date DESC`

    const result = await query(sql, params)

    // Get summary statistics
    const stats = await query(`
      SELECT 
        COUNT(*) as total_invoices,
        COUNT(CASE WHEN payment_status = 'Unpaid' THEN 1 END) as unpaid_count,
        COUNT(CASE WHEN payment_status = 'Partially Paid' THEN 1 END) as partially_paid_count,
        COUNT(CASE WHEN payment_status = 'Paid' THEN 1 END) as paid_count,
        COUNT(CASE WHEN payment_status != 'Paid' AND due_date < CURRENT_DATE THEN 1 END) as overdue_count,
        COALESCE(SUM(total_amount), 0) as total_amount,
        COALESCE(SUM(paid_amount), 0) as total_collected,
        COALESCE(SUM(total_amount - paid_amount), 0) as total_outstanding,
        COALESCE(SUM(CASE WHEN payment_status != 'Paid' AND due_date < CURRENT_DATE THEN total_amount - paid_amount ELSE 0 END), 0) as total_overdue
      FROM accounts_receivable
      WHERE 1=1
      ${status ? `AND payment_status = $1` : ''}
    `, status ? [status] : [])

    return NextResponse.json({
      success: true,
      receivables: result.rows,
      stats: stats.rows[0]
    })

  } catch (error) {
    console.error('Error fetching accounts receivable:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch accounts receivable' },
      { status: 500 }
    )
  }
}

// POST /api/accounting/accounts-receivable - Create new invoice
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customer_id,
      invoice_number,
      invoice_date,
      due_date,
      total_amount,
      revenue_account_id,
      description,
      reference_number
    } = body

    // Validate required fields
    if (!customer_id || !invoice_date || !due_date || !total_amount || !revenue_account_id) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate customer exists
    const customerCheck = await query(
      'SELECT id FROM customers WHERE id = $1',
      [customer_id]
    )
    if (customerCheck.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      )
    }

    // Validate revenue account exists and is type Revenue
    const accountCheck = await query(
      'SELECT id, account_type FROM chart_of_accounts WHERE id = $1',
      [revenue_account_id]
    )
    if (accountCheck.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Revenue account not found' },
        { status: 404 }
      )
    }
    if (accountCheck.rows[0].account_type !== 'Revenue') {
      return NextResponse.json(
        { success: false, error: 'Account must be of type Revenue' },
        { status: 400 }
      )
    }

    // Generate invoice number if not provided
    let finalInvoiceNumber = invoice_number
    if (!finalInvoiceNumber) {
      const year = new Date(invoice_date).getFullYear()
      const lastInvoice = await query(
        `SELECT invoice_number FROM accounts_receivable 
         WHERE invoice_number LIKE $1 
         ORDER BY invoice_number DESC LIMIT 1`,
        [`INV-${year}-%`]
      )
      
      if (lastInvoice.rows.length > 0) {
        const lastNumber = parseInt(lastInvoice.rows[0].invoice_number.split('-')[2])
        finalInvoiceNumber = `INV-${year}-${String(lastNumber + 1).padStart(4, '0')}`
      } else {
        finalInvoiceNumber = `INV-${year}-0001`
      }
    }

    // Check for duplicate invoice number
    const duplicateCheck = await query(
      'SELECT id FROM accounts_receivable WHERE invoice_number = $1',
      [finalInvoiceNumber]
    )
    if (duplicateCheck.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Invoice number already exists' },
        { status: 400 }
      )
    }

    // Get Accounts Receivable account (asset)
    const arAccount = await query(
      `SELECT id FROM chart_of_accounts 
       WHERE account_type = 'Asset' 
       AND (account_name ILIKE '%receivable%' OR account_code LIKE '1103%')
       ORDER BY account_code LIMIT 1`
    )
    
    if (arAccount.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Accounts Receivable asset account not found' },
        { status: 500 }
      )
    }

    // Create the invoice
    const result = await query(
      `INSERT INTO accounts_receivable (
        customer_id, invoice_number, invoice_date, due_date, 
        total_amount, paid_amount, payment_status,
        revenue_account_id, description, reference_number
      ) VALUES ($1, $2, $3, $4, $5, 0, 'Unpaid', $6, $7, $8)
      RETURNING *`,
      [customer_id, finalInvoiceNumber, invoice_date, due_date, total_amount, revenue_account_id, description, reference_number]
    )

    const newInvoice = result.rows[0]

    // Create journal entry for the invoice
    const entryYear = new Date(invoice_date).getFullYear()
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

    // Create journal entry
    const journalEntry = await query(
      `INSERT INTO journal_entries (
        entry_number, entry_date, entry_type, description, status
      ) VALUES ($1, $2, 'Invoice', $3, 'Posted')
      RETURNING id`,
      [entryNumber, invoice_date, description || `Invoice ${finalInvoiceNumber} to customer`]
    )

    const journalEntryId = journalEntry.rows[0].id

    // Create journal entry lines (Debit AR, Credit Revenue)
    await query(
      `INSERT INTO journal_entry_lines (
        journal_entry_id, line_number, account_id, 
        description, debit_amount, credit_amount
      ) VALUES 
        ($1, 1, $2, $3, $4, 0),
        ($1, 2, $5, $3, 0, $4)`,
      [
        journalEntryId,
        arAccount.rows[0].id,
        description || `Invoice ${finalInvoiceNumber}`,
        total_amount,
        revenue_account_id
      ]
    )

    return NextResponse.json({
      success: true,
      receivable: newInvoice,
      journal_entry_id: journalEntryId,
      message: 'Invoice created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating invoice:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create invoice' },
      { status: 500 }
    )
  }
}
