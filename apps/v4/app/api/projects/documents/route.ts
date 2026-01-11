import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/projects/documents - List project documents
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const project_id = searchParams.get('project_id');
    const task_id = searchParams.get('task_id');
    const document_type = searchParams.get('document_type');
    const document_status = searchParams.get('document_status');

    let conditions: string[] = [];
    let params: any[] = [];
    let paramIndex = 1;

    if (project_id) {
      conditions.push(`d.project_id = $${paramIndex++}`);
      params.push(project_id);
    }

    if (task_id) {
      conditions.push(`d.task_id = $${paramIndex++}`);
      params.push(task_id);
    }

    if (document_type) {
      conditions.push(`d.document_type = $${paramIndex++}`);
      params.push(document_type);
    }

    if (document_status) {
      conditions.push(`d.document_status = $${paramIndex++}`);
      params.push(document_status);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await query(
      `SELECT d.*, p.project_name, pt.task_name, ph.phase_name
       FROM project_documents d
       JOIN projects p ON d.project_id = p.project_id
       LEFT JOIN project_tasks pt ON d.task_id = pt.task_id
       LEFT JOIN project_phases ph ON d.phase_id = ph.phase_id
       ${whereClause}
       ORDER BY d.created_at DESC`,
      params
    );

    return NextResponse.json({ documents: result.rows });

  } catch (error: any) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/projects/documents - Upload document
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      project_id, task_id, phase_id, document_name, document_description,
      document_type, file_name, file_size_bytes, file_type, file_url,
      category, tags = [], is_public = false, access_level = 'project_team',
      uploaded_by
    } = body;

    if (!project_id || !document_name || !file_url || !uploaded_by) {
      return NextResponse.json(
        { error: 'Missing required fields: project_id, document_name, file_url, uploaded_by' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO project_documents (
        project_id, task_id, phase_id, document_name, document_description,
        document_type, file_name, file_size_bytes, file_type, file_url,
        category, tags, is_public, access_level, uploaded_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *`,
      [project_id, task_id, phase_id, document_name, document_description,
       document_type, file_name, file_size_bytes, file_type, file_url,
       category, tags, is_public, access_level, uploaded_by]
    );

    return NextResponse.json({
      message: 'Document uploaded successfully',
      document: result.rows[0]
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { error: 'Failed to upload document', details: error.message },
      { status: 500 }
    );
  }
}
