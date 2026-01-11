import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET - Fetch supplier quotations
export async function GET(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const { searchParams } = new URL(request.url);
    const rfqId = searchParams.get('rfq_id');
    const supplierId = searchParams.get('supplier_id');
    const status = searchParams.get('status');
    
    let query = `
      SELECT 
        sq.*,
        s.company_name as supplier_name,
        s.contact_person,
        s.email as supplier_email,
        rfq.rfq_number,
        rfq.title as rfq_title
      FROM supplier_quotations sq
      LEFT JOIN suppliers s ON sq.supplier_id = s.id
      LEFT JOIN rfq_requests rfq ON sq.rfq_id = rfq.id
    `;
    
    const conditions: string[] = [];
    const params: any[] = [];
    
    if (rfqId) {
      params.push(rfqId);
      conditions.push(`sq.rfq_id = $${params.length}`);
    }
    
    if (supplierId) {
      params.push(supplierId);
      conditions.push(`sq.supplier_id = $${params.length}`);
    }
    
    if (status) {
      params.push(status);
      conditions.push(`sq.status = $${params.length}`);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY sq.created_at DESC';
    
    const result = await client.query(query, params);
    
    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error('Error fetching quotations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quotations', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// POST - Create new quotation
export async function POST(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const body = await request.json();
    
    await client.query('BEGIN');
    
    // Insert quotation
    const quotationResult = await client.query(
      `INSERT INTO supplier_quotations (
        rfq_id, supplier_id, quote_number, quote_date, valid_until,
        currency, subtotal, tax_amount, shipping_cost, total_amount,
        payment_terms, delivery_time, status, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [
        body.rfq_id,
        body.supplier_id,
        body.quote_number,
        body.quote_date || new Date().toISOString().split('T')[0],
        body.valid_until,
        body.currency || 'IDR',
        body.subtotal || 0,
        body.tax_amount || 0,
        body.shipping_cost || 0,
        body.total_amount || 0,
        body.payment_terms,
        body.delivery_time,
        body.status || 'received',
        body.notes
      ]
    );
    
    const quotation = quotationResult.rows[0];
    
    // Update RFQ supplier status
    await client.query(
      `UPDATE rfq_suppliers 
       SET status = 'responded'
       WHERE rfq_id = $1 AND supplier_id = $2`,
      [body.rfq_id, body.supplier_id]
    );
    
    // Update RFQ status to 'receiving_quotes'
    await client.query(
      `UPDATE rfq_requests 
       SET status = 'receiving_quotes'
       WHERE id = $1 AND status = 'sent'`,
      [body.rfq_id]
    );
    
    // Add price history for products
    if (body.items && body.items.length > 0) {
      for (const item of body.items) {
        if (item.product_id) {
          await client.query(
            `INSERT INTO product_price_history (product_id, supplier_id, price, source, source_id)
             VALUES ($1, $2, $3, 'quotation', $4)`,
            [item.product_id, body.supplier_id, item.unit_price, quotation.id]
          );
        }
      }
    }
    
    await client.query('COMMIT');
    
    return NextResponse.json(quotation, { status: 201 });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error creating quotation:', error);
    return NextResponse.json(
      { error: 'Failed to create quotation', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// PATCH - Update quotation (evaluation, acceptance)
export async function PATCH(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const body = await request.json();
    const { id, action, ...updates } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'Quotation ID is required' }, { status: 400 });
    }
    
    await client.query('BEGIN');
    
    if (action === 'evaluate') {
      await client.query(
        `UPDATE supplier_quotations 
         SET status = 'under_review', 
             evaluation_score = $1, 
             evaluation_notes = $2,
             updated_at = NOW()
         WHERE id = $3`,
        [updates.evaluation_score, updates.evaluation_notes, id]
      );
    } else if (action === 'accept') {
      await client.query(
        `UPDATE supplier_quotations 
         SET status = 'accepted', updated_at = NOW()
         WHERE id = $1`,
        [id]
      );
      
      // Reject other quotations for the same RFQ
      const quotationData = await client.query(
        'SELECT rfq_id FROM supplier_quotations WHERE id = $1',
        [id]
      );
      
      if (quotationData.rows.length > 0) {
        await client.query(
          `UPDATE supplier_quotations 
           SET status = 'rejected'
           WHERE rfq_id = $1 AND id != $2 AND status != 'rejected'`,
          [quotationData.rows[0].rfq_id, id]
        );
        
        // Update RFQ status to completed
        await client.query(
          `UPDATE rfq_requests 
           SET status = 'completed', updated_at = NOW()
           WHERE id = $1`,
          [quotationData.rows[0].rfq_id]
        );
      }
    } else if (action === 'reject') {
      await client.query(
        `UPDATE supplier_quotations 
         SET status = 'rejected', updated_at = NOW()
         WHERE id = $1`,
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
          UPDATE supplier_quotations 
          SET ${updateFields.join(', ')}
          WHERE id = $${paramCount}
          RETURNING *
        `;
        
        await client.query(query, updateValues);
      }
    }
    
    await client.query('COMMIT');
    
    const result = await client.query('SELECT * FROM supplier_quotations WHERE id = $1', [id]);
    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error updating quotation:', error);
    return NextResponse.json(
      { error: 'Failed to update quotation', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// DELETE - Delete quotation
export async function DELETE(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Quotation ID is required' }, { status: 400 });
    }
    
    await client.query('DELETE FROM supplier_quotations WHERE id = $1', [id]);
    
    return NextResponse.json({ message: 'Quotation deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting quotation:', error);
    return NextResponse.json(
      { error: 'Failed to delete quotation', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
