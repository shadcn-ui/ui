/**
 * Accounting Integration Helper
 * Automatically creates journal entries for business transactions
 */

import { Pool } from 'pg'

interface JournalEntryLine {
  account_code: string
  description: string
  debit_amount: number
  credit_amount: number
}

interface CreateJournalEntryParams {
  entry_date: Date | string
  description: string
  reference?: string
  lines: JournalEntryLine[]
  created_by?: string
  source_type?: string
  source_id?: number
}

/**
 * Create a journal entry with automatic posting
 */
export async function createJournalEntry(
  pool: Pool,
  params: CreateJournalEntryParams
): Promise<{ success: boolean; entry_id?: number; error?: string }> {
  console.log('🔵 Creating journal entry:', { description: params.description, reference: params.reference });
  const client = await pool.connect()
  
  try {
    await client.query('BEGIN')
    
    // Validate that debits equal credits
    const totalDebit = params.lines.reduce((sum, line) => sum + line.debit_amount, 0)
    const totalCredit = params.lines.reduce((sum, line) => sum + line.credit_amount, 0)
    
    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      throw new Error(`Journal entry is not balanced. Debits: ${totalDebit}, Credits: ${totalCredit}`)
    }
    
    // Generate entry number in format JE-YYYY-XXX
    const currentYear = new Date().getFullYear()
    const entryNumberResult = await client.query(`
      SELECT COALESCE(
        MAX(
          CAST(
            SUBSTRING(entry_number FROM LENGTH('JE-YYYY-') + 1) AS INTEGER
          )
        ), 0
      ) + 1 as next_num
      FROM journal_entries
      WHERE entry_number LIKE 'JE-${currentYear}-%'
    `)
    const nextNum = entryNumberResult.rows[0].next_num
    const entryNumber = `JE-${currentYear}-${String(nextNum).padStart(3, '0')}`
    
    // Create journal entry header
    const entryResult = await client.query(`
      INSERT INTO journal_entries (
        entry_number,
        entry_date,
        description,
        reference,
        total_debit,
        total_credit,
        status,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, 'draft', NOW(), NOW())
      RETURNING id
    `, [
      entryNumber,
      params.entry_date,
      params.description,
      params.reference || null,
      totalDebit,
      totalCredit
    ])
    
    const entryId = entryResult.rows[0].id
    
    // Create journal entry lines
    for (let i = 0; i < params.lines.length; i++) {
      const line = params.lines[i]
      
      // Get account_id from account number in `accounts` table
      const accountResult = await client.query(
        'SELECT id FROM accounts WHERE account_number = $1',
        [line.account_code]
      )
      
      if (accountResult.rows.length === 0) {
        throw new Error(`Account with code ${line.account_code} not found`)
      }
      
      const accountId = accountResult.rows[0].id
      
      await client.query(`
        INSERT INTO journal_entry_lines (
          journal_entry_id,
          account_id,
          description,
          debit_amount,
          credit_amount,
          created_at
        ) VALUES ($1, $2, $3, $4, $5, NOW())
      `, [
        entryId,
        accountId,
        line.description,
        line.debit_amount,
        line.credit_amount
      ])
    }
    
    await client.query('COMMIT')
    console.log('✅ Journal entry created successfully:', entryId);
    
    return { success: true, entry_id: entryId }
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('❌ Error creating journal entry:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  } finally {
    client.release()
  }
}

/**
 * Create journal entry for sales order confirmation
 * Debit: Accounts Receivable (1300)
 * Credit: Sales Revenue (4100)
 */
export async function createSalesOrderJournalEntry(
  pool: Pool,
  orderId: string | null,
  orderNumber: string,
  customer: string,
  totalAmount: number,
  orderDate: Date | string
): Promise<{ success: boolean; entry_id?: number; error?: string }> {
  return createJournalEntry(pool, {
    entry_date: orderDate,
    description: `Sales Order ${orderNumber} - ${customer}`,
    reference: orderNumber,
    source_type: 'Sales Order',
    lines: [
      {
        account_code: '1300', // Accounts Receivable
        description: `Invoice for ${customer}`,
        debit_amount: totalAmount,
        credit_amount: 0
      },
      {
        account_code: '4100', // Sales Revenue
        description: `Sales to ${customer}`,
        debit_amount: 0,
        credit_amount: totalAmount
      }
    ]
  })
}

/**
 * Create journal entry for cash sale (Confirmed AND Paid)
 * Debit: Cash/Bank (1110 or 1210)
 * Credit: Sales Revenue (4100)
 */
export async function createCashSaleJournalEntry(
  pool: Pool,
  orderId: string | null,
  orderNumber: string,
  customer: string,
  totalAmount: number,
  orderDate: Date | string,
  paymentMethod: string = 'Cash'
): Promise<{ success: boolean; entry_id?: number; error?: string }> {
  // Determine cash account based on payment method
  let cashAccountCode = '1110' // Default: Cash and Cash Equivalents
  
  if (paymentMethod.toLowerCase().includes('bank') || paymentMethod.toLowerCase().includes('transfer')) {
    cashAccountCode = '1210' // Bank BCA - Operating
  }
  
  return createJournalEntry(pool, {
    entry_date: orderDate,
    description: `Cash Sale ${orderNumber} - ${customer}`,
    reference: orderNumber,
    source_type: 'Sales Order',
    lines: [
      {
        account_code: cashAccountCode,
        description: `Cash received from ${customer}`,
        debit_amount: totalAmount,
        credit_amount: 0
      },
      {
        account_code: '4100', // Sales Revenue
        description: `Sales to ${customer}`,
        debit_amount: 0,
        credit_amount: totalAmount
      }
    ]
  })
}

/**
 * Create journal entry for payment receipt
 * Debit: Cash/Bank (1110 or 1210)
 * Credit: Accounts Receivable (1300)
 */
export async function createPaymentJournalEntry(
  pool: Pool,
  orderNumber: string,
  customer: string,
  amount: number,
  paymentDate: Date | string,
  paymentMethod: string = 'Cash'
): Promise<{ success: boolean; entry_id?: number; error?: string }> {
  // Determine cash account based on payment method
  let cashAccountCode = '1110' // Default: Cash and Cash Equivalents
  
  if (paymentMethod.toLowerCase().includes('bank') || paymentMethod.toLowerCase().includes('transfer')) {
    cashAccountCode = '1210' // Bank BCA - Operating
  }
  
  return createJournalEntry(pool, {
    entry_date: paymentDate,
    description: `Payment received from ${customer} - ${orderNumber}`,
    reference: `PMT-${orderNumber}`,
    source_type: 'Payment',
    lines: [
      {
        account_code: cashAccountCode,
        description: `Payment via ${paymentMethod}`,
        debit_amount: amount,
        credit_amount: 0
      },
      {
        account_code: '1300', // Accounts Receivable
        description: `Payment from ${customer}`,
        debit_amount: 0,
        credit_amount: amount
      }
    ]
  })
}

/**
 * Create journal entry for inventory shipment (COGS)
 * Debit: Cost of Goods Sold (5100)
 * Credit: Inventory (1400)
 */
export async function createCOGSJournalEntry(
  pool: Pool,
  orderNumber: string,
  cogsAmount: number,
  shipDate: Date | string
): Promise<{ success: boolean; entry_id?: number; error?: string }> {
  return createJournalEntry(pool, {
    entry_date: shipDate,
    description: `Cost of Goods Sold - ${orderNumber}`,
    reference: `COGS-${orderNumber}`,
    lines: [
      {
        account_code: '5100', // Cost of Goods Sold
        description: `COGS for ${orderNumber}`,
        debit_amount: cogsAmount,
        credit_amount: 0
      },
      {
        account_code: '1400', // Inventory
        description: `Inventory decrease - ${orderNumber}`,
        debit_amount: 0,
        credit_amount: cogsAmount
      }
    ]
  })
}
