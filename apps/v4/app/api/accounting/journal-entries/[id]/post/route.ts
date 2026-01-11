import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { buildErrorEnvelope } from '@/lib/errors/standard-error'

async function getFallbackUserId() {
  const res = await query(`SELECT id FROM users ORDER BY created_at ASC LIMIT 1`)
  return res.rows[0]?.id || null
}

async function fetchInventoryAccountIds(accountIds: number[]) {
  if (!accountIds || accountIds.length === 0) return []
  const res = await query(
    `SELECT id FROM chart_of_accounts
     WHERE id = ANY($1::int[])
       AND UPPER(account_subtype) IN ('INVENTORY', 'INVENTORY_CLEARING', 'INVENTORY CLEARING', 'COGS')`,
    [accountIds]
  )
  return res.rows.map((r: any) => r.id)
}

async function assertInventoryNotClosed(entryDate: string, accountIds: number[], actorId?: string | null) {
  const inventoryAccountIds = await fetchInventoryAccountIds(accountIds)
  if (inventoryAccountIds.length === 0) return { ok: true }

  const periodRes = await query(
    `SELECT id, inventory_closed FROM accounting_periods
     WHERE $1::date BETWEEN start_date AND end_date
     LIMIT 1`,
    [entryDate]
  )
  const period = periodRes.rows[0]
  if (!period) return { ok: true }

  if (period.inventory_closed) {
    const userId = actorId || (await getFallbackUserId())
    if (userId) {
      await query(
        `SELECT log_audit_event($1, $2, $3, $4, $5, NULL, $6, NULL)`,
        [
          'JOURNAL_BLOCKED',
          'CLOSING',
          userId,
          period.id,
          null,
          JSON.stringify({
            reason: 'INVENTORY_PERIOD_LOCK',
            account_ids: inventoryAccountIds,
          }),
        ]
      )
    }

    return {
      ok: false,
      error: 'Inventory is closed for this period. Adjust via next period.',
    }
  }

  return { ok: true }
}

async function getPeriodForDate(entryDate: string) {
  const res = await query(
    `SELECT id, status, pl_closed, inventory_closed
     FROM accounting_periods
     WHERE $1::date BETWEEN start_date AND end_date
     LIMIT 1`,
    [entryDate]
  )
  return res.rows[0] || null
}

// POST /api/accounting/journal-entries/[id]/post - Post journal entry to ledger
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const id = resolvedParams.id
    let body = {}
    try {
      body = await request.json()
    } catch (e) {
      body = {}
    }
    const { posted_by } = (body as any)

    if (!id || typeof id !== 'string') {
      const envelope = buildErrorEnvelope({
        error_code: 'VALIDATION_FAILED',
        human_message: 'Invalid journal entry ID.',
        suggested_next_action: 'Provide a valid journal entry ID and retry.',
        trace_path: null,
        reference: {},
      })
      return NextResponse.json(envelope, { status: 400 })
    }

    // Check current status
    const checkResult = await query(
      'SELECT status, total_debit, total_credit, entry_date, created_by FROM journal_entries WHERE id = $1',
      [id]
    )

    if (checkResult.rows.length === 0) {
      const envelope = buildErrorEnvelope({
        error_code: 'NOT_FOUND',
        human_message: 'Journal entry not found.',
        suggested_next_action: 'Verify the journal reference and retry.',
        trace_path: `/erp/trace/journal/${encodeURIComponent(String(id))}`,
        reference: { journal_id: String(id) },
      })
      return NextResponse.json(envelope, { status: 404 })
    }

    const entry = checkResult.rows[0]
      const period = await getPeriodForDate(entry.entry_date)

    if (entry.status === 'Posted') {
      const envelope = buildErrorEnvelope({
        error_code: 'INVALID_SEQUENCE',
        human_message: 'Journal entry is already posted.',
        suggested_next_action: 'No action required. Create a reversing entry in the next open period if correction is needed.',
        trace_path: `/erp/trace/journal/${encodeURIComponent(String(id))}`,
          reference: { journal_id: String(id), period_id: period?.id ? String(period.id) : undefined },
      })
      return NextResponse.json(envelope, { status: 409 })
    }

    // Verify balance
    if (Math.abs(parseFloat(entry.total_debit) - parseFloat(entry.total_credit)) > 0.01) {
      const envelope = buildErrorEnvelope({
        error_code: 'JOURNAL_IMBALANCED',
        human_message: 'Journal entry is unbalanced and cannot be posted.',
        suggested_next_action: 'Fix line amounts so debits equal credits, then repost in the next open period if needed.',
        trace_path: `/erp/trace/journal/${encodeURIComponent(String(id))}`,
          reference: { journal_id: String(id), period_id: period?.id ? String(period.id) : undefined },
      })
      return NextResponse.json(envelope, { status: 409 })
    }

    // Post the entry (this triggers the account balance update)
    // Ensure posted_by is a UUID or null to avoid invalid uuid input errors
    const isUuid = (s: any) => typeof s === 'string' && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(s)
    const postedByValue = isUuid(posted_by) ? posted_by : null

    // Enforce inventory closure immutability on post
    const linesResult = await query(
      `SELECT DISTINCT account_id FROM journal_entry_lines WHERE journal_entry_id = $1`,
      [id]
    )
    const accountIds = linesResult.rows.map((r: any) => parseInt(r.account_id, 10)).filter(Boolean)
    const actingUserId = postedByValue || entry.created_by || (await getFallbackUserId())
    const inventoryGuard = await assertInventoryNotClosed(entry.entry_date, accountIds, actingUserId)
    if (!inventoryGuard.ok) {
      const envelope = buildErrorEnvelope({
        error_code: 'INVENTORY_CLOSED',
        human_message: 'Inventory is closed for this period. Adjust via next period.',
        suggested_next_action: 'Post a forward adjustment in the next open period or reopen inventory per policy.',
        trace_path: `/erp/trace/journal/${encodeURIComponent(String(id))}`,
          reference: { journal_id: String(id), period_id: period?.id ? String(period.id) : undefined },
      })
      return NextResponse.json(envelope, { status: 403 })
    }

    const result = await query(`
      UPDATE journal_entries 
      SET 
        status = 'Posted',
        posted_at = CURRENT_TIMESTAMP,
        posted_by = $1::uuid,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2::uuid
      RETURNING *
    `, [postedByValue, id])

    return NextResponse.json({
      success: true,
      entry: result.rows[0],
      message: 'Journal entry posted successfully'
    })

  } catch (error: any) {
    console.error('Error posting journal entry:', error)
    const envelope = buildErrorEnvelope({
      error_code: 'INTERNAL_ERROR',
      human_message: 'Failed to post journal entry.',
      suggested_next_action: 'Retry posting or create a forward adjustment in the next open period.',
        trace_path: null,
      reference: {},
    })
    return NextResponse.json(envelope, { status: 500 })
  }
}
