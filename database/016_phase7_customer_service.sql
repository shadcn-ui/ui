-- Phase 7 Task 3: Customer Service & Support
-- Date: December 4, 2025
-- Purpose: Complete customer support system with ticketing, SLA, knowledge base, and surveys

-- Drop existing tables if they exist (for clean reinstall)
DROP TABLE IF EXISTS crm_survey_responses CASCADE;
DROP TABLE IF EXISTS crm_survey_questions CASCADE;
DROP TABLE IF EXISTS crm_surveys CASCADE;
DROP TABLE IF EXISTS crm_kb_article_feedback CASCADE;
DROP TABLE IF EXISTS crm_kb_article_attachments CASCADE;
DROP TABLE IF EXISTS crm_kb_articles CASCADE;
DROP TABLE IF EXISTS crm_kb_categories CASCADE;
DROP TABLE IF EXISTS crm_case_escalations CASCADE;
DROP TABLE IF EXISTS crm_case_comments CASCADE;
DROP TABLE IF EXISTS crm_case_attachments CASCADE;
DROP TABLE IF EXISTS crm_sla_violations CASCADE;
DROP TABLE IF EXISTS crm_cases CASCADE;
DROP TABLE IF EXISTS crm_sla_policies CASCADE;
DROP TABLE IF EXISTS crm_case_priorities CASCADE;
DROP TABLE IF EXISTS crm_case_types CASCADE;

-- ============================================================================
-- 1. CASE TYPES (Bug, Question, Feature Request, etc.)
-- ============================================================================
CREATE TABLE crm_case_types (
    case_type_id SERIAL PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL,
    type_code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(20),
    default_priority VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 2. CASE PRIORITIES (Low, Medium, High, Critical)
-- ============================================================================
CREATE TABLE crm_case_priorities (
    priority_id SERIAL PRIMARY KEY,
    priority_name VARCHAR(50) NOT NULL,
    priority_code VARCHAR(50) UNIQUE NOT NULL,
    priority_level INTEGER NOT NULL, -- 1=Low, 2=Medium, 3=High, 4=Critical
    response_time_hours INTEGER, -- Target first response time
    resolution_time_hours INTEGER, -- Target resolution time
    color VARCHAR(20),
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 3. SLA POLICIES (Service Level Agreement rules)
-- ============================================================================
CREATE TABLE crm_sla_policies (
    sla_policy_id SERIAL PRIMARY KEY,
    policy_name VARCHAR(255) NOT NULL,
    policy_code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    
    -- Time-based SLA
    first_response_hours INTEGER NOT NULL, -- Hours to first response
    resolution_hours INTEGER NOT NULL, -- Hours to resolution
    
    -- Business hours
    business_hours_only BOOLEAN DEFAULT false,
    business_hours_start TIME DEFAULT '09:00:00',
    business_hours_end TIME DEFAULT '17:00:00',
    
    -- Applicability
    applies_to_case_type_id INTEGER REFERENCES crm_case_types(case_type_id),
    applies_to_priority_id INTEGER REFERENCES crm_case_priorities(priority_id),
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sla_policies_active ON crm_sla_policies(is_active);

-- ============================================================================
-- 4. CASES (Support tickets/cases)
-- ============================================================================
CREATE TABLE crm_cases (
    case_id SERIAL PRIMARY KEY,
    case_number VARCHAR(50) UNIQUE NOT NULL,
    
    -- Customer information
    account_id INTEGER NOT NULL REFERENCES crm_accounts(account_id),
    contact_id INTEGER REFERENCES crm_contacts(contact_id),
    
    -- Case details
    subject VARCHAR(500) NOT NULL,
    description TEXT,
    case_type_id INTEGER NOT NULL REFERENCES crm_case_types(case_type_id),
    priority_id INTEGER NOT NULL REFERENCES crm_case_priorities(priority_id),
    
    -- Status
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'open', 'pending', 'in_progress', 'waiting_customer', 'resolved', 'closed', 'cancelled')),
    status_reason TEXT,
    
    -- Assignment
    owner_id INTEGER, -- Support agent assigned
    team_id INTEGER,
    
    -- Channel
    channel VARCHAR(50) CHECK (channel IN ('email', 'phone', 'chat', 'web', 'social', 'portal')),
    
    -- SLA tracking
    sla_policy_id INTEGER REFERENCES crm_sla_policies(sla_policy_id),
    first_response_at TIMESTAMP,
    first_response_due TIMESTAMP,
    resolution_due TIMESTAMP,
    resolved_at TIMESTAMP,
    closed_at TIMESTAMP,
    
    -- Metrics
    response_time_minutes INTEGER,
    resolution_time_minutes INTEGER,
    reopened_count INTEGER DEFAULT 0,
    
    -- Related records
    parent_case_id INTEGER REFERENCES crm_cases(case_id),
    opportunity_id INTEGER REFERENCES crm_opportunities(opportunity_id),
    
    -- Customer satisfaction
    csat_score INTEGER CHECK (csat_score >= 1 AND csat_score <= 5),
    csat_comment TEXT,
    csat_submitted_at TIMESTAMP,
    
    -- Metadata
    is_escalated BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER
);

CREATE INDEX idx_cases_account ON crm_cases(account_id);
CREATE INDEX idx_cases_contact ON crm_cases(contact_id);
CREATE INDEX idx_cases_type ON crm_cases(case_type_id);
CREATE INDEX idx_cases_priority ON crm_cases(priority_id);
CREATE INDEX idx_cases_status ON crm_cases(status);
CREATE INDEX idx_cases_owner ON crm_cases(owner_id);
CREATE INDEX idx_cases_sla_policy ON crm_cases(sla_policy_id);
CREATE INDEX idx_cases_created ON crm_cases(created_at);
CREATE INDEX idx_cases_escalated ON crm_cases(is_escalated);

-- ============================================================================
-- 5. SLA VIOLATIONS (Track SLA breaches)
-- ============================================================================
CREATE TABLE crm_sla_violations (
    violation_id SERIAL PRIMARY KEY,
    case_id INTEGER NOT NULL REFERENCES crm_cases(case_id) ON DELETE CASCADE,
    sla_policy_id INTEGER NOT NULL REFERENCES crm_sla_policies(sla_policy_id),
    
    violation_type VARCHAR(50) NOT NULL CHECK (violation_type IN ('first_response', 'resolution')),
    
    -- Time tracking
    due_at TIMESTAMP NOT NULL,
    violated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    minutes_overdue INTEGER,
    
    -- Status
    is_acknowledged BOOLEAN DEFAULT false,
    acknowledged_by INTEGER,
    acknowledged_at TIMESTAMP,
    
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sla_violations_case ON crm_sla_violations(case_id);
CREATE INDEX idx_sla_violations_type ON crm_sla_violations(violation_type);

-- ============================================================================
-- 6. CASE ATTACHMENTS (Files attached to cases)
-- ============================================================================
CREATE TABLE crm_case_attachments (
    attachment_id SERIAL PRIMARY KEY,
    case_id INTEGER NOT NULL REFERENCES crm_cases(case_id) ON DELETE CASCADE,
    
    -- File details
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER, -- bytes
    file_type VARCHAR(100),
    mime_type VARCHAR(100),
    
    -- Metadata
    uploaded_by INTEGER,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_case_attachments_case ON crm_case_attachments(case_id);

-- ============================================================================
-- 7. CASE COMMENTS (Internal and external comments)
-- ============================================================================
CREATE TABLE crm_case_comments (
    comment_id SERIAL PRIMARY KEY,
    case_id INTEGER NOT NULL REFERENCES crm_cases(case_id) ON DELETE CASCADE,
    
    -- Comment details
    comment_text TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT false, -- Internal note vs customer-visible
    is_solution BOOLEAN DEFAULT false, -- Mark as solution
    
    -- Author
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_case_comments_case ON crm_case_comments(case_id);
CREATE INDEX idx_case_comments_created ON crm_case_comments(created_at);

-- ============================================================================
-- 8. CASE ESCALATIONS (Escalation tracking)
-- ============================================================================
CREATE TABLE crm_case_escalations (
    escalation_id SERIAL PRIMARY KEY,
    case_id INTEGER NOT NULL REFERENCES crm_cases(case_id) ON DELETE CASCADE,
    
    -- Escalation details
    escalation_reason VARCHAR(100) NOT NULL CHECK (escalation_reason IN ('sla_violation', 'customer_request', 'priority_increase', 'technical', 'management_review')),
    escalation_level INTEGER DEFAULT 1, -- 1, 2, 3 (levels of escalation)
    
    -- Assignment
    escalated_from INTEGER, -- Previous owner
    escalated_to INTEGER, -- New owner/manager
    
    -- Tracking
    escalated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    
    notes TEXT,
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_case_escalations_case ON crm_case_escalations(case_id);

-- ============================================================================
-- 9. KNOWLEDGE BASE CATEGORIES
-- ============================================================================
CREATE TABLE crm_kb_categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL,
    category_code VARCHAR(50) UNIQUE NOT NULL,
    parent_category_id INTEGER REFERENCES crm_kb_categories(category_id),
    description TEXT,
    icon VARCHAR(50),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_kb_categories_parent ON crm_kb_categories(parent_category_id);

-- ============================================================================
-- 10. KNOWLEDGE BASE ARTICLES
-- ============================================================================
CREATE TABLE crm_kb_articles (
    article_id SERIAL PRIMARY KEY,
    article_number VARCHAR(50) UNIQUE NOT NULL,
    
    -- Article content
    title VARCHAR(500) NOT NULL,
    summary TEXT,
    content TEXT NOT NULL,
    
    -- Categorization
    category_id INTEGER NOT NULL REFERENCES crm_kb_categories(category_id),
    tags TEXT[], -- Array of tags
    keywords TEXT[], -- Array of search keywords
    
    -- Status
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'archived')),
    
    -- Versioning
    version INTEGER DEFAULT 1,
    
    -- Authoring
    author_id INTEGER,
    reviewed_by INTEGER,
    published_at TIMESTAMP,
    
    -- Usage metrics
    view_count INTEGER DEFAULT 0,
    helpful_count INTEGER DEFAULT 0,
    not_helpful_count INTEGER DEFAULT 0,
    
    -- Related
    related_article_ids INTEGER[], -- Array of related article IDs
    
    -- Metadata
    is_featured BOOLEAN DEFAULT false,
    is_internal BOOLEAN DEFAULT false, -- Internal use only
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_kb_articles_category ON crm_kb_articles(category_id);
CREATE INDEX idx_kb_articles_status ON crm_kb_articles(status);
CREATE INDEX idx_kb_articles_published ON crm_kb_articles(published_at);
CREATE INDEX idx_kb_articles_tags ON crm_kb_articles USING gin(tags);

-- ============================================================================
-- 11. KB ARTICLE ATTACHMENTS
-- ============================================================================
CREATE TABLE crm_kb_article_attachments (
    attachment_id SERIAL PRIMARY KEY,
    article_id INTEGER NOT NULL REFERENCES crm_kb_articles(article_id) ON DELETE CASCADE,
    
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    file_type VARCHAR(100),
    
    uploaded_by INTEGER,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_kb_attachments_article ON crm_kb_article_attachments(article_id);

-- ============================================================================
-- 12. KB ARTICLE FEEDBACK
-- ============================================================================
CREATE TABLE crm_kb_article_feedback (
    feedback_id SERIAL PRIMARY KEY,
    article_id INTEGER NOT NULL REFERENCES crm_kb_articles(article_id) ON DELETE CASCADE,
    
    is_helpful BOOLEAN NOT NULL,
    comment TEXT,
    
    submitted_by INTEGER,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_kb_feedback_article ON crm_kb_article_feedback(article_id);

-- ============================================================================
-- 13. SURVEYS (CSAT/NPS surveys)
-- ============================================================================
CREATE TABLE crm_surveys (
    survey_id SERIAL PRIMARY KEY,
    survey_name VARCHAR(255) NOT NULL,
    survey_type VARCHAR(50) NOT NULL CHECK (survey_type IN ('csat', 'nps', 'ces', 'custom')),
    description TEXT,
    
    -- Survey settings
    is_active BOOLEAN DEFAULT true,
    send_after_case_closed BOOLEAN DEFAULT true,
    send_delay_hours INTEGER DEFAULT 24, -- Hours after case closed
    
    -- Trigger conditions
    applies_to_case_type_id INTEGER REFERENCES crm_case_types(case_type_id),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 14. SURVEY QUESTIONS
-- ============================================================================
CREATE TABLE crm_survey_questions (
    question_id SERIAL PRIMARY KEY,
    survey_id INTEGER NOT NULL REFERENCES crm_surveys(survey_id) ON DELETE CASCADE,
    
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) CHECK (question_type IN ('rating', 'text', 'multiple_choice', 'yes_no')),
    question_order INTEGER NOT NULL,
    
    -- For rating questions
    rating_min INTEGER DEFAULT 1,
    rating_max INTEGER DEFAULT 5,
    
    -- For multiple choice
    choices TEXT[], -- Array of choices
    
    is_required BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_survey_questions_survey ON crm_survey_questions(survey_id);

-- ============================================================================
-- 15. SURVEY RESPONSES
-- ============================================================================
CREATE TABLE crm_survey_responses (
    response_id SERIAL PRIMARY KEY,
    survey_id INTEGER NOT NULL REFERENCES crm_surveys(survey_id),
    question_id INTEGER NOT NULL REFERENCES crm_survey_questions(question_id),
    case_id INTEGER REFERENCES crm_cases(case_id),
    
    -- Response data
    rating_value INTEGER,
    text_value TEXT,
    choice_value VARCHAR(255),
    
    -- Respondent
    contact_id INTEGER REFERENCES crm_contacts(contact_id),
    
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_survey_responses_survey ON crm_survey_responses(survey_id);
CREATE INDEX idx_survey_responses_case ON crm_survey_responses(case_id);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sla_policies_updated
    BEFORE UPDATE ON crm_sla_policies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_cases_updated
    BEFORE UPDATE ON crm_cases
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_case_comments_updated
    BEFORE UPDATE ON crm_case_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_kb_articles_updated
    BEFORE UPDATE ON crm_kb_articles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_surveys_updated
    BEFORE UPDATE ON crm_surveys
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Calculate SLA due dates when case is created/updated
CREATE OR REPLACE FUNCTION calculate_sla_due_dates()
RETURNS TRIGGER AS $$
DECLARE
    v_sla_policy RECORD;
BEGIN
    -- Get SLA policy details
    IF NEW.sla_policy_id IS NOT NULL THEN
        SELECT * INTO v_sla_policy 
        FROM crm_sla_policies 
        WHERE sla_policy_id = NEW.sla_policy_id;
        
        -- Calculate first response due
        IF NEW.first_response_due IS NULL THEN
            NEW.first_response_due := NEW.created_at + (v_sla_policy.first_response_hours || ' hours')::INTERVAL;
        END IF;
        
        -- Calculate resolution due
        IF NEW.resolution_due IS NULL THEN
            NEW.resolution_due := NEW.created_at + (v_sla_policy.resolution_hours || ' hours')::INTERVAL;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_case_sla_dates
    BEFORE INSERT ON crm_cases
    FOR EACH ROW
    EXECUTE FUNCTION calculate_sla_due_dates();

-- Check for SLA violations
CREATE OR REPLACE FUNCTION check_sla_violations()
RETURNS TRIGGER AS $$
BEGIN
    -- Check first response SLA
    IF OLD.first_response_at IS NULL AND NEW.first_response_at IS NOT NULL THEN
        IF NEW.first_response_at > NEW.first_response_due THEN
            INSERT INTO crm_sla_violations (
                case_id, sla_policy_id, violation_type, due_at, violated_at, minutes_overdue
            ) VALUES (
                NEW.case_id,
                NEW.sla_policy_id,
                'first_response',
                NEW.first_response_due,
                NEW.first_response_at,
                EXTRACT(EPOCH FROM (NEW.first_response_at - NEW.first_response_due))/60
            );
        END IF;
    END IF;
    
    -- Check resolution SLA
    IF OLD.resolved_at IS NULL AND NEW.resolved_at IS NOT NULL THEN
        IF NEW.resolved_at > NEW.resolution_due THEN
            INSERT INTO crm_sla_violations (
                case_id, sla_policy_id, violation_type, due_at, violated_at, minutes_overdue
            ) VALUES (
                NEW.case_id,
                NEW.sla_policy_id,
                'resolution',
                NEW.resolution_due,
                NEW.resolved_at,
                EXTRACT(EPOCH FROM (NEW.resolved_at - NEW.resolution_due))/60
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_case_sla_violations
    AFTER UPDATE ON crm_cases
    FOR EACH ROW
    EXECUTE FUNCTION check_sla_violations();

-- Increment KB article view count
CREATE OR REPLACE FUNCTION increment_article_views()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE crm_kb_articles 
    SET view_count = view_count + 1 
    WHERE article_id = NEW.article_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- VIEWS
-- ============================================================================

-- Case summary view
CREATE OR REPLACE VIEW v_case_summary AS
SELECT 
    c.case_id,
    c.case_number,
    c.subject,
    c.status,
    a.account_name,
    con.full_name as contact_name,
    ct.type_name as case_type,
    cp.priority_name,
    cp.priority_level,
    c.created_at,
    c.first_response_due,
    c.resolution_due,
    CASE 
        WHEN c.status IN ('resolved', 'closed') THEN false
        WHEN c.first_response_at IS NULL AND CURRENT_TIMESTAMP > c.first_response_due THEN true
        WHEN c.resolved_at IS NULL AND CURRENT_TIMESTAMP > c.resolution_due THEN true
        ELSE false
    END as is_sla_violated,
    (SELECT COUNT(*) FROM crm_case_comments WHERE case_id = c.case_id) as comment_count,
    (SELECT COUNT(*) FROM crm_case_escalations WHERE case_id = c.case_id AND is_active = true) as escalation_count
FROM crm_cases c
JOIN crm_accounts a ON c.account_id = a.account_id
LEFT JOIN crm_contacts con ON c.contact_id = con.contact_id
JOIN crm_case_types ct ON c.case_type_id = ct.case_type_id
JOIN crm_case_priorities cp ON c.priority_id = cp.priority_id
WHERE c.is_active = true;

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert case types
INSERT INTO crm_case_types (type_name, type_code, icon, color, default_priority) VALUES
('Bug/Issue', 'bug', 'bug', '#red', 'high'),
('Question', 'question', 'help-circle', '#blue', 'medium'),
('Feature Request', 'feature', 'lightbulb', '#green', 'low'),
('Technical Support', 'tech_support', 'tool', '#purple', 'high'),
('Account/Billing', 'billing', 'dollar-sign', '#yellow', 'medium'),
('Training', 'training', 'book', '#cyan', 'low');

-- Insert priorities
INSERT INTO crm_case_priorities (priority_name, priority_code, priority_level, response_time_hours, resolution_time_hours, color, icon) VALUES
('Low', 'low', 1, 48, 168, '#gray', 'arrow-down'),
('Medium', 'medium', 2, 24, 72, '#blue', 'minus'),
('High', 'high', 3, 4, 24, '#orange', 'arrow-up'),
('Critical', 'critical', 4, 1, 8, '#red', 'alert-circle');

-- Insert SLA policies
INSERT INTO crm_sla_policies (policy_name, policy_code, first_response_hours, resolution_hours, business_hours_only) VALUES
('Standard SLA', 'standard', 24, 72, false),
('Premium SLA', 'premium', 4, 24, false),
('Enterprise SLA', 'enterprise', 1, 8, false),
('Business Hours SLA', 'business_hours', 8, 40, true);

-- Insert KB categories
INSERT INTO crm_kb_categories (category_name, category_code, icon, sort_order) VALUES
('Getting Started', 'getting_started', 'flag', 1),
('FAQs', 'faqs', 'help-circle', 2),
('Troubleshooting', 'troubleshooting', 'tool', 3),
('Best Practices', 'best_practices', 'star', 4),
('Technical Documentation', 'tech_docs', 'file-text', 5);

-- Insert sample KB articles
INSERT INTO crm_kb_articles (
    article_number, title, summary, content, category_id, status, 
    tags, keywords, published_at, is_featured
) VALUES
('KB-000001', 'How to Get Started', 'Quick start guide for new users', 
 'This article provides step-by-step instructions for getting started with our platform...', 
 1, 'published', ARRAY['getting-started', 'basics'], ARRAY['start', 'begin', 'new'], 
 CURRENT_TIMESTAMP, true),
('KB-000002', 'Common Issues and Solutions', 'Frequently encountered problems and fixes', 
 'This article lists the most common issues users face and their solutions...', 
 3, 'published', ARRAY['troubleshooting', 'issues'], ARRAY['problem', 'error', 'fix'], 
 CURRENT_TIMESTAMP, false),
('KB-000003', 'Best Practices Guide', 'Tips and tricks for optimal usage', 
 'Follow these best practices to get the most out of our platform...', 
 4, 'published', ARRAY['tips', 'optimization'], ARRAY['best', 'practice', 'optimize'], 
 CURRENT_TIMESTAMP, true);

-- Insert sample survey
INSERT INTO crm_surveys (survey_name, survey_type, send_after_case_closed) VALUES
('Case Closure CSAT', 'csat', true);

-- Insert survey questions
INSERT INTO crm_survey_questions (survey_id, question_text, question_type, question_order, rating_min, rating_max) VALUES
(1, 'How satisfied were you with the resolution of your case?', 'rating', 1, 1, 5),
(1, 'Was your issue resolved in a timely manner?', 'yes_no', 2, NULL, NULL),
(1, 'Additional comments or feedback:', 'text', 3, NULL, NULL);

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Phase 7 Task 3: Customer Service Schema Installation Complete!';
    RAISE NOTICE '📊 Tables created: 15';
    RAISE NOTICE '🎫 Case types: 6';
    RAISE NOTICE '📋 Priorities: 4';
    RAISE NOTICE '📖 KB articles: 3';
    RAISE NOTICE '';
    RAISE NOTICE 'Next: Create API endpoints for case management';
END $$;
