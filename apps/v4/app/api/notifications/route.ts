import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/notifications - Get user's notifications
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const user_id = searchParams.get('user_id');
    const is_read = searchParams.get('is_read');
    const type = searchParams.get('type');
    const rawLimit = searchParams.get('limit');
    let limit = 50;
    if (rawLimit !== null) {
      const parsed = parseInt(rawLimit || '0');
      if (!isNaN(parsed) && parsed > 0) {
        limit = parsed;
      }
    }

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      );
    }

    let sql = `SELECT * FROM notifications WHERE user_id = $1`;
    const params: any[] = [user_id];
    let paramIndex = 2;

    if (is_read !== null) {
      sql += ` AND is_read = $${paramIndex}`;
      params.push(is_read === 'true');
      paramIndex++;
    }

    if (type) {
      sql += ` AND type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

    sql += ` ORDER BY created_at DESC LIMIT $${paramIndex}`;
    params.push(limit);

    const result = await query(sql, params);

    // Get unread count
    const unreadResult = await query(
      `SELECT COUNT(*) as unread_count FROM notifications
      WHERE user_id = $1 AND is_read = false`,
      [user_id]
    );

    return NextResponse.json({
      notifications: result.rows,
      count: result.rows.length,
      unread_count: parseInt(unreadResult.rows[0].unread_count)
    });

  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/notifications - Create a new notification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, type, title, message, link, metadata } = body;

    if (!user_id || !type || !title || !message) {
      return NextResponse.json(
        { error: 'user_id, type, title, and message are required' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO notifications (user_id, type, title, message, link, metadata)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [user_id, type, title, message, link, metadata ? JSON.stringify(metadata) : null]
    );

    return NextResponse.json({
      success: true,
      notification: result.rows[0]
    });

  } catch (error: any) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Failed to create notification', details: error.message },
      { status: 500 }
    );
  }
}
