import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

/**
 * GET /api/supply-chain/scorecards
 * Get supplier scorecards with filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const supplier_id = searchParams.get("supplier_id");
    const period_start = searchParams.get("period_start");
    const period_end = searchParams.get("period_end");
    const status = searchParams.get("status") || "final";
    const min_score = searchParams.get("min_score");
    const grade = searchParams.get("grade");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    // Build WHERE clause
    const conditions = ["1=1"];
    const params: any[] = [];
    let paramIndex = 1;

    if (supplier_id) {
      conditions.push(`sc.supplier_id = $${paramIndex}`);
      params.push(parseInt(supplier_id));
      paramIndex++;
    }

    if (period_start) {
      conditions.push(`sc.evaluation_period_start >= $${paramIndex}`);
      params.push(period_start);
      paramIndex++;
    }

    if (period_end) {
      conditions.push(`sc.evaluation_period_end <= $${paramIndex}`);
      params.push(period_end);
      paramIndex++;
    }

    if (status) {
      conditions.push(`sc.status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }

    if (min_score) {
      conditions.push(`sc.overall_score >= $${paramIndex}`);
      params.push(parseFloat(min_score));
      paramIndex++;
    }

    if (grade) {
      conditions.push(`sc.grade = $${paramIndex}`);
      params.push(grade);
      paramIndex++;
    }

    const whereClause = conditions.join(" AND ");

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total 
       FROM supplier_scorecards sc 
       WHERE ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].total);

    // Get scorecards with supplier details
    params.push(limit, offset);
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
      LEFT JOIN users u ON u.id = sc.evaluated_by
      WHERE ${whereClause}
      ORDER BY sc.rank NULLS LAST, sc.overall_score DESC NULLS LAST
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      params
    );

    return NextResponse.json({
      scorecards: result.rows,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching supplier scorecards:", error);
    return NextResponse.json(
      { error: "Failed to fetch supplier scorecards", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/supply-chain/scorecards
 * Create a new supplier scorecard
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
      criteria_scores, // Array of {criteria_id, score, weight, actual_value, target_value, comments}
    } = body;

    // Validate required fields
    if (!supplier_id || !evaluation_period_start || !evaluation_period_end || !evaluated_by) {
      return NextResponse.json(
        { error: "Missing required fields: supplier_id, evaluation_period_start, evaluation_period_end, evaluated_by" },
        { status: 400 }
      );
    }

    // Check for duplicate scorecard
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

    // Calculate overall score from criteria scores
    let totalWeightedScore = 0;
    let totalWeight = 0;

    if (criteria_scores && criteria_scores.length > 0) {
      for (const cs of criteria_scores) {
        const weight = cs.weight || 0;
        const score = cs.score || 0;
        const weightedScore = (score * weight) / 100;
        totalWeightedScore += weightedScore;
        totalWeight += weight;
      }
    }

    const overall_score = totalWeight > 0 ? totalWeightedScore : 0;

    // Assign grade based on score
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
        overall_score, grade, evaluated_by, evaluation_date, notes, status
      ) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE, $7, 'draft')
      RETURNING *`,
      [supplier_id, evaluation_period_start, evaluation_period_end, overall_score, grade, evaluated_by, notes]
    );

    const scorecard = scorecardResult.rows[0];

    // Insert criteria scores
    if (criteria_scores && criteria_scores.length > 0) {
      for (const cs of criteria_scores) {
        const weight = cs.weight || 0;
        const score = cs.score || 0;
        const weighted_score = (score * weight) / 100;

        await query(
          `INSERT INTO supplier_scorecard_details (
            scorecard_id, criteria_id, score, weight, weighted_score,
            actual_value, target_value, comments
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            scorecard.id,
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
    }

    // Fetch complete scorecard with details
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
        message: "Supplier scorecard created successfully",
        scorecard: completeResult.rows[0],
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating supplier scorecard:", error);
    return NextResponse.json(
      { error: "Failed to create supplier scorecard", details: error.message },
      { status: 500 }
    );
  }
}
