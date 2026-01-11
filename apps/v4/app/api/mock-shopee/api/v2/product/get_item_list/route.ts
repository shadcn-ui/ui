import { NextRequest, NextResponse } from 'next/server'
import { productionLockResponse } from '@/lib/runtime-flags'

export async function POST(request: NextRequest) {
  const locked = productionLockResponse('Mock Shopee get_item_list API')
  if (locked) return locked

  // Return a small set of sample items
  const body = await request.json().catch(() => ({}))

  const items = [
    { item_id: 1001, name: 'Sample Serum', stock: 120, price: 199000 },
    { item_id: 1002, name: 'Sample Moisturizer', stock: 80, price: 249000 },
  ]

  return NextResponse.json({
    error: 0,
    message: 'success',
    request_id: 'mock-items-' + Date.now(),
    items,
    pagination: { total_count: items.length, offset: body.pagination_offset || 0, entries_per_page: body.pagination_entries_per_page || items.length }
  })
}
