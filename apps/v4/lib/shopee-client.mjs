import crypto from 'crypto'

export function generateSign(partnerId, path, timestamp, accessToken = '', shopId = '', partnerKey) {
  // Canonical string: partner_id + path + timestamp + access_token + shop_id
  const parts = [String(partnerId), path, String(timestamp), String(accessToken || ''), String(shopId || '')]
  const raw = parts.join('')
  return crypto.createHmac('sha256', partnerKey).update(raw).digest('hex')
}

export function baseUrlForRegion(region = 'ID', sandbox = false) {
  // Allow an environment override to route calls to an in-app mock server
  // Set MOCK=true and optionally MOCK_BASE=/api/mock-shopee/api to use the mock endpoints
  const useMock = process?.env?.MOCK === 'true' || false
  const mockBase = process?.env?.MOCK_BASE || '/api/mock-shopee/api'
  if (useMock) return mockBase

  // Use partner.shopeemobile.com for most regions; sandbox uses partner.test-stable
  if (sandbox) {
    // For sandbox region mapping prefer test-stable domain per region
    switch (region?.toUpperCase?.()) {
      case 'CN': return 'https://openplatform.sandbox.test-stable.shopee.cn'
      case 'SG': return 'https://openplatform.sandbox.test-stable.shopee.sg'
      case 'BR': return 'https://openplatform.sandbox.test-stable.shopee.com.br'
      default: return 'https://partner.test-stable.shopee.sg'
    }
  }

  // Production partner endpoint (global)
  switch (region?.toUpperCase?.()) {
    case 'CN': return 'https://openplatform.shopee.cn'
    case 'BR': return 'https://openplatform.shopee.com.br'
    case 'SG': return 'https://partner.shopeemobile.com'
    default: return 'https://partner.shopeemobile.com'
  }
}

export async function callShopee({
  partnerId,
  partnerKey,
  shopId,
  region = 'ID',
  sandbox = false,
  path = '/api/v2/shop/auth_partner',
  method = 'POST',
  body = {},
  accessToken = ''
}) {
  const base = baseUrlForRegion(region, sandbox)
  const timestamp = Math.floor(Date.now() / 1000)
  const sign = generateSign(partnerId, path, timestamp, accessToken, shopId, partnerKey)

  // Build query params
  const qs = new URLSearchParams()
  qs.set('partner_id', String(partnerId))
  qs.set('timestamp', String(timestamp))
  qs.set('sign', sign)
  if (accessToken) qs.set('access_token', accessToken)
  if (shopId) qs.set('shop_id', String(shopId))

  const url = `${base}${path}?${qs.toString()}`

  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }

  if (method.toUpperCase() !== 'GET') opts.body = JSON.stringify(body)

  const res = await fetch(url, opts)
  const text = await res.text()
  let json
  try {
    json = JSON.parse(text)
  } catch (e) {
    json = { raw: text }
  }

  return { status: res.status, ok: res.ok, data: json }
}
