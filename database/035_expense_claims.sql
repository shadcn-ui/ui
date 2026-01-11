-- Create expense_claims table for employee expense management

CREATE TABLE IF NOT EXISTS expense_claims (
    id SERIAL PRIMARY KEY,
    claim_number VARCHAR(50) UNIQUE NOT NULL,
    employee_id INTEGER NOT NULL REFERENCES hrm_employees(employee_id),
    department_id INTEGER REFERENCES hrm_departments(department_id),
    
    claim_date DATE NOT NULL DEFAULT CURRENT_DATE,
    submission_date TIMESTAMP DEFAULT NOW(),
    
    total_amount NUMERIC(18, 2) NOT NULL DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'IDR',
    
    status VARCHAR(30) DEFAULT 'Draft',
    -- Status: Draft, Submitted, Under Review, Approved, Rejected, Paid
    
    purpose TEXT,
    notes TEXT,
    
    -- Approval tracking
    reviewed_by INTEGER REFERENCES hrm_employees(employee_id),
    reviewed_date TIMESTAMP,
    approved_by INTEGER REFERENCES hrm_employees(employee_id),
    approved_date TIMESTAMP,
    approval_notes TEXT,
    
    -- Payment tracking
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    paid_date DATE,
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS expense_claim_items (
    id SERIAL PRIMARY KEY,
    expense_claim_id INTEGER NOT NULL REFERENCES expense_claims(id) ON DELETE CASCADE,
    
    expense_date DATE NOT NULL,
    category VARCHAR(100) NOT NULL,
    -- Categories: Travel, Meals, Accommodation, Transportation, Office Supplies, Client Entertainment, etc.
    
    description TEXT NOT NULL,
    amount NUMERIC(18, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'IDR',
    
    receipt_number VARCHAR(100),
    receipt_attached BOOLEAN DEFAULT FALSE,
    receipt_url TEXT,
    
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_expense_claims_employee ON expense_claims(employee_id);
CREATE INDEX IF NOT EXISTS idx_expense_claims_status ON expense_claims(status);
CREATE INDEX IF NOT EXISTS idx_expense_claims_claim_date ON expense_claims(claim_date);
CREATE INDEX IF NOT EXISTS idx_expense_claims_number ON expense_claims(claim_number);
CREATE INDEX IF NOT EXISTS idx_expense_claim_items_claim ON expense_claim_items(expense_claim_id);

-- Trigger for updated_at
CREATE TRIGGER trigger_expense_claims_updated_at 
BEFORE UPDATE ON expense_claims 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_expense_claim_items_updated_at 
BEFORE UPDATE ON expense_claim_items 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate claim number
CREATE OR REPLACE FUNCTION generate_expense_claim_number()
RETURNS VARCHAR AS $$
DECLARE
    next_num INTEGER;
    claim_num VARCHAR;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(claim_number FROM 8) AS INTEGER)), 0) + 1 
    INTO next_num
    FROM expense_claims
    WHERE claim_number ~ '^EXP-\d{4}$';
    
    claim_num := 'EXP-' || LPAD(next_num::TEXT, 4, '0');
    RETURN claim_num;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE expense_claims IS 'Employee expense claim management';
COMMENT ON TABLE expense_claim_items IS 'Line items for expense claims';
