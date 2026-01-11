-- =====================================================
-- Ocean ERP - Accounting Module Database Schema
-- =====================================================

-- 1. Chart of Accounts
-- =====================================================
CREATE TABLE IF NOT EXISTS chart_of_accounts (
    id SERIAL PRIMARY KEY,
    account_code VARCHAR(50) UNIQUE NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    account_type VARCHAR(50) NOT NULL, -- Asset, Liability, Equity, Revenue, Expense
    account_subtype VARCHAR(100), -- Cash, Bank, Accounts Receivable, Fixed Assets, etc.
    parent_account_id INTEGER REFERENCES chart_of_accounts(id),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    currency VARCHAR(3) DEFAULT 'IDR',
    opening_balance NUMERIC(15,2) DEFAULT 0,
    current_balance NUMERIC(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Journal Entries (Header)
-- =====================================================
CREATE TABLE IF NOT EXISTS journal_entries (
    id SERIAL PRIMARY KEY,
    entry_number VARCHAR(50) UNIQUE NOT NULL,
    entry_date DATE NOT NULL,
    entry_type VARCHAR(50) NOT NULL, -- General, Sales, Purchase, Payment, Receipt, Adjustment
    reference_number VARCHAR(100),
    description TEXT,
    status VARCHAR(50) DEFAULT 'Draft', -- Draft, Posted, Reversed
    total_debit NUMERIC(15,2) DEFAULT 0,
    total_credit NUMERIC(15,2) DEFAULT 0,
    created_by INTEGER REFERENCES users(id),
    posted_at TIMESTAMP,
    posted_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Journal Entry Lines (Detail)
-- =====================================================
CREATE TABLE IF NOT EXISTS journal_entry_lines (
    id SERIAL PRIMARY KEY,
    journal_entry_id INTEGER NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
    line_number INTEGER NOT NULL,
    account_id INTEGER NOT NULL REFERENCES chart_of_accounts(id),
    description TEXT,
    debit_amount NUMERIC(15,2) DEFAULT 0,
    credit_amount NUMERIC(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_debit_or_credit CHECK (
        (debit_amount > 0 AND credit_amount = 0) OR 
        (credit_amount > 0 AND debit_amount = 0)
    )
);

-- 4. Accounts Payable (Bills)
-- =====================================================
CREATE TABLE IF NOT EXISTS accounts_payable (
    id SERIAL PRIMARY KEY,
    bill_number VARCHAR(50) UNIQUE NOT NULL,
    vendor_id INTEGER REFERENCES users(id), -- Assuming vendors are in users table
    vendor_name VARCHAR(255) NOT NULL,
    bill_date DATE NOT NULL,
    due_date DATE NOT NULL,
    payment_terms VARCHAR(100),
    total_amount NUMERIC(15,2) NOT NULL,
    paid_amount NUMERIC(15,2) DEFAULT 0,
    balance_due NUMERIC(15,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Unpaid', -- Unpaid, Partially Paid, Paid, Overdue
    description TEXT,
    journal_entry_id INTEGER REFERENCES journal_entries(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. AP Payment History
-- =====================================================
CREATE TABLE IF NOT EXISTS ap_payments (
    id SERIAL PRIMARY KEY,
    payment_number VARCHAR(50) UNIQUE NOT NULL,
    bill_id INTEGER NOT NULL REFERENCES accounts_payable(id),
    payment_date DATE NOT NULL,
    payment_method VARCHAR(50), -- Cash, Check, Bank Transfer, Credit Card
    payment_amount NUMERIC(15,2) NOT NULL,
    reference_number VARCHAR(100),
    notes TEXT,
    journal_entry_id INTEGER REFERENCES journal_entries(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Accounts Receivable (Invoices)
-- =====================================================
CREATE TABLE IF NOT EXISTS accounts_receivable (
    id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INTEGER REFERENCES customers(id),
    customer_name VARCHAR(255) NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    payment_terms VARCHAR(100),
    total_amount NUMERIC(15,2) NOT NULL,
    paid_amount NUMERIC(15,2) DEFAULT 0,
    balance_due NUMERIC(15,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Unpaid', -- Unpaid, Partially Paid, Paid, Overdue
    description TEXT,
    journal_entry_id INTEGER REFERENCES journal_entries(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. AR Payment History
-- =====================================================
CREATE TABLE IF NOT EXISTS ar_payments (
    id SERIAL PRIMARY KEY,
    payment_number VARCHAR(50) UNIQUE NOT NULL,
    invoice_id INTEGER NOT NULL REFERENCES accounts_receivable(id),
    payment_date DATE NOT NULL,
    payment_method VARCHAR(50), -- Cash, Check, Bank Transfer, Credit Card
    payment_amount NUMERIC(15,2) NOT NULL,
    reference_number VARCHAR(100),
    notes TEXT,
    journal_entry_id INTEGER REFERENCES journal_entries(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Budgets
-- =====================================================
CREATE TABLE IF NOT EXISTS budgets (
    id SERIAL PRIMARY KEY,
    budget_name VARCHAR(255) NOT NULL,
    fiscal_year INTEGER NOT NULL,
    period_type VARCHAR(50) NOT NULL, -- Monthly, Quarterly, Yearly
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Draft', -- Draft, Active, Closed
    description TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Budget Lines
-- =====================================================
CREATE TABLE IF NOT EXISTS budget_lines (
    id SERIAL PRIMARY KEY,
    budget_id INTEGER NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
    account_id INTEGER NOT NULL REFERENCES chart_of_accounts(id),
    period_name VARCHAR(50) NOT NULL, -- Jan 2025, Q1 2025, FY 2025
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    budgeted_amount NUMERIC(15,2) NOT NULL,
    actual_amount NUMERIC(15,2) DEFAULT 0,
    variance_amount NUMERIC(15,2) DEFAULT 0,
    variance_percentage NUMERIC(5,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Indexes for Performance
-- =====================================================
CREATE INDEX idx_coa_type ON chart_of_accounts(account_type);
CREATE INDEX idx_coa_active ON chart_of_accounts(is_active);
CREATE INDEX idx_journal_date ON journal_entries(entry_date);
CREATE INDEX idx_journal_status ON journal_entries(status);
CREATE INDEX idx_journal_type ON journal_entries(entry_type);
CREATE INDEX idx_journal_lines_account ON journal_entry_lines(account_id);
CREATE INDEX idx_journal_lines_entry ON journal_entry_lines(journal_entry_id);
CREATE INDEX idx_ap_status ON accounts_payable(status);
CREATE INDEX idx_ap_due_date ON accounts_payable(due_date);
CREATE INDEX idx_ar_status ON accounts_receivable(status);
CREATE INDEX idx_ar_due_date ON accounts_receivable(due_date);
CREATE INDEX idx_budget_lines_account ON budget_lines(account_id);
CREATE INDEX idx_budget_lines_budget ON budget_lines(budget_id);

-- =====================================================
-- Functions and Triggers
-- =====================================================

-- Function to update journal entry totals
CREATE OR REPLACE FUNCTION update_journal_entry_totals()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE journal_entries
    SET 
        total_debit = (SELECT COALESCE(SUM(debit_amount), 0) FROM journal_entry_lines WHERE journal_entry_id = NEW.journal_entry_id),
        total_credit = (SELECT COALESCE(SUM(credit_amount), 0) FROM journal_entry_lines WHERE journal_entry_id = NEW.journal_entry_id),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.journal_entry_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for journal entry lines
CREATE TRIGGER trigger_update_journal_totals
AFTER INSERT OR UPDATE OR DELETE ON journal_entry_lines
FOR EACH ROW
EXECUTE FUNCTION update_journal_entry_totals();

-- Function to update account balances when journal is posted
CREATE OR REPLACE FUNCTION update_account_balances()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'Posted' AND (OLD.status IS NULL OR OLD.status != 'Posted') THEN
        -- Update all affected accounts
        UPDATE chart_of_accounts coa
        SET current_balance = coa.opening_balance + (
            SELECT COALESCE(SUM(
                CASE 
                    WHEN coa.account_type IN ('Asset', 'Expense') THEN jel.debit_amount - jel.credit_amount
                    ELSE jel.credit_amount - jel.debit_amount
                END
            ), 0)
            FROM journal_entry_lines jel
            JOIN journal_entries je ON jel.journal_entry_id = je.id
            WHERE jel.account_id = coa.id
            AND je.status = 'Posted'
        ),
        updated_at = CURRENT_TIMESTAMP
        WHERE coa.id IN (
            SELECT DISTINCT account_id 
            FROM journal_entry_lines 
            WHERE journal_entry_id = NEW.id
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update balances when journal is posted
CREATE TRIGGER trigger_update_account_balances
AFTER UPDATE ON journal_entries
FOR EACH ROW
EXECUTE FUNCTION update_account_balances();

-- Function to update AP balance
CREATE OR REPLACE FUNCTION update_ap_balance()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE accounts_payable
    SET 
        paid_amount = (SELECT COALESCE(SUM(payment_amount), 0) FROM ap_payments WHERE bill_id = NEW.bill_id),
        balance_due = total_amount - (SELECT COALESCE(SUM(payment_amount), 0) FROM ap_payments WHERE bill_id = NEW.bill_id),
        status = CASE 
            WHEN (SELECT COALESCE(SUM(payment_amount), 0) FROM ap_payments WHERE bill_id = NEW.bill_id) >= total_amount THEN 'Paid'
            WHEN (SELECT COALESCE(SUM(payment_amount), 0) FROM ap_payments WHERE bill_id = NEW.bill_id) > 0 THEN 'Partially Paid'
            ELSE 'Unpaid'
        END,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.bill_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_ap_balance
AFTER INSERT ON ap_payments
FOR EACH ROW
EXECUTE FUNCTION update_ap_balance();

-- Function to update AR balance
CREATE OR REPLACE FUNCTION update_ar_balance()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE accounts_receivable
    SET 
        paid_amount = (SELECT COALESCE(SUM(payment_amount), 0) FROM ar_payments WHERE invoice_id = NEW.invoice_id),
        balance_due = total_amount - (SELECT COALESCE(SUM(payment_amount), 0) FROM ar_payments WHERE invoice_id = NEW.invoice_id),
        status = CASE 
            WHEN (SELECT COALESCE(SUM(payment_amount), 0) FROM ar_payments WHERE invoice_id = NEW.invoice_id) >= total_amount THEN 'Paid'
            WHEN (SELECT COALESCE(SUM(payment_amount), 0) FROM ar_payments WHERE invoice_id = NEW.invoice_id) > 0 THEN 'Partially Paid'
            ELSE 'Unpaid'
        END,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.invoice_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_ar_balance
AFTER INSERT ON ar_payments
FOR EACH ROW
EXECUTE FUNCTION update_ar_balance();

COMMENT ON TABLE chart_of_accounts IS 'Chart of accounts for the accounting system';
COMMENT ON TABLE journal_entries IS 'Journal entry headers';
COMMENT ON TABLE journal_entry_lines IS 'Journal entry line items';
COMMENT ON TABLE accounts_payable IS 'Bills and vendor invoices';
COMMENT ON TABLE accounts_receivable IS 'Customer invoices';
COMMENT ON TABLE budgets IS 'Budget headers';
COMMENT ON TABLE budget_lines IS 'Budget line items by period and account';
