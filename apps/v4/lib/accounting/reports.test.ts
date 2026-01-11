import { describe, it, expect, beforeEach } from 'vitest'
import { newDb } from 'pg-mem'
import { randomUUID } from 'crypto'
import { computeProfitAndLoss, computeBalanceSheet, computeCashFlow } from './reports'

const baseDate = '2025-01-15'

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
      pl_closed BOOLEAN DEFAULT false
    );
    CREATE TABLE chart_of_accounts (
      id SERIAL PRIMARY KEY,
      account_code VARCHAR(50) UNIQUE NOT NULL,
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
  `)

  await client.query(
    `INSERT INTO accounting_periods (id, period_name, start_date, end_date, status, pl_closed) VALUES
     (1, 'Jan 2025', '2025-01-01', '2025-01-31', 'CLOSED', true),
     (2, 'Feb 2025', '2025-02-01', '2025-02-28', 'OPEN', false)`
  )

  await client.query(
    `INSERT INTO chart_of_accounts (id, account_code, account_name, account_type, account_subtype, normal_balance) VALUES
     (1, '4100', 'Sales Revenue', 'Revenue', 'Sales', 'CREDIT'),
     (2, '5100', 'Cost of Goods Sold', 'Expense', 'COGS', 'DEBIT'),
     (3, '1110', 'Cash', 'Asset', 'Cash', 'DEBIT'),
     (4, '1300', 'Accounts Receivable', 'Asset', 'Accounts Receivable', 'DEBIT'),
     (5, '2100', 'Accounts Payable', 'Liability', 'Accounts Payable', 'CREDIT'),
     (6, '1400', 'Inventory', 'Asset', 'Inventory', 'DEBIT'),
      (7, '5200', 'Depreciation Expense', 'Expense', 'Depreciation', 'DEBIT'),
      (8, '2150', 'Accrued Expenses', 'Liability', 'Accrued Expenses', 'CREDIT')`
  )
}

async function postJe(
  client: any,
  entryDate: string,
  lines: Array<{ account_id: number; debit?: number; credit?: number }>
) {
  const je = await client.query(
    `INSERT INTO journal_entries (entry_number, entry_date, status) VALUES ($1, $2, 'POSTED') RETURNING id`,
    [randomUUID(), entryDate]
  )
  let idx = 1
  for (const line of lines) {
    await client.query(
      `INSERT INTO journal_entry_lines (journal_entry_id, account_id, debit_amount, credit_amount)
       VALUES ($1, $2, $3, $4)`,
      [je.rows[0].id, line.account_id, line.debit || 0, line.credit || 0]
    )
    idx++
  }
}

describe('Accounting reports from journals', () => {
  let client: any

  beforeEach(async () => {
    client = buildDb()
    await seedCore(client)

    // Seed JE for Jan: Revenue 100, COGS 40
    await postJe(client, '2025-01-15', [
      { account_id: 4, debit: 100 },
      { account_id: 1, credit: 100 },
    ])
    await postJe(client, '2025-01-15', [
      { account_id: 2, debit: 40 },
      { account_id: 6, credit: 40 },
    ])

    // Seed JE for Feb: Revenue 200, COGS 80, Depreciation 10
    await postJe(client, '2025-02-10', [
      { account_id: 4, debit: 200 },
      { account_id: 1, credit: 200 },
    ])
    await postJe(client, '2025-02-10', [
      { account_id: 2, debit: 80 },
      { account_id: 6, credit: 80 },
    ])
    await postJe(client, '2025-02-10', [
      { account_id: 7, debit: 10 },
      { account_id: 8, credit: 10 },
    ])
  })

  it('computes P&L for Feb with correct totals', async () => {
    const pl = await computeProfitAndLoss(client, { period_id: 2 })
    expect(pl.revenue_total).toBeCloseTo(200)
    expect(pl.expense_total).toBeCloseTo(90) // 80 COGS + 10 depreciation
    expect(pl.net_profit).toBeCloseTo(110)
  })

  it('computes Balance Sheet and balances A = L + E', async () => {
    const bs = await computeBalanceSheet(client, { period_id: 2 })
    expect(bs.balanced).toBe(true)
    expect(bs.assets_total).toBeCloseTo(bs.liabilities_total + bs.equity_total)
    expect(bs.retained_earnings).toBeCloseTo(60)
    expect(bs.current_period_net_income).toBeCloseTo(110)
    const allSections = [
      ...bs.sections.assets,
      ...bs.sections.liabilities,
      ...bs.sections.equity,
    ]
    expect(allSections.every((row) => !['REVENUE', 'EXPENSE', 'COGS', 'SALES_RETURN'].includes(row.account_type.toUpperCase()))).toBe(true)
  })

  it('computes Cash Flow (indirect) opening + net = closing', async () => {
    const cf = await computeCashFlow(client, { period_id: 2 })
    const computedClosing = cf.opening_cash + cf.net_cash_change
    expect(computedClosing).toBeCloseTo(cf.closing_cash)
    expect(cf.reconciled).toBe(true)
    expect(cf.reconciliation_delta).toBe(0)
  })

  it('closed period still reports', async () => {
    const pl = await computeProfitAndLoss(client, { period_id: 1 })
    expect(pl.net_profit).toBeCloseTo(60) // 100 - 40
  })

  it('empty period returns zeros', async () => {
    const pl = await computeProfitAndLoss(client, { from_date: '2030-01-01', to_date: '2030-01-31' })
    expect(pl.revenue_total).toBe(0)
    expect(pl.expense_total).toBe(0)
    expect(pl.net_profit).toBe(0)
  })
})
