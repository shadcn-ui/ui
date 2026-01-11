import { NextRequest, NextResponse } from 'next/server'
import { getClient } from '@/lib/db'
import {
  AnchorReceiverDeps,
  processAnchorEvent,
  SUPPORTED_EVENTS,
} from '@/lib/integrations/anchor-receiver'
import { applyAnchorEvent } from '@/lib/integrations/anchor'
import { z } from 'zod'
import { actionForError, humanizeError, recordIssue } from '@/lib/issues'
import { productionLockResponse } from '@/lib/runtime-flags'

const headerSchema = z.object({
  idempotencyKey: z.string().uuid(),
  sourceSystem: z.literal('ANCHOR'),
})

const contentTypeJson = (value: string | null) => value?.toLowerCase().includes('application/json')

function buildErrorPayload(error_code: string, reference_id?: string, customMessage?: string) {
  const human_message = customMessage || humanizeError(error_code as any)
  const suggested_next_action = actionForError(error_code as any)
  return { success: false, status: 'REJECTED', error_code, human_message, suggested_next_action, reference_id }
}

export async function POST(request: NextRequest) {
  const locked = productionLockResponse('Anchor event receiver')
  if (locked) return locked

  try {
    const idempotencyKey = request.headers.get('idempotency-key')
    const sourceSystem = request.headers.get('source-system') || request.headers.get('Source-System')
    const contentType = request.headers.get('content-type')

    const headerValidation = headerSchema.safeParse({ idempotencyKey, sourceSystem })
    if (!headerValidation.success || !contentTypeJson(contentType)) {
      const payload = buildErrorPayload(
        'INVALID_PAYLOAD',
        undefined,
        'Missing or invalid headers: Idempotency-Key, Source-System=ANCHOR, Content-Type=application/json'
      )
      return NextResponse.json(payload, { status: 400 })
    }

    let envelope
    try {
      envelope = await request.json()
    } catch (error) {
      return NextResponse.json(buildErrorPayload('INVALID_PAYLOAD', undefined, 'Invalid JSON body'), { status: 400 })
    }

    const client = await getClient()

    try {
      await client.query('BEGIN')

      const existingIdem = await client.query(
        'SELECT event_id, event_type, status_code, response_body FROM anchor_event_idempotency WHERE idempotency_key = $1',
        [idempotencyKey]
      )

      if (existingIdem.rowCount > 0) {
        const existing = existingIdem.rows[0]
        if (envelope?.event_id && existing.event_id !== envelope.event_id) {
          await client.query('ROLLBACK')
          const payload = buildErrorPayload('DUPLICATE_EVENT', envelope?.event_id, 'Idempotency key already used for a different event')
          return NextResponse.json(payload, { status: 409 })
        }

        await client.query('COMMIT')
        return NextResponse.json(existing.response_body, { status: existing.status_code })
      }

      const deps: AnchorReceiverDeps = {
        hasAcceptedEvent: async (orderId: string, eventType: (typeof SUPPORTED_EVENTS)[number]) => {
          const result = await client.query(
            `SELECT 1 FROM anchor_event_log 
             WHERE payload->>'order_id' = $1 AND event_type = $2 AND outcome = 'ACCEPTED'
             LIMIT 1`,
            [orderId, eventType]
          )
          return result.rowCount > 0
        },
        getPeriodForDate: async (date: Date) => {
          const result = await client.query(
            `SELECT id, status, pl_closed, inventory_closed
             FROM accounting_periods
             WHERE $1::date BETWEEN start_date AND end_date
             LIMIT 1`,
            [date]
          )
          return result.rows[0] || null
        },
        logEvent: async (entry) => {
          await client.query(
            `INSERT INTO anchor_event_log (
              event_id, idempotency_key, event_type, event_time, payload, outcome, reason_code, message
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
              entry.event_id,
              entry.idempotency_key,
              entry.event_type,
              entry.event_time,
              entry.payload,
              entry.outcome,
              entry.reason_code || null,
              entry.message || null,
            ]
          )
        },
        applyEvent: async (event) => {
          await applyAnchorEvent(client, event)
        },
        now: () => new Date(),
      }

      const result = await processAnchorEvent(deps, envelope, idempotencyKey as string)

      if (result.outcome === 'REJECTED' && result.reason_code === 'INVALID_PAYLOAD' && envelope?.event_id) {
        const parsedEventTime = envelope?.event_time ? new Date(envelope.event_time) : new Date()
        await deps.logEvent({
          event_id: envelope.event_id,
          idempotency_key: idempotencyKey as string,
          event_type: envelope.event_type,
          event_time: parsedEventTime,
          payload: envelope.payload || {},
          outcome: 'REJECTED',
          reason_code: 'INVALID_PAYLOAD',
          message: result.body?.message,
        })
      }

      if (result.reason_code !== 'INVALID_PAYLOAD' && envelope?.event_id && envelope?.event_type) {
        await client.query(
          `INSERT INTO anchor_event_idempotency (
            idempotency_key, event_id, event_type, status_code, response_body
          ) VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (idempotency_key) DO NOTHING`,
          [idempotencyKey, envelope.event_id, envelope.event_type, result.statusCode, result.body]
        )
      }

      await client.query('COMMIT')

      if (result.outcome === 'REJECTED' && result.reason_code) {
        await recordIssue(client, {
          type: 'EVENT',
          reference_id: result.reference_id || envelope?.event_id,
          error_code: result.reason_code as any,
          period_id: result.period_id,
          metadata: { payload: envelope?.payload, message: result.body?.human_message || result.body?.message },
          human_message: result.body?.human_message,
          suggested_next_action: result.body?.suggested_next_action,
          source: 'anchor_receiver',
        })
      }

      return NextResponse.json(result.body, { status: result.statusCode })
    } catch (error) {
      await client.query('ROLLBACK')
      console.error('Anchor event receiver error:', error)
      return NextResponse.json(buildErrorPayload('INVALID_PAYLOAD', envelope?.event_id, 'Internal error processing event'), {
        status: 500,
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Anchor event receiver failure:', error)
    return NextResponse.json(buildErrorPayload('INVALID_PAYLOAD', undefined, 'Unhandled error'), { status: 500 })
  }
}
