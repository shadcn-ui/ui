-- Integrations System Database Schema
-- This schema supports third-party integrations for accounting, e-commerce, payments, and logistics

-- Create integrations table
CREATE TABLE IF NOT EXISTS integrations (
  id SERIAL PRIMARY KEY,
  integration_id VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) CHECK (category IN ('accounting', 'ecommerce', 'payment', 'logistics', 'webhook', 'other')),
  status VARCHAR(50) CHECK (status IN ('active', 'inactive', 'error', 'pending')) DEFAULT 'inactive',
  enabled BOOLEAN DEFAULT false,
  config JSONB DEFAULT '{}',
  api_key TEXT,
  api_secret TEXT,
  webhook_url TEXT,
  auto_sync BOOLEAN DEFAULT false,
  sync_interval_minutes INTEGER DEFAULT 60,
  last_sync_at TIMESTAMP,
  sync_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  last_error TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create integration_logs table
CREATE TABLE IF NOT EXISTS integration_logs (
  id SERIAL PRIMARY KEY,
  integration_id VARCHAR(100) NOT NULL,
  action VARCHAR(100) NOT NULL,
  status VARCHAR(50) CHECK (status IN ('success', 'error', 'pending', 'received')) DEFAULT 'pending',
  request_data JSONB,
  response_data JSONB,
  details JSONB,
  error_message TEXT,
  duration_ms INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create integration_mappings table (for field/entity mappings)
CREATE TABLE IF NOT EXISTS integration_mappings (
  id SERIAL PRIMARY KEY,
  integration_id VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL, -- 'product', 'order', 'customer', 'invoice', etc.
  external_id VARCHAR(255) NOT NULL,
  internal_id INTEGER NOT NULL,
  sync_direction VARCHAR(50) CHECK (sync_direction IN ('bidirectional', 'inbound', 'outbound')) DEFAULT 'bidirectional',
  last_synced_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(integration_id, entity_type, external_id)
);

-- Create webhook_subscriptions table
CREATE TABLE IF NOT EXISTS webhook_subscriptions (
  id SERIAL PRIMARY KEY,
  integration_id VARCHAR(100) NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  webhook_url TEXT NOT NULL,
  secret_key TEXT,
  enabled BOOLEAN DEFAULT true,
  retry_count INTEGER DEFAULT 3,
  timeout_seconds INTEGER DEFAULT 30,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add external order tracking to sales_orders
ALTER TABLE sales_orders ADD COLUMN IF NOT EXISTS external_order_id VARCHAR(255) UNIQUE;
ALTER TABLE sales_orders ADD COLUMN IF NOT EXISTS source_platform VARCHAR(100);
ALTER TABLE sales_orders ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE sales_orders ADD COLUMN IF NOT EXISTS payment_date TIMESTAMP;
ALTER TABLE sales_orders ADD COLUMN IF NOT EXISTS tracking_number VARCHAR(255);
ALTER TABLE sales_orders ADD COLUMN IF NOT EXISTS shipping_status VARCHAR(50);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_integrations_status ON integrations(status);
CREATE INDEX IF NOT EXISTS idx_integrations_category ON integrations(category);
CREATE INDEX IF NOT EXISTS idx_integrations_enabled ON integrations(enabled);
CREATE INDEX IF NOT EXISTS idx_integration_logs_integration_id ON integration_logs(integration_id);
CREATE INDEX IF NOT EXISTS idx_integration_logs_created_at ON integration_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_integration_logs_status ON integration_logs(status);
CREATE INDEX IF NOT EXISTS idx_integration_mappings_integration_id ON integration_mappings(integration_id);
CREATE INDEX IF NOT EXISTS idx_integration_mappings_entity ON integration_mappings(entity_type, external_id);
CREATE INDEX IF NOT EXISTS idx_webhook_subscriptions_integration ON webhook_subscriptions(integration_id);
CREATE INDEX IF NOT EXISTS idx_sales_orders_external_id ON sales_orders(external_order_id);
CREATE INDEX IF NOT EXISTS idx_sales_orders_source_platform ON sales_orders(source_platform);

-- Insert sample integrations
INSERT INTO integrations (integration_id, name, category, status, enabled, sync_count, last_sync_at) VALUES
('tokopedia', 'Tokopedia', 'ecommerce', 'active', true, 1245, NOW()),
('shopee', 'Shopee', 'ecommerce', 'active', true, 892, NOW()),
('midtrans', 'Midtrans', 'payment', 'active', true, 2341, NOW()),
('jne', 'JNE Express', 'logistics', 'active', true, 567, NOW()),
('webhook-custom', 'Custom Webhooks', 'webhook', 'active', true, 5, NOW())
ON CONFLICT (integration_id) DO NOTHING;

-- Insert sample integration logs
INSERT INTO integration_logs (integration_id, action, status, details, created_at) VALUES
('tokopedia', 'sync', 'success', '{"orders_synced": 25, "products_updated": 12}', NOW() - INTERVAL '2 hours'),
('shopee', 'sync', 'success', '{"orders_synced": 18, "inventory_updated": 34}', NOW() - INTERVAL '1 hour'),
('midtrans', 'payment_notification', 'success', '{"transaction_id": "TRX-12345", "amount": 150000}', NOW() - INTERVAL '30 minutes'),
('jne', 'tracking_update', 'success', '{"tracking_number": "JNE123456789", "status": "delivered"}', NOW() - INTERVAL '15 minutes'),
('webhook-custom', 'order_created', 'received', '{"order_id": "ORD-001", "total": 500000}', NOW() - INTERVAL '5 minutes');

-- Add comments
COMMENT ON TABLE integrations IS 'Store third-party integration configurations';
COMMENT ON TABLE integration_logs IS 'Log all integration activities and API calls';
COMMENT ON TABLE integration_mappings IS 'Map external IDs to internal entity IDs';
COMMENT ON TABLE webhook_subscriptions IS 'Configure webhook event subscriptions';
COMMENT ON COLUMN sales_orders.external_order_id IS 'Order ID from external e-commerce platform';
COMMENT ON COLUMN sales_orders.source_platform IS 'Platform where order originated (tokopedia, shopee, etc)';
