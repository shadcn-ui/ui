-- Phase 7 Task 4: Marketing Automation
-- Date: December 4, 2025
-- Purpose: Complete marketing automation system with campaigns, lead scoring, email marketing, and analytics

-- Drop existing tables if they exist (for clean reinstall)
DROP TABLE IF EXISTS crm_campaign_analytics CASCADE;
DROP TABLE IF EXISTS crm_email_clicks CASCADE;
DROP TABLE IF EXISTS crm_email_opens CASCADE;
DROP TABLE IF EXISTS crm_email_sends CASCADE;
DROP TABLE IF EXISTS crm_email_templates CASCADE;
DROP TABLE IF EXISTS crm_campaign_members CASCADE;
DROP TABLE IF EXISTS crm_campaigns CASCADE;
DROP TABLE IF EXISTS crm_campaign_types CASCADE;
DROP TABLE IF EXISTS crm_lead_nurture_steps CASCADE;
DROP TABLE IF EXISTS crm_lead_nurture_workflows CASCADE;
DROP TABLE IF EXISTS crm_lead_score_history CASCADE;
DROP TABLE IF EXISTS crm_lead_scoring_rules CASCADE;

-- ============================================================================
-- 1. CAMPAIGN TYPES
-- ============================================================================
CREATE TABLE crm_campaign_types (
    campaign_type_id SERIAL PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL,
    type_code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 2. CAMPAIGNS
-- ============================================================================
CREATE TABLE crm_campaigns (
    campaign_id SERIAL PRIMARY KEY,
    campaign_number VARCHAR(50) UNIQUE NOT NULL,
    campaign_name VARCHAR(255) NOT NULL,
    campaign_type_id INTEGER NOT NULL REFERENCES crm_campaign_types(campaign_type_id),
    
    -- Description and goals
    description TEXT,
    objectives TEXT,
    target_audience TEXT,
    
    -- Status and timing
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'active', 'paused', 'completed', 'cancelled')),
    start_date DATE,
    end_date DATE,
    
    -- Budget and costs
    budget_amount DECIMAL(15, 2),
    actual_cost DECIMAL(15, 2) DEFAULT 0,
    
    -- Targets and goals
    target_leads INTEGER,
    target_revenue DECIMAL(15, 2),
    
    -- Metrics (updated by triggers/analytics)
    total_members INTEGER DEFAULT 0,
    total_sent INTEGER DEFAULT 0,
    total_delivered INTEGER DEFAULT 0,
    total_opened INTEGER DEFAULT 0,
    total_clicked INTEGER DEFAULT 0,
    total_bounced INTEGER DEFAULT 0,
    total_unsubscribed INTEGER DEFAULT 0,
    
    -- Conversion metrics
    leads_generated INTEGER DEFAULT 0,
    opportunities_generated INTEGER DEFAULT 0,
    revenue_generated DECIMAL(15, 2) DEFAULT 0,
    
    -- Ownership
    owner_id INTEGER,
    team_id INTEGER,
    
    -- Metadata
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER
);

CREATE INDEX idx_campaigns_type ON crm_campaigns(campaign_type_id);
CREATE INDEX idx_campaigns_status ON crm_campaigns(status);
CREATE INDEX idx_campaigns_dates ON crm_campaigns(start_date, end_date);
CREATE INDEX idx_campaigns_owner ON crm_campaigns(owner_id);

-- ============================================================================
-- 3. CAMPAIGN MEMBERS (Contacts/Leads in campaign)
-- ============================================================================
CREATE TABLE crm_campaign_members (
    member_id SERIAL PRIMARY KEY,
    campaign_id INTEGER NOT NULL REFERENCES crm_campaigns(campaign_id) ON DELETE CASCADE,
    
    -- Member info
    contact_id INTEGER REFERENCES crm_contacts(contact_id),
    account_id INTEGER REFERENCES crm_accounts(account_id),
    
    -- Member status
    member_status VARCHAR(50) DEFAULT 'added' CHECK (member_status IN ('added', 'sent', 'opened', 'clicked', 'responded', 'converted', 'bounced', 'unsubscribed', 'opted_out')),
    
    -- Response tracking
    first_responded_at TIMESTAMP,
    converted_at TIMESTAMP,
    conversion_type VARCHAR(50), -- lead, opportunity, purchase
    
    -- Engagement metrics
    email_sent_count INTEGER DEFAULT 0,
    email_opened_count INTEGER DEFAULT 0,
    email_clicked_count INTEGER DEFAULT 0,
    
    -- ROI tracking
    revenue_attributed DECIMAL(15, 2),
    opportunity_id INTEGER REFERENCES crm_opportunities(opportunity_id),
    
    -- Metadata
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_campaign_members_campaign ON crm_campaign_members(campaign_id);
CREATE INDEX idx_campaign_members_contact ON crm_campaign_members(contact_id);
CREATE INDEX idx_campaign_members_status ON crm_campaign_members(member_status);

-- ============================================================================
-- 4. EMAIL TEMPLATES
-- ============================================================================
CREATE TABLE crm_email_templates (
    template_id SERIAL PRIMARY KEY,
    template_name VARCHAR(255) NOT NULL,
    template_code VARCHAR(50) UNIQUE NOT NULL,
    
    -- Email content
    subject_line VARCHAR(500) NOT NULL,
    from_name VARCHAR(255),
    from_email VARCHAR(255),
    reply_to_email VARCHAR(255),
    
    -- Template content (HTML + Plain text)
    html_content TEXT,
    plain_text_content TEXT,
    
    -- Template variables/merge fields
    merge_fields TEXT[], -- Array of available merge fields: {first_name}, {company}, etc.
    
    -- Categorization
    category VARCHAR(100), -- newsletter, promotional, transactional, nurture
    campaign_type_id INTEGER REFERENCES crm_campaign_types(campaign_type_id),
    
    -- A/B Testing
    is_variant BOOLEAN DEFAULT false,
    parent_template_id INTEGER REFERENCES crm_email_templates(template_id),
    variant_name VARCHAR(50), -- A, B, C
    
    -- Metrics
    sent_count INTEGER DEFAULT 0,
    open_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER
);

CREATE INDEX idx_email_templates_category ON crm_email_templates(category);
CREATE INDEX idx_email_templates_campaign_type ON crm_email_templates(campaign_type_id);

-- ============================================================================
-- 5. EMAIL SENDS (Individual email send records)
-- ============================================================================
CREATE TABLE crm_email_sends (
    send_id SERIAL PRIMARY KEY,
    campaign_id INTEGER REFERENCES crm_campaigns(campaign_id) ON DELETE CASCADE,
    template_id INTEGER REFERENCES crm_email_templates(template_id),
    member_id INTEGER REFERENCES crm_campaign_members(member_id) ON DELETE CASCADE,
    
    -- Recipient
    contact_id INTEGER REFERENCES crm_contacts(contact_id),
    email_address VARCHAR(255) NOT NULL,
    
    -- Send details
    subject_line VARCHAR(500),
    from_name VARCHAR(255),
    from_email VARCHAR(255),
    
    -- Status
    send_status VARCHAR(50) DEFAULT 'pending' CHECK (send_status IN ('pending', 'sent', 'delivered', 'bounced', 'failed')),
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    bounced_at TIMESTAMP,
    bounce_reason TEXT,
    
    -- Engagement
    opened_at TIMESTAMP,
    clicked_at TIMESTAMP,
    unsubscribed_at TIMESTAMP,
    
    -- A/B Testing
    variant_name VARCHAR(50),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_email_sends_campaign ON crm_email_sends(campaign_id);
CREATE INDEX idx_email_sends_contact ON crm_email_sends(contact_id);
CREATE INDEX idx_email_sends_status ON crm_email_sends(send_status);
CREATE INDEX idx_email_sends_sent_at ON crm_email_sends(sent_at);

-- ============================================================================
-- 6. EMAIL OPENS (Track email opens)
-- ============================================================================
CREATE TABLE crm_email_opens (
    open_id SERIAL PRIMARY KEY,
    send_id INTEGER NOT NULL REFERENCES crm_email_sends(send_id) ON DELETE CASCADE,
    
    -- Open details
    opened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(50),
    user_agent TEXT,
    device_type VARCHAR(50), -- desktop, mobile, tablet
    
    -- Location (optional)
    country VARCHAR(100),
    city VARCHAR(100)
);

CREATE INDEX idx_email_opens_send ON crm_email_opens(send_id);
CREATE INDEX idx_email_opens_opened_at ON crm_email_opens(opened_at);

-- ============================================================================
-- 7. EMAIL CLICKS (Track link clicks)
-- ============================================================================
CREATE TABLE crm_email_clicks (
    click_id SERIAL PRIMARY KEY,
    send_id INTEGER NOT NULL REFERENCES crm_email_sends(send_id) ON DELETE CASCADE,
    
    -- Click details
    url VARCHAR(1000) NOT NULL,
    link_text VARCHAR(500),
    clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Device info
    ip_address VARCHAR(50),
    user_agent TEXT,
    device_type VARCHAR(50),
    
    -- Location (optional)
    country VARCHAR(100),
    city VARCHAR(100)
);

CREATE INDEX idx_email_clicks_send ON crm_email_clicks(send_id);
CREATE INDEX idx_email_clicks_clicked_at ON crm_email_clicks(clicked_at);
CREATE INDEX idx_email_clicks_url ON crm_email_clicks(url);

-- ============================================================================
-- 8. LEAD SCORING RULES
-- ============================================================================
CREATE TABLE crm_lead_scoring_rules (
    rule_id SERIAL PRIMARY KEY,
    rule_name VARCHAR(255) NOT NULL,
    rule_code VARCHAR(50) UNIQUE NOT NULL,
    
    -- Rule definition
    category VARCHAR(100) NOT NULL, -- demographic, behavioral, engagement, firmographic
    trigger_type VARCHAR(100) NOT NULL, -- email_open, email_click, form_submit, page_visit, etc.
    
    -- Conditions (JSON or specific fields)
    condition_field VARCHAR(100), -- email_domain, job_title, company_size, etc.
    condition_operator VARCHAR(20), -- equals, contains, greater_than, etc.
    condition_value TEXT,
    
    -- Score change
    score_change INTEGER NOT NULL, -- Positive or negative points
    
    -- Decay settings
    has_decay BOOLEAN DEFAULT false,
    decay_after_days INTEGER,
    decay_to_score INTEGER,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0, -- Higher priority rules evaluated first
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lead_scoring_rules_category ON crm_lead_scoring_rules(category);
CREATE INDEX idx_lead_scoring_rules_active ON crm_lead_scoring_rules(is_active);

-- ============================================================================
-- 9. LEAD SCORE HISTORY (Track score changes)
-- ============================================================================
CREATE TABLE crm_lead_score_history (
    history_id SERIAL PRIMARY KEY,
    contact_id INTEGER NOT NULL REFERENCES crm_contacts(contact_id) ON DELETE CASCADE,
    
    -- Score change
    previous_score INTEGER,
    new_score INTEGER,
    score_change INTEGER,
    
    -- Reason
    rule_id INTEGER REFERENCES crm_lead_scoring_rules(rule_id),
    reason TEXT,
    
    -- Related activity
    campaign_id INTEGER REFERENCES crm_campaigns(campaign_id),
    email_send_id INTEGER REFERENCES crm_email_sends(send_id),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lead_score_history_contact ON crm_lead_score_history(contact_id);
CREATE INDEX idx_lead_score_history_created ON crm_lead_score_history(created_at);

-- ============================================================================
-- 10. LEAD NURTURE WORKFLOWS
-- ============================================================================
CREATE TABLE crm_lead_nurture_workflows (
    workflow_id SERIAL PRIMARY KEY,
    workflow_name VARCHAR(255) NOT NULL,
    workflow_code VARCHAR(50) UNIQUE NOT NULL,
    
    description TEXT,
    
    -- Trigger conditions
    trigger_type VARCHAR(100), -- lead_score_threshold, form_submit, campaign_member, manual
    trigger_score_min INTEGER, -- Minimum lead score to enter workflow
    trigger_score_max INTEGER, -- Maximum lead score (optional)
    
    -- Status
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'archived')),
    
    -- Metrics
    total_enrolled INTEGER DEFAULT 0,
    total_completed INTEGER DEFAULT 0,
    
    -- Metadata
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER
);

CREATE INDEX idx_nurture_workflows_status ON crm_lead_nurture_workflows(status);

-- ============================================================================
-- 11. LEAD NURTURE STEPS (Workflow steps)
-- ============================================================================
CREATE TABLE crm_lead_nurture_steps (
    step_id SERIAL PRIMARY KEY,
    workflow_id INTEGER NOT NULL REFERENCES crm_lead_nurture_workflows(workflow_id) ON DELETE CASCADE,
    
    -- Step details
    step_name VARCHAR(255) NOT NULL,
    step_order INTEGER NOT NULL,
    step_type VARCHAR(50) NOT NULL CHECK (step_type IN ('email', 'wait', 'task', 'score_change', 'condition')),
    
    -- Timing
    delay_days INTEGER DEFAULT 0,
    delay_hours INTEGER DEFAULT 0,
    
    -- Email step
    template_id INTEGER REFERENCES crm_email_templates(template_id),
    
    -- Task step
    task_subject VARCHAR(500),
    task_description TEXT,
    assign_to_owner BOOLEAN DEFAULT true,
    
    -- Score change step
    score_adjustment INTEGER,
    
    -- Condition step (branching)
    condition_field VARCHAR(100),
    condition_operator VARCHAR(20),
    condition_value TEXT,
    next_step_if_true INTEGER REFERENCES crm_lead_nurture_steps(step_id),
    next_step_if_false INTEGER REFERENCES crm_lead_nurture_steps(step_id),
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_nurture_steps_workflow ON crm_lead_nurture_steps(workflow_id);
CREATE INDEX idx_nurture_steps_order ON crm_lead_nurture_steps(workflow_id, step_order);

-- ============================================================================
-- 12. CAMPAIGN ANALYTICS (Daily aggregated metrics)
-- ============================================================================
CREATE TABLE crm_campaign_analytics (
    analytics_id SERIAL PRIMARY KEY,
    campaign_id INTEGER NOT NULL REFERENCES crm_campaigns(campaign_id) ON DELETE CASCADE,
    
    -- Date
    analytics_date DATE NOT NULL,
    
    -- Email metrics
    emails_sent INTEGER DEFAULT 0,
    emails_delivered INTEGER DEFAULT 0,
    emails_bounced INTEGER DEFAULT 0,
    emails_opened INTEGER DEFAULT 0,
    emails_clicked INTEGER DEFAULT 0,
    unique_opens INTEGER DEFAULT 0,
    unique_clicks INTEGER DEFAULT 0,
    unsubscribes INTEGER DEFAULT 0,
    
    -- Conversion metrics
    responses INTEGER DEFAULT 0,
    leads_generated INTEGER DEFAULT 0,
    opportunities_created INTEGER DEFAULT 0,
    deals_won INTEGER DEFAULT 0,
    
    -- Financial metrics
    cost_for_day DECIMAL(15, 2) DEFAULT 0,
    revenue_for_day DECIMAL(15, 2) DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(campaign_id, analytics_date)
);

CREATE INDEX idx_campaign_analytics_campaign ON crm_campaign_analytics(campaign_id);
CREATE INDEX idx_campaign_analytics_date ON crm_campaign_analytics(analytics_date);

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

CREATE TRIGGER trg_campaigns_updated
    BEFORE UPDATE ON crm_campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_campaign_members_updated
    BEFORE UPDATE ON crm_campaign_members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_email_templates_updated
    BEFORE UPDATE ON crm_email_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_lead_scoring_rules_updated
    BEFORE UPDATE ON crm_lead_scoring_rules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_nurture_workflows_updated
    BEFORE UPDATE ON crm_lead_nurture_workflows
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Update campaign member counts when member added
CREATE OR REPLACE FUNCTION update_campaign_member_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE crm_campaigns 
        SET total_members = total_members + 1 
        WHERE campaign_id = NEW.campaign_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE crm_campaigns 
        SET total_members = total_members - 1 
        WHERE campaign_id = OLD.campaign_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_campaign_member_count
    AFTER INSERT OR DELETE ON crm_campaign_members
    FOR EACH ROW
    EXECUTE FUNCTION update_campaign_member_count();

-- Update email send counts
CREATE OR REPLACE FUNCTION update_email_send_counts()
RETURNS TRIGGER AS $$
BEGIN
    -- Update campaign
    IF NEW.send_status = 'sent' AND (OLD.send_status IS NULL OR OLD.send_status != 'sent') THEN
        UPDATE crm_campaigns 
        SET total_sent = total_sent + 1 
        WHERE campaign_id = NEW.campaign_id;
        
        -- Update member
        UPDATE crm_campaign_members 
        SET email_sent_count = email_sent_count + 1,
            member_status = 'sent'
        WHERE member_id = NEW.member_id;
        
        -- Update template
        UPDATE crm_email_templates 
        SET sent_count = sent_count + 1 
        WHERE template_id = NEW.template_id;
    END IF;
    
    -- Update delivered count
    IF NEW.send_status = 'delivered' AND (OLD.send_status IS NULL OR OLD.send_status != 'delivered') THEN
        UPDATE crm_campaigns 
        SET total_delivered = total_delivered + 1 
        WHERE campaign_id = NEW.campaign_id;
    END IF;
    
    -- Update bounced count
    IF NEW.send_status = 'bounced' AND (OLD.send_status IS NULL OR OLD.send_status != 'bounced') THEN
        UPDATE crm_campaigns 
        SET total_bounced = total_bounced + 1 
        WHERE campaign_id = NEW.campaign_id;
        
        UPDATE crm_campaign_members 
        SET member_status = 'bounced'
        WHERE member_id = NEW.member_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_email_send_counts
    AFTER INSERT OR UPDATE ON crm_email_sends
    FOR EACH ROW
    EXECUTE FUNCTION update_email_send_counts();

-- Update open/click counts when email opened/clicked
CREATE OR REPLACE FUNCTION update_email_open_counts()
RETURNS TRIGGER AS $$
DECLARE
    v_send_record RECORD;
BEGIN
    -- Get send record
    SELECT * INTO v_send_record FROM crm_email_sends WHERE send_id = NEW.send_id;
    
    -- Update send record if first open
    IF v_send_record.opened_at IS NULL THEN
        UPDATE crm_email_sends 
        SET opened_at = NEW.opened_at 
        WHERE send_id = NEW.send_id;
        
        -- Update campaign
        UPDATE crm_campaigns 
        SET total_opened = total_opened + 1 
        WHERE campaign_id = v_send_record.campaign_id;
        
        -- Update member
        UPDATE crm_campaign_members 
        SET email_opened_count = email_opened_count + 1,
            member_status = CASE WHEN member_status = 'sent' THEN 'opened' ELSE member_status END
        WHERE member_id = v_send_record.member_id;
        
        -- Update template
        UPDATE crm_email_templates 
        SET open_count = open_count + 1 
        WHERE template_id = v_send_record.template_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_email_open_counts
    AFTER INSERT ON crm_email_opens
    FOR EACH ROW
    EXECUTE FUNCTION update_email_open_counts();

-- Update click counts
CREATE OR REPLACE FUNCTION update_email_click_counts()
RETURNS TRIGGER AS $$
DECLARE
    v_send_record RECORD;
BEGIN
    -- Get send record
    SELECT * INTO v_send_record FROM crm_email_sends WHERE send_id = NEW.send_id;
    
    -- Update send record if first click
    IF v_send_record.clicked_at IS NULL THEN
        UPDATE crm_email_sends 
        SET clicked_at = NEW.clicked_at 
        WHERE send_id = NEW.send_id;
        
        -- Update campaign
        UPDATE crm_campaigns 
        SET total_clicked = total_clicked + 1 
        WHERE campaign_id = v_send_record.campaign_id;
        
        -- Update member
        UPDATE crm_campaign_members 
        SET email_clicked_count = email_clicked_count + 1,
            member_status = 'clicked'
        WHERE member_id = v_send_record.member_id;
        
        -- Update template
        UPDATE crm_email_templates 
        SET click_count = click_count + 1 
        WHERE template_id = v_send_record.template_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_email_click_counts
    AFTER INSERT ON crm_email_clicks
    FOR EACH ROW
    EXECUTE FUNCTION update_email_click_counts();

-- ============================================================================
-- VIEWS
-- ============================================================================

-- Campaign performance summary
CREATE OR REPLACE VIEW v_campaign_performance AS
SELECT 
    c.campaign_id,
    c.campaign_number,
    c.campaign_name,
    ct.type_name as campaign_type,
    c.status,
    c.start_date,
    c.end_date,
    c.budget_amount,
    c.actual_cost,
    c.total_members,
    c.total_sent,
    c.total_delivered,
    c.total_opened,
    c.total_clicked,
    c.leads_generated,
    c.opportunities_generated,
    c.revenue_generated,
    CASE 
        WHEN c.total_sent > 0 THEN ROUND((c.total_delivered::numeric / c.total_sent * 100), 2)
        ELSE 0
    END as delivery_rate,
    CASE 
        WHEN c.total_delivered > 0 THEN ROUND((c.total_opened::numeric / c.total_delivered * 100), 2)
        ELSE 0
    END as open_rate,
    CASE 
        WHEN c.total_opened > 0 THEN ROUND((c.total_clicked::numeric / c.total_opened * 100), 2)
        ELSE 0
    END as click_through_rate,
    CASE 
        WHEN c.total_members > 0 THEN ROUND((c.leads_generated::numeric / c.total_members * 100), 2)
        ELSE 0
    END as lead_conversion_rate,
    CASE 
        WHEN c.actual_cost > 0 THEN ROUND((c.revenue_generated / c.actual_cost), 2)
        ELSE 0
    END as roi
FROM crm_campaigns c
JOIN crm_campaign_types ct ON c.campaign_type_id = ct.campaign_type_id
WHERE c.is_active = true;

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert campaign types
INSERT INTO crm_campaign_types (type_name, type_code, icon, color) VALUES
('Email Campaign', 'email', 'mail', '#blue'),
('Social Media', 'social', 'share-2', '#purple'),
('Webinar', 'webinar', 'video', '#green'),
('Event', 'event', 'calendar', '#orange'),
('Content Marketing', 'content', 'file-text', '#cyan'),
('Paid Advertising', 'paid_ads', 'dollar-sign', '#red'),
('Partner Campaign', 'partner', 'users', '#yellow'),
('Product Launch', 'product_launch', 'rocket', '#pink');

-- Insert sample lead scoring rules
INSERT INTO crm_lead_scoring_rules (rule_name, rule_code, category, trigger_type, score_change, is_active, priority) VALUES
('Email Opened', 'email_opened', 'engagement', 'email_open', 5, true, 10),
('Email Clicked', 'email_clicked', 'engagement', 'email_click', 10, true, 20),
('Form Submitted', 'form_submit', 'behavioral', 'form_submit', 20, true, 30),
('Pricing Page Visited', 'pricing_visit', 'behavioral', 'page_visit', 15, true, 25),
('Demo Requested', 'demo_request', 'behavioral', 'demo_request', 50, true, 50),
('Whitepaper Downloaded', 'whitepaper_download', 'behavioral', 'content_download', 10, true, 15),
('Job Title: C-Level', 'job_title_c_level', 'demographic', 'profile_update', 25, true, 40),
('Company Size: Enterprise', 'company_size_enterprise', 'firmographic', 'profile_update', 30, true, 45),
('Email Domain: Work Email', 'email_domain_work', 'demographic', 'profile_update', 10, true, 5),
('Unsubscribed', 'unsubscribed', 'engagement', 'unsubscribe', -50, true, 100);

-- Insert sample email templates
INSERT INTO crm_email_templates (
    template_name, template_code, subject_line, category,
    html_content, plain_text_content, merge_fields
) VALUES
('Welcome Email', 'welcome_email', 'Welcome to {company_name}!', 'transactional',
 '<h1>Welcome {first_name}!</h1><p>Thank you for joining us...</p>',
 'Welcome {first_name}! Thank you for joining us...',
 ARRAY['first_name', 'last_name', 'company_name']),
('Monthly Newsletter', 'monthly_newsletter', 'Your Monthly Update from {company_name}', 'newsletter',
 '<h1>Hi {first_name}!</h1><p>Here are this month''s highlights...</p>',
 'Hi {first_name}! Here are this month''s highlights...',
 ARRAY['first_name', 'company_name']),
('Product Launch', 'product_launch', 'Introducing Our New Product!', 'promotional',
 '<h1>Exciting News, {first_name}!</h1><p>We''re launching something special...</p>',
 'Exciting News, {first_name}! We''re launching something special...',
 ARRAY['first_name', 'product_name']),
('Webinar Invitation', 'webinar_invite', 'Join Us for {webinar_title}', 'promotional',
 '<h1>You''re Invited, {first_name}!</h1><p>Register for our upcoming webinar...</p>',
 'You''re Invited, {first_name}! Register for our upcoming webinar...',
 ARRAY['first_name', 'webinar_title', 'webinar_date']),
('Re-engagement', 'reengagement', 'We Miss You, {first_name}!', 'nurture',
 '<h1>Come Back, {first_name}!</h1><p>We noticed you haven''t been active...</p>',
 'Come Back, {first_name}! We noticed you haven''t been active...',
 ARRAY['first_name', 'last_active_date']);

-- Insert sample nurture workflow
INSERT INTO crm_lead_nurture_workflows (
    workflow_name, workflow_code, description, trigger_type, trigger_score_min, status
) VALUES
('New Lead Nurture', 'new_lead_nurture', 'Automated nurture sequence for new leads', 'lead_score_threshold', 50, 'active');

-- Insert nurture workflow steps
INSERT INTO crm_lead_nurture_steps (workflow_id, step_name, step_order, step_type, delay_days, template_id) VALUES
(1, 'Welcome Email', 1, 'email', 0, 1),
(1, 'Wait 3 Days', 2, 'wait', 3, NULL),
(1, 'Product Info Email', 3, 'email', 0, 3),
(1, 'Wait 5 Days', 4, 'wait', 5, NULL),
(1, 'Webinar Invitation', 5, 'email', 0, 4);

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Phase 7 Task 4: Marketing Automation Schema Installation Complete!';
    RAISE NOTICE '📊 Tables created: 12';
    RAISE NOTICE '📧 Campaign types: 8';
    RAISE NOTICE '🎯 Scoring rules: 10';
    RAISE NOTICE '📝 Email templates: 5';
    RAISE NOTICE '';
    RAISE NOTICE 'Next: Create API endpoints for campaign management';
END $$;
