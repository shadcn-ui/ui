-- =====================================================
-- Ocean ERP - Period Closing System
-- Phase D2: P&L Closing with Locking & Audit Trail
-- =====================================================

-- 1. Accounting Periods Table
-- =====================================================
CREATE TABLE IF NOT EXISTS accounting_periods (
    id SERIAL PRIMARY KEY,
    period_name VARCHAR(100) NOT NULL, -- 'January 2025', 'Q1 2025', 'FY 2025'
    period_type VARCHAR(50) NOT NULL, -- 'MONTHLY', 'QUARTERLY', 'YEARLY'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    fiscal_year INTEGER NOT NULL,
    
    -- Status management
    status VARCHAR(50) DEFAULT 'OPEN' NOT NULL, -- 'OPEN', 'CLOSED', 'LOCKED'
    
    -- P&L specific
    pl_closed BOOLEAN DEFAULT false,
    pl_closed_at TIMESTAMP,
    pl_closed_by UUID REFERENCES users(id),
    pl_closing_journal_id UUID REFERENCES journal_entries(id),
    
    -- Balance Sheet specific (future)
    bs_closed BOOLEAN DEFAULT false,
    bs_closed_at TIMESTAMP,
    bs_closed_by UUID REFERENCES users(id),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT unique_period UNIQUE (period_name, fiscal_year),
    CONSTRAINT check_dates CHECK (end_date > start_date),
    CONSTRAINT check_pl_closed CHECK (
        (pl_closed = false) OR 
        (pl_closed = true AND pl_closed_at IS NOT NULL AND pl_closed_by IS NOT NULL)
    )
);
-- 2. Closing Journals Table
-- =====================================================
CREATE TABLE IF NOT EXISTS accounting_closing_journals (
    id SERIAL PRIMARY KEY,
    period_id INTEGER NOT NULL REFERENCES accounting_periods(id),
    journal_entry_id UUID NOT NULL REFERENCES journal_entries(id),
    closing_type VARCHAR(50) NOT NULL, -- 'PL_CLOSING', 'BS_CLOSING', 'YEAR_END'
    
    -- Closing summary
    total_revenue NUMERIC(15,2) DEFAULT 0,
    total_expense NUMERIC(15,2) DEFAULT 0,
    total_cogs NUMERIC(15,2) DEFAULT 0,
    net_result NUMERIC(15,2) DEFAULT 0, -- Profit or Loss
    
    -- Audit
    closed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    closed_by UUID NOT NULL REFERENCES users(id),
    is_locked BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT unique_period_closing UNIQUE (period_id, closing_type)
);

-- 3. Period Lock Table (for granular locking)
-- =====================================================
CREATE TABLE IF NOT EXISTS accounting_period_locks (
    id SERIAL PRIMARY KEY,
    period_id INTEGER NOT NULL REFERENCES accounting_periods(id),
    account_type VARCHAR(50) NOT NULL, -- 'Revenue', 'Expense', 'COGS', 'Asset', 'Liability', 'Equity'
    is_locked BOOLEAN DEFAULT false,
    locked_at TIMESTAMP,
    locked_by UUID REFERENCES users(id),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);
-- 4. Audit Log Table (Immutable)
-- =====================================================
CREATE TABLE IF NOT EXISTS accounting_audit_log (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL, -- 'PERIOD_CLOSED', 'CLOSING_JOURNAL_CREATED', 'VALIDATION_FAILED', 'CORRECTION_POSTED'
    event_category VARCHAR(50) NOT NULL, -- 'CLOSING', 'JOURNAL', 'VALIDATION', 'CORRECTION'
    
    -- Context
    period_id INTEGER REFERENCES accounting_periods(id),
    journal_entry_id UUID REFERENCES journal_entries(id),
    closing_journal_id INTEGER REFERENCES accounting_closing_journals(id),
    user_id UUID NOT NULL REFERENCES users(id),
    
    -- Data
    event_data JSONB, -- Flexible storage for event-specific data
    validation_results JSONB, -- For validation events
    
    -- Audit metadata
    event_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ip_address VARCHAR(50),
    user_agent TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION prevent_audit_log_modification()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Audit log records cannot be modified or deleted';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_prevent_audit_update
BEFORE UPDATE ON accounting_audit_log
FOR EACH ROW
EXECUTE FUNCTION prevent_audit_log_modification();

CREATE TRIGGER trigger_prevent_audit_delete
BEFORE DELETE ON accounting_audit_log
EXECUTE FUNCTION prevent_audit_log_modification();

-- =====================================================
-- Indexes for Performance
-- =====================================================
CREATE INDEX idx_periods_status ON accounting_periods(status);
CREATE INDEX idx_periods_fiscal_year ON accounting_periods(fiscal_year);
CREATE INDEX idx_periods_dates ON accounting_periods(start_date, end_date);
CREATE INDEX idx_periods_pl_closed ON accounting_periods(pl_closed);

CREATE INDEX idx_closing_journals_period ON accounting_closing_journals(period_id);
CREATE INDEX idx_closing_journals_type ON accounting_closing_journals(closing_type);
CREATE INDEX idx_closing_journals_date ON accounting_closing_journals(closed_at);

CREATE INDEX idx_period_locks_period ON accounting_period_locks(period_id);
CREATE INDEX idx_period_locks_type ON accounting_period_locks(account_type);
CREATE INDEX idx_period_locks_status ON accounting_period_locks(is_locked);

CREATE INDEX idx_audit_log_event_type ON accounting_audit_log(event_type);
CREATE INDEX idx_audit_log_period ON accounting_audit_log(period_id);
CREATE INDEX idx_audit_log_user ON accounting_audit_log(user_id);
CREATE INDEX idx_audit_log_timestamp ON accounting_audit_log(event_timestamp);
CREATE INDEX idx_audit_log_category ON accounting_audit_log(event_category);

-- =====================================================
-- Helper Functions
-- =====================================================

-- Function to check if journal date is in locked period
CREATE OR REPLACE FUNCTION is_period_locked_for_account(
    p_entry_date DATE,
    p_account_type VARCHAR
)
RETURNS BOOLEAN AS $$
DECLARE
    v_locked BOOLEAN;
BEGIN
    SELECT COALESCE(
        (
            WHERE p_entry_date BETWEEN ap.start_date AND ap.end_date
            AND pl.account_type = p_account_type
            AND pl.is_locked = true
            LIMIT 1
        ),
        false
    ) INTO v_locked;
    
    RETURN v_locked;
END;
$$ LANGUAGE plpgsql;

-- Function to get period for a date
CREATE OR REPLACE FUNCTION get_period_for_date(p_date DATE)
RETURNS INTEGER AS $$
DECLARE
    v_period_id INTEGER;
BEGIN
    SELECT id INTO v_period_id
    FROM accounting_periods
    WHERE p_date BETWEEN start_date AND end_date
    LIMIT 1;
    
    RETURN v_period_id;
END;
$$ LANGUAGE plpgsql;

-- Function to log audit event
CREATE OR REPLACE FUNCTION log_audit_event(
    p_event_type VARCHAR,
    p_event_category VARCHAR,
    p_user_id UUID,
    p_period_id INTEGER DEFAULT NULL,
    p_journal_entry_id UUID DEFAULT NULL,
    p_closing_journal_id INTEGER DEFAULT NULL,
    p_event_data JSONB DEFAULT NULL,
    p_validation_results JSONB DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
    v_audit_id INTEGER;
BEGIN
    INSERT INTO accounting_audit_log (
        event_type,
        event_category,
        user_id,
        period_id,
        journal_entry_id,
        closing_journal_id,
        event_data,
        validation_results
    ) VALUES (
        p_event_type,
        p_event_category,
        p_user_id,
        p_period_id,
        p_journal_entry_id,
        p_closing_journal_id,
        p_event_data,
        p_validation_results
    )
    RETURNING id INTO v_audit_id;
    
    RETURN v_audit_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- Trigger: Block journal modifications in locked periods
-- =====================================================
CREATE OR REPLACE FUNCTION block_locked_period_modifications()
RETURNS TRIGGER AS $$
DECLARE
    v_period_locked BOOLEAN;
    v_account_type VARCHAR;
    v_period_id INTEGER;
BEGIN
    -- For INSERT and UPDATE on journal_entries
    IF TG_TABLE_NAME = 'journal_entries' THEN
        -- Get period
        SELECT id INTO v_period_id
        FROM accounting_periods
        WHERE NEW.entry_date BETWEEN start_date AND end_date
        LIMIT 1;
        
        -- Check if period is locked for P&L accounts
        IF v_period_id IS NOT NULL THEN
            
            IF v_period_locked = true AND NEW.entry_type IN ('Sales', 'Purchase', 'COGS', 'Revenue', 'Expense') THEN
                RAISE EXCEPTION 'Cannot modify journal entries in closed P&L period. Create adjustment in next period.';
            END IF;
        END IF;
    END IF;
    
    -- For journal_entry_lines, check account type
    IF TG_TABLE_NAME = 'journal_entry_lines' THEN
        SELECT coa.account_type INTO v_account_type
        FROM chart_of_accounts coa
        WHERE coa.id = NEW.account_id;
        
        -- Get journal entry date
        SELECT je.entry_date INTO NEW.entry_date
        FROM journal_entries je
        WHERE je.id = NEW.journal_entry_id;
        
        -- Check if locked
        IF is_period_locked_for_account(NEW.entry_date, v_account_type) THEN
            RAISE EXCEPTION 'Account type % is locked for this period', v_account_type;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER trigger_block_locked_journals
BEFORE INSERT OR UPDATE ON journal_entries
FOR EACH ROW
EXECUTE FUNCTION block_locked_period_modifications();

-- =====================================================
-- Seed Default Periods (2025 Monthly)
-- =====================================================
INSERT INTO accounting_periods (period_name, period_type, start_date, end_date, fiscal_year, status)
VALUES 
    ('January 2025', 'MONTHLY', '2025-01-01', '2025-01-31', 2025, 'OPEN'),
    ('February 2025', 'MONTHLY', '2025-02-01', '2025-02-28', 2025, 'OPEN'),
    ('March 2025', 'MONTHLY', '2025-03-01', '2025-03-31', 2025, 'OPEN'),
    ('April 2025', 'MONTHLY', '2025-04-01', '2025-04-30', 2025, 'OPEN'),
    ('May 2025', 'MONTHLY', '2025-05-01', '2025-05-31', 2025, 'OPEN'),
    ('June 2025', 'MONTHLY', '2025-06-01', '2025-06-30', 2025, 'OPEN'),
    ('July 2025', 'MONTHLY', '2025-07-01', '2025-07-31', 2025, 'OPEN'),
    ('August 2025', 'MONTHLY', '2025-08-01', '2025-08-31', 2025, 'OPEN'),
    ('September 2025', 'MONTHLY', '2025-09-01', '2025-09-30', 2025, 'OPEN'),
    ('October 2025', 'MONTHLY', '2025-10-01', '2025-10-31', 2025, 'OPEN'),
    ('November 2025', 'MONTHLY', '2025-11-01', '2025-11-30', 2025, 'OPEN'),
    ('December 2025', 'MONTHLY', '2025-12-01', '2025-12-31', 2025, 'OPEN'),
    
    -- 2026
    ('January 2026', 'MONTHLY', '2026-01-01', '2026-01-31', 2026, 'OPEN'),
    ('February 2026', 'MONTHLY', '2026-02-01', '2026-02-28', 2026, 'OPEN'),
    ('March 2026', 'MONTHLY', '2026-03-01', '2026-03-31', 2026, 'OPEN'),
    ('April 2026', 'MONTHLY', '2026-04-01', '2026-04-30', 2026, 'OPEN'),
    ('May 2026', 'MONTHLY', '2026-05-01', '2026-05-31', 2026, 'OPEN'),
    ('June 2026', 'MONTHLY', '2026-06-01', '2026-06-30', 2026, 'OPEN'),
    ('July 2026', 'MONTHLY', '2026-07-01', '2026-07-31', 2026, 'OPEN'),
    ('August 2026', 'MONTHLY', '2026-08-01', '2026-08-31', 2026, 'OPEN'),
    ('September 2026', 'MONTHLY', '2026-09-01', '2026-09-30', 2026, 'OPEN'),
    ('October 2026', 'MONTHLY', '2026-10-01', '2026-10-31', 2026, 'OPEN'),
    ('November 2026', 'MONTHLY', '2026-11-01', '2026-11-30', 2026, 'OPEN'),
    ('December 2026', 'MONTHLY', '2026-12-01', '2026-12-31', 2026, 'OPEN')
ON CONFLICT (period_name, fiscal_year) DO NOTHING;

-- =====================================================
-- Comments
-- =====================================================
COMMENT ON TABLE accounting_periods IS 'Fiscal periods for accounting close management';
COMMENT ON TABLE accounting_closing_journals IS 'System-generated closing journals with audit trail';
COMMENT ON TABLE accounting_period_locks IS 'Granular account-type locking per period';
COMMENT ON TABLE accounting_audit_log IS 'Immutable audit log for all closing operations';
COMMENT ON FUNCTION is_period_locked_for_account IS 'Check if specific account type is locked for a date';
COMMENT ON FUNCTION log_audit_event IS 'Create immutable audit log entry';
