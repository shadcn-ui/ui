import { NextRequest, NextResponse } from 'next/server'
import { productionLockResponse } from '@/lib/runtime-flags'

export async function GET(request: NextRequest) {
  const locked = productionLockResponse('Mock Shopee auth_partner API')
  if (locked) return locked

  const url = new URL(request.url)
  const partner_id = url.searchParams.get('partner_id') || '123456'

  return NextResponse.json({
    error: 0,
    message: 'success',
    request_id: 'mock-auth-' + Date.now(),
    partner_id: Number(partner_id),
  })
}
