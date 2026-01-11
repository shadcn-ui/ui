import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

/**
 * POST /api/supply-chain/rfqs/[id]/evaluate
 * Evaluate and score all quotes for an RFQ
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const routeParams = await context.params;
    const rfqId = parseInt(routeParams.id);
    const body = await request.json();

    const {
      price_weight = 50, // Percentage weight for price (0-100)
      quality_weight = 30, // Percentage weight for quality/supplier score
      delivery_weight = 20, // Percentage weight for delivery time
    } = body;

    // Validate weights sum to 100
    const totalWeight = price_weight + quality_weight + delivery_weight;
    if (Math.abs(totalWeight - 100) > 0.01) {
      return NextResponse.json(
        { error: "Weights must sum to 100" },
        { status: 400 }
      );
    }

    // Get all quotes for this RFQ
    const quotesResult = await query(
      `SELECT 
        sq.id,
        sq.supplier_id,
        sq.total_amount,
        sq.delivery_time,
        s.company_name AS supplier_name,
        sc.overall_score AS supplier_score
      FROM supplier_quotations sq
      JOIN suppliers s ON s.id = sq.supplier_id
      LEFT JOIN supplier_scorecards sc ON sc.supplier_id = sq.supplier_id
        AND sc.status = 'final'
        AND sc.evaluation_period_end = (
          SELECT MAX(evaluation_period_end)
          FROM supplier_scorecards
          WHERE supplier_id = sq.supplier_id AND status = 'final'
        )
      WHERE sq.rfq_id = $1`,
      [rfqId]
    );

    if (quotesResult.rows.length === 0) {
      return NextResponse.json(
        { error: "No quotes found for this RFQ" },
        { status: 404 }
      );
    }

    const quotes = quotesResult.rows;

    // Find min/max values for normalization
    const prices = quotes.map((q) => parseFloat(q.total_amount));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    // Extract delivery time in days (parse "X days" format)
    const deliveryTimes = quotes.map((q) => {
      const match = q.delivery_time?.match(/(\d+)/);
      return match ? parseInt(match[1]) : 30; // Default 30 days
    });
    const minDelivery = Math.min(...deliveryTimes);
    const maxDelivery = Math.max(...deliveryTimes);

    const evaluations = [];

    for (let i = 0; i < quotes.length; i++) {
      const quote = quotes[i];
      const price = parseFloat(quote.total_amount);
      const deliveryDays = deliveryTimes[i];
      const supplierScore = parseFloat(quote.supplier_score || 75);

      // Price score (lower is better, inverse normalization)
      let priceScore = 0;
      if (maxPrice > minPrice) {
        priceScore = ((maxPrice - price) / (maxPrice - minPrice)) * 100;
      } else {
        priceScore = 100; // All prices equal
      }

      // Quality score (from supplier scorecard)
      const qualityScore = supplierScore;

      // Delivery score (shorter is better, inverse normalization)
      let deliveryScore = 0;
      if (maxDelivery > minDelivery) {
        deliveryScore = ((maxDelivery - deliveryDays) / (maxDelivery - minDelivery)) * 100;
      } else {
        deliveryScore = 100; // All delivery times equal
      }

      // Calculate weighted total score
      const totalScore =
        (priceScore * price_weight) / 100 +
        (qualityScore * quality_weight) / 100 +
        (deliveryScore * delivery_weight) / 100;

      evaluations.push({
        quote_id: quote.id,
        supplier_id: quote.supplier_id,
        supplier_name: quote.supplier_name,
        price_score: priceScore.toFixed(2),
        quality_score: qualityScore.toFixed(2),
        delivery_score: deliveryScore.toFixed(2),
        total_score: totalScore.toFixed(2),
        total_amount: price,
        delivery_days: deliveryDays,
        rank: 0, // Will be set after sorting
      });

      // Update quote with evaluation score
      await query(
        `UPDATE supplier_quotations 
         SET evaluation_score = $1, 
             evaluation_notes = $2,
             status = 'under_review',
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $3`,
        [
          totalScore.toFixed(2),
          `Price: ${priceScore.toFixed(1)}% (weight ${price_weight}%), Quality: ${qualityScore.toFixed(1)}% (weight ${quality_weight}%), Delivery: ${deliveryScore.toFixed(1)}% (weight ${delivery_weight}%)`,
          quote.id,
        ]
      );
    }

    // Sort by total score (descending)
    evaluations.sort((a, b) => parseFloat(b.total_score) - parseFloat(a.total_score));

    // Add rank
    evaluations.forEach((e, index) => {
      e.rank = index + 1;
    });

    // Update RFQ status to evaluation
    await query(
      `UPDATE rfq_requests 
       SET status = 'evaluation', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [rfqId]
    );

    return NextResponse.json({
      message: "Quotes evaluated successfully",
      evaluation_criteria: {
        price_weight,
        quality_weight,
        delivery_weight,
      },
      evaluations,
      recommendation: evaluations[0], // Top ranked quote
    });
  } catch (error: any) {
    console.error("Error evaluating quotes:", error);
    return NextResponse.json(
      { error: "Failed to evaluate quotes", details: error.message },
      { status: 500 }
    );
  }
}
