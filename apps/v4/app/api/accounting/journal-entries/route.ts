import { NextRequest, NextResponse } from 'next/server'
import { getClient, query } from '@/lib/db'
import { recordIssue } from '@/lib/issues'
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

async function assertInventoryNotClosed(
  entryDate: string,
  accountIds: number[],
  actorId?: string | null
) {
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
        `SELECT log_audit_event($1, $2, $3, $4, NULL, NULL, $5, NULL)`,
        [
          'JOURNAL_BLOCKED',
          'CLOSING',
          userId,
          period.id,
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

// GET /api/accounting/journal-entries - List all journal entries
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    // `type` param is not supported by the current schema (no `entry_type` column)
    const type = searchParams.get('type')
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    const search = searchParams.get('search')

    let sql = `
      SELECT 
        je.*,
        u1.first_name || ' ' || u1.last_name as created_by_name,
        u2.first_name || ' ' || u2.last_name as posted_by_name,
        (
          SELECT COUNT(*) 
          FROM journal_entry_lines 
          WHERE journal_entry_id = je.id
        ) as line_count
      FROM journal_entries je
      LEFT JOIN users u1 ON je.created_by = u1.id
      LEFT JOIN users u2 ON je.posted_by = u2.id
      WHERE 1=1
    `
    
    const params: any[] = []
    let paramIndex = 1

    if (status) {
      sql += ` AND je.status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }

    // ignore `type` filter because `journal_entries` has no `entry_type` column

    if (startDate) {
      sql += ` AND je.entry_date >= $${paramIndex}`
      params.push(startDate)
      paramIndex++
    }

    if (endDate) {
      sql += ` AND je.entry_date <= $${paramIndex}`
      params.push(endDate)
      paramIndex++
    }

    if (search) {
      sql += ` AND (
        je.entry_number ILIKE $${paramIndex} OR 
        je.reference ILIKE $${paramIndex} OR 
        je.description ILIKE $${paramIndex}
      )`
      params.push(`%${search}%`)
      paramIndex++
    }

    sql += ` ORDER BY je.entry_date DESC, je.id DESC`

    const result = await query(sql, params)

    // Get statistics
    const stats = await query(`
      SELECT 
        COUNT(*) as total_entries,
        COUNT(*) FILTER (WHERE status = 'Draft') as draft_entries,
        COUNT(*) FILTER (WHERE status = 'Posted') as posted_entries,
        SUM(CASE WHEN status = 'Posted' THEN total_debit ELSE 0 END) as total_posted_amount
      FROM journal_entries
    `)

    return NextResponse.json({
      success: true,
      entries: result.rows,
      stats: stats.rows[0]
    })

  } catch (error) {
    console.error('Error fetching journal entries:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch journal entries' },
      { status: 500 }
    )
  }
}

// POST /api/accounting/journal-entries - Create new journal entry
export async function POST(request: NextRequest) {
  let issueClient: any = null
  try {
    const body = await request.json()
    
    const {
      entry_date,
      // entry_type is not used by current schema
      reference: reference_number,
      description,
      lines,
      created_by
    } = body

    // Validate required fields
    issueClient = await getClient()
    const referenceId = reference_number || 'journal-draft'

    if (!entry_date || !lines || lines.length === 0) {
      await recordIssue(issueClient, {
        type: 'JOURNAL',
        reference_id: referenceId,
        error_code: 'VALIDATION_FAILED',
        human_message: 'Missing required fields: entry_date and lines are required.',
        suggested_next_action: 'Provide entry date and at least one balanced line, then retry in the next open period if needed.',
        metadata: { payload_missing: true },
        period_id: null,
        source: 'api',
      })

      const envelope = buildErrorEnvelope({
        error_code: 'VALIDATION_FAILED',
        human_message: 'Missing required fields: entry_date and lines are required.',
        suggested_next_action: 'Provide entry date and at least one balanced line, then retry in the next open period if needed.',
        trace_path: `/erp/trace/journal/${encodeURIComponent(String(referenceId))}`,
        reference: { journal_id: String(referenceId) },
      })

      issueClient.release()
      issueClient = null
      return NextResponse.json(envelope, { status: 400 })
    }

    const period = await getPeriodForDate(entry_date)
    if (!period || (period.status && period.status.toUpperCase() !== 'OPEN')) {
      await recordIssue(issueClient, {
        type: 'JOURNAL',
        reference_id: referenceId,
        error_code: 'PERIOD_CLOSED',
        period_id: period?.id,
        human_message: 'The accounting period is closed. Forward adjustment required.',
        suggested_next_action: 'Post a forward-only correction in the next open period.',
        source: 'api',
        metadata: { entry_date },
      })

      const envelope = buildErrorEnvelope({
        error_code: 'PERIOD_CLOSED',
        human_message: 'The accounting period is closed. Forward adjustment required.',
        suggested_next_action: 'Post a forward-only correction in the next open period.',
        trace_path: `/erp/trace/journal/${encodeURIComponent(String(referenceId))}`,
        reference: { journal_id: String(referenceId), period_id: period?.id ? String(period.id) : undefined },
      })

      issueClient.release()
      issueClient = null
      return NextResponse.json(envelope, { status: 403 })
    }

    // Enforce inventory closure immutability
    const actingUserId = created_by || (await getFallbackUserId())
    const lineAccountIds = lines.map((line: any) => parseInt(line.account_id, 10)).filter(Boolean)
    const inventoryGuard = await assertInventoryNotClosed(entry_date, lineAccountIds, actingUserId)
    if (!inventoryGuard.ok) {
      await recordIssue(issueClient, {
        type: 'JOURNAL',
        reference_id: referenceId,
        error_code: 'INVENTORY_CLOSED',
        period_id: period?.id,
        human_message: 'Inventory is closed for this period. Forward adjustment required.',
        suggested_next_action: 'Post correction in the next open period or reopen per policy.',
        source: 'api',
        metadata: { entry_date, inventory_guard: true },
      })

      const envelope = buildErrorEnvelope({
        error_code: 'INVENTORY_CLOSED',
        human_message: 'Inventory is closed for this period. Forward adjustment required.',
        suggested_next_action: 'Post correction in the next open period or reopen per policy.',
        trace_path: `/erp/trace/journal/${encodeURIComponent(String(referenceId))}`,
        reference: { journal_id: String(referenceId), period_id: period?.id ? String(period.id) : undefined },
      })

      issueClient.release()
      issueClient = null
      return NextResponse.json(envelope, { status: 403 })
    }

    // Check if period is locked for any of the accounts
    const accountIds = lines.map((line: any) => line.account_id)
    const accountTypes = await query(
      `SELECT DISTINCT account_type 
       FROM chart_of_accounts 
       WHERE id = ANY($1::int[])`,
      [accountIds]
    )

    for (const row of accountTypes.rows) {
      const lockCheck = await query(
        `SELECT is_period_locked_for_account($1, $2) as is_locked`,
        [entry_date, row.account_type]
      )

        if (lockCheck.rows[0]?.is_locked === true) {
          await recordIssue(issueClient, {
            type: 'JOURNAL',
            reference_id: referenceId,
            error_code: 'ACCOUNT_LOCKED',
            period_id: period?.id,
            human_message: `Cannot post to ${row.account_type} accounts because the period is locked. Forward adjustment required.`,
            suggested_next_action: 'Post a forward adjustment in the next open period or request an unlock per policy.',
            source: 'api',
            metadata: { account_type: row.account_type },
          })

          const envelope = buildErrorEnvelope({
            error_code: 'ACCOUNT_LOCKED',
            human_message: `Cannot post to ${row.account_type} accounts because the period is locked. Forward adjustment required.`,
            suggested_next_action: 'Post a forward adjustment in the next open period or request an unlock per policy.',
            trace_path: `/erp/trace/journal/${encodeURIComponent(String(referenceId))}`,
            reference: { journal_id: String(referenceId), period_id: period?.id ? String(period.id) : undefined },
          })

          issueClient.release()
          issueClient = null
          return NextResponse.json(envelope, { status: 403 })
        }
    }

    // Validate that debits equal credits
    const totalDebit = lines.reduce((sum: number, line: any) => sum + (parseFloat(line.debit_amount) || 0), 0)
    const totalCredit = lines.reduce((sum: number, line: any) => sum + (parseFloat(line.credit_amount) || 0), 0)

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      await recordIssue(issueClient, {
        type: 'JOURNAL',
        reference_id: referenceId,
        error_code: 'JOURNAL_IMBALANCED',
        period_id: period?.id,
        human_message: 'Journal entry is unbalanced. Debits must equal credits.',
        suggested_next_action: 'Fix line amounts so debits equal credits, then retry in the next open period if necessary.',
        source: 'api',
        metadata: { total_debit: totalDebit, total_credit: totalCredit },
      })

      const envelope = buildErrorEnvelope({
        error_code: 'JOURNAL_IMBALANCED',
        human_message: 'Journal entry is unbalanced. Debits must equal credits.',
        suggested_next_action: 'Fix line amounts so debits equal credits, then retry in the next open period if necessary.',
        trace_path: `/erp/trace/journal/${encodeURIComponent(String(referenceId))}`,
        reference: { journal_id: String(referenceId), period_id: period?.id ? String(period.id) : undefined },
      })

      issueClient.release()
      issueClient = null
      return NextResponse.json(envelope, { status: 409 })
    }

    // Generate entry number
    const entryNumberResult = await query(`
      SELECT COALESCE(MAX(CAST(SUBSTRING(entry_number FROM 9) AS INTEGER)), 0) + 1 as next_number
      FROM journal_entries
      WHERE entry_number LIKE 'JE-2025-%'
    `)
    const nextNumber = entryNumberResult.rows[0].next_number
    const entry_number = `JE-2025-${String(nextNumber).padStart(3, '0')}`

    // Create journal entry
    const entryResult = await query(`
      INSERT INTO journal_entries (
        entry_number, entry_date, description, reference,
        status, total_debit, total_credit, created_by
      ) VALUES ($1, $2, $3, $4, 'Draft', $5, $6, $7)
      RETURNING *
    `, [
      entry_number,
      entry_date,
      description,
      reference_number || null,
      totalDebit,
      totalCredit,
      created_by || null
    ])

    const entryId = entryResult.rows[0].id

    // Create journal entry lines
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      await query(`
        INSERT INTO journal_entry_lines (
          journal_entry_id, account_id, description,
          debit_amount, credit_amount
        ) VALUES ($1, $2, $3, $4, $5)
      `, [
        entryId,
        line.account_id,
        line.description || null,
        parseFloat(line.debit_amount) || 0,
        parseFloat(line.credit_amount) || 0
      ])
    }

    // Get complete entry with lines
    const completeEntry = await query(`
      SELECT 
        je.*,
        json_agg(
            json_build_object(
              'id', jel.id,
              'account_id', jel.account_id,
              'account_number', coa.account_number,
              'account_name', coa.account_name,
              'description', jel.description,
              'debit_amount', jel.debit_amount,
              'credit_amount', jel.credit_amount
            ) ORDER BY jel.created_at
          ) as lines
      FROM journal_entries je
      LEFT JOIN journal_entry_lines jel ON je.id = jel.journal_entry_id
        LEFT JOIN accounts coa ON jel.account_id = coa.id
      WHERE je.id = $1
      GROUP BY je.id
    `, [entryId])

    issueClient.release()
    issueClient = null

    return NextResponse.json({
      success: true,
      entry: completeEntry.rows[0],
      message: 'Journal entry created successfully'
    }, { status: 201 })

  } catch (error: any) {
    console.error('Error creating journal entry:', error)
    const envelope = buildErrorEnvelope({
      error_code: 'INTERNAL_ERROR',
      human_message: 'Failed to create journal entry.',
      suggested_next_action: 'Retry the request or post a forward adjustment in the next open period.',
      trace_path: null,
      reference: {},
    })
    return NextResponse.json(envelope, { status: 500 })
  } finally {
    if (issueClient) {
      issueClient.release()
    }
  }
}
