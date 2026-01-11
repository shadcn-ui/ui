import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://mac@localhost:5432/ocean-erp',
});

// POST /api/quality/inspections/[id]/submit - Submit inspection
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const client = await pool.connect();
  
  try {
    const routeParams = await context.params;
    const inspectionId = parseInt(routeParams.id);
    const body = await request.json();

    if (isNaN(inspectionId)) {
      return NextResponse.json(
        { error: 'Invalid inspection ID' },
        { status: 400 }
      );
    }

    const { results = [], notes, submitted_by } = body;

    if (!submitted_by) {
      return NextResponse.json(
        { error: 'submitted_by is required' },
        { status: 400 }
      );
    }

    await client.query('BEGIN');

    // Check inspection exists
    const inspectionResult = await client.query(`
      SELECT * FROM inspections WHERE id = $1
    `, [inspectionId]);

    if (inspectionResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json(
        { error: 'Inspection not found' },
        { status: 404 }
      );
    }

    const inspection = inspectionResult.rows[0];

    // Add or update results
    for (const resultItem of results) {
      if (resultItem.id) {
        // Update existing result
        await client.query(`
          UPDATE inspection_results
          SET 
            measured_value = $1,
            result = $2,
            notes = $3
          WHERE id = $4 AND inspection_id = $5
        `, [
          resultItem.measured_value,
          resultItem.result,
          resultItem.notes,
          resultItem.id,
          inspectionId,
        ]);
      } else {
        // Insert new result
        await client.query(`
          INSERT INTO inspection_results (
            inspection_id,
            template_item_id,
            measured_value,
            result,
            notes
          ) VALUES ($1, $2, $3, $4, $5)
        `, [
          inspectionId,
          resultItem.template_item_id,
          resultItem.measured_value,
          resultItem.result,
          resultItem.notes,
        ]);
      }
    }

    // Calculate overall result
    const resultsCount = await client.query(`
      SELECT 
        COUNT(*) AS total_count,
        COUNT(CASE WHEN result = 'pass' THEN 1 END) AS pass_count,
        COUNT(CASE WHEN result = 'fail' THEN 1 END) AS fail_count
      FROM inspection_results
      WHERE inspection_id = $1
    `, [inspectionId]);

    const { total_count, pass_count, fail_count } = resultsCount.rows[0];
    const overallResult = parseInt(fail_count) > 0 ? 'rejected' : 'accepted';
    const quantityAccepted = overallResult === 'accepted' ? inspection.quantity_inspected : 0;
    const quantityRejected = overallResult === 'rejected' ? inspection.quantity_inspected : 0;

    // Update inspection
    await client.query(`
      UPDATE inspections
      SET 
        status = 'completed',
        overall_result = $1,
        quantity_accepted = $2,
        quantity_rejected = $3,
        notes = $4,
        completed_date = CURRENT_TIMESTAMP
      WHERE id = $5
    `, [
      overallResult,
      quantityAccepted,
      quantityRejected,
      notes,
      inspectionId,
    ]);

    await client.query('COMMIT');

    // Fetch updated inspection
    const updatedInspection = await client.query(`
      SELECT * FROM inspections WHERE id = $1
    `, [inspectionId]);

    return NextResponse.json({
      message: 'Inspection submitted successfully',
      inspection: updatedInspection.rows[0],
      overall_result: overallResult,
      statistics: {
        total_items: parseInt(total_count),
        passed: parseInt(pass_count),
        failed: parseInt(fail_count),
      },
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error submitting inspection:', error);
    return NextResponse.json(
      { error: 'Failed to submit inspection', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// GET /api/quality/inspections/[id]/submit - Get inspection details
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const routeParams = await context.params;
    const inspectionId = parseInt(routeParams.id);

    if (isNaN(inspectionId)) {
      return NextResponse.json(
        { error: 'Invalid inspection ID' },
        { status: 400 }
      );
    }

    // Fetch inspection with template items
    const inspectionResult = await pool.query(`
      SELECT 
        i.*,
        it.template_name,
        it.description AS template_description
      FROM inspections i
      LEFT JOIN inspection_templates it ON it.id = i.template_id
      WHERE i.id = $1
    `, [inspectionId]);

    if (inspectionResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Inspection not found' },
        { status: 404 }
      );
    }

    const inspection = inspectionResult.rows[0];

    // Fetch template items with results
    const itemsResult = await pool.query(`
      SELECT 
        ii.*,
        ir.id AS result_id,
        ir.measured_value,
        ir.result,
        ir.notes AS result_notes
      FROM inspection_items ii
      LEFT JOIN inspection_results ir ON ir.template_item_id = ii.id AND ir.inspection_id = $1
      WHERE ii.template_id = $2
      ORDER BY ii.item_sequence
    `, [inspectionId, inspection.template_id]);

    return NextResponse.json({
      inspection,
      items: itemsResult.rows,
    });
  } catch (error: any) {
    console.error('Error fetching inspection details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inspection details', details: error.message },
      { status: 500 }
    );
  }
}
