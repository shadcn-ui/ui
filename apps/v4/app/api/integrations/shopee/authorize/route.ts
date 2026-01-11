import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

function genSign(partnerId: string | number, path: string, timestamp: number, accessToken = '', shopId = '', partnerKey: string) {
  const parts = [String(partnerId), path, String(timestamp), String(accessToken || ''), String(shopId || '')]
  const raw = parts.join('')
  return crypto.createHmac('sha256', partnerKey).update(raw).digest('hex')
}

function baseFor(region = 'ID', sandbox = false) {
  if (sandbox) {
    switch ((region || '').toUpperCase()) {
      case 'CN': return 'https://openplatform.sandbox.test-stable.shopee.cn'
      case 'BR': return 'https://openplatform.sandbox.test-stable.shopee.com.br'
      case 'SG': return 'https://openplatform.sandbox.test-stable.shopee.sg'
      default: return 'https://partner.test-stable.shopee.sg'
    }
  }

  switch ((region || '').toUpperCase()) {
    case 'CN': return 'https://openplatform.shopee.cn'
    case 'BR': return 'https://openplatform.shopee.com.br'
    case 'SG': return 'https://partner.shopeemobile.com'
    default: return 'https://partner.shopeemobile.com'
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const partnerId = body.partnerId || body.partner_id
    const partnerKey = body.partnerKey || body.partner_key
    const shopId = body.shopId || body.shop_id || ''
    const region = (body.region || 'SG').toUpperCase()
    const sandbox = !!body.sandbox

    if (!partnerId || !partnerKey) {
      return NextResponse.json({ error: 'partnerId and partnerKey are required' }, { status: 400 })
    }

    const path = '/api/v2/shop/auth_partner'
    const timestamp = Math.floor(Date.now() / 1000)
    const sign = genSign(partnerId, path, timestamp, '', shopId, partnerKey)

    const base = baseFor(region, sandbox)
    const qs = new URLSearchParams()
    qs.set('partner_id', String(partnerId))
    qs.set('timestamp', String(timestamp))
    qs.set('sign', sign)
    if (shopId) qs.set('shop_id', String(shopId))

    const url = `${base}${path}?${qs.toString()}`

    return NextResponse.json({ url })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 })
  }
}
