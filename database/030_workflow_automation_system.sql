-- ============================================
-- Ocean ERP - Workflow Automation Schema
-- ============================================
-- This schema implements a comprehensive workflow automation system
-- including approval workflows, email automation, and business rules

-- ============================================
-- 1. WORKFLOW DEFINITIONS
-- ============================================

-- Main workflow definition table
CREATE TABLE IF NOT EXISTS workflow_definitions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    module VARCHAR(100) NOT NULL, -- 'purchase_orders', 'quotations', 'expenses', etc.
    document_type VARCHAR(100) NOT NULL, -- Type of document this workflow applies to
    trigger_event VARCHAR(100) NOT NULL, -- 'on_create', 'on_update', 'on_status_change'
    is_active BOOLEAN DEFAULT true,
    version INTEGER DEFAULT 1,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workflow steps/stages
CREATE TABLE IF NOT EXISTS workflow_steps (
    id SERIAL PRIMARY KEY,
    workflow_id INTEGER REFERENCES workflow_definitions(id) ON DELETE CASCADE,
    step_order INTEGER NOT NULL, -- Sequential order of the step
    step_name VARCHAR(255) NOT NULL,
    step_type VARCHAR(50) NOT NULL, -- 'approval', 'notification', 'action'
    approver_type VARCHAR(50), -- 'role', 'user', 'dynamic'
    approver_role_id UUID REFERENCES roles(id),
    approver_user_id UUID REFERENCES users(id),
    approver_expression TEXT, -- For dynamic approvers: "manager_of(document.created_by)"
    is_parallel BOOLEAN DEFAULT false, -- Multiple approvers at once
    require_all_approvals BOOLEAN DEFAULT true, -- For parallel approvals
    timeout_hours INTEGER, -- Auto-escalate after X hours
    escalation_user_id UUID REFERENCES users(id),
    conditions JSONB, -- Conditions to trigger this step: {"amount": {"gte": 1000000}}
    actions JSONB, -- Actions to perform: [{"type": "send_email", "template": "approval_request"}]
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Active workflow instances
CREATE TABLE IF NOT EXISTS workflow_instances (
    id SERIAL PRIMARY KEY,
    workflow_id INTEGER REFERENCES workflow_definitions(id),
    document_type VARCHAR(100) NOT NULL,
    document_id INTEGER NOT NULL,
    current_step_id INTEGER REFERENCES workflow_steps(id),
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_progress', 'approved', 'rejected', 'cancelled'
    initiated_by UUID REFERENCES users(id),
    initiated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    completed_by UUID REFERENCES users(id),
    metadata JSONB, -- Store document snapshot or additional data
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workflow execution history
CREATE TABLE IF NOT EXISTS workflow_history (
    id SERIAL PRIMARY KEY,
    instance_id INTEGER REFERENCES workflow_instances(id) ON DELETE CASCADE,
    step_id INTEGER REFERENCES workflow_steps(id),
    action VARCHAR(50) NOT NULL, -- 'approved', 'rejected', 'delegated', 'escalated'
    performed_by UUID REFERENCES users(id),
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    comments TEXT,
    metadata JSONB, -- Additional data like delegation details
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pending approvals view
CREATE TABLE IF NOT EXISTS workflow_approvals (
    id SERIAL PRIMARY KEY,
    instance_id INTEGER REFERENCES workflow_instances(id) ON DELETE CASCADE,
    step_id INTEGER REFERENCES workflow_steps(id),
    approver_id UUID REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'delegated'
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_at TIMESTAMP, -- Based on timeout_hours
    completed_at TIMESTAMP,
    is_escalated BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. EMAIL AUTOMATION
-- ============================================

-- Email templates
CREATE TABLE IF NOT EXISTS email_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    subject VARCHAR(500) NOT NULL,
    body_html TEXT NOT NULL,
    body_text TEXT, -- Plain text version
    category VARCHAR(100), -- 'approval', 'notification', 'marketing', 'transaction'
    variables JSONB, -- Available variables: ["customer_name", "order_number", ...]
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email queue for sending
CREATE TABLE IF NOT EXISTS email_queue (
    id SERIAL PRIMARY KEY,
    to_email VARCHAR(255) NOT NULL,
    to_name VARCHAR(255),
    cc_emails TEXT[], -- Array of CC recipients
    bcc_emails TEXT[], -- Array of BCC recipients
    subject VARCHAR(500) NOT NULL,
    body_html TEXT NOT NULL,
    body_text TEXT,
    template_id INTEGER REFERENCES email_templates(id),
    template_data JSONB, -- Data to populate template
    priority INTEGER DEFAULT 5, -- 1-10, higher = more urgent
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'sending', 'sent', 'failed'
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    error_message TEXT,
    scheduled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email log for tracking
CREATE TABLE IF NOT EXISTS email_logs (
    id SERIAL PRIMARY KEY,
    queue_id INTEGER REFERENCES email_queue(id),
    to_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500),
    status VARCHAR(50), -- 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'complained'
    event_data JSONB, -- Additional data from email service provider
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scheduled email reports
CREATE TABLE IF NOT EXISTS scheduled_reports (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    report_type VARCHAR(100) NOT NULL, -- 'daily_sales', 'weekly_inventory', 'monthly_financial'
    schedule_pattern VARCHAR(100) NOT NULL, -- Cron expression: '0 9 * * *'
    recipients TEXT[] NOT NULL, -- Array of email addresses
    format VARCHAR(50) DEFAULT 'pdf', -- 'pdf', 'excel', 'csv'
    parameters JSONB, -- Report parameters: {"date_range": "last_7_days", "filters": {...}}
    last_sent_at TIMESTAMP,
    next_run_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. BUSINESS RULES ENGINE
-- ============================================

-- Business rule definitions
CREATE TABLE IF NOT EXISTS business_rules (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100), -- 'validation', 'calculation', 'automation', 'alert'
    trigger_event VARCHAR(100) NOT NULL, -- 'before_save', 'after_save', 'on_schedule'
    entity_type VARCHAR(100) NOT NULL, -- 'sales_order', 'inventory', 'invoice'
    conditions JSONB NOT NULL, -- Rule conditions in JSON format
    actions JSONB NOT NULL, -- Actions to execute
    priority INTEGER DEFAULT 100, -- Lower number = higher priority
    is_active BOOLEAN DEFAULT true,
    execution_count INTEGER DEFAULT 0,
    last_executed_at TIMESTAMP,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/*
Example business rule JSON structure:
{
  "name": "Low Stock Auto-Reorder",
  "conditions": {
    "and": [
      {"field": "stock_quantity", "operator": "lt", "value": {"field": "reorder_point"}},
      {"field": "auto_reorder_enabled", "operator": "eq", "value": true}
    ]
  },
  "actions": [
    {
      "type": "create_document",
      "document_type": "purchase_requisition",
      "data": {
        "product_id": "{product_id}",
        "quantity": "{reorder_quantity}",
        "priority": "high",
        "notes": "Auto-generated due to low stock"
      }
    },
    {
      "type": "send_notification",
      "recipients": ["procurement_team"],
      "template": "low_stock_alert",
      "data": {
        "product_name": "{product_name}",
        "current_stock": "{stock_quantity}",
        "reorder_point": "{reorder_point}"
      }
    }
  ]
}
*/

-- Rule execution logs
CREATE TABLE IF NOT EXISTS business_rule_logs (
    id SERIAL PRIMARY KEY,
    rule_id INTEGER REFERENCES business_rules(id) ON DELETE CASCADE,
    entity_type VARCHAR(100),
    entity_id INTEGER,
    conditions_met BOOLEAN,
    actions_executed JSONB, -- Which actions were executed
    execution_time_ms INTEGER, -- Execution duration
    status VARCHAR(50), -- 'success', 'failed', 'partial'
    error_message TEXT,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 4. NOTIFICATION SYSTEM
-- ============================================

-- In-app notifications
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50), -- 'info', 'warning', 'success', 'error', 'approval'
    category VARCHAR(100), -- 'workflow', 'alert', 'message', 'system'
    link VARCHAR(500), -- URL to related item
    icon VARCHAR(50), -- Icon name
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    metadata JSONB, -- Additional data
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP -- Auto-delete after this date
);

-- User notification preferences
CREATE TABLE IF NOT EXISTS notification_preferences (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    notification_type VARCHAR(100), -- 'workflow_approval', 'low_stock', 'invoice_due'
    channel VARCHAR(50), -- 'in_app', 'email', 'sms', 'push'
    is_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, notification_type, channel)
);

-- ============================================
-- 5. APPROVAL DELEGATION
-- ============================================

-- Temporary approval delegation
CREATE TABLE IF NOT EXISTS approval_delegations (
    id SERIAL PRIMARY KEY,
    delegator_id UUID REFERENCES users(id), -- Person delegating
    delegate_id UUID REFERENCES users(id), -- Person receiving delegation
    workflow_id INTEGER REFERENCES workflow_definitions(id), -- Specific workflow or NULL for all
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 6. AUDIT TRAIL
-- ============================================

-- Comprehensive audit log for all automation actions
CREATE TABLE IF NOT EXISTS automation_audit_log (
    id SERIAL PRIMARY KEY,
    action_type VARCHAR(100) NOT NULL, -- 'workflow_started', 'rule_executed', 'email_sent'
    entity_type VARCHAR(100),
    entity_id INTEGER,
    performed_by UUID REFERENCES users(id),
    action_data JSONB, -- Details of the action
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_workflow_instances_status ON workflow_instances(status);
CREATE INDEX IF NOT EXISTS idx_workflow_instances_document ON workflow_instances(document_type, document_id);
CREATE INDEX IF NOT EXISTS idx_workflow_approvals_approver ON workflow_approvals(approver_id, status);
CREATE INDEX IF NOT EXISTS idx_workflow_approvals_due ON workflow_approvals(due_at) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_email_queue_status ON email_queue(status, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_business_rules_entity ON business_rules(entity_type, is_active);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at);

-- ============================================
-- SEED DATA - DEFAULT TEMPLATES
-- ============================================

-- Default email templates
INSERT INTO email_templates (name, subject, body_html, body_text, category, variables) VALUES
('approval_request', 
 'Approval Required: {{document_type}} #{{document_number}}',
 '<h2>Approval Request</h2>
  <p>Dear {{approver_name}},</p>
  <p>A {{document_type}} requires your approval:</p>
  <ul>
    <li><strong>Document Number:</strong> {{document_number}}</li>
    <li><strong>Created By:</strong> {{created_by_name}}</li>
    <li><strong>Amount:</strong> {{amount}}</li>
    <li><strong>Date:</strong> {{created_date}}</li>
  </ul>
  <p><a href="{{approval_link}}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Review & Approve</a></p>',
 'Approval Request: {{document_type}} #{{document_number}}. Please review at {{approval_link}}',
 'approval',
 '["approver_name", "document_type", "document_number", "created_by_name", "amount", "created_date", "approval_link"]'::jsonb
),
('approval_approved',
 '{{document_type}} #{{document_number}} Approved',
 '<h2>Document Approved</h2>
  <p>Dear {{requester_name}},</p>
  <p>Your {{document_type}} #{{document_number}} has been approved by {{approver_name}}.</p>
  <p><strong>Comments:</strong> {{comments}}</p>',
 '{{document_type}} #{{document_number}} approved by {{approver_name}}.',
 'notification',
 '["requester_name", "document_type", "document_number", "approver_name", "comments"]'::jsonb
),
('low_stock_alert',
 'Low Stock Alert: {{product_name}}',
 '<h2>Low Stock Alert</h2>
  <p>Product {{product_name}} is running low on stock:</p>
  <ul>
    <li><strong>Current Stock:</strong> {{current_stock}}</li>
    <li><strong>Reorder Point:</strong> {{reorder_point}}</li>
    <li><strong>Recommended Order:</strong> {{recommended_quantity}}</li>
  </ul>',
 'Low Stock: {{product_name}}. Current: {{current_stock}}, Reorder at: {{reorder_point}}',
 'alert',
 '["product_name", "current_stock", "reorder_point", "recommended_quantity"]'::jsonb
),
('invoice_overdue',
 'Payment Overdue: Invoice #{{invoice_number}}',
 '<h2>Payment Reminder</h2>
  <p>Dear {{customer_name}},</p>
  <p>This is a friendly reminder that Invoice #{{invoice_number}} is now overdue.</p>
  <ul>
    <li><strong>Invoice Date:</strong> {{invoice_date}}</li>
    <li><strong>Due Date:</strong> {{due_date}}</li>
    <li><strong>Amount:</strong> {{amount}}</li>
    <li><strong>Days Overdue:</strong> {{days_overdue}}</li>
  </ul>
  <p>Please arrange payment at your earliest convenience.</p>',
 'Invoice #{{invoice_number}} is overdue. Amount: {{amount}}, Days overdue: {{days_overdue}}',
 'transaction',
 '["customer_name", "invoice_number", "invoice_date", "due_date", "amount", "days_overdue"]'::jsonb
);

-- Default notification preferences for new users
-- (These will be created via trigger when a user is created)

COMMENT ON TABLE workflow_definitions IS 'Defines reusable workflow templates';
COMMENT ON TABLE workflow_steps IS 'Individual steps in a workflow';
COMMENT ON TABLE workflow_instances IS 'Active workflow executions';
COMMENT ON TABLE workflow_history IS 'Audit trail of workflow actions';
COMMENT ON TABLE business_rules IS 'Automated business rules and logic';
COMMENT ON TABLE email_templates IS 'Reusable email templates with variables';
COMMENT ON TABLE notifications IS 'In-app notification messages';
