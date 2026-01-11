import { randomUUID } from 'crypto'
import { PoolClient } from 'pg'
import { SupportedEvent } from './anchor-receiver'

export interface AnchorDispatchEvent {
  event_id: string
  event_type: SupportedEvent
  event_time: Date
  payload: Record<string, any>
}

export class EventProcessingError extends Error {
  code: string
  constructor(code: string, message: string) {
    super(message)
    this.code = code
  }
}

type AccountCodeKey =
  | 'CASH'
  | 'AR'
  | 'INVENTORY'
  | 'INVENTORY_IN_TRANSIT'
  | 'REVENUE'
  | 'COGS'
  | 'SALES_RETURNS'
  | 'SALES_RETURNS_ALLOWANCE'

const ACCOUNT_MAP: Record<AccountCodeKey, { code: string; name: string; type: string; subtype?: string }> = {
  CASH: { code: '1110', name: 'Cash and Cash Equivalents', type: 'Asset', subtype: 'Cash' },
  AR: { code: '1300', name: 'Accounts Receivable', type: 'Asset', subtype: 'Accounts Receivable' },
  INVENTORY: { code: '1400', name: 'Inventory', type: 'Asset', subtype: 'Inventory' },
  INVENTORY_IN_TRANSIT: { code: '1450', name: 'Inventory In-Transit', type: 'Asset', subtype: 'Inventory' },
  REVENUE: { code: '4100', name: 'Sales Revenue', type: 'Revenue', subtype: 'Sales' },
  COGS: { code: '5100', name: 'Cost of Goods Sold', type: 'Expense', subtype: 'COGS' },
  SALES_RETURNS: { code: '4190', name: 'Sales Returns', type: 'Revenue', subtype: 'Sales' },
  SALES_RETURNS_ALLOWANCE: {
    code: '4195',
    name: 'Sales Returns Allowance',
    type: 'Revenue',
    subtype: 'Sales',
  },
}

interface JournalLineInput {
  account: AccountCodeKey
  debit?: number
  credit?: number
  description?: string
}

interface PlannedJournal {
  id: number
  entry_number: string
}

async function ensureAccount(client: PoolClient, key: AccountCodeKey) {
  const meta = ACCOUNT_MAP[key]
  const existing = await client.query('SELECT id FROM chart_of_accounts WHERE account_code = $1', [meta.code])
  if (existing.rowCount > 0) return existing.rows[0].id

  const inserted = await client.query(
    `INSERT INTO chart_of_accounts (account_code, account_name, account_type, account_subtype, description, is_active, opening_balance, current_balance)
     VALUES ($1, $2, $3, $4, $5, true, 0, 0)
     RETURNING id`,
    [meta.code, meta.name, meta.type, meta.subtype || null, meta.name]
  )
  return inserted.rows[0].id
}

async function getAccountIds(client: PoolClient, keys: AccountCodeKey[]) {
  const result: Record<AccountCodeKey, number> = {} as any
  for (const key of keys) {
    result[key] = await ensureAccount(client, key)
  }
  return result
}

async function assertPeriodOpen(client: PoolClient, event: AnchorDispatchEvent) {
  const res = await client.query(
    `SELECT id, status, pl_closed, inventory_closed
     FROM accounting_periods
     WHERE $1::date BETWEEN start_date AND end_date
     LIMIT 1`,
    [event.event_time]
  )

  const period = res.rows[0]
  if (!period || (period.status && period.status.toUpperCase() !== 'OPEN')) {
    throw new EventProcessingError('PERIOD_CLOSED', 'Accounting period is closed or missing')
  }

  if (['GOODS_SHIPPED', 'GOODS_RETURNED'].includes(event.event_type) && period.inventory_closed) {
    throw new EventProcessingError('INVENTORY_CLOSED', 'Inventory period is closed')
  }

  if (['GOODS_DELIVERED', 'GOODS_RETURNED'].includes(event.event_type) && period.pl_closed) {
    throw new EventProcessingError('PL_CLOSED', 'P&L period is closed')
  }
}

async function alreadyProcessed(client: PoolClient, eventId: string) {
  const res = await client.query(
    `SELECT 1 FROM journal_entries WHERE source_event_id = $1
     UNION SELECT 1 FROM stock_movements WHERE source_event_id = $1
     UNION SELECT 1 FROM sales_orders WHERE source_event_id = $1
     LIMIT 1`,
    [eventId]
  )
  return res.rowCount > 0
}

async function fetchProductBySku(client: PoolClient, sku: string) {
  const res = await client.query('SELECT id, cost_price, unit_price FROM products WHERE sku = $1', [sku])
  if (res.rowCount === 0) throw new EventProcessingError('MISSING_DEPENDENCY', `Product with SKU ${sku} not found`)
  return res.rows[0]
}

async function fetchOrderWithLines(client: PoolClient, orderNumber: string) {
  const res = await client.query(
    `SELECT so.id as sales_order_id, soi.product_id, soi.unit_price, p.sku
     FROM sales_orders so
     JOIN sales_order_items soi ON soi.sales_order_id = so.id
     JOIN products p ON p.id = soi.product_id
     WHERE so.order_number = $1`,
    [orderNumber]
  )
  if (res.rowCount === 0) throw new EventProcessingError('MISSING_DEPENDENCY', 'Sales order not found for delivery')
  const lines: Record<string, { product_id: string; unit_price: number }> = {}
  for (const row of res.rows) {
    lines[row.sku] = { product_id: row.product_id, unit_price: Number(row.unit_price) }
  }
  return lines
}

async function createJournal(
  client: PoolClient,
  event: AnchorDispatchEvent,
  entryType: string,
  description: string,
  lines: JournalLineInput[],
  accounts: Record<AccountCodeKey, number>
): Promise<PlannedJournal> {
  const entryNumber = `JE-${event.event_id.slice(0, 8)}-${Math.floor(Math.random() * 99999)}`
  const preparedLines = lines.map((line) => {
    const debit = Number(line.debit || 0)
    const credit = Number(line.credit || 0)
    if (debit > 0 && credit > 0) {
      throw new EventProcessingError('INVALID_PAYLOAD', 'Journal line cannot have both debit and credit')
    }
    return {
      account_id: accounts[line.account],
      debit,
      credit,
      description: line.description || description,
    }
  })

  const totalDebit = preparedLines.reduce((sum, l) => sum + l.debit, 0)
  const totalCredit = preparedLines.reduce((sum, l) => sum + l.credit, 0)
  if (Number(totalDebit.toFixed(2)) !== Number(totalCredit.toFixed(2))) {
    throw new EventProcessingError('INVALID_PAYLOAD', 'Journal not balanced')
  }

  const journal = await client.query(
    `INSERT INTO journal_entries (
        entry_number, entry_date, entry_type, reference_number, description, status,
        total_debit, total_credit, source_event_id, posted_at
     ) VALUES ($1, $2, $3, $4, $5, 'Posted', $6, $7, $8, NOW())
     RETURNING id, entry_number`,
    [entryNumber, event.event_time, entryType, event.payload?.order_id || null, description, totalDebit, totalCredit, event.event_id]
  )

  let lineNumber = 1
  for (const l of preparedLines) {
    await client.query(
      `INSERT INTO journal_entry_lines (
         journal_entry_id, line_number, account_id, description, debit_amount, credit_amount, source_event_id
       ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [journal.rows[0].id, lineNumber++, l.account_id, l.description, l.debit || 0, l.credit || 0, event.event_id]
    )
  }

  return { id: journal.rows[0].id, entry_number: journal.rows[0].entry_number }
}

async function createStockMovements(
  client: PoolClient,
  event: AnchorDispatchEvent,
  movementType: string,
  warehouseId: number,
  items: Array<{ product_id: string; sku: string; qty: number; unit_cost: number }>
): Promise<string[]> {
  const ids: string[] = []
  for (const item of items) {
    const id = randomUUID()
    await client.query(
      `INSERT INTO stock_movements (
        id, product_id, warehouse_id, movement_type, quantity, unit_cost, total_value,
        reference_type, reference_number, notes, movement_date, source_event_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        id,
        item.product_id,
        warehouseId,
        movementType,
        item.qty,
        item.unit_cost,
        item.qty * item.unit_cost,
        'ORDER',
        event.payload?.order_id || null,
        `Anchor ${event.event_type} for SKU ${item.sku}`,
        event.event_time,
        event.event_id,
      ]
    )
    ids.push(id)
  }
  return ids
}

async function handleOrderConfirmed(client: PoolClient, event: AnchorDispatchEvent) {
  const existing = await client.query('SELECT 1 FROM sales_orders WHERE source_event_id = $1', [event.event_id])
  if (existing.rowCount > 0) return

  const payload = event.payload || {}
  const orderNumber = payload.order_id
  if (!orderNumber) throw new EventProcessingError('INVALID_PAYLOAD', 'order_id is required')

  const orderDate = payload.order_date ? new Date(payload.order_date) : event.event_time
  const orderLines = payload.order_lines || []
  if (!Array.isArray(orderLines) || orderLines.length === 0) {
    throw new EventProcessingError('INVALID_PAYLOAD', 'order_lines are required')
  }

  // Compute totals using provided price*qty
  const lineTotals: Array<{ product_id: string; quantity: number; unit_price: number; line_total: number; sku: string }> = []
  for (const line of orderLines) {
    const sku = line.sku
    if (!sku) throw new EventProcessingError('INVALID_PAYLOAD', 'line.sku is required')
    const product = await fetchProductBySku(client, sku)
    const qty = Number(line.qty || 0)
    const unitPrice = Number(line.unit_price || 0)
    lineTotals.push({
      product_id: product.id,
      quantity: qty,
      unit_price: unitPrice,
      line_total: qty * unitPrice,
      sku,
    })
  }

  const subtotal = lineTotals.reduce((s, l) => s + l.line_total, 0)
  const orderInsert = await client.query(
    `INSERT INTO sales_orders (
      id, order_number, customer_id, status, order_date, subtotal, total_amount, source_event_id
    ) VALUES ($1, $2, $3, 'confirmed', $4, $5, $6, $7)
    RETURNING id`,
    [randomUUID(), orderNumber, payload.customer_id, orderDate, subtotal, subtotal, event.event_id]
  )

  const salesOrderId = orderInsert.rows[0].id
  for (const line of lineTotals) {
    await client.query(
      `INSERT INTO sales_order_items (
        id, sales_order_id, product_id, quantity, unit_price, line_total, source_event_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [randomUUID(), salesOrderId, line.product_id, line.quantity, line.unit_price, line.line_total, event.event_id]
    )
  }
}

async function handleGoodsShipped(client: PoolClient, event: AnchorDispatchEvent) {
  const existing = await client.query('SELECT 1 FROM stock_movements WHERE source_event_id = $1', [event.event_id])
  if (existing.rowCount > 0) return

  const { order_id: orderNumber, warehouse_id, items } = event.payload || {}
  if (!orderNumber || !warehouse_id || !Array.isArray(items) || items.length === 0) {
    throw new EventProcessingError('INVALID_PAYLOAD', 'order_id, warehouse_id, and items are required')
  }

  const accounts = await getAccountIds(client, ['INVENTORY', 'INVENTORY_IN_TRANSIT'])

  const stockItems = [] as Array<{ product_id: string; sku: string; qty: number; unit_cost: number }>
  for (const item of items) {
    const product = await fetchProductBySku(client, item.sku)
    const qty = Number(item.qty || 0)
    const unitCost = Number(product.cost_price || 0)
    stockItems.push({ product_id: product.id, sku: item.sku, qty, unit_cost: unitCost })
  }

  const totalValue = stockItems.reduce((s, i) => s + i.qty * i.unit_cost, 0)
  await createStockMovements(client, event, 'SHIP', Number(warehouse_id), stockItems)

  await createJournal(
    client,
    event,
    'Inventory Transfer',
    `Inventory shipped for order ${orderNumber}`,
    [
      { account: 'INVENTORY_IN_TRANSIT', debit: totalValue },
      { account: 'INVENTORY', credit: totalValue },
    ],
    accounts
  )
}

async function handleGoodsDelivered(client: PoolClient, event: AnchorDispatchEvent) {
  const existing = await client.query('SELECT 1 FROM journal_entries WHERE source_event_id = $1', [event.event_id])
  if (existing.rowCount > 0) return

  const { order_id: orderNumber, items } = event.payload || {}
  if (!orderNumber || !Array.isArray(items) || items.length === 0) {
    throw new EventProcessingError('INVALID_PAYLOAD', 'order_id and items are required')
  }

  const orderLines = await fetchOrderWithLines(client, orderNumber)
  const accounts = await getAccountIds(client, ['AR', 'REVENUE', 'COGS', 'INVENTORY_IN_TRANSIT'])

  let revenue = 0
  let cogs = 0

  for (const item of items) {
    const sku = item.sku
    const qty = Number(item.qty || 0)
    const orderLine = orderLines[sku]
    if (!orderLine) throw new EventProcessingError('MISSING_DEPENDENCY', `No order line for SKU ${sku}`)

    revenue += qty * Number(orderLine.unit_price || 0)

    const product = await fetchProductBySku(client, sku)
    cogs += qty * Number(product.cost_price || 0)
  }

  await createJournal(
    client,
    event,
    'Revenue Recognition',
    `Revenue for order ${orderNumber}`,
    [
      { account: 'AR', debit: revenue },
      { account: 'REVENUE', credit: revenue },
      { account: 'COGS', debit: cogs },
      { account: 'INVENTORY_IN_TRANSIT', credit: cogs },
    ],
    accounts
  )
}

async function handlePaymentReceived(client: PoolClient, event: AnchorDispatchEvent) {
  const existing = await client.query('SELECT 1 FROM journal_entries WHERE source_event_id = $1', [event.event_id])
  if (existing.rowCount > 0) return

  const { amount, order_id: orderNumber } = event.payload || {}
  if (amount === undefined || amount === null) {
    throw new EventProcessingError('INVALID_PAYLOAD', 'amount is required')
  }

  const accounts = await getAccountIds(client, ['CASH', 'AR'])
  await createJournal(
    client,
    event,
    'Receipt',
    `Payment received for order ${orderNumber || ''}`.trim(),
    [
      { account: 'CASH', debit: Number(amount) },
      { account: 'AR', credit: Number(amount) },
    ],
    accounts
  )
}

async function handleReturnRequested(_client: PoolClient, _event: AnchorDispatchEvent) {
  // No side effects by design
  return
}

async function handleGoodsReturned(client: PoolClient, event: AnchorDispatchEvent) {
  const existing = await client.query('SELECT 1 FROM journal_entries WHERE source_event_id = $1', [event.event_id])
  if (existing.rowCount > 0) return

  const { order_id: orderNumber, warehouse_id, items } = event.payload || {}
  if (!orderNumber || !warehouse_id || !Array.isArray(items) || items.length === 0) {
    throw new EventProcessingError('INVALID_PAYLOAD', 'order_id, warehouse_id, and items are required')
  }

  const orderLines = await fetchOrderWithLines(client, orderNumber)
  const accounts = await getAccountIds(client, [
    'SALES_RETURNS',
    'AR',
    'INVENTORY',
    'COGS',
  ])

  let salesReturnAmount = 0
  let cogsReversal = 0
  const stockItems: Array<{ product_id: string; sku: string; qty: number; unit_cost: number }> = []

  for (const item of items) {
    const sku = item.sku
    const qty = Number(item.qty || 0)
    const orderLine = orderLines[sku]
    if (!orderLine) throw new EventProcessingError('MISSING_DEPENDENCY', `No order line for SKU ${sku}`)
    salesReturnAmount += qty * Number(orderLine.unit_price || 0)

    const product = await fetchProductBySku(client, sku)
    const unitCost = Number(product.cost_price || 0)
    cogsReversal += qty * unitCost
    stockItems.push({ product_id: product.id, sku, qty, unit_cost: unitCost })
  }

  await createStockMovements(client, event, 'RETURN', Number(warehouse_id), stockItems)

  await createJournal(
    client,
    event,
    'Sales Return',
    `Return for order ${orderNumber}`,
    [
      { account: 'SALES_RETURNS', debit: salesReturnAmount },
      { account: 'AR', credit: salesReturnAmount },
      { account: 'INVENTORY', debit: cogsReversal },
      { account: 'COGS', credit: cogsReversal },
    ],
    accounts
  )
}

async function handleRefundSettled(client: PoolClient, event: AnchorDispatchEvent) {
  const existing = await client.query('SELECT 1 FROM journal_entries WHERE source_event_id = $1', [event.event_id])
  if (existing.rowCount > 0) return

  const { amount, order_id: orderNumber } = event.payload || {}
  if (amount === undefined || amount === null) {
    throw new EventProcessingError('INVALID_PAYLOAD', 'amount is required')
  }

  const accounts = await getAccountIds(client, ['SALES_RETURNS_ALLOWANCE', 'CASH'])
  await createJournal(
    client,
    event,
    'Refund',
    `Refund settled for order ${orderNumber || ''}`.trim(),
    [
      { account: 'SALES_RETURNS_ALLOWANCE', debit: Number(amount) },
      { account: 'CASH', credit: Number(amount) },
    ],
    accounts
  )
}

export async function applyAnchorEvent(client: PoolClient, event: AnchorDispatchEvent): Promise<void> {
  await assertPeriodOpen(client, event)

  if (await alreadyProcessed(client, event.event_id)) {
    return
  }

  switch (event.event_type) {
    case 'ORDER_CONFIRMED':
      await handleOrderConfirmed(client, event)
      break
    case 'GOODS_SHIPPED':
      await handleGoodsShipped(client, event)
      break
    case 'GOODS_DELIVERED':
      await handleGoodsDelivered(client, event)
      break
    case 'PAYMENT_RECEIVED':
      await handlePaymentReceived(client, event)
      break
    case 'RETURN_REQUESTED':
      await handleReturnRequested(client, event)
      break
    case 'GOODS_RETURNED':
      await handleGoodsReturned(client, event)
      break
    case 'REFUND_SETTLED':
      await handleRefundSettled(client, event)
      break
    default:
      throw new EventProcessingError('INVALID_PAYLOAD', `Unsupported event type ${event.event_type}`)
  }
}
