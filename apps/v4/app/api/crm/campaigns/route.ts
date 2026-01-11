import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://mac@localhost:5432/ocean-erp',
});

/**
 * GET /api/crm/campaigns
 * List campaigns with filtering and performance metrics
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const typeId = searchParams.get('campaign_type_id');
    const status = searchParams.get('status');
    const ownerId = searchParams.get('owner_id');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    let whereConditions = ['c.is_active = true'];
    const values: any[] = [];
    let valueIndex = 1;

    if (typeId) {
      whereConditions.push(`c.campaign_type_id = $${valueIndex}`);
      values.push(parseInt(typeId));
      valueIndex++;
    }

    if (status) {
      whereConditions.push(`c.status = $${valueIndex}`);
      values.push(status);
      valueIndex++;
    }

    if (ownerId) {
      whereConditions.push(`c.owner_id = $${valueIndex}`);
      values.push(parseInt(ownerId));
      valueIndex++;
    }

    if (search) {
      whereConditions.push(`(
        c.campaign_number ILIKE $${valueIndex} OR
        c.campaign_name ILIKE $${valueIndex} OR
        c.description ILIKE $${valueIndex}
      )`);
      values.push(`%${search}%`);
      valueIndex++;
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    // Get campaigns with performance metrics
    values.push(limit, offset);
    const query = `
      SELECT 
        c.*,
        ct.type_name as campaign_type_name,
        ct.icon as campaign_type_icon,
        ct.color as campaign_type_color,
        CASE 
          WHEN c.total_sent > 0 THEN ROUND((c.total_delivered::numeric / c.total_sent * 100), 2)
          ELSE 0
        END as delivery_rate,
        CASE 
          WHEN c.total_delivered > 0 THEN ROUND((c.total_opened::numeric / c.total_delivered * 100), 2)
          ELSE 0
        END as open_rate,
        CASE 
          WHEN c.total_opened > 0 THEN ROUND((c.total_clicked::numeric / c.total_opened * 100), 2)
          ELSE 0
        END as click_through_rate,
        CASE 
          WHEN c.total_members > 0 THEN ROUND((c.leads_generated::numeric / c.total_members * 100), 2)
          ELSE 0
        END as lead_conversion_rate,
        CASE 
          WHEN c.actual_cost > 0 THEN ROUND((c.revenue_generated / c.actual_cost), 2)
          ELSE 0
        END as roi
      FROM crm_campaigns c
      JOIN crm_campaign_types ct ON c.campaign_type_id = ct.campaign_type_id
      ${whereClause}
      ORDER BY 
        CASE WHEN c.status = 'active' THEN 0 
             WHEN c.status = 'scheduled' THEN 1
             WHEN c.status = 'paused' THEN 2
             ELSE 3 END,
        c.start_date DESC,
        c.created_at DESC
      LIMIT $${valueIndex} OFFSET $${valueIndex + 1}
    `;

    const result = await pool.query(query, values);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM crm_campaigns c
      ${whereClause}
    `;
    const countResult = await pool.query(countQuery, values.slice(0, -2));
    const total = parseInt(countResult.rows[0].total);

    // Get summary statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_campaigns,
        COUNT(*) FILTER (WHERE status = 'active') as active_count,
        COUNT(*) FILTER (WHERE status = 'scheduled') as scheduled_count,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_count,
        SUM(total_members) as total_members,
        SUM(total_sent) as total_sent,
        SUM(total_opened) as total_opened,
        SUM(total_clicked) as total_clicked,
        SUM(leads_generated) as total_leads,
        SUM(revenue_generated) as total_revenue,
        SUM(budget_amount) as total_budget,
        SUM(actual_cost) as total_cost,
        CASE 
          WHEN SUM(total_sent) > 0 THEN ROUND((SUM(total_delivered)::numeric / SUM(total_sent) * 100), 2)
          ELSE 0
        END as avg_delivery_rate,
        CASE 
          WHEN SUM(total_delivered) > 0 THEN ROUND((SUM(total_opened)::numeric / SUM(total_delivered) * 100), 2)
          ELSE 0
        END as avg_open_rate,
        CASE 
          WHEN SUM(total_opened) > 0 THEN ROUND((SUM(total_clicked)::numeric / SUM(total_opened) * 100), 2)
          ELSE 0
        END as avg_ctr
      FROM crm_campaigns c
      ${whereClause}
    `;
    const statsResult = await pool.query(statsQuery, values.slice(0, -2));

    return NextResponse.json({
      campaigns: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      summary: statsResult.rows[0],
    });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/crm/campaigns
 * Create a new campaign
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      campaign_name,
      campaign_type_id,
      description,
      objectives,
      target_audience,
      status = 'draft',
      start_date,
      end_date,
      budget_amount,
      target_leads,
      target_revenue,
      owner_id,
      team_id,
    } = body;

    // Validate required fields
    if (!campaign_name || !campaign_type_id) {
      return NextResponse.json(
        { error: 'Missing required fields: campaign_name, campaign_type_id' },
        { status: 400 }
      );
    }

    // Verify campaign type exists
    const typeCheck = await pool.query(
      'SELECT campaign_type_id FROM crm_campaign_types WHERE campaign_type_id = $1 AND is_active = true',
      [campaign_type_id]
    );
    if (typeCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Campaign type not found' },
        { status: 404 }
      );
    }

    // Generate campaign number
    const numberResult = await pool.query(
      `SELECT COALESCE(MAX(CAST(SUBSTRING(campaign_number FROM 5) AS INTEGER)), 0) + 1 as next_number
       FROM crm_campaigns 
       WHERE campaign_number LIKE 'CMP-%'`
    );
    const nextNumber = numberResult.rows[0].next_number;
    const campaignNumber = `CMP-${String(nextNumber).padStart(6, '0')}`;

    // Insert campaign
    const insertQuery = `
      INSERT INTO crm_campaigns (
        campaign_number, campaign_name, campaign_type_id, description,
        objectives, target_audience, status, start_date, end_date,
        budget_amount, target_leads, target_revenue, owner_id, team_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;

    const result = await pool.query(insertQuery, [
      campaignNumber,
      campaign_name,
      campaign_type_id,
      description,
      objectives,
      target_audience,
      status,
      start_date,
      end_date,
      budget_amount,
      target_leads,
      target_revenue,
      owner_id,
      team_id,
    ]);

    // Fetch complete campaign data with type info
    const campaignData = await pool.query(
      `SELECT 
        c.*,
        ct.type_name as campaign_type_name,
        ct.icon as campaign_type_icon
      FROM crm_campaigns c
      JOIN crm_campaign_types ct ON c.campaign_type_id = ct.campaign_type_id
      WHERE c.campaign_id = $1`,
      [result.rows[0].campaign_id]
    );

    return NextResponse.json(campaignData.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}
