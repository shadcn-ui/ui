import { describe, it, expect, beforeAll } from 'vitest';

/**
 * Phase 7 Integration Tests - Task 9: Project Management
 * 
 * Tests for:
 * - Projects API (CRUD, filtering, statistics)
 * - Tasks API (dependencies, status updates)
 * - Time Tracking API (logging, approval workflow)
 * - Resources API (allocation, utilization)
 * - Budgets API (tracking, variance)
 * - Expenses API (submission, approval)
 * - Documents API (upload, version control)
 * - Analytics API (dashboard, reports)
 * - Database triggers (auto-calculations)
 */

const API_BASE = process.env.API_BASE_URL || 'http://localhost:4000/api';

// Test data
let testProjectId: number;
let testTaskId1: number;
let testTaskId2: number;
let testTimeEntryId: number;
let testResourceId: number;
let testBudgetId: number;
let testExpenseId: number;
let testDocumentId: number;

describe('Phase 7 - Task 9: Project Management', () => {
  
  // ========================================
  // Projects API Tests
  // ========================================
  
  describe('Projects API', () => {
    it('should create a new project', async () => {
      const response = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_code: 'TEST-' + Date.now(),
          project_name: 'Test Project Integration',
          project_description: 'Automated test project',
          project_type: 'internal',
          project_category: 'software',
          planned_start_date: '2025-01-01',
          planned_end_date: '2025-06-30',
          budget_amount: 100000,
          billing_type: 'time_and_material',
          billing_rate_per_hour: 150,
          priority: 'high',
          created_by: 1
        })
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('project_id');
      expect(data.data.project_name).toBe('Test Project Integration');
      expect(data.data.budget_amount).toBe(100000);
      
      testProjectId = data.data.project_id;
    });

    it('should list all projects with statistics', async () => {
      const response = await fetch(`${API_BASE}/projects`);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data.projects)).toBe(true);
      expect(data.data).toHaveProperty('statistics');
      expect(data.data.statistics).toHaveProperty('total_projects');
      expect(data.data.statistics).toHaveProperty('active_projects');
      expect(data.data.statistics).toHaveProperty('total_budget');
    });

    it('should filter projects by status', async () => {
      const response = await fetch(`${API_BASE}/projects?project_status=planning`);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      data.data.projects.forEach((project: any) => {
        expect(project.project_status).toBe('planning');
      });
    });

    it('should get project by ID with details', async () => {
      const response = await fetch(`${API_BASE}/projects/${testProjectId}`);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.project_id).toBe(testProjectId);
      expect(data.data).toHaveProperty('phases');
      expect(data.data).toHaveProperty('milestones');
      expect(data.data).toHaveProperty('tasks_summary');
      expect(data.data).toHaveProperty('team_members');
      expect(data.data).toHaveProperty('budget_breakdown');
    });

    it('should update project status', async () => {
      const response = await fetch(`${API_BASE}/projects/${testProjectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_status: 'active',
          actual_start_date: '2025-01-02'
        })
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.project_status).toBe('active');
      expect(data.data.actual_start_date).toBe('2025-01-02');
    });

    it('should search projects by name', async () => {
      const response = await fetch(`${API_BASE}/projects?search=test`);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.projects.length).toBeGreaterThan(0);
    });
  });

  // ========================================
  // Tasks API Tests
  // ========================================

  describe('Tasks API', () => {
    it('should create a new task', async () => {
      const response = await fetch(`${API_BASE}/projects/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: testProjectId,
          task_name: 'Setup Development Environment',
          task_description: 'Configure dev servers and tools',
          task_type: 'task',
          priority: 'high',
          estimated_hours: 16,
          planned_start_date: '2025-01-02',
          due_date: '2025-01-05',
          assigned_to: 1,
          is_billable: true,
          created_by: 1
        })
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('task_id');
      expect(data.data.task_name).toBe('Setup Development Environment');
      expect(data.data.estimated_hours).toBe(16);
      
      testTaskId1 = data.data.task_id;
    });

    it('should create a second task with dependency', async () => {
      // First create the dependent task
      const response = await fetch(`${API_BASE}/projects/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: testProjectId,
          task_name: 'Implement Features',
          task_description: 'Build core functionality',
          priority: 'high',
          estimated_hours: 40,
          created_by: 1
        })
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      testTaskId2 = data.data.task_id;

      // Create dependency (Task 2 depends on Task 1)
      const depResponse = await fetch(`${API_BASE}/projects/task-dependencies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: testTaskId2,
          depends_on_task_id: testTaskId1,
          dependency_type: 'finish_to_start',
          lag_days: 0
        })
      });

      expect(depResponse.status).toBe(201);
    });

    it('should list tasks with filtering', async () => {
      const response = await fetch(
        `${API_BASE}/projects/tasks?project_id=${testProjectId}&priority=high`
      );
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data.tasks)).toBe(true);
      expect(data.data).toHaveProperty('statistics');
    });

    it('should get task by ID with dependencies', async () => {
      const response = await fetch(`${API_BASE}/projects/tasks/${testTaskId2}`);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.task_id).toBe(testTaskId2);
      expect(data.data).toHaveProperty('dependencies');
      expect(data.data.dependencies.length).toBeGreaterThan(0);
      expect(data.data.dependencies[0].depends_on_task_id).toBe(testTaskId1);
    });

    it('should update task status and completion', async () => {
      const response = await fetch(`${API_BASE}/projects/tasks/${testTaskId1}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_status: 'completed',
          completion_percentage: 100
        })
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.task_status).toBe('completed');
      expect(data.data.completion_percentage).toBe(100);
      expect(data.data).toHaveProperty('completed_at');
    });

    it('should mark task as blocked', async () => {
      const response = await fetch(`${API_BASE}/projects/tasks/${testTaskId2}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_blocked: true,
          blocked_reason: 'Waiting for external approval'
        })
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.is_blocked).toBe(true);
      expect(data.data).toHaveProperty('blocked_date');
    });

    it('should prevent deletion of task with dependencies', async () => {
      const response = await fetch(`${API_BASE}/projects/tasks/${testTaskId1}`, {
        method: 'DELETE'
      });

      // Should fail because testTaskId2 depends on it
      expect(response.status).toBe(400);
    });
  });

  // ========================================
  // Time Tracking Tests
  // ========================================

  describe('Time Tracking API', () => {
    it('should log time entry', async () => {
      const response = await fetch(`${API_BASE}/projects/time-entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: testProjectId,
          task_id: testTaskId1,
          user_id: 1,
          entry_date: '2025-01-03',
          hours_worked: 8,
          is_billable: true,
          billing_rate: 150,
          work_description: 'Completed environment setup',
          activity_type: 'development',
          created_by: 1
        })
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('time_entry_id');
      expect(data.data.hours_worked).toBe(8);
      expect(data.data.billable_amount).toBe(1200); // 8 * 150
      
      testTimeEntryId = data.data.time_entry_id;
    });

    it('should list time entries with filtering', async () => {
      const response = await fetch(
        `${API_BASE}/projects/time-entries?project_id=${testProjectId}&is_billable=true`
      );
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data.time_entries)).toBe(true);
      expect(data.data).toHaveProperty('statistics');
      expect(data.data.statistics).toHaveProperty('total_hours');
      expect(data.data.statistics).toHaveProperty('total_billable_amount');
    });

    it('should validate hours worked (0-24)', async () => {
      const response = await fetch(`${API_BASE}/projects/time-entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: testProjectId,
          user_id: 1,
          entry_date: '2025-01-03',
          hours_worked: 25, // Invalid
          work_description: 'Test',
          created_by: 1
        })
      });

      expect(response.status).toBe(400);
    });

    it('should approve time entries', async () => {
      const response = await fetch(`${API_BASE}/projects/time-entries/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          time_entry_ids: [testTimeEntryId],
          approved_by: 1
        })
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.approved_count).toBe(1);
    });

    it('should track overtime with multiplier', async () => {
      const response = await fetch(`${API_BASE}/projects/time-entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: testProjectId,
          user_id: 1,
          entry_date: '2025-01-04',
          hours_worked: 3,
          is_overtime: true,
          overtime_multiplier: 1.5,
          billing_rate: 150,
          work_description: 'Emergency bug fix',
          created_by: 1
        })
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.data.billable_amount).toBe(675); // 3 * 150 * 1.5
    });
  });

  // ========================================
  // Resources Tests
  // ========================================

  describe('Resources API', () => {
    it('should create a new resource', async () => {
      const response = await fetch(`${API_BASE}/projects/resources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resource_type: 'human',
          resource_name: 'John Developer',
          user_id: 1,
          role: 'Senior Developer',
          skill_set: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
          daily_capacity_hours: 8,
          weekly_capacity_hours: 40,
          cost_per_hour: 50,
          billing_rate_per_hour: 150,
          is_available: true,
          created_by: 1
        })
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('resource_id');
      
      testResourceId = data.data.resource_id;
    });

    it('should list resources with filtering', async () => {
      const response = await fetch(
        `${API_BASE}/projects/resources?resource_type=human&is_available=true`
      );
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data.resources)).toBe(true);
    });

    it('should get resource utilization', async () => {
      const response = await fetch(`${API_BASE}/projects/resources/${testResourceId}`);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('active_allocations');
      expect(data.data).toHaveProperty('total_allocated_hours');
    });
  });

  // ========================================
  // Budgets Tests
  // ========================================

  describe('Budgets API', () => {
    it('should create a budget', async () => {
      const response = await fetch(`${API_BASE}/projects/budgets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: testProjectId,
          budget_category: 'labor',
          budget_subcategory: 'development',
          budgeted_amount: 50000,
          created_by: 1
        })
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('budget_id');
      
      testBudgetId = data.data.budget_id;
    });

    it('should list budgets with summary', async () => {
      const response = await fetch(
        `${API_BASE}/projects/budgets?project_id=${testProjectId}`
      );
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data.budgets)).toBe(true);
      expect(data.data).toHaveProperty('summary');
      expect(data.data.summary).toHaveProperty('total_budgeted');
      expect(data.data.summary).toHaveProperty('total_variance');
    });
  });

  // ========================================
  // Expenses Tests
  // ========================================

  describe('Expenses API', () => {
    it('should submit an expense', async () => {
      const response = await fetch(`${API_BASE}/projects/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: testProjectId,
          expense_date: '2025-01-05',
          expense_category: 'Software',
          expense_description: 'Development tools license',
          expense_amount: 500,
          submitted_by: 1,
          is_billable: true,
          markup_percentage: 20
        })
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('expense_id');
      expect(data.data.billable_amount).toBe(600); // 500 * 1.2
      
      testExpenseId = data.data.expense_id;
    });

    it('should list expenses with statistics', async () => {
      const response = await fetch(
        `${API_BASE}/projects/expenses?project_id=${testProjectId}`
      );
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data.expenses)).toBe(true);
      expect(data.data).toHaveProperty('statistics');
    });

    it('should approve expenses', async () => {
      const response = await fetch(`${API_BASE}/projects/expenses/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expense_ids: [testExpenseId],
          approved_by: 1,
          action: 'approve'
        })
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.approved_count).toBe(1);
    });

    it('should reject expenses with reason', async () => {
      const response = await fetch(`${API_BASE}/projects/expenses/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expense_ids: [testExpenseId],
          approved_by: 1,
          action: 'reject',
          rejection_reason: 'Missing receipt'
        })
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
    });
  });

  // ========================================
  // Documents Tests
  // ========================================

  describe('Documents API', () => {
    it('should upload a document', async () => {
      const response = await fetch(`${API_BASE}/projects/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: testProjectId,
          document_name: 'Project Requirements',
          document_type: 'specification',
          file_name: 'requirements.pdf',
          file_url: 'https://example.com/requirements.pdf',
          file_size_bytes: 1024000,
          version: '1.0',
          is_latest_version: true,
          uploaded_by: 1
        })
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('document_id');
      
      testDocumentId = data.data.document_id;
    });

    it('should list documents', async () => {
      const response = await fetch(
        `${API_BASE}/projects/documents?project_id=${testProjectId}`
      );
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data.documents)).toBe(true);
    });
  });

  // ========================================
  // Analytics Tests
  // ========================================

  describe('Analytics API', () => {
    it('should get portfolio dashboard', async () => {
      const response = await fetch(`${API_BASE}/projects/analytics`);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('project_stats');
      expect(data.data).toHaveProperty('task_stats');
      expect(data.data).toHaveProperty('projects_by_status');
    });

    it('should get financial analytics', async () => {
      const response = await fetch(
        `${API_BASE}/projects/analytics?type=financial&from_date=2025-01-01&to_date=2025-12-31`
      );
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('financial_summary');
      expect(data.data).toHaveProperty('budget_by_category');
      expect(data.data).toHaveProperty('revenue_analysis');
    });

    it('should get resource analytics', async () => {
      const response = await fetch(`${API_BASE}/projects/analytics?type=resources`);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('resource_utilization');
      expect(data.data).toHaveProperty('top_performers');
    });

    it('should get timeline analytics', async () => {
      const response = await fetch(`${API_BASE}/projects/analytics?type=timeline`);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('upcoming_deadlines');
      expect(data.data).toHaveProperty('overdue_projects');
    });

    it('should get project-specific dashboard', async () => {
      const response = await fetch(
        `${API_BASE}/projects/analytics?project_id=${testProjectId}`
      );
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('project');
      expect(data.data).toHaveProperty('timeline');
      expect(data.data).toHaveProperty('budget_breakdown');
      expect(data.data).toHaveProperty('team_members');
    });
  });

  // ========================================
  // Database Triggers Tests
  // ========================================

  describe('Database Triggers', () => {
    it('should auto-update project completion percentage', async () => {
      // Get project before
      const beforeResponse = await fetch(`${API_BASE}/projects/${testProjectId}`);
      const beforeData = await beforeResponse.json();
      const beforeCompletion = beforeData.data.completion_percentage;

      // Complete a task
      await fetch(`${API_BASE}/projects/tasks/${testTaskId2}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completion_percentage: 100 })
      });

      // Get project after
      const afterResponse = await fetch(`${API_BASE}/projects/${testProjectId}`);
      const afterData = await afterResponse.json();
      
      // Completion should have increased
      expect(afterData.data.completion_percentage).toBeGreaterThan(beforeCompletion);
    });

    it('should auto-update project costs from time entries', async () => {
      // Get project costs before
      const beforeResponse = await fetch(`${API_BASE}/projects/${testProjectId}`);
      const beforeData = await beforeResponse.json();
      const beforeCost = beforeData.data.actual_cost || 0;

      // Log more time
      await fetch(`${API_BASE}/projects/time-entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: testProjectId,
          user_id: 1,
          entry_date: '2025-01-06',
          hours_worked: 5,
          billing_rate: 150,
          work_description: 'Additional work',
          created_by: 1
        })
      });

      // Get project costs after
      const afterResponse = await fetch(`${API_BASE}/projects/${testProjectId}`);
      const afterData = await afterResponse.json();
      
      // Costs should have increased by 750 (5 * 150)
      expect(afterData.data.actual_cost).toBeGreaterThanOrEqual(beforeCost + 750);
    });
  });

  // ========================================
  // Cleanup
  // ========================================

  describe('Cleanup', () => {
    it('should delete test document', async () => {
      const response = await fetch(`${API_BASE}/projects/documents/${testDocumentId}`, {
        method: 'DELETE'
      });
      expect(response.status).toBe(200);
    });

    it('should delete test expense', async () => {
      const response = await fetch(`${API_BASE}/projects/expenses/${testExpenseId}`, {
        method: 'DELETE'
      });
      expect(response.status).toBe(200);
    });

    it('should delete test budget', async () => {
      const response = await fetch(`${API_BASE}/projects/budgets/${testBudgetId}`, {
        method: 'DELETE'
      });
      expect(response.status).toBe(200);
    });

    it('should delete test resource', async () => {
      const response = await fetch(`${API_BASE}/projects/resources/${testResourceId}`, {
        method: 'DELETE'
      });
      expect(response.status).toBe(200);
    });

    it('should delete test tasks', async () => {
      await fetch(`${API_BASE}/projects/tasks/${testTaskId2}`, { method: 'DELETE' });
      await fetch(`${API_BASE}/projects/tasks/${testTaskId1}`, { method: 'DELETE' });
    });

    it('should delete test project', async () => {
      const response = await fetch(`${API_BASE}/projects/${testProjectId}`, {
        method: 'DELETE'
      });
      expect(response.status).toBe(200);
    });
  });
});
