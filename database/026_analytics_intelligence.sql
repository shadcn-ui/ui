-- =====================================================
-- Phase 6: Analytics & Intelligence System
-- Ocean ERP Database Schema
-- Created: December 3, 2025
-- Target: 88% Operations Capability
-- =====================================================

-- =====================================================
-- 1. KPI & METRICS MANAGEMENT
-- =====================================================

-- KPI Definitions (Catalog of available metrics)
CREATE TABLE IF NOT EXISTS kpi_definitions (
    id SERIAL PRIMARY KEY,
    kpi_code VARCHAR(100) UNIQUE NOT NULL,
    kpi_name VARCHAR(200) NOT NULL,
    kpi_category VARCHAR(50) NOT NULL CHECK (kpi_category IN (
        'financial', 'sales', 'operations', 'quality', 'logistics', 
        'inventory', 'production', 'customer', 'supplier', 'hr'
    )),
    description TEXT,
    calculation_method TEXT NOT NULL, -- SQL query or formula
    data_source VARCHAR(100), -- Table or view name
    unit_of_measure VARCHAR(50), -- 'USD', 'percent', 'days', 'count'
    target_value DECIMAL(15,2),
    target_operator VARCHAR(10) CHECK (target_operator IN ('>', '<', '>=', '<=', '=', 'between')),
    green_threshold DECIMAL(15,2), -- Performance thresholds
    yellow_threshold DECIMAL(15,2),
    red_threshold DECIMAL(15,2),
    aggregation_level VARCHAR(50) DEFAULT 'daily' CHECK (aggregation_level IN (
        'realtime', 'hourly', 'daily', 'weekly', 'monthly', 'quarterly', 'yearly'
    )),
    is_active BOOLEAN DEFAULT true,
    refresh_frequency_minutes INTEGER DEFAULT 60,
    owner_id INTEGER REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- KPI Metrics (Calculated values over time)
CREATE TABLE IF NOT EXISTS kpi_metrics (
    id SERIAL PRIMARY KEY,
    kpi_id INTEGER NOT NULL REFERENCES kpi_definitions(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL,
    metric_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    metric_value DECIMAL(20,4) NOT NULL,
    target_value DECIMAL(20,4),
    variance DECIMAL(20,4), -- metric_value - target_value
    variance_percent DECIMAL(10,2), -- (variance / target_value) * 100
    status VARCHAR(20) CHECK (status IN ('green', 'yellow', 'red', 'neutral')),
    
    -- Dimensional attributes
    dimension_product_id INTEGER,
    dimension_customer_id INTEGER,
    dimension_supplier_id INTEGER,
    dimension_location_id INTEGER,
    dimension_department VARCHAR(100),
    dimension_category VARCHAR(100),
    dimension_region VARCHAR(100),
    
    calculation_details JSONB, -- Store detailed breakdown
    notes TEXT,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    calculated_by INTEGER REFERENCES users(id),
    
    UNIQUE(kpi_id, metric_date, dimension_product_id, dimension_customer_id, 
           dimension_supplier_id, dimension_location_id, dimension_department)
);

-- KPI Alerts
CREATE TABLE IF NOT EXISTS kpi_alerts (
    id SERIAL PRIMARY KEY,
    kpi_id INTEGER NOT NULL REFERENCES kpi_definitions(id) ON DELETE CASCADE,
    metric_id INTEGER REFERENCES kpi_metrics(id),
    alert_type VARCHAR(50) NOT NULL CHECK (alert_type IN (
        'threshold_breach', 'trend_change', 'anomaly', 'target_missed', 'target_achieved'
    )),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('critical', 'warning', 'info')),
    alert_message TEXT NOT NULL,
    alert_date DATE NOT NULL,
    metric_value DECIMAL(20,4),
    threshold_value DECIMAL(20,4),
    is_resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMP,
    resolved_by INTEGER REFERENCES users(id),
    resolution_notes TEXT,
    notified_users INTEGER[], -- Array of user IDs
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 2. DASHBOARDS & WIDGETS
-- =====================================================

-- Dashboard Definitions
CREATE TABLE IF NOT EXISTS dashboards (
    id SERIAL PRIMARY KEY,
    dashboard_code VARCHAR(100) UNIQUE NOT NULL,
    dashboard_name VARCHAR(200) NOT NULL,
    dashboard_type VARCHAR(50) NOT NULL CHECK (dashboard_type IN (
        'executive', 'financial', 'sales', 'operations', 'logistics', 
        'inventory', 'production', 'quality', 'custom'
    )),
    description TEXT,
    is_default BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT false,
    owner_id INTEGER REFERENCES users(id),
    layout_config JSONB, -- Grid layout configuration
    refresh_interval_seconds INTEGER DEFAULT 300, -- 5 minutes
    allowed_roles TEXT[], -- Array of role names
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);

-- Dashboard Widgets
CREATE TABLE IF NOT EXISTS dashboard_widgets (
    id SERIAL PRIMARY KEY,
    dashboard_id INTEGER NOT NULL REFERENCES dashboards(id) ON DELETE CASCADE,
    widget_code VARCHAR(100) NOT NULL,
    widget_name VARCHAR(200) NOT NULL,
    widget_type VARCHAR(50) NOT NULL CHECK (widget_type IN (
        'kpi_card', 'chart_line', 'chart_bar', 'chart_pie', 'chart_area',
        'table', 'gauge', 'sparkline', 'trend', 'heatmap', 'funnel',
        'scorecard', 'list', 'map', 'calendar', 'custom'
    )),
    
    -- Data source
    data_source_type VARCHAR(50) NOT NULL CHECK (data_source_type IN (
        'kpi', 'query', 'api', 'static'
    )),
    kpi_id INTEGER REFERENCES kpi_definitions(id),
    query_sql TEXT,
    api_endpoint VARCHAR(500),
    static_data JSONB,
    
    -- Widget configuration
    widget_config JSONB NOT NULL, -- Chart options, colors, formatting
    filter_config JSONB, -- Available filters
    
    -- Layout
    grid_position_x INTEGER DEFAULT 0,
    grid_position_y INTEGER DEFAULT 0,
    grid_width INTEGER DEFAULT 4,
    grid_height INTEGER DEFAULT 3,
    
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    requires_drill_down BOOLEAN DEFAULT false,
    drill_down_config JSONB,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(dashboard_id, widget_code)
);

-- Dashboard Access Log
CREATE TABLE IF NOT EXISTS dashboard_access_log (
    id SERIAL PRIMARY KEY,
    dashboard_id INTEGER NOT NULL REFERENCES dashboards(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    access_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    access_duration_seconds INTEGER,
    filters_applied JSONB,
    ip_address INET,
    user_agent TEXT
);

-- =====================================================
-- 3. REPORTS & SCHEDULING
-- =====================================================

-- Report Templates
CREATE TABLE IF NOT EXISTS report_templates (
    id SERIAL PRIMARY KEY,
    report_code VARCHAR(100) UNIQUE NOT NULL,
    report_name VARCHAR(200) NOT NULL,
    report_category VARCHAR(50) NOT NULL CHECK (report_category IN (
        'financial', 'sales', 'operations', 'inventory', 'production',
        'quality', 'logistics', 'hr', 'custom'
    )),
    description TEXT,
    query_sql TEXT NOT NULL,
    report_format VARCHAR(20) DEFAULT 'pdf' CHECK (report_format IN ('pdf', 'excel', 'csv', 'html', 'json')),
    
    -- Parameters
    parameters JSONB, -- Define available parameters
    default_parameters JSONB,
    
    -- Layout
    template_layout JSONB, -- Header, footer, sections
    chart_configs JSONB, -- Chart definitions
    
    is_scheduled BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT false,
    owner_id INTEGER REFERENCES users(id),
    allowed_roles TEXT[],
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);

-- Report Schedules
CREATE TABLE IF NOT EXISTS report_schedules (
    id SERIAL PRIMARY KEY,
    report_template_id INTEGER NOT NULL REFERENCES report_templates(id) ON DELETE CASCADE,
    schedule_name VARCHAR(200) NOT NULL,
    schedule_frequency VARCHAR(50) NOT NULL CHECK (schedule_frequency IN (
        'daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'custom_cron'
    )),
    cron_expression VARCHAR(100), -- For custom schedules
    schedule_time TIME, -- Time of day to run
    schedule_day_of_week INTEGER, -- 0-6 (Sunday-Saturday)
    schedule_day_of_month INTEGER, -- 1-31
    
    parameters JSONB, -- Report parameters
    output_format VARCHAR(20) DEFAULT 'pdf',
    
    -- Distribution
    email_recipients TEXT[], -- Array of email addresses
    email_subject VARCHAR(500),
    email_body TEXT,
    
    is_active BOOLEAN DEFAULT true,
    last_run_at TIMESTAMP,
    next_run_at TIMESTAMP,
    last_run_status VARCHAR(50),
    last_run_error TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);

-- Report Execution History
CREATE TABLE IF NOT EXISTS report_executions (
    id SERIAL PRIMARY KEY,
    report_template_id INTEGER NOT NULL REFERENCES report_templates(id) ON DELETE CASCADE,
    report_schedule_id INTEGER REFERENCES report_schedules(id),
    execution_type VARCHAR(50) NOT NULL CHECK (execution_type IN ('scheduled', 'manual', 'api')),
    
    parameters_used JSONB,
    output_format VARCHAR(20),
    
    started_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    duration_seconds INTEGER,
    
    status VARCHAR(50) NOT NULL CHECK (status IN ('running', 'completed', 'failed', 'cancelled')),
    error_message TEXT,
    
    output_file_url TEXT,
    output_file_size_bytes BIGINT,
    rows_returned INTEGER,
    
    executed_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 4. PREDICTIVE ANALYTICS & FORECASTING
-- =====================================================

-- Forecasting Models
CREATE TABLE IF NOT EXISTS forecast_models (
    id SERIAL PRIMARY KEY,
    model_code VARCHAR(100) UNIQUE NOT NULL,
    model_name VARCHAR(200) NOT NULL,
    model_type VARCHAR(50) NOT NULL CHECK (model_type IN (
        'linear_regression', 'exponential_smoothing', 'arima', 'prophet',
        'moving_average', 'seasonal_decomposition', 'ml_custom'
    )),
    forecast_target VARCHAR(100) NOT NULL, -- What we're forecasting
    forecast_category VARCHAR(50) NOT NULL CHECK (forecast_category IN (
        'demand', 'revenue', 'inventory', 'cost', 'churn', 'quality'
    )),
    
    -- Model configuration
    model_parameters JSONB NOT NULL,
    training_data_source TEXT, -- SQL query or table name
    training_period_days INTEGER DEFAULT 365,
    forecast_horizon_days INTEGER DEFAULT 90,
    
    -- Performance metrics
    accuracy_mae DECIMAL(15,4), -- Mean Absolute Error
    accuracy_mape DECIMAL(10,4), -- Mean Absolute Percentage Error
    accuracy_rmse DECIMAL(15,4), -- Root Mean Square Error
    r_squared DECIMAL(10,4),
    
    last_trained_at TIMESTAMP,
    last_trained_records INTEGER,
    training_duration_seconds INTEGER,
    
    is_active BOOLEAN DEFAULT true,
    is_auto_retrain BOOLEAN DEFAULT false,
    retrain_frequency_days INTEGER DEFAULT 30,
    
    owner_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Forecast Results
CREATE TABLE IF NOT EXISTS forecast_results (
    id SERIAL PRIMARY KEY,
    model_id INTEGER NOT NULL REFERENCES forecast_models(id) ON DELETE CASCADE,
    forecast_date DATE NOT NULL,
    forecast_value DECIMAL(20,4) NOT NULL,
    confidence_interval_lower DECIMAL(20,4),
    confidence_interval_upper DECIMAL(20,4),
    confidence_level DECIMAL(5,2) DEFAULT 95.0, -- 95% confidence
    
    -- Dimensional attributes
    dimension_product_id INTEGER,
    dimension_customer_id INTEGER,
    dimension_location_id INTEGER,
    dimension_category VARCHAR(100),
    
    forecast_details JSONB, -- Additional breakdown
    
    actual_value DECIMAL(20,4), -- Filled in after date passes
    forecast_error DECIMAL(20,4), -- actual - forecast
    forecast_accuracy_percent DECIMAL(10,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(model_id, forecast_date, dimension_product_id, dimension_customer_id, dimension_location_id)
);

-- =====================================================
-- 5. ANOMALY DETECTION
-- =====================================================

-- Anomaly Detection Rules
CREATE TABLE IF NOT EXISTS anomaly_detection_rules (
    id SERIAL PRIMARY KEY,
    rule_code VARCHAR(100) UNIQUE NOT NULL,
    rule_name VARCHAR(200) NOT NULL,
    detection_method VARCHAR(50) NOT NULL CHECK (detection_method IN (
        'z_score', 'iqr', 'isolation_forest', 'moving_average',
        'seasonal_decomposition', 'threshold', 'custom'
    )),
    target_metric VARCHAR(100) NOT NULL,
    target_table VARCHAR(100),
    target_column VARCHAR(100),
    
    -- Detection parameters
    detection_parameters JSONB NOT NULL,
    sensitivity VARCHAR(20) DEFAULT 'medium' CHECK (sensitivity IN ('low', 'medium', 'high')),
    lookback_period_days INTEGER DEFAULT 30,
    
    -- Thresholds
    z_score_threshold DECIMAL(10,2) DEFAULT 3.0,
    iqr_multiplier DECIMAL(10,2) DEFAULT 1.5,
    percentage_threshold DECIMAL(10,2),
    
    is_active BOOLEAN DEFAULT true,
    check_frequency_minutes INTEGER DEFAULT 60,
    last_checked_at TIMESTAMP,
    
    owner_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Detected Anomalies
CREATE TABLE IF NOT EXISTS detected_anomalies (
    id SERIAL PRIMARY KEY,
    rule_id INTEGER NOT NULL REFERENCES anomaly_detection_rules(id) ON DELETE CASCADE,
    anomaly_type VARCHAR(50) NOT NULL CHECK (anomaly_type IN (
        'spike', 'drop', 'outlier', 'missing_data', 'pattern_break', 'trend_change'
    )),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
    
    detected_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    anomaly_date DATE NOT NULL,
    metric_name VARCHAR(200),
    
    expected_value DECIMAL(20,4),
    actual_value DECIMAL(20,4),
    deviation DECIMAL(20,4),
    deviation_percent DECIMAL(10,2),
    statistical_score DECIMAL(10,4), -- Z-score, IQR, etc.
    
    -- Context
    affected_entity_type VARCHAR(50), -- 'product', 'customer', 'order', etc.
    affected_entity_id INTEGER,
    affected_entity_name VARCHAR(255),
    
    anomaly_details JSONB,
    potential_causes TEXT[],
    
    -- Investigation
    is_investigated BOOLEAN DEFAULT false,
    investigated_at TIMESTAMP,
    investigated_by INTEGER REFERENCES users(id),
    investigation_notes TEXT,
    root_cause TEXT,
    
    -- Resolution
    is_resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMP,
    resolved_by INTEGER REFERENCES users(id),
    resolution_action TEXT,
    
    -- False positive tracking
    is_false_positive BOOLEAN DEFAULT false,
    false_positive_reason TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 6. DATA SNAPSHOTS & HISTORICAL TRACKING
-- =====================================================

-- Data Snapshots (Point-in-time captures)
CREATE TABLE IF NOT EXISTS data_snapshots (
    id SERIAL PRIMARY KEY,
    snapshot_type VARCHAR(50) NOT NULL CHECK (snapshot_type IN (
        'inventory', 'financial', 'sales', 'production', 'quality', 'custom'
    )),
    snapshot_date DATE NOT NULL,
    snapshot_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    snapshot_data JSONB NOT NULL, -- The actual snapshot
    data_source VARCHAR(100),
    record_count INTEGER,
    
    is_automated BOOLEAN DEFAULT true,
    frequency VARCHAR(50), -- 'daily', 'weekly', 'monthly', 'quarterly'
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    
    UNIQUE(snapshot_type, snapshot_date)
);

-- =====================================================
-- 7. EXECUTIVE SCORECARDS
-- =====================================================

-- Scorecard Definitions
CREATE TABLE IF NOT EXISTS executive_scorecards (
    id SERIAL PRIMARY KEY,
    scorecard_code VARCHAR(100) UNIQUE NOT NULL,
    scorecard_name VARCHAR(200) NOT NULL,
    scorecard_type VARCHAR(50) NOT NULL CHECK (scorecard_type IN (
        'balanced_scorecard', 'okr', 'kpi_dashboard', 'custom'
    )),
    description TEXT,
    
    -- Perspectives (for balanced scorecard)
    perspectives JSONB, -- e.g., ['Financial', 'Customer', 'Internal', 'Learning']
    
    time_period VARCHAR(50) DEFAULT 'monthly' CHECK (time_period IN (
        'daily', 'weekly', 'monthly', 'quarterly', 'yearly'
    )),
    
    owner_id INTEGER REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scorecard Objectives
CREATE TABLE IF NOT EXISTS scorecard_objectives (
    id SERIAL PRIMARY KEY,
    scorecard_id INTEGER NOT NULL REFERENCES executive_scorecards(id) ON DELETE CASCADE,
    objective_name VARCHAR(200) NOT NULL,
    perspective VARCHAR(100), -- 'Financial', 'Customer', etc.
    description TEXT,
    
    weight_percent DECIMAL(5,2) DEFAULT 25.0, -- Importance weighting
    target_value DECIMAL(15,2),
    current_value DECIMAL(15,2),
    
    kpi_ids INTEGER[], -- Array of KPI IDs that measure this objective
    
    status VARCHAR(20) CHECK (status IN ('on_track', 'at_risk', 'behind', 'achieved')),
    progress_percent DECIMAL(5,2),
    
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 8. BUSINESS INTELLIGENCE CACHE
-- =====================================================

-- Query Cache (for expensive BI queries)
CREATE TABLE IF NOT EXISTS bi_query_cache (
    id SERIAL PRIMARY KEY,
    cache_key VARCHAR(255) UNIQUE NOT NULL, -- MD5 of query + parameters
    query_type VARCHAR(50) NOT NULL,
    query_sql TEXT,
    query_parameters JSONB,
    
    result_data JSONB NOT NULL,
    result_count INTEGER,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    hit_count INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMP,
    
    execution_time_ms INTEGER
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- KPI Metrics
CREATE INDEX IF NOT EXISTS idx_kpi_metrics_kpi_date ON kpi_metrics(kpi_id, metric_date DESC);
CREATE INDEX IF NOT EXISTS idx_kpi_metrics_date ON kpi_metrics(metric_date DESC);
CREATE INDEX IF NOT EXISTS idx_kpi_metrics_product ON kpi_metrics(dimension_product_id) WHERE dimension_product_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_kpi_metrics_customer ON kpi_metrics(dimension_customer_id) WHERE dimension_customer_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_kpi_metrics_status ON kpi_metrics(status);

-- KPI Alerts
CREATE INDEX IF NOT EXISTS idx_kpi_alerts_kpi ON kpi_alerts(kpi_id);
CREATE INDEX IF NOT EXISTS idx_kpi_alerts_date ON kpi_alerts(alert_date DESC);
CREATE INDEX IF NOT EXISTS idx_kpi_alerts_unresolved ON kpi_alerts(is_resolved) WHERE is_resolved = false;

-- Dashboards
CREATE INDEX IF NOT EXISTS idx_dashboards_type ON dashboards(dashboard_type) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_dashboards_owner ON dashboards(owner_id);

-- Dashboard Widgets
CREATE INDEX IF NOT EXISTS idx_widgets_dashboard ON dashboard_widgets(dashboard_id, display_order);
CREATE INDEX IF NOT EXISTS idx_widgets_kpi ON dashboard_widgets(kpi_id) WHERE kpi_id IS NOT NULL;

-- Report Schedules
CREATE INDEX IF NOT EXISTS idx_report_schedules_next_run ON report_schedules(next_run_at) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_report_schedules_template ON report_schedules(report_template_id);

-- Report Executions
CREATE INDEX IF NOT EXISTS idx_report_executions_template ON report_executions(report_template_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_report_executions_status ON report_executions(status);

-- Forecast Results
CREATE INDEX IF NOT EXISTS idx_forecast_results_model_date ON forecast_results(model_id, forecast_date DESC);
CREATE INDEX IF NOT EXISTS idx_forecast_results_product ON forecast_results(dimension_product_id) WHERE dimension_product_id IS NOT NULL;

-- Anomalies
CREATE INDEX IF NOT EXISTS idx_anomalies_rule ON detected_anomalies(rule_id, detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_anomalies_date ON detected_anomalies(anomaly_date DESC);
CREATE INDEX IF NOT EXISTS idx_anomalies_unresolved ON detected_anomalies(is_resolved) WHERE is_resolved = false;
CREATE INDEX IF NOT EXISTS idx_anomalies_entity ON detected_anomalies(affected_entity_type, affected_entity_id);

-- Data Snapshots
CREATE INDEX IF NOT EXISTS idx_snapshots_type_date ON data_snapshots(snapshot_type, snapshot_date DESC);

-- BI Query Cache
CREATE INDEX IF NOT EXISTS idx_bi_cache_expires ON bi_query_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_bi_cache_type ON bi_query_cache(query_type);

-- =====================================================
-- MATERIALIZED VIEWS FOR PERFORMANCE
-- =====================================================

-- Daily Sales Summary (Refresh nightly)
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_daily_sales_summary AS
SELECT 
    DATE(created_at) as sale_date,
    COUNT(DISTINCT id) as order_count,
    COUNT(DISTINCT customer_id) as unique_customers,
    SUM(total_amount) as total_revenue,
    AVG(total_amount) as avg_order_value,
    SUM(CASE WHEN status = 'completed' THEN total_amount ELSE 0 END) as completed_revenue,
    SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_count
FROM sales_orders
WHERE created_at >= CURRENT_DATE - INTERVAL '2 years'
GROUP BY DATE(created_at);

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_daily_sales_date ON mv_daily_sales_summary(sale_date);

-- Product Performance Summary
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_product_performance AS
SELECT 
    p.id as product_id,
    p.name as product_name,
    p.sku,
    p.category,
    COUNT(DISTINCT soi.sales_order_id) as order_count,
    SUM(soi.quantity) as total_quantity_sold,
    SUM(soi.quantity * soi.unit_price) as total_revenue,
    AVG(soi.unit_price) as avg_selling_price,
    MAX(so.created_at) as last_sale_date,
    COALESCE(inv.quantity_on_hand, 0) as current_stock
FROM products p
LEFT JOIN sales_order_items soi ON p.id = soi.product_id
LEFT JOIN sales_orders so ON soi.sales_order_id = so.id AND so.status != 'cancelled'
LEFT JOIN LATERAL (
    SELECT SUM(quantity_on_hand) as quantity_on_hand
    FROM inventory
    WHERE product_id = p.id
) inv ON true
WHERE p.is_active = true
GROUP BY p.id, p.name, p.sku, p.category, inv.quantity_on_hand;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_product_perf_id ON mv_product_performance(product_id);

-- =====================================================
-- SEED DATA
-- =====================================================

-- Seed KPI Definitions
INSERT INTO kpi_definitions (kpi_code, kpi_name, kpi_category, description, calculation_method, data_source, unit_of_measure, target_value, target_operator, aggregation_level)
VALUES 
    ('revenue_daily', 'Daily Revenue', 'financial', 'Total revenue generated per day', 'SUM(total_amount) FROM sales_orders WHERE status = ''completed'' AND DATE(created_at) = :date', 'sales_orders', 'USD', 50000, '>=', 'daily'),
    ('orders_daily', 'Daily Orders', 'sales', 'Number of orders received per day', 'COUNT(*) FROM sales_orders WHERE DATE(created_at) = :date', 'sales_orders', 'count', 100, '>=', 'daily'),
    ('avg_order_value', 'Average Order Value', 'sales', 'Average revenue per order', 'AVG(total_amount) FROM sales_orders WHERE status = ''completed''', 'sales_orders', 'USD', 500, '>=', 'daily'),
    ('on_time_delivery', 'On-Time Delivery Rate', 'logistics', 'Percentage of shipments delivered on time', 'COUNT(CASE WHEN actual_delivery_date <= estimated_delivery_date THEN 1 END) / COUNT(*) * 100 FROM shipments WHERE status = ''delivered''', 'shipments', 'percent', 95, '>=', 'daily'),
    ('inventory_turnover', 'Inventory Turnover', 'inventory', 'How quickly inventory is sold', 'COGS / Average Inventory', 'inventory', 'ratio', 6, '>=', 'monthly'),
    ('gross_margin', 'Gross Margin', 'financial', 'Gross profit as percentage of revenue', '(Revenue - COGS) / Revenue * 100', 'sales_orders', 'percent', 40, '>=', 'monthly'),
    ('customer_acquisition', 'New Customers', 'customer', 'Number of new customers acquired', 'COUNT(DISTINCT id) FROM customers WHERE DATE(created_at) = :date', 'customers', 'count', 10, '>=', 'daily'),
    ('defect_rate', 'Quality Defect Rate', 'quality', 'Percentage of products with defects', 'COUNT(CASE WHEN status = ''rejected'' THEN 1 END) / COUNT(*) * 100 FROM quality_inspections', 'quality_inspections', 'percent', 2, '<=', 'daily'),
    ('production_efficiency', 'Production Efficiency', 'production', 'Actual output vs planned output', 'SUM(actual_quantity) / SUM(planned_quantity) * 100 FROM work_orders WHERE status = ''completed''', 'work_orders', 'percent', 90, '>=', 'daily'),
    ('stockout_rate', 'Stockout Rate', 'inventory', 'Percentage of products out of stock', 'COUNT(CASE WHEN quantity_on_hand = 0 THEN 1 END) / COUNT(*) * 100 FROM inventory', 'inventory', 'percent', 5, '<=', 'daily')
ON CONFLICT (kpi_code) DO NOTHING;

-- Seed Executive Dashboard
INSERT INTO dashboards (dashboard_code, dashboard_name, dashboard_type, description, is_default, is_public, display_order)
VALUES 
    ('exec_overview', 'Executive Overview', 'executive', 'High-level overview of key business metrics', true, true, 1),
    ('sales_dashboard', 'Sales Performance', 'sales', 'Sales metrics and pipeline analysis', false, true, 2),
    ('ops_dashboard', 'Operations Dashboard', 'operations', 'Production, inventory, and logistics metrics', false, true, 3),
    ('financial_dashboard', 'Financial Dashboard', 'financial', 'Revenue, costs, and profitability metrics', false, false, 4)
ON CONFLICT (dashboard_code) DO NOTHING;

-- Success Message
DO $$ 
BEGIN 
    RAISE NOTICE '✅ Phase 6 Analytics & Intelligence Schema Created Successfully!';
    RAISE NOTICE '📊 Tables: 20+ analytics tables + 2 materialized views';
    RAISE NOTICE '🎯 Features: KPIs, Dashboards, Reports, Forecasting, Anomaly Detection';
    RAISE NOTICE '📈 Seed Data: 10 KPI definitions, 4 default dashboards';
END $$;
