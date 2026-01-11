import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// GET /api/accounting/accounts-payable - List all payables
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const supplierId = searchParams.get('supplier_id')
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    const overdue = searchParams.get('overdue') === 'true'

    let sql = `
      SELECT 
        ap.*,
        s.name as supplier_name,
        coa.account_name as expense_account_name,
        CASE 
          WHEN ap.payment_status = 'Unpaid' AND ap.due_date < CURRENT_DATE THEN true
          ELSE false
        END as is_overdue,
        CASE 
          WHEN ap.payment_status = 'Unpaid' AND ap.due_date < CURRENT_DATE 
          THEN CURRENT_DATE - ap.due_date
          ELSE 0
        END as days_overdue
      FROM accounts_payable ap
      LEFT JOIN suppliers s ON ap.supplier_id = s.id
      LEFT JOIN chart_of_accounts coa ON ap.expense_account_id = coa.id
      WHERE 1=1
    `
    
    const params: any[] = []
    let paramIndex = 1

    if (status) {
      sql += ` AND ap.payment_status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }

    if (supplierId) {
      sql += ` AND ap.supplier_id = $${paramIndex}`
      params.push(parseInt(supplierId))
      paramIndex++
    }

    if (startDate) {
      sql += ` AND ap.bill_date >= $${paramIndex}`
      params.push(startDate)
      paramIndex++
    }

    if (endDate) {
      sql += ` AND ap.bill_date <= $${paramIndex}`
      params.push(endDate)
      paramIndex++
    }

    if (overdue) {
      sql += ` AND ap.payment_status = 'Unpaid' AND ap.due_date < CURRENT_DATE`
    }

    sql += ` ORDER BY ap.due_date ASC, ap.bill_date DESC`

    const result = await query(sql, params)

    // Get summary statistics
    const stats = await query(`
      SELECT 
        COUNT(*) as total_bills,
        COUNT(CASE WHEN payment_status = 'Unpaid' THEN 1 END) as unpaid_count,
        COUNT(CASE WHEN payment_status = 'Partially Paid' THEN 1 END) as partially_paid_count,
        COUNT(CASE WHEN payment_status = 'Paid' THEN 1 END) as paid_count,
        COUNT(CASE WHEN payment_status = 'Unpaid' AND due_date < CURRENT_DATE THEN 1 END) as overdue_count,
        COALESCE(SUM(total_amount), 0) as total_amount,
        COALESCE(SUM(paid_amount), 0) as total_paid,
        COALESCE(SUM(total_amount - paid_amount), 0) as total_outstanding,
        COALESCE(SUM(CASE WHEN payment_status = 'Unpaid' AND due_date < CURRENT_DATE THEN total_amount - paid_amount ELSE 0 END), 0) as total_overdue
      FROM accounts_payable
      WHERE 1=1
      ${status ? `AND payment_status = $1` : ''}
    `, status ? [status] : [])

    return NextResponse.json({
      success: true,
      payables: result.rows,
      stats: stats.rows[0]
    })

  } catch (error) {
    console.error('Error fetching accounts payable:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch accounts payable' },
      { status: 500 }
    )
  }
}

// POST /api/accounting/accounts-payable - Create new bill
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      supplier_id,
      bill_number,
      bill_date,
      due_date,
      total_amount,
      expense_account_id,
      description,
      reference_number
    } = body

    // Validate required fields
    if (!supplier_id || !bill_date || !due_date || !total_amount || !expense_account_id) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate supplier exists
    const supplierCheck = await query(
      'SELECT id FROM suppliers WHERE id = $1',
      [supplier_id]
    )
    if (supplierCheck.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Supplier not found' },
        { status: 404 }
      )
    }

    // Validate expense account exists and is type Expense
    const accountCheck = await query(
      'SELECT id, account_type FROM chart_of_accounts WHERE id = $1',
      [expense_account_id]
    )
    if (accountCheck.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Expense account not found' },
        { status: 404 }
      )
    }
    if (accountCheck.rows[0].account_type !== 'Expense') {
      return NextResponse.json(
        { success: false, error: 'Account must be of type Expense' },
        { status: 400 }
      )
    }

    // Generate bill number if not provided
    let finalBillNumber = bill_number
    if (!finalBillNumber) {
      const year = new Date(bill_date).getFullYear()
      const lastBill = await query(
        `SELECT bill_number FROM accounts_payable 
         WHERE bill_number LIKE $1 
         ORDER BY bill_number DESC LIMIT 1`,
        [`BILL-${year}-%`]
      )
      
      if (lastBill.rows.length > 0) {
        const lastNumber = parseInt(lastBill.rows[0].bill_number.split('-')[2])
        finalBillNumber = `BILL-${year}-${String(lastNumber + 1).padStart(4, '0')}`
      } else {
        finalBillNumber = `BILL-${year}-0001`
      }
    }

    // Check for duplicate bill number
    const duplicateCheck = await query(
      'SELECT id FROM accounts_payable WHERE bill_number = $1',
      [finalBillNumber]
    )
    if (duplicateCheck.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Bill number already exists' },
        { status: 400 }
      )
    }

    // Get Accounts Payable account (liability)
    const apAccount = await query(
      `SELECT id FROM chart_of_accounts 
       WHERE account_type = 'Liability' 
       AND account_code LIKE '2%' 
       ORDER BY account_code LIMIT 1`
    )
    
    if (apAccount.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Accounts Payable liability account not found' },
        { status: 500 }
      )
    }

    // Create the bill
    const result = await query(
      `INSERT INTO accounts_payable (
        supplier_id, bill_number, bill_date, due_date, 
        total_amount, paid_amount, payment_status,
        expense_account_id, description, reference_number
      ) VALUES ($1, $2, $3, $4, $5, 0, 'Unpaid', $6, $7, $8)
      RETURNING *`,
      [supplier_id, finalBillNumber, bill_date, due_date, total_amount, expense_account_id, description, reference_number]
    )

    const newBill = result.rows[0]

    // Create journal entry for the bill
    const entryYear = new Date(bill_date).getFullYear()
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
      ) VALUES ($1, $2, 'Bill', $3, 'Posted')
      RETURNING id`,
      [entryNumber, bill_date, description || `Bill ${finalBillNumber} from supplier`]
    )

    const journalEntryId = journalEntry.rows[0].id

    // Create journal entry lines (Debit Expense, Credit AP)
    await query(
      `INSERT INTO journal_entry_lines (
        journal_entry_id, line_number, account_id, 
        description, debit_amount, credit_amount
      ) VALUES 
        ($1, 1, $2, $3, $4, 0),
        ($1, 2, $5, $3, 0, $4)`,
      [
        journalEntryId,
        expense_account_id,
        description || `Bill ${finalBillNumber}`,
        total_amount,
        apAccount.rows[0].id
      ]
    )

    return NextResponse.json({
      success: true,
      payable: newBill,
      journal_entry_id: journalEntryId,
      message: 'Bill created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating bill:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create bill' },
      { status: 500 }
    )
  }
}
