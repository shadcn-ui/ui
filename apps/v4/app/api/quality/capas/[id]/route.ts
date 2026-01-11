import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://mac@localhost:5432/ocean-erp',
});

// GET /api/quality/capas/[id] - Fetch CAPA details
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const routeParams = await context.params;
    const id = parseInt(routeParams.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid CAPA ID' },
        { status: 400 }
      );
    }

    // Fetch CAPA with actions and verifications
    const capaResult = await pool.query(`
      SELECT c.*
      FROM capas c
      WHERE c.id = $1
    `, [id]);

    if (capaResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'CAPA not found' },
        { status: 404 }
      );
    }

    const capa = capaResult.rows[0];

    // Fetch CAPA actions
    const actionsResult = await pool.query(`
      SELECT *
      FROM capa_actions
      WHERE capa_id = $1
      ORDER BY action_sequence
    `, [id]);

    // Fetch verifications
    const verificationsResult = await pool.query(`
      SELECT *
      FROM capa_verifications
      WHERE capa_id = $1
      ORDER BY verification_date DESC
    `, [id]);

    return NextResponse.json({
      ...capa,
      actions: actionsResult.rows,
      verifications: verificationsResult.rows,
    });
  } catch (error: any) {
    console.error('Error fetching CAPA:', error);
    return NextResponse.json(
      { error: 'Failed to fetch CAPA', details: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/quality/capas/[id] - Update CAPA
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const client = await pool.connect();
  
  try {
    const routeParams = await context.params;
    const id = parseInt(routeParams.id);
    const body = await request.json();

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid CAPA ID' },
        { status: 400 }
      );
    }

    await client.query('BEGIN');

    const {
      title,
      description,
      priority,
      root_cause,
      root_cause_analysis_method,
      assigned_to,
      due_date,
      status,
      actions = [],
    } = body;

    // Build dynamic update query
    const updates: string[] = [];
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (title !== undefined) {
      updates.push(`title = $${paramIndex}`);
      queryParams.push(title);
      paramIndex++;
    }
    if (description !== undefined) {
      updates.push(`description = $${paramIndex}`);
      queryParams.push(description);
      paramIndex++;
    }
    if (priority !== undefined) {
      updates.push(`priority = $${paramIndex}`);
      queryParams.push(priority);
      paramIndex++;
    }
    if (root_cause !== undefined) {
      updates.push(`root_cause = $${paramIndex}`);
      queryParams.push(root_cause);
      paramIndex++;
    }
    if (root_cause_analysis_method !== undefined) {
      updates.push(`root_cause_analysis_method = $${paramIndex}`);
      queryParams.push(root_cause_analysis_method);
      paramIndex++;
    }
    if (assigned_to !== undefined) {
      updates.push(`assigned_to = $${paramIndex}`);
      queryParams.push(assigned_to);
      paramIndex++;
    }
    if (due_date !== undefined) {
      updates.push(`due_date = $${paramIndex}`);
      queryParams.push(due_date);
      paramIndex++;
    }
    if (status !== undefined) {
      updates.push(`status = $${paramIndex}`);
      queryParams.push(status);
      paramIndex++;
    }

    if (updates.length > 0) {
      updates.push(`updated_at = CURRENT_TIMESTAMP`);
      queryParams.push(id);
      
      const updateQuery = `
        UPDATE capas
        SET ${updates.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      const result = await client.query(updateQuery, queryParams);

      if (result.rows.length === 0) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { error: 'CAPA not found' },
          { status: 404 }
        );
      }
    }

    // Add new actions if provided
    let actionsAdded = 0;
    if (actions.length > 0) {
      // Get current max sequence
      const maxSeqResult = await client.query(`
        SELECT COALESCE(MAX(action_sequence), 0) AS max_seq
        FROM capa_actions
        WHERE capa_id = $1
      `, [id]);
      
      let currentSeq = maxSeqResult.rows[0].max_seq;

      for (const action of actions) {
        currentSeq++;
        await client.query(`
          INSERT INTO capa_actions (
            capa_id,
            action_sequence,
            action_description,
            responsible_person,
            due_date,
            status
          ) VALUES ($1, $2, $3, $4, $5, $6)
        `, [
          id,
          currentSeq,
          action.action_description,
          action.responsible_person,
          action.due_date,
          'pending',
        ]);
        actionsAdded++;
      }
    }

    await client.query('COMMIT');

    // Fetch updated CAPA
    const capaResult = await client.query('SELECT * FROM capas WHERE id = $1', [id]);

    return NextResponse.json({
      message: 'CAPA updated successfully',
      capa: capaResult.rows[0],
      actions_added: actionsAdded,
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error updating CAPA:', error);
    return NextResponse.json(
      { error: 'Failed to update CAPA', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// DELETE /api/quality/capas/[id] - Cancel CAPA (soft delete)
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const routeParams = await context.params;
    const id = parseInt(routeParams.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid CAPA ID' },
        { status: 400 }
      );
    }

    const result = await pool.query(`
      UPDATE capas
      SET 
        status = 'cancelled',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'CAPA not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'CAPA cancelled successfully',
      capa: result.rows[0],
    });
  } catch (error: any) {
    console.error('Error cancelling CAPA:', error);
    return NextResponse.json(
      { error: 'Failed to cancel CAPA', details: error.message },
      { status: 500 }
    );
  }
}
