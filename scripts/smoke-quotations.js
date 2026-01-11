(async () => {
  try {
    const base = 'http://localhost:4000'
    const createRes = await fetch(`${base}/api/quotations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer: 'ACME Corp', reference_number: `Q-${Date.now()}`, valid_until: '2025-12-31' })
    })
    console.log('Create status', createRes.status)
    const createJson = await createRes.json().catch(() => null)
    console.log('Create response', createJson)
    const id = (createJson && (createJson.quotation?.id || createJson.id))
    if (!id) {
      console.error('No quotation id returned; aborting')
      process.exit(1)
    }

    const addItemRes = await fetch(`${base}/api/quotations/${id}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: 'Test item', quantity: 2, unit_price: 9.99 })
    })
    console.log('Add item status', addItemRes.status)
    const addItemJson = await addItemRes.json().catch(() => null)
    console.log('Add item response', addItemJson)

    const exportRes = await fetch(`${base}/api/quotations/${id}/export`)
    console.log('Export status', exportRes.status)
    const exportText = await exportRes.text().catch(() => null)
    console.log('Export snippet:', exportText ? exportText.slice(0, 200) : 'no body')

    const sendRes = await fetch(`${base}/api/quotations/${id}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: 'test@example.com' })
    })
    console.log('Send status', sendRes.status)
    const sendJson = await sendRes.json().catch(() => null)
    console.log('Send response', sendJson)

    process.exit(0)
  } catch (err) {
    console.error('Smoke test error', err)
    process.exit(2)
  }
})()
