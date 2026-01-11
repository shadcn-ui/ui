import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

/**
 * POST /api/analytics/anomalies/detect
 * Run anomaly detection across all active rules
 * 
 * Request body:
 * - rule_ids: Array of rule IDs to run (optional, defaults to all active)
 * - start_date: Start date for detection (defaults to 7 days ago)
 * - end_date: End date for detection (defaults to today)
 */
export async function POST(request: Request) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const body = await request.json();
    const {
      rule_ids,
      start_date = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end_date = new Date().toISOString().split('T')[0]
    } = body;

    // Get detection rules
    let rulesQuery = 'SELECT * FROM anomaly_detection_rules WHERE is_active = true';
    const params: any[] = [];
    
    if (rule_ids && rule_ids.length > 0) {
      rulesQuery += ' AND id = ANY($1)';
      params.push(rule_ids);
    }

    const rulesResult = await client.query(rulesQuery, params);
    const rules = rulesResult.rows;

    if (rules.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No active detection rules found' },
        { status: 404 }
      );
    }

    const detectedAnomalies = [];

    // Run each detection rule
    for (const rule of rules) {
      try {
        // Get data based on target table/column
        const dataQuery = buildDataQuery(rule, start_date, end_date);
        const dataResult = await client.query(dataQuery);
        const data = dataResult.rows;

        if (data.length === 0) continue;

        // Detect anomalies based on method
        let anomalies = [];
        switch (rule.detection_method) {
          case 'z_score':
            anomalies = detectZScore(data, rule);
            break;
          case 'iqr':
            anomalies = detectIQR(data, rule);
            break;
          case 'threshold':
            anomalies = detectThreshold(data, rule);
            break;
          case 'moving_average':
            anomalies = detectMovingAverage(data, rule);
            break;
          default:
            anomalies = detectZScore(data, rule);
        }

        // Insert detected anomalies
        for (const anomaly of anomalies) {
          const insertQuery = `
            INSERT INTO detected_anomalies (
              rule_id, anomaly_type, severity, detected_at,
              anomaly_date, metric_name, expected_value, actual_value,
              deviation, deviation_percent, statistical_score,
              affected_entity_type, affected_entity_id, affected_entity_name,
              anomaly_details, potential_causes
            ) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
            RETURNING *
          `;

          const result = await client.query(insertQuery, [
            rule.id,
            anomaly.type,
            anomaly.severity,
            anomaly.date,
            rule.target_metric,
            anomaly.expected,
            anomaly.actual,
            anomaly.deviation,
            anomaly.deviation_percent,
            anomaly.score,
            anomaly.entity_type || null,
            anomaly.entity_id || null,
            anomaly.entity_name || null,
            JSON.stringify(anomaly.details || {}),
            anomaly.causes || []
          ]);

          detectedAnomalies.push(result.rows[0]);
        }

        // Update rule last checked time
        await client.query(
          'UPDATE anomaly_detection_rules SET last_checked_at = CURRENT_TIMESTAMP WHERE id = $1',
          [rule.id]
        );

      } catch (ruleError: any) {
        console.error(`Error running rule ${rule.rule_code}:`, ruleError);
        // Continue with other rules
      }
    }

    await client.query('COMMIT');

    return NextResponse.json({
      success: true,
      message: `Detected ${detectedAnomalies.length} anomalies`,
      anomalies: detectedAnomalies,
      summary: {
        rules_executed: rules.length,
        anomalies_detected: detectedAnomalies.length,
        critical: detectedAnomalies.filter(a => a.severity === 'critical').length,
        high: detectedAnomalies.filter(a => a.severity === 'high').length,
        medium: detectedAnomalies.filter(a => a.severity === 'medium').length,
        low: detectedAnomalies.filter(a => a.severity === 'low').length
      }
    });

  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error detecting anomalies:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

/**
 * Build data query based on rule configuration
 */
function buildDataQuery(rule: any, startDate: string, endDate: string): string {
  const params = JSON.parse(rule.detection_parameters || '{}');
  
  // Default query based on target metric
  if (rule.target_metric.includes('revenue')) {
    return `
      SELECT 
        DATE(created_at) as date,
        SUM(total_amount) as value
      FROM sales_orders
      WHERE status IN ('completed', 'shipped', 'delivered')
        AND DATE(created_at) BETWEEN '${startDate}' AND '${endDate}'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;
  } else if (rule.target_metric.includes('order')) {
    return `
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as value
      FROM sales_orders
      WHERE DATE(created_at) BETWEEN '${startDate}' AND '${endDate}'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;
  } else if (rule.target_metric.includes('inventory')) {
    return `
      SELECT 
        CURRENT_DATE as date,
        product_id,
        quantity_on_hand as value
      FROM inventory
      WHERE quantity_on_hand >= 0
    `;
  }
  
  // Generic query
  return `
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as value
    FROM ${rule.target_table || 'sales_orders'}
    WHERE DATE(created_at) BETWEEN '${startDate}' AND '${endDate}'
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `;
}

/**
 * Z-Score anomaly detection
 */
function detectZScore(data: any[], rule: any): any[] {
  const values = data.map(d => parseFloat(d.value));
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  const threshold = parseFloat(rule.z_score_threshold) || 3.0;

  const anomalies = [];
  for (const row of data) {
    const value = parseFloat(row.value);
    const zScore = (value - mean) / stdDev;
    
    if (Math.abs(zScore) > threshold) {
      anomalies.push({
        date: row.date,
        type: zScore > 0 ? 'spike' : 'drop',
        severity: Math.abs(zScore) > 4 ? 'critical' : Math.abs(zScore) > 3.5 ? 'high' : 'medium',
        expected: mean,
        actual: value,
        deviation: value - mean,
        deviation_percent: ((value - mean) / mean) * 100,
        score: zScore,
        details: { method: 'z_score', threshold, stdDev },
        causes: zScore > 0 ? 
          ['Unusual spike in activity', 'Possible data entry error', 'Promotional campaign effect'] :
          ['Significant drop detected', 'System downtime possible', 'Seasonal variation']
      });
    }
  }
  
  return anomalies;
}

/**
 * IQR (Interquartile Range) anomaly detection
 */
function detectIQR(data: any[], rule: any): any[] {
  const values = data.map(d => parseFloat(d.value)).sort((a, b) => a - b);
  const n = values.length;
  
  const q1Index = Math.floor(n * 0.25);
  const q3Index = Math.floor(n * 0.75);
  const q1 = values[q1Index];
  const q3 = values[q3Index];
  const iqr = q3 - q1;
  const multiplier = parseFloat(rule.iqr_multiplier) || 1.5;
  
  const lowerBound = q1 - multiplier * iqr;
  const upperBound = q3 + multiplier * iqr;

  const anomalies = [];
  for (const row of data) {
    const value = parseFloat(row.value);
    
    if (value < lowerBound || value > upperBound) {
      const median = values[Math.floor(n / 2)];
      anomalies.push({
        date: row.date,
        type: value > upperBound ? 'spike' : 'drop',
        severity: value > upperBound + iqr || value < lowerBound - iqr ? 'high' : 'medium',
        expected: median,
        actual: value,
        deviation: value - median,
        deviation_percent: ((value - median) / median) * 100,
        score: (value - median) / iqr,
        details: { method: 'iqr', q1, q3, iqr, lowerBound, upperBound },
        causes: ['Statistical outlier detected', 'Value outside normal range']
      });
    }
  }
  
  return anomalies;
}

/**
 * Threshold-based anomaly detection
 */
function detectThreshold(data: any[], rule: any): any[] {
  const params = JSON.parse(rule.detection_parameters || '{}');
  const threshold = parseFloat(params.threshold) || parseFloat(rule.percentage_threshold) || 0;

  const anomalies = [];
  for (const row of data) {
    const value = parseFloat(row.value);
    
    if (value > threshold) {
      anomalies.push({
        date: row.date,
        type: 'threshold_breach',
        severity: value > threshold * 1.5 ? 'critical' : 'high',
        expected: threshold,
        actual: value,
        deviation: value - threshold,
        deviation_percent: ((value - threshold) / threshold) * 100,
        score: value / threshold,
        details: { method: 'threshold', threshold },
        causes: ['Threshold exceeded', 'Manual review required']
      });
    }
  }
  
  return anomalies;
}

/**
 * Moving Average anomaly detection
 */
function detectMovingAverage(data: any[], rule: any): any[] {
  const window = parseInt(rule.lookback_period_days) || 7;
  const sensitivity = rule.sensitivity === 'high' ? 1.5 : rule.sensitivity === 'low' ? 2.5 : 2.0;

  const anomalies = [];
  for (let i = window; i < data.length; i++) {
    const windowData = data.slice(i - window, i);
    const values = windowData.map(d => parseFloat(d.value));
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const stdDev = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length);
    
    const currentValue = parseFloat(data[i].value);
    const deviation = Math.abs(currentValue - avg);
    
    if (deviation > sensitivity * stdDev) {
      anomalies.push({
        date: data[i].date,
        type: currentValue > avg ? 'spike' : 'drop',
        severity: deviation > 3 * stdDev ? 'critical' : deviation > 2.5 * stdDev ? 'high' : 'medium',
        expected: avg,
        actual: currentValue,
        deviation: currentValue - avg,
        deviation_percent: ((currentValue - avg) / avg) * 100,
        score: deviation / stdDev,
        details: { method: 'moving_average', window, avg, stdDev },
        causes: ['Deviation from recent trend', 'Pattern break detected']
      });
    }
  }
  
  return anomalies;
}
