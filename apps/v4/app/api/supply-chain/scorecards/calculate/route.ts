import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

/**
 * POST /api/supply-chain/scorecards/calculate
 * Auto-calculate supplier scorecard based on performance metrics and quality data
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      supplier_id,
      evaluation_period_start,
      evaluation_period_end,
      evaluated_by,
      notes,
    } = body;

    if (!supplier_id || !evaluation_period_start || !evaluation_period_end || !evaluated_by) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check for duplicate
    const existing = await query(
      `SELECT id FROM supplier_scorecards 
       WHERE supplier_id = $1 
         AND evaluation_period_start = $2 
         AND evaluation_period_end = $3`,
      [supplier_id, evaluation_period_start, evaluation_period_end]
    );

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: "Scorecard already exists for this supplier and period" },
        { status: 409 }
      );
    }

    // Get scorecard criteria with weights
    const criteriaResult = await query(
      `SELECT * FROM supplier_scorecard_criteria WHERE is_active = true ORDER BY id`
    );
    const criteria = criteriaResult.rows;

    // Get supplier performance metrics for the period
    const perfResult = await query(
      `SELECT 
        AVG(on_time_delivery_rate) AS avg_on_time_delivery,
        AVG(average_lead_time) AS avg_lead_time,
        AVG(quality_score) AS avg_quality_score,
        AVG(price_competitiveness_score) AS avg_price_score,
        SUM(total_orders) AS total_orders,
        SUM(total_value) AS total_spend
      FROM supplier_performance_metrics
      WHERE supplier_id = $1
        AND period_start >= $2
        AND period_end <= $3`,
      [supplier_id, evaluation_period_start, evaluation_period_end]
    );

    const metrics = perfResult.rows[0];

    // Get quality data from Phase 3 (NCRs related to this supplier)
    const qualityResult = await query(
      `SELECT 
        COUNT(*) AS ncr_count,
        SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) AS ncr_closed_count
      FROM non_conformance_reports
      WHERE supplier_id = $1
        AND detected_date >= $2
        AND detected_date <= $3`,
      [supplier_id, evaluation_period_start, evaluation_period_end]
    );

    const qualityData = qualityResult.rows[0];

    // Calculate scores for each criteria
    const criteria_scores = [];

    for (const criterion of criteria) {
      let score = 0;
      let actual_value = 0;
      let target_value = 0;
      let comments = "";

      switch (criterion.criteria_code) {
        case "QUALITY":
          // Quality score from quality_score (0-100) and NCR impact
          actual_value = metrics.avg_quality_score || 0;
          target_value = 95;
          const ncr_penalty = Math.min((qualityData.ncr_count || 0) * 2, 20);
          score = Math.max(0, actual_value - ncr_penalty);
          comments = `NCRs: ${qualityData.ncr_count || 0}, Quality Score: ${actual_value.toFixed(2)}%`;
          break;

        case "DELIVERY":
          // On-time delivery rate (directly from metrics)
          actual_value = metrics.avg_on_time_delivery || 0;
          target_value = 95;
          score = actual_value;
          comments = `On-time delivery: ${actual_value.toFixed(2)}%`;
          break;

        case "LEAD_TIME":
          // Lead time performance (lower is better, convert to 0-100 score)
          actual_value = metrics.avg_lead_time || 0;
          target_value = 14; // Target 2 weeks
          if (actual_value === 0) {
            score = 100;
          } else if (actual_value <= target_value) {
            score = 100;
          } else {
            // Penalty for exceeding target
            const excess_ratio = (actual_value - target_value) / target_value;
            score = Math.max(0, 100 - excess_ratio * 100);
          }
          comments = `Avg lead time: ${actual_value.toFixed(1)} days, Target: ${target_value} days`;
          break;

        case "PRICE":
          // Price competitiveness (from metrics)
          actual_value = metrics.avg_price_score || 80;
          target_value = 90;
          score = actual_value;
          comments = `Price competitiveness: ${actual_value.toFixed(2)}/100`;
          break;

        case "RESPONSE":
          // Responsiveness (manual - default to 80%)
          actual_value = 80;
          target_value = 90;
          score = 80;
          comments = "Manual evaluation required for responsiveness";
          break;

        case "COMPLIANCE":
          // Documentation & compliance (manual - default to 85%)
          actual_value = 85;
          target_value = 95;
          score = 85;
          comments = "Manual evaluation required for compliance";
          break;

        default:
          score = 75; // Default score
          actual_value = 75;
          target_value = 90;
          comments = "Manual evaluation required";
      }

      const weight = criterion.weight;
      const weighted_score = (score * weight) / 100;

      criteria_scores.push({
        criteria_id: criterion.id,
        criteria_name: criterion.criteria_name,
        score: parseFloat(score.toFixed(2)),
        weight,
        weighted_score: parseFloat(weighted_score.toFixed(2)),
        actual_value: parseFloat(actual_value.toFixed(2)),
        target_value: parseFloat(target_value.toFixed(2)),
        comments,
      });
    }

    // Calculate overall score
    const overall_score = criteria_scores.reduce((sum, cs) => sum + cs.weighted_score, 0);

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

    // Create scorecard
    const scorecardResult = await query(
      `INSERT INTO supplier_scorecards (
        supplier_id, evaluation_period_start, evaluation_period_end,
        overall_score, grade, total_spend, total_orders,
        evaluated_by, evaluation_date, notes, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_DATE, $9, 'final')
      RETURNING *`,
      [
        supplier_id,
        evaluation_period_start,
        evaluation_period_end,
        overall_score.toFixed(2),
        grade,
        metrics.total_spend || 0,
        metrics.total_orders || 0,
        evaluated_by,
        notes || "Auto-calculated scorecard",
      ]
    );

    const scorecard = scorecardResult.rows[0];

    // Insert criteria scores
    for (const cs of criteria_scores) {
      await query(
        `INSERT INTO supplier_scorecard_details (
          scorecard_id, criteria_id, score, weight, weighted_score,
          actual_value, target_value, comments
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          scorecard.id,
          cs.criteria_id,
          cs.score,
          cs.weight,
          cs.weighted_score,
          cs.actual_value,
          cs.target_value,
          cs.comments,
        ]
      );
    }

    // Calculate rank among all suppliers with scorecards in the same period
    await query(
      `UPDATE supplier_scorecards sc
       SET rank = subquery.row_num
       FROM (
         SELECT id, ROW_NUMBER() OVER (ORDER BY overall_score DESC) as row_num
         FROM supplier_scorecards
         WHERE evaluation_period_start = $1 AND evaluation_period_end = $2
       ) subquery
       WHERE sc.id = subquery.id`,
      [evaluation_period_start, evaluation_period_end]
    );

    // Fetch complete scorecard
    const completeResult = await query(
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
      [scorecard.id]
    );

    return NextResponse.json(
      {
        message: "Supplier scorecard calculated successfully",
        scorecard: completeResult.rows[0],
        calculation_summary: {
          criteria_count: criteria_scores.length,
          overall_score: overall_score.toFixed(2),
          grade,
          total_orders: metrics.total_orders || 0,
          total_spend: metrics.total_spend || 0,
          ncr_count: qualityData.ncr_count || 0,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error calculating supplier scorecard:", error);
    return NextResponse.json(
      { error: "Failed to calculate supplier scorecard", details: error.message },
      { status: 500 }
    );
  }
}
