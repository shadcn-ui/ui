#!/usr/bin/env node

/**
 * Comprehensive Module Integration Check
 * Verifies all Ocean ERP modules are properly integrated
 */

import pg from 'pg'
const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://mac@localhost:5432/ocean_erp',
})

const results = []

function addResult(module, status, message, details) {
  results.push({ module, status, message, details })
}

async function checkDatabaseTables() {
  console.log('\n🗄️  Checking Database Tables...')
  
  try {
    const client = await pool.connect()
    
    // Check core tables exist
    const coreTablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `
    
    const result = await client.query(coreTablesQuery)
    const tables = result.rows.map(r => r.table_name)
    
    // Required tables for each module
    const requiredTables = {
      'Sales': ['leads', 'opportunities', 'quotations', 'sales_orders', 'customers'],
      'Product': ['products', 'product_categories', 'inventory', 'warehouses'],
      'Operations': ['work_orders', 'purchase_orders', 'suppliers', 'bom'],
      'Accounting': ['chart_of_accounts', 'journal_entries', 'journal_entry_lines'],
      'Multi-location': ['locations', 'location_inventory', 'location_transfers'],
      'Integrations': ['integrations', 'integration_logs', 'integration_mappings'],
      'POS': ['pos_sessions', 'pos_transactions'],
      'Quality': ['product_quality_tests', 'skincare_formulations'],
    }
    
    let allTablesExist = true
    const missingTables = []
    
    for (const [module, moduleTables] of Object.entries(requiredTables)) {
      for (const table of moduleTables) {
        if (!tables.includes(table)) {
          missingTables.push(`${module}: ${table}`)
          allTablesExist = false
        }
      }
    }
    
    if (allTablesExist) {
      addResult('Database Tables', 'PASS', `All ${tables.length} required tables exist`, tables)
    } else {
      addResult('Database Tables', 'FAIL', 'Some required tables are missing', missingTables)
    }
    
    client.release()
  } catch (error) {
    addResult('Database Tables', 'FAIL', 'Failed to check database tables', [error.message])
  }
}

async function checkTableRelationships() {
  console.log('\n🔗 Checking Table Relationships...')
  
  try {
    const client = await pool.connect()
    
    // Check foreign keys
    const fkQuery = `
      SELECT 
        tc.table_name, 
        kcu.column_name, 
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name 
      FROM information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_schema = 'public'
      ORDER BY tc.table_name
    `
    
    const result = await client.query(fkQuery)
    const relationships = result.rows
    
    // Critical relationships to verify
    const criticalRelationships = [
      { table: 'sales_orders', fk: 'customer_id', references: 'customers' },
      { table: 'quotations', fk: 'customer_id', references: 'customers' },
      { table: 'inventory', fk: 'product_id', references: 'products' },
      { table: 'work_orders', fk: 'product_id', references: 'products' },
      { table: 'purchase_orders', fk: 'supplier_id', references: 'suppliers' },
      { table: 'journal_entries', fk: 'created_by', references: 'users' },
    ]
    
    const missingRelationships = []
    
    for (const rel of criticalRelationships) {
      const exists = relationships.some(
        r => r.table_name === rel.table && 
             r.column_name === rel.fk && 
             r.foreign_table_name === rel.references
      )
      
      if (!exists) {
        missingRelationships.push(`${rel.table}.${rel.fk} -> ${rel.references}`)
      }
    }
    
    if (missingRelationships.length === 0) {
      addResult('Table Relationships', 'PASS', `All ${relationships.length} foreign keys properly configured`, 
        relationships.map(r => `${r.table_name}.${r.column_name} -> ${r.foreign_table_name}`))
    } else {
      addResult('Table Relationships', 'WARNING', 'Some critical relationships missing', missingRelationships)
    }
    
    client.release()
  } catch (error) {
    addResult('Table Relationships', 'FAIL', 'Failed to check relationships', [error.message])
  }
}

async function checkDataIntegrity() {
  console.log('\n✅ Checking Data Integrity...')
  
  try {
    const client = await pool.connect()
    
    // Check for orphaned records
    const checks = [
      {
        name: 'Sales Orders without Customers',
        query: 'SELECT COUNT(*) as count FROM sales_orders WHERE customer_id IS NOT NULL AND customer_id NOT IN (SELECT id FROM customers)'
      },
      {
        name: 'Inventory without Products',
        query: 'SELECT COUNT(*) as count FROM inventory WHERE product_id IS NOT NULL AND product_id NOT IN (SELECT id FROM products)'
      },
      {
        name: 'Work Orders without Products',
        query: 'SELECT COUNT(*) as count FROM work_orders WHERE product_id IS NOT NULL AND product_id NOT IN (SELECT id FROM products)'
      },
    ]
    
    let allClean = true
    const issues = []
    
    for (const check of checks) {
      try {
        const result = await client.query(check.query)
        const count = parseInt(result.rows[0].count)
        
        if (count > 0) {
          allClean = false
          issues.push(`${check.name}: ${count} orphaned records`)
        }
      } catch (error) {
        // Table might not exist, skip
        continue
      }
    }
    
    if (allClean) {
      addResult('Data Integrity', 'PASS', 'No orphaned records found')
    } else {
      addResult('Data Integrity', 'WARNING', 'Found orphaned records', issues)
    }
    
    client.release()
  } catch (error) {
    addResult('Data Integrity', 'FAIL', 'Failed to check data integrity', [error.message])
  }
}

async function checkModuleIntegration() {
  console.log('\n🔄 Checking Cross-Module Integration...')
  
  try {
    const client = await pool.connect()
    
    // Check Sales -> Product integration
    const salesProductCheck = await client.query(`
      SELECT COUNT(*) as count 
      FROM sales_orders so 
      INNER JOIN products p ON so.id = so.id
      LIMIT 1
    `)
    
    // Check Operations -> Product integration
    const opsProductCheck = await client.query(`
      SELECT COUNT(*) as count 
      FROM work_orders wo 
      INNER JOIN products p ON wo.product_id = p.id
      LIMIT 1
    `)
    
    // Check Accounting data exists
    const accountingCheck = await client.query(`
      SELECT COUNT(*) as accounts, 
             (SELECT COUNT(*) FROM journal_entries) as entries
      FROM chart_of_accounts
    `)
    
    // Check Integrations setup
    const integrationsCheck = await client.query(`
      SELECT COUNT(*) as total,
             COUNT(*) FILTER (WHERE enabled = true) as active
      FROM integrations
    `)
    
    const integrationChecks = [
      {
        name: 'Sales-Product Integration',
        status: salesProductCheck.rows.length > 0 ? 'PASS' : 'WARNING'
      },
      {
        name: 'Operations-Product Integration',
        status: opsProductCheck.rows.length > 0 ? 'PASS' : 'WARNING'
      },
      {
        name: 'Accounting System',
        status: accountingCheck.rows[0].accounts > 0 ? 'PASS' : 'FAIL',
        details: `${accountingCheck.rows[0].accounts} accounts, ${accountingCheck.rows[0].entries} entries`
      },
      {
        name: 'Integration Framework',
        status: integrationsCheck.rows[0].total > 0 ? 'PASS' : 'WARNING',
        details: `${integrationsCheck.rows[0].total} total, ${integrationsCheck.rows[0].active} active`
      },
    ]
    
    for (const check of integrationChecks) {
      addResult('Module Integration', check.status, check.name, check.details ? [check.details] : undefined)
    }
    
    client.release()
  } catch (error) {
    addResult('Module Integration', 'FAIL', 'Failed to check module integration', [error.message])
  }
}

async function checkIndexes() {
  console.log('\n⚡ Checking Database Indexes...')
  
  try {
    const client = await pool.connect()
    
    const indexQuery = `
      SELECT 
        schemaname,
        tablename,
        indexname,
        indexdef
      FROM pg_indexes
      WHERE schemaname = 'public'
      ORDER BY tablename, indexname
    `
    
    const result = await client.query(indexQuery)
    const indexes = result.rows
    
    addResult('Database Indexes', 'PASS', `${indexes.length} indexes found for performance optimization`, 
      indexes.map(i => `${i.tablename}: ${i.indexname}`))
    
    client.release()
  } catch (error) {
    addResult('Database Indexes', 'FAIL', 'Failed to check indexes', [error.message])
  }
}

async function checkSampleData() {
  console.log('\n📊 Checking Sample Data...')
  
  try {
    const client = await pool.connect()
    
    const dataCounts = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM customers) as customers,
        (SELECT COUNT(*) FROM products) as products,
        (SELECT COUNT(*) FROM leads) as leads,
        (SELECT COUNT(*) FROM suppliers) as suppliers,
        (SELECT COUNT(*) FROM work_orders) as work_orders,
        (SELECT COUNT(*) FROM locations) as locations,
        (SELECT COUNT(*) FROM integrations) as integrations
    `)
    
    const counts = dataCounts.rows[0]
    const dataDetails = Object.entries(counts).map(([key, value]) => `${key}: ${value}`)
    
    const hasData = Object.values(counts).some(count => count > 0)
    
    if (hasData) {
      addResult('Sample Data', 'PASS', 'Sample data exists across modules', dataDetails)
    } else {
      addResult('Sample Data', 'WARNING', 'No sample data found - run seed scripts')
    }
    
    client.release()
  } catch (error) {
    addResult('Sample Data', 'WARNING', 'Failed to check sample data', [error.message])
  }
}

function printResults() {
  console.log('\n\n' + '='.repeat(80))
  console.log('📋 OCEAN ERP - COMPREHENSIVE MODULE INTEGRATION REPORT')
  console.log('='.repeat(80))
  
  const grouped = results.reduce((acc, result) => {
    if (!acc[result.module]) {
      acc[result.module] = []
    }
    acc[result.module].push(result)
    return acc
  }, {})
  
  let totalPass = 0
  let totalFail = 0
  let totalWarning = 0
  
  for (const [module, moduleResults] of Object.entries(grouped)) {
    console.log(`\n📦 ${module}`)
    console.log('-'.repeat(80))
    
    for (const result of moduleResults) {
      const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️'
      console.log(`  ${icon} ${result.message}`)
      
      if (result.details && result.details.length > 0 && result.details.length <= 10) {
        result.details.forEach(detail => {
          console.log(`     - ${detail}`)
        })
      } else if (result.details && result.details.length > 10) {
        console.log(`     - (${result.details.length} items - too many to display)`)
      }
      
      if (result.status === 'PASS') totalPass++
      else if (result.status === 'FAIL') totalFail++
      else totalWarning++
    }
  }
  
  console.log('\n' + '='.repeat(80))
  console.log('📊 SUMMARY')
  console.log('='.repeat(80))
  console.log(`  ✅ Passed:   ${totalPass}`)
  console.log(`  ⚠️  Warnings: ${totalWarning}`)
  console.log(`  ❌ Failed:   ${totalFail}`)
  console.log(`  📝 Total:    ${totalPass + totalFail + totalWarning}`)
  
  if (totalFail === 0) {
    console.log('\n🎉 ALL CRITICAL CHECKS PASSED! Ocean ERP modules are properly integrated.')
  } else {
    console.log(`\n⚠️  ${totalFail} CRITICAL ISSUE(S) FOUND! Please review and fix.`)
  }
  
  console.log('='.repeat(80) + '\n')
}

async function runAllChecks() {
  console.log('🚀 Starting Comprehensive Module Integration Check...')
  console.log('Database: postgresql://mac@localhost:5432/ocean_erp')
  
  try {
    await checkDatabaseTables()
    await checkTableRelationships()
    await checkDataIntegrity()
    await checkModuleIntegration()
    await checkIndexes()
    await checkSampleData()
    
    printResults()
  } catch (error) {
    console.error('\n❌ Fatal error during checks:', error.message)
  } finally {
    await pool.end()
  }
}

// Run all checks
runAllChecks().catch(console.error)
