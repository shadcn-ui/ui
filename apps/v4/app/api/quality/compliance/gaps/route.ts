import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://mac@localhost:5432/ocean-erp',
});

// GET /api/quality/compliance/gaps - Identify compliance gaps
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const standardId = searchParams.get('standard_id');

    let query = `
      SELECT 
        cs.id AS standard_id,
        cs.standard_name,
        cs.standard_code,
        cr.id AS requirement_id,
        cr.requirement_number,
        cr.requirement_title,
        cr.requirement_text,
        cr.category,
        cr.is_mandatory,
        cr.compliance_status,
        cr.last_verified_date,
        COUNT(DISTINCT ce.id) AS evidence_count,
        CASE 
          WHEN cr.compliance_status = 'non_compliant' THEN 'Critical Gap'
          WHEN cr.compliance_status = 'pending' AND cr.is_mandatory = true THEN 'High Priority'
          WHEN cr.compliance_status = 'pending' THEN 'Medium Priority'
          WHEN cr.last_verified_date < CURRENT_DATE - INTERVAL '1 year' THEN 'Review Required'
          ELSE 'OK'
        END AS gap_severity,
        EXTRACT(DAYS FROM (CURRENT_DATE - cr.last_verified_date))::int AS days_since_verification
      FROM compliance_standards cs
      JOIN compliance_requirements cr ON cr.standard_id = cs.id
      LEFT JOIN compliance_evidence ce ON ce.requirement_id = cr.id
      WHERE cs.is_active = true
    `;
    
    const params: any[] = [];
    let paramIndex = 1;

    if (standardId) {
      query += ` AND cs.id = $${paramIndex}`;
      params.push(parseInt(standardId));
      paramIndex++;
    }

    query += `
      GROUP BY cs.id, cs.standard_name, cs.standard_code, cr.id, cr.requirement_number, 
               cr.requirement_title, cr.requirement_text, cr.category, cr.is_mandatory, 
               cr.compliance_status, cr.last_verified_date
      HAVING 
        cr.compliance_status IN ('pending', 'non_compliant')
        OR COUNT(DISTINCT ce.id) = 0
        OR cr.last_verified_date < CURRENT_DATE - INTERVAL '1 year'
      ORDER BY 
        CASE gap_severity
          WHEN 'Critical Gap' THEN 1
          WHEN 'High Priority' THEN 2
          WHEN 'Medium Priority' THEN 3
          WHEN 'Review Required' THEN 4
          ELSE 5
        END,
        cr.requirement_number
    `;

    const result = await pool.query(query, params);

    // Calculate summary statistics
    const gaps = result.rows;
    const summary = {
      total_gaps: gaps.length,
      critical_gaps: gaps.filter(g => g.gap_severity === 'Critical Gap').length,
      high_priority: gaps.filter(g => g.gap_severity === 'High Priority').length,
      medium_priority: gaps.filter(g => g.gap_severity === 'Medium Priority').length,
      review_required: gaps.filter(g => g.gap_severity === 'Review Required').length,
    };

    return NextResponse.json({
      summary,
      gaps: result.rows,
    });
  } catch (error: any) {
    console.error('Error fetching compliance gaps:', error);
    return NextResponse.json(
      { error: 'Failed to fetch compliance gaps', details: error.message },
      { status: 500 }
    );
  }
}
