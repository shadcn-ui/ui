import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET - Fetch all purchase requisitions
export async function GET(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const department = searchParams.get('department');
    
    let query = `
      SELECT 
        pr.*,
        CONCAT(u.first_name, ' ', u.last_name) as requested_by_name,
        u.email as requested_by_email,
        CONCAT(a.first_name, ' ', a.last_name) as approved_by_name,
        COUNT(pri.id) as item_count,
        COALESCE(SUM(pri.estimated_total), 0) as total_estimated_cost_calc
      FROM purchase_requisitions pr
      LEFT JOIN users u ON pr.requested_by = u.id
      LEFT JOIN users a ON pr.approved_by = a.id
      LEFT JOIN purchase_requisition_items pri ON pr.id = pri.pr_id
    `;
    
    const conditions: string[] = [];
    const params: any[] = [];
    
    if (status) {
      params.push(status);
      conditions.push(`pr.status = $${params.length}`);
    }
    
    if (department) {
      params.push(department);
      conditions.push(`pr.department ILIKE $${params.length}`);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += `
      GROUP BY pr.id, u.id, u.first_name, u.last_name, u.email, a.id, a.first_name, a.last_name
      ORDER BY pr.created_at DESC
    `;
    
    const result = await client.query(query, params);
    
    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error('Error fetching purchase requisitions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch purchase requisitions', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// POST - Create new purchase requisition
export async function POST(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const body = await request.json();
    
    await client.query('BEGIN');
    
    // Generate PR number
    const prCountResult = await client.query(
      "SELECT COUNT(*) as count FROM purchase_requisitions WHERE pr_number LIKE 'PR-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-%'"
    );
    const prCount = parseInt(prCountResult.rows[0].count) + 1;
    const prNumber = `PR-${new Date().getFullYear()}-${String(prCount).padStart(5, '0')}`;
    
    // Insert PR
    const prResult = await client.query(
      `INSERT INTO purchase_requisitions (
        pr_number, requested_by, department, purpose, priority, status,
        required_date, justification, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        prNumber,
        body.requested_by || 1,
        body.department,
        body.purpose,
        body.priority || 'medium',
        body.status || 'draft',
        body.required_date,
        body.justification,
        body.notes
      ]
    );
    
    const pr = prResult.rows[0];
    
    // Insert PR items if provided
    if (body.items && body.items.length > 0) {
      for (const item of body.items) {
        await client.query(
          `INSERT INTO purchase_requisition_items (
            pr_id, product_id, description, quantity, unit, estimated_unit_price, notes
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            pr.id,
            item.product_id,
            item.description,
            item.quantity,
            item.unit,
            item.estimated_unit_price,
            item.notes
          ]
        );
      }
      
      // Update total estimated cost
      const totalResult = await client.query(
        'SELECT COALESCE(SUM(estimated_total), 0) as total FROM purchase_requisition_items WHERE pr_id = $1',
        [pr.id]
      );
      
      await client.query(
        'UPDATE purchase_requisitions SET total_estimated_cost = $1 WHERE id = $2',
        [totalResult.rows[0].total, pr.id]
      );
    }
    
    await client.query('COMMIT');
    
    return NextResponse.json(pr, { status: 201 });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error creating purchase requisition:', error);
    return NextResponse.json(
      { error: 'Failed to create purchase requisition', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// PATCH - Update purchase requisition
export async function PATCH(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const body = await request.json();
    const { id, action, ...updates } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'PR ID is required' }, { status: 400 });
    }
    
    await client.query('BEGIN');
    
    // Handle approval/rejection actions
    if (action === 'approve') {
      await client.query(
        `UPDATE purchase_requisitions 
         SET status = 'approved', approved_by = $1, approval_date = NOW(), updated_at = NOW()
         WHERE id = $2`,
        [updates.approved_by || 1, id]
      );
      
      // Log approval
      await client.query(
        `INSERT INTO approval_history (document_type, document_id, approval_level, approver_id, action, comments)
         VALUES ('PR', $1, $2, $3, 'approved', $4)`,
        [id, updates.approval_level || 1, updates.approved_by || 1, updates.comments]
      );
    } else if (action === 'reject') {
      await client.query(
        `UPDATE purchase_requisitions 
         SET status = 'rejected', rejection_reason = $1, updated_at = NOW()
         WHERE id = $2`,
        [updates.rejection_reason, id]
      );
      
      // Log rejection
      await client.query(
        `INSERT INTO approval_history (document_type, document_id, approval_level, approver_id, action, comments)
         VALUES ('PR', $1, $2, $3, 'rejected', $4)`,
        [id, updates.approval_level || 1, updates.rejected_by || 1, updates.rejection_reason]
      );
    } else {
      // Regular update
      const updateFields: string[] = [];
      const updateValues: any[] = [];
      let paramCount = 1;
      
      for (const [key, value] of Object.entries(updates)) {
        if (value !== undefined) {
          updateFields.push(`${key} = $${paramCount}`);
          updateValues.push(value);
          paramCount++;
        }
      }
      
      if (updateFields.length > 0) {
        updateFields.push(`updated_at = NOW()`);
        updateValues.push(id);
        
        const query = `
          UPDATE purchase_requisitions 
          SET ${updateFields.join(', ')}
          WHERE id = $${paramCount}
          RETURNING *
        `;
        
        const result = await client.query(query, updateValues);
        await client.query('COMMIT');
        
        return NextResponse.json(result.rows[0]);
      }
    }
    
    await client.query('COMMIT');
    
    const result = await client.query('SELECT * FROM purchase_requisitions WHERE id = $1', [id]);
    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error updating purchase requisition:', error);
    return NextResponse.json(
      { error: 'Failed to update purchase requisition', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// DELETE - Delete purchase requisition
export async function DELETE(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'PR ID is required' }, { status: 400 });
    }
    
    // Check if PR can be deleted (only draft or cancelled)
    const checkResult = await client.query(
      'SELECT status FROM purchase_requisitions WHERE id = $1',
      [id]
    );
    
    if (checkResult.rows.length === 0) {
      return NextResponse.json({ error: 'Purchase requisition not found' }, { status: 404 });
    }
    
    const status = checkResult.rows[0].status;
    if (!['draft', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { error: 'Only draft or cancelled requisitions can be deleted' },
        { status: 400 }
      );
    }
    
    await client.query('DELETE FROM purchase_requisitions WHERE id = $1', [id]);
    
    return NextResponse.json({ message: 'Purchase requisition deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting purchase requisition:', error);
    return NextResponse.json(
      { error: 'Failed to delete purchase requisition', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
