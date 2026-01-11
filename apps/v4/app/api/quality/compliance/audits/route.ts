import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://mac@localhost:5432/ocean-erp',
});

// POST /api/quality/compliance/audits - Schedule/create compliance audit
export async function POST(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const body = await request.json();
    
    const {
      standard_id,
      audit_type,
      audit_date,
      auditor_name,
      auditor_organization,
      scope,
      findings = [],
      scheduled_by,
    } = body;

    if (!standard_id || !audit_type || !audit_date || !scheduled_by) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await client.query('BEGIN');

    // Insert audit
    const auditResult = await client.query(`
      INSERT INTO compliance_audits (
        standard_id,
        audit_type,
        audit_date,
        auditor_name,
        auditor_organization,
        scope,
        status,
        scheduled_by
      ) VALUES ($1, $2, $3, $4, $5, $6, 'scheduled', $7)
      RETURNING *
    `, [
      standard_id,
      audit_type,
      audit_date,
      auditor_name,
      auditor_organization,
      scope,
      scheduled_by,
    ]);

    const audit = auditResult.rows[0];

    // If findings provided (for completed audits)
    if (findings.length > 0) {
      const findingsJson = JSON.stringify(findings);
      const nonConformities = findings.filter((f: any) => f.severity === 'major' || f.severity === 'critical').length;
      const observations = findings.filter((f: any) => f.severity === 'minor' || f.severity === 'observation').length;

      await client.query(`
        UPDATE compliance_audits
        SET 
          status = 'completed',
          findings = $1,
          non_conformities = $2,
          observations = $3,
          completed_date = CURRENT_TIMESTAMP
        WHERE id = $4
      `, [findingsJson, nonConformities, observations, audit.id]);
    }

    await client.query('COMMIT');

    return NextResponse.json({
      message: 'Compliance audit scheduled successfully',
      audit: audit,
    }, { status: 201 });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error scheduling compliance audit:', error);
    return NextResponse.json(
      { error: 'Failed to schedule compliance audit', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// GET /api/quality/compliance/audits - List compliance audits
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const standardId = searchParams.get('standard_id');
    const auditType = searchParams.get('audit_type');
    const status = searchParams.get('status');

    let query = `
      SELECT 
        ca.*,
        cs.standard_name,
        cs.standard_code
      FROM compliance_audits ca
      JOIN compliance_standards cs ON cs.id = ca.standard_id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramIndex = 1;

    if (standardId) {
      query += ` AND ca.standard_id = $${paramIndex}`;
      params.push(parseInt(standardId));
      paramIndex++;
    }

    if (auditType) {
      query += ` AND ca.audit_type = $${paramIndex}`;
      params.push(auditType);
      paramIndex++;
    }

    if (status) {
      query += ` AND ca.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    query += ` ORDER BY ca.audit_date DESC`;

    const result = await pool.query(query, params);

    return NextResponse.json({
      audits: result.rows,
    });
  } catch (error: any) {
    console.error('Error fetching compliance audits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch compliance audits', details: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/quality/compliance/audits - Update audit status/findings
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      audit_id,
      status,
      findings,
      audit_summary,
      recommendations,
    } = body;

    if (!audit_id) {
      return NextResponse.json(
        { error: 'audit_id is required' },
        { status: 400 }
      );
    }

    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (status) {
      updates.push(`status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }

    if (findings) {
      updates.push(`findings = $${paramIndex}`);
      params.push(JSON.stringify(findings));
      paramIndex++;

      const nonConformities = findings.filter((f: any) => f.severity === 'major' || f.severity === 'critical').length;
      const observations = findings.filter((f: any) => f.severity === 'minor' || f.severity === 'observation').length;

      updates.push(`non_conformities = $${paramIndex}`);
      params.push(nonConformities);
      paramIndex++;

      updates.push(`observations = $${paramIndex}`);
      params.push(observations);
      paramIndex++;
    }

    if (audit_summary) {
      updates.push(`audit_summary = $${paramIndex}`);
      params.push(audit_summary);
      paramIndex++;
    }

    if (recommendations) {
      updates.push(`recommendations = $${paramIndex}`);
      params.push(JSON.stringify(recommendations));
      paramIndex++;
    }

    if (status === 'completed') {
      updates.push(`completed_date = CURRENT_TIMESTAMP`);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    params.push(audit_id);

    const result = await pool.query(`
      UPDATE compliance_audits
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `, params);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Audit not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Audit updated successfully',
      audit: result.rows[0],
    });
  } catch (error: any) {
    console.error('Error updating compliance audit:', error);
    return NextResponse.json(
      { error: 'Failed to update compliance audit', details: error.message },
      { status: 500 }
    );
  }
}
