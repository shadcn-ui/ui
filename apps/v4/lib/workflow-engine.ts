/**
 * Ocean ERP - Workflow Engine Library
 * Comprehensive workflow and approval system for all modules
 */

// ============================================
// Types & Interfaces
// ============================================

export type WorkflowStatus = 'pending' | 'in_progress' | 'approved' | 'rejected' | 'cancelled'
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'delegated'
export type StepType = 'approval' | 'notification' | 'action'
export type ApproverType = 'role' | 'user' | 'dynamic' | 'manager'

export interface WorkflowDefinition {
  id: number
  name: string
  description?: string
  module: string
  document_type: string
  trigger_event: string
  is_active: boolean
  version: number
}

export interface WorkflowStep {
  id: number
  workflow_id: number
  step_order: number
  step_name: string
  step_type: StepType
  approver_type?: ApproverType
  approver_role_id?: string
  approver_user_id?: string
  approver_expression?: string
  is_parallel: boolean
  require_all_approvals: boolean
  timeout_hours?: number
  escalation_user_id?: string
  conditions?: Record<string, any>
  actions?: Record<string, any>[]
}

export interface WorkflowInstance {
  id: number
  workflow_id: number
  document_type: string
  document_id: number
  current_step_id?: number
  status: WorkflowStatus
  initiated_by: string
  initiated_at: string
  completed_at?: string
  completed_by?: string
  metadata?: Record<string, any>
}

export interface WorkflowApproval {
  id: number
  instance_id: number
  step_id: number
  approver_id: string
  status: ApprovalStatus
  assigned_at: string
  due_at?: string
  completed_at?: string
  is_escalated: boolean
  comments?: string
}

export interface WorkflowHistory {
  id: number
  instance_id: number
  step_id: number
  action: string
  performed_by: string
  performed_at: string
  comments?: string
  metadata?: Record<string, any>
}

// ============================================
// Workflow Condition Evaluator
// ============================================

export class ConditionEvaluator {
  /**
   * Evaluate if conditions are met for a workflow step
   */
  static evaluate(conditions: Record<string, any>, documentData: Record<string, any>): boolean {
    if (!conditions) return true

    // Handle logical operators
    if (conditions.and) {
      return conditions.and.every((cond: any) => this.evaluateCondition(cond, documentData))
    }

    if (conditions.or) {
      return conditions.or.some((cond: any) => this.evaluateCondition(cond, documentData))
    }

    // Single condition
    return this.evaluateCondition(conditions, documentData)
  }

  private static evaluateCondition(condition: any, data: Record<string, any>): boolean {
    const { field, operator, value } = condition
    const fieldValue = this.getNestedValue(data, field)

    switch (operator) {
      case 'eq':
        return fieldValue == value
      case 'neq':
        return fieldValue != value
      case 'gt':
        return Number(fieldValue) > Number(value)
      case 'gte':
        return Number(fieldValue) >= Number(value)
      case 'lt':
        return Number(fieldValue) < Number(value)
      case 'lte':
        return Number(fieldValue) <= Number(value)
      case 'in':
        return Array.isArray(value) && value.includes(fieldValue)
      case 'not_in':
        return Array.isArray(value) && !value.includes(fieldValue)
      case 'contains':
        return String(fieldValue).toLowerCase().includes(String(value).toLowerCase())
      case 'starts_with':
        return String(fieldValue).toLowerCase().startsWith(String(value).toLowerCase())
      case 'ends_with':
        return String(fieldValue).toLowerCase().endsWith(String(value).toLowerCase())
      default:
        return false
    }
  }

  private static getNestedValue(obj: Record<string, any>, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }
}

// ============================================
// Workflow Approver Resolver
// ============================================

export class ApproverResolver {
  /**
   * Resolve who should approve based on approver type and expression
   */
  static async resolveApprovers(
    step: WorkflowStep,
    documentData: Record<string, any>,
    pool: any
  ): Promise<string[]> {
    const approvers: string[] = []

    switch (step.approver_type) {
      case 'user':
        if (step.approver_user_id) {
          approvers.push(step.approver_user_id)
        }
        break

      case 'role':
        if (step.approver_role_id) {
          const roleApprovers = await this.getUsersByRole(step.approver_role_id, pool)
          approvers.push(...roleApprovers)
        }
        break

      case 'manager':
        const managerId = await this.getManagerOf(documentData.created_by, pool)
        if (managerId) approvers.push(managerId)
        break

      case 'dynamic':
        if (step.approver_expression) {
          const dynamicApprovers = await this.evaluateDynamicExpression(
            step.approver_expression,
            documentData,
            pool
          )
          approvers.push(...dynamicApprovers)
        }
        break
    }

    return approvers
  }

  private static async getUsersByRole(roleId: string, pool: any): Promise<string[]> {
    const client = await pool.connect()
    try {
      const result = await client.query(
        'SELECT user_id FROM user_roles WHERE role_id = $1',
        [roleId]
      )
      return result.rows.map((row: any) => row.user_id)
    } finally {
      client.release()
    }
  }

  private static async getManagerOf(userId: string, pool: any): Promise<string | null> {
    const client = await pool.connect()
    try {
      // Try to get from employees table
      const result = await client.query(
        `SELECT e.manager_id 
         FROM hrm_employees e
         INNER JOIN users u ON e.user_id = u.id
         WHERE u.id = $1`,
        [userId]
      )
      return result.rows[0]?.manager_id || null
    } catch (error) {
      console.error('Error getting manager:', error)
      return null
    } finally {
      client.release()
    }
  }

  private static async evaluateDynamicExpression(
    expression: string,
    documentData: Record<string, any>,
    pool: any
  ): Promise<string[]> {
    // Parse expressions like "manager_of(document.created_by)" or "role:procurement_manager"
    if (expression.startsWith('manager_of(')) {
      const match = expression.match(/manager_of\(([^)]+)\)/)
      if (match) {
        const field = match[1].replace('document.', '')
        const userId = documentData[field]
        const managerId = await this.getManagerOf(userId, pool)
        return managerId ? [managerId] : []
      }
    }

    if (expression.startsWith('role:')) {
      const roleName = expression.substring(5)
      const client = await pool.connect()
      try {
        const result = await client.query(
          `SELECT ur.user_id 
           FROM user_roles ur
           INNER JOIN roles r ON ur.role_id = r.id
           WHERE r.name = $1`,
          [roleName]
        )
        return result.rows.map((row: any) => row.user_id)
      } finally {
        client.release()
      }
    }

    return []
  }
}

// ============================================
// Workflow Engine Core
// ============================================

export class WorkflowEngine {
  /**
   * Start a new workflow instance
   */
  static async startWorkflow(
    documentType: string,
    documentId: number,
    initiatedBy: string,
    documentData: Record<string, any>,
    pool: any
  ): Promise<WorkflowInstance | null> {
    const client = await pool.connect()
    
    try {
      await client.query('BEGIN')

      // Find applicable workflow definition
      const workflowResult = await client.query(
        `SELECT * FROM workflow_definitions 
         WHERE document_type = $1 
         AND is_active = true 
         ORDER BY version DESC 
         LIMIT 1`,
        [documentType]
      )

      if (workflowResult.rows.length === 0) {
        await client.query('ROLLBACK')
        return null // No workflow defined for this document type
      }

      const workflow = workflowResult.rows[0]

      // Create workflow instance
      const instanceResult = await client.query(
        `INSERT INTO workflow_instances 
         (workflow_id, document_type, document_id, status, initiated_by, metadata)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [workflow.id, documentType, documentId, 'pending', initiatedBy, JSON.stringify(documentData)]
      )

      const instance = instanceResult.rows[0]

      // Get first step
      const stepResult = await client.query(
        `SELECT * FROM workflow_steps 
         WHERE workflow_id = $1 
         ORDER BY step_order ASC 
         LIMIT 1`,
        [workflow.id]
      )

      if (stepResult.rows.length > 0) {
        const firstStep = stepResult.rows[0]

        // Check if conditions are met
        if (ConditionEvaluator.evaluate(firstStep.conditions, documentData)) {
          // Update instance with current step
          await client.query(
            'UPDATE workflow_instances SET current_step_id = $1, status = $2 WHERE id = $3',
            [firstStep.id, 'in_progress', instance.id]
          )

          // Create approval tasks for this step
          await this.createApprovalTasks(instance.id, firstStep, documentData, client)
        }
      }

      await client.query('COMMIT')
      return instance
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  /**
   * Create approval tasks for approvers
   */
  private static async createApprovalTasks(
    instanceId: number,
    step: WorkflowStep,
    documentData: Record<string, any>,
    client: any
  ) {
    const approvers = await ApproverResolver.resolveApprovers(step, documentData, { connect: async () => client })

    const dueDate = step.timeout_hours 
      ? new Date(Date.now() + step.timeout_hours * 60 * 60 * 1000).toISOString()
      : null

    for (const approverId of approvers) {
      await client.query(
        `INSERT INTO workflow_approvals 
         (instance_id, step_id, approver_id, status, due_at)
         VALUES ($1, $2, $3, $4, $5)`,
        [instanceId, step.id, approverId, 'pending', dueDate]
      )
    }
  }

  /**
   * Process approval action
   */
  static async processApproval(
    approvalId: number,
    userId: string,
    action: 'approved' | 'rejected',
    comments: string,
    pool: any
  ): Promise<boolean> {
    const client = await pool.connect()
    
    try {
      await client.query('BEGIN')

      // Get approval details
      const approvalResult = await client.query(
        `SELECT wa.*, wi.id as instance_id, wi.workflow_id, wi.document_type, wi.document_id, 
                ws.require_all_approvals, ws.step_order, ws.workflow_id
         FROM workflow_approvals wa
         JOIN workflow_instances wi ON wa.instance_id = wi.id
         JOIN workflow_steps ws ON wa.step_id = ws.id
         WHERE wa.id = $1 AND wa.approver_id = $2 AND wa.status = 'pending'`,
        [approvalId, userId]
      )

      if (approvalResult.rows.length === 0) {
        await client.query('ROLLBACK')
        return false
      }

      const approval = approvalResult.rows[0]

      // Update approval status
      await client.query(
        `UPDATE workflow_approvals 
         SET status = $1, completed_at = NOW()
         WHERE id = $2`,
        [action, approvalId]
      )

      // Record in history
      await client.query(
        `INSERT INTO workflow_history 
         (instance_id, step_id, action, performed_by, comments)
         VALUES ($1, $2, $3, $4, $5)`,
        [approval.instance_id, approval.step_id, action, userId, comments]
      )

      // Check if step is complete
      const stepComplete = await this.checkStepCompletion(
        approval.instance_id,
        approval.step_id,
        approval.require_all_approvals,
        client
      )

      if (stepComplete.isComplete) {
        if (stepComplete.stepStatus === 'approved') {
          // Move to next step
          await this.moveToNextStep(approval.instance_id, approval.workflow_id, approval.step_order, client)
        } else {
          // Workflow rejected
          await client.query(
            `UPDATE workflow_instances 
             SET status = 'rejected', completed_at = NOW(), completed_by = $1
             WHERE id = $2`,
            [userId, approval.instance_id]
          )
        }
      }

      await client.query('COMMIT')
      return true
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  /**
   * Check if workflow step is complete
   */
  private static async checkStepCompletion(
    instanceId: number,
    stepId: number,
    requireAll: boolean,
    client: any
  ): Promise<{ isComplete: boolean; stepStatus: 'approved' | 'rejected' | 'pending' }> {
    const result = await client.query(
      `SELECT status, COUNT(*) as count
       FROM workflow_approvals
       WHERE instance_id = $1 AND step_id = $2
       GROUP BY status`,
      [instanceId, stepId]
    )

    const statusCounts = result.rows.reduce((acc: any, row: any) => {
      acc[row.status] = parseInt(row.count)
      return acc
    }, {})

    const approved = statusCounts.approved || 0
    const rejected = statusCounts.rejected || 0
    const pending = statusCounts.pending || 0

    // If any rejection, step is rejected
    if (rejected > 0) {
      return { isComplete: true, stepStatus: 'rejected' }
    }

    // If require all approvals, check all are approved
    if (requireAll) {
      if (pending === 0 && approved > 0) {
        return { isComplete: true, stepStatus: 'approved' }
      }
      return { isComplete: false, stepStatus: 'pending' }
    } else {
      // If at least one approval, step is approved
      if (approved > 0) {
        return { isComplete: true, stepStatus: 'approved' }
      }
      return { isComplete: false, stepStatus: 'pending' }
    }
  }

  /**
   * Move workflow to next step
   */
  private static async moveToNextStep(
    instanceId: number,
    workflowId: number,
    currentStepOrder: number,
    client: any
  ) {
    // Get next step
    const nextStepResult = await client.query(
      `SELECT * FROM workflow_steps 
       WHERE workflow_id = $1 AND step_order > $2
       ORDER BY step_order ASC 
       LIMIT 1`,
      [workflowId, currentStepOrder]
    )

    if (nextStepResult.rows.length === 0) {
      // No more steps, workflow is complete
      await client.query(
        `UPDATE workflow_instances 
         SET status = 'approved', completed_at = NOW()
         WHERE id = $1`,
        [instanceId]
      )
    } else {
      const nextStep = nextStepResult.rows[0]

      // Get document data from instance
      const instanceResult = await client.query(
        'SELECT metadata FROM workflow_instances WHERE id = $1',
        [instanceId]
      )
      const documentData = instanceResult.rows[0].metadata

      // Check conditions
      if (ConditionEvaluator.evaluate(nextStep.conditions, documentData)) {
        // Update instance
        await client.query(
          'UPDATE workflow_instances SET current_step_id = $1 WHERE id = $2',
          [nextStep.id, instanceId]
        )

        // Create approval tasks
        await this.createApprovalTasks(instanceId, nextStep, documentData, client)
      } else {
        // Skip this step, move to next
        await this.moveToNextStep(instanceId, workflowId, nextStep.step_order, client)
      }
    }
  }

  /**
   * Delegate approval to another user
   */
  static async delegateApproval(
    approvalId: number,
    fromUserId: string,
    toUserId: string,
    comments: string,
    pool: any
  ): Promise<boolean> {
    const client = await pool.connect()
    
    try {
      await client.query('BEGIN')

      // Update original approval
      await client.query(
        `UPDATE workflow_approvals 
         SET status = 'delegated', completed_at = NOW()
         WHERE id = $1 AND approver_id = $2`,
        [approvalId, fromUserId]
      )

      // Get approval details
      const result = await client.query(
        'SELECT instance_id, step_id, due_at FROM workflow_approvals WHERE id = $1',
        [approvalId]
      )

      if (result.rows.length > 0) {
        const { instance_id, step_id, due_at } = result.rows[0]

        // Create new approval for delegate
        await client.query(
          `INSERT INTO workflow_approvals 
           (instance_id, step_id, approver_id, status, due_at)
           VALUES ($1, $2, $3, $4, $5)`,
          [instance_id, step_id, toUserId, 'pending', due_at]
        )

        // Record in history
        await client.query(
          `INSERT INTO workflow_history 
           (instance_id, step_id, action, performed_by, comments, metadata)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [instance_id, step_id, 'delegated', fromUserId, comments, 
           JSON.stringify({ delegated_to: toUserId })]
        )
      }

      await client.query('COMMIT')
      return true
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  /**
   * Cancel a workflow instance
   */
  static async cancelWorkflow(
    instanceId: number,
    userId: string,
    reason: string,
    pool: any
  ): Promise<boolean> {
    const client = await pool.connect()
    
    try {
      await client.query('BEGIN')

      await client.query(
        `UPDATE workflow_instances 
         SET status = 'cancelled', completed_at = NOW(), completed_by = $1
         WHERE id = $2`,
        [userId, instanceId]
      )

      await client.query(
        `INSERT INTO workflow_history 
         (instance_id, step_id, action, performed_by, comments)
         VALUES ($1, NULL, $2, $3, $4)`,
        [instanceId, 'cancelled', userId, reason]
      )

      await client.query('COMMIT')
      return true
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }
}
