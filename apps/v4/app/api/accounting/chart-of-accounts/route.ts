import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// GET /api/accounting/chart-of-accounts - List all accounts with optional filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const accountType = searchParams.get('type')
    const isActive = searchParams.get('active')
    const search = searchParams.get('search')

    let sql = `
      SELECT 
        coa.*,
        parent.account_name as parent_account_name,
        (
          SELECT COUNT(*) 
          FROM chart_of_accounts child 
          WHERE child.parent_account_id = coa.id
        ) as child_count
      FROM chart_of_accounts coa
      LEFT JOIN chart_of_accounts parent ON coa.parent_account_id = parent.id
      WHERE 1=1
    `
    
    const params: any[] = []
    let paramIndex = 1

    if (accountType) {
      sql += ` AND coa.account_type = $${paramIndex}`
      params.push(accountType)
      paramIndex++
    }

    if (isActive !== null && isActive !== undefined) {
      sql += ` AND coa.is_active = $${paramIndex}`
      params.push(isActive === 'true')
      paramIndex++
    }

    if (search) {
      sql += ` AND (
        coa.account_code ILIKE $${paramIndex} OR 
        coa.account_name ILIKE $${paramIndex} OR 
        coa.description ILIKE $${paramIndex}
      )`
      params.push(`%${search}%`)
      paramIndex++
    }

    sql += ` ORDER BY coa.account_code`

    const result = await query(sql, params)

    // Calculate summary statistics
    const stats = await query(`
      SELECT 
        COUNT(*) as total_accounts,
        COUNT(*) FILTER (WHERE is_active = true) as active_accounts,
        COUNT(*) FILTER (WHERE account_type = 'Asset') as asset_accounts,
        COUNT(*) FILTER (WHERE account_type = 'Liability') as liability_accounts,
        COUNT(*) FILTER (WHERE account_type = 'Equity') as equity_accounts,
        COUNT(*) FILTER (WHERE account_type = 'Revenue') as revenue_accounts,
        COUNT(*) FILTER (WHERE account_type = 'Expense') as expense_accounts,
        SUM(CASE WHEN account_type = 'Asset' THEN current_balance ELSE 0 END) as total_assets,
        SUM(CASE WHEN account_type = 'Liability' THEN current_balance ELSE 0 END) as total_liabilities,
        SUM(CASE WHEN account_type = 'Equity' THEN current_balance ELSE 0 END) as total_equity
      FROM chart_of_accounts
    `)

    return NextResponse.json({
      success: true,
      accounts: result.rows,
      stats: stats.rows[0]
    })

  } catch (error) {
    console.error('Error fetching chart of accounts:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch chart of accounts' },
      { status: 500 }
    )
  }
}

// POST /api/accounting/chart-of-accounts - Create new account
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      account_code,
      account_name,
      account_type,
      account_subtype,
      parent_account_id,
      description,
      is_active = true,
      currency = 'IDR',
      opening_balance = 0
    } = body

    // Validate required fields
    if (!account_code || !account_name || !account_type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: account_code, account_name, account_type' },
        { status: 400 }
      )
    }

    // Check if account code already exists
    const existingAccount = await query(
      'SELECT id FROM chart_of_accounts WHERE account_code = $1',
      [account_code]
    )

    if (existingAccount.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Account code already exists' },
        { status: 409 }
      )
    }

    const result = await query(`
      INSERT INTO chart_of_accounts (
        account_code, account_name, account_type, account_subtype,
        parent_account_id, description, is_active, currency,
        opening_balance, current_balance
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $9)
      RETURNING *
    `, [
      account_code,
      account_name,
      account_type,
      account_subtype,
      parent_account_id || null,
      description,
      is_active,
      currency,
      opening_balance
    ])

    return NextResponse.json({
      success: true,
      account: result.rows[0],
      message: 'Account created successfully'
    }, { status: 201 })

  } catch (error: any) {
    console.error('Error creating account:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create account',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
