import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/analytics/customer-segments - RFM (Recency, Frequency, Monetary) Analysis
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = parseInt(searchParams.get("period") || "365"); // Analysis period in days

    // Calculate RFM scores for each customer
    const rfmData = await pool.query(
      `WITH customer_metrics AS (
        SELECT 
          c.id as customer_id,
          c.company_name as customer_name,
          c.contact_email as email,
          COALESCE(MAX(o.created_at), c.created_at) as last_order_date,
          EXTRACT(DAY FROM (CURRENT_DATE - COALESCE(MAX(o.created_at), c.created_at))) as recency_days,
          COUNT(o.id) as frequency,
          COALESCE(SUM(o.total_amount), 0) as monetary
        FROM customers c
        LEFT JOIN sales_orders o ON c.id = o.customer_id 
          AND o.created_at >= CURRENT_DATE - INTERVAL '${period} days'
          AND o.status NOT IN ('cancelled', 'draft')
        WHERE c.created_at >= CURRENT_DATE - INTERVAL '${period} days'
        GROUP BY c.id, c.company_name, c.contact_email, c.created_at
      ),
      rfm_scores AS (
        SELECT 
          customer_id,
          customer_name,
          email,
          recency_days,
          frequency,
          monetary,
          -- R Score (5 = best, 1 = worst): Recent customers get higher score
          CASE 
            WHEN recency_days <= 7 THEN 5
            WHEN recency_days <= 30 THEN 4
            WHEN recency_days <= 90 THEN 3
            WHEN recency_days <= 180 THEN 2
            ELSE 1
          END as r_score,
          -- F Score: Frequent buyers get higher score
          CASE 
            WHEN frequency >= 20 THEN 5
            WHEN frequency >= 10 THEN 4
            WHEN frequency >= 5 THEN 3
            WHEN frequency >= 2 THEN 2
            ELSE 1
          END as f_score,
          -- M Score: High spenders get higher score
          CASE 
            WHEN monetary >= 10000000 THEN 5
            WHEN monetary >= 5000000 THEN 4
            WHEN monetary >= 1000000 THEN 3
            WHEN monetary >= 500000 THEN 2
            ELSE 1
          END as m_score
        FROM customer_metrics
      )
      SELECT 
        *,
        (r_score + f_score + m_score) as total_score,
        CASE
          -- Champions: High value, frequent, recent
          WHEN r_score >= 4 AND f_score >= 4 AND m_score >= 4 THEN 'Champions'
          -- Loyal Customers: Regular buyers
          WHEN f_score >= 4 AND m_score >= 3 THEN 'Loyal Customers'
          -- Potential Loyalists: Recent buyers with potential
          WHEN r_score >= 4 AND f_score >= 2 AND m_score >= 2 THEN 'Potential Loyalists'
          -- New Customers: Recent but low frequency
          WHEN r_score >= 4 AND f_score <= 2 THEN 'New Customers'
          -- At Risk: Used to be good, declining
          WHEN r_score <= 2 AND f_score >= 3 AND m_score >= 3 THEN 'At Risk'
          -- Need Attention: Below average but saveable
          WHEN r_score <= 3 AND f_score >= 2 AND m_score >= 2 THEN 'Need Attention'
          -- About to Sleep: Declining engagement
          WHEN r_score <= 2 AND f_score <= 3 THEN 'About to Sleep'
          -- Hibernating: Long time no see
          WHEN r_score = 1 AND f_score <= 2 THEN 'Hibernating'
          -- Lost: Haven't seen in a long time, low value
          ELSE 'Lost'
        END as segment
      FROM rfm_scores
      ORDER BY total_score DESC, monetary DESC`
    );

    // Group by segments
    const segmentStats = rfmData.rows.reduce((acc: any, customer: any) => {
      if (!acc[customer.segment]) {
        acc[customer.segment] = {
          segment: customer.segment,
          count: 0,
          total_revenue: 0,
          avg_revenue: 0,
          avg_frequency: 0,
          avg_recency: 0,
          customers: [],
        };
      }
      
      acc[customer.segment].count++;
      acc[customer.segment].total_revenue += parseFloat(customer.monetary);
      acc[customer.segment].avg_frequency += parseInt(customer.frequency);
      acc[customer.segment].avg_recency += parseInt(customer.recency_days);
      acc[customer.segment].customers.push({
        id: customer.customer_id,
        name: customer.customer_name,
        email: customer.email,
        recency_days: customer.recency_days,
        frequency: customer.frequency,
        monetary: customer.monetary,
        rfm_score: `${customer.r_score}${customer.f_score}${customer.m_score}`,
      });
      
      return acc;
    }, {});

    // Calculate averages
    Object.values(segmentStats).forEach((segment: any) => {
      segment.avg_revenue = Math.round(segment.total_revenue / segment.count);
      segment.avg_frequency = Math.round(segment.avg_frequency / segment.count);
      segment.avg_recency = Math.round(segment.avg_recency / segment.count);
    });

    // Generate recommendations
    const recommendations: any[] = [];

    Object.entries(segmentStats).forEach(([segmentName, stats]: [string, any]) => {
      if (segmentName === 'Champions') {
        recommendations.push({
          segment: segmentName,
          action: 'Reward and Retain',
          strategies: [
            'Offer exclusive VIP programs and early access to new products',
            'Request product reviews and testimonials',
            'Provide personalized recommendations',
            'Send thank you notes and special gifts',
          ],
          priority: 'high',
        });
      } else if (segmentName === 'Loyal Customers') {
        recommendations.push({
          segment: segmentName,
          action: 'Upsell and Cross-sell',
          strategies: [
            'Recommend complementary products',
            'Offer bundle deals and volume discounts',
            'Invite to loyalty programs',
            'Share customer success stories',
          ],
          priority: 'high',
        });
      } else if (segmentName === 'Potential Loyalists') {
        recommendations.push({
          segment: segmentName,
          action: 'Engage and Nurture',
          strategies: [
            'Send onboarding series and product guides',
            'Offer membership benefits',
            'Provide exceptional customer service',
            'Encourage repeat purchases with incentives',
          ],
          priority: 'medium',
        });
      } else if (segmentName === 'At Risk') {
        recommendations.push({
          segment: segmentName,
          action: 'Win-Back Campaign',
          strategies: [
            'Send personalized re-engagement emails',
            'Offer special comeback discounts',
            'Survey for feedback and concerns',
            'Highlight new products or improvements',
          ],
          priority: 'high',
        });
      } else if (segmentName === 'Need Attention') {
        recommendations.push({
          segment: segmentName,
          action: 'Re-activate',
          strategies: [
            'Send limited-time offers',
            'Provide educational content',
            'Reach out via SMS or WhatsApp',
            'Offer free shipping or gifts',
          ],
          priority: 'medium',
        });
      } else if (segmentName === 'Hibernating' || segmentName === 'About to Sleep') {
        recommendations.push({
          segment: segmentName,
          action: 'Aggressive Re-engagement',
          strategies: [
            'Send "We miss you" campaigns',
            'Offer deep discounts (20-30% off)',
            'Share company updates and new arrivals',
            'Create urgency with expiring offers',
          ],
          priority: 'medium',
        });
      } else if (segmentName === 'Lost') {
        recommendations.push({
          segment: segmentName,
          action: 'Last Chance or Let Go',
          strategies: [
            'Send final win-back email',
            'Offer significant discount or free product',
            'Survey exit reasons',
            'Consider removing from active marketing lists',
          ],
          priority: 'low',
        });
      } else if (segmentName === 'New Customers') {
        recommendations.push({
          segment: segmentName,
          action: 'Onboard and Convert',
          strategies: [
            'Welcome email series',
            'First purchase discount for second order',
            'Product usage tips and guides',
            'Build trust with testimonials',
          ],
          priority: 'high',
        });
      }
    });

    return NextResponse.json({
      success: true,
      segments: Object.values(segmentStats),
      total_customers: rfmData.rows.length,
      recommendations: recommendations,
      period_days: period,
    });

  } catch (error: any) {
    console.error("Error analyzing customer segments:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
