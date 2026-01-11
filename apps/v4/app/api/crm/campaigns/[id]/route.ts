import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://mac@localhost:5432/ocean-erp',
});

/**
 * GET /api/crm/campaigns/:id
 * Get campaign details with members and analytics
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const campaignId = parseInt(params.id);

    // Get campaign details
    const campaignQuery = `
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
        END as roi,
        CASE 
          WHEN c.budget_amount > 0 THEN ROUND((c.actual_cost / c.budget_amount * 100), 2)
          ELSE 0
        END as budget_spent_percentage
      FROM crm_campaigns c
      JOIN crm_campaign_types ct ON c.campaign_type_id = ct.campaign_type_id
      WHERE c.campaign_id = $1 AND c.is_active = true
    `;

    const campaignResult = await pool.query(campaignQuery, [campaignId]);
    if (campaignResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    const campaign = campaignResult.rows[0];

    // Get member status breakdown
    const memberStatsQuery = `
      SELECT 
        member_status,
        COUNT(*) as count
      FROM crm_campaign_members
      WHERE campaign_id = $1
      GROUP BY member_status
      ORDER BY count DESC
    `;
    const memberStatsResult = await pool.query(memberStatsQuery, [campaignId]);

    // Get recent activity (last 10 days)
    const activityQuery = `
      SELECT 
        analytics_date,
        emails_sent,
        emails_delivered,
        emails_opened,
        emails_clicked,
        leads_generated,
        revenue_for_day
      FROM crm_campaign_analytics
      WHERE campaign_id = $1
      ORDER BY analytics_date DESC
      LIMIT 10
    `;
    const activityResult = await pool.query(activityQuery, [campaignId]);

    // Get top performing members (by engagement)
    const topMembersQuery = `
      SELECT 
        cm.*,
        con.full_name,
        con.email,
        a.account_name
      FROM crm_campaign_members cm
      JOIN crm_contacts con ON cm.contact_id = con.contact_id
      LEFT JOIN crm_accounts a ON cm.account_id = a.account_id
      WHERE cm.campaign_id = $1
      ORDER BY 
        (cm.email_opened_count + cm.email_clicked_count * 2) DESC
      LIMIT 10
    `;
    const topMembersResult = await pool.query(topMembersQuery, [campaignId]);

    return NextResponse.json({
      campaign,
      member_stats: memberStatsResult.rows,
      recent_activity: activityResult.rows,
      top_members: topMembersResult.rows,
    });
  } catch (error) {
    console.error('Error fetching campaign details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaign details' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/crm/campaigns/:id
 * Update campaign
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const campaignId = parseInt(params.id);
    const body = await request.json();

    // Check if campaign exists
    const checkResult = await pool.query(
      'SELECT campaign_id FROM crm_campaigns WHERE campaign_id = $1 AND is_active = true',
      [campaignId]
    );
    if (checkResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    const allowedFields = [
      'campaign_name',
      'campaign_type_id',
      'description',
      'objectives',
      'target_audience',
      'status',
      'start_date',
      'end_date',
      'budget_amount',
      'actual_cost',
      'target_leads',
      'target_revenue',
      'owner_id',
      'team_id',
    ];

    const updateFields: string[] = [];
    const values: any[] = [];
    let valueIndex = 1;

    Object.keys(body).forEach((key) => {
      if (allowedFields.includes(key) && body[key] !== undefined) {
        updateFields.push(`${key} = $${valueIndex}`);
        values.push(body[key]);
        valueIndex++;
      }
    });

    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    values.push(campaignId);
    const updateQuery = `
      UPDATE crm_campaigns
      SET ${updateFields.join(', ')}
      WHERE campaign_id = $${valueIndex}
      RETURNING *
    `;

    await pool.query(updateQuery, values);

    // Fetch updated campaign with type info
    const result = await pool.query(
      `SELECT 
        c.*,
        ct.type_name as campaign_type_name
      FROM crm_campaigns c
      JOIN crm_campaign_types ct ON c.campaign_type_id = ct.campaign_type_id
      WHERE c.campaign_id = $1`,
      [campaignId]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to update campaign' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/crm/campaigns/:id
 * Soft delete campaign
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const campaignId = parseInt(params.id);

    const result = await pool.query(
      'UPDATE crm_campaigns SET is_active = false WHERE campaign_id = $1 AND is_active = true RETURNING campaign_id',
      [campaignId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    return NextResponse.json(
      { error: 'Failed to delete campaign' },
      { status: 500 }
    );
  }
}
