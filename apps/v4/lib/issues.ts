import { PoolClient } from 'pg'
import { query } from '@/lib/db'
import { OCEAN_PRODUCTION_MODE } from '@/lib/runtime-flags'

export type IssueType = 'EVENT' | 'JOURNAL' | 'INVENTORY' | 'PERIOD'
export type IssueStatus = 'OPEN' | 'RESOLVED'
export type IssueErrorCode =
  | 'PERIOD_CLOSED'
  | 'INVENTORY_CLOSED'
  | 'PL_CLOSED'
  | 'INVALID_SEQUENCE'
  | 'MISSING_DEPENDENCY'
  | 'DUPLICATE_EVENT'
  | 'INSUFFICIENT_STOCK'
  | 'INVALID_PAYLOAD'
  | 'DOMAIN_LOCKED'
  | 'VALIDATION_FAILED'
  | 'NOT_ALLOWED'
  | 'ACCOUNT_LOCKED'
  | 'JOURNAL_IMBALANCED'
  | 'UNAUTHORIZED_REVERSAL'
  | 'INVENTORY_PERIOD_CLOSED'
  | 'NEGATIVE_STOCK_BLOCKED'
  | 'INVALID_STOCK_MOVEMENT'
  | 'PERIOD_MISMATCH'
  | 'PRODUCTION_MODE_LOCK'

interface IssueInput {
  type: IssueType
  reference_id: string
  error_code: IssueErrorCode
  period_id?: number | null
  metadata?: Record<string, any>
  status?: IssueStatus
  human_message?: string
  suggested_next_action?: string
  source?: string
  resolution_note?: string
}

const DEFAULT_MESSAGES: Record<IssueErrorCode, { message: string; action: string }> = {
  PERIOD_CLOSED: {
    message: 'The accounting period is closed. Forward adjustment required.',
    action: 'Period is closed. Post correction in next period as a forward adjustment.',
  },
  INVENTORY_CLOSED: {
    message: 'Inventory period is closed. Forward adjustment required.',
    action: 'Inventory is closed. Post correction in next period or reopen per finance policy.',
  },
  PL_CLOSED: {
    message: 'P&L period is closed. Revenue/COGS posting blocked. Forward adjustment required.',
    action: 'Revenue/COGS blocked. Post correction in next period and reference original date.',
  },
  INVALID_SEQUENCE: {
    message: 'This step arrived out of order. A prior event is missing.',
    action: 'Send the missing prior event (e.g., confirm → ship → deliver) before retrying.',
  },
  MISSING_DEPENDENCY: {
    message: 'The referenced record is missing (order/product/warehouse).',
    action: 'Create or sync the missing record, then resend.',
  },
  DUPLICATE_EVENT: {
    message: 'This event was already processed. No further action taken.',
    action: 'Do not resend. Review the trace to confirm downstream impact.',
  },
  INSUFFICIENT_STOCK: {
    message: 'Not enough stock to move the requested quantity.',
    action: 'Adjust quantity or receive stock before sending this movement.',
  },
  INVALID_PAYLOAD: {
    message: 'The event payload is incomplete or invalid.',
    action: 'Fix the payload fields listed in the message, then resend.',
  },
  DOMAIN_LOCKED: {
    message: 'The requested domain is locked for this period.',
    action: 'Adjust stock or balances in the next open period, or reopen per policy.',
  },
  VALIDATION_FAILED: {
    message: 'Validation failed for this operation.',
    action: 'Review failed checks, correct data, and retry. Use a forward adjustment if period is locked.',
  },
  NOT_ALLOWED: {
    message: 'This operation is not allowed without approval.',
    action: 'Request approval and retry after authorization.',
  },
  ACCOUNT_LOCKED: {
    message: 'The account is locked for this period.',
    action: 'Post a forward adjustment in the next open period or request an unlock per policy.',
  },
  JOURNAL_IMBALANCED: {
    message: 'Journal entry is unbalanced. Debits must equal credits.',
    action: 'Fix line amounts so debits equal credits, then retry.',
  },
  UNAUTHORIZED_REVERSAL: {
    message: 'This journal cannot be reversed without authorization.',
    action: 'Request approval and perform a forward-only correcting entry in the next open period.',
  },
  INVENTORY_PERIOD_CLOSED: {
    message: 'Inventory is closed for this period.',
    action: 'Post adjustment in next open period.',
  },
  NEGATIVE_STOCK_BLOCKED: {
    message: 'Stock movement blocked because it would create negative stock.',
    action: 'Post adjustment in next open period.',
  },
  INVALID_STOCK_MOVEMENT: {
    message: 'Invalid or incomplete stock movement data.',
    action: 'Post adjustment in next open period.',
  },
  PERIOD_MISMATCH: {
    message: 'The movement period does not match the open accounting period.',
    action: 'Post adjustment in next open period.',
  },
}

export async function recordIssue(client: PoolClient, input: IssueInput) {
  const defaults = DEFAULT_MESSAGES[input.error_code]
  const human = input.human_message || defaults?.message || 'The request was blocked.'
  const action = input.suggested_next_action || defaults?.action || 'Review and retry after fixing the blocking issue.'

  await client.query(
    `INSERT INTO issue_logs (
      type, reference_id, error_code, human_message, suggested_next_action,
      status, period_id, metadata, source, resolution_note
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [
      input.type,
      input.reference_id,
      input.error_code,
      human,
      action,
      input.status || 'OPEN',
      input.period_id || null,
      input.metadata || {},
      input.source || null,
      input.resolution_note || null,
    ]
  )
}

export interface IssueFilters {
  period_id?: string | null
  error_code?: IssueErrorCode | null
  type?: IssueType | null
  status?: IssueStatus | null
}

export async function listIssues(filters: IssueFilters) {
  const clauses: string[] = []
  const params: any[] = []

  if (filters.period_id) {
    params.push(filters.period_id)
    clauses.push(`period_id = $${params.length}`)
  }
  if (filters.error_code) {
    params.push(filters.error_code)
    clauses.push(`error_code = $${params.length}`)
  }
  if (filters.type) {
    params.push(filters.type)
    clauses.push(`type = $${params.length}`)
  }
  if (filters.status) {
    params.push(filters.status)
    clauses.push(`status = $${params.length}`)
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''
  const res = await query(
    `SELECT id, created_at, type, reference_id, error_code, human_message, suggested_next_action,
            status, period_id, source, metadata
     FROM issue_logs
     ${where}
     ORDER BY created_at DESC
     LIMIT 200`,
    params
  )

  return res.rows
}

export type TraceRef = {
  order_id?: string | number
  journal_id?: string | number
  event_id?: string | number
  period_id?: string | number
}

export function buildTracePath(trace?: TraceRef, fallback?: { type?: IssueType; reference_id?: string }) {
  if (trace?.order_id !== undefined && trace?.order_id !== null) {
    return `/erp/trace/order/${encodeURIComponent(String(trace.order_id))}`
  }
  if (trace?.journal_id !== undefined && trace?.journal_id !== null) {
    return `/erp/trace/journal/${encodeURIComponent(String(trace.journal_id))}`
  }
  if (trace?.event_id !== undefined && trace?.event_id !== null) {
    return `/erp/trace/event/${encodeURIComponent(String(trace.event_id))}`
  }
  if (trace?.period_id !== undefined && trace?.period_id !== null) {
    return `/erp/trace/period/${encodeURIComponent(String(trace.period_id))}`
  }

  if (fallback?.type === 'JOURNAL' && fallback.reference_id) {
    return `/erp/trace/journal/${encodeURIComponent(fallback.reference_id)}`
  }
  if (fallback?.type === 'EVENT' && fallback.reference_id) {
    return `/erp/trace/event/${encodeURIComponent(fallback.reference_id)}`
  }
  if (fallback?.type === 'INVENTORY' && fallback.reference_id) {
    return `/erp/trace/inventory/${encodeURIComponent(fallback.reference_id)}`
  }
  if (fallback?.type === 'PERIOD' && fallback.reference_id) {
    return `/erp/trace/period/${encodeURIComponent(fallback.reference_id)}`
  }

  if (fallback?.reference_id) {
    return `/erp/trace/${(fallback.type || 'reference').toLowerCase()}/${encodeURIComponent(fallback.reference_id)}`
  }

  return undefined
}

export function humanizeError(error_code: IssueErrorCode) {
  return DEFAULT_MESSAGES[error_code]?.message || 'Request blocked'
}

export function actionForError(error_code: IssueErrorCode) {
  return DEFAULT_MESSAGES[error_code]?.action || 'Review and fix the blocker'
}

export interface RejectWithIssueInput {
  client: PoolClient
  type: IssueType
  reference_id: string
  error_code: IssueErrorCode
  period_id?: number | null
  metadata?: Record<string, any>
  statusCode?: number
  human_message?: string
  suggested_next_action?: string
  source?: string
  trace?: TraceRef
}

export async function rejectWithIssue(input: RejectWithIssueInput) {
  const human_message = input.human_message || humanizeError(input.error_code)
  const suggested_next_action =
    input.suggested_next_action || actionForError(input.error_code)

  const trace_path = buildTracePath(input.trace, {
    type: input.type,
    reference_id: input.reference_id,
  })

  const metadata: Record<string, any> = { ...(input.metadata || {}) }
  if (OCEAN_PRODUCTION_MODE) {
    metadata.erp_production_mode = true
  }
  if (trace_path) {
    metadata.trace_path = trace_path
  }
  if (input.trace) {
    metadata.trace = input.trace
  }

  await recordIssue(input.client, {
    type: input.type,
    reference_id: input.reference_id,
    error_code: input.error_code,
    period_id: input.period_id,
    metadata,
    human_message,
    suggested_next_action,
    source: input.source || 'api',
  })

  const statusCode =
    input.statusCode !== undefined
      ? input.statusCode
      : input.error_code === 'INVALID_PAYLOAD'
      ? 400
      : input.error_code === 'PERIOD_CLOSED' || input.error_code === 'INVENTORY_CLOSED'
      ? 403
      : 409

  return {
    statusCode,
    body: {
      success: false,
      status: 'REJECTED',
      reference_id: input.reference_id,
      error_code: input.error_code,
      human_message,
      suggested_next_action,
      ...(trace_path ? { trace_path } : {}),
    },
  }
}
