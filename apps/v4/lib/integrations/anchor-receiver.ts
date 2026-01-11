import { z } from 'zod'
import { actionForError, buildTracePath, humanizeError } from '@/lib/issues'

export const SUPPORTED_EVENTS = [
  'ORDER_CONFIRMED',
  'GOODS_SHIPPED',
  'GOODS_DELIVERED',
  'PAYMENT_RECEIVED',
  'RETURN_REQUESTED',
  'GOODS_RETURNED',
  'REFUND_SETTLED',
] as const

export type SupportedEvent = (typeof SUPPORTED_EVENTS)[number]

export interface AnchorEventEnvelope {
  event_id: string
  event_type: SupportedEvent
  event_time: string
  payload: Record<string, any>
}

export type ReasonCode =
  | 'PERIOD_CLOSED'
  | 'INVENTORY_CLOSED'
  | 'PL_CLOSED'
  | 'DUPLICATE_EVENT'
  | 'INVALID_SEQUENCE'
  | 'MISSING_DEPENDENCY'
  | 'INVALID_PAYLOAD'
  | 'INSUFFICIENT_STOCK'

export interface PeriodState {
  id: number
  status: string
  pl_closed?: boolean
  inventory_closed?: boolean
}

export interface AnchorReceiverDeps {
  hasAcceptedEvent: (orderId: string, eventType: SupportedEvent) => Promise<boolean>
  getPeriodForDate: (date: Date) => Promise<PeriodState | null>
  logEvent: (entry: {
    event_id: string
    idempotency_key: string
    event_type: SupportedEvent
    event_time: Date
    payload: Record<string, any>
    outcome: 'ACCEPTED' | 'REJECTED'
    reason_code?: ReasonCode
    message?: string
  }) => Promise<void>
  applyEvent: (event: {
    event_id: string
    event_type: SupportedEvent
    event_time: Date
    payload: Record<string, any>
  }) => Promise<void>
  now: () => Date
}

export interface ProcessResult {
  statusCode: number
  body: Record<string, any>
  outcome: 'ACCEPTED' | 'REJECTED'
  reason_code?: ReasonCode
  period_id?: number
  reference_id?: string
}

const envelopeSchema = z.object({
  event_id: z.string().uuid(),
  event_type: z.enum(SUPPORTED_EVENTS),
  event_time: z.string().datetime({ offset: true }),
  payload: z.record(z.any()),
})

const requiredByEvent: Record<SupportedEvent, string[]> = {
  ORDER_CONFIRMED: ['order_id', 'order_date', 'customer_id', 'currency', 'order_lines'],
  GOODS_SHIPPED: ['order_id', 'shipment_id', 'ship_date', 'warehouse_id', 'items'],
  GOODS_DELIVERED: ['order_id', 'delivery_id', 'delivery_date', 'items'],
  PAYMENT_RECEIVED: ['order_id', 'payment_id', 'payment_date', 'amount', 'method'],
  RETURN_REQUESTED: ['order_id', 'return_id', 'request_date'],
  GOODS_RETURNED: ['order_id', 'return_id', 'return_date', 'warehouse_id', 'items'],
  REFUND_SETTLED: ['order_id', 'refund_id', 'refund_date', 'amount', 'method'],
}

function validatePayload(eventType: SupportedEvent, payload: Record<string, any>) {
  const required = requiredByEvent[eventType]
  const missing = required.filter((key) => payload[key] === undefined || payload[key] === null)
  return { missing }
}

async function enforceSequence(
  deps: AnchorReceiverDeps,
  eventType: SupportedEvent,
  payload: Record<string, any>
) {
  const orderId = payload.order_id
  if (!orderId) {
    return {
      ok: false,
      reason_code: 'INVALID_PAYLOAD' as ReasonCode,
      message: 'payload.order_id is required',
    }
  }

  const has = async (t: SupportedEvent) => deps.hasAcceptedEvent(orderId, t)

  switch (eventType) {
    case 'GOODS_SHIPPED': {
      if (!(await has('ORDER_CONFIRMED')))
        return {
          ok: false,
          reason_code: 'INVALID_SEQUENCE' as ReasonCode,
          message: 'GOODS_SHIPPED requires ORDER_CONFIRMED',
        }
      break
    }
    case 'GOODS_DELIVERED': {
      if (!(await has('GOODS_SHIPPED')))
        return {
          ok: false,
          reason_code: 'INVALID_SEQUENCE' as ReasonCode,
          message: 'GOODS_DELIVERED requires GOODS_SHIPPED',
        }
      break
    }
    case 'GOODS_RETURNED': {
      if (!(await has('GOODS_DELIVERED')))
        return {
          ok: false,
          reason_code: 'INVALID_SEQUENCE' as ReasonCode,
          message: 'GOODS_RETURNED requires GOODS_DELIVERED',
        }
      break
    }
    case 'REFUND_SETTLED': {
      if (!(await has('GOODS_DELIVERED')))
        return {
          ok: false,
          reason_code: 'INVALID_SEQUENCE' as ReasonCode,
          message: 'REFUND_SETTLED requires GOODS_DELIVERED',
        }
      break
    }
    case 'RETURN_REQUESTED': {
      if (!(await has('GOODS_DELIVERED')))
        return {
          ok: false,
          reason_code: 'INVALID_SEQUENCE' as ReasonCode,
          message: 'RETURN_REQUESTED requires GOODS_DELIVERED',
        }
      break
    }
  }

  return { ok: true }
}

function enforcePeriodRules(
  period: PeriodState | null,
  eventType: SupportedEvent
): { ok: boolean; reason_code?: ReasonCode; message?: string; period_id?: number } {
  if (!period) {
    return { ok: false, reason_code: 'PERIOD_CLOSED', message: 'No accounting period found for event_time' }
  }

  const periodClosed = period.status && period.status.toUpperCase() !== 'OPEN'
  if (periodClosed) {
    return { ok: false, reason_code: 'PERIOD_CLOSED', message: 'Accounting period is closed', period_id: period.id }
  }

  const inventoryEvents: SupportedEvent[] = ['GOODS_SHIPPED', 'GOODS_RETURNED']
  const plEvents: SupportedEvent[] = ['GOODS_DELIVERED', 'GOODS_RETURNED']

  if (inventoryEvents.includes(eventType) && period.inventory_closed) {
    return { ok: false, reason_code: 'INVENTORY_CLOSED', message: 'Inventory period is closed', period_id: period.id }
  }

  if (plEvents.includes(eventType) && period.pl_closed) {
    return { ok: false, reason_code: 'PL_CLOSED', message: 'P&L period is closed', period_id: period.id }
  }

  return { ok: true, period_id: period.id }
}

function buildRejection(
  code: ReasonCode,
  eventId: string,
  message?: string,
  period_id?: number,
  trace?: { order_id?: string; event_id?: string }
): ProcessResult {
  const human_message = message || humanizeError(code)
  const suggested_next_action = actionForError(code)
  const trace_path = buildTracePath(trace, { type: 'EVENT', reference_id: eventId })
  return {
    statusCode: code === 'INVALID_PAYLOAD' ? 400 : code === 'PERIOD_CLOSED' || code === 'INVENTORY_CLOSED' || code === 'PL_CLOSED' ? 403 : 409,
    body: {
      success: false,
      status: 'REJECTED',
      event_id: eventId,
      reference_id: eventId,
      error_code: code,
      human_message,
      suggested_next_action,
      ...(trace_path ? { trace_path } : {}),
    },
    outcome: 'REJECTED',
    reason_code: code,
    period_id,
    reference_id: eventId,
  }
}

export async function processAnchorEvent(
  deps: AnchorReceiverDeps,
  envelope: AnchorEventEnvelope,
  idempotencyKey: string
): Promise<ProcessResult> {
  const parsed = envelopeSchema.safeParse(envelope)
  if (!parsed.success) {
    return {
      statusCode: 400,
      body: {
        status: 'REJECTED',
        event_id: envelope?.event_id,
        reason_code: 'INVALID_PAYLOAD',
        message: parsed.error.message,
        ...(envelope?.event_id
          ? { trace_path: buildTracePath({ event_id: envelope.event_id }, { type: 'EVENT', reference_id: envelope.event_id }) }
          : {}),
      },
      outcome: 'REJECTED',
      reason_code: 'INVALID_PAYLOAD',
    }
  }

  const { event_id, event_type, event_time, payload } = parsed.data

  const payloadValidation = validatePayload(event_type, payload)
  if (payloadValidation.missing.length > 0) {
    const message = `Missing required payload fields: ${payloadValidation.missing.join(', ')}`
    return buildRejection('INVALID_PAYLOAD', event_id, message, undefined, {
      order_id: payload.order_id,
      event_id,
    })
  }

  const sequenceCheck = await enforceSequence(deps, event_type, payload)
  if (!sequenceCheck.ok) {
    await deps.logEvent({
      event_id,
      idempotency_key: idempotencyKey,
      event_type,
      event_time: new Date(event_time),
      payload,
      outcome: 'REJECTED',
      reason_code: sequenceCheck.reason_code,
      message: sequenceCheck.message,
    })

    return buildRejection(sequenceCheck.reason_code || 'INVALID_SEQUENCE', event_id, sequenceCheck.message, undefined, {
      order_id: payload.order_id,
      event_id,
    })
  }

  const period = await deps.getPeriodForDate(new Date(event_time))
  const periodCheck = enforcePeriodRules(period, event_type)
  if (!periodCheck.ok) {
    await deps.logEvent({
      event_id,
      idempotency_key: idempotencyKey,
      event_type,
      event_time: new Date(event_time),
      payload,
      outcome: 'REJECTED',
      reason_code: periodCheck.reason_code,
      message: periodCheck.message,
    })

    return buildRejection(periodCheck.reason_code || 'PERIOD_CLOSED', event_id, periodCheck.message, periodCheck.period_id, {
      order_id: payload.order_id,
      event_id,
    })
  }

  // Dispatch to domain handler (side effects encapsulated there)
  try {
    await deps.applyEvent({ event_id, event_type, event_time: new Date(event_time), payload })
  } catch (error: any) {
    const code = (error?.code as ReasonCode) || 'INVALID_PAYLOAD'
    const message = error?.message || 'Event processing blocked'

    await deps.logEvent({
      event_id,
      idempotency_key: idempotencyKey,
      event_type,
      event_time: new Date(event_time),
      payload,
      outcome: 'REJECTED',
      reason_code: code,
      message,
    })

    return buildRejection(code, event_id, message, periodCheck.period_id, {
      order_id: payload.order_id,
      event_id,
    })
  }

  await deps.logEvent({
    event_id,
    idempotency_key: idempotencyKey,
    event_type,
    event_time: new Date(event_time),
    payload,
    outcome: 'ACCEPTED',
  })

  return {
    statusCode: 200,
    body: {
      success: true,
      status: 'ACCEPTED',
      event_id,
      processed_at: deps.now().toISOString(),
    },
    outcome: 'ACCEPTED',
  }
}
