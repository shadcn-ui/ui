import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://mac@localhost:5432/ocean-erp',
});

// POST /api/quality/compliance/evidence - Upload compliance evidence
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      standard_id,
      requirement_id,
      evidence_type,
      evidence_title,
      evidence_description,
      document_id,
      reference_number,
      evidence_date,
      uploaded_by,
    } = body;

    if (!standard_id || !evidence_type || !evidence_title || !uploaded_by) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await pool.query(`
      INSERT INTO compliance_evidence (
        standard_id,
        requirement_id,
        evidence_type,
        evidence_title,
        evidence_description,
        document_id,
        reference_number,
        evidence_date,
        uploaded_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      standard_id,
      requirement_id,
      evidence_type,
      evidence_title,
      evidence_description,
      document_id,
      reference_number,
      evidence_date || new Date(),
      uploaded_by,
    ]);

    // Update requirement compliance status if linked
    if (requirement_id) {
      await pool.query(`
        UPDATE compliance_requirements
        SET 
          compliance_status = 'compliant',
          last_verified_date = CURRENT_TIMESTAMP
        WHERE id = $1
      `, [requirement_id]);
    }

    return NextResponse.json({
      message: 'Compliance evidence uploaded successfully',
      evidence: result.rows[0],
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error uploading compliance evidence:', error);
    return NextResponse.json(
      { error: 'Failed to upload compliance evidence', details: error.message },
      { status: 500 }
    );
  }
}

// GET /api/quality/compliance/evidence - List compliance evidence
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const standardId = searchParams.get('standard_id');
    const requirementId = searchParams.get('requirement_id');
    const evidenceType = searchParams.get('evidence_type');

    let query = `
      SELECT 
        ce.*,
        cs.standard_name,
        cr.requirement_number,
        cr.requirement_title
      FROM compliance_evidence ce
      JOIN compliance_standards cs ON cs.id = ce.standard_id
      LEFT JOIN compliance_requirements cr ON cr.id = ce.requirement_id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramIndex = 1;

    if (standardId) {
      query += ` AND ce.standard_id = $${paramIndex}`;
      params.push(parseInt(standardId));
      paramIndex++;
    }

    if (requirementId) {
      query += ` AND ce.requirement_id = $${paramIndex}`;
      params.push(parseInt(requirementId));
      paramIndex++;
    }

    if (evidenceType) {
      query += ` AND ce.evidence_type = $${paramIndex}`;
      params.push(evidenceType);
      paramIndex++;
    }

    query += ` ORDER BY ce.evidence_date DESC`;

    const result = await pool.query(query, params);

    return NextResponse.json({
      evidence: result.rows,
    });
  } catch (error: any) {
    console.error('Error fetching compliance evidence:', error);
    return NextResponse.json(
      { error: 'Failed to fetch compliance evidence', details: error.message },
      { status: 500 }
    );
  }
}
