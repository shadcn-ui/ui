-- API Integrations System
-- Created: December 2025
-- Purpose: External API integrations (WhatsApp, Payment Gateways, Shipping)

-- Integration Providers
CREATE TABLE IF NOT EXISTS integration_providers (
    id SERIAL PRIMARY KEY,
    provider_code VARCHAR(50) UNIQUE NOT NULL,
    provider_name VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'messaging', 'payment', 'shipping', 'accounting'
    description TEXT,
    base_url VARCHAR(500),
    api_version VARCHAR(20),
    auth_type VARCHAR(50), -- 'api_key', 'oauth', 'bearer_token'
    config_schema JSONB, -- Required configuration fields
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Integration Configurations (per account/company)
CREATE TABLE IF NOT EXISTS integration_configs (
    id SERIAL PRIMARY KEY,
    provider_id INTEGER REFERENCES integration_providers(id),
    account_name VARCHAR(200),
    credentials JSONB NOT NULL, -- Encrypted credentials
    webhook_url VARCHAR(500),
    webhook_secret VARCHAR(200),
    settings JSONB, -- Provider-specific settings
    is_enabled BOOLEAN DEFAULT true,
    is_sandbox BOOLEAN DEFAULT false, -- Test mode
    last_sync_at TIMESTAMP,
    sync_status VARCHAR(50), -- 'connected', 'error', 'disconnected'
    sync_error TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- WhatsApp Messages Queue
CREATE TABLE IF NOT EXISTS whatsapp_messages (
    id SERIAL PRIMARY KEY,
    integration_id INTEGER REFERENCES integration_configs(id),
    recipient_phone VARCHAR(20) NOT NULL,
    recipient_name VARCHAR(200),
    message_type VARCHAR(50) DEFAULT 'text', -- 'text', 'template', 'image', 'document'
    template_name VARCHAR(100), -- For template messages
    template_params JSONB, -- Template parameters
    message_body TEXT,
    media_url VARCHAR(500),
    priority VARCHAR(20) DEFAULT 'normal', -- 'high', 'normal', 'low'
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'read', 'failed'
    provider_message_id VARCHAR(200), -- WhatsApp message ID
    error_message TEXT,
    scheduled_at TIMESTAMP,
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment Transactions
CREATE TABLE IF NOT EXISTS payment_transactions (
    id SERIAL PRIMARY KEY,
    integration_id INTEGER REFERENCES integration_configs(id),
    transaction_ref VARCHAR(100) UNIQUE NOT NULL,
    payment_gateway VARCHAR(50) NOT NULL, -- 'midtrans', 'xendit', 'manual'
    payment_method VARCHAR(50), -- 'bank_transfer', 'credit_card', 'qris', 'e_wallet'
    order_id INTEGER, -- Reference to sales_order or pos_transaction
    order_type VARCHAR(50), -- 'sales_order', 'pos_transaction'
    customer_id UUID REFERENCES customers(id),
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'IDR',
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'success', 'failed', 'expired'
    payment_url VARCHAR(500), -- Payment page URL
    provider_transaction_id VARCHAR(200),
    provider_response JSONB,
    expires_at TIMESTAMP,
    paid_at TIMESTAMP,
    callback_received_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shipping Integrations
CREATE TABLE IF NOT EXISTS shipping_orders (
    id SERIAL PRIMARY KEY,
    integration_id INTEGER REFERENCES integration_configs(id),
    tracking_number VARCHAR(100) UNIQUE NOT NULL,
    courier_code VARCHAR(50) NOT NULL, -- 'jne', 'jnt', 'sicepat', 'grab', 'gosend'
    service_type VARCHAR(50), -- 'regular', 'express', 'same_day'
    sales_order_id INTEGER, -- Reference to sales order
    sender_name VARCHAR(200),
    sender_phone VARCHAR(20),
    sender_address TEXT,
    sender_city VARCHAR(100),
    recipient_name VARCHAR(200) NOT NULL,
    recipient_phone VARCHAR(20) NOT NULL,
    recipient_address TEXT NOT NULL,
    recipient_city VARCHAR(100) NOT NULL,
    recipient_postal_code VARCHAR(10),
    weight_grams INTEGER NOT NULL,
    length_cm INTEGER,
    width_cm INTEGER,
    height_cm INTEGER,
    insurance_amount DECIMAL(15,2),
    cod_amount DECIMAL(15,2), -- Cash on Delivery
    shipping_cost DECIMAL(15,2),
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'picked_up', 'in_transit', 'delivered', 'failed'
    provider_tracking_url VARCHAR(500),
    provider_response JSONB,
    label_url VARCHAR(500), -- Shipping label PDF
    picked_up_at TIMESTAMP,
    delivered_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shipping Tracking History
CREATE TABLE IF NOT EXISTS shipping_tracking_history (
    id SERIAL PRIMARY KEY,
    shipping_order_id INTEGER REFERENCES shipping_orders(id) ON DELETE CASCADE,
    status VARCHAR(100) NOT NULL,
    description TEXT,
    location VARCHAR(200),
    timestamp TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Integration Webhooks (incoming)
CREATE TABLE IF NOT EXISTS integration_webhooks (
    id SERIAL PRIMARY KEY,
    integration_id INTEGER REFERENCES integration_configs(id),
    provider_code VARCHAR(50) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    signature VARCHAR(500), -- Webhook signature for verification
    is_verified BOOLEAN DEFAULT false,
    is_processed BOOLEAN DEFAULT false,
    processed_at TIMESTAMP,
    error_message TEXT,
    ip_address VARCHAR(50),
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Integration API Logs
CREATE TABLE IF NOT EXISTS integration_api_logs (
    id SERIAL PRIMARY KEY,
    integration_id INTEGER REFERENCES integration_configs(id),
    endpoint VARCHAR(500) NOT NULL,
    http_method VARCHAR(10) NOT NULL,
    request_headers JSONB,
    request_body JSONB,
    response_status INTEGER,
    response_body JSONB,
    execution_time_ms INTEGER,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_integration_configs_provider ON integration_configs(provider_id);
CREATE INDEX idx_whatsapp_messages_status ON whatsapp_messages(status, scheduled_at);
CREATE INDEX idx_whatsapp_messages_recipient ON whatsapp_messages(recipient_phone);
CREATE INDEX idx_payment_transactions_ref ON payment_transactions(transaction_ref);
CREATE INDEX idx_payment_transactions_order ON payment_transactions(order_id, order_type);
CREATE INDEX idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX idx_shipping_orders_tracking ON shipping_orders(tracking_number);
CREATE INDEX idx_shipping_orders_status ON shipping_orders(status);
CREATE INDEX idx_integration_webhooks_processed ON integration_webhooks(is_processed) WHERE is_processed = false;
CREATE INDEX idx_integration_api_logs_integration ON integration_api_logs(integration_id, created_at);

-- Seed Data: Integration Providers
INSERT INTO integration_providers (provider_code, provider_name, category, description, base_url, auth_type, config_schema) VALUES
('WHATSAPP_BUSINESS', 'WhatsApp Business API', 'messaging', 'Send WhatsApp messages via Business API', 'https://graph.facebook.com', 'bearer_token', 
 '{"fields": [{"name": "access_token", "required": true}, {"name": "phone_number_id", "required": true}, {"name": "business_account_id", "required": true}]}'),

('MIDTRANS', 'Midtrans Payment Gateway', 'payment', 'Indonesian payment gateway supporting multiple payment methods', 'https://api.midtrans.com', 'api_key',
 '{"fields": [{"name": "server_key", "required": true}, {"name": "client_key", "required": true}, {"name": "merchant_id", "required": false}]}'),

('XENDIT', 'Xendit Payment Gateway', 'payment', 'Indonesian payment gateway with e-wallet and QRIS support', 'https://api.xendit.co', 'api_key',
 '{"fields": [{"name": "secret_key", "required": true}, {"name": "public_key", "required": true}]}'),

('JNE', 'JNE Express', 'shipping', 'JNE shipping and logistics', 'https://apiv2.jne.co.id', 'api_key',
 '{"fields": [{"name": "api_key", "required": true}, {"name": "username", "required": true}]}'),

('JNT', 'J&T Express', 'shipping', 'J&T Express shipping', 'https://api.jet.co.id', 'api_key',
 '{"fields": [{"name": "api_key", "required": true}, {"name": "username", "required": true}]}'),

('SICEPAT', 'SiCepat Express', 'shipping', 'SiCepat shipping services', 'https://api.sicepat.com', 'api_key',
 '{"fields": [{"name": "api_key", "required": true}]}');

-- Auto-update timestamp
CREATE TRIGGER update_integration_configs_timestamp
    BEFORE UPDATE ON integration_configs
    FOR EACH ROW EXECUTE FUNCTION update_reporting_timestamp();

CREATE TRIGGER update_payment_transactions_timestamp
    BEFORE UPDATE ON payment_transactions
    FOR EACH ROW EXECUTE FUNCTION update_reporting_timestamp();

CREATE TRIGGER update_shipping_orders_timestamp
    BEFORE UPDATE ON shipping_orders
    FOR EACH ROW EXECUTE FUNCTION update_reporting_timestamp();

COMMENT ON TABLE integration_providers IS 'Available integration providers and their configuration requirements';
COMMENT ON TABLE integration_configs IS 'Company-specific integration configurations with credentials';
COMMENT ON TABLE whatsapp_messages IS 'WhatsApp message queue with delivery tracking';
COMMENT ON TABLE payment_transactions IS 'Payment gateway transactions for online orders';
COMMENT ON TABLE shipping_orders IS 'Shipping orders with courier integration';
COMMENT ON TABLE integration_webhooks IS 'Incoming webhooks from integration providers';
