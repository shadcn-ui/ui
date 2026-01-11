import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://mac@localhost:5432/ocean-erp',
});

/**
 * GET /api/crm/knowledge
 * List knowledge base articles
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get('category_id');
    const status = searchParams.get('status') || 'published';
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let whereConditions = ['a.is_active = true'];
    const values: any[] = [];
    let valueIndex = 1;

    if (status !== 'all') {
      whereConditions.push(`a.status = $${valueIndex}`);
      values.push(status);
      valueIndex++;
    }

    if (categoryId) {
      whereConditions.push(`a.category_id = $${valueIndex}`);
      values.push(parseInt(categoryId));
      valueIndex++;
    }

    if (featured === 'true') {
      whereConditions.push('a.is_featured = true');
    }

    if (search) {
      whereConditions.push(`(
        a.title ILIKE $${valueIndex} OR
        a.summary ILIKE $${valueIndex} OR
        a.content ILIKE $${valueIndex} OR
        $${valueIndex} = ANY(a.keywords)
      )`);
      values.push(`%${search}%`);
      valueIndex++;
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    // Get articles
    values.push(limit, offset);
    const query = `
      SELECT 
        a.article_id,
        a.article_number,
        a.title,
        a.summary,
        a.category_id,
        a.tags,
        a.status,
        a.version,
        a.published_at,
        a.view_count,
        a.helpful_count,
        a.not_helpful_count,
        a.is_featured,
        a.created_at,
        a.updated_at,
        c.category_name,
        c.icon as category_icon,
        CASE 
          WHEN a.helpful_count + a.not_helpful_count > 0 
          THEN ROUND((a.helpful_count::numeric / (a.helpful_count + a.not_helpful_count) * 100), 1)
          ELSE NULL
        END as helpfulness_percentage
      FROM crm_kb_articles a
      JOIN crm_kb_categories c ON a.category_id = c.category_id
      ${whereClause}
      ORDER BY 
        a.is_featured DESC,
        a.view_count DESC,
        a.published_at DESC
      LIMIT $${valueIndex} OFFSET $${valueIndex + 1}
    `;

    const result = await pool.query(query, values);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM crm_kb_articles a
      ${whereClause}
    `;
    const countResult = await pool.query(countQuery, values.slice(0, -2));
    const total = parseInt(countResult.rows[0].total);

    // Get categories
    const categoriesQuery = `
      SELECT 
        c.*,
        COUNT(a.article_id) as article_count
      FROM crm_kb_categories c
      LEFT JOIN crm_kb_articles a ON c.category_id = a.category_id AND a.status = 'published' AND a.is_active = true
      WHERE c.is_active = true
      GROUP BY c.category_id
      ORDER BY c.sort_order, c.category_name
    `;
    const categoriesResult = await pool.query(categoriesQuery);

    return NextResponse.json({
      articles: result.rows,
      categories: categoriesResult.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching knowledge articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch knowledge articles' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/crm/knowledge
 * Create a new knowledge base article
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      summary,
      content,
      category_id,
      tags = [],
      keywords = [],
      status = 'draft',
      author_id,
      is_featured = false,
      is_internal = false,
    } = body;

    if (!title || !content || !category_id) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, category_id' },
        { status: 400 }
      );
    }

    // Verify category exists
    const categoryCheck = await pool.query(
      'SELECT category_id FROM crm_kb_categories WHERE category_id = $1 AND is_active = true',
      [category_id]
    );
    if (categoryCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Generate article number
    const numberResult = await pool.query(
      `SELECT COALESCE(MAX(CAST(SUBSTRING(article_number FROM 4) AS INTEGER)), 0) + 1 as next_number
       FROM crm_kb_articles 
       WHERE article_number LIKE 'KB-%'`
    );
    const nextNumber = numberResult.rows[0].next_number;
    const articleNumber = `KB-${String(nextNumber).padStart(6, '0')}`;

    // Insert article
    const insertQuery = `
      INSERT INTO crm_kb_articles (
        article_number, title, summary, content, category_id,
        tags, keywords, status, author_id, is_featured, is_internal,
        published_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const published_at = status === 'published' ? new Date() : null;

    const result = await pool.query(insertQuery, [
      articleNumber,
      title,
      summary,
      content,
      category_id,
      tags,
      keywords,
      status,
      author_id,
      is_featured,
      is_internal,
      published_at,
    ]);

    // Fetch complete article data
    const articleData = await pool.query(
      `SELECT 
        a.*,
        c.category_name
      FROM crm_kb_articles a
      JOIN crm_kb_categories c ON a.category_id = c.category_id
      WHERE a.article_id = $1`,
      [result.rows[0].article_id]
    );

    return NextResponse.json(articleData.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    );
  }
}
