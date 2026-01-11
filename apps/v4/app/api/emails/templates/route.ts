import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/emails/templates - Get all email templates
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    let sql = `SELECT * FROM email_templates WHERE 1=1`;
    const params: any[] = [];

    if (code) {
      sql += ` AND code = $1`;
      params.push(code);
    }

    sql += ` ORDER BY name ASC`;

    const result = await query(sql, params);

    return NextResponse.json({
      templates: result.rows,
      count: result.rows.length
    });

  } catch (error: any) {
    console.error('Error fetching email templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email templates', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/emails/templates - Create new email template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, name, subject, body_html, body_text, variables } = body;

    if (!code || !name || !subject || !body_html) {
      return NextResponse.json(
        { error: 'code, name, subject, and body_html are required' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO email_templates (code, name, subject, body_html, body_text, variables)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [code, name, subject, body_html, body_text, variables ? JSON.stringify(variables) : null]
    );

    return NextResponse.json({
      success: true,
      template: result.rows[0]
    });

  } catch (error: any) {
    console.error('Error creating email template:', error);
    return NextResponse.json(
      { error: 'Failed to create email template', details: error.message },
      { status: 500 }
    );
  }
}
