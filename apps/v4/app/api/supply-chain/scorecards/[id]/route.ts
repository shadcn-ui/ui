import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

/**
 * GET /api/supply-chain/scorecards/[id]
 * Get a specific supplier scorecard
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const routeParams = await context.params;
    const scorecardId = parseInt(routeParams.id);

    const result = await query(
      `SELECT 
        sc.*,
        s.company_name AS supplier_name,
        s.supplier_code,
        s.status AS supplier_status,
        u.name AS evaluated_by_name,
        (
          SELECT json_agg(
            json_build_object(
              'criteria_name', c.criteria_name,
              'criteria_code', c.criteria_code,
              'description', c.description,
              'score', d.score,
              'weight', d.weight,
              'weighted_score', d.weighted_score,
              'actual_value', d.actual_value,
              'target_value', d.target_value,
              'comments', d.comments
            ) ORDER BY d.id
          )
          FROM supplier_scorecard_details d
          JOIN supplier_scorecard_criteria c ON c.id = d.criteria_id
          WHERE d.scorecard_id = sc.id
        ) AS criteria_scores
      FROM supplier_scorecards sc
      JOIN suppliers s ON s.id = sc.supplier_id
      LEFT JOIN users u ON u.id = sc.evaluated_by
      WHERE sc.id = $1`,
      [scorecardId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Scorecard not found" }, { status: 404 });
    }

    return NextResponse.json({ scorecard: result.rows[0] });
  } catch (error: any) {
    console.error("Error fetching scorecard:", error);
    return NextResponse.json(
      { error: "Failed to fetch scorecard", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/supply-chain/scorecards/[id]
 * Update a supplier scorecard
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const routeParams = await context.params;
    const scorecardId = parseInt(routeParams.id);
    const body = await request.json();

    const { status, notes, criteria_scores } = body;

    // Update scorecard
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (status) {
      updates.push(`status = $${paramIndex}`);
      values.push(status);
      paramIndex++;
    }

    if (notes !== undefined) {
      updates.push(`notes = $${paramIndex}`);
      values.push(notes);
      paramIndex++;
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);

    if (updates.length > 1) {
      // More than just updated_at
      values.push(scorecardId);
      await query(
        `UPDATE supplier_scorecards SET ${updates.join(", ")} WHERE id = $${paramIndex}`,
        values
      );
    }

    // Update criteria scores if provided
    if (criteria_scores && criteria_scores.length > 0) {
      // Recalculate overall score
      let totalWeightedScore = 0;
      let totalWeight = 0;

      for (const cs of criteria_scores) {
        const weight = cs.weight || 0;
        const score = cs.score || 0;
        const weighted_score = (score * weight) / 100;
        totalWeightedScore += weighted_score;
        totalWeight += weight;

        // Update or insert criteria score
        await query(
          `INSERT INTO supplier_scorecard_details (
            scorecard_id, criteria_id, score, weight, weighted_score,
            actual_value, target_value, comments
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT ON CONSTRAINT supplier_scorecard_details_scorecard_id_criteria_id_key
          DO UPDATE SET 
            score = EXCLUDED.score,
            weight = EXCLUDED.weight,
            weighted_score = EXCLUDED.weighted_score,
            actual_value = EXCLUDED.actual_value,
            target_value = EXCLUDED.target_value,
            comments = EXCLUDED.comments`,
          [
            scorecardId,
            cs.criteria_id,
            score,
            weight,
            weighted_score,
            cs.actual_value || null,
            cs.target_value || null,
            cs.comments || null,
          ]
        );
      }

      const overall_score = totalWeight > 0 ? totalWeightedScore : 0;

      // Assign grade
      let grade = "F";
      if (overall_score >= 97) grade = "A+";
      else if (overall_score >= 93) grade = "A";
      else if (overall_score >= 90) grade = "A-";
      else if (overall_score >= 87) grade = "B+";
      else if (overall_score >= 83) grade = "B";
      else if (overall_score >= 80) grade = "B-";
      else if (overall_score >= 77) grade = "C+";
      else if (overall_score >= 73) grade = "C";
      else if (overall_score >= 70) grade = "C-";
      else if (overall_score >= 60) grade = "D";

      await query(
        `UPDATE supplier_scorecards 
         SET overall_score = $1, grade = $2, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $3`,
        [overall_score, grade, scorecardId]
      );
    }

    // Fetch updated scorecard
    const result = await query(
      `SELECT 
        sc.*,
        s.company_name AS supplier_name,
        s.supplier_code,
        (
          SELECT json_agg(
            json_build_object(
              'criteria_name', c.criteria_name,
              'criteria_code', c.criteria_code,
              'score', d.score,
              'weight', d.weight,
              'weighted_score', d.weighted_score,
              'actual_value', d.actual_value,
              'target_value', d.target_value,
              'comments', d.comments
            )
          )
          FROM supplier_scorecard_details d
          JOIN supplier_scorecard_criteria c ON c.id = d.criteria_id
          WHERE d.scorecard_id = sc.id
        ) AS criteria_scores
      FROM supplier_scorecards sc
      JOIN suppliers s ON s.id = sc.supplier_id
      WHERE sc.id = $1`,
      [scorecardId]
    );

    return NextResponse.json({
      message: "Scorecard updated successfully",
      scorecard: result.rows[0],
    });
  } catch (error: any) {
    console.error("Error updating scorecard:", error);
    return NextResponse.json(
      { error: "Failed to update scorecard", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/supply-chain/scorecards/[id]
 * Delete a supplier scorecard (only if status is draft)
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const routeParams = await context.params;
    const scorecardId = parseInt(routeParams.id);

    // Check if scorecard exists and is draft
    const checkResult = await query(
      `SELECT status FROM supplier_scorecards WHERE id = $1`,
      [scorecardId]
    );

    if (checkResult.rows.length === 0) {
      return NextResponse.json({ error: "Scorecard not found" }, { status: 404 });
    }

    if (checkResult.rows[0].status !== "draft") {
      return NextResponse.json(
        { error: "Only draft scorecards can be deleted" },
        { status: 400 }
      );
    }

    // Delete scorecard (cascade will delete details)
    await query(`DELETE FROM supplier_scorecards WHERE id = $1`, [scorecardId]);

    return NextResponse.json({ message: "Scorecard deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting scorecard:", error);
    return NextResponse.json(
      { error: "Failed to delete scorecard", details: error.message },
      { status: 500 }
    );
  }
}
