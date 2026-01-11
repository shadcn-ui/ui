import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * GET /api/analytics/reports/[id]/schedule
 * Get all schedules for a report
 */
export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const query = `
      SELECT 
        rs.*,
        rt.report_name,
        rt.report_category
      FROM report_schedules rs
      JOIN report_templates rt ON rs.report_template_id = rt.id
      WHERE rs.report_template_id = $1
      ORDER BY rs.created_at DESC
    `;

    const result = await pool.query(query, [id]);

    return NextResponse.json({
      success: true,
      count: result.rows.length,
      schedules: result.rows
    });

  } catch (error: any) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/analytics/reports/[id]/schedule
 * Create a new schedule for a report
 * 
 * Request body:
 * - schedule_name: Name of the schedule
 * - schedule_frequency: daily, weekly, monthly, quarterly, yearly, custom_cron
 * - cron_expression: For custom schedules (optional)
 * - schedule_time: Time of day to run (HH:MM format)
 * - schedule_day_of_week: 0-6 for weekly (Sunday-Saturday)
 * - schedule_day_of_month: 1-31 for monthly
 * - parameters: Report parameters
 * - output_format: pdf, excel, csv, html, json
 * - email_recipients: Array of email addresses
 * - email_subject: Email subject
 * - email_body: Email body
 */
export async function POST(
  request: Request,
  context: RouteContext
) {
  const client = await pool.connect();
  
  try {
    const { id } = await context.params;
    const body = await request.json();
    const {
      schedule_name,
      schedule_frequency,
      cron_expression,
      schedule_time,
      schedule_day_of_week,
      schedule_day_of_month,
      parameters = {},
      output_format = 'pdf',
      email_recipients = [],
      email_subject,
      email_body,
      created_by
    } = body;

    // Validate required fields
    if (!schedule_name || !schedule_frequency) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: schedule_name, schedule_frequency' },
        { status: 400 }
      );
    }

    // Check if report exists
    const reportCheck = await client.query(
      'SELECT id FROM report_templates WHERE id = $1',
      [id]
    );

    if (reportCheck.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Report template not found' },
        { status: 404 }
      );
    }

    // Calculate next run time
    const next_run_at = calculateNextRunTime(
      schedule_frequency,
      schedule_time,
      schedule_day_of_week,
      schedule_day_of_month,
      cron_expression
    );

    const insertQuery = `
      INSERT INTO report_schedules (
        report_template_id, schedule_name, schedule_frequency,
        cron_expression, schedule_time, schedule_day_of_week,
        schedule_day_of_month, parameters, output_format,
        email_recipients, email_subject, email_body,
        next_run_at, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;

    const result = await client.query(insertQuery, [
      id, schedule_name, schedule_frequency,
      cron_expression, schedule_time, schedule_day_of_week,
      schedule_day_of_month, JSON.stringify(parameters), output_format,
      email_recipients, email_subject, email_body,
      next_run_at, created_by
    ]);

    return NextResponse.json({
      success: true,
      message: 'Report schedule created successfully',
      schedule: result.rows[0]
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating schedule:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

/**
 * Helper function to calculate next run time
 */
function calculateNextRunTime(
  frequency: string,
  time?: string,
  dayOfWeek?: number,
  dayOfMonth?: number,
  cronExpression?: string
): Date {
  const now = new Date();
  const nextRun = new Date();

  // Parse time (HH:MM)
  if (time) {
    const [hours, minutes] = time.split(':').map(Number);
    nextRun.setHours(hours, minutes, 0, 0);
  } else {
    nextRun.setHours(0, 0, 0, 0);
  }

  switch (frequency) {
    case 'daily':
      // If time has passed today, schedule for tomorrow
      if (nextRun <= now) {
        nextRun.setDate(nextRun.getDate() + 1);
      }
      break;

    case 'weekly':
      // Schedule for next occurrence of dayOfWeek
      const currentDay = nextRun.getDay();
      const targetDay = dayOfWeek || 1; // Default to Monday
      let daysToAdd = targetDay - currentDay;
      if (daysToAdd <= 0 || (daysToAdd === 0 && nextRun <= now)) {
        daysToAdd += 7;
      }
      nextRun.setDate(nextRun.getDate() + daysToAdd);
      break;

    case 'monthly':
      // Schedule for next occurrence of dayOfMonth
      const targetDate = dayOfMonth || 1;
      nextRun.setDate(targetDate);
      if (nextRun <= now) {
        nextRun.setMonth(nextRun.getMonth() + 1);
      }
      break;

    case 'quarterly':
      // Schedule for first day of next quarter
      const currentMonth = nextRun.getMonth();
      const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
      nextRun.setMonth(quarterStartMonth + 3, 1);
      break;

    case 'yearly':
      // Schedule for January 1st of next year
      nextRun.setFullYear(nextRun.getFullYear() + 1, 0, 1);
      break;

    case 'custom_cron':
      // For cron expressions, default to next hour
      // (In production, use a proper cron parser)
      nextRun.setHours(nextRun.getHours() + 1);
      break;

    default:
      // Default to tomorrow
      nextRun.setDate(nextRun.getDate() + 1);
  }

  return nextRun;
}
