import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

/**
 * @swagger
 * /api/analytics/warehouse/etl/jobs:
 *   get:
 *     summary: Get ETL job execution history
 *     tags: [Data Warehouse]
 *     parameters:
 *       - in: query
 *         name: job_name
 *         schema:
 *           type: string
 *         description: Filter by job name
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [running, completed, failed, partial]
 *       - in: query
 *         name: job_type
 *         schema:
 *           type: string
 *           enum: [dimension, fact, aggregate]
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: ETL job history
 */
interface ETLJob {
  job_log_id: number;
  job_name: string;
  job_type: string;
  start_time: string;
  end_time: string | null;
  duration_seconds: number | null;
  status: string;
  error_message: string | null;
  rows_extracted: number | null;
  rows_inserted: number | null;
  rows_updated: number | null;
  rows_deleted: number | null;
  rows_rejected: number | null;
  source_system: string | null;
  executed_by: string | null;
  created_at: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const job_name = searchParams.get('job_name');
    const status = searchParams.get('status');
    const job_type = searchParams.get('job_type');
    const limit = parseInt(searchParams.get('limit') || '50');

    let sqlQuery = `
      SELECT 
        job_log_id,
        job_name,
        job_type,
        start_time,
        end_time,
        duration_seconds,
        status,
        error_message,
        rows_extracted,
        rows_inserted,
        rows_updated,
        rows_deleted,
        rows_rejected,
        source_system,
        executed_by,
        created_at
      FROM etl_job_log
      WHERE 1=1
    `;

    const params: (string | number)[] = [];
    let paramIndex = 1;

    if (job_name) {
      sqlQuery += ` AND job_name = $${paramIndex}`;
      params.push(job_name);
      paramIndex++;
    }
    if (status) {
      sqlQuery += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }
    if (job_type) {
      sqlQuery += ` AND job_type = $${paramIndex}`;
      params.push(job_type);
      paramIndex++;
    }

    sqlQuery += ` ORDER BY start_time DESC LIMIT $${paramIndex}`;
    params.push(limit);

    const result = await query(sqlQuery, params);
    const jobs = result.rows as ETLJob[];

    // Calculate summary statistics
    const summary = {
      total_jobs: jobs.length,
      completed: jobs.filter((j: ETLJob) => j.status === 'completed').length,
      failed: jobs.filter((j: ETLJob) => j.status === 'failed').length,
      running: jobs.filter((j: ETLJob) => j.status === 'running').length,
      avg_duration_seconds: jobs.length > 0 
        ? jobs.reduce((sum: number, j: ETLJob) => sum + (j.duration_seconds || 0), 0) / jobs.length 
        : 0,
      total_rows_processed: jobs.reduce((sum: number, j: ETLJob) => 
        sum + (j.rows_inserted || 0) + (j.rows_updated || 0), 0)
    };

    return NextResponse.json({
      jobs,
      summary,
      total: jobs.length
    });

  } catch (error) {
    console.error('Error in ETL jobs API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/analytics/warehouse/etl/jobs:
 *   post:
 *     summary: Trigger ETL job execution
 *     tags: [Data Warehouse]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - job_name
 *             properties:
 *               job_name:
 *                 type: string
 *                 enum: [load_dim_product, load_dim_customer, load_dim_location, load_dim_supplier, load_fact_sales, load_fact_inventory, refresh_agg_monthly_sales, run_all]
 *                 description: ETL job to execute
 *               parameters:
 *                 type: object
 *                 description: Job-specific parameters (e.g., snapshot_date for inventory)
 *               executed_by:
 *                 type: string
 *                 description: User triggering the job
 *     responses:
 *       200:
 *         description: Job execution started
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { job_name, parameters = {}, executed_by = 'api' } = body;

    if (!job_name) {
      return NextResponse.json(
        { error: 'job_name is required' },
        { status: 400 }
      );
    }

    // Map of job names to stored procedures
    const jobProcedures: Record<string, string> = {
      'load_dim_product': 'etl_load_dim_product',
      'load_dim_customer': 'etl_load_dim_customer',
      'load_dim_location': 'etl_load_dim_location',
      'load_dim_supplier': 'etl_load_dim_supplier',
      'load_fact_sales': 'etl_load_fact_sales',
      'load_fact_inventory': 'etl_load_fact_inventory',
      'refresh_agg_monthly_sales': 'etl_refresh_agg_monthly_sales',
      'run_all': 'etl_run_all'
    };

    const procedureName = jobProcedures[job_name];
    if (!procedureName) {
      return NextResponse.json(
        { error: `Invalid job_name: ${job_name}` },
        { status: 400 }
      );
    }

    // Build procedure call with parameters
    let procedureCall = `SELECT * FROM ${procedureName}(`;
    
    if (job_name === 'load_fact_inventory' && parameters.snapshot_date) {
      procedureCall += `'${parameters.snapshot_date}'::DATE`;
    }
    
    procedureCall += ')';

    // Execute the ETL procedure
    const result = await query(procedureCall);

    // Get the last job execution details
    const lastJobQuery = `
      SELECT * FROM etl_job_log
      WHERE job_name = $1
      ORDER BY start_time DESC
      LIMIT 1
    `;
    
    const lastJobResult = await query(lastJobQuery, [job_name]);
    const lastJob = lastJobResult.rows[0] as ETLJob | undefined;

    return NextResponse.json({
      message: `ETL job '${job_name}' executed successfully`,
      job_log_id: lastJob?.job_log_id,
      status: lastJob?.status,
      rows_inserted: lastJob?.rows_inserted,
      rows_updated: lastJob?.rows_updated,
      duration_seconds: lastJob?.duration_seconds,
      result: result || lastJob
    });

  } catch (error) {
    console.error('Error in ETL job execution API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
