import { PoolClient } from 'pg'

export interface PeriodRange {
  start_date: string
  end_date: string
  period_name?: string
}

export interface AccountBalanceRow {
  account_id: number
  account_name: string
  account_type: string
  account_subtype: string | null
  normal_balance: string | null
  debit: number
  credit: number
}

const TEMP_ACCOUNT_TYPES = ['REVENUE', 'EXPENSE', 'COGS', 'SALES_RETURN']
const BALANCE_SHEET_ACCOUNT_TYPES = ['ASSET', 'LIABILITY', 'EQUITY']

function defaultNormalBalance(accountType: string | null): 'DEBIT' | 'CREDIT' {
  if (!accountType) return 'DEBIT'
  const upper = accountType.toUpperCase()
  if (['ASSET', 'EXPENSE', 'COGS', 'SALES_RETURN'].includes(upper)) return 'DEBIT'
  return 'CREDIT'
}

export async function getPeriodRangeByInput(
  client: PoolClient,
  params: { period_id?: string | number | null; from_date?: string | null; to_date?: string | null }
): Promise<PeriodRange> {
  if (params.period_id) {
    const res = await client.query(
      `SELECT id, period_name, start_date, end_date FROM accounting_periods WHERE id = $1 LIMIT 1`,
      [params.period_id]
    )
    const row = res.rows[0]
    if (!row) throw new Error('Period not found')
    return {
      start_date: row.start_date,
      end_date: row.end_date,
      period_name: row.period_name,
    }
  }

  if (!params.from_date || !params.to_date) {
    throw new Error('Either period_id or from_date/to_date is required')
  }

  return { start_date: params.from_date, end_date: params.to_date }
}

export async function fetchAccountBalances(
  client: PoolClient,
  range: PeriodRange,
  filterTypes: string[]
): Promise<AccountBalanceRow[]> {
  const res = await client.query(
    `SELECT 
       coa.id as account_id,
       coa.account_name,
       coa.account_type,
       coa.account_subtype,
       coa.normal_balance,
       COALESCE(SUM(jel.debit_amount),0) as debit,
       COALESCE(SUM(jel.credit_amount),0) as credit
     FROM chart_of_accounts coa
     LEFT JOIN journal_entry_lines jel ON jel.account_id = coa.id
     LEFT JOIN journal_entries je ON je.id = jel.journal_entry_id AND je.status ILIKE 'POSTED'
     WHERE UPPER(coa.account_type) = ANY($1::text[])
       AND (je.entry_date BETWEEN $2::date AND $3::date OR je.id IS NULL)
     GROUP BY coa.id, coa.account_name, coa.account_type, coa.account_subtype, coa.normal_balance
     ORDER BY coa.account_code`,
    [filterTypes.map((t) => t.toUpperCase()), range.start_date, range.end_date]
  )

  return res.rows.map((row) => ({
    account_id: row.account_id,
    account_name: row.account_name,
    account_type: row.account_type,
    account_subtype: row.account_subtype,
    normal_balance: row.normal_balance,
    debit: Number(row.debit || 0),
    credit: Number(row.credit || 0),
  }))
}

export function computeSignedAmount(row: AccountBalanceRow): number {
  const normal = (row.normal_balance || defaultNormalBalance(row.account_type)).toUpperCase()
  const debit = Number(row.debit || 0)
  const credit = Number(row.credit || 0)
  if (normal === 'DEBIT') return debit - credit
  return credit - debit
}

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

async function computeNetIncomeForRange(client: PoolClient, start_date: string, end_date: string): Promise<number> {
  const rows = await fetchAccountBalances(client, { start_date, end_date }, TEMP_ACCOUNT_TYPES)
  return rows.reduce((sum, r) => {
    const type = r.account_type.toUpperCase()
    const amount = computeSignedAmount(r)
    if (type === 'REVENUE') return sum + amount
    return sum - amount
  }, 0)
}

export async function computeRetainedEarnings(client: PoolClient, period_id: string | number): Promise<number> {
  const periodRes = await client.query(
    `SELECT id, start_date FROM accounting_periods WHERE id = $1 LIMIT 1`,
    [period_id]
  )
  const currentPeriod = periodRes.rows[0]
  if (!currentPeriod) throw new Error('Period not found')

  const closedPeriodsRes = await client.query(
    `SELECT id, start_date, end_date
     FROM accounting_periods
     WHERE pl_closed = true
       AND end_date < $1::date
     ORDER BY end_date`,
    [currentPeriod.start_date]
  )

  let retained = 0
  for (const p of closedPeriodsRes.rows) {
    retained += await computeNetIncomeForRange(client, p.start_date, p.end_date)
  }

  return retained
}

export async function computeProfitAndLoss(
  client: PoolClient,
  params: { period_id?: string | number | null; from_date?: string | null; to_date?: string | null }
) {
  const range = await getPeriodRangeByInput(client, params)
  const rows = await fetchAccountBalances(client, range, ['REVENUE', 'EXPENSE', 'COGS', 'SALES_RETURN'])

  const revenueRows = rows.filter((r) => r.account_type.toUpperCase() === 'REVENUE')
  const expenseRows = rows.filter((r) => ['EXPENSE', 'COGS', 'SALES_RETURN'].includes(r.account_type.toUpperCase()))

  const revenue_total = revenueRows.reduce((sum, r) => sum + Math.max(0, computeSignedAmount(r)), 0)
  const expense_total = expenseRows.reduce((sum, r) => sum + Math.max(0, computeSignedAmount(r)), 0)
  const net_profit = revenue_total - expense_total

  const breakdown = rows.map((r) => ({
    account_id: r.account_id,
    account_name: r.account_name,
    account_type: r.account_type,
    amount: Math.max(0, computeSignedAmount(r)),
  }))

  return { range, revenue_total, expense_total, net_profit, breakdown }
}

async function getPeriodWithStatus(client: PoolClient, period_id: string | number) {
  const res = await client.query(
    `SELECT id, period_name, start_date, end_date, pl_closed FROM accounting_periods WHERE id = $1 LIMIT 1`,
    [period_id]
  )
  const period = res.rows[0]
  if (!period) throw new Error('Period not found')
  return period
}

export async function computeBalanceSheet(
  client: PoolClient,
  params: { period_id: string | number }
) {
  const period = await getPeriodWithStatus(client, params.period_id)

  const range: PeriodRange = {
    start_date: period.start_date,
    end_date: period.end_date,
    period_name: period.period_name,
  }

  const upToRange: PeriodRange = { ...range, start_date: '1900-01-01' }
  const rows = await fetchAccountBalances(client, upToRange, BALANCE_SHEET_ACCOUNT_TYPES)

  const assets = rows.filter((r) => r.account_type.toUpperCase() === 'ASSET')
  const liabilities = rows.filter((r) => r.account_type.toUpperCase() === 'LIABILITY')
  const equity = rows.filter((r) => r.account_type.toUpperCase() === 'EQUITY')

  const assets_total = round2(assets.reduce((s, r) => s + computeSignedAmount(r), 0))
  const liabilities_total = round2(liabilities.reduce((s, r) => s + computeSignedAmount(r), 0))
  const opening_equity = round2(equity.reduce((s, r) => s + computeSignedAmount(r), 0))

  const retained_earnings = round2(await computeRetainedEarnings(client, period.id))
  const current_period_net_income = round2(
    period.pl_closed ? 0 : await computeNetIncomeForRange(client, period.start_date, period.end_date)
  )

  const equity_total = round2(opening_equity + retained_earnings + current_period_net_income)
  const imbalance_delta = round2(assets_total - (liabilities_total + equity_total))
  const balanced = round2(assets_total) === round2(liabilities_total + equity_total)

  return {
    range,
    assets_total,
    liabilities_total,
    equity_total,
    retained_earnings,
    current_period_net_income,
    balanced,
    imbalance_delta,
    sections: {
      assets: assets.map((r) => ({ ...r, amount: computeSignedAmount(r) })),
      liabilities: liabilities.map((r) => ({ ...r, amount: computeSignedAmount(r) })),
      equity: [
        ...equity.map((r) => ({ ...r, amount: computeSignedAmount(r) })),
        {
          account_id: null,
          account_name: 'Retained Earnings',
          account_type: 'Equity',
          account_subtype: 'Retained Earnings',
          normal_balance: 'CREDIT',
          debit: 0,
          credit: 0,
          amount: retained_earnings,
        },
        {
          account_id: null,
          account_name: 'Current Period Net Income',
          account_type: 'Equity',
          account_subtype: 'Current Period Result',
          normal_balance: 'CREDIT',
          debit: 0,
          credit: 0,
          amount: current_period_net_income,
        },
      ],
    },
  }
}

export async function computeBalanceByDate(
  client: PoolClient,
  asOfDate: string,
  accountType: string,
  subtypeMatcher?: (row: any) => boolean
) {
  const res = await client.query(
    `SELECT coa.id, coa.account_name, coa.account_type, coa.account_subtype, coa.normal_balance,
            COALESCE(SUM(jel.debit_amount),0) as debit,
            COALESCE(SUM(jel.credit_amount),0) as credit
     FROM chart_of_accounts coa
     LEFT JOIN journal_entry_lines jel ON jel.account_id = coa.id
     LEFT JOIN journal_entries je ON je.id = jel.journal_entry_id AND je.status ILIKE 'POSTED'
     WHERE UPPER(coa.account_type) = UPPER($1)
       AND (je.entry_date <= $2::date OR je.id IS NULL)
     GROUP BY coa.id, coa.account_name, coa.account_type, coa.account_subtype, coa.normal_balance`,
    [accountType, asOfDate]
  )

  return res.rows
    .filter((r) => (subtypeMatcher ? subtypeMatcher(r) : true))
    .reduce((sum, r) => sum + computeSignedAmount({
      account_id: r.id,
      account_name: r.account_name,
      account_type: r.account_type,
      account_subtype: r.account_subtype,
      normal_balance: r.normal_balance,
      debit: Number(r.debit || 0),
      credit: Number(r.credit || 0),
    }), 0)
}

async function computeOpeningCash(client: PoolClient, period_id: string | number): Promise<number> {
  const period = await getPeriodWithStatus(client, period_id)
  const dayBeforeStart = new Date(period.start_date)
  dayBeforeStart.setDate(dayBeforeStart.getDate() - 1)
  const asOf = dayBeforeStart.toISOString().slice(0, 10)

  const cashSelector = (r: any) => {
    const subtype = (r.account_subtype || '').toLowerCase()
    return subtype.includes('cash') || subtype.includes('bank')
  }

  return computeBalanceByDate(client, asOf, 'Asset', cashSelector)
}

async function computeClosingCash(client: PoolClient, period_id: string | number): Promise<number> {
  const period = await getPeriodWithStatus(client, period_id)
  const asOf = period.end_date
  const cashSelector = (r: any) => {
    const subtype = (r.account_subtype || '').toLowerCase()
    return subtype.includes('cash') || subtype.includes('bank')
  }

  return computeBalanceByDate(client, asOf, 'Asset', cashSelector)
}

export async function computeCashFlow(
  client: PoolClient,
  params: { period_id: string | number }
) {
  const period = await getPeriodWithStatus(client, params.period_id)
  const range = await getPeriodRangeByInput(client, { period_id: params.period_id })

  // Net income: if closed, derive from journals within the period (authoritative) but do not carry into BS
  const net_income = await computeNetIncomeForRange(client, range.start_date, range.end_date)

  const opening_cash = await computeOpeningCash(client, period.id)
  const closing_cash = await computeClosingCash(client, period.id)
  const net_cash_change = round2(closing_cash - opening_cash)

  const dayBeforeStart = new Date(range.start_date)
  dayBeforeStart.setDate(dayBeforeStart.getDate() - 1)
  const openingDate = dayBeforeStart.toISOString().slice(0, 10)
  const closingDate = range.end_date

  // Non-cash adjustments: depreciation/amortization movement during the period (expense increase)
  const depreciationMovement =
    (await computeBalanceByDate(
      client,
      closingDate,
      'Expense',
      (r) => (r.account_subtype || '').toLowerCase().includes('depreciation') || (r.account_name || '').toLowerCase().includes('depreciation')
    )) -
    (await computeBalanceByDate(
      client,
      openingDate,
      'Expense',
      (r) => (r.account_subtype || '').toLowerCase().includes('depreciation') || (r.account_name || '').toLowerCase().includes('depreciation')
    ))

  const amortizationMovement =
    (await computeBalanceByDate(
      client,
      closingDate,
      'Expense',
      (r) => (r.account_subtype || '').toLowerCase().includes('amortization') || (r.account_name || '').toLowerCase().includes('amortization')
    )) -
    (await computeBalanceByDate(
      client,
      openingDate,
      'Expense',
      (r) => (r.account_subtype || '').toLowerCase().includes('amortization') || (r.account_name || '').toLowerCase().includes('amortization')
    ))

  // Working capital deltas
  const arChange =
    (await computeBalanceByDate(client, closingDate, 'Asset', (r) => (r.account_subtype || '').toLowerCase().includes('receivable')))-
    (await computeBalanceByDate(client, openingDate, 'Asset', (r) => (r.account_subtype || '').toLowerCase().includes('receivable')))

  const invChange =
    (await computeBalanceByDate(client, closingDate, 'Asset', (r) => (r.account_subtype || '').toLowerCase().includes('inventory')))-
    (await computeBalanceByDate(client, openingDate, 'Asset', (r) => (r.account_subtype || '').toLowerCase().includes('inventory')))

  const apChange =
    (await computeBalanceByDate(client, closingDate, 'Liability', (r) => (r.account_subtype || '').toLowerCase().includes('payable')))-
    (await computeBalanceByDate(client, openingDate, 'Liability', (r) => (r.account_subtype || '').toLowerCase().includes('payable')))

  const nonCashAdjustments = round2(depreciationMovement + amortizationMovement)
  const workingCapitalDelta = round2(-arChange - invChange + apChange)

  const indirect_net_cash = round2(net_income + nonCashAdjustments + workingCapitalDelta)
  const reconciliation_delta = round2(indirect_net_cash - net_cash_change)
  const reconciled = round2(indirect_net_cash) === round2(net_cash_change)

  return {
    range,
    net_income,
    non_cash_adjustments: nonCashAdjustments,
    working_capital_delta: workingCapitalDelta,
    indirect_net_cash,
    opening_cash,
    closing_cash,
    net_cash_change,
    reconciled,
    reconciliation_delta,
    operating_cash_flow: indirect_net_cash,
    investing_cash_flow: 0,
    financing_cash_flow: 0,
  }
}
