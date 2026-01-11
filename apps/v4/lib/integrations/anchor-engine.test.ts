import { describe, beforeEach, it, expect } from 'vitest'
import { newDb } from 'pg-mem'
import { randomUUID } from 'crypto'
import { applyAnchorEvent, AnchorDispatchEvent } from './anchor'

const baseTime = new Date('2025-01-15T12:00:00Z')

function buildDb() {
  const db = newDb({ autoCreateForeignKeyIndices: true })
  const { Client } = db.adapters.createPg()
  const client = new Client()

  return { db, client }
}

async function seedSchema(client: any) {
  await client.connect()
  await client.query(`
    CREATE TABLE chart_of_accounts (
      id SERIAL PRIMARY KEY,
      account_code VARCHAR(50) UNIQUE NOT NULL,
      account_name VARCHAR(255) NOT NULL,
      account_type VARCHAR(50) NOT NULL,
      account_subtype VARCHAR(100),
      description TEXT,
      is_active BOOLEAN DEFAULT true,
      opening_balance NUMERIC(15,2) DEFAULT 0,
      current_balance NUMERIC(15,2) DEFAULT 0
    );

    CREATE TABLE accounting_periods (
      id SERIAL PRIMARY KEY,
      period_name VARCHAR(100),
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      status VARCHAR(50) DEFAULT 'OPEN',
      pl_closed BOOLEAN DEFAULT false,
      inventory_closed BOOLEAN DEFAULT false
    );

    CREATE TABLE products (
      id UUID PRIMARY KEY,
      sku VARCHAR(100) UNIQUE NOT NULL,
      cost_price NUMERIC(15,2) DEFAULT 0,
      unit_price NUMERIC(15,2) DEFAULT 0
    );

    CREATE TABLE sales_orders (
      id UUID PRIMARY KEY,
      order_number VARCHAR(50) UNIQUE NOT NULL,
      customer_id UUID,
      status VARCHAR(50),
      order_date DATE NOT NULL,
      subtotal NUMERIC(15,2) DEFAULT 0,
      total_amount NUMERIC(15,2) DEFAULT 0,
      source_event_id UUID
    );

    CREATE TABLE sales_order_items (
      id UUID PRIMARY KEY,
      sales_order_id UUID NOT NULL REFERENCES sales_orders(id) ON DELETE CASCADE,
      product_id UUID NOT NULL REFERENCES products(id),
      quantity INTEGER NOT NULL,
      unit_price NUMERIC(15,2) NOT NULL,
      line_total NUMERIC(15,2) NOT NULL,
      source_event_id UUID
    );

    CREATE TABLE journal_entries (
      id SERIAL PRIMARY KEY,
      entry_number VARCHAR(50) UNIQUE NOT NULL,
      entry_date DATE NOT NULL,
      entry_type VARCHAR(50),
      reference_number VARCHAR(100),
      description TEXT,
      status VARCHAR(50) DEFAULT 'Draft',
      total_debit NUMERIC(15,2) DEFAULT 0,
      total_credit NUMERIC(15,2) DEFAULT 0,
      source_event_id UUID,
      posted_at TIMESTAMPTZ
    );

    CREATE TABLE journal_entry_lines (
      id SERIAL PRIMARY KEY,
      journal_entry_id INTEGER NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
      line_number INTEGER NOT NULL,
      account_id INTEGER NOT NULL REFERENCES chart_of_accounts(id),
      description TEXT,
      debit_amount NUMERIC(15,2) DEFAULT 0,
      credit_amount NUMERIC(15,2) DEFAULT 0,
      source_event_id UUID
    );

    CREATE TABLE stock_movements (
      id UUID PRIMARY KEY,
      product_id UUID NOT NULL REFERENCES products(id),
      warehouse_id INTEGER,
      movement_type VARCHAR(50) NOT NULL,
      quantity INTEGER NOT NULL,
      unit_cost NUMERIC(15,2) DEFAULT 0,
      total_value NUMERIC(18,4) DEFAULT 0,
      reference_type VARCHAR(50),
      reference_number VARCHAR(100),
      notes TEXT,
      movement_date TIMESTAMPTZ,
      source_event_id UUID
    );
  `)

  await client.query(
    `INSERT INTO accounting_periods (period_name, start_date, end_date, status, pl_closed, inventory_closed)
     VALUES ($1, $2, $3, 'OPEN', false, false)`,
    ['Jan 2025', '2025-01-01', '2025-01-31']
  )

  await client.query(
    `INSERT INTO products (id, sku, cost_price, unit_price) VALUES
     ($1, 'SKU-1', 10, 25),
     ($2, 'SKU-2', 15, 35)`,
    [randomUUID(), randomUUID()]
  )
}

async function confirmOrder(client: any, orderId: string, eventId: string) {
  const envelope: AnchorDispatchEvent = {
    event_id: eventId,
    event_type: 'ORDER_CONFIRMED',
    event_time: baseTime,
    payload: {
      order_id: orderId,
      order_date: baseTime.toISOString(),
      customer_id: randomUUID(),
      currency: 'USD',
      order_lines: [
        { sku: 'SKU-1', qty: 2, unit_price: 25 },
        { sku: 'SKU-2', qty: 1, unit_price: 35 },
      ],
    },
  }

  await client.query('BEGIN')
  await applyAnchorEvent(client, envelope)
  await client.query('COMMIT')
}

describe('applyAnchorEvent core mappings', () => {
  let client: any

  beforeEach(async () => {
    const ctx = buildDb()
    client = ctx.client
    await seedSchema(client)
  })

  it('processes GOODS_SHIPPED with inventory movement and journal', async () => {
    const orderId = 'ORDER-100'
    await confirmOrder(client, orderId, '11111111-1111-1111-1111-111111111111')

    const shipped: AnchorDispatchEvent = {
      event_id: '22222222-2222-2222-2222-222222222222',
      event_type: 'GOODS_SHIPPED',
      event_time: baseTime,
      payload: {
        order_id: orderId,
        shipment_id: 'SHIP-1',
        ship_date: baseTime.toISOString(),
        warehouse_id: 1,
        items: [
          { sku: 'SKU-1', qty: 2 },
        ],
      },
    }

    await client.query('BEGIN')
    await applyAnchorEvent(client, shipped)
    await client.query('COMMIT')

    const sm = await client.query('SELECT * FROM stock_movements WHERE source_event_id = $1', [shipped.event_id])
    expect(sm.rowCount).toBe(1)
    expect(sm.rows[0].movement_type).toBe('SHIP')
    expect(Number(sm.rows[0].total_value)).toBeCloseTo(20)

    const je = await client.query('SELECT * FROM journal_entries WHERE source_event_id = $1', [shipped.event_id])
    expect(je.rowCount).toBe(1)

    const lines = await client.query(
      'SELECT account_id, debit_amount, credit_amount FROM journal_entry_lines WHERE journal_entry_id = $1 ORDER BY line_number',
      [je.rows[0].id]
    )
    expect(lines.rowCount).toBe(2)
    const totalDebit = lines.rows.reduce((s: number, r: any) => s + Number(r.debit_amount), 0)
    const totalCredit = lines.rows.reduce((s: number, r: any) => s + Number(r.credit_amount), 0)
    expect(totalDebit).toBeCloseTo(20)
    expect(totalCredit).toBeCloseTo(20)
  })

  it('processes GOODS_DELIVERED with revenue and COGS journals', async () => {
    const orderId = 'ORDER-200'
    await confirmOrder(client, orderId, '33333333-3333-3333-3333-333333333333')

    const delivered: AnchorDispatchEvent = {
      event_id: '44444444-4444-4444-4444-444444444444',
      event_type: 'GOODS_DELIVERED',
      event_time: baseTime,
      payload: {
        order_id: orderId,
        delivery_id: 'DEL-1',
        delivery_date: baseTime.toISOString(),
        items: [
          { sku: 'SKU-1', qty: 1 },
          { sku: 'SKU-2', qty: 1 },
        ],
      },
    }

    await client.query('BEGIN')
    await applyAnchorEvent(client, delivered)
    await client.query('COMMIT')

    const je = await client.query('SELECT * FROM journal_entries WHERE source_event_id = $1', [delivered.event_id])
    expect(je.rowCount).toBe(1)

    const lines = await client.query(
      'SELECT debit_amount, credit_amount FROM journal_entry_lines WHERE journal_entry_id = $1',
      [je.rows[0].id]
    )
    const totalDebit = lines.rows.reduce((s: number, r: any) => s + Number(r.debit_amount), 0)
    const totalCredit = lines.rows.reduce((s: number, r: any) => s + Number(r.credit_amount), 0)
    expect(totalDebit).toBeCloseTo(totalCredit)

    const revenue = 25 + 35
    const cogs = 10 + 15
    expect(totalDebit).toBeCloseTo(revenue + cogs)
  })

  it('processes GOODS_RETURNED with reversal journal and stock in', async () => {
    const orderId = 'ORDER-300'
    await confirmOrder(client, orderId, '55555555-5555-5555-5555-555555555555')

    const returned: AnchorDispatchEvent = {
      event_id: '66666666-6666-6666-6666-666666666666',
      event_type: 'GOODS_RETURNED',
      event_time: baseTime,
      payload: {
        order_id: orderId,
        return_id: 'RET-1',
        return_date: baseTime.toISOString(),
        warehouse_id: 1,
        items: [{ sku: 'SKU-1', qty: 1 }],
      },
    }

    await client.query('BEGIN')
    await applyAnchorEvent(client, returned)
    await client.query('COMMIT')

    const sm = await client.query('SELECT * FROM stock_movements WHERE source_event_id = $1', [returned.event_id])
    expect(sm.rowCount).toBe(1)
    expect(sm.rows[0].movement_type).toBe('RETURN')

    const je = await client.query('SELECT * FROM journal_entries WHERE source_event_id = $1', [returned.event_id])
    expect(je.rowCount).toBe(1)

    const lines = await client.query(
      'SELECT debit_amount, credit_amount FROM journal_entry_lines WHERE journal_entry_id = $1',
      [je.rows[0].id]
    )
    const totalDebit = lines.rows.reduce((s: number, r: any) => s + Number(r.debit_amount), 0)
    const totalCredit = lines.rows.reduce((s: number, r: any) => s + Number(r.credit_amount), 0)
    expect(totalDebit).toBeCloseTo(totalCredit)
  })
})
