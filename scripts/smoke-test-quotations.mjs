#!/usr/bin/env node

/**
 * Smoke test for Quotations feature
 * Tests: Create quotation with lead_id, fetch quotation, verify lead_id is stored
 */

const BASE_URL = 'http://localhost:4000'

async function smokeTest() {
  console.log('🧪 Starting Quotations smoke test...\n')
  
  try {
    // Step 1: Fetch leads to get a lead_id
    console.log('1️⃣  Fetching leads...')
    const leadsRes = await fetch(`${BASE_URL}/api/leads`)
    if (!leadsRes.ok) {
      throw new Error(`Failed to fetch leads: ${leadsRes.status}`)
    }
    const leadsData = await leadsRes.json()
    const leads = leadsData.leads || leadsData
    
    if (!Array.isArray(leads) || leads.length === 0) {
      throw new Error('No leads available for testing')
    }
    
    const testLead = leads[0]
    console.log(`   ✅ Found ${leads.length} leads. Using lead: ${testLead.first_name} ${testLead.last_name} (ID: ${testLead.id})`)
    
    // Step 2: Create a quotation with lead_id
    console.log('\n2️⃣  Creating quotation with lead_id...')
    const quotationData = {
      customer: `${testLead.first_name} ${testLead.last_name}${testLead.company ? ` — ${testLead.company}` : ''}`,
      total_value: 1500.00,
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      lead_id: String(testLead.id)
    }
    
    const createRes = await fetch(`${BASE_URL}/api/quotations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quotationData)
    })
    
    if (!createRes.ok) {
      const errorData = await createRes.json()
      throw new Error(`Failed to create quotation: ${createRes.status} - ${JSON.stringify(errorData)}`)
    }
    
    const createData = await createRes.json()
    const quotation = createData.quotation
    console.log(`   ✅ Created quotation ID: ${quotation.id}`)
    console.log(`      Customer: ${quotation.customer}`)
    console.log(`      Total: ${quotation.total_value}`)
    console.log(`      Lead ID: ${quotation.lead_id || 'NOT SET ⚠️'}`)
    
    // Step 3: Verify the quotation was created with lead_id
    console.log('\n3️⃣  Verifying quotation...')
    const getRes = await fetch(`${BASE_URL}/api/quotations/${quotation.id}`)
    if (!getRes.ok) {
      throw new Error(`Failed to fetch quotation: ${getRes.status}`)
    }
    
    const getData = await getRes.json()
    const fetchedQuotation = getData.quotation
    
    console.log(`   ✅ Fetched quotation ID: ${fetchedQuotation.id}`)
    console.log(`      Customer: ${fetchedQuotation.customer}`)
    console.log(`      Lead ID: ${fetchedQuotation.lead_id || 'NOT SET ⚠️'}`)
    
    // Verify lead_id matches
    if (fetchedQuotation.lead_id && String(fetchedQuotation.lead_id) === String(testLead.id)) {
      console.log(`   ✅ Lead ID correctly stored and retrieved!`)
    } else {
      console.log(`   ⚠️  Lead ID mismatch or not stored:`)
      console.log(`      Expected: ${testLead.id}`)
      console.log(`      Got: ${fetchedQuotation.lead_id}`)
    }
    
    // Step 4: List quotations to ensure it appears
    console.log('\n4️⃣  Listing all quotations...')
    const listRes = await fetch(`${BASE_URL}/api/quotations`)
    if (!listRes.ok) {
      throw new Error(`Failed to list quotations: ${listRes.status}`)
    }
    
    const listData = await listRes.json()
    const quotations = listData.quotations || []
    const found = quotations.find(q => q.id === quotation.id)
    
    if (found) {
      console.log(`   ✅ Quotation appears in list (${quotations.length} total)`)
    } else {
      console.log(`   ⚠️  Quotation not found in list`)
    }
    
    console.log('\n✅ All smoke tests passed!\n')
    process.exit(0)
    
  } catch (error) {
    console.error('\n❌ Smoke test failed:')
    console.error(error.message)
    if (error.stack) {
      console.error('\nStack trace:')
      console.error(error.stack)
    }
    process.exit(1)
  }
}

smokeTest()
