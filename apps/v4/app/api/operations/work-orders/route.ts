import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET - List work orders or get single work order
export async function GET(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const status = searchParams.get('status');
    const product_id = searchParams.get('product_id');
    const production_line_id = searchParams.get('production_line_id');
    const limit = searchParams.get('limit') || '100';
    const search = searchParams.get('search');

    // Get single work order with details
    if (id) {
      const woQuery = `
        SELECT 
          wo.*,
          p.name as product_name_full,
          p.sku as product_code_full,
          pl.line_name as production_line_name,
          w.name as warehouse_name,
          b.product_name as bom_product_name,
          b.version as bom_version,
          u1.first_name || ' ' || u1.last_name as created_by_name,
          u2.first_name || ' ' || u2.last_name as approved_by_name
        FROM work_orders wo
        LEFT JOIN products p ON wo.product_id = p.id
        LEFT JOIN production_lines pl ON wo.production_line_id = pl.id
        LEFT JOIN warehouses w ON wo.warehouse_id = w.id
        LEFT JOIN bill_of_materials b ON wo.bom_id = b.id
        LEFT JOIN users u1 ON wo.created_by = u1.id
        LEFT JOIN users u2 ON wo.approved_by = u2.id
        WHERE wo.id = $1
      `;
      
      const woResult = await client.query(woQuery, [id]);
      
      if (woResult.rows.length === 0) {
        return NextResponse.json({ error: 'Work order not found' }, { status: 404 });
      }

      // Get work order items (materials)
      const itemsQuery = `
        SELECT 
          woi.*,
          p.name as product_name_full,
          p.sku as product_code_full,
          p.current_stock,
          w.name as warehouse_name
        FROM work_order_items woi
        LEFT JOIN products p ON woi.product_id = p.id
        LEFT JOIN warehouses w ON woi.warehouse_id = w.id
        WHERE woi.work_order_id = $1
        ORDER BY woi.id
      `;
      
      const itemsResult = await client.query(itemsQuery, [id]);

      // Get operations
      const operationsQuery = `
        SELECT *
        FROM work_order_operations
        WHERE work_order_id = $1
        ORDER BY sequence_number
      `;
      
      const operationsResult = await client.query(operationsQuery, [id]);

      // Get material consumption history
      const consumptionQuery = `
        SELECT 
          mc.*,
          p.name as product_name_full,
          u.first_name || ' ' || u.last_name as consumed_by_name
        FROM material_consumption mc
        LEFT JOIN products p ON mc.product_id = p.id
        LEFT JOIN users u ON mc.consumed_by = u.id
        WHERE mc.work_order_id = $1
        ORDER BY mc.consumption_date DESC
      `;
      
      const consumptionResult = await client.query(consumptionQuery, [id]);

      // Get history
      const historyQuery = `
        SELECT 
          woh.*,
          u.first_name || ' ' || u.last_name as changed_by_name
        FROM work_order_history woh
        LEFT JOIN users u ON woh.changed_by = u.id
        WHERE woh.work_order_id = $1
        ORDER BY woh.changed_at DESC
      `;
      
      const historyResult = await client.query(historyQuery, [id]);

      return NextResponse.json({
        ...woResult.rows[0],
        items: itemsResult.rows,
        operations: operationsResult.rows,
        consumption: consumptionResult.rows,
        history: historyResult.rows,
      });
    }

    // List work orders with filters
    let query = `
      SELECT 
        wo.id,
        wo.wo_number,
        wo.product_id,
        wo.product_name,
        wo.product_code,
        wo.quantity_to_produce,
        wo.quantity_produced,
        wo.quantity_scrapped,
        wo.unit_of_measure,
        wo.planned_start_date,
        wo.planned_end_date,
        wo.actual_start_date,
        wo.actual_end_date,
        wo.status,
        wo.priority,
        wo.production_line_id,
        pl.line_name as production_line_name,
        wo.material_cost,
        wo.labor_cost,
        wo.total_cost,
        wo.created_at,
        wo.created_by,
        u.first_name || ' ' || u.last_name as created_by_name,
        (SELECT COUNT(*) FROM work_order_items WHERE work_order_id = wo.id) as item_count,
        (SELECT COUNT(*) FROM work_order_operations WHERE work_order_id = wo.id) as operation_count
      FROM work_orders wo
      LEFT JOIN production_lines pl ON wo.production_line_id = pl.id
      LEFT JOIN users u ON wo.created_by = u.id
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramCount = 1;

    if (status) {
      query += ` AND wo.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (product_id) {
      query += ` AND wo.product_id = $${paramCount}`;
      params.push(product_id);
      paramCount++;
    }

    if (production_line_id) {
      query += ` AND wo.production_line_id = $${paramCount}`;
      params.push(production_line_id);
      paramCount++;
    }

    if (search) {
      query += ` AND (wo.wo_number ILIKE $${paramCount} OR wo.product_name ILIKE $${paramCount} OR wo.product_code ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    query += ` ORDER BY wo.created_at DESC LIMIT $${paramCount}`;
    params.push(parseInt(limit));

    const result = await client.query(query, params);

    return NextResponse.json(result.rows);

  } catch (error: any) {
    console.error('Error fetching work orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch work orders', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// POST - Create new work order
export async function POST(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const body = await request.json();
    const {
      product_id,
      quantity_to_produce,
      planned_start_date,
      planned_end_date,
      priority = 'normal',
      production_line_id,
      warehouse_id,
      work_center,
      notes,
      special_instructions,
      created_by = 1, // TODO: Get from auth session
      auto_load_bom = true,
    } = body;

    await client.query('BEGIN');

    // Get product details
    const productQuery = `
      SELECT id, name, sku, unit_of_measure, category_id
      FROM products
      WHERE id = $1
    `;
    const productResult = await client.query(productQuery, [product_id]);
    
    if (productResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const product = productResult.rows[0];

    // Find active BOM for this product
    let bom_id = null;
    if (auto_load_bom) {
      const bomQuery = `
        SELECT b.id, b.version, b.total_cost
        FROM bill_of_materials b
        WHERE b.product_code = $1 AND b.status = 'active'
        ORDER BY b.version DESC
        LIMIT 1
      `;
      const bomResult = await client.query(bomQuery, [product.sku]);
      if (bomResult.rows.length > 0) {
        bom_id = bomResult.rows[0].id;
      }
    }

    // Generate work order number
    const woNumberQuery = `
      SELECT COALESCE(MAX(CAST(SUBSTRING(wo_number FROM 3) AS INTEGER)), 0) + 1 as next_number
      FROM work_orders
      WHERE wo_number ~ '^WO[0-9]+$'
    `;
    const woNumberResult = await client.query(woNumberQuery);
    const wo_number = `WO${woNumberResult.rows[0].next_number.toString().padStart(6, '0')}`;

    // Create work order
    const woInsertQuery = `
      INSERT INTO work_orders (
        wo_number, product_id, product_name, product_code, bom_id,
        quantity_to_produce, unit_of_measure,
        planned_start_date, planned_end_date,
        status, priority,
        production_line_id, warehouse_id, work_center,
        notes, special_instructions, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `;

    const woResult = await client.query(woInsertQuery, [
      wo_number,
      product_id,
      product.name,
      product.sku,
      bom_id,
      quantity_to_produce,
      product.unit_of_measure,
      planned_start_date,
      planned_end_date,
      'draft',
      priority,
      production_line_id,
      warehouse_id,
      work_center,
      notes,
      special_instructions,
      created_by,
    ]);

    const work_order = woResult.rows[0];

    // Load BOM items if BOM exists
    if (bom_id) {
      const bomItemsQuery = `
        SELECT 
          bi.id as bom_item_id,
          p.id as product_id,
          p.name as product_name,
          p.sku as product_code,
          bi.quantity as quantity_per_unit,
          0 as scrap_factor,
          bi.unit_cost,
          p.unit_of_measure,
          p.current_stock as quantity_available
        FROM bom_items bi
        JOIN products p ON bi.component_code = p.sku
        WHERE bi.bom_id = $1
      `;
      
      const bomItemsResult = await client.query(bomItemsQuery, [bom_id]);

      // Insert work order items
      for (const bomItem of bomItemsResult.rows) {
        const quantity_required = bomItem.quantity_per_unit * quantity_to_produce;
        const is_available = bomItem.quantity_available >= quantity_required;

        await client.query(`
          INSERT INTO work_order_items (
            work_order_id, product_id, product_name, product_code,
            bom_item_id, quantity_per_unit, quantity_required,
            quantity_available, is_available,
            unit_of_measure, unit_cost, total_cost,
            scrap_factor, warehouse_id
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        `, [
          work_order.id,
          bomItem.product_id,
          bomItem.product_name,
          bomItem.product_code,
          bomItem.bom_item_id,
          bomItem.quantity_per_unit,
          quantity_required,
          bomItem.quantity_available,
          is_available,
          bomItem.unit_of_measure,
          bomItem.unit_cost,
          bomItem.unit_cost * quantity_required,
          bomItem.scrap_factor,
          warehouse_id,
        ]);
      }

      // Calculate material cost
      const materialCostResult = await client.query(`
        SELECT COALESCE(SUM(total_cost), 0) as material_cost
        FROM work_order_items
        WHERE work_order_id = $1
      `, [work_order.id]);

      await client.query(`
        UPDATE work_orders
        SET material_cost = $1, total_cost = $1
        WHERE id = $2
      `, [materialCostResult.rows[0].material_cost, work_order.id]);
    }

    await client.query('COMMIT');

    // Fetch complete work order with items
    const completeWoQuery = `
      SELECT wo.*, 
        (SELECT json_agg(woi.*) FROM work_order_items woi WHERE woi.work_order_id = wo.id) as items
      FROM work_orders wo
      WHERE wo.id = $1
    `;
    const completeWo = await client.query(completeWoQuery, [work_order.id]);

    return NextResponse.json(completeWo.rows[0], { status: 201 });

  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error creating work order:', error);
    return NextResponse.json(
      { error: 'Failed to create work order', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// PATCH - Update work order (status, quantities, etc.)
export async function PATCH(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const body = await request.json();
    const { id, action, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Work order ID is required' }, { status: 400 });
    }

    await client.query('BEGIN');

    // Handle specific actions
    if (action === 'start') {
      // Start production
      await client.query(`
        UPDATE work_orders
        SET status = 'in_progress',
            actual_start_date = CURRENT_TIMESTAMP
        WHERE id = $1
      `, [id]);

      // Reserve materials
      await client.query(`
        UPDATE work_order_items
        SET quantity_reserved = quantity_required
        WHERE work_order_id = $1
      `, [id]);

    } else if (action === 'complete') {
      // Complete work order
      const { quantity_produced, quantity_scrapped = 0 } = updates;

      await client.query(`
        UPDATE work_orders
        SET status = 'completed',
            actual_end_date = CURRENT_TIMESTAMP,
            quantity_produced = $1,
            quantity_scrapped = $2
        WHERE id = $3
      `, [quantity_produced, quantity_scrapped, id]);

      // Add finished goods to inventory
      const woData = await client.query(`
        SELECT product_id, warehouse_id
        FROM work_orders
        WHERE id = $1
      `, [id]);

      if (woData.rows.length > 0) {
        await client.query(`
          UPDATE products
          SET current_stock = current_stock + $1
          WHERE id = $2
        `, [quantity_produced, woData.rows[0].product_id]);
      }

    } else if (action === 'cancel') {
      await client.query(`
        UPDATE work_orders
        SET status = 'cancelled'
        WHERE id = $1
      `, [id]);

    } else {
      // General update
      const fields = Object.keys(updates);
      const values = Object.values(updates);
      
      if (fields.length === 0) {
        await client.query('ROLLBACK');
        return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
      }

      const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
      const query = `
        UPDATE work_orders
        SET ${setClause}
        WHERE id = $${fields.length + 1}
        RETURNING *
      `;

      await client.query(query, [...values, id]);
    }

    await client.query('COMMIT');

    // Return updated work order
    const result = await client.query('SELECT * FROM work_orders WHERE id = $1', [id]);
    return NextResponse.json(result.rows[0]);

  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error updating work order:', error);
    return NextResponse.json(
      { error: 'Failed to update work order', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// DELETE - Delete work order (only drafts)
export async function DELETE(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Work order ID is required' }, { status: 400 });
    }

    // Check if work order is in draft status
    const checkQuery = 'SELECT status FROM work_orders WHERE id = $1';
    const checkResult = await client.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return NextResponse.json({ error: 'Work order not found' }, { status: 404 });
    }

    if (checkResult.rows[0].status !== 'draft') {
      return NextResponse.json(
        { error: 'Only draft work orders can be deleted' },
        { status: 400 }
      );
    }

    await client.query('DELETE FROM work_orders WHERE id = $1', [id]);

    return NextResponse.json({ message: 'Work order deleted successfully' });

  } catch (error: any) {
    console.error('Error deleting work order:', error);
    return NextResponse.json(
      { error: 'Failed to delete work order', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
