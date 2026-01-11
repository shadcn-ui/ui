import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://mac@localhost:5432/ocean-erp',
});

/**
 * GET /api/crm/knowledge/:id
 * Get article details and increment view count
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const articleId = parseInt(params.id);

    // Get article details
    const query = `
      SELECT 
        a.*,
        c.category_name,
        c.icon as category_icon,
        CASE 
          WHEN a.helpful_count + a.not_helpful_count > 0 
          THEN ROUND((a.helpful_count::numeric / (a.helpful_count + a.not_helpful_count) * 100), 1)
          ELSE NULL
        END as helpfulness_percentage
      FROM crm_kb_articles a
      JOIN crm_kb_categories c ON a.category_id = c.category_id
      WHERE a.article_id = $1 AND a.is_active = true
    `;

    const result = await pool.query(query, [articleId]);
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    const article = result.rows[0];

    // Increment view count
    await pool.query(
      'UPDATE crm_kb_articles SET view_count = view_count + 1 WHERE article_id = $1',
      [articleId]
    );
    article.view_count += 1;

    // Get related articles
    let relatedArticles = [];
    if (article.related_article_ids && article.related_article_ids.length > 0) {
      const relatedQuery = `
        SELECT article_id, article_number, title, summary, view_count
        FROM crm_kb_articles
        WHERE article_id = ANY($1) AND status = 'published' AND is_active = true
        ORDER BY view_count DESC
      `;
      const relatedResult = await pool.query(relatedQuery, [article.related_article_ids]);
      relatedArticles = relatedResult.rows;
    }

    // Get attachments
    const attachmentsQuery = `
      SELECT * FROM crm_kb_article_attachments
      WHERE article_id = $1
      ORDER BY uploaded_at DESC
    `;
    const attachmentsResult = await pool.query(attachmentsQuery, [articleId]);

    return NextResponse.json({
      article,
      related_articles: relatedArticles,
      attachments: attachmentsResult.rows,
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/crm/knowledge/:id
 * Update article
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const articleId = parseInt(params.id);
    const body = await request.json();

    const checkResult = await pool.query(
      'SELECT article_id, status FROM crm_kb_articles WHERE article_id = $1 AND is_active = true',
      [articleId]
    );
    if (checkResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    const currentArticle = checkResult.rows[0];

    const allowedFields = [
      'title',
      'summary',
      'content',
      'category_id',
      'tags',
      'keywords',
      'status',
      'is_featured',
      'is_internal',
      'reviewed_by',
      'related_article_ids',
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

    // If status is changing to published, set published_at
    if (body.status === 'published' && currentArticle.status !== 'published') {
      updateFields.push(`published_at = $${valueIndex}`);
      values.push(new Date());
      valueIndex++;
      
      // Increment version
      updateFields.push(`version = version + 1`);
    }

    values.push(articleId);
    const updateQuery = `
      UPDATE crm_kb_articles
      SET ${updateFields.join(', ')}
      WHERE article_id = $${valueIndex}
      RETURNING *
    `;

    await pool.query(updateQuery, values);

    // Fetch updated article
    const result = await pool.query(
      `SELECT 
        a.*,
        c.category_name
      FROM crm_kb_articles a
      JOIN crm_kb_categories c ON a.category_id = c.category_id
      WHERE a.article_id = $1`,
      [articleId]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/crm/knowledge/:id
 * Soft delete article
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const articleId = parseInt(params.id);

    const result = await pool.query(
      'UPDATE crm_kb_articles SET is_active = false WHERE article_id = $1 AND is_active = true RETURNING article_id',
      [articleId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    );
  }
}
