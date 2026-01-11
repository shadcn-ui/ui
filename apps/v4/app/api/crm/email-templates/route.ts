import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://mac@localhost:5432/ocean-erp',
});

/**
 * GET /api/crm/email-templates
 * List email templates
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const campaignTypeId = searchParams.get('campaign_type_id');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    let whereConditions = ['t.is_active = true', 't.is_variant = false'];
    const values: any[] = [];
    let valueIndex = 1;

    if (category) {
      whereConditions.push(`t.category = $${valueIndex}`);
      values.push(category);
      valueIndex++;
    }

    if (campaignTypeId) {
      whereConditions.push(`t.campaign_type_id = $${valueIndex}`);
      values.push(parseInt(campaignTypeId));
      valueIndex++;
    }

    if (search) {
      whereConditions.push(`(
        t.template_name ILIKE $${valueIndex} OR
        t.subject_line ILIKE $${valueIndex} OR
        t.template_code ILIKE $${valueIndex}
      )`);
      values.push(`%${search}%`);
      valueIndex++;
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    // Get templates
    values.push(limit, offset);
    const query = `
      SELECT 
        t.*,
        ct.type_name as campaign_type_name,
        CASE 
          WHEN t.sent_count > 0 THEN ROUND((t.open_count::numeric / t.sent_count * 100), 2)
          ELSE 0
        END as open_rate,
        CASE 
          WHEN t.open_count > 0 THEN ROUND((t.click_count::numeric / t.open_count * 100), 2)
          ELSE 0
        END as click_through_rate,
        (SELECT COUNT(*) FROM crm_email_templates WHERE parent_template_id = t.template_id) as variant_count
      FROM crm_email_templates t
      LEFT JOIN crm_campaign_types ct ON t.campaign_type_id = ct.campaign_type_id
      ${whereClause}
      ORDER BY t.created_at DESC
      LIMIT $${valueIndex} OFFSET $${valueIndex + 1}
    `;

    const result = await pool.query(query, values);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM crm_email_templates t
      ${whereClause}
    `;
    const countResult = await pool.query(countQuery, values.slice(0, -2));
    const total = parseInt(countResult.rows[0].total);

    return NextResponse.json({
      templates: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching email templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email templates' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/crm/email-templates
 * Create email template
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      template_name,
      subject_line,
      from_name,
      from_email,
      reply_to_email,
      html_content,
      plain_text_content,
      merge_fields = [],
      category,
      campaign_type_id,
      is_variant = false,
      parent_template_id,
      variant_name,
    } = body;

    if (!template_name || !subject_line) {
      return NextResponse.json(
        { error: 'Missing required fields: template_name, subject_line' },
        { status: 400 }
      );
    }

    // Generate template code
    const codeResult = await pool.query(
      `SELECT COALESCE(MAX(CAST(SUBSTRING(template_code FROM 5) AS INTEGER)), 0) + 1 as next_number
       FROM crm_email_templates 
       WHERE template_code LIKE 'TPL-%'`
    );
    const nextNumber = codeResult.rows[0].next_number;
    const templateCode = `TPL-${String(nextNumber).padStart(6, '0')}`;

    // Insert template
    const insertQuery = `
      INSERT INTO crm_email_templates (
        template_name, template_code, subject_line, from_name, from_email,
        reply_to_email, html_content, plain_text_content, merge_fields,
        category, campaign_type_id, is_variant, parent_template_id, variant_name
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;

    const result = await pool.query(insertQuery, [
      template_name,
      templateCode,
      subject_line,
      from_name,
      from_email,
      reply_to_email,
      html_content,
      plain_text_content,
      merge_fields,
      category,
      campaign_type_id,
      is_variant,
      parent_template_id,
      variant_name,
    ]);

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating email template:', error);
    return NextResponse.json(
      { error: 'Failed to create email template' },
      { status: 500 }
    );
  }
}
