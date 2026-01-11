import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * POST /api/operations/mrp/calculate
 * Run MRP calculation for work orders
 * 
 * Body:
 * - work_order_id?: number (optional - if provided, calculate for specific WO, else calculate for all open WOs)
 * - user_id?: number (optional - user running the calculation)
 */
export async function POST(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const body = await request.json();
    const { work_order_id, user_id } = body;

    // Create MRP calculation record
    const startTime = Date.now();
    const mrpCalcResult = await client.query(`
      INSERT INTO mrp_calculations (
        work_order_id, 
        run_by, 
        scope, 
        status, 
        run_date
      )
      VALUES ($1, $2, $3, 'running', CURRENT_TIMESTAMP)
      RETURNING id
    `, [
      work_order_id || null,
      user_id || null,
      work_order_id ? 'specific_wo' : 'all'
    ]);

    const mrpCalculationId = mrpCalcResult.rows[0].id;

    // Get work orders to check
    const workOrdersQuery = work_order_id
      ? `SELECT id, wo_number, planned_start_date FROM work_orders WHERE id = $1`
      : `SELECT id, wo_number, planned_start_date FROM work_orders WHERE status IN ('draft', 'ready', 'released')`;
    
    const workOrdersParams = work_order_id ? [work_order_id] : [];
    const workOrdersResult = await client.query(workOrdersQuery, workOrdersParams);
    const workOrders = workOrdersResult.rows;

    let totalItemsChecked = 0;
    let totalShortagesFound = 0;
    const shortagesByWo: { [key: string]: any[] } = {};

    // Check each work order
    for (const wo of workOrders) {
      // Get materials required for this work order
      const materialsQuery = `
        SELECT 
          wom.id as work_order_material_id,
          wom.work_order_id,
          wom.product_id,
          wom.required_quantity,
          wom.reserved_quantity,
          p.name as product_name,
          p.sku as product_code,
          p.current_stock,
          COALESCE(
            (SELECT SUM(reserved_quantity) 
             FROM material_reservations 
             WHERE product_id = wom.product_id 
             AND status = 'active'), 
            0
          ) as total_reserved,
          p.min_stock_level
        FROM work_order_materials wom
        JOIN products p ON p.id = wom.product_id
        WHERE wom.work_order_id = $1
      `;
      
      const materialsResult = await client.query(materialsQuery, [wo.id]);
      const materials = materialsResult.rows;
      
      totalItemsChecked += materials.length;

      // Check availability for each material
      for (const material of materials) {
        const availableQty = material.current_stock || 0;
        const totalReserved = parseFloat(material.total_reserved) || 0;
        const minStockLevel = material.min_stock_level || 0;
        const freeQty = availableQty - totalReserved - minStockLevel;
        const requiredQty = parseFloat(material.required_quantity) || 0;
        const shortageQty = Math.max(requiredQty - freeQty, 0);

        if (shortageQty > 0) {
          // Insert shortage record
          await client.query(`
            INSERT INTO mrp_shortage_items (
              mrp_calculation_id,
              work_order_id,
              product_id,
              required_quantity,
              available_quantity,
              reserved_quantity,
              shortage_quantity,
              required_date,
              recommendation,
              status
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'open')
          `, [
            mrpCalculationId,
            wo.id,
            material.product_id,
            requiredQty,
            availableQty,
            totalReserved,
            shortageQty,
            wo.planned_start_date,
            shortageQty > 0 ? 'purchase' : 'sufficient'
          ]);

          totalShortagesFound++;

          // Track shortages by WO for summary
          if (!shortagesByWo[wo.wo_number]) {
            shortagesByWo[wo.wo_number] = [];
          }
          shortagesByWo[wo.wo_number].push({
            product_code: material.product_code,
            product_name: material.product_name,
            required: requiredQty,
            available: freeQty,
            shortage: shortageQty
          });
        }
      }
    }

    const executionTime = (Date.now() - startTime) / 1000;

    // Update MRP calculation with results
    const summaryData = {
      work_orders_checked: workOrders.length,
      total_items_checked: totalItemsChecked,
      total_shortages_found: totalShortagesFound,
      shortages_by_wo: shortagesByWo,
      execution_time_seconds: executionTime
    };

    await client.query(`
      UPDATE mrp_calculations
      SET 
        status = 'completed',
        total_items_checked = $1,
        total_shortages_found = $2,
        summary_data = $3,
        execution_time_seconds = $4,
        completed_at = CURRENT_TIMESTAMP
      WHERE id = $5
    `, [
      totalItemsChecked,
      totalShortagesFound,
      JSON.stringify(summaryData),
      executionTime,
      mrpCalculationId
    ]);

    // Get the complete calculation result
    const resultQuery = `
      SELECT 
        mc.*,
        u.first_name || ' ' || u.last_name as run_by_name
      FROM mrp_calculations mc
      LEFT JOIN users u ON mc.run_by = u.id
      WHERE mc.id = $1
    `;
    
    const resultData = await client.query(resultQuery, [mrpCalculationId]);

    // Get shortage items
    const shortagesQuery = `
      SELECT 
        msi.*,
        p.name as product_name,
        p.sku as product_code,
        wo.wo_number
      FROM mrp_shortage_items msi
      JOIN products p ON p.id = msi.product_id
      LEFT JOIN work_orders wo ON wo.id = msi.work_order_id
      WHERE msi.mrp_calculation_id = $1
      ORDER BY msi.shortage_quantity DESC
    `;
    
    const shortagesData = await client.query(shortagesQuery, [mrpCalculationId]);

    return NextResponse.json({
      success: true,
      message: `MRP calculation completed. Checked ${totalItemsChecked} items across ${workOrders.length} work orders. Found ${totalShortagesFound} shortages.`,
      calculation: resultData.rows[0],
      shortages: shortagesData.rows
    });

  } catch (error) {
    console.error('Error running MRP calculation:', error);
    return NextResponse.json(
      { error: 'Failed to run MRP calculation', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
