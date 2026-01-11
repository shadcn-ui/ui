import { describe, it, expect } from 'vitest'

const baseEnv = process.env.BASE_URL || ''
const base = baseEnv && /^https?:\/\//.test(baseEnv) ? baseEnv.replace(/\/$/, '') : 'http://localhost:4000'

describe('Quotations API', () => {
  it('create -> add item -> edit item -> delete item -> export', async () => {
    // create quotation
    const createRes = await fetch(`${base}/api/quotations`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ customer: 'TestCo', reference_number: `T-${Date.now()}` }) })
    expect(createRes.status).toBeGreaterThanOrEqual(200)
  const createJson: any = await createRes.json()
  const quotation = createJson.quotation || createJson
    expect(quotation).toBeDefined()
    const id = quotation.id
    expect(id).toBeDefined()

    // add item
    const addRes = await fetch(`${base}/api/quotations/${id}/items`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ description: 'API Test', quantity: 1, unit_price: 10 }) })
    expect(addRes.status).toBe(201)
  const addJson: any = await addRes.json()
  expect(addJson.item).toBeDefined()
  const item = addJson.item
  expect(addJson.total).toBeGreaterThan(0)

    // edit item
    const editRes = await fetch(`${base}/api/quotations/${id}/items/${item.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quantity: 2 }) })
    expect(editRes.status).toBe(200)
  const editJson: any = await editRes.json()
  expect(editJson.item).toBeDefined()
  expect(editJson.item.quantity).toBe(2)
  expect(editJson.total).toBeGreaterThan(0)

    // delete item
    const delRes = await fetch(`${base}/api/quotations/${id}/items/${item.id}`, { method: 'DELETE' })
    expect(delRes.status).toBe(200)
  const delJson: any = await delRes.json()
  expect(delJson.success).toBeTruthy()

    // export
    const expRes = await fetch(`${base}/api/quotations/${id}/export`)
    expect(expRes.status).toBe(200)
    const html = await expRes.text()
    expect(html).toContain('Quotation')
  }, 20000)
})
