import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface RouteParams {
  params: {
    id: string;
  };
}

// PATCH /api/notifications/[id]/read - Mark notification as read
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const notificationId = params.id;

    const result = await query(
      `UPDATE notifications
      SET is_read = true, read_at = NOW(), updated_at = NOW()
      WHERE id = $1
      RETURNING *`,
      [notificationId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      notification: result.rows[0]
    });

  } catch (error: any) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark notification as read', details: error.message },
      { status: 500 }
    );
  }
}
