import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://mac@localhost:5432/ocean-erp',
});

// GET /api/quality/ncrs/[id] - Get NCR details with all related data
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const ncrId = parseInt(params.id);

    if (isNaN(ncrId)) {
      return NextResponse.json({ error: 'Invalid NCR ID' }, { status: 400 });
    }

    // Get NCR header
    const ncrResult = await pool.query('SELECT * FROM ncrs WHERE id = $1', [ncrId]);
    
    if (ncrResult.rows.length === 0) {
      return NextResponse.json({ error: 'NCR not found' }, { status: 404 });
    }

    const ncr = ncrResult.rows[0];

    // Get NCR details
    const detailsResult = await pool.query(
      'SELECT * FROM ncr_details WHERE ncr_id = $1 ORDER BY id',
      [ncrId]
    );

    // Get root causes
    const rootCausesResult = await pool.query(
      'SELECT * FROM ncr_root_causes WHERE ncr_id = $1 ORDER BY why_level',
      [ncrId]
    );

    // Get actions
    const actionsResult = await pool.query(
      'SELECT * FROM ncr_actions WHERE ncr_id = $1 ORDER BY created_at',
      [ncrId]
    );

    return NextResponse.json({
      ncr,
      details: detailsResult.rows,
      root_causes: rootCausesResult.rows,
      actions: actionsResult.rows,
    });
  } catch (error: any) {
    console.error('Error fetching NCR details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch NCR details', details: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/quality/ncrs/[id] - Update NCR
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const client = await pool.connect();
  
  try {
    const routeParams = await context.params;
    const ncrId = parseInt(routeParams.id);
    if (isNaN(ncrId)) {
      return NextResponse.json({ error: 'Invalid NCR ID' }, { status: 400 });
    }

    const body = await request.json();
    const {
      title,
      description,
      severity,
      status,
      containment_action,
      containment_date,
      disposition,
      quantity_affected,
      cost_impact,
      assigned_to,
      root_causes = [], // Array of 5 Whys
      actions = [], // Array of corrective actions
    } = body;

    await client.query('BEGIN');

    // Build update query dynamically
    const updates: string[] = [];
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (title !== undefined) {
      updates.push(`title = $${paramIndex++}`);
      queryParams.push(title);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      queryParams.push(description);
    }
    if (severity !== undefined) {
      updates.push(`severity = $${paramIndex++}`);
      queryParams.push(severity);
    }
    if (status !== undefined) {
      updates.push(`status = $${paramIndex++}`);
      queryParams.push(status);
    }
    if (containment_action !== undefined) {
      updates.push(`containment_action = $${paramIndex++}`);
      queryParams.push(containment_action);
    }
    if (containment_date !== undefined) {
      updates.push(`containment_date = $${paramIndex++}`);
      queryParams.push(containment_date);
    }
    if (disposition !== undefined) {
      updates.push(`disposition = $${paramIndex++}`);
      queryParams.push(disposition);
    }
    if (quantity_affected !== undefined) {
      updates.push(`quantity_affected = $${paramIndex++}`);
      queryParams.push(quantity_affected);
    }
    if (cost_impact !== undefined) {
      updates.push(`cost_impact = $${paramIndex++}`);
      queryParams.push(cost_impact);
    }
    if (assigned_to !== undefined) {
      updates.push(`assigned_to = $${paramIndex++}`);
      queryParams.push(assigned_to);
    }

    if (updates.length > 0) {
      updates.push(`updated_at = CURRENT_TIMESTAMP`);
      queryParams.push(ncrId);
      
      const updateQuery = `
        UPDATE ncrs
        SET ${updates.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;
      
      await client.query(updateQuery, queryParams);
    }

    // Add root causes if provided
    if (root_causes.length > 0) {
      for (const rc of root_causes) {
        await client.query(`
          INSERT INTO ncr_root_causes (
            ncr_id,
            why_level,
            question,
            answer,
            is_root_cause,
            category,
            created_by
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
          ncrId,
          rc.why_level,
          rc.question,
          rc.answer,
          rc.is_root_cause || false,
          rc.category,
          rc.created_by || 1, // Default user
        ]);
      }
    }

    // Add actions if provided
    if (actions.length > 0) {
      for (const action of actions) {
        await client.query(`
          INSERT INTO ncr_actions (
            ncr_id,
            action_type,
            description,
            assigned_to,
            due_date,
            created_by
          ) VALUES ($1, $2, $3, $4, $5, $6)
        `, [
          ncrId,
          action.action_type,
          action.description,
          action.assigned_to,
          action.due_date,
          action.created_by || 1,
        ]);
      }
    }

    await client.query('COMMIT');

    // Fetch updated NCR with all data
    const updatedNcr = await client.query('SELECT * FROM ncrs WHERE id = $1', [ncrId]);

    return NextResponse.json({
      message: 'NCR updated successfully',
      ncr: updatedNcr.rows[0],
      root_causes_added: root_causes.length,
      actions_added: actions.length,
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error updating NCR:', error);
    return NextResponse.json(
      { error: 'Failed to update NCR', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// DELETE /api/quality/ncrs/[id] - Delete NCR (soft delete by setting status to cancelled)
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const ncrId = parseInt(params.id);
    if (isNaN(ncrId)) {
      return NextResponse.json({ error: 'Invalid NCR ID' }, { status: 400 });
    }

    const result = await pool.query(`
      UPDATE ncrs
      SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `, [ncrId]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'NCR not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'NCR cancelled successfully',
      ncr: result.rows[0],
    });
  } catch (error: any) {
    console.error('Error deleting NCR:', error);
    return NextResponse.json(
      { error: 'Failed to delete NCR', details: error.message },
      { status: 500 }
    );
  }
}
