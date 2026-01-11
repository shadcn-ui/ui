import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

interface ValidationCheck {
  check_name: string
  is_valid: boolean
  message: string
  details?: Record<string, any>
}

function allChecksPass(checks: ValidationCheck[]) {
  return checks.every((check) => check.is_valid === true)
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const periodId = searchParams.get('period_id') || searchParams.get('periodId')

    if (!periodId) {
      return NextResponse.json(
        { error: 'period_id is required' },
        { status: 400 }
      )
    }

    const periodResult = await query(
      `SELECT id, period_name, start_date, end_date, fiscal_year, pl_closed, bs_closed, inventory_closed, inventory_closed_at, inventory_closed_by
       FROM accounting_periods WHERE id = $1`,
      [periodId]
    )

    if (periodResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Period not found' },
        { status: 404 }
      )
    }

    const period = periodResult.rows[0]
    const checks: ValidationCheck[] = []

    // 1) P&L must be closed
    checks.push({
      check_name: 'PL_CLOSED',
      is_valid: period.pl_closed === true,
      message: period.pl_closed ? 'P&L is closed for this period' : 'P&L must be closed before inventory closing',
      details: { pl_closed: period.pl_closed }
    })

    // 2) Inventory not already closed
    checks.push({
      check_name: 'INVENTORY_NOT_CLOSED',
      is_valid: period.inventory_closed !== true,
      message: period.inventory_closed ? 'Inventory already closed for this period' : 'Inventory not yet closed',
      details: { inventory_closed: period.inventory_closed }
    })

    // 3) Pending stock movements (status-aware if column exists)
    const hasStatusColumnResult = await query(
      `SELECT EXISTS (
         SELECT 1 FROM information_schema.columns
         WHERE table_name = 'stock_movements' AND column_name = 'status'
       ) as exists`
    )
    const hasStatusColumn = hasStatusColumnResult.rows[0]?.exists === true

    let pendingMovements = 0

    if (hasStatusColumn) {
      const pendingResult = await query(
        `SELECT COUNT(*) AS pending_count
         FROM stock_movements
         WHERE movement_date BETWEEN $1 AND $2
           AND COALESCE(status, 'PENDING') NOT IN ('POSTED', 'COMPLETED')`,
        [period.start_date, period.end_date]
      )
      pendingMovements = parseInt(pendingResult.rows[0]?.pending_count || '0', 10)
    } else {
      const pendingResult = await query(
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
      details: {
        pending_count: pendingMovements,
        uses_status_column: hasStatusColumn,
      }
    })

    // 4) Valuation completeness (no missing unit_cost inside period)
    const valuationResult = await query(
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
      details: { missing_cost: missingCost }
    })

    // 5) Negative inventory check (per product/warehouse)
    const negativeResult = await query(
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
           END AS qty_delta
         FROM stock_movements
         WHERE movement_date <= $1
       )
       SELECT COUNT(*) AS negatives
       FROM (
         SELECT product_id, warehouse_id, SUM(qty_delta) AS qty
         FROM deltas
         GROUP BY product_id, warehouse_id
         HAVING SUM(qty_delta) < 0
       ) t`,
      [period.end_date]
    )

    const negativeCount = parseInt(negativeResult.rows[0]?.negatives || '0', 10)

    checks.push({
      check_name: 'NO_NEGATIVE_INVENTORY',
      is_valid: negativeCount === 0,
      message: negativeCount === 0
        ? 'No negative inventory positions'
        : `${negativeCount} product/warehouse combinations are negative`,
      details: { negative_positions: negativeCount }
    })

    // 5) Summary snapshot (as-of period end) for quick review
    const summaryResult = await query(
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
       ),
       agg AS (
         SELECT 
           product_id,
           warehouse_id,
           SUM(qty_delta) AS qty,
           COALESCE(
             SUM(CASE WHEN qty_delta > 0 THEN qty_delta * unit_cost END) /
             NULLIF(SUM(CASE WHEN qty_delta > 0 THEN qty_delta END), 0),
             0
           ) AS avg_cost
         FROM deltas
         GROUP BY product_id, warehouse_id
       )
       SELECT 
         COALESCE(SUM(qty), 0)::numeric(18,3) AS total_qty,
         COALESCE(SUM(qty * avg_cost), 0)::numeric(18,4) AS total_value,
         COUNT(*) AS sku_count
       FROM agg;`,
      [period.end_date]
    )

    const summaryRow = summaryResult.rows[0] || { total_qty: 0, total_value: 0, sku_count: 0 }

    const canClose = allChecksPass(checks)

    return NextResponse.json({
      success: true,
      canClose,
      period,
      validationChecks: checks,
      summary: {
        totalQty: parseFloat(summaryRow.total_qty ?? 0),
        totalValue: parseFloat(summaryRow.total_value ?? 0),
        totalSku: parseInt(summaryRow.sku_count ?? '0', 10),
      }
    })
  } catch (error) {
    console.error('Inventory closing validation error:', error)
    return NextResponse.json(
      {
        error: 'Failed to validate inventory closing',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
