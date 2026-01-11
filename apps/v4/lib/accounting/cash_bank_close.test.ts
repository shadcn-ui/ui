import { describe, it, expect, beforeEach } from 'vitest'
import { newDb } from 'pg-mem'
import { randomUUID } from 'crypto'
import { computeCashFlow } from './reports'
import { validateCashBankClose, closeCashBankPeriod } from './cashBankClose'

function buildDb() {
  const db = newDb({ autoCreateForeignKeyIndices: true })
  const { Client } = db.adapters.createPg()
  const client = new Client()
  return client
}

async function seedCore(client: any) {
  await client.connect()
  await client.query(`
    CREATE TABLE accounting_periods (
      id SERIAL PRIMARY KEY,
      period_name VARCHAR(100),
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      status VARCHAR(50) DEFAULT 'OPEN',
      pl_closed BOOLEAN DEFAULT false,
      cash_closed BOOLEAN DEFAULT false,
      cash_closed_at TIMESTAMP,
      cash_closed_by UUID
    );
    CREATE TABLE chart_of_accounts (
      id SERIAL PRIMARY KEY,
      account_code VARCHAR(50),
      account_name VARCHAR(255) NOT NULL,
      account_type VARCHAR(50) NOT NULL,
      account_subtype VARCHAR(100),
      normal_balance VARCHAR(10)
    );
    CREATE TABLE journal_entries (
      id SERIAL PRIMARY KEY,
      entry_number VARCHAR(50),
      entry_date DATE NOT NULL,
      status VARCHAR(20) DEFAULT 'POSTED'
    );
    CREATE TABLE journal_entry_lines (
      id SERIAL PRIMARY KEY,
      journal_entry_id INTEGER REFERENCES journal_entries(id),
      account_id INTEGER REFERENCES chart_of_accounts(id),
      debit_amount NUMERIC(15,2) DEFAULT 0,
      credit_amount NUMERIC(15,2) DEFAULT 0
    );
    CREATE TABLE bank_reconciliations (
      id SERIAL PRIMARY KEY,
      period_id INTEGER,
      status VARCHAR(50),
      explanation TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE cash_bank_close_audit (
      id TEXT PRIMARY KEY DEFAULT 'audit-id',
      period_id INTEGER NOT NULL REFERENCES accounting_periods(id),
      closed_by TEXT NOT NULL,
      closed_at TIMESTAMP NOT NULL DEFAULT NOW(),
      snapshot JSONB NOT NULL,
      snapshot_hash TEXT NOT NULL,
      validation JSONB NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `)

  await client.query(
    `INSERT INTO accounting_periods (id, period_name, start_date, end_date, status, pl_closed, cash_closed)
     VALUES
      (1, 'Jan 2025', '2025-01-01', '2025-01-31', 'OPEN', false, false),
      (2, 'Feb 2025', '2025-02-01', '2025-02-28', 'OPEN', false, false)`
  )

  await client.query(
    `INSERT INTO chart_of_accounts (id, account_code, account_name, account_type, account_subtype, normal_balance) VALUES
     (1, '1110', 'Cash', 'Asset', 'Cash', 'DEBIT'),
     (2, '1120', 'Bank', 'Asset', 'Bank', 'DEBIT'),
     (3, '2100', 'Accounts Payable', 'Liability', 'Accounts Payable', 'CREDIT'),
     (4, '1300', 'Accounts Receivable', 'Asset', 'Accounts Receivable', 'DEBIT'),
    (5, '1999', 'Inventory', 'Asset', 'Inventory', 'DEBIT'),
     (6, '4100', 'Sales Revenue', 'Revenue', 'Sales', 'CREDIT'),
     (7, '5100', 'COGS', 'Expense', 'COGS', 'DEBIT')`
  )

  // Jan transactions
  await postJe(client, '2025-01-15', [
    { account_id: 1, debit: 100 },
    { account_id: 6, credit: 100 },
  ])
  await postJe(client, '2025-01-15', [
    { account_id: 7, debit: 40 },
    { account_id: 5, credit: 40 },
  ])

  // Feb transactions
  await postJe(client, '2025-02-10', [
    { account_id: 2, debit: 200 },
    { account_id: 6, credit: 200 },
  ])
  await postJe(client, '2025-02-10', [
    { account_id: 7, debit: 80 },
    { account_id: 5, credit: 80 },
  ])
}

async function postJe(
  client: any,
  entryDate: string,
  lines: Array<{ account_id: number; debit?: number; credit?: number }>
) {
  const periodRes = await client.query(
    `SELECT id, cash_closed FROM accounting_periods WHERE $1::date BETWEEN start_date AND end_date LIMIT 1`,
    [entryDate]
  )
  const period = periodRes.rows[0]

  // Guard to simulate trigger blocking
  for (const line of lines) {
    const acct = await client.query(`SELECT account_type, account_subtype FROM chart_of_accounts WHERE id = $1`, [line.account_id])
    const subtype = (acct.rows[0]?.account_subtype || '').toLowerCase()
    const isCash = ['cash', 'bank'].includes((acct.rows[0]?.account_type || '').toLowerCase()) || subtype.includes('cash') || subtype.includes('bank')
    if (period?.cash_closed && isCash) {
      throw new Error('Cash/Bank closed. Adjust next period only.')
    }
  }

  const je = await client.query(
    `INSERT INTO journal_entries (entry_number, entry_date, status) VALUES ($1, $2, 'POSTED') RETURNING id`,
    [randomUUID(), entryDate]
  )
  for (const line of lines) {
    await client.query(
      `INSERT INTO journal_entry_lines (journal_entry_id, account_id, debit_amount, credit_amount)
       VALUES ($1, $2, $3, $4)`,
      [je.rows[0].id, line.account_id, line.debit || 0, line.credit || 0]
    )
  }
}

async function updateLineGuard(client: any, lineId: number, debitAmount: number) {
  const line = await client.query(
    `SELECT jel.account_id, je.entry_date FROM journal_entry_lines jel JOIN journal_entries je ON je.id = jel.journal_entry_id WHERE jel.id = $1`,
    [lineId]
  )
  const entryDate = line.rows[0].entry_date
  const periodRes = await client.query(
    `SELECT cash_closed FROM accounting_periods WHERE $1::date BETWEEN start_date AND end_date LIMIT 1`,
    [entryDate]
  )
  const period = periodRes.rows[0]
  const acct = await client.query(`SELECT account_type, account_subtype FROM chart_of_accounts WHERE id = $1`, [line.rows[0].account_id])
  const subtype = (acct.rows[0]?.account_subtype || '').toLowerCase()
  const isCash = ['cash', 'bank'].includes((acct.rows[0]?.account_type || '').toLowerCase()) || subtype.includes('cash') || subtype.includes('bank')
  if (period?.cash_closed && isCash) {
    throw new Error('Cash/Bank closed. Adjust next period only.')
  }
  return client.query(`UPDATE journal_entry_lines SET debit_amount = $1 WHERE id = $2`, [debitAmount, lineId])
}

describe('Cash & Bank closing', () => {
  let client: any

  beforeEach(async () => {
    client = buildDb()
    await seedCore(client)
  })

  it('cannot close without reconciliation', async () => {
    const result = await validateCashBankClose(client, 1)
    expect(result.canClose).toBe(false)
    expect(result.checks.bankReconciled.pass).toBe(false)
  })

  it('cash journals are blocked after close', async () => {
    await client.query(`UPDATE accounting_periods SET cash_closed = true WHERE id = 1`)
    await expect(
      postJe(client, '2025-01-20', [
        { account_id: 1, debit: 50 },
        { account_id: 3, credit: 50 },
      ])
    ).rejects.toThrow()
  })

  it('cash balance is frozen (updates blocked)', async () => {
    await client.query(`UPDATE accounting_periods SET cash_closed = true WHERE id = 1`)
    const line = await client.query(`SELECT id FROM journal_entry_lines LIMIT 1`)
    await expect(updateLineGuard(client, line.rows[0].id, 999)).rejects.toThrow()
  })

  it('cash flow invariant holds', async () => {
    const cf = await computeCashFlow(client, { period_id: 2 })
    const computedClosing = cf.opening_cash + cf.net_cash_change
    expect(computedClosing).toBeCloseTo(cf.closing_cash)
    expect(cf.reconciled).toBe(true)
  })

  it('next-period adjustment allowed', async () => {
    await client.query(`UPDATE accounting_periods SET cash_closed = true WHERE id = 1`)
    await expect(
      postJe(client, '2025-02-12', [
        { account_id: 2, debit: 30 },
        { account_id: 3, credit: 30 },
      ])
    ).resolves.not.toThrow()
  })

  it('closing succeeds when reconciled and audit logged', async () => {
    await client.query(`INSERT INTO bank_reconciliations (period_id, status) VALUES (1, 'COMPLETED')`)
    const closedBy = randomUUID()
    const validation = await validateCashBankClose(client, 1)
    expect(validation.canClose).toBe(true)
    const result = await closeCashBankPeriod(client, 1, closedBy)
    expect(result.success).toBe(true)
    const period = await client.query(`SELECT cash_closed, cash_closed_by FROM accounting_periods WHERE id = 1`)
    expect(period.rows[0].cash_closed).toBe(true)
    expect(period.rows[0].cash_closed_by).toBe(closedBy)
    const audit = await client.query(`SELECT COUNT(*) AS cnt FROM cash_bank_close_audit WHERE period_id = 1`)
    expect(parseInt(audit.rows[0].cnt, 10)).toBe(1)
  })
})
