import { NextRequest, NextResponse } from 'next/server'
import { productionLockResponse } from '@/lib/runtime-flags'

export async function GET(request: NextRequest) {
  const locked = productionLockResponse('Mock Shopee authorization page')
  if (locked) return locked

  const url = new URL(request.url)
  const partner_id = url.searchParams.get('partner_id') || '123456'
  const shop_id = url.searchParams.get('shop_id') || '111111'
  const region = url.searchParams.get('region') || 'SG'

  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Shopee Mock Authorization</title>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <style>body{font-family:system-ui,Arial,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#f7fafc} .card{background:#fff;padding:24px;border-radius:8px;box-shadow:0 6px 18px rgba(0,0,0,0.08);max-width:420px;width:100%;text-align:center}button{background:#111827;color:#fff;border:0;padding:10px 18px;border-radius:6px;font-weight:600;cursor:pointer}</style>
  </head>
  <body>
    <div class="card">
      <h2>Mock Shopee Authorization</h2>
      <p>Partner ID: <strong>${partner_id}</strong></p>
      <p>Shop ID: <strong>${shop_id}</strong></p>
      <p>Region: <strong>${region}</strong></p>
      <p style="color:#6b7280;font-size:13px">This is a mock authorization page. Clicking Authorize will send a fake token back to the opener window and close this popup.</p>
      <div style="margin-top:16px">
        <button id="authorize">Authorize</button>
      </div>
    </div>

    <script>
      const partner_id = ${JSON.stringify(partner_id)}
      const shop_id = ${JSON.stringify(shop_id)}

      function postAuth() {
        const access_token = 'mock_access_' + Math.random().toString(36).slice(2,12)
        const payload = { type: 'shopee_auth', partner_id, shop_id, access_token }
        try {
          if (window.opener && !window.opener.closed) {
            window.opener.postMessage(payload, '*')
          }
        } catch (e) {
          console.error(e)
        }
        window.close()
      }

      document.getElementById('authorize').addEventListener('click', postAuth)

      // Auto-authorize after short delay for convenience
      setTimeout(postAuth, 900)
    </script>
  </body>
</html>`

  return new NextResponse(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
