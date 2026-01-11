-- Migration: Add Multi-Account Support for Integrations
-- Version: 014
-- Date: December 1, 2025
-- Description: Enables multiple account connections per integration platform (e.g., multiple Tokopedia shops)

-- ============================================================================
-- STEP 1: Create integration_accounts table
-- ============================================================================

CREATE TABLE IF NOT EXISTS integration_accounts (
  id SERIAL PRIMARY KEY,
  
  -- Link to parent integration platform
  integration_id VARCHAR(100) NOT NULL,
  
  -- Account identification
  account_name VARCHAR(255) NOT NULL, -- User-friendly name: "Main Store", "Jakarta Warehouse"
  account_identifier VARCHAR(255) NOT NULL, -- Shop ID, FS ID, or unique external identifier
  
  -- Account-specific credentials (encrypted JSON)
  credentials JSONB DEFAULT '{}',
  
  -- Account status
  status VARCHAR(50) CHECK (status IN ('active', 'inactive', 'error', 'pending')) DEFAULT 'inactive',
  enabled BOOLEAN DEFAULT false,
  
  -- Sync settings (can override parent integration)
  auto_sync BOOLEAN DEFAULT true,
  sync_interval_minutes INTEGER DEFAULT 15,
  last_sync_at TIMESTAMP,
  sync_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  last_error TEXT,
  
  -- Metadata (shop info, warehouse location, tier, etc.)
  metadata JSONB DEFAULT '{}',
  
  -- Primary account flag (one per integration)
  is_primary BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(integration_id, account_identifier),
  FOREIGN KEY (integration_id) REFERENCES integrations(integration_id) ON DELETE CASCADE
);

-- Add comment
COMMENT ON TABLE integration_accounts IS 'Stores multiple account connections for each integration platform';
COMMENT ON COLUMN integration_accounts.account_name IS 'User-friendly display name for the account';
COMMENT ON COLUMN integration_accounts.account_identifier IS 'Unique external identifier (Shop ID, FS ID, etc.)';
COMMENT ON COLUMN integration_accounts.credentials IS 'Encrypted JSON containing account-specific credentials';
COMMENT ON COLUMN integration_accounts.metadata IS 'Additional account information (shop details, location, tier, etc.)';
COMMENT ON COLUMN integration_accounts.is_primary IS 'Marks the default/primary account for this integration';

-- ============================================================================
-- STEP 2: Create indexes for performance
-- ============================================================================

CREATE INDEX idx_integration_accounts_integration ON integration_accounts(integration_id);
CREATE INDEX idx_integration_accounts_status ON integration_accounts(status);
CREATE INDEX idx_integration_accounts_enabled ON integration_accounts(enabled);
CREATE INDEX idx_integration_accounts_primary ON integration_accounts(is_primary);
CREATE INDEX idx_integration_accounts_identifier ON integration_accounts(account_identifier);
CREATE INDEX idx_integration_accounts_last_sync ON integration_accounts(last_sync_at);

-- ============================================================================
-- STEP 3: Update integration_mappings to include account_id
-- ============================================================================

-- Add account_id column to track which account a mapping belongs to
ALTER TABLE integration_mappings 
ADD COLUMN IF NOT EXISTS account_id INTEGER REFERENCES integration_accounts(id) ON DELETE CASCADE;

-- Create index
CREATE INDEX IF NOT EXISTS idx_integration_mappings_account ON integration_mappings(account_id);

-- Add comment
COMMENT ON COLUMN integration_mappings.account_id IS 'Links mapping to specific integration account for multi-account support';

-- ============================================================================
-- STEP 4: Update integration_logs to include account_id
-- ============================================================================

-- Add account_id column to track logs per account
ALTER TABLE integration_logs 
ADD COLUMN IF NOT EXISTS account_id INTEGER REFERENCES integration_accounts(id) ON DELETE SET NULL;

-- Create index
CREATE INDEX IF NOT EXISTS idx_integration_logs_account ON integration_logs(account_id);

-- Add comment
COMMENT ON COLUMN integration_logs.account_id IS 'Links log entry to specific integration account';

-- ============================================================================
-- STEP 5: Create integration_account_access table (Optional - for access control)
-- ============================================================================

CREATE TABLE IF NOT EXISTS integration_account_access (
  id SERIAL PRIMARY KEY,
  
  -- Link to account and user
  account_id INTEGER NOT NULL REFERENCES integration_accounts(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL,
  
  -- Role and permissions
  role VARCHAR(50) NOT NULL CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),
  permissions JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  created_by INTEGER,
  
  -- Constraints
  UNIQUE(account_id, user_id)
);

-- Create indexes
CREATE INDEX idx_integration_account_access_account ON integration_account_access(account_id);
CREATE INDEX idx_integration_account_access_user ON integration_account_access(user_id);
CREATE INDEX idx_integration_account_access_role ON integration_account_access(role);

-- Add comments
COMMENT ON TABLE integration_account_access IS 'Controls user access to specific integration accounts';
COMMENT ON COLUMN integration_account_access.role IS 'User role: owner (full control), admin (manage), editor (use), viewer (read-only)';

-- ============================================================================
-- STEP 6: Create trigger to ensure only one primary account per integration
-- ============================================================================

CREATE OR REPLACE FUNCTION ensure_single_primary_account()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_primary = true THEN
    -- Unset other primary accounts for same integration
    UPDATE integration_accounts 
    SET is_primary = false 
    WHERE integration_id = NEW.integration_id 
      AND id != NEW.id 
      AND is_primary = true;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_ensure_single_primary
BEFORE INSERT OR UPDATE ON integration_accounts
FOR EACH ROW
EXECUTE FUNCTION ensure_single_primary_account();

COMMENT ON FUNCTION ensure_single_primary_account() IS 'Ensures only one primary account per integration platform';

-- ============================================================================
-- STEP 7: Create trigger to update updated_at timestamp
-- ============================================================================

CREATE OR REPLACE FUNCTION update_integration_account_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_integration_account_timestamp
BEFORE UPDATE ON integration_accounts
FOR EACH ROW
EXECUTE FUNCTION update_integration_account_timestamp();

-- ============================================================================
-- STEP 8: Create views for easier querying
-- ============================================================================

-- View: Account summary with statistics
CREATE OR REPLACE VIEW v_integration_account_summary AS
SELECT 
  ia.id,
  ia.integration_id,
  i.name AS integration_name,
  i.category,
  ia.account_name,
  ia.account_identifier,
  ia.status,
  ia.enabled,
  ia.is_primary,
  ia.last_sync_at,
  ia.sync_count,
  ia.error_count,
  ia.metadata,
  
  -- Count related mappings
  COUNT(DISTINCT im.id) AS mapping_count,
  
  -- Count logs (last 30 days)
  COUNT(DISTINCT CASE 
    WHEN il.created_at > NOW() - INTERVAL '30 days' 
    THEN il.id 
  END) AS recent_log_count,
  
  -- Latest log
  MAX(il.created_at) AS last_log_at,
  
  ia.created_at,
  ia.updated_at
FROM integration_accounts ia
LEFT JOIN integrations i ON ia.integration_id = i.integration_id
LEFT JOIN integration_mappings im ON ia.id = im.account_id
LEFT JOIN integration_logs il ON ia.id = il.account_id
GROUP BY 
  ia.id, ia.integration_id, i.name, i.category, ia.account_name, 
  ia.account_identifier, ia.status, ia.enabled, ia.is_primary, 
  ia.last_sync_at, ia.sync_count, ia.error_count, ia.metadata,
  ia.created_at, ia.updated_at;

COMMENT ON VIEW v_integration_account_summary IS 'Summary view of integration accounts with statistics';

-- View: Active accounts with integration details
CREATE OR REPLACE VIEW v_active_integration_accounts AS
SELECT 
  ia.*,
  i.name AS integration_name,
  i.category AS integration_category,
  i.status AS integration_status
FROM integration_accounts ia
INNER JOIN integrations i ON ia.integration_id = i.integration_id
WHERE ia.enabled = true 
  AND ia.status = 'active'
  AND i.enabled = true
  AND i.status = 'active';

COMMENT ON VIEW v_active_integration_accounts IS 'Lists all currently active integration accounts';

-- ============================================================================
-- STEP 9: Sample data for testing (Tokopedia example)
-- ============================================================================

-- Insert sample Tokopedia accounts (if integrations table has tokopedia)
INSERT INTO integration_accounts (
  integration_id,
  account_name,
  account_identifier,
  credentials,
  status,
  enabled,
  auto_sync,
  sync_interval_minutes,
  metadata,
  is_primary
)
SELECT 
  'tokopedia',
  'Main Store - Jakarta',
  'shop_example_12345',
  '{
    "fs_id": "12345",
    "shop_id": "67890",
    "client_id": null,
    "client_secret": null,
    "access_token": null,
    "token_expires_at": null
  }'::jsonb,
  'inactive',
  false,
  true,
  15,
  '{
    "shop_name": "Example Store Jakarta",
    "warehouse": "Jakarta Central",
    "tier": "Regular Merchant",
    "note": "Sample account for testing"
  }'::jsonb,
  true
WHERE EXISTS (SELECT 1 FROM integrations WHERE integration_id = 'tokopedia')
ON CONFLICT (integration_id, account_identifier) DO NOTHING;

-- ============================================================================
-- STEP 10: Grant permissions (adjust based on your user roles)
-- ============================================================================

-- Grant permissions to application user (adjust username as needed)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON integration_accounts TO your_app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON integration_account_access TO your_app_user;
-- GRANT USAGE, SELECT ON SEQUENCE integration_accounts_id_seq TO your_app_user;
-- GRANT USAGE, SELECT ON SEQUENCE integration_account_access_id_seq TO your_app_user;

-- ============================================================================
-- ROLLBACK SCRIPT (keep commented, use only if needed)
-- ============================================================================

/*
-- To rollback this migration:

-- Drop views
DROP VIEW IF EXISTS v_active_integration_accounts;
DROP VIEW IF EXISTS v_integration_account_summary;

-- Drop triggers
DROP TRIGGER IF EXISTS trigger_update_integration_account_timestamp ON integration_accounts;
DROP TRIGGER IF EXISTS trigger_ensure_single_primary ON integration_accounts;

-- Drop functions
DROP FUNCTION IF EXISTS update_integration_account_timestamp();
DROP FUNCTION IF EXISTS ensure_single_primary_account();

-- Drop tables (CASCADE will remove foreign keys)
DROP TABLE IF EXISTS integration_account_access CASCADE;

-- Remove columns from existing tables
ALTER TABLE integration_logs DROP COLUMN IF EXISTS account_id;
ALTER TABLE integration_mappings DROP COLUMN IF EXISTS account_id;

-- Drop main table
DROP TABLE IF EXISTS integration_accounts CASCADE;
*/

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check table creation
SELECT 
  table_name, 
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) AS column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_name IN ('integration_accounts', 'integration_account_access')
ORDER BY table_name;

-- Check indexes
SELECT 
  tablename, 
  indexname, 
  indexdef 
FROM pg_indexes 
WHERE tablename IN ('integration_accounts', 'integration_account_access')
ORDER BY tablename, indexname;

-- Check views
SELECT 
  table_name 
FROM information_schema.views 
WHERE table_schema = 'public' 
  AND table_name LIKE 'v_%integration%account%'
ORDER BY table_name;

-- Check sample data
SELECT 
  integration_id,
  account_name,
  account_identifier,
  status,
  enabled,
  is_primary
FROM integration_accounts
ORDER BY integration_id, is_primary DESC, account_name;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

SELECT 'Migration 014: Multi-Account Integration Support - COMPLETED' AS status;
