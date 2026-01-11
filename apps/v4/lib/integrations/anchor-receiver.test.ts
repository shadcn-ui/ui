import { describe, it, expect, beforeEach } from 'vitest'
import { processAnchorEvent, SupportedEvent, AnchorReceiverDeps } from './anchor-receiver'

const baseTime = '2025-01-15T12:00:00Z'

class InMemoryDeps implements AnchorReceiverDeps {
  public logs: any[] = []
  public applied: any[] = []
  public period = { id: 1, status: 'OPEN', pl_closed: false, inventory_closed: false }

  async hasAcceptedEvent(orderId: string, eventType: SupportedEvent): Promise<boolean> {
    return this.logs.some(
      (log) => log.payload.order_id === orderId && log.event_type === eventType && log.outcome === 'ACCEPTED'
    )
  }

  async getPeriodForDate(): Promise<any> {
    return this.period
  }

  async logEvent(entry: any): Promise<void> {
    this.logs.push(entry)
  }

  async applyEvent(event: any): Promise<void> {
    this.applied.push(event)
  }

  now() {
    return new Date('2025-01-15T12:05:00Z')
  }
}

describe('processAnchorEvent', () => {
  let deps: InMemoryDeps
  const idempotencyStore = new Map<string, any>()

  const handle = async (envelope: any, idempotencyKey: string) => {
    if (idempotencyStore.has(idempotencyKey)) {
      return idempotencyStore.get(idempotencyKey)
    }
    const result = await processAnchorEvent(deps, envelope, idempotencyKey)
    idempotencyStore.set(idempotencyKey, result)
    return result
  }

  beforeEach(() => {
    deps = new InMemoryDeps()
    idempotencyStore.clear()
  })

  it('rejects invalid sequence (GOODS_DELIVERED without GOODS_SHIPPED)', async () => {
    const envelope = {
      event_id: '11111111-1111-1111-1111-111111111111',
      event_type: 'GOODS_DELIVERED',
      event_time: baseTime,
      payload: {
        order_id: 'ORDER-1',
        delivery_id: 'DEL-1',
        delivery_date: baseTime,
        items: [{ sku: 'SKU-1', qty: 1 }],
      },
    }

    const result = await handle(envelope, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')

    expect(result.statusCode).toBe(409)
    expect(result.body.reason_code).toBe('INVALID_SEQUENCE')
    expect(deps.logs.at(-1)?.outcome).toBe('REJECTED')
  })

  it('rejects when accounting period is closed', async () => {
    deps.period = { id: 2, status: 'CLOSED', pl_closed: false, inventory_closed: false }

    const envelope = {
      event_id: '22222222-2222-2222-2222-222222222222',
      event_type: 'PAYMENT_RECEIVED',
      event_time: baseTime,
      payload: {
        order_id: 'ORDER-2',
        payment_id: 'PAY-1',
        payment_date: baseTime,
        amount: 100,
        method: 'cash',
      },
    }

    const result = await handle(envelope, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')

    expect(result.statusCode).toBe(403)
    expect(result.body.reason_code).toBe('PERIOD_CLOSED')
  })

  it('enforces idempotency and returns prior response', async () => {
    const envelope = {
      event_id: '33333333-3333-3333-3333-333333333333',
      event_type: 'ORDER_CONFIRMED',
      event_time: baseTime,
      payload: {
        order_id: 'ORDER-3',
        order_date: baseTime,
        customer_id: 'C-1',
        currency: 'USD',
        order_lines: [{ sku: 'SKU-1', qty: 1, unit_price: 10 }],
      },
    }

    const first = await handle(envelope, 'cccccccc-cccc-cccc-cccc-cccccccccccc')
    const second = await handle(envelope, 'cccccccc-cccc-cccc-cccc-cccccccccccc')

    expect(first.body.status).toBe('ACCEPTED')
    expect(second).toEqual(first)
    expect(deps.logs.filter((l) => l.event_id === envelope.event_id).length).toBe(1)
  })

  it('processes happy path across confirm -> ship -> deliver', async () => {
    const basePayload = { order_id: 'ORDER-4' }

    const confirm = await handle(
      {
        event_id: '44444444-4444-4444-4444-444444444444',
        event_type: 'ORDER_CONFIRMED',
        event_time: baseTime,
        payload: {
          ...basePayload,
          order_date: baseTime,
          customer_id: 'C-1',
          currency: 'USD',
          order_lines: [{ sku: 'SKU-1', qty: 1, unit_price: 25 }],
        },
      },
      'dddddddd-dddd-dddd-dddd-dddddddddddd'
    )

    const shipped = await handle(
      {
        event_id: '55555555-5555-5555-5555-555555555555',
        event_type: 'GOODS_SHIPPED',
        event_time: baseTime,
        payload: {
          ...basePayload,
          shipment_id: 'SHIP-1',
          ship_date: baseTime,
          warehouse_id: 'W-1',
          items: [{ sku: 'SKU-1', qty: 1 }],
        },
      },
      'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'
    )

    const delivered = await handle(
      {
        event_id: '66666666-6666-6666-6666-666666666666',
        event_type: 'GOODS_DELIVERED',
        event_time: baseTime,
        payload: {
          ...basePayload,
          delivery_id: 'DEL-1',
          delivery_date: baseTime,
          items: [{ sku: 'SKU-1', qty: 1 }],
        },
      },
      'ffffffff-ffff-ffff-ffff-ffffffffffff'
    )

    expect(confirm.statusCode).toBe(200)
    expect(shipped.statusCode).toBe(200)
    expect(delivered.statusCode).toBe(200)
    expect(deps.logs.filter((l) => l.outcome === 'ACCEPTED').length).toBe(3)
  })
})
