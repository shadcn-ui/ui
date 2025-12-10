import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// GET /api/accounting/journal-entries - List all journal entries
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    // `type` param is not supported by the current schema (no `entry_type` column)
    const type = searchParams.get('type')
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    const search = searchParams.get('search')

    let sql = `
      SELECT 
        je.*,
        u1.first_name || ' ' || u1.last_name as created_by_name,
        u2.first_name || ' ' || u2.last_name as posted_by_name,
        (
          SELECT COUNT(*) 
          FROM journal_entry_lines 
          WHERE journal_entry_id = je.id
        ) as line_count
      FROM journal_entries je
      LEFT JOIN users u1 ON je.created_by = u1.id
      LEFT JOIN users u2 ON je.posted_by = u2.id
      WHERE 1=1
    `
    
    const params: any[] = []
    let paramIndex = 1

    if (status) {
      sql += ` AND je.status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }

    // ignore `type` filter because `journal_entries` has no `entry_type` column

    if (startDate) {
      sql += ` AND je.entry_date >= $${paramIndex}`
      params.push(startDate)
      paramIndex++
    }

    if (endDate) {
      sql += ` AND je.entry_date <= $${paramIndex}`
      params.push(endDate)
      paramIndex++
    }

    if (search) {
      sql += ` AND (
        je.entry_number ILIKE $${paramIndex} OR 
        je.reference ILIKE $${paramIndex} OR 
        je.description ILIKE $${paramIndex}
      )`
      params.push(`%${search}%`)
      paramIndex++
    }

    sql += ` ORDER BY je.entry_date DESC, je.id DESC`

    const result = await query(sql, params)

    // Get statistics
    const stats = await query(`
      SELECT 
        COUNT(*) as total_entries,
        COUNT(*) FILTER (WHERE status = 'Draft') as draft_entries,
        COUNT(*) FILTER (WHERE status = 'Posted') as posted_entries,
        SUM(CASE WHEN status = 'Posted' THEN total_debit ELSE 0 END) as total_posted_amount
      FROM journal_entries
    `)

    return NextResponse.json({
      success: true,
      entries: result.rows,
      stats: stats.rows[0]
    })

  } catch (error) {
    console.error('Error fetching journal entries:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch journal entries' },
      { status: 500 }
    )
  }
}

// POST /api/accounting/journal-entries - Create new journal entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      entry_date,
      // entry_type is not used by current schema
      reference: reference_number,
      description,
      lines,
      created_by
    } = body

    // Validate required fields
    if (!entry_date || !lines || lines.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: entry_date, lines' },
        { status: 400 }
      )
    }

    // Validate that debits equal credits
    const totalDebit = lines.reduce((sum: number, line: any) => sum + (parseFloat(line.debit_amount) || 0), 0)
    const totalCredit = lines.reduce((sum: number, line: any) => sum + (parseFloat(line.credit_amount) || 0), 0)

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Journal entry is unbalanced',
          details: `Total debits (${totalDebit}) must equal total credits (${totalCredit})`
        },
        { status: 400 }
      )
    }

    // Generate entry number
    const entryNumberResult = await query(`
      SELECT COALESCE(MAX(CAST(SUBSTRING(entry_number FROM 9) AS INTEGER)), 0) + 1 as next_number
      FROM journal_entries
      WHERE entry_number LIKE 'JE-2025-%'
    `)
    const nextNumber = entryNumberResult.rows[0].next_number
    const entry_number = `JE-2025-${String(nextNumber).padStart(3, '0')}`

    // Create journal entry
    const entryResult = await query(`
      INSERT INTO journal_entries (
        entry_number, entry_date, description, reference,
        status, total_debit, total_credit, created_by
      ) VALUES ($1, $2, $3, $4, 'Draft', $5, $6, $7)
      RETURNING *
    `, [
      entry_number,
      entry_date,
      description,
      reference_number || null,
      totalDebit,
      totalCredit,
      created_by || null
    ])

    const entryId = entryResult.rows[0].id

    // Create journal entry lines
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      await query(`
        INSERT INTO journal_entry_lines (
          journal_entry_id, account_id, description,
          debit_amount, credit_amount
        ) VALUES ($1, $2, $3, $4, $5)
      `, [
        entryId,
        line.account_id,
        line.description || null,
        parseFloat(line.debit_amount) || 0,
        parseFloat(line.credit_amount) || 0
      ])
    }

    // Get complete entry with lines
    const completeEntry = await query(`
      SELECT 
        je.*,
        json_agg(
            json_build_object(
              'id', jel.id,
              'account_id', jel.account_id,
              'account_number', coa.account_number,
              'account_name', coa.account_name,
              'description', jel.description,
              'debit_amount', jel.debit_amount,
              'credit_amount', jel.credit_amount
            ) ORDER BY jel.created_at
          ) as lines
      FROM journal_entries je
      LEFT JOIN journal_entry_lines jel ON je.id = jel.journal_entry_id
        LEFT JOIN accounts coa ON jel.account_id = coa.id
      WHERE je.id = $1
      GROUP BY je.id
    `, [entryId])

    return NextResponse.json({
      success: true,
      entry: completeEntry.rows[0],
      message: 'Journal entry created successfully'
    }, { status: 201 })

  } catch (error: any) {
    console.error('Error creating journal entry:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create journal entry',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
