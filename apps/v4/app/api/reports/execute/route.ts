import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// POST /api/reports/execute - Execute a report with parameters
export async function POST(request: NextRequest) {
  const client = await pool.connect();

  try {
    const body = await request.json();
    const { report_id, parameters, output_format, executed_by } = body;

    if (!report_id) {
      return NextResponse.json(
        { success: false, error: "report_id is required" },
        { status: 400 }
      );
    }

    const startTime = Date.now();

    // Get report definition
    const reportResult = await client.query(
      `SELECT * FROM report_definitions WHERE id = $1`,
      [report_id]
    );

    if (reportResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Report not found" },
        { status: 404 }
      );
    }

    const report = reportResult.rows[0];
    const queryConfig = report.query_config;

    // Build dynamic query based on configuration
    let sqlQuery = `SELECT `;
    
    // Columns
    if (queryConfig.columns && queryConfig.columns.length > 0) {
      sqlQuery += queryConfig.columns.join(', ');
    } else {
      sqlQuery += '*';
    }

    sqlQuery += ` FROM ${report.data_source} WHERE 1=1`;

    // Apply filters
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (queryConfig.filters && queryConfig.filters.length > 0) {
      for (const filter of queryConfig.filters) {
        // Handle parameter substitution
        if (parameters && parameters[filter.field]) {
          sqlQuery += ` AND ${filter.field} ${filter.operator || '='} $${paramIndex}`;
          queryParams.push(parameters[filter.field]);
          paramIndex++;
        } else if (filter.value) {
          // Static filter value
          sqlQuery += ` AND ${filter.field} ${filter.operator || '='} $${paramIndex}`;
          queryParams.push(filter.value);
          paramIndex++;
        }
      }
    }

    // Apply date range if provided in parameters
    if (parameters) {
      if (parameters.start_date && !queryParams.includes(parameters.start_date)) {
        sqlQuery += ` AND created_at >= $${paramIndex}`;
        queryParams.push(parameters.start_date);
        paramIndex++;
      }
      if (parameters.end_date) {
        sqlQuery += ` AND created_at <= $${paramIndex}`;
        queryParams.push(parameters.end_date);
        paramIndex++;
      }
    }

    // Group By
    if (queryConfig.groupBy && queryConfig.groupBy.length > 0) {
      sqlQuery += ` GROUP BY ${queryConfig.groupBy.join(', ')}`;
    }

    // Order By
    if (queryConfig.orderBy && queryConfig.orderBy.length > 0) {
      const orderClauses = queryConfig.orderBy.map((order: any) => 
        `${order.field} ${order.direction || 'ASC'}`
      );
      sqlQuery += ` ORDER BY ${orderClauses.join(', ')}`;
    }

    // Limit
    if (queryConfig.limit) {
      sqlQuery += ` LIMIT ${queryConfig.limit}`;
    }

    console.log("Executing query:", sqlQuery, "with params:", queryParams);

    // Execute query
    const dataResult = await client.query(sqlQuery, queryParams);
    const executionTime = Date.now() - startTime;

    // Log execution
    await client.query(
      `INSERT INTO report_executions (
        report_id, executed_by, parameters, execution_time_ms, 
        row_count, output_format, status
      ) VALUES ($1, $2, $3, $4, $5, $6, 'success')
      RETURNING id`,
      [
        report_id,
        executed_by || null,
        parameters ? JSON.stringify(parameters) : null,
        executionTime,
        dataResult.rows.length,
        output_format || 'json',
      ]
    );

    return NextResponse.json({
      success: true,
      report: {
        id: report.id,
        name: report.name,
        category: report.category,
        report_type: report.report_type,
      },
      data: dataResult.rows,
      metadata: {
        row_count: dataResult.rows.length,
        execution_time_ms: executionTime,
        parameters: parameters || {},
        chart_config: report.chart_config,
      },
    });

  } catch (error: any) {
    console.error("Error executing report:", error);

    // Log failed execution
    try {
      await client.query(
        `INSERT INTO report_executions (
          report_id, executed_by, parameters, status, error_message
        ) VALUES ($1, $2, $3, 'failed', $4)`,
        [
          request.body?.report_id,
          request.body?.executed_by || null,
          request.body?.parameters ? JSON.stringify(request.body.parameters) : null,
          error.message,
        ]
      );
    } catch (logError) {
      console.error("Error logging failed execution:", logError);
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
