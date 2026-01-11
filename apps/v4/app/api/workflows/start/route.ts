import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { WorkflowEngine } from '@/lib/workflow-engine'

/**
 * POST /api/workflows/start
 * Start a new workflow instance for a document
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { document_type, document_id, initiated_by, document_data } = body

    if (!document_type || !document_id || !initiated_by) {
      return NextResponse.json(
        { error: 'document_type, document_id, and initiated_by are required' },
        { status: 400 }
      )
    }

    const instance = await WorkflowEngine.startWorkflow(
      document_type,
      document_id,
      initiated_by,
      document_data || {},
      pool
    )

    if (instance) {
      return NextResponse.json({
        success: true,
        instance,
        message: 'Workflow started successfully'
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'No workflow defined for this document type'
      })
    }
  } catch (error: any) {
    console.error('Error starting workflow:', error)
    return NextResponse.json(
      { error: 'Failed to start workflow', details: error.message },
      { status: 500 }
    )
  }
}
