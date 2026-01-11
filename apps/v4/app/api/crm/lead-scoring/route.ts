import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://mac@localhost:5432/ocean-erp',
});

/**
 * GET /api/crm/lead-scoring
 * Get lead scores with history
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const contactId = searchParams.get('contact_id');
    const minScore = searchParams.get('min_score');
    const maxScore = searchParams.get('max_score');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    if (!contactId) {
      // Get all contacts with scores
      let whereConditions = ['c.is_active = true'];
      const values: any[] = [];
      let valueIndex = 1;

      if (minScore) {
        whereConditions.push(`c.lead_score >= $${valueIndex}`);
        values.push(parseInt(minScore));
        valueIndex++;
      }

      if (maxScore) {
        whereConditions.push(`c.lead_score <= $${valueIndex}`);
        values.push(parseInt(maxScore));
        valueIndex++;
      }

      const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

      values.push(limit, offset);
      const query = `
        SELECT 
          c.contact_id,
          c.full_name,
          c.email,
          c.job_title,
          c.lead_score,
          c.lead_status,
          a.account_name,
          (SELECT COUNT(*) FROM crm_lead_score_history WHERE contact_id = c.contact_id) as score_history_count,
          (SELECT created_at FROM crm_lead_score_history WHERE contact_id = c.contact_id ORDER BY created_at DESC LIMIT 1) as last_score_change
        FROM crm_contacts c
        LEFT JOIN crm_accounts a ON c.account_id = a.account_id
        ${whereClause}
        ORDER BY c.lead_score DESC NULLS LAST
        LIMIT $${valueIndex} OFFSET $${valueIndex + 1}
      `;

      const result = await pool.query(query, values);

      const countQuery = `
        SELECT COUNT(*) as total
        FROM crm_contacts c
        ${whereClause}
      `;
      const countResult = await pool.query(countQuery, values.slice(0, -2));
      const total = parseInt(countResult.rows[0].total);

      // Get score distribution
      const distributionQuery = `
        SELECT 
          CASE 
            WHEN lead_score >= 80 THEN 'Hot (80+)'
            WHEN lead_score >= 60 THEN 'Warm (60-79)'
            WHEN lead_score >= 40 THEN 'Moderate (40-59)'
            WHEN lead_score >= 20 THEN 'Cold (20-39)'
            ELSE 'Very Cold (0-19)'
          END as score_range,
          COUNT(*) as count
        FROM crm_contacts
        WHERE is_active = true AND lead_score IS NOT NULL
        GROUP BY 
          CASE 
            WHEN lead_score >= 80 THEN 'Hot (80+)'
            WHEN lead_score >= 60 THEN 'Warm (60-79)'
            WHEN lead_score >= 40 THEN 'Moderate (40-59)'
            WHEN lead_score >= 20 THEN 'Cold (20-39)'
            ELSE 'Very Cold (0-19)'
          END
        ORDER BY MIN(lead_score) DESC
      `;
      const distributionResult = await pool.query(distributionQuery);

      return NextResponse.json({
        leads: result.rows,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
        distribution: distributionResult.rows,
      });
    } else {
      // Get specific contact's score history
      const historyQuery = `
        SELECT 
          h.*,
          r.rule_name,
          r.category as rule_category,
          c.campaign_name
        FROM crm_lead_score_history h
        LEFT JOIN crm_lead_scoring_rules r ON h.rule_id = r.rule_id
        LEFT JOIN crm_campaigns c ON h.campaign_id = c.campaign_id
        WHERE h.contact_id = $1
        ORDER BY h.created_at DESC
        LIMIT 50
      `;
      const historyResult = await pool.query(historyQuery, [parseInt(contactId)]);

      // Get contact current score
      const contactQuery = `
        SELECT contact_id, full_name, email, lead_score
        FROM crm_contacts
        WHERE contact_id = $1
      `;
      const contactResult = await pool.query(contactQuery, [parseInt(contactId)]);

      return NextResponse.json({
        contact: contactResult.rows[0],
        history: historyResult.rows,
      });
    }
  } catch (error) {
    console.error('Error fetching lead scores:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lead scores' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/crm/lead-scoring
 * Update lead score manually
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contact_id, score_change, reason } = body;

    if (!contact_id || score_change === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: contact_id, score_change' },
        { status: 400 }
      );
    }

    // Get current score
    const contactResult = await pool.query(
      'SELECT contact_id, lead_score FROM crm_contacts WHERE contact_id = $1 AND is_active = true',
      [contact_id]
    );
    if (contactResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    const contact = contactResult.rows[0];
    const previousScore = contact.lead_score || 0;
    const newScore = Math.max(0, Math.min(100, previousScore + score_change)); // Keep between 0-100

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Update contact score
      await client.query(
        'UPDATE crm_contacts SET lead_score = $1 WHERE contact_id = $2',
        [newScore, contact_id]
      );

      // Insert score history
      const historyQuery = `
        INSERT INTO crm_lead_score_history (
          contact_id, previous_score, new_score, score_change, reason
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      const historyResult = await client.query(historyQuery, [
        contact_id,
        previousScore,
        newScore,
        score_change,
        reason || 'Manual adjustment',
      ]);

      await client.query('COMMIT');

      return NextResponse.json({
        contact_id,
        previous_score: previousScore,
        new_score: newScore,
        score_change,
        history: historyResult.rows[0],
      }, { status: 201 });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error updating lead score:', error);
    return NextResponse.json(
      { error: 'Failed to update lead score' },
      { status: 500 }
    );
  }
}
