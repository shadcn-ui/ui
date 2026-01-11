import { PoolClient } from 'pg'
import crypto from 'crypto'
import { computeSignedAmount, AccountBalanceRow } from './reports'

export interface CashBankValidationResult {
  canClose: boolean
  checks: Record<string, { pass: boolean; message: string; details?: any }>
  period: {
    id: number
    period_name: string
    start_date: string
    end_date: string
    status: string
    cash_closed: boolean
  }
  ending_balances: Array<{ account_id: number; account_name: string; balance: number }>
  clearing_balance: number
}

const CASH_MATCH = "(UPPER(coa.account_type) IN ('CASH','BANK') OR LOWER(coa.account_subtype) LIKE '%cash%' OR LOWER(coa.account_subtype) LIKE '%bank%')"

async function getPeriod(client: PoolClient, periodId: string | number) {
  const res = await client.query(
    `SELECT id, period_name, start_date, end_date, status, cash_closed FROM accounting_periods WHERE id = $1 LIMIT 1`,
    [periodId]
  )
  const period = res.rows[0]
  if (!period) throw new Error('Period not found')
  return period
}

async function fetchCashBalances(client: PoolClient, endDate: string) {
  const res = await client.query(
    `SELECT coa.id as account_id, coa.account_name, coa.account_type, coa.account_subtype, coa.normal_balance,
            COALESCE(SUM(jel.debit_amount),0) as debit,
            COALESCE(SUM(jel.credit_amount),0) as credit
     FROM chart_of_accounts coa
     LEFT JOIN journal_entry_lines jel ON jel.account_id = coa.id
     LEFT JOIN journal_entries je ON je.id = jel.journal_entry_id AND je.status ILIKE 'POSTED'
     WHERE ${CASH_MATCH}
       AND (je.entry_date <= $1::date OR je.id IS NULL)
     GROUP BY coa.id, coa.account_name, coa.account_type, coa.account_subtype, coa.normal_balance
     ORDER BY coa.account_name`,
    [endDate]
  )

  return res.rows.map((row) => {
    const signed = computeSignedAmount({
      account_id: row.account_id,
      account_name: row.account_name,
      account_type: row.account_type,
      account_subtype: row.account_subtype,
      normal_balance: row.normal_balance,
      debit: Number(row.debit || 0),
      credit: Number(row.credit || 0),
    } as AccountBalanceRow)
    return { account_id: row.account_id, account_name: row.account_name, balance: signed }
  })
}

async function computeClearingBalance(client: PoolClient, endDate: string) {
  const res = await client.query(
    `SELECT coa.id, coa.account_name, coa.account_type, coa.account_subtype, coa.normal_balance,
            COALESCE(SUM(jel.debit_amount),0) as debit,
            COALESCE(SUM(jel.credit_amount),0) as credit
     FROM chart_of_accounts coa
     LEFT JOIN journal_entry_lines jel ON jel.account_id = coa.id
     LEFT JOIN journal_entries je ON je.id = jel.journal_entry_id AND je.status ILIKE 'POSTED'
     WHERE LOWER(coa.account_subtype) LIKE '%clearing%'
       AND (je.entry_date <= $1::date OR je.id IS NULL)
     GROUP BY coa.id, coa.account_name, coa.account_type, coa.account_subtype, coa.normal_balance`,
    [endDate]
  )

  return res.rows.reduce((sum, row) => {
    const signed = computeSignedAmount({
      account_id: row.id,
      account_name: row.account_name,
      account_type: row.account_type,
      account_subtype: row.account_subtype,
      normal_balance: row.normal_balance,
      debit: Number(row.debit || 0),
      credit: Number(row.credit || 0),
    } as AccountBalanceRow)
    return sum + signed
  }, 0)
}

async function bankReconciliationCompleted(client: PoolClient, periodId: string | number) {
  const tableExists = await client.query(
    `SELECT EXISTS (
       SELECT 1 FROM information_schema.tables 
       WHERE table_schema = 'public' AND table_name = 'bank_reconciliations'
     ) as exists`
  )
  if (!tableExists.rows[0]?.exists) return { pass: true, message: 'Bank reconciliation table absent (skipped)', details: {} }

  const rec = await client.query(
    `SELECT status, explanation FROM bank_reconciliations WHERE period_id = $1 ORDER BY created_at DESC LIMIT 1`,
    [periodId]
  )
  if (rec.rows.length === 0) {
    return { pass: false, message: 'Bank reconciliation missing', details: {} }
  }
  const row = rec.rows[0]
  const ok = ['COMPLETED', 'EXPLAINED'].includes((row.status || '').toUpperCase()) || Boolean(row.explanation)
  return {
    pass: ok,
    message: ok ? 'Bank reconciliation completed/explained' : 'Bank reconciliation not completed',
    details: row,
  }
}

export async function validateCashBankClose(client: PoolClient, periodId: string | number): Promise<CashBankValidationResult> {
  const period = await getPeriod(client, periodId)

  const checks: CashBankValidationResult['checks'] = {}

  // Customer receipts posted (no draft AR-related journals)
  const receiptsDraft = await client.query(
    `SELECT COUNT(*) AS draft_count
     FROM journal_entries je
     JOIN journal_entry_lines jel ON je.id = jel.journal_entry_id
     JOIN chart_of_accounts coa ON coa.id = jel.account_id
     WHERE je.entry_date BETWEEN $1 AND $2
       AND je.status NOT ILIKE 'POSTED'
       AND (LOWER(coa.account_subtype) LIKE '%receivable%')`,
    [period.start_date, period.end_date]
  )
  const receiptsPass = parseInt(receiptsDraft.rows[0]?.draft_count || '0', 10) === 0
  checks.customerReceiptsPosted = {
    pass: receiptsPass,
    message: receiptsPass ? 'Customer receipts posted' : `${receiptsDraft.rows[0].draft_count} draft receipt journal(s)`,
    details: { draftCount: parseInt(receiptsDraft.rows[0]?.draft_count || '0', 10) }
  }

  // Supplier payments posted (no draft AP-related journals)
  const paymentsDraft = await client.query(
    `SELECT COUNT(*) AS draft_count
     FROM journal_entries je
     JOIN journal_entry_lines jel ON je.id = jel.journal_entry_id
     JOIN chart_of_accounts coa ON coa.id = jel.account_id
     WHERE je.entry_date BETWEEN $1 AND $2
       AND je.status NOT ILIKE 'POSTED'
       AND (LOWER(coa.account_subtype) LIKE '%payable%')`,
    [period.start_date, period.end_date]
  )
  const paymentsPass = parseInt(paymentsDraft.rows[0]?.draft_count || '0', 10) === 0
  checks.supplierPaymentsPosted = {
    pass: paymentsPass,
    message: paymentsPass ? 'Supplier payments posted' : `${paymentsDraft.rows[0].draft_count} draft payment journal(s)`,
    details: { draftCount: parseInt(paymentsDraft.rows[0]?.draft_count || '0', 10) }
  }

  // No draft cash/bank journals
  const draftCash = await client.query(
    `SELECT COUNT(DISTINCT je.id) AS draft_count
     FROM journal_entries je
     JOIN journal_entry_lines jel ON je.id = jel.journal_entry_id
     JOIN chart_of_accounts coa ON coa.id = jel.account_id
     WHERE je.entry_date BETWEEN $1 AND $2
       AND je.status NOT ILIKE 'POSTED'
       AND ${CASH_MATCH}`,
    [period.start_date, period.end_date]
  )
  const draftCashPass = parseInt(draftCash.rows[0]?.draft_count || '0', 10) === 0
  checks.noDraftCashBank = {
    pass: draftCashPass,
    message: draftCashPass ? 'No draft cash/bank journals' : `${draftCash.rows[0].draft_count} draft cash/bank journal(s)`,
    details: { draftCount: parseInt(draftCash.rows[0]?.draft_count || '0', 10) }
  }

  // Clearing balance zero
  const clearingBalance = await computeClearingBalance(client, period.end_date)
  const clearingPass = Math.abs(clearingBalance) < 0.01
  checks.clearingZero = {
    pass: clearingPass,
    message: clearingPass ? 'Clearing accounts zeroed' : `Clearing balance ${clearingBalance}`,
    details: { balance: clearingBalance }
  }

  // Internal transfers balanced (cash/bank-only journals must net to zero)
  const transferCheck = await client.query(
    `SELECT je.id,
            COALESCE(SUM(CASE WHEN ${CASH_MATCH} THEN jel.debit_amount - jel.credit_amount ELSE 0 END),0) AS delta,
            COALESCE(SUM(CASE WHEN ${CASH_MATCH} THEN 0 ELSE 1 END),0) AS non_cash_lines
     FROM journal_entries je
     JOIN journal_entry_lines jel ON je.id = jel.journal_entry_id
     JOIN chart_of_accounts coa ON coa.id = jel.account_id
     WHERE je.entry_date BETWEEN $1 AND $2
     GROUP BY je.id`,
    [period.start_date, period.end_date]
  )
  const transferUnbalanced = transferCheck.rows.filter((r) => r.non_cash_lines === 0 && Math.abs(Number(r.delta) || 0) >= 0.01)
  const transfersPass = transferUnbalanced.length === 0
  checks.internalTransfersBalanced = {
    pass: transfersPass,
    message: transfersPass ? 'Internal transfers balanced' : `${transferUnbalanced.length} transfer(s) off by delta`,
    details: transferUnbalanced,
  }

  // Bank reconciliation status
  const bankRec = await bankReconciliationCompleted(client, period.id)
  checks.bankReconciled = bankRec

  // Period cash_closed flag
  checks.notAlreadyClosed = {
    pass: period.cash_closed === false,
    message: period.cash_closed ? 'Cash/Bank already closed' : 'Cash/Bank open',
    details: { cash_closed: period.cash_closed }
  }

  const canClose = Object.values(checks).every((c) => c.pass)
  const ending_balances = await fetchCashBalances(client, period.end_date)

  return {
    canClose,
    checks,
    period,
    ending_balances,
    clearing_balance: clearingBalance,
  }
}

export async function closeCashBankPeriod(client: PoolClient, periodId: string | number, closedBy: string) {
  const validation = await validateCashBankClose(client, periodId)
  if (!validation.canClose) {
    return { success: false, error: 'Validation failed', validation }
  }

  const snapshot = {
    period_id: validation.period.id,
    period_name: validation.period.period_name,
    ending_balances: validation.ending_balances,
    clearing_balance: validation.clearing_balance,
    validation: validation.checks,
    computed_at: new Date().toISOString(),
  }
  const snapshot_hash = crypto.createHash('sha256').update(JSON.stringify(snapshot)).digest('hex')

  await client.query('BEGIN')
  try {
    await client.query(
      `UPDATE accounting_periods
         SET cash_closed = true,
             cash_closed_at = NOW(),
             cash_closed_by = $1
       WHERE id = $2`,
      [closedBy, periodId]
    )

    await client.query(
      `INSERT INTO cash_bank_close_audit (period_id, closed_by, snapshot, snapshot_hash, validation)
       VALUES ($1, $2, $3, $4, $5)`,
      [periodId, closedBy, snapshot, snapshot_hash, validation.checks]
    )

    await client.query('COMMIT')
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  }

  return {
    success: true,
    period_id: periodId,
    closed_by: closedBy,
    snapshot,
    snapshot_hash,
  }
}
