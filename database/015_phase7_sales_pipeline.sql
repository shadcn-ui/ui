-- Phase 7 Task 2: Sales Pipeline & Opportunity Tracking
-- Date: December 4, 2025
-- Purpose: Complete sales pipeline management with opportunities, quotes, and forecasting

-- Drop existing tables if they exist (for clean reinstall)
DROP TABLE IF EXISTS crm_opportunity_products CASCADE;
DROP TABLE IF EXISTS crm_quote_line_items CASCADE;
DROP TABLE IF EXISTS crm_quotes CASCADE;
DROP TABLE IF EXISTS crm_opportunity_competitors CASCADE;
DROP TABLE IF EXISTS crm_competitors CASCADE;
DROP TABLE IF EXISTS crm_opportunity_activities CASCADE;
DROP TABLE IF EXISTS crm_activities CASCADE;
DROP TABLE IF EXISTS crm_activity_types CASCADE;
DROP TABLE IF EXISTS crm_stage_history CASCADE;
DROP TABLE IF EXISTS crm_forecasts CASCADE;
DROP TABLE IF EXISTS crm_win_loss_reasons CASCADE;
DROP TABLE IF EXISTS crm_opportunities CASCADE;
DROP TABLE IF EXISTS crm_opportunity_stages CASCADE;
DROP TABLE IF EXISTS crm_pipeline_stages CASCADE;

-- ============================================================================
-- 1. PIPELINE STAGES (Kanban-style pipeline configuration)
-- ============================================================================
CREATE TABLE crm_pipeline_stages (
    stage_id SERIAL PRIMARY KEY,
    stage_name VARCHAR(100) NOT NULL,
    stage_code VARCHAR(50) NOT NULL UNIQUE,
    stage_order INTEGER NOT NULL,
    probability INTEGER DEFAULT 0 CHECK (probability >= 0 AND probability <= 100), -- Win probability %
    stage_category VARCHAR(50) NOT NULL CHECK (stage_category IN ('qualification', 'development', 'proposal', 'negotiation', 'closed_won', 'closed_lost')),
    is_closed BOOLEAN DEFAULT false,
    is_won BOOLEAN DEFAULT false,
    color VARCHAR(20),
    icon VARCHAR(50),
    description TEXT,
    expected_duration_days INTEGER, -- How long opportunities typically stay in this stage
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pipeline_stages_order ON crm_pipeline_stages(stage_order);
CREATE INDEX idx_pipeline_stages_active ON crm_pipeline_stages(is_active);

-- ============================================================================
-- 2. WIN/LOSS REASONS (Why deals are won or lost) - MUST BE BEFORE OPPORTUNITIES
-- ============================================================================
CREATE TABLE crm_win_loss_reasons (
    win_loss_reason_id SERIAL PRIMARY KEY,
    reason_name VARCHAR(255) NOT NULL,
    reason_code VARCHAR(50) UNIQUE NOT NULL,
    reason_type VARCHAR(20) NOT NULL CHECK (reason_type IN ('won', 'lost')),
    category VARCHAR(100), -- price, competition, timing, features, etc.
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 3. OPPORTUNITIES (Sales deals/opportunities)
-- ============================================================================
CREATE TABLE crm_opportunities (
    opportunity_id SERIAL PRIMARY KEY,
    opportunity_number VARCHAR(50) UNIQUE NOT NULL,
    opportunity_name VARCHAR(255) NOT NULL,
    account_id INTEGER NOT NULL REFERENCES crm_accounts(account_id),
    contact_id INTEGER REFERENCES crm_contacts(contact_id),
    stage_id INTEGER NOT NULL REFERENCES crm_pipeline_stages(stage_id),
    
    -- Deal details
    amount DECIMAL(15,2),
    expected_revenue DECIMAL(15,2), -- Weighted revenue (amount * probability)
    probability INTEGER DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
    close_date DATE,
    expected_close_date DATE,
    
    -- Categorization
    opportunity_type VARCHAR(50) CHECK (opportunity_type IN ('new_business', 'existing_business', 'renewal', 'upgrade')),
    lead_source VARCHAR(100), -- How we found this opportunity
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    
    -- Ownership
    owner_id INTEGER, -- Sales rep responsible
    sales_team_id INTEGER,
    
    -- Competition
    has_competition BOOLEAN DEFAULT false,
    
    -- Win/Loss tracking
    is_closed BOOLEAN DEFAULT false,
    is_won BOOLEAN DEFAULT null, -- null=open, true=won, false=lost
    win_loss_reason_id INTEGER,
    closed_at TIMESTAMP,
    
    -- Descriptions
    description TEXT,
    next_steps TEXT,
    pain_points TEXT, -- Customer pain points this solves
    
    -- Tracking
    days_in_stage INTEGER DEFAULT 0,
    total_days_open INTEGER DEFAULT 0,
    last_activity_date DATE,
    
    -- Metadata
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    
    CONSTRAINT fk_win_loss_reason FOREIGN KEY (win_loss_reason_id) REFERENCES crm_win_loss_reasons(win_loss_reason_id)
);

CREATE INDEX idx_opportunities_account ON crm_opportunities(account_id);
CREATE INDEX idx_opportunities_stage ON crm_opportunities(stage_id);
CREATE INDEX idx_opportunities_owner ON crm_opportunities(owner_id);
CREATE INDEX idx_opportunities_close_date ON crm_opportunities(close_date);
CREATE INDEX idx_opportunities_amount ON crm_opportunities(amount);
CREATE INDEX idx_opportunities_is_won ON crm_opportunities(is_won);
CREATE INDEX idx_opportunities_active ON crm_opportunities(is_active);

-- ============================================================================
-- 4. STAGE HISTORY (Track opportunity movement through pipeline)
-- ============================================================================
CREATE TABLE crm_stage_history (
    history_id SERIAL PRIMARY KEY,
    opportunity_id INTEGER NOT NULL REFERENCES crm_opportunities(opportunity_id) ON DELETE CASCADE,
    from_stage_id INTEGER REFERENCES crm_pipeline_stages(stage_id),
    to_stage_id INTEGER NOT NULL REFERENCES crm_pipeline_stages(stage_id),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by INTEGER,
    days_in_previous_stage INTEGER,
    notes TEXT,
    previous_probability INTEGER,
    new_probability INTEGER
);

CREATE INDEX idx_stage_history_opportunity ON crm_stage_history(opportunity_id);
CREATE INDEX idx_stage_history_date ON crm_stage_history(changed_at);

-- ============================================================================
-- 5. ACTIVITY TYPES (Call, meeting, email, task, etc.) - MUST BE BEFORE ACTIVITIES
-- ============================================================================
CREATE TABLE crm_activity_types (
    activity_type_id SERIAL PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL,
    type_code VARCHAR(50) UNIQUE NOT NULL,
    category VARCHAR(50) CHECK (category IN ('call', 'meeting', 'email', 'task', 'demo', 'proposal', 'other')),
    icon VARCHAR(50),
    color VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 6. ACTIVITIES (Tasks, calls, meetings related to opportunities)
-- ============================================================================
CREATE TABLE crm_activities (
    activity_id SERIAL PRIMARY KEY,
    opportunity_id INTEGER REFERENCES crm_opportunities(opportunity_id) ON DELETE CASCADE,
    account_id INTEGER REFERENCES crm_accounts(account_id),
    contact_id INTEGER REFERENCES crm_contacts(contact_id),
    activity_type_id INTEGER NOT NULL REFERENCES crm_activity_types(activity_type_id),
    
    -- Activity details
    subject VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled', 'no_show')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    
    -- Scheduling
    due_date TIMESTAMP,
    completed_date TIMESTAMP,
    duration_minutes INTEGER,
    
    -- Ownership
    owner_id INTEGER, -- Who is responsible
    assigned_to INTEGER, -- Who will execute
    
    -- Outcome
    outcome TEXT,
    next_steps TEXT,
    
    -- Reminders
    reminder_date TIMESTAMP,
    reminder_sent BOOLEAN DEFAULT false,
    
    -- Metadata
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER
);

CREATE INDEX idx_activities_opportunity ON crm_activities(opportunity_id);
CREATE INDEX idx_activities_account ON crm_activities(account_id);
CREATE INDEX idx_activities_owner ON crm_activities(owner_id);
CREATE INDEX idx_activities_due_date ON crm_activities(due_date);
CREATE INDEX idx_activities_status ON crm_activities(status);

-- ============================================================================
-- 7. COMPETITORS (Competitor companies)
-- ============================================================================
CREATE TABLE crm_competitors (
    competitor_id SERIAL PRIMARY KEY,
    competitor_name VARCHAR(255) NOT NULL,
    website VARCHAR(255),
    strengths TEXT,
    weaknesses TEXT,
    market_position VARCHAR(50),
    pricing_strategy TEXT,
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_competitors_name ON crm_competitors(competitor_name);

-- ============================================================================
-- 8. OPPORTUNITY COMPETITORS (Competitors in specific deals)
-- ============================================================================
CREATE TABLE crm_opportunity_competitors (
    opp_competitor_id SERIAL PRIMARY KEY,
    opportunity_id INTEGER NOT NULL REFERENCES crm_opportunities(opportunity_id) ON DELETE CASCADE,
    competitor_id INTEGER NOT NULL REFERENCES crm_competitors(competitor_id),
    their_strengths TEXT,
    our_advantages TEXT,
    estimated_price DECIMAL(15,2),
    likelihood VARCHAR(50) CHECK (likelihood IN ('low', 'medium', 'high')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(opportunity_id, competitor_id)
);

CREATE INDEX idx_opp_competitors_opportunity ON crm_opportunity_competitors(opportunity_id);

-- ============================================================================
-- 9. QUOTES (Price quotes for opportunities)
-- ============================================================================
CREATE TABLE crm_quotes (
    quote_id SERIAL PRIMARY KEY,
    quote_number VARCHAR(50) UNIQUE NOT NULL,
    opportunity_id INTEGER NOT NULL REFERENCES crm_opportunities(opportunity_id),
    account_id INTEGER NOT NULL REFERENCES crm_accounts(account_id),
    contact_id INTEGER REFERENCES crm_contacts(contact_id),
    
    -- Quote details
    quote_name VARCHAR(255) NOT NULL,
    version INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'sent', 'accepted', 'rejected', 'expired')),
    
    -- Pricing
    subtotal DECIMAL(15,2) DEFAULT 0,
    discount_percent DECIMAL(5,2) DEFAULT 0,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    tax_percent DECIMAL(5,2) DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    shipping_amount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) DEFAULT 0,
    
    -- Dates
    quote_date DATE NOT NULL,
    valid_until DATE,
    accepted_date DATE,
    
    -- Terms
    payment_terms VARCHAR(100),
    delivery_terms VARCHAR(100),
    notes TEXT,
    terms_and_conditions TEXT,
    
    -- Ownership
    owner_id INTEGER,
    
    -- Metadata
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER
);

CREATE INDEX idx_quotes_opportunity ON crm_quotes(opportunity_id);
CREATE INDEX idx_quotes_account ON crm_quotes(account_id);
CREATE INDEX idx_quotes_status ON crm_quotes(status);
CREATE INDEX idx_quotes_date ON crm_quotes(quote_date);

-- ============================================================================
-- 10. QUOTE LINE ITEMS (Products/services in quotes)
-- ============================================================================
CREATE TABLE crm_quote_line_items (
    line_item_id SERIAL PRIMARY KEY,
    quote_id INTEGER NOT NULL REFERENCES crm_quotes(quote_id) ON DELETE CASCADE,
    product_id INTEGER, -- Optional reference to products table
    
    -- Item details
    line_number INTEGER NOT NULL,
    product_code VARCHAR(100),
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Pricing
    quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
    unit_price DECIMAL(15,2) NOT NULL,
    discount_percent DECIMAL(5,2) DEFAULT 0,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    tax_percent DECIMAL(5,2) DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    line_total DECIMAL(15,2) NOT NULL,
    
    -- Additional info
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quote_lines_quote ON crm_quote_line_items(quote_id);
CREATE INDEX idx_quote_lines_product ON crm_quote_line_items(product_id);

-- ============================================================================
-- 11. OPPORTUNITY PRODUCTS (Products associated with opportunities)
-- ============================================================================
CREATE TABLE crm_opportunity_products (
    opp_product_id SERIAL PRIMARY KEY,
    opportunity_id INTEGER NOT NULL REFERENCES crm_opportunities(opportunity_id) ON DELETE CASCADE,
    product_id INTEGER, -- Optional reference to products table
    
    product_name VARCHAR(255) NOT NULL,
    quantity DECIMAL(10,2) DEFAULT 1,
    unit_price DECIMAL(15,2),
    discount_percent DECIMAL(5,2) DEFAULT 0,
    total_price DECIMAL(15,2),
    
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_opp_products_opportunity ON crm_opportunity_products(opportunity_id);

-- ============================================================================
-- 12. FORECASTS (Revenue forecasting)
-- ============================================================================
CREATE TABLE crm_forecasts (
    forecast_id SERIAL PRIMARY KEY,
    forecast_name VARCHAR(255) NOT NULL,
    forecast_period VARCHAR(50) NOT NULL, -- 'Q1 2025', 'December 2025', etc.
    forecast_type VARCHAR(50) CHECK (forecast_type IN ('monthly', 'quarterly', 'annual')),
    
    -- Date range
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    
    -- Targets
    target_revenue DECIMAL(15,2),
    
    -- Calculated values
    pipeline_revenue DECIMAL(15,2), -- Total of all open opportunities
    weighted_revenue DECIMAL(15,2), -- Pipeline * probability
    committed_revenue DECIMAL(15,2), -- High probability deals (>75%)
    best_case_revenue DECIMAL(15,2), -- All open deals
    closed_won_revenue DECIMAL(15,2), -- Actual closed deals
    
    -- Metrics
    win_rate_percent DECIMAL(5,2),
    average_deal_size DECIMAL(15,2),
    total_opportunities INTEGER,
    
    -- Ownership
    owner_id INTEGER, -- Sales rep or manager
    team_id INTEGER,
    
    -- Status
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'closed')),
    
    -- Metadata
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER
);

CREATE INDEX idx_forecasts_period ON crm_forecasts(start_date, end_date);
CREATE INDEX idx_forecasts_owner ON crm_forecasts(owner_id);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_pipeline_stages_updated
    BEFORE UPDATE ON crm_pipeline_stages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_opportunities_updated
    BEFORE UPDATE ON crm_opportunities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_activities_updated
    BEFORE UPDATE ON crm_activities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_quotes_updated
    BEFORE UPDATE ON crm_quotes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_competitors_updated
    BEFORE UPDATE ON crm_competitors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger to calculate expected revenue when opportunity changes
CREATE OR REPLACE FUNCTION calculate_expected_revenue()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.amount IS NOT NULL AND NEW.probability IS NOT NULL THEN
        NEW.expected_revenue := NEW.amount * (NEW.probability / 100.0);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_opportunity_expected_revenue
    BEFORE INSERT OR UPDATE OF amount, probability ON crm_opportunities
    FOR EACH ROW
    EXECUTE FUNCTION calculate_expected_revenue();

-- Trigger to log stage changes
CREATE OR REPLACE FUNCTION log_stage_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.stage_id IS DISTINCT FROM NEW.stage_id THEN
        INSERT INTO crm_stage_history (
            opportunity_id,
            from_stage_id,
            to_stage_id,
            days_in_previous_stage,
            previous_probability,
            new_probability,
            changed_by
        ) VALUES (
            NEW.opportunity_id,
            OLD.stage_id,
            NEW.stage_id,
            NEW.days_in_stage,
            OLD.probability,
            NEW.probability,
            NEW.updated_at::INTEGER -- This would be user_id in production
        );
        
        -- Reset days in stage counter
        NEW.days_in_stage := 0;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_opportunity_stage_change
    BEFORE UPDATE OF stage_id ON crm_opportunities
    FOR EACH ROW
    EXECUTE FUNCTION log_stage_change();

-- ============================================================================
-- VIEWS
-- ============================================================================

-- Pipeline overview view
CREATE OR REPLACE VIEW v_pipeline_overview AS
SELECT 
    ps.stage_id,
    ps.stage_name,
    ps.stage_code,
    ps.stage_order,
    ps.probability as stage_probability,
    COUNT(o.opportunity_id) as opportunity_count,
    SUM(o.amount) as total_amount,
    SUM(o.expected_revenue) as total_weighted_revenue,
    AVG(o.amount) as avg_deal_size,
    AVG(o.days_in_stage) as avg_days_in_stage
FROM crm_pipeline_stages ps
LEFT JOIN crm_opportunities o ON ps.stage_id = o.stage_id AND o.is_active = true AND o.is_closed = false
WHERE ps.is_active = true
GROUP BY ps.stage_id, ps.stage_name, ps.stage_code, ps.stage_order, ps.probability
ORDER BY ps.stage_order;

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert default pipeline stages
INSERT INTO crm_pipeline_stages (stage_name, stage_code, stage_order, probability, stage_category, color, icon, expected_duration_days) VALUES
('Lead Qualification', 'qualification', 1, 10, 'qualification', '#gray', 'search', 7),
('Needs Analysis', 'needs_analysis', 2, 20, 'development', '#blue', 'clipboard', 14),
('Proposal/Quote', 'proposal', 3, 40, 'proposal', '#yellow', 'file-text', 14),
('Negotiation', 'negotiation', 4, 60, 'negotiation', '#orange', 'handshake', 10),
('Contract Review', 'contract', 5, 80, 'negotiation', '#purple', 'file-check', 7),
('Closed Won', 'closed_won', 6, 100, 'closed_won', '#green', 'check-circle', 0),
('Closed Lost', 'closed_lost', 7, 0, 'closed_lost', '#red', 'x-circle', 0);

UPDATE crm_pipeline_stages SET is_closed = true, is_won = true WHERE stage_code = 'closed_won';
UPDATE crm_pipeline_stages SET is_closed = true, is_won = false WHERE stage_code = 'closed_lost';

-- Insert win/loss reasons
INSERT INTO crm_win_loss_reasons (reason_name, reason_code, reason_type, category) VALUES
-- Win reasons
('Best Price', 'win_price', 'won', 'price'),
('Best Features', 'win_features', 'won', 'product'),
('Better Service', 'win_service', 'won', 'service'),
('Existing Relationship', 'win_relationship', 'won', 'relationship'),
('Better Implementation', 'win_implementation', 'won', 'service'),
-- Loss reasons
('Price Too High', 'loss_price', 'lost', 'price'),
('Lost to Competitor', 'loss_competitor', 'lost', 'competition'),
('No Budget', 'loss_budget', 'lost', 'budget'),
('Bad Timing', 'loss_timing', 'lost', 'timing'),
('Missing Features', 'loss_features', 'lost', 'product'),
('Project Cancelled', 'loss_cancelled', 'lost', 'other'),
('Went with Incumbent', 'loss_incumbent', 'lost', 'competition');

-- Insert activity types
INSERT INTO crm_activity_types (type_name, type_code, category, icon, color) VALUES
('Phone Call', 'phone_call', 'call', 'phone', '#blue'),
('Meeting', 'meeting', 'meeting', 'users', '#purple'),
('Email', 'email', 'email', 'mail', '#gray'),
('Demo', 'demo', 'demo', 'monitor', '#green'),
('Proposal Sent', 'proposal_sent', 'proposal', 'file-text', '#yellow'),
('Follow-up Task', 'followup', 'task', 'check-square', '#orange'),
('Site Visit', 'site_visit', 'meeting', 'map-pin', '#red'),
('Contract Negotiation', 'contract_nego', 'meeting', 'edit', '#purple');

-- Insert sample competitors
INSERT INTO crm_competitors (competitor_name, website, market_position) VALUES
('Competitor A', 'https://competitora.com', 'Market Leader'),
('Competitor B', 'https://competitorb.com', 'Low-Cost Provider'),
('Competitor C', 'https://competitorc.com', 'Niche Player');

-- Insert sample opportunities (using existing accounts from Task 1)
INSERT INTO crm_opportunities (
    opportunity_number,
    opportunity_name,
    account_id,
    stage_id,
    amount,
    probability,
    expected_close_date,
    opportunity_type,
    lead_source,
    owner_id,
    description
)
SELECT 
    'OPP-' || LPAD(ROW_NUMBER() OVER ()::TEXT, 6, '0'),
    a.account_name || ' - Initial Deal',
    a.account_id,
    (SELECT stage_id FROM crm_pipeline_stages WHERE stage_code = 'needs_analysis'),
    CASE 
        WHEN a.account_type = 'customer' THEN 50000
        WHEN a.account_type = 'prospect' THEN 75000
        ELSE 100000
    END,
    20,
    CURRENT_DATE + INTERVAL '60 days',
    'new_business',
    'Website',
    NULL,
    'Initial sales opportunity with ' || a.account_name
FROM crm_accounts a
WHERE a.is_active = true
LIMIT 3;

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Phase 7 Task 2: Sales Pipeline Schema Installation Complete!';
    RAISE NOTICE '📊 Tables created: 12';
    RAISE NOTICE '🎯 Pipeline stages: 7';
    RAISE NOTICE '📈 Sample opportunities: 3';
    RAISE NOTICE '';
    RAISE NOTICE 'Next: Create API endpoints for opportunity management';
END $$;
