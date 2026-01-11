-- ============================================================================
-- Phase 7 Task 1: CRM Foundation & Customer Management
-- Database Schema
-- ============================================================================
-- Version: 1.0.0
-- Date: December 4, 2025
-- Description: Customer Relationship Management foundation tables
-- ============================================================================

-- Drop existing tables if they exist (for clean reinstall)
DROP TABLE IF EXISTS crm_account_custom_values CASCADE;
DROP TABLE IF EXISTS crm_custom_fields CASCADE;
DROP TABLE IF EXISTS crm_tags CASCADE;
DROP TABLE IF EXISTS crm_notes CASCADE;
DROP TABLE IF EXISTS crm_social_profiles CASCADE;
DROP TABLE IF EXISTS crm_email_addresses CASCADE;
DROP TABLE IF EXISTS crm_phone_numbers CASCADE;
DROP TABLE IF EXISTS crm_addresses CASCADE;
DROP TABLE IF EXISTS crm_communication_log CASCADE;
DROP TABLE IF EXISTS crm_communication_types CASCADE;
DROP TABLE IF EXISTS crm_contact_roles CASCADE;
DROP TABLE IF EXISTS crm_customer_relationships CASCADE;
DROP TABLE IF EXISTS crm_customer_types CASCADE;
DROP TABLE IF EXISTS crm_contacts CASCADE;
DROP TABLE IF EXISTS crm_accounts CASCADE;

-- ============================================================================
-- 1. CRM ACCOUNTS (Companies/Organizations)
-- ============================================================================
CREATE TABLE crm_accounts (
    account_id SERIAL PRIMARY KEY,
    account_number VARCHAR(50) UNIQUE NOT NULL,
    account_name VARCHAR(200) NOT NULL,
    account_type VARCHAR(50) NOT NULL, -- 'customer', 'prospect', 'partner', 'vendor'
    customer_type_id INTEGER, -- Foreign key to crm_customer_types
    industry VARCHAR(100),
    annual_revenue DECIMAL(15,2),
    employee_count INTEGER,
    website VARCHAR(200),
    description TEXT,
    parent_account_id INTEGER, -- Self-referencing for account hierarchy
    is_active BOOLEAN DEFAULT TRUE,
    rating VARCHAR(20), -- 'hot', 'warm', 'cold'
    ownership VARCHAR(50), -- 'Public', 'Private', 'Subsidiary'
    sic_code VARCHAR(20), -- Standard Industrial Classification
    ticker_symbol VARCHAR(10),
    
    -- Customer relationship
    customer_since DATE,
    lifetime_value DECIMAL(15,2) DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    last_order_date DATE,
    
    -- Assignment
    account_owner_id INTEGER, -- Foreign key to employees
    territory VARCHAR(100),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER, -- Foreign key to employees
    updated_by INTEGER,
    
    CONSTRAINT fk_parent_account FOREIGN KEY (parent_account_id) 
        REFERENCES crm_accounts(account_id) ON DELETE SET NULL
);

CREATE INDEX idx_crm_accounts_type ON crm_accounts(account_type);
CREATE INDEX idx_crm_accounts_owner ON crm_accounts(account_owner_id);
CREATE INDEX idx_crm_accounts_parent ON crm_accounts(parent_account_id);
CREATE INDEX idx_crm_accounts_active ON crm_accounts(is_active);
CREATE INDEX idx_crm_accounts_name ON crm_accounts(account_name);

-- ============================================================================
-- 2. CRM CONTACTS (Individual People)
-- ============================================================================
CREATE TABLE crm_contacts (
    contact_id SERIAL PRIMARY KEY,
    account_id INTEGER NOT NULL,
    
    -- Personal information
    salutation VARCHAR(20), -- 'Mr.', 'Ms.', 'Dr.', etc.
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    suffix VARCHAR(20), -- 'Jr.', 'Sr.', 'III', etc.
    full_name VARCHAR(300),
    
    -- Contact details (primary)
    primary_email VARCHAR(200),
    primary_phone VARCHAR(50),
    mobile_phone VARCHAR(50),
    
    -- Professional details
    job_title VARCHAR(150),
    department VARCHAR(100),
    reports_to_contact_id INTEGER, -- Self-referencing for org chart
    
    -- Social media
    linkedin_url VARCHAR(300),
    twitter_handle VARCHAR(100),
    
    -- Preferences
    preferred_contact_method VARCHAR(50), -- 'email', 'phone', 'sms'
    do_not_call BOOLEAN DEFAULT FALSE,
    do_not_email BOOLEAN DEFAULT FALSE,
    email_opt_out BOOLEAN DEFAULT FALSE,
    
    -- Dates
    date_of_birth DATE,
    hire_date DATE,
    
    -- Status
    is_primary_contact BOOLEAN DEFAULT FALSE,
    is_decision_maker BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER,
    
    CONSTRAINT fk_crm_contact_account FOREIGN KEY (account_id) 
        REFERENCES crm_accounts(account_id) ON DELETE CASCADE,
    CONSTRAINT fk_crm_contact_reports_to FOREIGN KEY (reports_to_contact_id) 
        REFERENCES crm_contacts(contact_id) ON DELETE SET NULL
);

CREATE INDEX idx_crm_contacts_account ON crm_contacts(account_id);
CREATE INDEX idx_crm_contacts_email ON crm_contacts(primary_email);
CREATE INDEX idx_crm_contacts_name ON crm_contacts(last_name, first_name);
CREATE INDEX idx_crm_contacts_active ON crm_contacts(is_active);
CREATE INDEX idx_crm_contacts_primary ON crm_contacts(account_id, is_primary_contact);

-- ============================================================================
-- 3. CRM CUSTOMER TYPES (Customer Segmentation)
-- ============================================================================
CREATE TABLE crm_customer_types (
    customer_type_id SERIAL PRIMARY KEY,
    type_name VARCHAR(100) UNIQUE NOT NULL,
    type_code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    parent_type_id INTEGER, -- For hierarchical types
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_crm_parent_type FOREIGN KEY (parent_type_id) 
        REFERENCES crm_customer_types(customer_type_id) ON DELETE SET NULL
);

CREATE INDEX idx_crm_customer_types_active ON crm_customer_types(is_active);

-- Add foreign key constraint to accounts
ALTER TABLE crm_accounts 
    ADD CONSTRAINT fk_crm_account_customer_type 
    FOREIGN KEY (customer_type_id) 
    REFERENCES crm_customer_types(customer_type_id) ON DELETE SET NULL;

-- ============================================================================
-- 4. CRM CUSTOMER RELATIONSHIPS (Account Hierarchies)
-- ============================================================================
CREATE TABLE crm_customer_relationships (
    relationship_id SERIAL PRIMARY KEY,
    parent_account_id INTEGER NOT NULL,
    child_account_id INTEGER NOT NULL,
    relationship_type VARCHAR(50) NOT NULL, -- 'parent', 'subsidiary', 'branch', 'affiliate'
    ownership_percentage DECIMAL(5,2), -- 0-100
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_crm_rel_parent FOREIGN KEY (parent_account_id) 
        REFERENCES crm_accounts(account_id) ON DELETE CASCADE,
    CONSTRAINT fk_crm_rel_child FOREIGN KEY (child_account_id) 
        REFERENCES crm_accounts(account_id) ON DELETE CASCADE,
    CONSTRAINT chk_crm_rel_different_accounts CHECK (parent_account_id != child_account_id)
);

CREATE INDEX idx_crm_relationships_parent ON crm_customer_relationships(parent_account_id);
CREATE INDEX idx_crm_relationships_child ON crm_customer_relationships(child_account_id);

-- ============================================================================
-- 5. CRM CONTACT ROLES (Contact Responsibilities)
-- ============================================================================
CREATE TABLE crm_contact_roles (
    contact_role_id SERIAL PRIMARY KEY,
    contact_id INTEGER NOT NULL,
    role_type VARCHAR(100) NOT NULL, -- 'decision_maker', 'influencer', 'user', 'technical_buyer'
    role_description TEXT,
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_crm_contact_role FOREIGN KEY (contact_id) 
        REFERENCES crm_contacts(contact_id) ON DELETE CASCADE
);

CREATE INDEX idx_crm_contact_roles_contact ON crm_contact_roles(contact_id);
CREATE INDEX idx_crm_contact_roles_type ON crm_contact_roles(role_type);

-- ============================================================================
-- 6. CRM COMMUNICATION TYPES
-- ============================================================================
CREATE TABLE crm_communication_types (
    communication_type_id SERIAL PRIMARY KEY,
    type_name VARCHAR(100) UNIQUE NOT NULL,
    type_code VARCHAR(20) UNIQUE NOT NULL,
    icon VARCHAR(50), -- Icon name for UI
    color VARCHAR(20), -- Color code for UI
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default communication types
INSERT INTO crm_communication_types (type_name, type_code, icon, color, display_order) VALUES
('Email', 'EMAIL', 'mail', 'blue', 1),
('Phone Call', 'PHONE', 'phone', 'green', 2),
('Meeting', 'MEETING', 'users', 'purple', 3),
('Video Conference', 'VIDEO', 'video', 'orange', 4),
('SMS/Text', 'SMS', 'message-square', 'cyan', 5),
('Note', 'NOTE', 'file-text', 'gray', 6),
('Task', 'TASK', 'check-square', 'yellow', 7),
('Social Media', 'SOCIAL', 'share-2', 'pink', 8);

-- ============================================================================
-- 7. CRM COMMUNICATION LOG (All Customer Interactions)
-- ============================================================================
CREATE TABLE crm_communication_log (
    communication_id SERIAL PRIMARY KEY,
    account_id INTEGER,
    contact_id INTEGER,
    communication_type_id INTEGER NOT NULL,
    
    -- Communication details
    subject VARCHAR(300),
    description TEXT,
    direction VARCHAR(20), -- 'inbound', 'outbound'
    status VARCHAR(50) DEFAULT 'completed', -- 'planned', 'completed', 'cancelled'
    
    -- Timing
    communication_date TIMESTAMP NOT NULL,
    duration_minutes INTEGER,
    
    -- Assignment
    owner_id INTEGER, -- Employee who handled communication
    
    -- Related records
    opportunity_id INTEGER, -- Link to sales opportunity
    case_id INTEGER, -- Link to support case
    campaign_id INTEGER, -- Link to marketing campaign
    
    -- Metadata
    is_private BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    
    CONSTRAINT fk_crm_comm_account FOREIGN KEY (account_id) 
        REFERENCES crm_accounts(account_id) ON DELETE CASCADE,
    CONSTRAINT fk_crm_comm_contact FOREIGN KEY (contact_id) 
        REFERENCES crm_contacts(contact_id) ON DELETE CASCADE,
    CONSTRAINT fk_crm_comm_type FOREIGN KEY (communication_type_id) 
        REFERENCES crm_communication_types(communication_type_id)
);

CREATE INDEX idx_crm_comm_account ON crm_communication_log(account_id);
CREATE INDEX idx_crm_comm_contact ON crm_communication_log(contact_id);
CREATE INDEX idx_crm_comm_date ON crm_communication_log(communication_date);
CREATE INDEX idx_crm_comm_type ON crm_communication_log(communication_type_id);
CREATE INDEX idx_crm_comm_owner ON crm_communication_log(owner_id);

-- ============================================================================
-- 8. CRM ADDRESSES (Multiple Addresses per Account)
-- ============================================================================
CREATE TABLE crm_addresses (
    address_id SERIAL PRIMARY KEY,
    account_id INTEGER NOT NULL,
    address_type VARCHAR(50) NOT NULL, -- 'billing', 'shipping', 'mailing', 'office'
    
    -- Address fields
    street1 VARCHAR(200),
    street2 VARCHAR(200),
    street3 VARCHAR(200),
    city VARCHAR(100),
    state_province VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    
    -- Geolocation
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    
    -- Status
    is_primary BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_crm_address_account FOREIGN KEY (account_id) 
        REFERENCES crm_accounts(account_id) ON DELETE CASCADE
);

CREATE INDEX idx_crm_addresses_account ON crm_addresses(account_id);
CREATE INDEX idx_crm_addresses_type ON crm_addresses(address_type);
CREATE INDEX idx_crm_addresses_primary ON crm_addresses(account_id, is_primary);

-- ============================================================================
-- 9. CRM PHONE NUMBERS (Multiple Phones per Contact)
-- ============================================================================
CREATE TABLE crm_phone_numbers (
    phone_id SERIAL PRIMARY KEY,
    contact_id INTEGER NOT NULL,
    phone_type VARCHAR(50) NOT NULL, -- 'mobile', 'work', 'home', 'fax', 'other'
    phone_number VARCHAR(50) NOT NULL,
    extension VARCHAR(20),
    country_code VARCHAR(10),
    is_primary BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_crm_phone_contact FOREIGN KEY (contact_id) 
        REFERENCES crm_contacts(contact_id) ON DELETE CASCADE
);

CREATE INDEX idx_crm_phones_contact ON crm_phone_numbers(contact_id);
CREATE INDEX idx_crm_phones_number ON crm_phone_numbers(phone_number);

-- ============================================================================
-- 10. CRM EMAIL ADDRESSES (Multiple Emails per Contact)
-- ============================================================================
CREATE TABLE crm_email_addresses (
    email_id SERIAL PRIMARY KEY,
    contact_id INTEGER NOT NULL,
    email_type VARCHAR(50) NOT NULL, -- 'work', 'personal', 'other'
    email_address VARCHAR(200) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    email_valid BOOLEAN DEFAULT TRUE,
    bounce_count INTEGER DEFAULT 0,
    last_bounce_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_crm_email_contact FOREIGN KEY (contact_id) 
        REFERENCES crm_contacts(contact_id) ON DELETE CASCADE
);

CREATE INDEX idx_crm_emails_contact ON crm_email_addresses(contact_id);
CREATE INDEX idx_crm_emails_address ON crm_email_addresses(email_address);

-- ============================================================================
-- 11. CRM SOCIAL PROFILES (Social Media Handles)
-- ============================================================================
CREATE TABLE crm_social_profiles (
    social_profile_id SERIAL PRIMARY KEY,
    contact_id INTEGER NOT NULL,
    platform VARCHAR(50) NOT NULL, -- 'linkedin', 'twitter', 'facebook', 'instagram'
    profile_url VARCHAR(300),
    username VARCHAR(100),
    follower_count INTEGER,
    is_verified BOOLEAN DEFAULT FALSE,
    last_updated TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_crm_social_contact FOREIGN KEY (contact_id) 
        REFERENCES crm_contacts(contact_id) ON DELETE CASCADE
);

CREATE INDEX idx_crm_social_contact ON crm_social_profiles(contact_id);
CREATE INDEX idx_crm_social_platform ON crm_social_profiles(platform);

-- ============================================================================
-- 12. CRM NOTES (Internal Notes and Comments)
-- ============================================================================
CREATE TABLE crm_notes (
    note_id SERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL, -- 'account', 'contact', 'opportunity', 'case'
    entity_id INTEGER NOT NULL,
    note_title VARCHAR(300),
    note_content TEXT NOT NULL,
    is_private BOOLEAN DEFAULT FALSE,
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER NOT NULL,
    updated_by INTEGER
);

CREATE INDEX idx_crm_notes_entity ON crm_notes(entity_type, entity_id);
CREATE INDEX idx_crm_notes_created_by ON crm_notes(created_by);
CREATE INDEX idx_crm_notes_pinned ON crm_notes(is_pinned);

-- ============================================================================
-- 13. CRM TAGS (Flexible Tagging System)
-- ============================================================================
CREATE TABLE crm_tags (
    tag_id SERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL, -- 'account', 'contact', 'opportunity'
    entity_id INTEGER NOT NULL,
    tag_name VARCHAR(100) NOT NULL,
    tag_category VARCHAR(100), -- Optional grouping
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    
    CONSTRAINT uk_crm_tags UNIQUE (entity_type, entity_id, tag_name)
);

CREATE INDEX idx_crm_tags_entity ON crm_tags(entity_type, entity_id);
CREATE INDEX idx_crm_tags_name ON crm_tags(tag_name);
CREATE INDEX idx_crm_tags_category ON crm_tags(tag_category);

-- ============================================================================
-- 14. CRM CUSTOM FIELDS (Extensible Field Definitions)
-- ============================================================================
CREATE TABLE crm_custom_fields (
    custom_field_id SERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL, -- 'account', 'contact', 'opportunity'
    field_name VARCHAR(100) NOT NULL,
    field_label VARCHAR(200) NOT NULL,
    field_type VARCHAR(50) NOT NULL, -- 'text', 'number', 'date', 'boolean', 'picklist'
    field_options TEXT, -- JSON array for picklist values
    is_required BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT uk_crm_custom_field UNIQUE (entity_type, field_name)
);

CREATE INDEX idx_crm_custom_fields_entity ON crm_custom_fields(entity_type);
CREATE INDEX idx_crm_custom_fields_active ON crm_custom_fields(is_active);

-- ============================================================================
-- 15. CRM ACCOUNT CUSTOM VALUES (Custom Field Data)
-- ============================================================================
CREATE TABLE crm_account_custom_values (
    custom_value_id SERIAL PRIMARY KEY,
    account_id INTEGER NOT NULL,
    custom_field_id INTEGER NOT NULL,
    field_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_crm_custom_account FOREIGN KEY (account_id) 
        REFERENCES crm_accounts(account_id) ON DELETE CASCADE,
    CONSTRAINT fk_crm_custom_field FOREIGN KEY (custom_field_id) 
        REFERENCES crm_custom_fields(custom_field_id) ON DELETE CASCADE,
    CONSTRAINT uk_crm_custom_value UNIQUE (account_id, custom_field_id)
);

CREATE INDEX idx_crm_custom_values_account ON crm_account_custom_values(account_id);
CREATE INDEX idx_crm_custom_values_field ON crm_account_custom_values(custom_field_id);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate full_name for contacts
CREATE OR REPLACE FUNCTION generate_contact_full_name()
RETURNS TRIGGER AS $$
BEGIN
    NEW.full_name := CONCAT_WS(' ', 
        NULLIF(NEW.salutation, ''),
        NEW.first_name,
        NULLIF(NEW.middle_name, ''),
        NEW.last_name,
        NULLIF(NEW.suffix, '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to relevant tables
CREATE TRIGGER trg_crm_accounts_updated
    BEFORE UPDATE ON crm_accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_crm_contacts_full_name
    BEFORE INSERT OR UPDATE ON crm_contacts
    FOR EACH ROW
    EXECUTE FUNCTION generate_contact_full_name();

CREATE TRIGGER trg_crm_contacts_updated
    BEFORE UPDATE ON crm_contacts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_crm_communication_updated
    BEFORE UPDATE ON crm_communication_log
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_crm_addresses_updated
    BEFORE UPDATE ON crm_addresses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_crm_custom_values_updated
    BEFORE UPDATE ON crm_account_custom_values
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SAMPLE DATA FOR TESTING
-- ============================================================================

-- Insert sample customer types
INSERT INTO crm_customer_types (type_name, type_code, description, display_order) VALUES
('Enterprise', 'ENTERPRISE', 'Large organizations with >1000 employees', 1),
('Mid-Market', 'MIDMARKET', 'Medium-sized businesses with 100-1000 employees', 2),
('Small Business', 'SMB', 'Small businesses with <100 employees', 3),
('Startup', 'STARTUP', 'Early-stage companies', 4),
('Government', 'GOV', 'Government agencies and institutions', 5),
('Non-Profit', 'NONPROFIT', 'Non-profit organizations', 6);

-- Insert sample accounts
INSERT INTO crm_accounts (account_number, account_name, account_type, customer_type_id, industry, annual_revenue, employee_count, website, rating, is_active)
VALUES 
('ACC-001', 'Acme Corporation', 'customer', 1, 'Manufacturing', 50000000, 2500, 'https://acme.com', 'hot', true),
('ACC-002', 'TechStart Inc', 'prospect', 4, 'Technology', 5000000, 50, 'https://techstart.com', 'warm', true),
('ACC-003', 'Global Solutions LLC', 'customer', 2, 'Professional Services', 15000000, 350, 'https://globalsolutions.com', 'hot', true);

-- Insert sample contacts
INSERT INTO crm_contacts (account_id, salutation, first_name, last_name, job_title, department, primary_email, primary_phone, is_primary_contact, is_decision_maker)
VALUES
(1, 'Mr.', 'John', 'Smith', 'VP of Operations', 'Operations', 'john.smith@acme.com', '+1-555-0101', true, true),
(1, 'Ms.', 'Sarah', 'Johnson', 'Procurement Manager', 'Procurement', 'sarah.johnson@acme.com', '+1-555-0102', false, false),
(2, 'Dr.', 'Michael', 'Chen', 'CEO', 'Executive', 'michael.chen@techstart.com', '+1-555-0201', true, true),
(3, 'Ms.', 'Emily', 'Davis', 'COO', 'Operations', 'emily.davis@globalsolutions.com', '+1-555-0301', true, true);

-- Insert sample communication log
INSERT INTO crm_communication_log (account_id, contact_id, communication_type_id, subject, description, direction, communication_date, duration_minutes)
VALUES
(1, 1, 2, 'Initial Discovery Call', 'Discussed their manufacturing requirements and pain points', 'outbound', CURRENT_TIMESTAMP - INTERVAL '5 days', 45),
(1, 2, 1, 'Product Demo Follow-up', 'Sent detailed information about our ERP system', 'outbound', CURRENT_TIMESTAMP - INTERVAL '3 days', NULL),
(2, 3, 3, 'Product Demo', 'Demonstrated key features of the platform', 'outbound', CURRENT_TIMESTAMP - INTERVAL '1 day', 60);

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Complete customer view with primary contact
CREATE OR REPLACE VIEW v_crm_customers_summary AS
SELECT 
    a.account_id,
    a.account_number,
    a.account_name,
    a.account_type,
    ct.type_name as customer_type,
    a.industry,
    a.annual_revenue,
    a.employee_count,
    a.website,
    a.rating,
    a.customer_since,
    a.lifetime_value,
    a.total_orders,
    a.last_order_date,
    
    -- Primary contact info
    c.contact_id as primary_contact_id,
    c.full_name as primary_contact_name,
    c.job_title as primary_contact_title,
    c.primary_email as primary_contact_email,
    c.primary_phone as primary_contact_phone,
    
    -- Counts
    (SELECT COUNT(*) FROM crm_contacts WHERE account_id = a.account_id AND is_active = true) as contact_count,
    (SELECT COUNT(*) FROM crm_communication_log WHERE account_id = a.account_id) as communication_count,
    (SELECT MAX(communication_date) FROM crm_communication_log WHERE account_id = a.account_id) as last_contact_date
    
FROM crm_accounts a
LEFT JOIN crm_customer_types ct ON a.customer_type_id = ct.customer_type_id
LEFT JOIN crm_contacts c ON a.account_id = c.account_id AND c.is_primary_contact = true
WHERE a.is_active = true;

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Phase 7 Task 1: CRM Foundation Schema';
    RAISE NOTICE 'Installation Complete!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Tables created: 15';
    RAISE NOTICE 'Sample accounts: 3';
    RAISE NOTICE 'Sample contacts: 4';
    RAISE NOTICE '========================================';
END $$;
