import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * POST /api/analytics/reports/[id]/generate
 * Generate a report with the given parameters
 * 
 * Request body:
 * - parameters: Object with report-specific parameters
 * - output_format: Override default format (pdf, excel, csv, html, json)
 * - save_file: Whether to save the output file (default true)
 */
export async function POST(
  request: Request,
  context: RouteContext
) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { id } = await context.params;
    const body = await request.json();
    const {
      parameters = {},
      output_format,
      save_file = true,
      executed_by
    } = body;

    // Get report template
    const templateQuery = 'SELECT * FROM report_templates WHERE id = $1 AND is_active = true';
    const templateResult = await client.query(templateQuery, [id]);

    if (templateResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Report template not found or inactive' },
        { status: 404 }
      );
    }

    const template = templateResult.rows[0];
    const format = output_format || template.report_format;

    // Create execution record
    const executionQuery = `
      INSERT INTO report_executions (
        report_template_id, execution_type, parameters_used,
        output_format, started_at, status, executed_by
      ) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, $5, $6)
      RETURNING *
    `;

    const executionResult = await client.query(executionQuery, [
      id,
      'manual',
      JSON.stringify(parameters),
      format,
      'running',
      executed_by || null
    ]);

    const execution = executionResult.rows[0];

    try {
      // Build and execute query with parameters
      let query = template.query_sql;
      
      // Replace parameter placeholders
      for (const [key, value] of Object.entries(parameters)) {
        const placeholder = new RegExp(`:${key}`, 'g');
        const safeValue = typeof value === 'string' ? `'${value}'` : value;
        query = query.replace(placeholder, String(safeValue));
      }

      const startTime = Date.now();
      const dataResult = await client.query(query);
      const endTime = Date.now();
      const duration = Math.floor((endTime - startTime) / 1000);

      // Simulate file generation (in production, would generate actual PDF/Excel)
      const output_file_url = save_file 
        ? `/reports/${template.report_code}_${execution.id}.${format}`
        : null;
      
      const output_file_size = dataResult.rows.length * 100; // Approximate size

      // Update execution record
      const updateQuery = `
        UPDATE report_executions
        SET 
          completed_at = CURRENT_TIMESTAMP,
          duration_seconds = $1,
          status = $2,
          output_file_url = $3,
          output_file_size_bytes = $4,
          rows_returned = $5
        WHERE id = $6
        RETURNING *
      `;

      const updatedResult = await client.query(updateQuery, [
        duration,
        'completed',
        output_file_url,
        output_file_size,
        dataResult.rows.length,
        execution.id
      ]);

      await client.query('COMMIT');

      return NextResponse.json({
        success: true,
        message: 'Report generated successfully',
        execution: updatedResult.rows[0],
        data: dataResult.rows,
        summary: {
          rows_returned: dataResult.rows.length,
          duration_seconds: duration,
          output_format: format,
          output_file_url: output_file_url
        }
      });

    } catch (queryError: any) {
      // Update execution with error
      await client.query(
        `UPDATE report_executions 
         SET completed_at = CURRENT_TIMESTAMP, status = $1, error_message = $2
         WHERE id = $3`,
        ['failed', queryError.message, execution.id]
      );

      await client.query('COMMIT');

      return NextResponse.json(
        { 
          success: false, 
          error: 'Report generation failed: ' + queryError.message,
          execution_id: execution.id
        },
        { status: 500 }
      );
    }

  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error generating report:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

/**
 * GET /api/analytics/reports/[id]/generate
 * Get report preview (executes query without saving)
 */
export async function GET(
  request: Request,
  context: RouteContext
) {
  const client = await pool.connect();
  
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    
    // Parse parameters from query string
    const parameters: any = {};
    searchParams.forEach((value, key) => {
      if (key !== 'limit') {
        parameters[key] = value;
      }
    });
    
    const limit = parseInt(searchParams.get('limit') || '100');

    // Get report template
    const templateQuery = 'SELECT * FROM report_templates WHERE id = $1 AND is_active = true';
    const templateResult = await client.query(templateQuery, [id]);

    if (templateResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Report template not found or inactive' },
        { status: 404 }
      );
    }

    const template = templateResult.rows[0];

    // Build query with parameters
    let query = template.query_sql;
    
    for (const [key, value] of Object.entries(parameters)) {
      const placeholder = new RegExp(`:${key}`, 'g');
      const safeValue = typeof value === 'string' ? `'${value}'` : value;
      query = query.replace(placeholder, String(safeValue));
    }

    // Add LIMIT for preview
    if (!query.toLowerCase().includes('limit')) {
      query += ` LIMIT ${limit}`;
    }

    const startTime = Date.now();
    const result = await client.query(query);
    const endTime = Date.now();

    return NextResponse.json({
      success: true,
      report: {
        id: template.id,
        report_name: template.report_name,
        report_category: template.report_category
      },
      preview: true,
      data: result.rows,
      summary: {
        rows_returned: result.rows.length,
        execution_time_ms: endTime - startTime,
        parameters_used: parameters
      }
    });

  } catch (error: any) {
    console.error('Error generating report preview:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
