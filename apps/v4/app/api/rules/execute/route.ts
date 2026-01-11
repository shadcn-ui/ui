import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// POST /api/rules/execute - Execute business rules for an event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { module, event_type, entity_id, entity_type, data } = body;

    if (!module || !event_type || !data) {
      return NextResponse.json(
        { error: 'module, event_type, and data are required' },
        { status: 400 }
      );
    }

    // Get all active rules for this module and event type
    const rulesResult = await query(
      `SELECT * FROM business_rules
      WHERE module = $1 AND event_type = $2 AND is_active = true
      ORDER BY priority DESC, created_at ASC`,
      [module, event_type]
    );

    const rules = rulesResult.rows;
    const executedActions: any[] = [];
    const logs: any[] = [];

    for (const rule of rules) {
      try {
        const conditions = typeof rule.conditions === 'string' 
          ? JSON.parse(rule.conditions) 
          : rule.conditions;

        // Evaluate conditions
        const conditionsMet = evaluateConditions(conditions, data);

        // Log the rule execution
        await query(
          `INSERT INTO business_rule_logs
          (rule_id, entity_type, entity_id, conditions_met, executed_at)
          VALUES ($1, $2, $3, $4, NOW())`,
          [rule.id, entity_type, entity_id, conditionsMet]
        );

        if (conditionsMet) {
          const actions = typeof rule.actions === 'string'
            ? JSON.parse(rule.actions)
            : rule.actions;

          // Execute actions
          const actionResults = await executeActions(actions, data, entity_id, entity_type);
          executedActions.push({
            rule_id: rule.id,
            rule_name: rule.name,
            actions: actionResults
          });

          logs.push({
            rule_id: rule.id,
            rule_name: rule.name,
            conditions_met: true,
            actions_executed: actionResults.length
          });
        } else {
          logs.push({
            rule_id: rule.id,
            rule_name: rule.name,
            conditions_met: false,
            actions_executed: 0
          });
        }

      } catch (error: any) {
        console.error(`Error executing rule ${rule.id}:`, error);
        logs.push({
          rule_id: rule.id,
          rule_name: rule.name,
          error: error.message
        });
      }
    }

    return NextResponse.json({
      success: true,
      rules_evaluated: rules.length,
      rules_triggered: executedActions.length,
      executed_actions: executedActions,
      logs
    });

  } catch (error: any) {
    console.error('Error executing business rules:', error);
    return NextResponse.json(
      { error: 'Failed to execute business rules', details: error.message },
      { status: 500 }
    );
  }
}

// Evaluate conditions against data
function evaluateConditions(conditions: any, data: any): boolean {
  if (!conditions) return true;

  const { operator, rules } = conditions;

  if (!rules || rules.length === 0) return true;

  if (operator === 'AND') {
    return rules.every((rule: any) => evaluateRule(rule, data));
  } else if (operator === 'OR') {
    return rules.some((rule: any) => evaluateRule(rule, data));
  }

  return false;
}

// Evaluate a single rule
function evaluateRule(rule: any, data: any): boolean {
  const { field, operator, value } = rule;
  const fieldValue = getNestedValue(data, field);

  switch (operator) {
    case 'equals':
      return fieldValue == value;
    case 'not_equals':
      return fieldValue != value;
    case 'greater_than':
      return parseFloat(fieldValue) > parseFloat(value);
    case 'less_than':
      return parseFloat(fieldValue) < parseFloat(value);
    case 'greater_than_or_equal':
      return parseFloat(fieldValue) >= parseFloat(value);
    case 'less_than_or_equal':
      return parseFloat(fieldValue) <= parseFloat(value);
    case 'contains':
      return String(fieldValue).includes(String(value));
    case 'not_contains':
      return !String(fieldValue).includes(String(value));
    case 'is_empty':
      return !fieldValue || fieldValue === '' || fieldValue === null;
    case 'is_not_empty':
      return fieldValue && fieldValue !== '' && fieldValue !== null;
    case 'in':
      return Array.isArray(value) && value.includes(fieldValue);
    case 'not_in':
      return Array.isArray(value) && !value.includes(fieldValue);
    default:
      return false;
  }
}

// Get nested value from object using dot notation
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

// Execute actions
async function executeActions(actions: any[], data: any, entityId: any, entityType: any): Promise<any[]> {
  const results = [];

  for (const action of actions) {
    try {
      const result = await executeAction(action, data, entityId, entityType);
      results.push({
        action_type: action.type,
        success: true,
        result
      });
    } catch (error: any) {
      results.push({
        action_type: action.type,
        success: false,
        error: error.message
      });
    }
  }

  return results;
}

// Execute a single action
async function executeAction(action: any, data: any, entityId: any, entityType: any): Promise<any> {
  const { type, config } = action;

  switch (type) {
    case 'send_email':
      // Queue email
      await query(
        `INSERT INTO email_queue
        (to_email, to_name, subject, body_html, priority, status)
        VALUES ($1, $2, $3, $4, $5, 'pending')`,
        [
          config.to_email || data.email,
          config.to_name || data.name,
          renderTemplate(config.subject, data),
          renderTemplate(config.body, data),
          config.priority || 'normal'
        ]
      );
      return { message: 'Email queued' };

    case 'create_notification':
      // Create notification
      await query(
        `INSERT INTO notifications
        (user_id, type, title, message, link)
        VALUES ($1, $2, $3, $4, $5)`,
        [
          config.user_id || data.user_id,
          config.notification_type || 'info',
          renderTemplate(config.title, data),
          renderTemplate(config.message, data),
          config.link
        ]
      );
      return { message: 'Notification created' };

    case 'update_field':
      // Update entity field (would need to be implemented per entity type)
      return { message: 'Field update action not fully implemented' };

    case 'start_workflow':
      // Start a workflow
      // TODO: Call workflow start API
      return { message: 'Workflow start action not fully implemented' };

    case 'webhook':
      // Call webhook (would need HTTP client)
      return { message: 'Webhook action not fully implemented' };

    default:
      throw new Error(`Unknown action type: ${type}`);
  }
}

// Simple template rendering
function renderTemplate(template: string, variables: Record<string, any>): string {
  let rendered = template;

  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    rendered = rendered.replace(regex, String(value));
  }

  return rendered;
}
