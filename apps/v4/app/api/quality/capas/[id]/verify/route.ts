import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://mac@localhost:5432/ocean-erp',
});

// POST /api/quality/capas/[id]/verify - Verify CAPA effectiveness
export async function POST(
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

    const {
      verification_method,
      baseline_value,
      current_value,
      target_value,
      verification_notes,
      verified_by,
    } = body;

    if (!verification_method || current_value === undefined || !verified_by) {
      return NextResponse.json(
        { error: 'Missing required verification fields' },
        { status: 400 }
      );
    }

    await client.query('BEGIN');

    // Check if CAPA exists and all actions are completed
    const capaResult = await client.query(`
      SELECT 
        c.*,
        COUNT(ca.id) AS total_actions,
        COUNT(CASE WHEN ca.status = 'completed' THEN 1 END) AS completed_actions
      FROM capas c
      LEFT JOIN capa_actions ca ON ca.capa_id = c.id
      WHERE c.id = $1
      GROUP BY c.id
    `, [id]);

    if (capaResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json(
        { error: 'CAPA not found' },
        { status: 404 }
      );
    }

    const capa = capaResult.rows[0];

    if (capa.total_actions > 0 && capa.completed_actions < capa.total_actions) {
      await client.query('ROLLBACK');
      return NextResponse.json(
        { error: 'Cannot verify effectiveness - not all actions are completed' },
        { status: 400 }
      );
    }

    // Determine if effective based on target
    let isEffective = false;
    if (target_value !== undefined && current_value !== undefined) {
      // Assume lower values are better (e.g., defect rate)
      isEffective = current_value <= target_value;
    } else {
      // If no target, consider effective if improved from baseline
      isEffective = baseline_value !== undefined 
        ? current_value < baseline_value
        : true;
    }

    // Insert verification record
    const verificationResult = await client.query(`
      INSERT INTO capa_verifications (
        capa_id,
        verification_date,
        verification_method,
        baseline_value,
        current_value,
        target_value,
        is_effective,
        verification_notes,
        verified_by
      ) VALUES ($1, CURRENT_TIMESTAMP, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      id,
      verification_method,
      baseline_value,
      current_value,
      target_value,
      isEffective,
      verification_notes,
      verified_by,
    ]);

    // Update CAPA status
    let newStatus = capa.status;
    if (isEffective) {
      newStatus = 'closed';
      await client.query(`
        UPDATE capas
        SET 
          status = 'closed',
          effectiveness_verified = true,
          effectiveness_verification_date = CURRENT_TIMESTAMP,
          closed_date = CURRENT_TIMESTAMP,
          closed_by = $2,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `, [id, verified_by]);
    } else {
      // If not effective, require follow-up actions
      newStatus = 'in_progress';
      await client.query(`
        UPDATE capas
        SET 
          status = 'in_progress',
          effectiveness_verified = false,
          effectiveness_verification_date = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `, [id]);
    }

    await client.query('COMMIT');

    return NextResponse.json({
      message: isEffective 
        ? 'CAPA verified as effective and closed'
        : 'CAPA verification recorded - not effective, follow-up required',
      verification: verificationResult.rows[0],
      is_effective: isEffective,
      new_status: newStatus,
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error verifying CAPA:', error);
    return NextResponse.json(
      { error: 'Failed to verify CAPA', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// PATCH /api/quality/capas/[id]/verify - Update action status
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const client = await pool.connect();
  
  try {
    const routeParams = await context.params;
    const capaId = parseInt(routeParams.id);
    const body = await request.json();

    if (isNaN(capaId)) {
      return NextResponse.json(
        { error: 'Invalid CAPA ID' },
        { status: 400 }
      );
    }

    const { action_id, status, completion_notes, completed_by, evidence } = body;

    if (!action_id || !status) {
      return NextResponse.json(
        { error: 'Missing action_id or status' },
        { status: 400 }
      );
    }

    await client.query('BEGIN');

    // Update action status
    const updates: string[] = [`status = $1`];
    const queryParams: any[] = [status, action_id, capaId];
    let paramIndex = 4;

    if (status === 'completed') {
      updates.push(`completed_date = CURRENT_TIMESTAMP`);
      
      if (completed_by) {
        updates.push(`completed_by = $${paramIndex}`);
        queryParams.push(completed_by);
        paramIndex++;
      }
      if (completion_notes) {
        updates.push(`completion_notes = $${paramIndex}`);
        queryParams.push(completion_notes);
        paramIndex++;
      }
      if (evidence) {
        updates.push(`evidence = $${paramIndex}`);
        queryParams.push(JSON.stringify(evidence));
        paramIndex++;
      }
    }

    const actionResult = await client.query(`
      UPDATE capa_actions
      SET ${updates.join(', ')}
      WHERE id = $2 AND capa_id = $3
      RETURNING *
    `, queryParams);

    if (actionResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json(
        { error: 'CAPA action not found' },
        { status: 404 }
      );
    }

    // Check if all actions are completed, update CAPA status
    const statusCheckResult = await client.query(`
      SELECT 
        COUNT(*) AS total_actions,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) AS completed_actions
      FROM capa_actions
      WHERE capa_id = $1
    `, [capaId]);

    const { total_actions, completed_actions } = statusCheckResult.rows[0];

    if (parseInt(completed_actions) === parseInt(total_actions)) {
      await client.query(`
        UPDATE capas
        SET 
          status = 'pending_verification',
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `, [capaId]);
    }

    await client.query('COMMIT');

    return NextResponse.json({
      message: 'CAPA action updated successfully',
      action: actionResult.rows[0],
      all_actions_completed: parseInt(completed_actions) === parseInt(total_actions),
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error updating CAPA action:', error);
    return NextResponse.json(
      { error: 'Failed to update CAPA action', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
