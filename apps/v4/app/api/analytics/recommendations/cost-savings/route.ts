import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface CostSavingOpportunity {
  opportunity_id: string;
  category: 'procurement' | 'inventory' | 'logistics' | 'operations' | 'pricing';
  title: string;
  description: string;
  current_cost: number;
  potential_savings: number;
  savings_percentage: number;
  implementation_difficulty: 'easy' | 'medium' | 'hard';
  estimated_implementation_time: string;
  priority_score: number;
  actionable_items: string[];
  affected_entities: {
    type: string;
    ids: number[];
    count: number;
  };
  confidence_score: number;
}

/**
 * @swagger
 * /api/analytics/recommendations/cost-savings:
 *   get:
 *     summary: Get cost-saving opportunity recommendations
 *     description: Identify opportunities to reduce costs across procurement, inventory, logistics, and operations
 *     tags: [Prescriptive Analytics]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [procurement, inventory, logistics, operations, pricing]
 *       - in: query
 *         name: min_savings
 *         schema:
 *           type: number
 *       - in: query
 *         name: max_difficulty
 *         schema:
 *           type: string
 *           enum: [easy, medium, hard]
 *     responses:
 *       200:
 *         description: List of cost-saving opportunities
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const min_savings = searchParams.get('min_savings');
    const max_difficulty = searchParams.get('max_difficulty');

    const startTime = Date.now();
    const opportunities: CostSavingOpportunity[] = [];

    // 1. PROCUREMENT OPPORTUNITIES
    if (!category || category === 'procurement') {
      // Bulk discount opportunities
      const bulkDiscountQuery = `
        WITH product_purchases AS (
          SELECT 
            p.product_id,
            p.product_code,
            p.product_name,
            p.supplier_id,
            s.company_name as supplier_name,
            p.cost_price,
            SUM(poi.quantity) as total_qty_90d,
            COUNT(DISTINCT po.purchase_order_id) as order_count,
            SUM(poi.quantity * poi.unit_price) as total_spend_90d,
            AVG(poi.quantity) as avg_order_qty
          FROM products p
          JOIN purchase_order_items poi ON p.product_id = poi.product_id
          JOIN purchase_orders po ON poi.purchase_order_id = po.purchase_order_id
          LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
          WHERE po.order_date >= CURRENT_DATE - INTERVAL '90 days'
            AND po.status != 'cancelled'
          GROUP BY p.product_id, p.product_code, p.product_name, p.supplier_id, s.company_name, p.cost_price
          HAVING COUNT(DISTINCT po.purchase_order_id) >= 3
        )
        SELECT 
          product_id,
          product_code,
          product_name,
          supplier_id,
          supplier_name,
          total_qty_90d,
          order_count,
          total_spend_90d,
          avg_order_qty,
          -- Estimate 5-15% discount for bulk orders
          CASE 
            WHEN order_count >= 10 THEN total_spend_90d * 0.15
            WHEN order_count >= 5 THEN total_spend_90d * 0.10
            ELSE total_spend_90d * 0.05
          END as potential_savings
        FROM product_purchases
        WHERE total_spend_90d > 1000
        ORDER BY potential_savings DESC
        LIMIT 5
      `;

      const bulkResult = await query(bulkDiscountQuery, []);
      
      bulkResult.rows.forEach((row, index) => {
        const savings = parseFloat(row.potential_savings);
        const currentCost = parseFloat(row.total_spend_90d);
        
        opportunities.push({
          opportunity_id: `PROC-BULK-${index + 1}`,
          category: 'procurement',
          title: `Bulk Discount Opportunity: ${row.product_name}`,
          description: `Consolidate ${row.order_count} small orders into fewer bulk orders to negotiate volume discounts with ${row.supplier_name}`,
          current_cost: currentCost,
          potential_savings: parseFloat(savings.toFixed(2)),
          savings_percentage: parseFloat(((savings / currentCost) * 100).toFixed(2)),
          implementation_difficulty: 'easy',
          estimated_implementation_time: '1-2 weeks',
          priority_score: savings / 100,
          actionable_items: [
            `Contact ${row.supplier_name} to negotiate bulk pricing`,
            `Increase order quantity to ${Math.ceil(parseFloat(row.avg_order_qty) * 3)} units per order`,
            `Reduce order frequency from ${row.order_count} to ${Math.ceil(parseInt(row.order_count) / 3)} orders per quarter`,
            'Update reorder points to support larger batch sizes'
          ],
          affected_entities: {
            type: 'products',
            ids: [parseInt(row.product_id)],
            count: 1
          },
          confidence_score: 0.8
        });
      });

      // Supplier consolidation opportunities
      const supplierConsolidationQuery = `
        WITH supplier_analysis AS (
          SELECT 
            s.supplier_id,
            s.company_name,
            COUNT(DISTINCT p.product_id) as product_count,
            SUM(poi.quantity * poi.unit_price) as total_spend_90d,
            AVG(s.lead_time_days) as avg_lead_time,
            COUNT(DISTINCT po.purchase_order_id) as order_count
          FROM suppliers s
          JOIN products p ON s.supplier_id = p.supplier_id
          JOIN purchase_order_items poi ON p.product_id = poi.product_id
          JOIN purchase_orders po ON poi.purchase_order_id = po.purchase_order_id
          WHERE po.order_date >= CURRENT_DATE - INTERVAL '90 days'
          GROUP BY s.supplier_id, s.company_name
          HAVING COUNT(DISTINCT p.product_id) <= 3
            AND SUM(poi.quantity * poi.unit_price) < 5000
        )
        SELECT * FROM supplier_analysis
        ORDER BY total_spend_90d DESC
        LIMIT 10
      `;

      const consolidationResult = await query(supplierConsolidationQuery, []);
      
      if (consolidationResult.rows.length >= 2) {
        const totalSpend = consolidationResult.rows.reduce((sum: number, row: any) => 
          sum + parseFloat(row.total_spend_90d), 0
        );
        const estimatedSavings = totalSpend * 0.08; // 8% savings from consolidation
        
        opportunities.push({
          opportunity_id: 'PROC-CONSOL-1',
          category: 'procurement',
          title: 'Supplier Consolidation Opportunity',
          description: `Consolidate ${consolidationResult.rows.length} low-volume suppliers into preferred supplier relationships`,
          current_cost: totalSpend,
          potential_savings: parseFloat(estimatedSavings.toFixed(2)),
          savings_percentage: 8.0,
          implementation_difficulty: 'medium',
          estimated_implementation_time: '1-2 months',
          priority_score: estimatedSavings / 100,
          actionable_items: [
            'Identify alternative suppliers who can provide multiple products',
            'Negotiate volume discounts with consolidated suppliers',
            'Reduce supplier management overhead',
            'Streamline procurement processes'
          ],
          affected_entities: {
            type: 'suppliers',
            ids: consolidationResult.rows.map((row: any) => parseInt(row.supplier_id)),
            count: consolidationResult.rows.length
          },
          confidence_score: 0.7
        });
      }
    }

    // 2. INVENTORY OPPORTUNITIES
    if (!category || category === 'inventory') {
      // Excess inventory carrying cost
      const excessInventoryQuery = `
        WITH inventory_analysis AS (
          SELECT 
            i.product_id,
            p.product_code,
            p.product_name,
            i.quantity_on_hand,
            p.cost_price,
            (i.quantity_on_hand * p.cost_price) as inventory_value,
            COALESCE(
              (SELECT SUM(soi.quantity) 
               FROM sales_order_items soi 
               JOIN sales_orders so ON soi.order_id = so.order_id
               WHERE soi.product_id = i.product_id 
                 AND so.order_date >= CURRENT_DATE - INTERVAL '90 days'
                 AND so.status NOT IN ('cancelled', 'rejected')
              ), 0
            ) as sales_90d,
            CASE 
              WHEN (SELECT SUM(soi.quantity) FROM sales_order_items soi 
                    JOIN sales_orders so ON soi.order_id = so.order_id
                    WHERE soi.product_id = i.product_id 
                      AND so.order_date >= CURRENT_DATE - INTERVAL '90 days') > 0 
              THEN i.quantity_on_hand / (
                (SELECT SUM(soi.quantity) FROM sales_order_items soi 
                 JOIN sales_orders so ON soi.order_id = so.order_id
                 WHERE soi.product_id = i.product_id 
                   AND so.order_date >= CURRENT_DATE - INTERVAL '90 days') / 90.0
              )
              ELSE 999
            END as days_of_supply
          FROM inventory i
          JOIN products p ON i.product_id = p.product_id
          WHERE i.quantity_on_hand > 0
        )
        SELECT *
        FROM inventory_analysis
        WHERE days_of_supply > 180  -- More than 6 months supply
          AND inventory_value > 500
        ORDER BY inventory_value DESC
        LIMIT 10
      `;

      const excessResult = await query(excessInventoryQuery, []);
      
      if (excessResult.rows.length > 0) {
        const totalExcessValue = excessResult.rows.reduce((sum: number, row: any) => 
          sum + parseFloat(row.inventory_value), 0
        );
        const carryingCostRate = 0.25; // 25% annual carrying cost
        const annualCarryingCost = totalExcessValue * carryingCostRate;
        
        opportunities.push({
          opportunity_id: 'INV-EXCESS-1',
          category: 'inventory',
          title: 'Excess Inventory Reduction',
          description: `Reduce excess inventory for ${excessResult.rows.length} slow-moving products with over 6 months supply`,
          current_cost: parseFloat(annualCarryingCost.toFixed(2)),
          potential_savings: parseFloat((annualCarryingCost * 0.6).toFixed(2)), // 60% reduction potential
          savings_percentage: 60.0,
          implementation_difficulty: 'medium',
          estimated_implementation_time: '3-6 months',
          priority_score: (annualCarryingCost * 0.6) / 100,
          actionable_items: [
            'Implement promotional pricing to move slow inventory',
            'Reduce reorder quantities for slow-moving items',
            'Consider liquidation for excess stock',
            'Improve demand forecasting accuracy',
            `Target inventory value reduction of $${(totalExcessValue * 0.4).toFixed(2)}`
          ],
          affected_entities: {
            type: 'products',
            ids: excessResult.rows.map((row: any) => parseInt(row.product_id)),
            count: excessResult.rows.length
          },
          confidence_score: 0.85
        });
      }

      // Stockout opportunity cost
      const stockoutQuery = `
        WITH stockout_products AS (
          SELECT 
            p.product_id,
            p.product_code,
            p.product_name,
            COALESCE(i.quantity_on_hand, 0) as current_stock,
            COUNT(DISTINCT so.order_id) as missed_orders_30d,
            SUM(soi.quantity * soi.unit_price) as lost_revenue_30d
          FROM products p
          LEFT JOIN inventory i ON p.product_id = i.product_id
          LEFT JOIN sales_order_items soi ON p.product_id = soi.product_id
          LEFT JOIN sales_orders so ON soi.order_id = so.order_id
          WHERE so.order_date >= CURRENT_DATE - INTERVAL '30 days'
            AND so.status = 'cancelled'
            AND so.cancelled_reason ILIKE '%stock%'
          GROUP BY p.product_id, p.product_code, p.product_name, i.quantity_on_hand
          HAVING SUM(soi.quantity * soi.unit_price) > 1000
        )
        SELECT * FROM stockout_products
        ORDER BY lost_revenue_30d DESC
        LIMIT 5
      `;

      try {
        const stockoutResult = await query(stockoutQuery, []);
        
        if (stockoutResult.rows.length > 0) {
          const totalLostRevenue = stockoutResult.rows.reduce((sum: number, row: any) => 
            sum + parseFloat(row.lost_revenue_30d), 0
          );
          const annualizedLoss = totalLostRevenue * 12;
          
          opportunities.push({
            opportunity_id: 'INV-STOCKOUT-1',
            category: 'inventory',
            title: 'Prevent Stockout Revenue Loss',
            description: `Improve inventory management for ${stockoutResult.rows.length} products with frequent stockouts`,
            current_cost: parseFloat(annualizedLoss.toFixed(2)),
            potential_savings: parseFloat((annualizedLoss * 0.7).toFixed(2)), // 70% prevention potential
            savings_percentage: 70.0,
            implementation_difficulty: 'easy',
            estimated_implementation_time: '2-4 weeks',
            priority_score: (annualizedLoss * 0.7) / 100,
            actionable_items: [
              'Increase safety stock levels for high-demand products',
              'Implement automated reorder point alerts',
              'Reduce supplier lead times',
              'Improve demand forecasting',
              `Prevent estimated $${(annualizedLoss * 0.7).toFixed(2)} in lost sales`
            ],
            affected_entities: {
              type: 'products',
              ids: stockoutResult.rows.map((row: any) => parseInt(row.product_id)),
              count: stockoutResult.rows.length
            },
            confidence_score: 0.75
          });
        }
      } catch (err) {
        console.log('Stockout analysis skipped - cancelled_reason column may not exist');
      }
    }

    // 3. LOGISTICS OPPORTUNITIES
    if (!category || category === 'logistics') {
      // Carrier rate optimization
      const carrierOptimizationQuery = `
        WITH shipment_analysis AS (
          SELECT 
            s.carrier_id,
            c.carrier_name,
            COUNT(*) as shipment_count,
            AVG(s.actual_cost) as avg_cost,
            SUM(s.actual_cost) as total_cost_90d,
            AVG(EXTRACT(EPOCH FROM (s.actual_delivery_date - s.scheduled_ship_date)) / 86400) as avg_delivery_days
          FROM shipments s
          LEFT JOIN carriers c ON s.carrier_id = c.carrier_id
          WHERE s.actual_ship_date >= CURRENT_DATE - INTERVAL '90 days'
            AND s.actual_cost > 0
          GROUP BY s.carrier_id, c.carrier_name
          HAVING COUNT(*) >= 10
        )
        SELECT * FROM shipment_analysis
        ORDER BY total_cost_90d DESC
      `;

      try {
        const carrierResult = await query(carrierOptimizationQuery, []);
        
        if (carrierResult.rows.length >= 2) {
          const totalShippingCost = carrierResult.rows.reduce((sum: number, row: any) => 
            sum + parseFloat(row.total_cost_90d), 0
          );
          const potentialSavings = totalShippingCost * 0.12; // 12% through optimization
          
          opportunities.push({
            opportunity_id: 'LOG-CARRIER-1',
            category: 'logistics',
            title: 'Carrier Rate Optimization',
            description: `Negotiate better rates or switch carriers for ${carrierResult.rows.length} active shipping partners`,
            current_cost: totalShippingCost,
            potential_savings: parseFloat(potentialSavings.toFixed(2)),
            savings_percentage: 12.0,
            implementation_difficulty: 'medium',
            estimated_implementation_time: '1-3 months',
            priority_score: potentialSavings / 100,
            actionable_items: [
              'Request competitive quotes from alternative carriers',
              'Negotiate volume discounts with current carriers',
              'Implement carrier selection algorithm based on cost and performance',
              'Consolidate shipments to reduce per-unit shipping costs'
            ],
            affected_entities: {
              type: 'carriers',
              ids: carrierResult.rows.map((row: any) => parseInt(row.carrier_id || 0)),
              count: carrierResult.rows.length
            },
            confidence_score: 0.8
          });
        }
      } catch (err) {
        console.log('Carrier optimization skipped - carriers table may not exist');
      }
    }

    // Filter opportunities based on criteria
    let filteredOpportunities = opportunities;
    
    if (min_savings) {
      const minSavingsValue = parseFloat(min_savings);
      filteredOpportunities = filteredOpportunities.filter(
        opp => opp.potential_savings >= minSavingsValue
      );
    }
    
    if (max_difficulty) {
      const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
      const maxDiffValue = difficultyOrder[max_difficulty as keyof typeof difficultyOrder];
      filteredOpportunities = filteredOpportunities.filter(
        opp => difficultyOrder[opp.implementation_difficulty] <= maxDiffValue
      );
    }

    // Sort by priority score (descending)
    filteredOpportunities.sort((a, b) => b.priority_score - a.priority_score);

    const executionTime = Date.now() - startTime;

    // Calculate summary
    const summary = {
      total_opportunities: filteredOpportunities.length,
      total_potential_savings: filteredOpportunities.reduce((sum, opp) => sum + opp.potential_savings, 0),
      by_category: {
        procurement: filteredOpportunities.filter(o => o.category === 'procurement').length,
        inventory: filteredOpportunities.filter(o => o.category === 'inventory').length,
        logistics: filteredOpportunities.filter(o => o.category === 'logistics').length,
        operations: filteredOpportunities.filter(o => o.category === 'operations').length,
        pricing: filteredOpportunities.filter(o => o.category === 'pricing').length
      },
      by_difficulty: {
        easy: filteredOpportunities.filter(o => o.implementation_difficulty === 'easy').length,
        medium: filteredOpportunities.filter(o => o.implementation_difficulty === 'medium').length,
        hard: filteredOpportunities.filter(o => o.implementation_difficulty === 'hard').length
      },
      avg_confidence_score: filteredOpportunities.length > 0
        ? filteredOpportunities.reduce((sum, opp) => sum + opp.confidence_score, 0) / filteredOpportunities.length
        : 0
    };

    return NextResponse.json({
      opportunities: filteredOpportunities,
      summary: {
        ...summary,
        total_potential_savings: parseFloat(summary.total_potential_savings.toFixed(2)),
        avg_confidence_score: parseFloat(summary.avg_confidence_score.toFixed(2))
      },
      filters: {
        category: category || null,
        min_savings: min_savings ? parseFloat(min_savings) : null,
        max_difficulty: max_difficulty || null
      },
      metadata: {
        execution_time_ms: executionTime,
        generated_at: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error in cost-savings recommendations API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
