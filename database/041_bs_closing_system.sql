-- =====================================================
-- Ocean ERP - Balance Sheet Closing System
-- Phase D3: BS Closing with Carry-Forward
-- =====================================================

-- 1. Balance Sheet Snapshots Table
-- =====================================================
-- Stores immutable snapshots of BS account balances at period end
CREATE TABLE IF NOT EXISTS accounting_bs_snapshots (
    id SERIAL PRIMARY KEY,
    period_id INTEGER NOT NULL REFERENCES accounting_periods(id),
    account_id INTEGER NOT NULL REFERENCES chart_of_accounts(id),
    account_code VARCHAR(50) NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    account_type VARCHAR(50) NOT NULL, -- 'Asset', 'Liability', 'Equity'
    
    -- Balance information
    ending_balance NUMERIC(15,2) NOT NULL,
    debit_balance NUMERIC(15,2) DEFAULT 0,
    credit_balance NUMERIC(15,2) DEFAULT 0,
    
    -- Audit metadata
    snapshot_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    snapshot_by UUID NOT NULL REFERENCES users(id),
    
    -- Context
    carry_forward_journal_id UUID REFERENCES journal_entries(id),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT unique_period_account_snapshot UNIQUE (period_id, account_id)
);

-- Prevent modifications to snapshots (immutable)
CREATE OR REPLACE FUNCTION prevent_bs_snapshot_modification()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'BS snapshots cannot be modified or deleted - they are immutable audit records';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_prevent_bs_snapshot_update
BEFORE UPDATE ON accounting_bs_snapshots
FOR EACH ROW
EXECUTE FUNCTION prevent_bs_snapshot_modification();

CREATE TRIGGER trigger_prevent_bs_snapshot_delete
BEFORE DELETE ON accounting_bs_snapshots
FOR EACH ROW
EXECUTE FUNCTION prevent_bs_snapshot_modification();

-- 2. Update accounting_periods to track BS closing
-- =====================================================
-- Add bs_closing_journal_id if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='accounting_periods' 
        AND column_name='bs_closing_journal_id'
    ) THEN
        ALTER TABLE accounting_periods 
        ADD COLUMN bs_closing_journal_id UUID REFERENCES journal_entries(id);
    END IF;
END $$;

-- Add constraint for BS closed validation
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'check_bs_closed'
        AND table_name = 'accounting_periods'
    ) THEN
        ALTER TABLE accounting_periods
        ADD CONSTRAINT check_bs_closed CHECK (
            (bs_closed = false) OR 
            (bs_closed = true AND bs_closed_at IS NOT NULL AND bs_closed_by IS NOT NULL)
        );
    END IF;
END $$;

-- 3. Update accounting_closing_journals for BS closing type
-- =====================================================
-- Add BS-specific summary fields
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='accounting_closing_journals' 
        AND column_name='total_assets'
    ) THEN
        ALTER TABLE accounting_closing_journals 
        ADD COLUMN total_assets NUMERIC(15,2) DEFAULT 0,
        ADD COLUMN total_liabilities NUMERIC(15,2) DEFAULT 0,
        ADD COLUMN total_equity NUMERIC(15,2) DEFAULT 0,
        ADD COLUMN carry_forward_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- 4. Indexes for Performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_bs_snapshots_period ON accounting_bs_snapshots(period_id);
CREATE INDEX IF NOT EXISTS idx_bs_snapshots_account ON accounting_bs_snapshots(account_id);
CREATE INDEX IF NOT EXISTS idx_bs_snapshots_type ON accounting_bs_snapshots(account_type);
CREATE INDEX IF NOT EXISTS idx_bs_snapshots_timestamp ON accounting_bs_snapshots(snapshot_at);
CREATE INDEX IF NOT EXISTS idx_periods_bs_closed ON accounting_periods(bs_closed);

-- 5. Helper Functions for BS Closing
-- =====================================================

-- Function to get BS account balances for a period
CREATE OR REPLACE FUNCTION get_bs_account_balances(
    p_period_id INTEGER
)
RETURNS TABLE (
    account_id INTEGER,
    account_code VARCHAR,
    account_name VARCHAR,
    account_type VARCHAR,
    ending_balance NUMERIC,
    debit_balance NUMERIC,
    credit_balance NUMERIC
) AS $$
DECLARE
    v_start_date DATE;
    v_end_date DATE;
BEGIN
    -- Get period dates
    SELECT start_date, end_date 
    INTO v_start_date, v_end_date
    FROM accounting_periods
    WHERE id = p_period_id;
    
    RETURN QUERY
    SELECT 
        coa.id,
        coa.account_code,
        coa.account_name,
        coa.account_type,
        COALESCE(SUM(jel.debit - jel.credit), 0) as ending_balance,
        COALESCE(SUM(jel.debit), 0) as debit_balance,
        COALESCE(SUM(jel.credit), 0) as credit_balance
    FROM chart_of_accounts coa
    LEFT JOIN journal_entry_lines jel ON coa.id = jel.account_id
    LEFT JOIN journal_entries je ON jel.journal_entry_id = je.id
    WHERE coa.account_type IN ('Asset', 'Liability', 'Equity')
    AND (
        je.id IS NULL OR 
        (je.entry_date <= v_end_date AND je.status = 'POSTED')
    )
    GROUP BY coa.id, coa.account_code, coa.account_name, coa.account_type
    HAVING COALESCE(SUM(jel.debit - jel.credit), 0) != 0
    ORDER BY coa.account_code;
END;
$$ LANGUAGE plpgsql;

-- Function to validate BS can be closed
CREATE OR REPLACE FUNCTION validate_bs_closing(
    p_period_id INTEGER
)
RETURNS TABLE (
    check_name VARCHAR,
    is_valid BOOLEAN,
    message TEXT,
    details JSONB
) AS $$
DECLARE
    v_pl_closed BOOLEAN;
    v_bs_closed BOOLEAN;
    v_status VARCHAR;
    v_unposted_count INTEGER;
    v_unbalanced_count INTEGER;
    v_draft_bs_count INTEGER;
    v_total_assets NUMERIC;
    v_total_liabilities NUMERIC;
    v_total_equity NUMERIC;
    v_balance_diff NUMERIC;
BEGIN
    -- Get period info
    SELECT pl_closed, bs_closed, status
    INTO v_pl_closed, v_bs_closed, v_status
    FROM accounting_periods
    WHERE id = p_period_id;
    
    -- Check 1: P&L must be closed first
    RETURN QUERY SELECT 
        'PL_CLOSED'::VARCHAR,
        v_pl_closed,
        CASE WHEN v_pl_closed THEN 'P&L has been closed' 
             ELSE 'P&L must be closed before closing BS' END,
        jsonb_build_object('pl_closed', v_pl_closed);
    
    -- Check 2: BS not already closed
    RETURN QUERY SELECT 
        'BS_NOT_CLOSED'::VARCHAR,
        NOT v_bs_closed,
        CASE WHEN NOT v_bs_closed THEN 'BS is not yet closed' 
             ELSE 'BS has already been closed for this period' END,
        jsonb_build_object('bs_closed', v_bs_closed);
    
    -- Check 3: Period status is OPEN
    RETURN QUERY SELECT 
        'PERIOD_OPEN'::VARCHAR,
        v_status = 'OPEN',
        CASE WHEN v_status = 'OPEN' THEN 'Period is open for closing' 
             ELSE 'Period must be OPEN to close BS (current: ' || v_status || ')' END,
        jsonb_build_object('status', v_status);
    
    -- Check 4: No unposted BS journals
    SELECT COUNT(*) INTO v_unposted_count
    FROM journal_entries je
    JOIN journal_entry_lines jel ON je.id = jel.journal_entry_id
    JOIN chart_of_accounts coa ON jel.account_id = coa.id
    WHERE coa.account_type IN ('Asset', 'Liability', 'Equity')
    AND je.entry_date BETWEEN (SELECT start_date FROM accounting_periods WHERE id = p_period_id)
                          AND (SELECT end_date FROM accounting_periods WHERE id = p_period_id)
    AND je.status != 'POSTED';
    
    RETURN QUERY SELECT 
        'NO_UNPOSTED_BS_JOURNALS'::VARCHAR,
        v_unposted_count = 0,
        CASE WHEN v_unposted_count = 0 THEN 'All BS journals are posted' 
             ELSE v_unposted_count || ' unposted BS journal(s) found' END,
        jsonb_build_object('unposted_count', v_unposted_count);
    
    -- Check 5: All BS journals are balanced
    SELECT COUNT(*) INTO v_unbalanced_count
    FROM (
        SELECT je.id
        FROM journal_entries je
        JOIN journal_entry_lines jel ON je.id = jel.journal_entry_id
        JOIN chart_of_accounts coa ON jel.account_id = coa.id
        WHERE coa.account_type IN ('Asset', 'Liability', 'Equity')
        AND je.entry_date BETWEEN (SELECT start_date FROM accounting_periods WHERE id = p_period_id)
                              AND (SELECT end_date FROM accounting_periods WHERE id = p_period_id)
        GROUP BY je.id
        HAVING SUM(jel.debit) != SUM(jel.credit)
    ) unbalanced;
    
    RETURN QUERY SELECT 
        'BS_JOURNALS_BALANCED'::VARCHAR,
        v_unbalanced_count = 0,
        CASE WHEN v_unbalanced_count = 0 THEN 'All BS journals are balanced' 
             ELSE v_unbalanced_count || ' unbalanced BS journal(s) found' END,
        jsonb_build_object('unbalanced_count', v_unbalanced_count);
    
    -- Check 6: No draft journals affecting BS accounts
    SELECT COUNT(DISTINCT je.id) INTO v_draft_bs_count
    FROM journal_entries je
    JOIN journal_entry_lines jel ON je.id = jel.journal_entry_id
    JOIN chart_of_accounts coa ON jel.account_id = coa.id
    WHERE coa.account_type IN ('Asset', 'Liability', 'Equity')
    AND je.entry_date BETWEEN (SELECT start_date FROM accounting_periods WHERE id = p_period_id)
                          AND (SELECT end_date FROM accounting_periods WHERE id = p_period_id)
    AND je.status = 'DRAFT';
    
    RETURN QUERY SELECT 
        'NO_DRAFT_BS_JOURNALS'::VARCHAR,
        v_draft_bs_count = 0,
        CASE WHEN v_draft_bs_count = 0 THEN 'No draft BS journals' 
             ELSE v_draft_bs_count || ' draft BS journal(s) must be posted or deleted' END,
        jsonb_build_object('draft_count', v_draft_bs_count);
    
    -- Check 7: Assets = Liabilities + Equity (Balance Sheet equation)
    SELECT 
        COALESCE(SUM(CASE WHEN coa.account_type = 'Asset' THEN jel.debit - jel.credit ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN coa.account_type = 'Liability' THEN jel.credit - jel.debit ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN coa.account_type = 'Equity' THEN jel.credit - jel.debit ELSE 0 END), 0)
    INTO v_total_assets, v_total_liabilities, v_total_equity
    FROM journal_entries je
    JOIN journal_entry_lines jel ON je.id = jel.journal_entry_id
    JOIN chart_of_accounts coa ON jel.account_id = coa.id
    WHERE coa.account_type IN ('Asset', 'Liability', 'Equity')
    AND je.entry_date <= (SELECT end_date FROM accounting_periods WHERE id = p_period_id)
    AND je.status = 'POSTED';
    
    v_balance_diff := v_total_assets - (v_total_liabilities + v_total_equity);
    
    RETURN QUERY SELECT 
        'BS_EQUATION_BALANCED'::VARCHAR,
        ABS(v_balance_diff) < 0.01, -- Allow for rounding
        CASE WHEN ABS(v_balance_diff) < 0.01 THEN 'Balance Sheet equation is balanced' 
             ELSE 'Balance Sheet not balanced: Assets - (Liabilities + Equity) = ' || v_balance_diff END,
        jsonb_build_object(
            'total_assets', v_total_assets,
            'total_liabilities', v_total_liabilities,
            'total_equity', v_total_equity,
            'difference', v_balance_diff
        );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- Grant Permissions (adjust as needed)
-- =====================================================
-- GRANT SELECT, INSERT ON accounting_bs_snapshots TO your_app_user;
-- GRANT SELECT, UPDATE ON accounting_periods TO your_app_user;
-- GRANT SELECT, INSERT ON accounting_closing_journals TO your_app_user;

-- =====================================================
-- Comments for Documentation
-- =====================================================
COMMENT ON TABLE accounting_bs_snapshots IS 'Immutable snapshots of Balance Sheet account balances at period end - used for carry-forward and audit trail';
COMMENT ON COLUMN accounting_bs_snapshots.ending_balance IS 'Net balance: debit - credit for assets, credit - debit for liabilities/equity';
COMMENT ON FUNCTION get_bs_account_balances IS 'Returns all BS accounts with non-zero balances for a given period';
COMMENT ON FUNCTION validate_bs_closing IS 'Validates all prerequisites for BS closing: P&L closed, no unposted journals, equation balanced';
