import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://mac@localhost:5432/ocean-erp',
});

// POST /api/quality/ncrs/[id]/approve - Approve NCR and close
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const client = await pool.connect();
  
  try {
    const params = await context.params;
    const ncrId = parseInt(params.id);
    
    if (isNaN(ncrId)) {
      return NextResponse.json({ error: 'Invalid NCR ID' }, { status: 400 });
    }

    const body = await request.json();
    const {
      approved_by,
      action = 'approve', // 'approve' or 'close'
      closure_notes,
    } = body;

    if (!approved_by) {
      return NextResponse.json(
        { error: 'approved_by is required' },
        { status: 400 }
      );
    }

    await client.query('BEGIN');

    // Check if NCR exists
    const ncrResult = await client.query('SELECT * FROM ncrs WHERE id = $1', [ncrId]);
    
    if (ncrResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ error: 'NCR not found' }, { status: 404 });
    }

    const ncr = ncrResult.rows[0];

    // Check if all actions are completed
    const actionsResult = await client.query(`
      SELECT COUNT(*) as total, COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed
      FROM ncr_actions
      WHERE ncr_id = $1
    `, [ncrId]);

    const actionStats = actionsResult.rows[0];
    const allActionsComplete = actionStats.total === 0 || actionStats.total === actionStats.completed;

    if (action === 'approve') {
      // Approve the NCR (review step)
      const result = await client.query(`
        UPDATE ncrs
        SET 
          reviewed_by = $1,
          approved_by = $1,
          approved_date = CURRENT_TIMESTAMP,
          status = CASE 
            WHEN status = 'open' THEN 'investigating'
            WHEN status = 'investigating' AND $2 THEN 'capa_required'
            ELSE status
          END,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING *
      `, [approved_by, !allActionsComplete, ncrId]);

      await client.query('COMMIT');

      return NextResponse.json({
        message: 'NCR approved successfully',
        ncr: result.rows[0],
        actions_pending: actionStats.total - actionStats.completed,
      });
    } else if (action === 'close') {
      // Close the NCR
      if (!allActionsComplete) {
        await client.query('ROLLBACK');
        return NextResponse.json({
          error: 'Cannot close NCR with incomplete actions',
          actions_pending: actionStats.total - actionStats.completed,
        }, { status: 400 });
      }

      const result = await client.query(`
        UPDATE ncrs
        SET 
          status = 'closed',
          closed_by = $1,
          closed_date = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
      `, [approved_by, ncrId]);

      await client.query('COMMIT');

      return NextResponse.json({
        message: 'NCR closed successfully',
        ncr: result.rows[0],
      });
    } else {
      await client.query('ROLLBACK');
      return NextResponse.json({
        error: 'Invalid action. Must be "approve" or "close"',
      }, { status: 400 });
    }
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error approving/closing NCR:', error);
    return NextResponse.json(
      { error: 'Failed to process NCR', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
