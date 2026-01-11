-- =====================================================
-- Ocean ERP - Accounting Module Sample Data
-- =====================================================

-- 1. Standard Chart of Accounts (Indonesian Company)
-- =====================================================

-- ASSETS (1000-1999)
INSERT INTO chart_of_accounts (account_code, account_name, account_type, account_subtype, description, opening_balance, current_balance) VALUES
('1000', 'Assets', 'Asset', 'Header', 'All assets', 0, 0),
('1100', 'Current Assets', 'Asset', 'Header', 'Assets convertible within one year', 0, 0),
('1110', 'Cash and Cash Equivalents', 'Asset', 'Cash', 'Liquid cash', 50000000, 50000000),
('1120', 'Petty Cash', 'Asset', 'Cash', 'Small cash for daily expenses', 2000000, 2000000),
('1200', 'Bank Accounts', 'Asset', 'Bank', 'Bank deposits', 150000000, 150000000),
('1210', 'Bank BCA - Operating', 'Asset', 'Bank', 'Main operating account', 100000000, 100000000),
('1220', 'Bank Mandiri - Payroll', 'Asset', 'Bank', 'Payroll account', 50000000, 50000000),
('1300', 'Accounts Receivable', 'Asset', 'Accounts Receivable', 'Customer invoices outstanding', 75000000, 75000000),
('1310', 'Allowance for Doubtful Accounts', 'Asset', 'Accounts Receivable', 'Estimated uncollectible receivables', -5000000, -5000000),
('1400', 'Inventory', 'Asset', 'Inventory', 'Products and materials', 120000000, 120000000),
('1410', 'Raw Materials', 'Asset', 'Inventory', 'Raw materials inventory', 50000000, 50000000),
('1420', 'Work in Progress', 'Asset', 'Inventory', 'Partially completed goods', 30000000, 30000000),
('1430', 'Finished Goods', 'Asset', 'Inventory', 'Completed products', 40000000, 40000000),
('1500', 'Fixed Assets', 'Asset', 'Fixed Asset', 'Long-term assets', 250000000, 250000000),
('1510', 'Land', 'Asset', 'Fixed Asset', 'Property land', 100000000, 100000000),
('1520', 'Buildings', 'Asset', 'Fixed Asset', 'Office buildings', 150000000, 150000000),
('1530', 'Machinery & Equipment', 'Asset', 'Fixed Asset', 'Production equipment', 80000000, 80000000),
('1540', 'Vehicles', 'Asset', 'Fixed Asset', 'Company vehicles', 50000000, 50000000),
('1550', 'Furniture & Fixtures', 'Asset', 'Fixed Asset', 'Office furniture', 20000000, 20000000),
('1560', 'Accumulated Depreciation', 'Asset', 'Fixed Asset', 'Total depreciation', -60000000, -60000000);

-- LIABILITIES (2000-2999)
INSERT INTO chart_of_accounts (account_code, account_name, account_type, account_subtype, description, opening_balance, current_balance) VALUES
('2000', 'Liabilities', 'Liability', 'Header', 'All liabilities', 0, 0),
('2100', 'Current Liabilities', 'Liability', 'Header', 'Short-term obligations', 0, 0),
('2110', 'Accounts Payable', 'Liability', 'Accounts Payable', 'Supplier invoices outstanding', 45000000, 45000000),
('2120', 'Sales Tax Payable', 'Liability', 'Tax Payable', 'VAT/PPN collected', 12000000, 12000000),
('2130', 'Income Tax Payable', 'Liability', 'Tax Payable', 'Corporate income tax', 15000000, 15000000),
('2140', 'Salaries Payable', 'Liability', 'Payable', 'Accrued salaries', 25000000, 25000000),
('2150', 'Interest Payable', 'Liability', 'Payable', 'Accrued interest', 2000000, 2000000),
('2200', 'Long-term Liabilities', 'Liability', 'Header', 'Long-term obligations', 0, 0),
('2210', 'Bank Loans', 'Liability', 'Long-term Debt', 'Business loans', 100000000, 100000000),
('2220', 'Mortgage Payable', 'Liability', 'Long-term Debt', 'Property mortgage', 150000000, 150000000);

-- EQUITY (3000-3999)
INSERT INTO chart_of_accounts (account_code, account_name, account_type, account_subtype, description, opening_balance, current_balance) VALUES
('3000', 'Equity', 'Equity', 'Header', 'Owner equity', 0, 0),
('3100', 'Share Capital', 'Equity', 'Capital', 'Issued share capital', 500000000, 500000000),
('3200', 'Retained Earnings', 'Equity', 'Retained Earnings', 'Accumulated profits', 150000000, 150000000),
('3300', 'Current Year Earnings', 'Equity', 'Retained Earnings', 'This year profit/loss', 0, 0);

-- REVENUE (4000-4999)
INSERT INTO chart_of_accounts (account_code, account_name, account_type, account_subtype, description, opening_balance, current_balance) VALUES
('4000', 'Revenue', 'Revenue', 'Header', 'All income', 0, 0),
('4100', 'Sales Revenue', 'Revenue', 'Sales', 'Product sales', 0, 0),
('4110', 'Product Sales', 'Revenue', 'Sales', 'Finished product sales', 0, 0),
('4120', 'Service Revenue', 'Revenue', 'Sales', 'Service income', 0, 0),
('4200', 'Other Income', 'Revenue', 'Other Income', 'Non-operating income', 0, 0),
('4210', 'Interest Income', 'Revenue', 'Other Income', 'Bank interest', 0, 0),
('4220', 'Gain on Asset Sale', 'Revenue', 'Other Income', 'Profit from asset sales', 0, 0);

-- EXPENSES (5000-5999)
INSERT INTO chart_of_accounts (account_code, account_name, account_type, account_subtype, description, opening_balance, current_balance) VALUES
('5000', 'Expenses', 'Expense', 'Header', 'All expenses', 0, 0),
('5100', 'Cost of Goods Sold', 'Expense', 'COGS', 'Direct product costs', 0, 0),
('5110', 'Raw Materials', 'Expense', 'COGS', 'Materials used', 0, 0),
('5120', 'Direct Labor', 'Expense', 'COGS', 'Production labor', 0, 0),
('5130', 'Manufacturing Overhead', 'Expense', 'COGS', 'Production overhead', 0, 0),
('5200', 'Operating Expenses', 'Expense', 'Operating', 'Business operations', 0, 0),
('5210', 'Salaries & Wages', 'Expense', 'Payroll', 'Employee salaries', 0, 0),
('5220', 'Rent Expense', 'Expense', 'Operating', 'Office rent', 0, 0),
('5230', 'Utilities', 'Expense', 'Operating', 'Electricity, water, internet', 0, 0),
('5240', 'Office Supplies', 'Expense', 'Operating', 'Stationery and supplies', 0, 0),
('5250', 'Insurance', 'Expense', 'Operating', 'Business insurance', 0, 0),
('5260', 'Marketing & Advertising', 'Expense', 'Marketing', 'Promotional expenses', 0, 0),
('5270', 'Travel & Entertainment', 'Expense', 'Operating', 'Business travel', 0, 0),
('5280', 'Professional Fees', 'Expense', 'Operating', 'Legal and consulting', 0, 0),
('5290', 'Depreciation Expense', 'Expense', 'Operating', 'Asset depreciation', 0, 0),
('5300', 'Financial Expenses', 'Expense', 'Financial', 'Financing costs', 0, 0),
('5310', 'Interest Expense', 'Expense', 'Financial', 'Loan interest', 0, 0),
('5320', 'Bank Charges', 'Expense', 'Financial', 'Banking fees', 0, 0);

-- 2. Sample Journal Entries
-- =====================================================

-- Initial capital investment
INSERT INTO journal_entries (entry_number, entry_date, entry_type, description, status, created_by) VALUES
('JE-2025-001', '2025-01-01', 'General', 'Initial capital investment', 'Posted', 1);

INSERT INTO journal_entry_lines (journal_entry_id, line_number, account_id, description, debit_amount, credit_amount) VALUES
(1, 1, (SELECT id FROM chart_of_accounts WHERE account_code = '1210'), 'Cash received from shareholders', 500000000, 0),
(1, 2, (SELECT id FROM chart_of_accounts WHERE account_code = '3100'), 'Share capital issued', 0, 500000000);

-- Office rent payment for January
INSERT INTO journal_entries (entry_number, entry_date, entry_type, description, status, created_by) VALUES
('JE-2025-002', '2025-01-05', 'Payment', 'Office rent - January 2025', 'Posted', 1);

INSERT INTO journal_entry_lines (journal_entry_id, line_number, account_id, description, debit_amount, credit_amount) VALUES
(2, 1, (SELECT id FROM chart_of_accounts WHERE account_code = '5220'), 'Rent expense for January', 15000000, 0),
(2, 2, (SELECT id FROM chart_of_accounts WHERE account_code = '1210'), 'Payment from BCA account', 0, 15000000);

-- 3. Sample Accounts Payable (Bills)
-- =====================================================

INSERT INTO accounts_payable (bill_number, vendor_name, bill_date, due_date, payment_terms, total_amount, balance_due, description, status) VALUES
('BILL-2025-001', 'PT Supplier Indonesia', '2025-01-10', '2025-02-10', 'Net 30', 25000000, 25000000, 'Raw materials purchase', 'Unpaid'),
('BILL-2025-002', 'PT Electric Power', '2025-01-15', '2025-02-15', 'Net 30', 5000000, 5000000, 'Electricity bill - January', 'Unpaid'),
('BILL-2025-003', 'PT Office Supplies', '2025-01-20', '2025-02-05', 'Net 15', 3000000, 1500000, 'Office supplies and stationery', 'Partially Paid');

-- Payment for partial bill
INSERT INTO ap_payments (payment_number, bill_id, payment_date, payment_method, payment_amount, reference_number) VALUES
('PAY-AP-001', 3, '2025-01-25', 'Bank Transfer', 1500000, 'TRF-20250125-001');

-- 4. Sample Accounts Receivable (Invoices)
-- =====================================================

INSERT INTO accounts_receivable (invoice_number, customer_name, invoice_date, due_date, payment_terms, total_amount, balance_due, description, status) VALUES
('INV-2025-001', 'PT Client Sejahtera', '2025-01-12', '2025-02-12', 'Net 30', 45000000, 45000000, 'ERP Implementation Services', 'Unpaid'),
('INV-2025-002', 'CV Maju Bersama', '2025-01-18', '2025-02-18', 'Net 30', 30000000, 15000000, 'Software License', 'Partially Paid'),
('INV-2025-003', 'PT Teknologi Modern', '2025-01-25', '2025-02-10', 'Net 15', 20000000, 0, 'Consulting Services', 'Paid');

-- Payments received
INSERT INTO ar_payments (payment_number, invoice_id, payment_date, payment_method, payment_amount, reference_number) VALUES
('PAY-AR-001', 2, '2025-01-22', 'Bank Transfer', 15000000, 'TRF-20250122-001'),
('PAY-AR-002', 3, '2025-01-28', 'Bank Transfer', 20000000, 'TRF-20250128-001');

-- 5. Sample Budget
-- =====================================================

INSERT INTO budgets (budget_name, fiscal_year, period_type, start_date, end_date, status, description, created_by) VALUES
('2025 Annual Budget', 2025, 'Monthly', '2025-01-01', '2025-12-31', 'Active', 'Operating budget for fiscal year 2025', 1);

-- Budget lines for January 2025
INSERT INTO budget_lines (budget_id, account_id, period_name, period_start, period_end, budgeted_amount, actual_amount) VALUES
-- Revenue budgets
(1, (SELECT id FROM chart_of_accounts WHERE account_code = '4110'), 'Jan 2025', '2025-01-01', '2025-01-31', 100000000, 0),
(1, (SELECT id FROM chart_of_accounts WHERE account_code = '4120'), 'Jan 2025', '2025-01-01', '2025-01-31', 50000000, 0),
-- Expense budgets
(1, (SELECT id FROM chart_of_accounts WHERE account_code = '5210'), 'Jan 2025', '2025-01-01', '2025-01-31', 40000000, 0),
(1, (SELECT id FROM chart_of_accounts WHERE account_code = '5220'), 'Jan 2025', '2025-01-01', '2025-01-31', 15000000, 15000000),
(1, (SELECT id FROM chart_of_accounts WHERE account_code = '5230'), 'Jan 2025', '2025-01-01', '2025-01-31', 8000000, 0),
(1, (SELECT id FROM chart_of_accounts WHERE account_code = '5260'), 'Jan 2025', '2025-01-01', '2025-01-31', 12000000, 0);

-- Update variance in budget lines
UPDATE budget_lines 
SET 
    variance_amount = actual_amount - budgeted_amount,
    variance_percentage = CASE 
        WHEN budgeted_amount != 0 THEN ((actual_amount - budgeted_amount) / budgeted_amount * 100)
        ELSE 0 
    END;

-- =====================================================
-- Summary Statistics
-- =====================================================

SELECT 'Chart of Accounts created: ' || COUNT(*) as info FROM chart_of_accounts;
SELECT 'Journal Entries created: ' || COUNT(*) as info FROM journal_entries;
SELECT 'AP Bills created: ' || COUNT(*) as info FROM accounts_payable;
SELECT 'AR Invoices created: ' || COUNT(*) as info FROM accounts_receivable;
SELECT 'Budgets created: ' || COUNT(*) as info FROM budgets;
