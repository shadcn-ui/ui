import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/hrm/employees/[id]/documents - List employee documents
// POST /api/hrm/employees/[id]/documents - Upload document metadata
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect();

  try {
    const employee_id = params.id;
    const { searchParams } = new URL(request.url);
    const document_type = searchParams.get("document_type");
    const verification_status = searchParams.get("verification_status");

    let conditions = ["employee_id = $1", "is_active = true"];
    const queryParams: any[] = [employee_id];
    let paramCount = 2;

    if (document_type) {
      conditions.push(`document_type = $${paramCount}`);
      queryParams.push(document_type);
      paramCount++;
    }

    if (verification_status) {
      conditions.push(`verification_status = $${paramCount}`);
      queryParams.push(verification_status);
      paramCount++;
    }

    const whereClause = conditions.join(" AND ");

    const query = `
      SELECT 
        d.*,
        v.first_name || ' ' || v.last_name as verified_by_name
      FROM hrm_employee_documents d
      LEFT JOIN hrm_employees v ON d.verified_by = v.employee_id
      WHERE ${whereClause}
      ORDER BY 
        CASE verification_status
          WHEN 'pending' THEN 1
          WHEN 'verified' THEN 2
          WHEN 'rejected' THEN 3
          WHEN 'expired' THEN 4
          ELSE 5
        END,
        created_at DESC
    `;

    const result = await client.query(query, queryParams);

    // Get summary by document type
    const summaryQuery = `
      SELECT 
        document_type,
        COUNT(*) as total,
        COUNT(CASE WHEN verification_status = 'verified' THEN 1 END) as verified,
        COUNT(CASE WHEN verification_status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN verification_status = 'rejected' THEN 1 END) as rejected,
        COUNT(CASE WHEN expiry_date < CURRENT_DATE THEN 1 END) as expired
      FROM hrm_employee_documents
      WHERE employee_id = $1 AND is_active = true
      GROUP BY document_type
    `;
    const summaryResult = await client.query(summaryQuery, [employee_id]);

    return NextResponse.json({
      documents: result.rows,
      summary_by_type: summaryResult.rows,
    });
  } catch (error: any) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect();

  try {
    const employee_id = params.id;
    const body = await request.json();

    const {
      document_type,
      document_name,
    } = body;

    if (!document_type || !document_name) {
      return NextResponse.json(
        {
          error: "Missing required fields: document_type, document_name",
        },
        { status: 400 }
      );
    }

    const insertQuery = `
      INSERT INTO hrm_employee_documents (
        employee_id, document_type, document_number, document_name, description,
        file_path, file_url, file_type, file_size,
        issue_date, expiry_date,
        verification_status, is_confidential, created_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
      )
      RETURNING *
    `;

    const result = await client.query(insertQuery, [
      employee_id,
      document_type,
      body.document_number || null,
      document_name,
      body.description || null,
      body.file_path || null,
      body.file_url || null,
      body.file_type || null,
      body.file_size || null,
      body.issue_date || null,
      body.expiry_date || null,
      body.verification_status || "pending",
      body.is_confidential || false,
      body.created_by || null,
    ]);

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    console.error("Error creating document:", error);
    return NextResponse.json(
      { error: "Failed to create document", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
