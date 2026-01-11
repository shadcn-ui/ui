import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET - Fetch all RFQ requests
export async function GET(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const prId = searchParams.get('pr_id');
    
    let query = `
      SELECT 
        rfq.*,
        pr.pr_number,
        pr.department,
        CONCAT(u.first_name, ' ', u.last_name) as created_by_name,
        COUNT(DISTINCT rfq_items.id) as item_count,
        COUNT(DISTINCT rfq_suppliers.id) as supplier_count,
        COUNT(DISTINCT sq.id) as quotation_count
      FROM rfq_requests rfq
      LEFT JOIN purchase_requisitions pr ON rfq.pr_id = pr.id
      LEFT JOIN users u ON rfq.created_by = u.id
      LEFT JOIN rfq_items ON rfq.id = rfq_items.rfq_id
      LEFT JOIN rfq_suppliers ON rfq.id = rfq_suppliers.rfq_id
      LEFT JOIN supplier_quotations sq ON rfq.id = sq.rfq_id
    `;
    
    const conditions: string[] = [];
    const params: any[] = [];
    
    if (status) {
      params.push(status);
      conditions.push(`rfq.status = $${params.length}`);
    }
    
    if (prId) {
      params.push(prId);
      conditions.push(`rfq.pr_id = $${params.length}`);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += `
      GROUP BY rfq.id, pr.id, pr.pr_number, pr.department, u.id, u.first_name, u.last_name
      ORDER BY rfq.created_at DESC
    `;
    
    const result = await client.query(query, params);
    
    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error('Error fetching RFQ requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch RFQ requests', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// POST - Create new RFQ request
export async function POST(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const body = await request.json();
    
    await client.query('BEGIN');
    
    // Generate RFQ number
    const rfqCountResult = await client.query(
      "SELECT COUNT(*) as count FROM rfq_requests WHERE rfq_number LIKE 'RFQ-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-%'"
    );
    const rfqCount = parseInt(rfqCountResult.rows[0].count) + 1;
    const rfqNumber = `RFQ-${new Date().getFullYear()}-${String(rfqCount).padStart(5, '0')}`;
    
    // Insert RFQ
    const rfqResult = await client.query(
      `INSERT INTO rfq_requests (
        rfq_number, pr_id, title, description, response_deadline,
        status, terms_and_conditions, created_by, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        rfqNumber,
        body.pr_id,
        body.title,
        body.description,
        body.response_deadline,
        body.status || 'draft',
        body.terms_and_conditions,
        body.created_by || 1,
        body.notes
      ]
    );
    
    const rfq = rfqResult.rows[0];
    
    // Insert RFQ items if provided
    if (body.items && body.items.length > 0) {
      for (const item of body.items) {
        await client.query(
          `INSERT INTO rfq_items (
            rfq_id, product_id, description, quantity, unit, specifications, notes
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            rfq.id,
            item.product_id,
            item.description,
            item.quantity,
            item.unit,
            item.specifications,
            item.notes
          ]
        );
      }
    }
    
    // Add suppliers if provided
    if (body.supplier_ids && body.supplier_ids.length > 0) {
      for (const supplierId of body.supplier_ids) {
        await client.query(
          `INSERT INTO rfq_suppliers (rfq_id, supplier_id, status)
           VALUES ($1, $2, 'pending')`,
          [rfq.id, supplierId]
        );
      }
    }
    
    await client.query('COMMIT');
    
    return NextResponse.json(rfq, { status: 201 });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error creating RFQ request:', error);
    return NextResponse.json(
      { error: 'Failed to create RFQ request', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// PATCH - Update RFQ request
export async function PATCH(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const body = await request.json();
    const { id, action, ...updates } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'RFQ ID is required' }, { status: 400 });
    }
    
    await client.query('BEGIN');
    
    // Handle special actions
    if (action === 'send') {
      await client.query(
        `UPDATE rfq_requests 
         SET status = 'sent', updated_at = NOW()
         WHERE id = $1`,
        [id]
      );
      
      // Update supplier statuses to 'sent'
      await client.query(
        `UPDATE rfq_suppliers 
         SET status = 'sent', sent_date = CURRENT_DATE
         WHERE rfq_id = $1 AND status = 'pending'`,
        [id]
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
          UPDATE rfq_requests 
          SET ${updateFields.join(', ')}
          WHERE id = $${paramCount}
          RETURNING *
        `;
        
        await client.query(query, updateValues);
      }
    }
    
    await client.query('COMMIT');
    
    const result = await client.query('SELECT * FROM rfq_requests WHERE id = $1', [id]);
    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error updating RFQ request:', error);
    return NextResponse.json(
      { error: 'Failed to update RFQ request', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// DELETE - Delete RFQ request
export async function DELETE(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'RFQ ID is required' }, { status: 400 });
    }
    
    // Check if RFQ can be deleted (only draft or cancelled)
    const checkResult = await client.query(
      'SELECT status FROM rfq_requests WHERE id = $1',
      [id]
    );
    
    if (checkResult.rows.length === 0) {
      return NextResponse.json({ error: 'RFQ request not found' }, { status: 404 });
    }
    
    const status = checkResult.rows[0].status;
    if (!['draft', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { error: 'Only draft or cancelled RFQs can be deleted' },
        { status: 400 }
      );
    }
    
    await client.query('DELETE FROM rfq_requests WHERE id = $1', [id]);
    
    return NextResponse.json({ message: 'RFQ request deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting RFQ request:', error);
    return NextResponse.json(
      { error: 'Failed to delete RFQ request', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
