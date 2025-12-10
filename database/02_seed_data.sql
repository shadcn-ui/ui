-- Ocean ERP Database Seed Data
-- Initial data for Ocean ERP system

-- =====================================================
-- LEAD SOURCES SEED DATA
-- =====================================================

INSERT INTO lead_sources (id, name, description) VALUES
    (uuid_generate_v4(), 'Website', 'Leads from website contact forms and inquiries'),
    (uuid_generate_v4(), 'Referral', 'Leads from customer referrals and word of mouth'),
    (uuid_generate_v4(), 'LinkedIn', 'Leads from LinkedIn outreach and connections'),
    (uuid_generate_v4(), 'Cold Call', 'Leads from cold calling campaigns'),
    (uuid_generate_v4(), 'Email Campaign', 'Leads from email marketing campaigns'),
    (uuid_generate_v4(), 'Trade Show', 'Leads from trade shows and industry events'),
    (uuid_generate_v4(), 'Social Media', 'Leads from social media platforms'),
    (uuid_generate_v4(), 'Advertisement', 'Leads from online and offline advertising'),
    (uuid_generate_v4(), 'Other', 'Other lead sources not categorized above');

-- =====================================================
-- LEAD STATUSES SEED DATA
-- =====================================================

INSERT INTO lead_statuses (id, name, description, sort_order, color) VALUES
    (uuid_generate_v4(), 'New', 'Newly created lead, not yet contacted', 1, '#3B82F6'),
    (uuid_generate_v4(), 'Contacted', 'Initial contact made with the lead', 2, '#8B5CF6'),
    (uuid_generate_v4(), 'Qualified', 'Lead has been qualified as potential customer', 3, '#06B6D4'),
    (uuid_generate_v4(), 'Opportunity', 'Lead converted to sales opportunity', 4, '#10B981'),
    (uuid_generate_v4(), 'Won', 'Lead successfully converted to customer', 5, '#22C55E'),
    (uuid_generate_v4(), 'Lost', 'Lead was not converted, opportunity lost', 6, '#EF4444');

-- =====================================================
-- USERS SEED DATA
-- =====================================================

INSERT INTO users (id, email, first_name, last_name, phone, role, department, password_hash) VALUES
    (uuid_generate_v4(), 'admin@ocean-erp.com', 'Admin', 'User', '+1-555-0001', 'admin', 'IT', '$2a$10$hash_placeholder_admin'),
    (uuid_generate_v4(), 'sarah.johnson@ocean-erp.com', 'Sarah', 'Johnson', '+1-555-0101', 'sales_manager', 'Sales', '$2a$10$hash_placeholder_sarah'),
    (uuid_generate_v4(), 'mike.wilson@ocean-erp.com', 'Mike', 'Wilson', '+1-555-0102', 'sales_rep', 'Sales', '$2a$10$hash_placeholder_mike'),
    (uuid_generate_v4(), 'alex.chen@ocean-erp.com', 'Alex', 'Chen', '+1-555-0103', 'sales_rep', 'Sales', '$2a$10$hash_placeholder_alex'),
    (uuid_generate_v4(), 'lisa.taylor@ocean-erp.com', 'Lisa', 'Taylor', '+1-555-0104', 'sales_rep', 'Sales', '$2a$10$hash_placeholder_lisa'),
    (uuid_generate_v4(), 'david.brown@ocean-erp.com', 'David', 'Brown', '+1-555-0105', 'sales_rep', 'Sales', '$2a$10$hash_placeholder_david'),
    (uuid_generate_v4(), 'emily.davis@ocean-erp.com', 'Emily', 'Davis', '+1-555-0201', 'product_manager', 'Product', '$2a$10$hash_placeholder_emily'),
    (uuid_generate_v4(), 'john.smith@ocean-erp.com', 'John', 'Smith', '+1-555-0301', 'operations_manager', 'Operations', '$2a$10$hash_placeholder_john'),
    (uuid_generate_v4(), 'maria.garcia@ocean-erp.com', 'Maria', 'Garcia', '+1-555-0401', 'accountant', 'Accounting', '$2a$10$hash_placeholder_maria'),
    (uuid_generate_v4(), 'robert.lee@ocean-erp.com', 'Robert', 'Lee', '+1-555-0501', 'hr_manager', 'Human Resources', '$2a$10$hash_placeholder_robert');

-- =====================================================
-- DEPARTMENTS SEED DATA
-- =====================================================

INSERT INTO departments (id, name, description, budget) VALUES
    (uuid_generate_v4(), 'Sales', 'Sales and business development department', 500000.00),
    (uuid_generate_v4(), 'Product', 'Product development and management', 750000.00),
    (uuid_generate_v4(), 'Operations', 'Operations and supply chain management', 400000.00),
    (uuid_generate_v4(), 'Accounting', 'Finance and accounting department', 300000.00),
    (uuid_generate_v4(), 'Human Resources', 'HR and employee management', 250000.00),
    (uuid_generate_v4(), 'IT', 'Information technology and systems', 600000.00),
    (uuid_generate_v4(), 'Marketing', 'Marketing and communications', 400000.00);

-- =====================================================
-- PRODUCT CATEGORIES SEED DATA
-- =====================================================

INSERT INTO product_categories (id, name, description) VALUES
    (uuid_generate_v4(), 'Software', 'Software products and licenses'),
    (uuid_generate_v4(), 'Hardware', 'Physical hardware products'),
    (uuid_generate_v4(), 'Services', 'Professional services and consulting'),
    (uuid_generate_v4(), 'Training', 'Training and educational services'),
    (uuid_generate_v4(), 'Support', 'Technical support and maintenance');

-- =====================================================
-- INVENTORY LOCATIONS SEED DATA
-- =====================================================

INSERT INTO inventory_locations (id, name, address, city, state, zip_code, country) VALUES
    (uuid_generate_v4(), 'Main Warehouse', '123 Industrial Blvd', 'Los Angeles', 'CA', '90210', 'US'),
    (uuid_generate_v4(), 'East Coast Distribution', '456 Commerce St', 'New York', 'NY', '10001', 'US'),
    (uuid_generate_v4(), 'Retail Store - Downtown', '789 Main St', 'San Francisco', 'CA', '94102', 'US');

-- =====================================================
-- ACCOUNTS (CHART OF ACCOUNTS) SEED DATA
-- =====================================================

-- Assets
INSERT INTO accounts (id, account_number, account_name, account_type, description) VALUES
    (uuid_generate_v4(), '1000', 'Assets', 'asset', 'Main Assets Account'),
    (uuid_generate_v4(), '1100', 'Current Assets', 'asset', 'Current Assets'),
    (uuid_generate_v4(), '1110', 'Cash and Cash Equivalents', 'asset', 'Cash accounts'),
    (uuid_generate_v4(), '1120', 'Accounts Receivable', 'asset', 'Money owed by customers'),
    (uuid_generate_v4(), '1130', 'Inventory', 'asset', 'Inventory assets'),
    (uuid_generate_v4(), '1200', 'Fixed Assets', 'asset', 'Fixed Assets'),
    (uuid_generate_v4(), '1210', 'Equipment', 'asset', 'Office and production equipment'),
    (uuid_generate_v4(), '1220', 'Furniture', 'asset', 'Office furniture'),
    (uuid_generate_v4(), '1230', 'Vehicles', 'asset', 'Company vehicles');

-- Liabilities
INSERT INTO accounts (id, account_number, account_name, account_type, description) VALUES
    (uuid_generate_v4(), '2000', 'Liabilities', 'liability', 'Main Liabilities Account'),
    (uuid_generate_v4(), '2100', 'Current Liabilities', 'liability', 'Current Liabilities'),
    (uuid_generate_v4(), '2110', 'Accounts Payable', 'liability', 'Money owed to suppliers'),
    (uuid_generate_v4(), '2120', 'Accrued Expenses', 'liability', 'Accrued expenses'),
    (uuid_generate_v4(), '2130', 'Short Term Loans', 'liability', 'Short term debt'),
    (uuid_generate_v4(), '2200', 'Long Term Liabilities', 'liability', 'Long term debt and obligations');

-- Equity
INSERT INTO accounts (id, account_number, account_name, account_type, description) VALUES
    (uuid_generate_v4(), '3000', 'Equity', 'equity', 'Owner''s Equity'),
    (uuid_generate_v4(), '3100', 'Retained Earnings', 'equity', 'Accumulated earnings'),
    (uuid_generate_v4(), '3200', 'Owner''s Capital', 'equity', 'Owner''s invested capital');

-- Revenue
INSERT INTO accounts (id, account_number, account_name, account_type, description) VALUES
    (uuid_generate_v4(), '4000', 'Revenue', 'revenue', 'Main Revenue Account'),
    (uuid_generate_v4(), '4100', 'Sales Revenue', 'revenue', 'Revenue from sales'),
    (uuid_generate_v4(), '4200', 'Service Revenue', 'revenue', 'Revenue from services'),
    (uuid_generate_v4(), '4300', 'Other Revenue', 'revenue', 'Other income sources');

-- Expenses
INSERT INTO accounts (id, account_number, account_name, account_type, description) VALUES
    (uuid_generate_v4(), '5000', 'Expenses', 'expense', 'Main Expenses Account'),
    (uuid_generate_v4(), '5100', 'Cost of Goods Sold', 'expense', 'Direct costs of products'),
    (uuid_generate_v4(), '5200', 'Operating Expenses', 'expense', 'Operating expenses'),
    (uuid_generate_v4(), '5210', 'Salaries and Wages', 'expense', 'Employee compensation'),
    (uuid_generate_v4(), '5220', 'Rent', 'expense', 'Office and warehouse rent'),
    (uuid_generate_v4(), '5230', 'Utilities', 'expense', 'Electricity, water, internet'),
    (uuid_generate_v4(), '5240', 'Office Supplies', 'expense', 'Office supplies and materials'),
    (uuid_generate_v4(), '5250', 'Marketing', 'expense', 'Marketing and advertising'),
    (uuid_generate_v4(), '5260', 'Travel', 'expense', 'Business travel expenses'),
    (uuid_generate_v4(), '5270', 'Professional Services', 'expense', 'Legal, accounting, consulting');

-- =====================================================
-- SAMPLE LEADS DATA
-- =====================================================

-- Get IDs for foreign key references
WITH source_refs AS (
    SELECT 
        (SELECT id FROM lead_sources WHERE name = 'Website') as website_id,
        (SELECT id FROM lead_sources WHERE name = 'Referral') as referral_id,
        (SELECT id FROM lead_sources WHERE name = 'LinkedIn') as linkedin_id,
        (SELECT id FROM lead_sources WHERE name = 'Cold Call') as coldcall_id,
        (SELECT id FROM lead_sources WHERE name = 'Trade Show') as tradeshow_id
),
status_refs AS (
    SELECT 
        (SELECT id FROM lead_statuses WHERE name = 'New') as new_id,
        (SELECT id FROM lead_statuses WHERE name = 'Contacted') as contacted_id,
        (SELECT id FROM lead_statuses WHERE name = 'Qualified') as qualified_id,
        (SELECT id FROM lead_statuses WHERE name = 'Opportunity') as opportunity_id,
        (SELECT id FROM lead_statuses WHERE name = 'Won') as won_id
),
user_refs AS (
    SELECT 
        (SELECT id FROM users WHERE email = 'sarah.johnson@ocean-erp.com') as sarah_id,
        (SELECT id FROM users WHERE email = 'mike.wilson@ocean-erp.com') as mike_id,
        (SELECT id FROM users WHERE email = 'alex.chen@ocean-erp.com') as alex_id,
        (SELECT id FROM users WHERE email = 'lisa.taylor@ocean-erp.com') as lisa_id,
        (SELECT id FROM users WHERE email = 'david.brown@ocean-erp.com') as david_id
)
INSERT INTO leads (
    first_name, last_name, email, phone, company, job_title, website,
    address, city, state, zip_code, country,
    source_id, status_id, assigned_to, estimated_value, notes, last_contacted
)
SELECT * FROM (
    VALUES
        ('John', 'Smith', 'john.smith@techcorp.com', '+1-555-1001', 'TechCorp Solutions', 'CTO', 'https://techcorp.com',
         '123 Tech Ave', 'San Francisco', 'CA', '94105', 'US',
         (SELECT website_id FROM source_refs), (SELECT new_id FROM status_refs), (SELECT sarah_id FROM user_refs), 
         25000.00, 'Interested in our enterprise software solution', '2024-10-20'::timestamp),
        
        ('Emily', 'Johnson', 'emily.j@innovate.co', '+1-555-1002', 'Innovate Inc', 'VP of Operations', 'https://innovate.co',
         '456 Innovation Blvd', 'Austin', 'TX', '73301', 'US',
         (SELECT linkedin_id FROM source_refs), (SELECT contacted_id FROM status_refs), (SELECT mike_id FROM user_refs),
         45000.00, 'Looking for supply chain optimization tools', '2024-10-18'::timestamp),
        
        ('Michael', 'Davis', 'mdavis@startupxyz.com', '+1-555-1003', 'StartupXYZ', 'Founder', 'https://startupxyz.com',
         '789 Startup St', 'Seattle', 'WA', '98101', 'US',
         (SELECT referral_id FROM source_refs), (SELECT qualified_id FROM status_refs), (SELECT alex_id FROM user_refs),
         15000.00, 'Referred by existing customer, very interested', '2024-10-15'::timestamp),
        
        ('Sarah', 'Wilson', 'sarah.wilson@retailplus.com', '+1-555-1004', 'RetailPlus', 'IT Director', 'https://retailplus.com',
         '321 Commerce Way', 'Chicago', 'IL', '60601', 'US',
         (SELECT coldcall_id FROM source_refs), (SELECT opportunity_id FROM status_refs), (SELECT lisa_id FROM user_refs),
         75000.00, 'Ready to move forward with implementation', '2024-10-22'::timestamp),
        
        ('Robert', 'Brown', 'rbrown@manufacturing.net', '+1-555-1005', 'Manufacturing Solutions', 'Plant Manager', 'https://manufacturing.net',
         '654 Industrial Pkwy', 'Detroit', 'MI', '48201', 'US',
         (SELECT tradeshow_id FROM source_refs), (SELECT won_id FROM status_refs), (SELECT david_id FROM user_refs),
         120000.00, 'Contract signed, implementation starting next month', '2024-10-23'::timestamp),
        
        ('Amanda', 'Garcia', 'a.garcia@healthtech.org', '+1-555-1006', 'HealthTech Solutions', 'Chief Technology Officer', 'https://healthtech.org',
         '987 Medical Center Dr', 'Boston', 'MA', '02101', 'US',
         (SELECT website_id FROM source_refs), (SELECT contacted_id FROM status_refs), (SELECT sarah_id FROM user_refs),
         95000.00, 'Evaluating multiple vendors, promising discussions', '2024-10-19'::timestamp),
        
        ('James', 'Lee', 'james.lee@financegroup.com', '+1-555-1007', 'Finance Group LLC', 'CFO', 'https://financegroup.com',
         '246 Wall Street', 'New York', 'NY', '10005', 'US',
         (SELECT linkedin_id FROM source_refs), (SELECT new_id FROM status_refs), (SELECT mike_id FROM user_refs),
         65000.00, 'Initial inquiry about accounting modules', '2024-10-21'::timestamp),
        
        ('Lisa', 'Anderson', 'l.anderson@edutech.edu', '+1-555-1008', 'EduTech University', 'VP of Technology', 'https://edutech.edu',
         '135 Campus Drive', 'Palo Alto', 'CA', '94301', 'US',
         (SELECT referral_id FROM source_refs), (SELECT qualified_id FROM status_refs), (SELECT alex_id FROM user_refs),
         40000.00, 'Looking for student management system integration', '2024-10-17'::timestamp),
        
        ('David', 'Martinez', 'dmartinez@logistics.pro', '+1-555-1009', 'Logistics Pro', 'Operations Director', 'https://logistics.pro',
         '369 Transport Ave', 'Atlanta', 'GA', '30301', 'US',
         (SELECT tradeshow_id FROM source_refs), (SELECT opportunity_id FROM status_refs), (SELECT lisa_id FROM user_refs),
         85000.00, 'Impressed with demo, preparing proposal', '2024-10-16'::timestamp),
        
        ('Jennifer', 'Taylor', 'jtaylor@consulting.biz', '+1-555-1010', 'Taylor Consulting', 'Managing Partner', 'https://consulting.biz',
         '852 Professional Plaza', 'Denver', 'CO', '80201', 'US',
         (SELECT coldcall_id FROM source_refs), (SELECT contacted_id FROM status_refs), (SELECT david_id FROM user_refs),
         30000.00, 'Interested in project management features', '2024-10-14'::timestamp)
) AS lead_data;

-- =====================================================
-- SAMPLE PRODUCTS DATA
-- =====================================================

WITH category_refs AS (
    SELECT 
        (SELECT id FROM product_categories WHERE name = 'Software') as software_id,
        (SELECT id FROM product_categories WHERE name = 'Hardware') as hardware_id,
        (SELECT id FROM product_categories WHERE name = 'Services') as services_id,
        (SELECT id FROM product_categories WHERE name = 'Training') as training_id,
        (SELECT id FROM product_categories WHERE name = 'Support') as support_id
)
INSERT INTO products (
    sku, name, description, category_id, unit_price, cost_price, 
    weight, dimensions, barcode, min_stock_level, max_stock_level, current_stock
)
SELECT * FROM (
    VALUES
        ('SW-ERP-001', 'Ocean ERP Enterprise License', 'Full enterprise ERP system license for unlimited users', 
         (SELECT software_id FROM category_refs), 15000.00, 3000.00, NULL, NULL, NULL, 5, 50, 25),
        
        ('SW-ERP-002', 'Ocean ERP Professional License', 'Professional ERP system license for up to 50 users',
         (SELECT software_id FROM category_refs), 8000.00, 1500.00, NULL, NULL, NULL, 10, 100, 45),
        
        ('SW-ERP-003', 'Ocean ERP Standard License', 'Standard ERP system license for up to 10 users',
         (SELECT software_id FROM category_refs), 3000.00, 600.00, NULL, NULL, NULL, 20, 200, 85),
        
        ('HW-SRV-001', 'Enterprise Server', 'High-performance server for ERP hosting',
         (SELECT hardware_id FROM category_refs), 12000.00, 8000.00, 25.5, '19x24x3.5 inches', '123456789012', 2, 10, 6),
        
        ('HW-WKS-001', 'Professional Workstation', 'High-end workstation for power users',
         (SELECT hardware_id FROM category_refs), 3500.00, 2200.00, 15.2, '18x16x8 inches', '123456789013', 5, 25, 12),
        
        ('SVC-IMP-001', 'ERP Implementation Service', 'Professional implementation and setup service',
         (SELECT services_id FROM category_refs), 5000.00, 2000.00, NULL, NULL, NULL, 0, 0, 0),
        
        ('SVC-CST-001', 'ERP Customization Service', 'Custom development and configuration service',
         (SELECT services_id FROM category_refs), 2500.00, 1000.00, NULL, NULL, NULL, 0, 0, 0),
        
        ('TRN-ADM-001', 'Administrator Training Course', '3-day intensive administrator training',
         (SELECT training_id FROM category_refs), 1500.00, 300.00, NULL, NULL, NULL, 0, 0, 0),
        
        ('TRN-USR-001', 'End User Training Course', '1-day end user training session',
         (SELECT training_id FROM category_refs), 500.00, 100.00, NULL, NULL, NULL, 0, 0, 0),
        
        ('SUP-STD-001', 'Standard Support Package', 'Standard technical support package - 1 year',
         (SELECT support_id FROM category_refs), 2400.00, 600.00, NULL, NULL, NULL, 0, 0, 0),
        
        ('SUP-PRM-001', 'Premium Support Package', 'Premium 24/7 technical support package - 1 year',
         (SELECT support_id FROM category_refs), 4800.00, 1200.00, NULL, NULL, NULL, 0, 0, 0)
) AS product_data;

-- =====================================================
-- SAMPLE CUSTOMERS DATA
-- =====================================================

INSERT INTO customers (
    customer_number, company_name, contact_first_name, contact_last_name, 
    contact_email, contact_phone, billing_address, billing_city, billing_state, 
    billing_zip_code, billing_country, tax_id, credit_limit, payment_terms
) VALUES
    ('CUST-001', 'TechCorp Solutions', 'John', 'Smith', 'john.smith@techcorp.com', '+1-555-1001',
     '123 Tech Ave', 'San Francisco', 'CA', '94105', 'US', '12-3456789', 50000.00, 'Net 30'),
    
    ('CUST-002', 'Manufacturing Solutions', 'Robert', 'Brown', 'rbrown@manufacturing.net', '+1-555-1005',
     '654 Industrial Pkwy', 'Detroit', 'MI', '48201', 'US', '98-7654321', 150000.00, 'Net 30'),
    
    ('CUST-003', 'RetailPlus Inc', 'Sarah', 'Wilson', 'sarah.wilson@retailplus.com', '+1-555-1004',
     '321 Commerce Way', 'Chicago', 'IL', '60601', 'US', '55-1234567', 75000.00, 'Net 15'),
    
    ('CUST-004', 'HealthTech Solutions', 'Amanda', 'Garcia', 'a.garcia@healthtech.org', '+1-555-1006',
     '987 Medical Center Dr', 'Boston', 'MA', '02101', 'US', '77-9876543', 100000.00, 'Net 30'),
    
    ('CUST-005', 'EduTech University', 'Lisa', 'Anderson', 'l.anderson@edutech.edu', '+1-555-1008',
     '135 Campus Drive', 'Palo Alto', 'CA', '94301', 'US', 'EXEMPT', 60000.00, 'Net 45');

-- =====================================================
-- JOB POSITIONS SEED DATA
-- =====================================================

WITH dept_refs AS (
    SELECT 
        (SELECT id FROM departments WHERE name = 'Sales') as sales_id,
        (SELECT id FROM departments WHERE name = 'Product') as product_id,
        (SELECT id FROM departments WHERE name = 'Operations') as operations_id,
        (SELECT id FROM departments WHERE name = 'Accounting') as accounting_id,
        (SELECT id FROM departments WHERE name = 'Human Resources') as hr_id,
        (SELECT id FROM departments WHERE name = 'IT') as it_id,
        (SELECT id FROM departments WHERE name = 'Marketing') as marketing_id
)
INSERT INTO job_positions (title, department_id, description, salary_min, salary_max)
SELECT * FROM (
    VALUES
        ('Sales Manager', (SELECT sales_id FROM dept_refs), 'Lead and manage sales team', 80000.00, 120000.00),
        ('Sales Representative', (SELECT sales_id FROM dept_refs), 'Sell products and services to customers', 45000.00, 75000.00),
        ('Product Manager', (SELECT product_id FROM dept_refs), 'Manage product development and strategy', 90000.00, 140000.00),
        ('Software Developer', (SELECT product_id FROM dept_refs), 'Develop and maintain software products', 70000.00, 120000.00),
        ('Operations Manager', (SELECT operations_id FROM dept_refs), 'Manage operations and supply chain', 75000.00, 110000.00),
        ('Warehouse Supervisor', (SELECT operations_id FROM dept_refs), 'Supervise warehouse operations', 40000.00, 60000.00),
        ('Accountant', (SELECT accounting_id FROM dept_refs), 'Handle accounting and financial tasks', 50000.00, 80000.00),
        ('Financial Analyst', (SELECT accounting_id FROM dept_refs), 'Analyze financial data and create reports', 60000.00, 90000.00),
        ('HR Manager', (SELECT hr_id FROM dept_refs), 'Manage human resources functions', 70000.00, 100000.00),
        ('HR Specialist', (SELECT hr_id FROM dept_refs), 'Handle HR administrative tasks', 45000.00, 65000.00),
        ('IT Manager', (SELECT it_id FROM dept_refs), 'Manage IT infrastructure and systems', 85000.00, 125000.00),
        ('System Administrator', (SELECT it_id FROM dept_refs), 'Maintain and support IT systems', 55000.00, 85000.00),
        ('Marketing Manager', (SELECT marketing_id FROM dept_refs), 'Develop and execute marketing strategies', 75000.00, 110000.00),
        ('Marketing Specialist', (SELECT marketing_id FROM dept_refs), 'Execute marketing campaigns and activities', 45000.00, 70000.00)
) AS position_data;

-- Success message
SELECT 'Ocean ERP database has been successfully seeded with initial data!' AS status;