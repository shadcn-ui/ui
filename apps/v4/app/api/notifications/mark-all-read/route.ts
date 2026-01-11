import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// POST /api/notifications/mark-all-read - Mark all notifications as read for a user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id } = body;

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      );
    }

    const result = await query(
      `UPDATE notifications
      SET is_read = true, read_at = NOW(), updated_at = NOW()
      WHERE user_id = $1 AND is_read = false
      RETURNING id`,
      [user_id]
    );

    return NextResponse.json({
      success: true,
      marked_count: result.rows.length,
      message: `${result.rows.length} notifications marked as read`
    });

  } catch (error: any) {
    console.error('Error marking all notifications as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark notifications as read', details: error.message },
      { status: 500 }
    );
  }
}
