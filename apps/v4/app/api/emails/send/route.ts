import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// POST /api/emails/send - Queue an email for sending
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      to_email,
      to_name,
      template_code,
      template_variables,
      subject,
      body_html,
      body_text,
      priority = 'normal',
      scheduled_at
    } = body;

    if (!to_email) {
      return NextResponse.json(
        { error: 'to_email is required' },
        { status: 400 }
      );
    }

    let finalSubject = subject;
    let finalBodyHtml = body_html;
    let finalBodyText = body_text;

    // If template_code is provided, load template and render with variables
    if (template_code) {
      const templateResult = await query(
        `SELECT * FROM email_templates WHERE code = $1`,
        [template_code]
      );

      if (templateResult.rows.length === 0) {
        return NextResponse.json(
          { error: 'Email template not found' },
          { status: 404 }
        );
      }

      const template = templateResult.rows[0];
      const variables = template_variables || {};

      // Simple variable replacement ({{variable_name}})
      finalSubject = renderTemplate(template.subject, variables);
      finalBodyHtml = renderTemplate(template.body_html, variables);
      finalBodyText = template.body_text ? renderTemplate(template.body_text, variables) : null;
    }

    // Validate that we have subject and body
    if (!finalSubject || !finalBodyHtml) {
      return NextResponse.json(
        { error: 'Either provide template_code or both subject and body_html' },
        { status: 400 }
      );
    }

    // Queue the email
    const result = await query(
      `INSERT INTO email_queue
      (to_email, to_name, subject, body_html, body_text, priority, status, scheduled_at)
      VALUES ($1, $2, $3, $4, $5, $6, 'pending', $7)
      RETURNING *`,
      [
        to_email,
        to_name,
        finalSubject,
        finalBodyHtml,
        finalBodyText,
        priority,
        scheduled_at || null
      ]
    );

    return NextResponse.json({
      success: true,
      email: result.rows[0],
      message: 'Email queued successfully'
    });

  } catch (error: any) {
    console.error('Error queueing email:', error);
    return NextResponse.json(
      { error: 'Failed to queue email', details: error.message },
      { status: 500 }
    );
  }
}

// Simple template rendering function
function renderTemplate(template: string, variables: Record<string, any>): string {
  let rendered = template;

  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    rendered = rendered.replace(regex, String(value));
  }

  return rendered;
}

// GET /api/emails/send - Get email queue status
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    let sql = `SELECT * FROM email_queue WHERE 1=1`;
    const params: any[] = [];

    if (status) {
      sql += ` AND status = $1`;
      params.push(status);
    }

    sql += ` ORDER BY priority DESC, scheduled_at ASC, created_at ASC LIMIT $${params.length + 1}`;
    params.push(limit);

    const result = await query(sql, params);

    return NextResponse.json({
      emails: result.rows,
      count: result.rows.length
    });

  } catch (error: any) {
    console.error('Error fetching email queue:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email queue', details: error.message },
      { status: 500 }
    );
  }
}
