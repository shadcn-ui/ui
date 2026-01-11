import { callShopee } from '../lib/shopee-client.mjs'

// Simple test runner for Shopee client.
// Usage (example):
// PARTNER_ID=123 PARTNER_KEY=abc SHOP_ID=111 REGION=ID SANDBOX=true node ./scripts/test-shopee.mjs

const partnerId = process.env.PARTNER_ID || '123'
const partnerKey = process.env.PARTNER_KEY || 'test_key'
const shopId = process.env.SHOP_ID || ''
const region = process.env.REGION || 'ID'
const sandbox = (process.env.SANDBOX || 'true') === 'true'
const accessToken = process.env.ACCESS_TOKEN || ''

async function run() {
  const useMock = process.env.MOCK === 'true' || process.argv.includes('--mock')

  console.log('Shopee test runner')
  console.log({ partnerId, region, sandbox, shopId, accessToken: !!accessToken, mock: useMock })

  if (useMock) {
    // Return canned sample responses for offline testing
    const mockAuth = {
      status: 200,
      ok: true,
      data: {
        error: 0,
        message: 'success',
        request_id: 'mock-req-123',
        timestamp: Math.floor(Date.now() / 1000)
      }
    }

    const mockItemList = {
      status: 200,
      ok: true,
      data: {
        error: 0,
        message: 'success',
        request_id: 'mock-req-456',
        items: [
          { item_id: 1001, name: 'Sample Serum', stock: 120, price: 199000 },
          { item_id: 1002, name: 'Sample Moisturizer', stock: 80, price: 249000 }
        ],
        pagination: { total_count: 2, offset: 0, entries_per_page: 10 }
      }
    }

    console.log('\n/mock /auth_partner response:', mockAuth.status, mockAuth.ok)
    console.dir(mockAuth.data, { depth: 2 })

    console.log('\n/mock /product/get_item_list response:', mockItemList.status, mockItemList.ok)
    console.dir(mockItemList.data, { depth: 2 })

    return
  }

  // Test 1: call auth_partner (no body)
  try {
    const res = await callShopee({
      partnerId,
      partnerKey,
      shopId,
      region,
      sandbox,
      path: '/api/v2/shop/auth_partner',
      method: 'GET',
      body: {},
      accessToken
    })

    console.log('\n/auth_partner response:', res.status, res.ok)
    console.dir(res.data, { depth: 2 })
  } catch (err) {
    console.error('auth_partner error', err)
  }

  // Test 2: call get_item_list (POST sample)
  try {
    const res2 = await callShopee({
      partnerId,
      partnerKey,
      shopId,
      region,
      sandbox,
      path: '/api/v2/product/get_item_list',
      method: 'POST',
      body: { pagination_offset: 0, pagination_entries_per_page: 10 },
      accessToken
    })

    console.log('\n/product/get_item_list response:', res2.status, res2.ok)
    console.dir(res2.data, { depth: 2 })
  } catch (err) {
    console.error('get_item_list error', err)
  }
}

run().catch((e) => {
  console.error('Test runner failed', e)
  process.exit(1)
})
