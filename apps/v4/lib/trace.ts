import { query } from '@/lib/db'

export interface TimelineItem {
  id: string
  type: 'order' | 'inventory' | 'journal'
  label: string
  description?: string
  timestamp: string | null
  href?: string
  source_event_id?: string | null
  period?: PeriodInfo | null
  meta?: Record<string, any>
}

export interface PeriodInfo {
  id?: string
  start_date?: string
  end_date?: string
  status?: string
  pl_closed?: boolean
  inventory_closed?: boolean
}

export interface TraceResult {
  success: boolean
  context: Record<string, any>
  order?: any
  order_items?: any[]
  stock_movements: any[]
  journal_entries: any[]
  timeline: TimelineItem[]
  payments: any[]
  returns: any[]
}

function normalizeDate(value: any): string | null {
  if (!value) return null
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d.toISOString()
}

async function getPeriodForDate(dateValue: any): Promise<PeriodInfo | null> {
  const normalized = normalizeDate(dateValue)
  if (!normalized) return null
  const res = await query(
    `SELECT id, start_date, end_date, status, pl_closed, inventory_closed
     FROM accounting_periods
     WHERE $1::date BETWEEN start_date AND end_date
     LIMIT 1`,
    [normalized]
  )
  if (res.rowCount === 0) return null
  return res.rows[0]
}

function buildTimeline(items: TimelineItem[]): TimelineItem[] {
  return items
    .filter((item) => item.timestamp)
    .sort((a, b) => {
      const aTime = new Date(a.timestamp as string).getTime()
      const bTime = new Date(b.timestamp as string).getTime()
      return aTime - bTime
    })
}

function arrayParam<T>(values: T[] | undefined): T[] {
  if (!values || values.length === 0) return []
  return values
}

function groupLinesByEntry(lines: any[]) {
  const map: Record<string, any[]> = {}
  for (const line of lines) {
    const key = line.journal_entry_id
    if (!map[key]) map[key] = []
    map[key].push(line)
  }
  return map
}

export async function loadOrderTrace(identifier: string): Promise<TraceResult> {
  const orderRes = await query(
    `SELECT id, order_number, customer_id, status, order_date, subtotal, total_amount, source_event_id
     FROM sales_orders
     WHERE id::text = $1 OR order_number = $1
     LIMIT 1`,
    [identifier]
  )

  if (orderRes.rowCount === 0) {
    return { success: false, context: { message: 'Order not found' }, stock_movements: [], journal_entries: [], timeline: [], payments: [], returns: [] }
  }

  const order = orderRes.rows[0]
  const orderItemsRes = await query(
    `SELECT id, product_id, quantity, unit_price, line_total, source_event_id
     FROM sales_order_items
     WHERE sales_order_id = $1
     ORDER BY line_total DESC`,
    [order.id]
  )

  const anchorEventIds = new Set<string>()
  if (order.source_event_id) anchorEventIds.add(order.source_event_id)

  const stockMovementsRes = await query(
    `SELECT id, product_id, warehouse_id, movement_type, quantity, unit_cost, total_value,
            reference_type, reference_number, notes, movement_date, source_event_id
     FROM stock_movements
     WHERE reference_number = $1
        OR (array_length($2::uuid[], 1) IS NOT NULL AND source_event_id = ANY($2::uuid[]))
     ORDER BY movement_date ASC`,
    [order.order_number, arrayParam(Array.from(anchorEventIds))]
  )

  stockMovementsRes.rows.forEach((row) => {
    if (row.source_event_id) anchorEventIds.add(row.source_event_id)
  })

  const journalEntriesRes = await query(
    `SELECT id, entry_number, entry_date, entry_type, reference_number, description,
            status, total_debit, total_credit, source_event_id, posted_at
     FROM journal_entries
     WHERE reference_number = $1
        OR (array_length($2::uuid[], 1) IS NOT NULL AND source_event_id = ANY($2::uuid[]))
     ORDER BY entry_date ASC`,
    [order.order_number, arrayParam(Array.from(anchorEventIds))]
  )

  journalEntriesRes.rows.forEach((row) => {
    if (row.source_event_id) anchorEventIds.add(row.source_event_id)
  })

  const journalEntryIds = journalEntriesRes.rows.map((row) => row.id)
  let journalLines: Record<string, any[]> = {}
  if (journalEntryIds.length > 0) {
    const linesRes = await query(
      `SELECT journal_entry_id, line_number, account_id, description, debit_amount, credit_amount, source_event_id
       FROM journal_entry_lines
       WHERE journal_entry_id = ANY($1::uuid[])
       ORDER BY journal_entry_id, line_number`,
      [journalEntryIds]
    )
    journalLines = groupLinesByEntry(linesRes.rows)
  }

  const journalEntries = journalEntriesRes.rows.map((row) => ({ ...row, lines: journalLines[row.id] || [] }))
  const payments = journalEntries.filter((je) => ['Receipt', 'Refund'].includes(je.entry_type))
  const returns = stockMovementsRes.rows.filter((sm) => sm.movement_type === 'RETURN')

  const timeline: TimelineItem[] = []
  timeline.push({
    id: order.id,
    type: 'order',
    label: `Sales Order ${order.order_number}`,
    description: order.status,
    timestamp: normalizeDate(order.order_date),
    href: `/erp/trace/order/${order.order_number}`,
    source_event_id: order.source_event_id,
    period: await getPeriodForDate(order.order_date),
  })

  for (const sm of stockMovementsRes.rows) {
    timeline.push({
      id: sm.id,
      type: 'inventory',
      label: sm.movement_type === 'RETURN' ? 'Return Movement' : 'Stock Movement',
      description: sm.notes,
      timestamp: normalizeDate(sm.movement_date),
      href: sm.source_event_id ? `/erp/trace/event/${sm.source_event_id}` : undefined,
      source_event_id: sm.source_event_id,
      period: await getPeriodForDate(sm.movement_date),
      meta: { reference_number: sm.reference_number, warehouse_id: sm.warehouse_id },
    })
  }

  for (const je of journalEntries) {
    timeline.push({
      id: je.id,
      type: 'journal',
      label: `${je.entry_type} (${je.entry_number})`,
      description: je.description,
      timestamp: normalizeDate(je.entry_date || je.posted_at),
      href: `/erp/trace/journal/${je.id}`,
      source_event_id: je.source_event_id,
      period: await getPeriodForDate(je.entry_date || je.posted_at),
      meta: { reference_number: je.reference_number, status: je.status },
    })
  }

  return {
    success: true,
    context: {
      order_id: order.id,
      order_number: order.order_number,
      anchor_event_ids: Array.from(anchorEventIds),
      period: await getPeriodForDate(order.order_date),
    },
    order,
    order_items: orderItemsRes.rows,
    stock_movements: stockMovementsRes.rows,
    journal_entries: journalEntries,
    timeline: buildTimeline(timeline),
    payments,
    returns,
  }
}

export async function loadEventTrace(eventId: string): Promise<TraceResult> {
  const ordersRes = await query(
    `SELECT id, order_number, customer_id, status, order_date, subtotal, total_amount, source_event_id
     FROM sales_orders
     WHERE source_event_id = $1`,
    [eventId]
  )

  const stockMovementsRes = await query(
    `SELECT id, product_id, warehouse_id, movement_type, quantity, unit_cost, total_value,
            reference_type, reference_number, notes, movement_date, source_event_id
     FROM stock_movements
     WHERE source_event_id = $1
     ORDER BY movement_date ASC`,
    [eventId]
  )

  const journalEntriesRes = await query(
    `SELECT id, entry_number, entry_date, entry_type, reference_number, description,
            status, total_debit, total_credit, source_event_id, posted_at
     FROM journal_entries
     WHERE source_event_id = $1
     ORDER BY entry_date ASC`,
    [eventId]
  )

  const journalEntryIds = journalEntriesRes.rows.map((row) => row.id)
  let journalLines: Record<string, any[]> = {}
  if (journalEntryIds.length > 0) {
    const linesRes = await query(
      `SELECT journal_entry_id, line_number, account_id, description, debit_amount, credit_amount, source_event_id
       FROM journal_entry_lines
       WHERE journal_entry_id = ANY($1::uuid[])
       ORDER BY journal_entry_id, line_number`,
      [journalEntryIds]
    )
    journalLines = groupLinesByEntry(linesRes.rows)
  }

  const journalEntries = journalEntriesRes.rows.map((row) => ({ ...row, lines: journalLines[row.id] || [] }))

  const referenceNumbers = new Set<string>()
  stockMovementsRes.rows.forEach((sm) => sm.reference_number && referenceNumbers.add(sm.reference_number))
  journalEntries.forEach((je) => je.reference_number && referenceNumbers.add(je.reference_number))

  let relatedOrders = ordersRes.rows
  if (relatedOrders.length === 0 && referenceNumbers.size > 0) {
    const lookup = await query(
      `SELECT id, order_number, customer_id, status, order_date, subtotal, total_amount, source_event_id
       FROM sales_orders
       WHERE order_number = ANY($1::text[])`,
      [Array.from(referenceNumbers)]
    )
    relatedOrders = lookup.rows
  }

  const payments = journalEntries.filter((je) => ['Receipt', 'Refund'].includes(je.entry_type))
  const returns = stockMovementsRes.rows.filter((sm) => sm.movement_type === 'RETURN')

  const timeline: TimelineItem[] = []
  for (const order of relatedOrders) {
    timeline.push({
      id: order.id,
      type: 'order',
      label: `Sales Order ${order.order_number}`,
      description: order.status,
      timestamp: normalizeDate(order.order_date),
      href: `/erp/trace/order/${order.order_number}`,
      source_event_id: order.source_event_id,
      period: await getPeriodForDate(order.order_date),
    })
  }

  for (const sm of stockMovementsRes.rows) {
    timeline.push({
      id: sm.id,
      type: 'inventory',
      label: sm.movement_type === 'RETURN' ? 'Return Movement' : 'Stock Movement',
      description: sm.notes,
      timestamp: normalizeDate(sm.movement_date),
      href: `/erp/trace/event/${eventId}`,
      source_event_id: sm.source_event_id,
      period: await getPeriodForDate(sm.movement_date),
      meta: { reference_number: sm.reference_number, warehouse_id: sm.warehouse_id },
    })
  }

  for (const je of journalEntries) {
    timeline.push({
      id: je.id,
      type: 'journal',
      label: `${je.entry_type} (${je.entry_number})`,
      description: je.description,
      timestamp: normalizeDate(je.entry_date || je.posted_at),
      href: `/erp/trace/journal/${je.id}`,
      source_event_id: je.source_event_id,
      period: await getPeriodForDate(je.entry_date || je.posted_at),
      meta: { reference_number: je.reference_number, status: je.status },
    })
  }

  return {
    success: true,
    context: {
      anchor_event_id: eventId,
      order_numbers: relatedOrders.map((o) => o.order_number),
      period: await getPeriodForDate(journalEntries[0]?.entry_date || stockMovementsRes.rows[0]?.movement_date || relatedOrders[0]?.order_date || null),
    },
    order: relatedOrders[0],
    order_items: [],
    stock_movements: stockMovementsRes.rows,
    journal_entries: journalEntries,
    timeline: buildTimeline(timeline),
    payments,
    returns,
  }
}

export async function loadJournalTrace(identifier: string): Promise<TraceResult> {
  const journalRes = await query(
    `SELECT id, entry_number, entry_date, entry_type, reference_number, description,
            status, total_debit, total_credit, source_event_id, posted_at
     FROM journal_entries
     WHERE id::text = $1 OR entry_number = $1
     LIMIT 1`,
    [identifier]
  )

  if (journalRes.rowCount === 0) {
    return { success: false, context: { message: 'Journal entry not found' }, stock_movements: [], journal_entries: [], timeline: [], payments: [], returns: [] }
  }

  const journal = journalRes.rows[0]
  const linesRes = await query(
    `SELECT journal_entry_id, line_number, account_id, description, debit_amount, credit_amount, source_event_id
     FROM journal_entry_lines
     WHERE journal_entry_id = $1
     ORDER BY line_number`,
    [journal.id]
  )
  const journalEntries = [{ ...journal, lines: linesRes.rows }]

  const stockMovementsRes = await query(
    `SELECT id, product_id, warehouse_id, movement_type, quantity, unit_cost, total_value,
            reference_type, reference_number, notes, movement_date, source_event_id
     FROM stock_movements
     WHERE source_event_id = $1 OR reference_number = $2
     ORDER BY movement_date ASC`,
    [journal.source_event_id, journal.reference_number]
  )

  const relatedOrdersRes = journal.reference_number
    ? await query(
        `SELECT id, order_number, customer_id, status, order_date, subtotal, total_amount, source_event_id
         FROM sales_orders
         WHERE order_number = $1
         LIMIT 1`,
        [journal.reference_number]
      )
    : { rowCount: 0, rows: [] as any[] }

  const relatedOrder = relatedOrdersRes.rowCount > 0 ? relatedOrdersRes.rows[0] : null

  const payments = journal.entry_type === 'Receipt' || journal.entry_type === 'Refund' ? [journal] : []
  const returns = stockMovementsRes.rows.filter((sm) => sm.movement_type === 'RETURN')

  const timeline: TimelineItem[] = []
  if (relatedOrder) {
    timeline.push({
      id: relatedOrder.id,
      type: 'order',
      label: `Sales Order ${relatedOrder.order_number}`,
      description: relatedOrder.status,
      timestamp: normalizeDate(relatedOrder.order_date),
      href: `/erp/trace/order/${relatedOrder.order_number}`,
      source_event_id: relatedOrder.source_event_id,
      period: await getPeriodForDate(relatedOrder.order_date),
    })
  }

  stockMovementsRes.rows.forEach((sm) => {
    timeline.push({
      id: sm.id,
      type: 'inventory',
      label: sm.movement_type === 'RETURN' ? 'Return Movement' : 'Stock Movement',
      description: sm.notes,
      timestamp: normalizeDate(sm.movement_date),
      href: sm.source_event_id ? `/erp/trace/event/${sm.source_event_id}` : undefined,
      source_event_id: sm.source_event_id,
      period: await getPeriodForDate(sm.movement_date),
      meta: { reference_number: sm.reference_number, warehouse_id: sm.warehouse_id },
    })
  })

  timeline.push({
    id: journal.id,
    type: 'journal',
    label: `${journal.entry_type} (${journal.entry_number})`,
    description: journal.description,
    timestamp: normalizeDate(journal.entry_date || journal.posted_at),
    href: `/erp/trace/journal/${journal.id}`,
    source_event_id: journal.source_event_id,
    period: await getPeriodForDate(journal.entry_date || journal.posted_at),
    meta: { reference_number: journal.reference_number, status: journal.status },
  })

  return {
    success: true,
    context: {
      journal_entry_id: journal.id,
      anchor_event_id: journal.source_event_id,
      order_number: journal.reference_number,
      period: await getPeriodForDate(journal.entry_date || journal.posted_at),
    },
    order: relatedOrder,
    order_items: [],
    stock_movements: stockMovementsRes.rows,
    journal_entries: journalEntries,
    timeline: buildTimeline(timeline),
    payments,
    returns,
  }
}
