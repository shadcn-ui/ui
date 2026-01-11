import { createHash } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getClient } from '@/lib/db'
import { blockAdminOverride, requireIssueTrail } from '@/lib/runtime-flags'
import { PoolClient } from 'pg'
import { buildErrorEnvelope } from '@/lib/errors/standard-error'
import { recordIssue } from '@/lib/issues'

type PeriodRow = {
  id: number
  period_name: string
  start_date: string
  end_date: string
  fiscal_year: number
  pl_closed: boolean
  inventory_closed: boolean
}

type ValidationCheck = {
  check_name: string
  is_valid: boolean
  message: string
  details?: Record<string, any>
}

type ValidationResult = {
  checks: ValidationCheck[]
  summary: { totalQty: number; totalValue: number }
}

function allChecksPass(checks: ValidationCheck[]) {
  return checks.every((check) => check.is_valid)
}

function tracePath() {
  return '/erp/accounting/close/inventory'
}

function envelope(code: string, human_message: string, suggested_next_action: string, reference?: { period_id?: string; inventory_close_id?: string }) {
  return buildErrorEnvelope({
    error_code: code,
    human_message,
    suggested_next_action,
    trace_path: tracePath(),
    reference: {
      period_id: reference?.period_id,
      inventory_close_id: reference?.inventory_close_id ?? 'inventory-close',
    },
  })
}

async function runValidation(client: PoolClient, period: PeriodRow): Promise<ValidationResult> {
  const checks: ValidationCheck[] = []

  checks.push({
    check_name: 'PL_CLOSED',
    is_valid: period.pl_closed === true,
    message: period.pl_closed
      ? 'P&L is closed for this period'
      : 'P&L must be closed before inventory closing',
    details: { pl_closed: period.pl_closed },
  })

  checks.push({
    check_name: 'INVENTORY_NOT_CLOSED',
    is_valid: period.inventory_closed !== true,
    message: period.inventory_closed
      ? 'Inventory already closed for this period'
      : 'Inventory not yet closed',
    details: { inventory_closed: period.inventory_closed },
  })

  const hasStatusColumnResult = await client.query(
    `SELECT EXISTS (
       SELECT 1 FROM information_schema.columns
       WHERE table_name = 'stock_movements' AND column_name = 'status'
     ) as exists`
  )
  const hasStatusColumn = hasStatusColumnResult.rows[0]?.exists === true

  let pendingMovements = 0

  if (hasStatusColumn) {
    const pendingResult = await client.query(
      `SELECT COUNT(*) AS pending_count
       FROM stock_movements
       WHERE movement_date BETWEEN $1 AND $2
         AND COALESCE(status, 'PENDING') NOT IN ('POSTED', 'COMPLETED')`,
      [period.start_date, period.end_date]
    )
    pendingMovements = parseInt(pendingResult.rows[0]?.pending_count || '0', 10)
  } else {
    const pendingResult = await client.query(
      `SELECT COUNT(*) AS pending_count
       FROM stock_movements
       WHERE movement_date BETWEEN $1 AND $2
         AND (movement_type ILIKE '%pending%' OR movement_type ILIKE '%draft%')`,
      [period.start_date, period.end_date]
    )
    pendingMovements = parseInt(pendingResult.rows[0]?.pending_count || '0', 10)
  }

  checks.push({
    check_name: 'NO_PENDING_MOVEMENTS',
    is_valid: pendingMovements === 0,
    message: pendingMovements === 0
      ? 'No pending stock movements in this period'
      : `${pendingMovements} pending stock movement(s) must be resolved`,
    details: { pending_count: pendingMovements, uses_status_column: hasStatusColumn },
  })

  const valuationResult = await client.query(
    `SELECT COUNT(*) AS missing_cost
     FROM stock_movements
     WHERE movement_date BETWEEN $1 AND $2
       AND (unit_cost IS NULL OR total_value IS NULL)`,
    [period.start_date, period.end_date]
  )
  const missingCost = parseInt(valuationResult.rows[0]?.missing_cost || '0', 10)

  checks.push({
    check_name: 'FIFO_VALUATION_COMPLETE',
    is_valid: missingCost === 0,
    message: missingCost === 0
      ? 'All movements in the period carry valuation data'
      : `${missingCost} movement(s) missing valuation (unit_cost/total_value)`,
    details: { missing_cost: missingCost },
  })

  const summaryResult = await client.query(
    `WITH deltas AS (
       SELECT 
         product_id,
         warehouse_id,
         CASE 
           WHEN movement_type ILIKE '%receipt%' THEN quantity
           WHEN movement_type ILIKE '%increase%' THEN quantity
           WHEN movement_type ILIKE 'transfer in%' THEN quantity
           WHEN movement_type ILIKE '%return%' THEN quantity
           WHEN movement_type ILIKE '%count%' THEN quantity
           WHEN movement_type ILIKE '%out%' THEN -quantity
           WHEN movement_type ILIKE '%shipment%' THEN -quantity
           WHEN movement_type ILIKE 'transfer out%' THEN -quantity
           WHEN movement_type ILIKE '%decrease%' THEN -quantity
           WHEN movement_type ILIKE '%damage%' THEN -quantity
           WHEN movement_type ILIKE '%loss%' THEN -quantity
           WHEN movement_type ILIKE '%sample%' THEN -quantity
           ELSE quantity
         END AS qty_delta,
         COALESCE(unit_cost, 0) AS unit_cost
       FROM stock_movements
       WHERE movement_date <= $1
     )
     SELECT 
       COALESCE(SUM(qty_delta), 0)::numeric(18,3) AS total_qty,
       COALESCE(SUM(qty_delta * unit_cost), 0)::numeric(18,4) AS total_value
     FROM deltas;`,
    [period.end_date]
  )

  const summaryRow = summaryResult.rows[0] || { total_qty: 0, total_value: 0 }

  return {
    checks,
    summary: {
      totalQty: parseFloat(summaryRow.total_qty ?? 0),
      totalValue: parseFloat(summaryRow.total_value ?? 0),
    },
  }
}

async function respondWithIssue(
  client: PoolClient | null,
  status: number,
  code: string,
  human_message: string,
  suggested_next_action: string,
  reference: { period_id?: string; inventory_close_id?: string },
  metadata?: Record<string, any>
) {
  try {
    if (client) {
      await recordIssue(client, {
        type: 'INVENTORY',
        reference_id: reference.inventory_close_id || 'inventory-close',
        error_code: code as any,
        period_id: reference.period_id ? Number(reference.period_id) : undefined,
        human_message,
        suggested_next_action,
        metadata,
        source: 'api',
      })
    }
  } catch (err) {
    console.warn('Failed to persist inventory close issue', err)
  }

  const env = envelope(code, human_message, suggested_next_action, reference)
  return NextResponse.json(env, { status })
}

export async function POST(request: NextRequest) {
  const adminOverride = blockAdminOverride(request)
  if (adminOverride) {
    return NextResponse.json(
      envelope(
        'NOT_ALLOWED',
        'Admin override is not permitted in production close.',
        'Post adjustment in next open period.',
        { inventory_close_id: 'inventory-close' }
      ),
      { status: 403 }
    )
  }

  const issueTrail = requireIssueTrail(request, 'Inventory close action')
  if (!issueTrail.ok && issueTrail.response) {
    return NextResponse.json(
      envelope(
        'VALIDATION_FAILED',
        'Issue trail is required to close inventory.',
        'Post adjustment in next open period.',
        { inventory_close_id: 'inventory-close' }
      ),
      { status: 400 }
    )
  }

  const client = await getClient()

  try {
    const body = await request.json()
    const { periodId, userId } = body || {}

    if (!periodId) {
      const response = await respondWithIssue(
        client,
        400,
        'MISSING_DEPENDENCY',
        'periodId is required to close inventory.',
        'Post adjustment in next open period.',
        { inventory_close_id: 'inventory-close' }
      )
      client.release()
      return response
    }

    await client.query('BEGIN')

    const periodResult = await client.query<PeriodRow>(
      `SELECT id, period_name, start_date, end_date, fiscal_year, pl_closed, inventory_closed
       FROM accounting_periods WHERE id = $1 FOR UPDATE`,
      [periodId]
    )

    if (periodResult.rows.length === 0) {
      await client.query('ROLLBACK')
      const response = await respondWithIssue(
        client,
        404,
        'MISSING_DEPENDENCY',
        'Period not found for inventory close.',
        'Post adjustment in next open period.',
        { period_id: String(periodId), inventory_close_id: String(periodId) }
      )
      client.release()
      return response
    }

    const period = periodResult.rows[0]

    const userResult = userId
      ? { rows: [{ id: userId }] }
      : await client.query<{ id: string }>(`SELECT id FROM users ORDER BY created_at ASC LIMIT 1`)

    const actingUserId = userResult.rows[0]?.id

    if (!actingUserId) {
      await client.query('ROLLBACK')
      const response = await respondWithIssue(
        client,
        500,
        'MISSING_DEPENDENCY',
        'No users found to attribute closing action.',
        'Post adjustment in next open period.',
        { period_id: String(periodId), inventory_close_id: String(periodId) }
      )
      client.release()
      return response
    }

    const validation = await runValidation(client, period)

    if (!allChecksPass(validation.checks)) {
      const failing = validation.checks.find((c) => !c.is_valid)
      await client.query('ROLLBACK')
      const response = await respondWithIssue(
        client,
        400,
        'INVALID_SEQUENCE',
        failing?.message || 'Validation failed before closing inventory.',
        'Post adjustment in next open period.',
        { period_id: String(period.id), inventory_close_id: String(periodId) },
        { validationChecks: validation.checks }
      )
      client.release()
      return response
    }

    const snapshotResult = await client.query(
      `WITH deltas AS (
         SELECT 
           product_id,
           warehouse_id,
           CASE 
             WHEN movement_type ILIKE '%receipt%' THEN quantity
             WHEN movement_type ILIKE '%increase%' THEN quantity
             WHEN movement_type ILIKE 'transfer in%' THEN quantity
             WHEN movement_type ILIKE '%return%' THEN quantity
             WHEN movement_type ILIKE '%count%' THEN quantity
             WHEN movement_type ILIKE '%out%' THEN -quantity
             WHEN movement_type ILIKE '%shipment%' THEN -quantity
             WHEN movement_type ILIKE 'transfer out%' THEN -quantity
             WHEN movement_type ILIKE '%decrease%' THEN -quantity
             WHEN movement_type ILIKE '%damage%' THEN -quantity
             WHEN movement_type ILIKE '%loss%' THEN -quantity
             WHEN movement_type ILIKE '%sample%' THEN -quantity
             ELSE quantity
           END AS qty_delta,
           COALESCE(unit_cost, 0) AS unit_cost
         FROM stock_movements
         WHERE movement_date <= $1
       )
       SELECT 
         product_id,
         warehouse_id,
         SUM(qty_delta)::numeric(18,3) AS quantity,
         COALESCE(
           SUM(CASE WHEN qty_delta > 0 THEN qty_delta * unit_cost END) /
           NULLIF(SUM(CASE WHEN qty_delta > 0 THEN qty_delta END), 0),
           0
         )::numeric(18,4) AS unit_cost
       FROM deltas
       GROUP BY product_id, warehouse_id
       HAVING ABS(SUM(qty_delta)) > 0`,
      [period.end_date]
    )

    const snapshots = snapshotResult.rows

    if (snapshots.length === 0) {
      await client.query('ROLLBACK')
      const response = await respondWithIssue(
        client,
        400,
        'MISSING_DEPENDENCY',
        'No inventory movements found to snapshot for this period.',
        'Post adjustment in next open period.',
        { period_id: String(period.id), inventory_close_id: String(periodId) }
      )
      client.release()
      return response
    }

    let totalQty = 0
    let totalValue = 0

    for (const row of snapshots) {
      const quantity = parseFloat(row.quantity)
      const unitCost = parseFloat(row.unit_cost)
      const totalCost = quantity * unitCost

      totalQty += quantity
      totalValue += totalCost

      await client.query(
        `INSERT INTO inventory_snapshots (
           period_id, item_id, warehouse_id, quantity, unit_cost, total_cost
         ) VALUES ($1, $2, $3, $4, $5, $6)`,
        [periodId, row.product_id, row.warehouse_id, quantity, unitCost, totalCost]
      )
    }

    const snapshotHash = createHash('sha256')
      .update(JSON.stringify(snapshots))
      .digest('hex')

    const closingInsert = await client.query(
      `INSERT INTO inventory_period_closings (
         period_id, closed_by, total_qty, total_value, snapshot_hash
       ) VALUES ($1, $2, $3, $4, $5)
       RETURNING id` ,
      [periodId, actingUserId, totalQty, totalValue, snapshotHash]
    )

    const closingId = closingInsert.rows[0]?.id

    await client.query(
      `UPDATE accounting_periods
       SET inventory_closed = true,
           inventory_closed_at = NOW(),
           inventory_closed_by = $1,
           inventory_closing_id = $2,
           updated_at = NOW()
       WHERE id = $3`,
      [actingUserId, closingId, periodId]
    )

    await client.query(
      `INSERT INTO accounting_audit_log (
         event_type,
         event_category,
         period_id,
         user_id,
         event_data,
         validation_results,
         event_timestamp,
         created_at
       ) VALUES (
         'INVENTORY_CLOSED',
         'CLOSING',
         $1,
         $2,
         $3::jsonb,
         $4::jsonb,
         NOW(),
         NOW()
       )`,
      [
        periodId,
        actingUserId,
        JSON.stringify({
          period_name: period.period_name,
          total_qty: totalQty,
          total_value: totalValue,
          snapshot_hash: snapshotHash,
        }),
        JSON.stringify({ validationChecks: validation.checks }),
      ]
    )

    await client.query('COMMIT')
    client.release()

    return NextResponse.json({
      success: true,
      message: `Inventory closed for ${period.period_name}`,
      data: {
        periodId,
        periodName: period.period_name,
        closingId,
        totalQty,
        totalValue,
        snapshotHash,
        validationChecks: validation.checks,
      }
    })
  } catch (error) {
    try {
      await client.query('ROLLBACK')
    } catch (rollbackError) {
      console.error('Rollback failed after inventory closing error:', rollbackError)
    }
    client.release()

    console.error('Inventory closing error:', error)
    const env = envelope(
      'INTERNAL_ERROR',
      'Failed to close inventory period.',
      'Post adjustment in next open period.',
      { inventory_close_id: 'inventory-close' }
    )
    return NextResponse.json(env, { status: 500 })
  }
}
