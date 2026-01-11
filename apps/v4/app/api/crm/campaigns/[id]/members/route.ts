import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://mac@localhost:5432/ocean-erp',
});

/**
 * GET /api/crm/campaigns/:id/members
 * Get campaign members
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const campaignId = parseInt(params.id);
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('member_status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    let whereConditions = ['cm.campaign_id = $1'];
    const values: any[] = [campaignId];
    let valueIndex = 2;

    if (status) {
      whereConditions.push(`cm.member_status = $${valueIndex}`);
      values.push(status);
      valueIndex++;
    }

    const whereClause = whereConditions.join(' AND ');

    // Get members
    values.push(limit, offset);
    const query = `
      SELECT 
        cm.*,
        con.full_name,
        con.email,
        con.phone,
        con.job_title,
        a.account_name,
        o.opportunity_name,
        o.amount as opportunity_amount
      FROM crm_campaign_members cm
      JOIN crm_contacts con ON cm.contact_id = con.contact_id
      LEFT JOIN crm_accounts a ON cm.account_id = a.account_id
      LEFT JOIN crm_opportunities o ON cm.opportunity_id = o.opportunity_id
      WHERE ${whereClause}
      ORDER BY cm.added_at DESC
      LIMIT $${valueIndex} OFFSET $${valueIndex + 1}
    `;

    const result = await pool.query(query, values);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM crm_campaign_members cm
      WHERE ${whereClause}
    `;
    const countResult = await pool.query(countQuery, values.slice(0, -2));
    const total = parseInt(countResult.rows[0].total);

    return NextResponse.json({
      members: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching campaign members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaign members' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/crm/campaigns/:id/members
 * Add members to campaign
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const campaignId = parseInt(params.id);
    const body = await request.json();
    const { contact_ids, account_id } = body;

    if (!contact_ids || !Array.isArray(contact_ids) || contact_ids.length === 0) {
      return NextResponse.json(
        { error: 'contact_ids array is required' },
        { status: 400 }
      );
    }

    // Check if campaign exists
    const campaignCheck = await pool.query(
      'SELECT campaign_id FROM crm_campaigns WHERE campaign_id = $1 AND is_active = true',
      [campaignId]
    );
    if (campaignCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const addedMembers = [];
      for (const contactId of contact_ids) {
        // Check if member already exists
        const existingCheck = await client.query(
          'SELECT member_id FROM crm_campaign_members WHERE campaign_id = $1 AND contact_id = $2',
          [campaignId, contactId]
        );

        if (existingCheck.rows.length > 0) {
          continue; // Skip if already a member
        }

        // Get contact's account if not provided
        let finalAccountId = account_id;
        if (!finalAccountId) {
          const contactResult = await client.query(
            'SELECT account_id FROM crm_contacts WHERE contact_id = $1',
            [contactId]
          );
          if (contactResult.rows.length > 0) {
            finalAccountId = contactResult.rows[0].account_id;
          }
        }

        // Insert member
        const insertQuery = `
          INSERT INTO crm_campaign_members (
            campaign_id, contact_id, account_id, member_status
          ) VALUES ($1, $2, $3, 'added')
          RETURNING *
        `;

        const result = await client.query(insertQuery, [
          campaignId,
          contactId,
          finalAccountId,
        ]);

        addedMembers.push(result.rows[0]);
      }

      await client.query('COMMIT');

      return NextResponse.json({
        message: `Added ${addedMembers.length} members to campaign`,
        members: addedMembers,
      }, { status: 201 });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error adding campaign members:', error);
    return NextResponse.json(
      { error: 'Failed to add campaign members' },
      { status: 500 }
    );
  }
}
