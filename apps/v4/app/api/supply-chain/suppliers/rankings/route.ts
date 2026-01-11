import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

/**
 * GET /api/supply-chain/suppliers/rankings
 * Get supplier rankings based on latest scorecards
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const min_score = searchParams.get("min_score");
    const grade = searchParams.get("grade");
    const limit = parseInt(searchParams.get("limit") || "50");

    // Use the v_supplier_rankings view
    let sql = `SELECT * FROM v_supplier_rankings WHERE 1=1`;
    const params: any[] = [];
    let paramIndex = 1;

    if (min_score) {
      sql += ` AND overall_score >= $${paramIndex}`;
      params.push(parseFloat(min_score));
      paramIndex++;
    }

    if (grade) {
      sql += ` AND grade = $${paramIndex}`;
      params.push(grade);
      paramIndex++;
    }

    sql += ` LIMIT $${paramIndex}`;
    params.push(limit);

    const result = await query(sql, params);

    // Calculate statistics
    const stats = {
      total_suppliers: result.rows.length,
      avg_score:
        result.rows.length > 0
          ? (
              result.rows.reduce((sum, s) => sum + (parseFloat(s.overall_score) || 0), 0) /
              result.rows.length
            ).toFixed(2)
          : 0,
      grade_distribution: {} as Record<string, number>,
    };

    // Count grades
    result.rows.forEach((row) => {
      const g = row.grade || "N/A";
      stats.grade_distribution[g] = (stats.grade_distribution[g] || 0) + 1;
    });

    return NextResponse.json({
      rankings: result.rows,
      statistics: stats,
    });
  } catch (error: any) {
    console.error("Error fetching supplier rankings:", error);
    return NextResponse.json(
      { error: "Failed to fetch supplier rankings", details: error.message },
      { status: 500 }
    );
  }
}
