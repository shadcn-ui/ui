import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface DataQualityCheck {
  quality_check_id: number;
  job_log_id: number | null;
  check_name: string;
  check_type: string;
  table_name: string;
  column_name: string | null;
  check_status: string;
  records_checked: number | null;
  records_failed: number | null;
  failure_percentage: number | null;
  check_query: string | null;
  error_details: string | null;
  sample_failed_records: any | null;
  checked_at: string;
}

/**
 * @swagger
 * /api/analytics/warehouse/etl/quality:
 *   get:
 *     summary: Get data quality check results
 *     tags: [Data Warehouse]
 *     parameters:
 *       - in: query
 *         name: table_name
 *         schema:
 *           type: string
 *       - in: query
 *         name: check_status
 *         schema:
 *           type: string
 *           enum: [passed, failed, warning]
 *       - in: query
 *         name: check_type
 *         schema:
 *           type: string
 *           enum: [null_check, duplicate_check, referential_integrity, range_check, format_check]
 *     responses:
 *       200:
 *         description: Data quality check results
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const table_name = searchParams.get('table_name');
    const check_status = searchParams.get('check_status');
    const check_type = searchParams.get('check_type');
    const limit = parseInt(searchParams.get('limit') || '100');

    let sqlQuery = `
      SELECT 
        quality_check_id,
        job_log_id,
        check_name,
        check_type,
        table_name,
        column_name,
        check_status,
        records_checked,
        records_failed,
        failure_percentage,
        check_query,
        error_details,
        sample_failed_records,
        checked_at
      FROM etl_data_quality
      WHERE 1=1
    `;

    const params: (string | number)[] = [];
    let paramIndex = 1;

    if (table_name) {
      sqlQuery += ` AND table_name = $${paramIndex}`;
      params.push(table_name);
      paramIndex++;
    }
    if (check_status) {
      sqlQuery += ` AND check_status = $${paramIndex}`;
      params.push(check_status);
      paramIndex++;
    }
    if (check_type) {
      sqlQuery += ` AND check_type = $${paramIndex}`;
      params.push(check_type);
      paramIndex++;
    }

    sqlQuery += ` ORDER BY checked_at DESC LIMIT $${paramIndex}`;
    params.push(limit);

    const result = await query(sqlQuery, params);
    const checks = result.rows as DataQualityCheck[];

    // Get dashboard summary
    const summaryQuery = `
      SELECT 
        table_name,
        check_type,
        COUNT(*) as total_checks,
        COUNT(*) FILTER (WHERE check_status = 'passed') as passed_checks,
        COUNT(*) FILTER (WHERE check_status = 'failed') as failed_checks,
        COUNT(*) FILTER (WHERE check_status = 'warning') as warning_checks,
        AVG(failure_percentage) as avg_failure_rate,
        MAX(checked_at) as last_checked_at
      FROM etl_data_quality
      WHERE checked_at >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY table_name, check_type
      ORDER BY failed_checks DESC, table_name
    `;

    const summaryResult = await query(summaryQuery);

    return NextResponse.json({
      checks,
      summary: summaryResult.rows,
      total: checks.length
    });

  } catch (error) {
    console.error('Error in data quality API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/analytics/warehouse/etl/quality:
 *   post:
 *     summary: Run data quality checks
 *     tags: [Data Warehouse]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - check_type
 *               - table_name
 *             properties:
 *               check_type:
 *                 type: string
 *                 enum: [null_check, duplicate_check]
 *               table_name:
 *                 type: string
 *               column_name:
 *                 type: string
 *                 description: Required for null_check
 *               key_columns:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Required for duplicate_check
 *     responses:
 *       200:
 *         description: Quality check executed
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { check_type, table_name, column_name, key_columns } = body;

    if (!check_type || !table_name) {
      return NextResponse.json(
        { error: 'check_type and table_name are required' },
        { status: 400 }
      );
    }

    let result;

    if (check_type === 'null_check') {
      if (!column_name) {
        return NextResponse.json(
          { error: 'column_name is required for null_check' },
          { status: 400 }
        );
      }

      const checkQuery = `SELECT etl_check_nulls($1, $2)`;
      result = await query(checkQuery, [table_name, column_name]);

    } else if (check_type === 'duplicate_check') {
      if (!key_columns || !Array.isArray(key_columns)) {
        return NextResponse.json(
          { error: 'key_columns array is required for duplicate_check' },
          { status: 400 }
        );
      }

      const checkQuery = `SELECT etl_check_duplicates($1, $2)`;
      result = await query(checkQuery, [table_name, key_columns]);

    } else {
      return NextResponse.json(
        { error: `Unsupported check_type: ${check_type}` },
        { status: 400 }
      );
    }

    // Get the latest quality check result
    const latestCheckQuery = `
      SELECT * FROM etl_data_quality
      WHERE table_name = $1
        AND check_type = $2
      ORDER BY checked_at DESC
      LIMIT 1
    `;

    const latestCheckResult = await query(
      latestCheckQuery,
      [table_name, check_type]
    );
    const latestCheck = latestCheckResult.rows[0] as DataQualityCheck | undefined;

    return NextResponse.json({
      message: `Quality check '${check_type}' executed on ${table_name}`,
      check: latestCheck,
      result
    });

  } catch (error) {
    console.error('Error in data quality check API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
