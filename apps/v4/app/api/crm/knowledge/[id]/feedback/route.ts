import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://mac@localhost:5432/ocean-erp',
});

/**
 * POST /api/crm/knowledge/:id/feedback
 * Submit feedback for an article
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const articleId = parseInt(params.id);
    const body = await request.json();
    const { is_helpful, comment, submitted_by } = body;

    if (is_helpful === undefined) {
      return NextResponse.json(
        { error: 'is_helpful is required' },
        { status: 400 }
      );
    }

    // Check if article exists
    const articleCheck = await pool.query(
      'SELECT article_id FROM crm_kb_articles WHERE article_id = $1 AND is_active = true',
      [articleId]
    );
    if (articleCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Insert feedback
    const insertQuery = `
      INSERT INTO crm_kb_article_feedback (
        article_id, is_helpful, comment, submitted_by
      ) VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const result = await pool.query(insertQuery, [
      articleId,
      is_helpful,
      comment,
      submitted_by,
    ]);

    // Update article helpful/not helpful counters
    if (is_helpful) {
      await pool.query(
        'UPDATE crm_kb_articles SET helpful_count = helpful_count + 1 WHERE article_id = $1',
        [articleId]
      );
    } else {
      await pool.query(
        'UPDATE crm_kb_articles SET not_helpful_count = not_helpful_count + 1 WHERE article_id = $1',
        [articleId]
      );
    }

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}
