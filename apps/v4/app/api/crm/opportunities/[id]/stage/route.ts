// Phase 7 Task 2: Opportunity Stage Management API
// PUT /api/crm/opportunities/[id]/stage

import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://mac@localhost:5432/ocean-erp",
});

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const opportunityId = parseInt(params.id);
    const body = await request.json();

    if (isNaN(opportunityId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid opportunity ID",
        },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body.stage_id) {
      return NextResponse.json(
        {
          success: false,
          error: "stage_id is required",
        },
        { status: 400 }
      );
    }

    // Get current opportunity state
    const currentOppQuery = `
      SELECT 
        o.*,
        ps.stage_name as current_stage_name,
        ps.stage_code as current_stage_code,
        ps.is_closed as current_stage_is_closed,
        ps.is_won as current_stage_is_won
      FROM crm_opportunities o
      JOIN crm_pipeline_stages ps ON o.stage_id = ps.stage_id
      WHERE o.opportunity_id = $1
    `;

    const currentOppResult = await pool.query(currentOppQuery, [opportunityId]);

    if (currentOppResult.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Opportunity not found",
        },
        { status: 404 }
      );
    }

    const currentOpp = currentOppResult.rows[0];

    // Get new stage details
    const newStageQuery = `
      SELECT 
        stage_id,
        stage_name,
        stage_code,
        probability,
        is_closed,
        is_won
      FROM crm_pipeline_stages
      WHERE stage_id = $1 AND is_active = true
    `;

    const newStageResult = await pool.query(newStageQuery, [body.stage_id]);

    if (newStageResult.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Pipeline stage not found or inactive",
        },
        { status: 404 }
      );
    }

    const newStage = newStageResult.rows[0];

    // Don't allow moving from a closed stage
    if (currentOpp.is_closed && !newStage.is_closed) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot reopen a closed opportunity by changing stage",
        },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {
      stage_id: body.stage_id,
      is_closed: newStage.is_closed,
      is_won: newStage.is_won,
    };

    // Update probability to stage default if not overridden
    if (body.probability !== undefined) {
      updateData.probability = body.probability;
    } else {
      updateData.probability = newStage.probability;
    }

    // If moving to closed stage, set close date and reason
    if (newStage.is_closed && !currentOpp.is_closed) {
      updateData.closed_at = new Date();
      updateData.close_date = new Date().toISOString().split('T')[0];
      
      if (body.win_loss_reason_id) {
        updateData.win_loss_reason_id = body.win_loss_reason_id;
      }
    }

    // Build update query
    const updateFields = Object.keys(updateData).map((key, index) => 
      `${key} = $${index + 2}`
    ).join(', ');

    const updateQuery = `
      UPDATE crm_opportunities
      SET ${updateFields}
      WHERE opportunity_id = $1
      RETURNING *
    `;

    const updateParams = [opportunityId, ...Object.values(updateData)];
    await pool.query(updateQuery, updateParams);

    // Get updated opportunity with full details
    const detailQuery = `
      SELECT 
        o.*,
        a.account_name,
        a.account_number,
        c.full_name as contact_name,
        ps.stage_name,
        ps.stage_code,
        ps.stage_category,
        ps.color as stage_color,
        wlr.reason_name as win_loss_reason,
        (SELECT COUNT(*) FROM crm_stage_history WHERE opportunity_id = o.opportunity_id) as stage_change_count
      FROM crm_opportunities o
      JOIN crm_accounts a ON o.account_id = a.account_id
      LEFT JOIN crm_contacts c ON o.contact_id = c.contact_id
      JOIN crm_pipeline_stages ps ON o.stage_id = ps.stage_id
      LEFT JOIN crm_win_loss_reasons wlr ON o.win_loss_reason_id = wlr.win_loss_reason_id
      WHERE o.opportunity_id = $1
    `;

    const detailResult = await pool.query(detailQuery, [opportunityId]);

    // Get stage history
    const historyQuery = `
      SELECT 
        sh.*,
        from_stage.stage_name as from_stage_name,
        to_stage.stage_name as to_stage_name
      FROM crm_stage_history sh
      LEFT JOIN crm_pipeline_stages from_stage ON sh.from_stage_id = from_stage.stage_id
      JOIN crm_pipeline_stages to_stage ON sh.to_stage_id = to_stage.stage_id
      WHERE sh.opportunity_id = $1
      ORDER BY sh.changed_at DESC
      LIMIT 10
    `;

    const historyResult = await pool.query(historyQuery, [opportunityId]);

    return NextResponse.json({
      success: true,
      data: {
        opportunity: detailResult.rows[0],
        stage_history: historyResult.rows,
      },
      message: `Opportunity moved to ${newStage.stage_name}`,
    });
  } catch (error: any) {
    console.error("CRM Move Opportunity Stage Error:", error);

    if (error.code === "23503") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid stage_id or win_loss_reason_id",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to move opportunity stage",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
