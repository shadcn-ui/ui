import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET - Fetch PR items
export async function GET(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const { searchParams } = new URL(request.url);
    const prId = searchParams.get('pr_id');
    
    if (!prId) {
      return NextResponse.json({ error: 'PR ID is required' }, { status: 400 });
    }
    
    const query = `
      SELECT 
        pri.*,
        p.name as product_name,
        p.sku as product_sku
      FROM purchase_requisition_items pri
      LEFT JOIN products p ON pri.product_id = p.id
      WHERE pri.pr_id = $1
      ORDER BY pri.id
    `;
    
    const result = await client.query(query, [prId]);
    
    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error('Error fetching PR items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch PR items', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// POST - Add PR item
export async function POST(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const body = await request.json();
    
    await client.query('BEGIN');
    
    const result = await client.query(
      `INSERT INTO purchase_requisition_items (
        pr_id, product_id, description, quantity, unit, estimated_unit_price, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        body.pr_id,
        body.product_id,
        body.description,
        body.quantity,
        body.unit,
        body.estimated_unit_price,
        body.notes
      ]
    );
    
    // Update PR total
    const totalResult = await client.query(
      'SELECT COALESCE(SUM(estimated_total), 0) as total FROM purchase_requisition_items WHERE pr_id = $1',
      [body.pr_id]
    );
    
    await client.query(
      'UPDATE purchase_requisitions SET total_estimated_cost = $1, updated_at = NOW() WHERE id = $2',
      [totalResult.rows[0].total, body.pr_id]
    );
    
    await client.query('COMMIT');
    
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error adding PR item:', error);
    return NextResponse.json(
      { error: 'Failed to add PR item', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// PATCH - Update PR item
export async function PATCH(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const body = await request.json();
    const { id, pr_id, ...updates } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }
    
    await client.query('BEGIN');
    
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
      updateValues.push(id);
      
      const query = `
        UPDATE purchase_requisition_items 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
      `;
      
      const result = await client.query(query, updateValues);
      
      // Update PR total if pr_id is known
      if (pr_id) {
        const totalResult = await client.query(
          'SELECT COALESCE(SUM(estimated_total), 0) as total FROM purchase_requisition_items WHERE pr_id = $1',
          [pr_id]
        );
        
        await client.query(
          'UPDATE purchase_requisitions SET total_estimated_cost = $1, updated_at = NOW() WHERE id = $2',
          [totalResult.rows[0].total, pr_id]
        );
      }
      
      await client.query('COMMIT');
      
      return NextResponse.json(result.rows[0]);
    }
    
    await client.query('COMMIT');
    return NextResponse.json({ message: 'No updates provided' });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error updating PR item:', error);
    return NextResponse.json(
      { error: 'Failed to update PR item', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// DELETE - Delete PR item
export async function DELETE(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const prId = searchParams.get('pr_id');
    
    if (!id || !prId) {
      return NextResponse.json({ error: 'Item ID and PR ID are required' }, { status: 400 });
    }
    
    await client.query('BEGIN');
    
    await client.query('DELETE FROM purchase_requisition_items WHERE id = $1', [id]);
    
    // Update PR total
    const totalResult = await client.query(
      'SELECT COALESCE(SUM(estimated_total), 0) as total FROM purchase_requisition_items WHERE pr_id = $1',
      [prId]
    );
    
    await client.query(
      'UPDATE purchase_requisitions SET total_estimated_cost = $1, updated_at = NOW() WHERE id = $2',
      [totalResult.rows[0].total, prId]
    );
    
    await client.query('COMMIT');
    
    return NextResponse.json({ message: 'PR item deleted successfully' });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error deleting PR item:', error);
    return NextResponse.json(
      { error: 'Failed to delete PR item', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
