import { query } from '@/lib/db'
import { IssueType } from '@/lib/issues'

export type StandardErrorReference = {
  period_id?: string
  journal_id?: string
  inventory_close_id?: string
  order_id?: string
}

export type StandardErrorEnvelope = {
  status: 'REJECTED'
  error_code: string
  human_message: string
  suggested_next_action: string
  trace_path: string | null
  reference: StandardErrorReference
}

export type BuildErrorEnvelopeInput = {
  error_code: string
  human_message: string
  suggested_next_action: string
  trace_path?: string | null
  reference?: StandardErrorReference
}

// Builds the canonical error envelope used by accounting and inventory APIs.
export function buildErrorEnvelope(input: BuildErrorEnvelopeInput): StandardErrorEnvelope {
  const reference: StandardErrorReference = input.reference ?? {}
  const hasReference =
    reference.period_id !== undefined ||
    reference.journal_id !== undefined ||
    reference.inventory_close_id !== undefined ||
    reference.order_id !== undefined

  const trace_path = hasReference ? input.trace_path ?? null : input.trace_path ?? null

  const envelope: StandardErrorEnvelope = {
    status: 'REJECTED',
    error_code: input.error_code.toUpperCase(),
    human_message: input.human_message,
    suggested_next_action: input.suggested_next_action,
    trace_path,
    reference,
  }

  // Best-effort async issue logging; never block the response path.
  void persistIssueFromEnvelope(envelope)

  return envelope
}

function deriveIssueIdentity(reference: StandardErrorReference): { type: IssueType; reference_id: string } {
  if (reference.journal_id) return { type: 'JOURNAL', reference_id: reference.journal_id }
  if (reference.inventory_close_id) return { type: 'INVENTORY', reference_id: reference.inventory_close_id }
  if (reference.period_id) return { type: 'PERIOD', reference_id: reference.period_id }
  if (reference.order_id) return { type: 'INVENTORY', reference_id: reference.order_id }

  return { type: 'EVENT', reference_id: 'unknown' }
}

function buildDedupeKey(code: string, reference: StandardErrorReference, period_id?: string) {
  return `${code.toUpperCase()}|${period_id || 'none'}|${JSON.stringify(reference || {})}`
}

async function persistIssueFromEnvelope(envelope: StandardErrorEnvelope) {
  try {
    const { type, reference_id } = deriveIssueIdentity(envelope.reference)
    const period_id = envelope.reference.period_id || null
    const dedupe_key = buildDedupeKey(envelope.error_code, envelope.reference, period_id || undefined)

    await query(
      `INSERT INTO issue_logs (
         type, reference_id, error_code, human_message, suggested_next_action,
         status, period_id, metadata, source
       )
       SELECT $1, $2, $3, $4, $5, 'OPEN', $6, $7, 'api'
       WHERE NOT EXISTS (
         SELECT 1 FROM issue_logs
         WHERE error_code = $3
           AND COALESCE(period_id::text, '') = COALESCE($6::text, '')
           AND metadata ->> 'dedupe_key' = $8
       )`,
      [
        type,
        reference_id,
        envelope.error_code,
        envelope.human_message,
        envelope.suggested_next_action,
        period_id,
        {
          trace_path: envelope.trace_path,
          reference: envelope.reference,
          dedupe_key,
        },
        dedupe_key,
      ]
    )
  } catch (error) {
    console.warn('Failed to persist issue for envelope', { error })
  }
}
