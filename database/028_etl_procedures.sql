-- =====================================================
-- ETL Pipeline Procedures
-- Phase 6 - Task 7: Data Warehouse ETL
-- =====================================================
-- Purpose: Extract-Transform-Load procedures to populate
--          data warehouse from operational tables
-- =====================================================

-- =====================================================
-- ETL PROCEDURE: Load dim_product
-- =====================================================

CREATE OR REPLACE FUNCTION etl_load_dim_product()
RETURNS TABLE(rows_inserted INTEGER, rows_updated INTEGER) AS $$
DECLARE
    v_job_log_id INTEGER;
    v_start_time TIMESTAMP;
    v_rows_inserted INTEGER := 0;
    v_rows_updated INTEGER := 0;
BEGIN
    v_start_time := CURRENT_TIMESTAMP;
    
    -- Log job start
    INSERT INTO etl_job_log (job_name, job_type, status, start_time)
    VALUES ('load_dim_product', 'dimension', 'running', v_start_time)
    RETURNING job_log_id INTO v_job_log_id;
    
    -- SCD Type 2: Expire changed records
    UPDATE dim_product dp
    SET 
        effective_end_date = CURRENT_DATE - 1,
        is_current = FALSE
    FROM products p
    WHERE dp.product_id = p.product_id
        AND dp.is_current = TRUE
        AND (
            dp.product_code != COALESCE(p.product_code, '')
            OR dp.product_name != p.product_name
            OR COALESCE(dp.unit_price, 0) != COALESCE(p.price, 0)
            OR dp.is_active != COALESCE(p.is_active, TRUE)
        );
    
    GET DIAGNOSTICS v_rows_updated = ROW_COUNT;
    
    -- Insert new or changed records
    INSERT INTO dim_product (
        product_id,
        product_code,
        product_name,
        description,
        category,
        subcategory,
        brand,
        product_type,
        unit_price,
        cost_price,
        margin_percentage,
        unit_of_measure,
        reorder_level,
        safety_stock,
        is_active,
        is_discontinued,
        effective_start_date,
        is_current,
        version
    )
    SELECT 
        p.product_id,
        COALESCE(p.product_code, ''),
        p.product_name,
        p.description,
        COALESCE(p.category, 'Uncategorized'),
        p.subcategory,
        p.brand,
        p.product_type,
        p.price,
        p.cost,
        CASE 
            WHEN p.price > 0 THEN ((p.price - COALESCE(p.cost, 0)) / p.price * 100)
            ELSE 0
        END,
        p.unit_of_measure,
        p.reorder_level,
        p.safety_stock,
        COALESCE(p.is_active, TRUE),
        FALSE,
        CURRENT_DATE,
        TRUE,
        COALESCE(
            (SELECT MAX(version) + 1 FROM dim_product WHERE product_id = p.product_id),
            1
        )
    FROM products p
    WHERE NOT EXISTS (
        SELECT 1 FROM dim_product dp
        WHERE dp.product_id = p.product_id
            AND dp.is_current = TRUE
            AND dp.product_code = COALESCE(p.product_code, '')
            AND dp.product_name = p.product_name
            AND COALESCE(dp.unit_price, 0) = COALESCE(p.price, 0)
            AND dp.is_active = COALESCE(p.is_active, TRUE)
    );
    
    GET DIAGNOSTICS v_rows_inserted = ROW_COUNT;
    
    -- Update job log
    UPDATE etl_job_log
    SET 
        end_time = CURRENT_TIMESTAMP,
        duration_seconds = EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - v_start_time)),
        status = 'completed',
        rows_inserted = v_rows_inserted,
        rows_updated = v_rows_updated
    WHERE job_log_id = v_job_log_id;
    
    RETURN QUERY SELECT v_rows_inserted, v_rows_updated;
    
EXCEPTION
    WHEN OTHERS THEN
        UPDATE etl_job_log
        SET 
            end_time = CURRENT_TIMESTAMP,
            status = 'failed',
            error_message = SQLERRM
        WHERE job_log_id = v_job_log_id;
        RAISE;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ETL PROCEDURE: Load dim_customer
-- =====================================================

CREATE OR REPLACE FUNCTION etl_load_dim_customer()
RETURNS TABLE(rows_inserted INTEGER, rows_updated INTEGER) AS $$
DECLARE
    v_job_log_id INTEGER;
    v_start_time TIMESTAMP;
    v_rows_inserted INTEGER := 0;
    v_rows_updated INTEGER := 0;
BEGIN
    v_start_time := CURRENT_TIMESTAMP;
    
    INSERT INTO etl_job_log (job_name, job_type, status, start_time)
    VALUES ('load_dim_customer', 'dimension', 'running', v_start_time)
    RETURNING job_log_id INTO v_job_log_id;
    
    -- SCD Type 2: Expire changed records
    UPDATE dim_customer dc
    SET 
        effective_end_date = CURRENT_DATE - 1,
        is_current = FALSE
    FROM customers c
    WHERE dc.customer_id = c.customer_id
        AND dc.is_current = TRUE
        AND (
            dc.customer_name != c.customer_name
            OR COALESCE(dc.customer_type, '') != COALESCE(c.customer_type, '')
            OR COALESCE(dc.city, '') != COALESCE(c.city, '')
        );
    
    GET DIAGNOSTICS v_rows_updated = ROW_COUNT;
    
    -- Insert new or changed records
    INSERT INTO dim_customer (
        customer_id,
        customer_name,
        customer_type,
        customer_segment,
        email,
        phone,
        address_line1,
        address_line2,
        city,
        state_province,
        postal_code,
        country,
        region,
        credit_limit,
        payment_terms,
        is_active,
        effective_start_date,
        is_current,
        version
    )
    SELECT 
        c.customer_id,
        c.customer_name,
        c.customer_type,
        CASE 
            WHEN total_spent > 100000 THEN 'VIP'
            WHEN total_spent > 50000 THEN 'Premium'
            WHEN total_spent > 10000 THEN 'Standard'
            ELSE 'New'
        END,
        c.email,
        c.phone,
        c.address_line1,
        c.address_line2,
        c.city,
        c.state_province,
        c.postal_code,
        c.country,
        COALESCE(c.region, 'Unknown'),
        c.credit_limit,
        c.payment_terms,
        COALESCE(c.is_active, TRUE),
        CURRENT_DATE,
        TRUE,
        COALESCE(
            (SELECT MAX(version) + 1 FROM dim_customer WHERE customer_id = c.customer_id),
            1
        )
    FROM customers c
    LEFT JOIN (
        SELECT customer_id, SUM(total_amount) as total_spent
        FROM sales_orders
        WHERE status = 'completed'
        GROUP BY customer_id
    ) so ON c.customer_id = so.customer_id
    WHERE NOT EXISTS (
        SELECT 1 FROM dim_customer dc
        WHERE dc.customer_id = c.customer_id
            AND dc.is_current = TRUE
            AND dc.customer_name = c.customer_name
            AND COALESCE(dc.city, '') = COALESCE(c.city, '')
    );
    
    GET DIAGNOSTICS v_rows_inserted = ROW_COUNT;
    
    UPDATE etl_job_log
    SET 
        end_time = CURRENT_TIMESTAMP,
        duration_seconds = EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - v_start_time)),
        status = 'completed',
        rows_inserted = v_rows_inserted,
        rows_updated = v_rows_updated
    WHERE job_log_id = v_job_log_id;
    
    RETURN QUERY SELECT v_rows_inserted, v_rows_updated;
    
EXCEPTION
    WHEN OTHERS THEN
        UPDATE etl_job_log
        SET end_time = CURRENT_TIMESTAMP, status = 'failed', error_message = SQLERRM
        WHERE job_log_id = v_job_log_id;
        RAISE;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ETL PROCEDURE: Load dim_location
-- =====================================================

CREATE OR REPLACE FUNCTION etl_load_dim_location()
RETURNS INTEGER AS $$
DECLARE
    v_job_log_id INTEGER;
    v_rows_inserted INTEGER := 0;
BEGIN
    INSERT INTO etl_job_log (job_name, job_type, status, start_time)
    VALUES ('load_dim_location', 'dimension', 'running', CURRENT_TIMESTAMP)
    RETURNING job_log_id INTO v_job_log_id;
    
    -- Insert/Update locations from warehouses
    INSERT INTO dim_location (
        location_id,
        location_code,
        location_name,
        location_type,
        address_line1,
        city,
        state_province,
        country,
        is_active
    )
    SELECT 
        warehouse_id,
        warehouse_code,
        warehouse_name,
        'warehouse',
        address,
        city,
        state,
        country,
        is_active
    FROM warehouses
    ON CONFLICT (location_id) DO UPDATE
    SET 
        location_name = EXCLUDED.location_name,
        is_active = EXCLUDED.is_active,
        updated_at = CURRENT_TIMESTAMP;
    
    GET DIAGNOSTICS v_rows_inserted = ROW_COUNT;
    
    UPDATE etl_job_log
    SET 
        end_time = CURRENT_TIMESTAMP,
        status = 'completed',
        rows_inserted = v_rows_inserted
    WHERE job_log_id = v_job_log_id;
    
    RETURN v_rows_inserted;
    
EXCEPTION
    WHEN OTHERS THEN
        UPDATE etl_job_log
        SET end_time = CURRENT_TIMESTAMP, status = 'failed', error_message = SQLERRM
        WHERE job_log_id = v_job_log_id;
        RAISE;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ETL PROCEDURE: Load dim_supplier
-- =====================================================

CREATE OR REPLACE FUNCTION etl_load_dim_supplier()
RETURNS INTEGER AS $$
DECLARE
    v_job_log_id INTEGER;
    v_rows_inserted INTEGER := 0;
BEGIN
    INSERT INTO etl_job_log (job_name, job_type, status, start_time)
    VALUES ('load_dim_supplier', 'dimension', 'running', CURRENT_TIMESTAMP)
    RETURNING job_log_id INTO v_job_log_id;
    
    INSERT INTO dim_supplier (
        supplier_id,
        supplier_name,
        supplier_code,
        contact_person,
        email,
        phone,
        address_line1,
        city,
        state_province,
        country,
        payment_terms,
        lead_time_days,
        is_active
    )
    SELECT 
        supplier_id,
        supplier_name,
        supplier_code,
        contact_person,
        email,
        phone,
        address,
        city,
        state,
        country,
        payment_terms,
        lead_time_days,
        is_active
    FROM suppliers
    ON CONFLICT (supplier_id) DO UPDATE
    SET 
        supplier_name = EXCLUDED.supplier_name,
        contact_person = EXCLUDED.contact_person,
        is_active = EXCLUDED.is_active,
        updated_at = CURRENT_TIMESTAMP;
    
    GET DIAGNOSTICS v_rows_inserted = ROW_COUNT;
    
    UPDATE etl_job_log
    SET 
        end_time = CURRENT_TIMESTAMP,
        status = 'completed',
        rows_inserted = v_rows_inserted
    WHERE job_log_id = v_job_log_id;
    
    RETURN v_rows_inserted;
    
EXCEPTION
    WHEN OTHERS THEN
        UPDATE etl_job_log
        SET end_time = CURRENT_TIMESTAMP, status = 'failed', error_message = SQLERRM
        WHERE job_log_id = v_job_log_id;
        RAISE;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ETL PROCEDURE: Load fact_sales (Incremental)
-- =====================================================

CREATE OR REPLACE FUNCTION etl_load_fact_sales()
RETURNS INTEGER AS $$
DECLARE
    v_job_log_id INTEGER;
    v_rows_inserted INTEGER := 0;
    v_last_load_date TIMESTAMP;
BEGIN
    -- Get last load timestamp
    SELECT last_load_date INTO v_last_load_date
    FROM etl_load_control
    WHERE table_name = 'fact_sales';
    
    IF v_last_load_date IS NULL THEN
        v_last_load_date := '2020-01-01'::TIMESTAMP;
    END IF;
    
    INSERT INTO etl_job_log (job_name, job_type, status, start_time)
    VALUES ('load_fact_sales', 'fact', 'running', CURRENT_TIMESTAMP)
    RETURNING job_log_id INTO v_job_log_id;
    
    -- Insert new sales records
    INSERT INTO fact_sales (
        time_key,
        product_key,
        customer_key,
        location_key,
        order_id,
        order_item_id,
        quantity,
        unit_price,
        discount_amount,
        tax_amount,
        gross_sales_amount,
        net_sales_amount,
        total_amount,
        unit_cost,
        total_cost,
        gross_margin,
        margin_percentage,
        order_status,
        order_type,
        payment_method,
        order_date,
        ship_date,
        delivery_date
    )
    SELECT 
        TO_CHAR(so.order_date, 'YYYYMMDD')::INTEGER,
        dp.product_key,
        dc.customer_key,
        NULL, -- location_key
        so.order_id,
        soi.order_item_id,
        soi.quantity,
        soi.unit_price,
        COALESCE(soi.discount_amount, 0),
        COALESCE(soi.tax_amount, 0),
        soi.quantity * soi.unit_price,
        (soi.quantity * soi.unit_price) - COALESCE(soi.discount_amount, 0),
        soi.total_price,
        COALESCE(p.cost, 0),
        soi.quantity * COALESCE(p.cost, 0),
        (soi.quantity * soi.unit_price) - COALESCE(soi.discount_amount, 0) - (soi.quantity * COALESCE(p.cost, 0)),
        CASE 
            WHEN (soi.quantity * soi.unit_price) - COALESCE(soi.discount_amount, 0) > 0 
            THEN (((soi.quantity * soi.unit_price) - COALESCE(soi.discount_amount, 0) - (soi.quantity * COALESCE(p.cost, 0))) / ((soi.quantity * soi.unit_price) - COALESCE(soi.discount_amount, 0)) * 100)
            ELSE 0
        END,
        so.status,
        'sales_order',
        so.payment_method,
        DATE(so.order_date),
        DATE(so.shipped_date),
        DATE(so.delivery_date)
    FROM sales_orders so
    JOIN sales_order_items soi ON so.order_id = soi.order_id
    JOIN products p ON soi.product_id = p.product_id
    JOIN dim_product dp ON p.product_id = dp.product_id AND dp.is_current = TRUE
    JOIN dim_customer dc ON so.customer_id = dc.customer_id AND dc.is_current = TRUE
    WHERE so.created_at > v_last_load_date
        AND NOT EXISTS (
            SELECT 1 FROM fact_sales fs
            WHERE fs.order_id = so.order_id
                AND fs.order_item_id = soi.order_item_id
        );
    
    GET DIAGNOSTICS v_rows_inserted = ROW_COUNT;
    
    -- Update load control
    INSERT INTO etl_load_control (table_name, last_load_date, last_extract_date)
    VALUES ('fact_sales', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT (table_name) DO UPDATE
    SET last_load_date = CURRENT_TIMESTAMP,
        last_extract_date = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP;
    
    UPDATE etl_job_log
    SET 
        end_time = CURRENT_TIMESTAMP,
        status = 'completed',
        rows_inserted = v_rows_inserted
    WHERE job_log_id = v_job_log_id;
    
    RETURN v_rows_inserted;
    
EXCEPTION
    WHEN OTHERS THEN
        UPDATE etl_job_log
        SET end_time = CURRENT_TIMESTAMP, status = 'failed', error_message = SQLERRM
        WHERE job_log_id = v_job_log_id;
        RAISE;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ETL PROCEDURE: Load fact_inventory (Daily Snapshot)
-- =====================================================

CREATE OR REPLACE FUNCTION etl_load_fact_inventory(snapshot_date DATE DEFAULT CURRENT_DATE)
RETURNS INTEGER AS $$
DECLARE
    v_job_log_id INTEGER;
    v_rows_inserted INTEGER := 0;
BEGIN
    INSERT INTO etl_job_log (job_name, job_type, status, start_time)
    VALUES ('load_fact_inventory', 'fact', 'running', CURRENT_TIMESTAMP)
    RETURNING job_log_id INTO v_job_log_id;
    
    -- Delete existing snapshot for the date (if re-running)
    DELETE FROM fact_inventory
    WHERE snapshot_date = snapshot_date;
    
    -- Insert daily inventory snapshot
    INSERT INTO fact_inventory (
        time_key,
        product_key,
        location_key,
        inventory_id,
        quantity_on_hand,
        quantity_reserved,
        quantity_available,
        unit_cost,
        total_value,
        is_stockout,
        is_below_reorder,
        snapshot_date
    )
    SELECT 
        TO_CHAR(snapshot_date, 'YYYYMMDD')::INTEGER,
        dp.product_key,
        dl.location_key,
        i.inventory_id,
        i.quantity_on_hand,
        COALESCE(i.quantity_reserved, 0),
        i.quantity_available,
        COALESCE(p.cost, 0),
        i.quantity_on_hand * COALESCE(p.cost, 0),
        i.quantity_on_hand <= 0,
        i.quantity_on_hand <= COALESCE(p.reorder_level, 0),
        snapshot_date
    FROM inventory i
    JOIN products p ON i.product_id = p.product_id
    JOIN dim_product dp ON p.product_id = dp.product_id AND dp.is_current = TRUE
    LEFT JOIN warehouses w ON i.warehouse_id = w.warehouse_id
    LEFT JOIN dim_location dl ON w.warehouse_id = dl.location_id;
    
    GET DIAGNOSTICS v_rows_inserted = ROW_COUNT;
    
    UPDATE etl_job_log
    SET 
        end_time = CURRENT_TIMESTAMP,
        status = 'completed',
        rows_inserted = v_rows_inserted
    WHERE job_log_id = v_job_log_id;
    
    RETURN v_rows_inserted;
    
EXCEPTION
    WHEN OTHERS THEN
        UPDATE etl_job_log
        SET end_time = CURRENT_TIMESTAMP, status = 'failed', error_message = SQLERRM
        WHERE job_log_id = v_job_log_id;
        RAISE;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ETL PROCEDURE: Refresh agg_monthly_sales
-- =====================================================

CREATE OR REPLACE FUNCTION etl_refresh_agg_monthly_sales()
RETURNS INTEGER AS $$
DECLARE
    v_job_log_id INTEGER;
    v_rows_inserted INTEGER := 0;
BEGIN
    INSERT INTO etl_job_log (job_name, job_type, status, start_time)
    VALUES ('refresh_agg_monthly_sales', 'aggregate', 'running', CURRENT_TIMESTAMP)
    RETURNING job_log_id INTO v_job_log_id;
    
    -- Delete and rebuild current month + last 3 months
    DELETE FROM agg_monthly_sales
    WHERE month_key >= TO_CHAR(CURRENT_DATE - INTERVAL '3 months', 'YYYYMM')::INTEGER;
    
    -- Aggregate monthly sales
    INSERT INTO agg_monthly_sales (
        month_key,
        product_key,
        customer_key,
        location_key,
        total_orders,
        total_items,
        total_quantity,
        total_gross_sales,
        total_discounts,
        total_net_sales,
        total_tax,
        total_revenue,
        total_cost,
        total_margin,
        avg_margin_percentage,
        avg_order_value,
        avg_items_per_order,
        year,
        month
    )
    SELECT 
        TO_CHAR(order_date, 'YYYYMM')::INTEGER,
        product_key,
        customer_key,
        location_key,
        COUNT(DISTINCT order_id),
        COUNT(*),
        SUM(quantity),
        SUM(gross_sales_amount),
        SUM(discount_amount),
        SUM(net_sales_amount),
        SUM(tax_amount),
        SUM(total_amount),
        SUM(total_cost),
        SUM(gross_margin),
        AVG(margin_percentage),
        AVG(total_amount),
        COUNT(*) * 1.0 / COUNT(DISTINCT order_id),
        EXTRACT(YEAR FROM order_date)::INTEGER,
        EXTRACT(MONTH FROM order_date)::INTEGER
    FROM fact_sales
    WHERE order_date >= CURRENT_DATE - INTERVAL '3 months'
    GROUP BY 
        TO_CHAR(order_date, 'YYYYMM')::INTEGER,
        product_key,
        customer_key,
        location_key,
        EXTRACT(YEAR FROM order_date),
        EXTRACT(MONTH FROM order_date);
    
    GET DIAGNOSTICS v_rows_inserted = ROW_COUNT;
    
    UPDATE etl_job_log
    SET 
        end_time = CURRENT_TIMESTAMP,
        status = 'completed',
        rows_inserted = v_rows_inserted
    WHERE job_log_id = v_job_log_id;
    
    RETURN v_rows_inserted;
    
EXCEPTION
    WHEN OTHERS THEN
        UPDATE etl_job_log
        SET end_time = CURRENT_TIMESTAMP, status = 'failed', error_message = SQLERRM
        WHERE job_log_id = v_job_log_id;
        RAISE;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ETL MASTER PROCEDURE: Run All ETL Jobs
-- =====================================================

CREATE OR REPLACE FUNCTION etl_run_all()
RETURNS TABLE(
    job_name VARCHAR,
    status VARCHAR,
    rows_affected INTEGER,
    duration_seconds INTEGER
) AS $$
DECLARE
    v_start_time TIMESTAMP := CURRENT_TIMESTAMP;
BEGIN
    -- Load dimensions first
    RAISE NOTICE 'Loading dimensions...';
    PERFORM etl_load_dim_product();
    PERFORM etl_load_dim_customer();
    PERFORM etl_load_dim_location();
    PERFORM etl_load_dim_supplier();
    
    -- Load facts
    RAISE NOTICE 'Loading facts...';
    PERFORM etl_load_fact_sales();
    PERFORM etl_load_fact_inventory();
    
    -- Refresh aggregates
    RAISE NOTICE 'Refreshing aggregates...';
    PERFORM etl_refresh_agg_monthly_sales();
    
    -- Return job summary
    RETURN QUERY
    SELECT 
        ejl.job_name::VARCHAR,
        ejl.status::VARCHAR,
        (ejl.rows_inserted + ejl.rows_updated)::INTEGER as rows_affected,
        ejl.duration_seconds::INTEGER
    FROM etl_job_log ejl
    WHERE ejl.start_time >= v_start_time
    ORDER BY ejl.start_time;
    
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- DATA QUALITY CHECK PROCEDURES
-- =====================================================

-- Check for NULL values in required fields
CREATE OR REPLACE FUNCTION etl_check_nulls(
    p_table_name VARCHAR,
    p_column_name VARCHAR
) RETURNS INTEGER AS $$
DECLARE
    v_null_count INTEGER;
    v_total_count INTEGER;
    v_check_id INTEGER;
BEGIN
    EXECUTE format('SELECT COUNT(*) FROM %I WHERE %I IS NULL', p_table_name, p_column_name)
    INTO v_null_count;
    
    EXECUTE format('SELECT COUNT(*) FROM %I', p_table_name)
    INTO v_total_count;
    
    INSERT INTO etl_data_quality (
        check_name,
        check_type,
        table_name,
        column_name,
        check_status,
        records_checked,
        records_failed,
        failure_percentage
    ) VALUES (
        'Null Check: ' || p_table_name || '.' || p_column_name,
        'null_check',
        p_table_name,
        p_column_name,
        CASE WHEN v_null_count = 0 THEN 'passed' ELSE 'failed' END,
        v_total_count,
        v_null_count,
        CASE WHEN v_total_count > 0 THEN (v_null_count * 100.0 / v_total_count) ELSE 0 END
    );
    
    RETURN v_null_count;
END;
$$ LANGUAGE plpgsql;

-- Check for duplicate records
CREATE OR REPLACE FUNCTION etl_check_duplicates(
    p_table_name VARCHAR,
    p_key_columns VARCHAR[]
) RETURNS INTEGER AS $$
DECLARE
    v_duplicate_count INTEGER;
    v_column_list TEXT;
BEGIN
    v_column_list := array_to_string(p_key_columns, ', ');
    
    EXECUTE format('
        SELECT COUNT(*) FROM (
            SELECT %s, COUNT(*) as cnt
            FROM %I
            GROUP BY %s
            HAVING COUNT(*) > 1
        ) duplicates
    ', v_column_list, p_table_name, v_column_list)
    INTO v_duplicate_count;
    
    INSERT INTO etl_data_quality (
        check_name,
        check_type,
        table_name,
        check_status,
        records_failed
    ) VALUES (
        'Duplicate Check: ' || p_table_name,
        'duplicate_check',
        p_table_name,
        CASE WHEN v_duplicate_count = 0 THEN 'passed' ELSE 'failed' END,
        v_duplicate_count
    );
    
    RETURN v_duplicate_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON FUNCTION etl_load_dim_product() IS 'Load product dimension with SCD Type 2 logic';
COMMENT ON FUNCTION etl_load_dim_customer() IS 'Load customer dimension with SCD Type 2 logic';
COMMENT ON FUNCTION etl_load_fact_sales() IS 'Incremental load of sales fact table';
COMMENT ON FUNCTION etl_load_fact_inventory() IS 'Daily snapshot load of inventory fact table';
COMMENT ON FUNCTION etl_refresh_agg_monthly_sales() IS 'Refresh monthly sales aggregate table';
COMMENT ON FUNCTION etl_run_all() IS 'Master procedure to run all ETL jobs in sequence';

-- =====================================================
-- END OF ETL PROCEDURES
-- =====================================================
