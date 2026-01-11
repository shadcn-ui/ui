-- =====================================================
-- Phase 3: Quality Management System - Business Functions
-- =====================================================
-- Purpose: Statistical Process Control and Quality Metrics
-- Functions: 6 functions for SPC and quality calculations

-- =====================================================
-- 1. Calculate Control Limits for SPC Chart
-- =====================================================

CREATE OR REPLACE FUNCTION calculate_control_limits(
    p_chart_id INTEGER,
    p_periods INTEGER DEFAULT 25 -- Number of recent samples to use
)
RETURNS TABLE (
    centerline DECIMAL(15,6),
    ucl DECIMAL(15,6), -- Upper Control Limit
    lcl DECIMAL(15,6), -- Lower Control Limit
    sigma DECIMAL(15,6)
) AS $$
DECLARE
    v_chart_type VARCHAR(50);
    v_sample_size INTEGER;
    v_avg DECIMAL(15,6);
    v_std_dev DECIMAL(15,6);
    v_avg_range DECIMAL(15,6);
    v_d2 DECIMAL(10,6); -- Control chart constant
    v_d3 DECIMAL(10,6);
    v_a2 DECIMAL(10,6);
BEGIN
    -- Get chart details
    SELECT sc.chart_type, sc.sample_size
    INTO v_chart_type, v_sample_size
    FROM spc_charts sc
    WHERE sc.id = p_chart_id;

    IF v_chart_type IS NULL THEN
        RAISE EXCEPTION 'SPC chart not found: %', p_chart_id;
    END IF;

    -- Get control chart constants (simplified for common sample sizes)
    v_d2 := CASE v_sample_size
        WHEN 2 THEN 1.128
        WHEN 3 THEN 1.693
        WHEN 4 THEN 2.059
        WHEN 5 THEN 2.326
        WHEN 6 THEN 2.534
        WHEN 7 THEN 2.704
        WHEN 8 THEN 2.847
        WHEN 9 THEN 2.970
        WHEN 10 THEN 3.078
        ELSE 3.0 -- Default approximation
    END;

    v_a2 := CASE v_sample_size
        WHEN 2 THEN 1.880
        WHEN 3 THEN 1.023
        WHEN 4 THEN 0.729
        WHEN 5 THEN 0.577
        WHEN 6 THEN 0.483
        WHEN 7 THEN 0.419
        WHEN 8 THEN 0.373
        WHEN 9 THEN 0.337
        WHEN 10 THEN 0.308
        ELSE 0.3 -- Default approximation
    END;

    IF v_chart_type = 'individuals' THEN
        -- Individuals chart (X chart)
        -- Calculate average and moving range
        SELECT 
            AVG(measured_value),
            STDDEV(measured_value)
        INTO v_avg, v_std_dev
        FROM (
            SELECT measured_value
            FROM spc_measurements
            WHERE chart_id = p_chart_id
            ORDER BY measurement_date DESC
            LIMIT p_periods
        ) recent;

        centerline := v_avg;
        sigma := COALESCE(v_std_dev, 0);
        ucl := v_avg + (3 * COALESCE(v_std_dev, 0));
        lcl := v_avg - (3 * COALESCE(v_std_dev, 0));

    ELSIF v_chart_type = 'xbar_r' THEN
        -- X-bar and R chart
        -- Calculate average of means and average range
        SELECT 
            AVG(sample_mean),
            AVG(sample_range)
        INTO v_avg, v_avg_range
        FROM (
            SELECT sample_mean, sample_range
            FROM spc_measurements
            WHERE chart_id = p_chart_id
              AND sample_mean IS NOT NULL
              AND sample_range IS NOT NULL
            ORDER BY measurement_date DESC
            LIMIT p_periods
        ) recent;

        centerline := v_avg;
        sigma := v_avg_range / v_d2;
        ucl := v_avg + (v_a2 * COALESCE(v_avg_range, 0));
        lcl := v_avg - (v_a2 * COALESCE(v_avg_range, 0));

    ELSIF v_chart_type IN ('p_chart', 'c_chart', 'u_chart') THEN
        -- Attribute charts
        SELECT 
            AVG(measured_value),
            STDDEV(measured_value)
        INTO v_avg, v_std_dev
        FROM (
            SELECT measured_value
            FROM spc_measurements
            WHERE chart_id = p_chart_id
            ORDER BY measurement_date DESC
            LIMIT p_periods
        ) recent;

        centerline := v_avg;
        sigma := COALESCE(v_std_dev, 0);
        ucl := v_avg + (3 * COALESCE(v_std_dev, 0));
        lcl := GREATEST(0, v_avg - (3 * COALESCE(v_std_dev, 0))); -- Can't be negative

    ELSE
        -- Default: treat as individuals
        SELECT 
            AVG(measured_value),
            STDDEV(measured_value)
        INTO v_avg, v_std_dev
        FROM (
            SELECT measured_value
            FROM spc_measurements
            WHERE chart_id = p_chart_id
            ORDER BY measurement_date DESC
            LIMIT p_periods
        ) recent;

        centerline := v_avg;
        sigma := COALESCE(v_std_dev, 0);
        ucl := v_avg + (3 * COALESCE(v_std_dev, 0));
        lcl := v_avg - (3 * COALESCE(v_std_dev, 0));
    END IF;

    RETURN QUERY SELECT centerline, ucl, lcl, sigma;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION calculate_control_limits IS 'Calculate UCL, LCL, and centerline for SPC chart based on recent data';

-- =====================================================
-- 2. Detect Out-of-Control Conditions (Western Electric Rules)
-- =====================================================

CREATE OR REPLACE FUNCTION detect_out_of_control(
    p_chart_id INTEGER,
    p_measurement_id INTEGER
)
RETURNS TABLE (
    is_out_of_control BOOLEAN,
    violated_rules INTEGER[],
    rule_descriptions TEXT[]
) AS $$
DECLARE
    v_centerline DECIMAL(15,6);
    v_ucl DECIMAL(15,6);
    v_lcl DECIMAL(15,6);
    v_sigma DECIMAL(15,6);
    v_value DECIMAL(15,6);
    v_violations INTEGER[] := ARRAY[]::INTEGER[];
    v_descriptions TEXT[] := ARRAY[]::TEXT[];
    v_recent_values DECIMAL(15,6)[];
    v_i INTEGER;
    v_count INTEGER;
    v_above_center INTEGER;
    v_below_center INTEGER;
    v_increasing INTEGER;
    v_decreasing INTEGER;
    v_alternating BOOLEAN;
BEGIN
    -- Get control limits
    SELECT cl.centerline, cl.ucl, cl.lcl, cl.sigma
    INTO v_centerline, v_ucl, v_lcl, v_sigma
    FROM calculate_control_limits(p_chart_id, 25) cl;

    -- Get the measurement value
    SELECT measured_value INTO v_value
    FROM spc_measurements
    WHERE id = p_measurement_id;

    IF v_value IS NULL THEN
        RETURN QUERY SELECT false, v_violations, v_descriptions;
        RETURN;
    END IF;

    -- Get recent 15 values including current
    SELECT ARRAY_AGG(measured_value ORDER BY measurement_date DESC)
    INTO v_recent_values
    FROM (
        SELECT measured_value, measurement_date
        FROM spc_measurements
        WHERE chart_id = p_chart_id
          AND id <= p_measurement_id
        ORDER BY measurement_date DESC
        LIMIT 15
    ) recent;

    -- Rule 1: One point beyond 3 sigma
    IF v_value > v_ucl OR v_value < v_lcl THEN
        v_violations := array_append(v_violations, 1);
        v_descriptions := array_append(v_descriptions, 'Point beyond 3 sigma control limit');
    END IF;

    -- Rule 2: Nine consecutive points on same side of centerline
    IF array_length(v_recent_values, 1) >= 9 THEN
        v_above_center := 0;
        v_below_center := 0;
        FOR v_i IN 1..9 LOOP
            IF v_recent_values[v_i] > v_centerline THEN
                v_above_center := v_above_center + 1;
            ELSIF v_recent_values[v_i] < v_centerline THEN
                v_below_center := v_below_center + 1;
            END IF;
        END LOOP;
        
        IF v_above_center = 9 OR v_below_center = 9 THEN
            v_violations := array_append(v_violations, 2);
            v_descriptions := array_append(v_descriptions, 'Nine consecutive points on same side of center');
        END IF;
    END IF;

    -- Rule 3: Six points in a row, all increasing or all decreasing
    IF array_length(v_recent_values, 1) >= 6 THEN
        v_increasing := 0;
        v_decreasing := 0;
        FOR v_i IN 1..5 LOOP
            IF v_recent_values[v_i] < v_recent_values[v_i+1] THEN
                v_increasing := v_increasing + 1;
            ELSIF v_recent_values[v_i] > v_recent_values[v_i+1] THEN
                v_decreasing := v_decreasing + 1;
            END IF;
        END LOOP;
        
        IF v_increasing = 5 OR v_decreasing = 5 THEN
            v_violations := array_append(v_violations, 3);
            v_descriptions := array_append(v_descriptions, 'Six consecutive points trending in same direction');
        END IF;
    END IF;

    -- Rule 5: Two out of three points beyond 2 sigma
    IF array_length(v_recent_values, 1) >= 3 THEN
        v_count := 0;
        FOR v_i IN 1..3 LOOP
            IF v_recent_values[v_i] > (v_centerline + 2 * v_sigma) OR 
               v_recent_values[v_i] < (v_centerline - 2 * v_sigma) THEN
                v_count := v_count + 1;
            END IF;
        END LOOP;
        
        IF v_count >= 2 THEN
            v_violations := array_append(v_violations, 5);
            v_descriptions := array_append(v_descriptions, 'Two of three points beyond 2 sigma');
        END IF;
    END IF;

    -- Rule 6: Four out of five points beyond 1 sigma
    IF array_length(v_recent_values, 1) >= 5 THEN
        v_count := 0;
        FOR v_i IN 1..5 LOOP
            IF v_recent_values[v_i] > (v_centerline + v_sigma) OR 
               v_recent_values[v_i] < (v_centerline - v_sigma) THEN
                v_count := v_count + 1;
            END IF;
        END LOOP;
        
        IF v_count >= 4 THEN
            v_violations := array_append(v_violations, 6);
            v_descriptions := array_append(v_descriptions, 'Four of five points beyond 1 sigma');
        END IF;
    END IF;

    -- Return results
    is_out_of_control := array_length(v_violations, 1) > 0;
    violated_rules := v_violations;
    rule_descriptions := v_descriptions;
    
    RETURN QUERY SELECT is_out_of_control, violated_rules, rule_descriptions;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION detect_out_of_control IS 'Detect out-of-control conditions using Western Electric rules';

-- =====================================================
-- 3. Calculate Process Capability (Cpk)
-- =====================================================

CREATE OR REPLACE FUNCTION calculate_cpk(
    p_chart_id INTEGER,
    p_periods INTEGER DEFAULT 30
)
RETURNS TABLE (
    cp DECIMAL(10,6),  -- Process Capability
    cpk DECIMAL(10,6), -- Process Capability Index
    pp DECIMAL(10,6),  -- Process Performance
    ppk DECIMAL(10,6), -- Process Performance Index
    interpretation TEXT
) AS $$
DECLARE
    v_mean DECIMAL(15,6);
    v_std_dev DECIMAL(15,6);
    v_usl DECIMAL(15,6);
    v_lsl DECIMAL(15,6);
    v_cp DECIMAL(10,6);
    v_cpk DECIMAL(10,6);
    v_cpu DECIMAL(10,6);
    v_cpl DECIMAL(10,6);
BEGIN
    -- Get specification limits from chart
    SELECT usl, lsl INTO v_usl, v_lsl
    FROM spc_charts
    WHERE id = p_chart_id;

    IF v_usl IS NULL AND v_lsl IS NULL THEN
        RAISE EXCEPTION 'No specification limits defined for chart %', p_chart_id;
    END IF;

    -- Calculate mean and standard deviation from recent measurements
    SELECT AVG(measured_value), STDDEV(measured_value)
    INTO v_mean, v_std_dev
    FROM (
        SELECT measured_value
        FROM spc_measurements
        WHERE chart_id = p_chart_id
        ORDER BY measurement_date DESC
        LIMIT p_periods
    ) recent;

    IF v_std_dev IS NULL OR v_std_dev = 0 THEN
        -- Not enough variation or data
        RETURN QUERY SELECT 
            NULL::DECIMAL(10,6),
            NULL::DECIMAL(10,6),
            NULL::DECIMAL(10,6),
            NULL::DECIMAL(10,6),
            'Insufficient data or no variation'::TEXT;
        RETURN;
    END IF;

    -- Calculate Cp (assumes centered process)
    IF v_usl IS NOT NULL AND v_lsl IS NOT NULL THEN
        v_cp := (v_usl - v_lsl) / (6 * v_std_dev);
    ELSE
        v_cp := NULL;
    END IF;

    -- Calculate Cpk (accounts for centering)
    IF v_usl IS NOT NULL THEN
        v_cpu := (v_usl - v_mean) / (3 * v_std_dev);
    ELSE
        v_cpu := NULL;
    END IF;

    IF v_lsl IS NOT NULL THEN
        v_cpl := (v_mean - v_lsl) / (3 * v_std_dev);
    ELSE
        v_cpl := NULL;
    END IF;

    v_cpk := LEAST(COALESCE(v_cpu, 999999), COALESCE(v_cpl, 999999));
    IF v_cpk = 999999 THEN
        v_cpk := NULL;
    END IF;

    -- Pp and Ppk are similar but use overall std dev (simplified here as same)
    
    -- Interpretation
    interpretation := CASE 
        WHEN v_cpk IS NULL THEN 'Cannot calculate - missing limits'
        WHEN v_cpk >= 2.0 THEN 'Excellent (World Class)'
        WHEN v_cpk >= 1.67 THEN 'Very Good (Six Sigma)'
        WHEN v_cpk >= 1.33 THEN 'Good (Capable)'
        WHEN v_cpk >= 1.0 THEN 'Adequate (Marginally Capable)'
        WHEN v_cpk >= 0.67 THEN 'Poor (Not Capable)'
        ELSE 'Very Poor (Highly Incapable)'
    END;

    RETURN QUERY SELECT v_cp, v_cpk, v_cp AS pp, v_cpk AS ppk, interpretation;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION calculate_cpk IS 'Calculate process capability indices (Cp, Cpk, Pp, Ppk)';

-- =====================================================
-- 4. Calculate First Pass Yield (FPY)
-- =====================================================

CREATE OR REPLACE FUNCTION calculate_first_pass_yield(
    p_product_id INTEGER DEFAULT NULL,
    p_start_date DATE DEFAULT NULL,
    p_end_date DATE DEFAULT NULL
)
RETURNS TABLE (
    product_id INTEGER,
    total_inspected DECIMAL(15,3),
    total_passed DECIMAL(15,3),
    first_pass_yield DECIMAL(5,2), -- Percentage
    dpmo DECIMAL(15,2) -- Defects Per Million Opportunities
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        i.product_id,
        SUM(i.quantity_inspected) AS total_inspected,
        SUM(i.quantity_accepted) AS total_passed,
        ROUND(
            (SUM(i.quantity_accepted) / NULLIF(SUM(i.quantity_inspected), 0) * 100)::NUMERIC,
            2
        ) AS first_pass_yield,
        ROUND(
            ((SUM(i.quantity_inspected) - SUM(i.quantity_accepted)) / NULLIF(SUM(i.quantity_inspected), 0) * 1000000)::NUMERIC,
            2
        ) AS dpmo
    FROM inspections i
    WHERE i.overall_result IN ('pass', 'fail')
      AND (p_product_id IS NULL OR i.product_id = p_product_id)
      AND (p_start_date IS NULL OR i.inspection_date >= p_start_date)
      AND (p_end_date IS NULL OR i.inspection_date <= p_end_date)
    GROUP BY i.product_id
    ORDER BY first_pass_yield DESC;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION calculate_first_pass_yield IS 'Calculate First Pass Yield and DPMO by product';

-- =====================================================
-- 5. Calculate Defect Rate
-- =====================================================

CREATE OR REPLACE FUNCTION calculate_defect_rate(
    p_start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    p_end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
    period_start DATE,
    period_end DATE,
    total_ncrs INTEGER,
    critical_ncrs INTEGER,
    major_ncrs INTEGER,
    minor_ncrs INTEGER,
    internal_ncrs INTEGER,
    supplier_ncrs INTEGER,
    customer_ncrs INTEGER,
    total_quantity_affected DECIMAL(15,3),
    total_cost_impact DECIMAL(15,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p_start_date AS period_start,
        p_end_date AS period_end,
        COUNT(*)::INTEGER AS total_ncrs,
        COUNT(CASE WHEN severity = 'critical' THEN 1 END)::INTEGER AS critical_ncrs,
        COUNT(CASE WHEN severity = 'major' THEN 1 END)::INTEGER AS major_ncrs,
        COUNT(CASE WHEN severity = 'minor' THEN 1 END)::INTEGER AS minor_ncrs,
        COUNT(CASE WHEN ncr_type = 'internal' THEN 1 END)::INTEGER AS internal_ncrs,
        COUNT(CASE WHEN ncr_type = 'supplier' THEN 1 END)::INTEGER AS supplier_ncrs,
        COUNT(CASE WHEN ncr_type = 'customer' THEN 1 END)::INTEGER AS customer_ncrs,
        SUM(COALESCE(quantity_affected, 0)) AS total_quantity_affected,
        SUM(COALESCE(cost_impact, 0)) AS total_cost_impact
    FROM ncrs
    WHERE detected_date >= p_start_date
      AND detected_date <= p_end_date;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION calculate_defect_rate IS 'Calculate defect statistics for a period';

-- =====================================================
-- 6. Calculate OQC (Outgoing Quality Control) Pass Rate
-- =====================================================

CREATE OR REPLACE FUNCTION calculate_oqc_pass_rate(
    p_start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    p_end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
    inspection_type VARCHAR(50),
    total_inspections BIGINT,
    passed_inspections BIGINT,
    failed_inspections BIGINT,
    pass_rate DECIMAL(5,2),
    total_quantity_inspected DECIMAL(15,3),
    total_quantity_accepted DECIMAL(15,3),
    total_quantity_rejected DECIMAL(15,3)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        i.inspection_type,
        COUNT(*) AS total_inspections,
        COUNT(CASE WHEN i.overall_result = 'pass' THEN 1 END) AS passed_inspections,
        COUNT(CASE WHEN i.overall_result = 'fail' THEN 1 END) AS failed_inspections,
        ROUND(
            (COUNT(CASE WHEN i.overall_result = 'pass' THEN 1 END)::NUMERIC / NULLIF(COUNT(*), 0) * 100),
            2
        ) AS pass_rate,
        SUM(i.quantity_inspected) AS total_quantity_inspected,
        SUM(i.quantity_accepted) AS total_quantity_accepted,
        SUM(i.quantity_rejected) AS total_quantity_rejected
    FROM inspections i
    WHERE i.inspection_date >= p_start_date
      AND i.inspection_date <= p_end_date
    GROUP BY i.inspection_type
    ORDER BY i.inspection_type;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION calculate_oqc_pass_rate IS 'Calculate pass rates by inspection type (incoming, in-process, final)';

-- =====================================================
-- Test Functions
-- =====================================================

-- Example: Create a test SPC chart and add measurements
DO $$
DECLARE
    v_chart_id INTEGER;
    v_measurement_id INTEGER;
    v_i INTEGER;
    v_value DECIMAL(15,6);
BEGIN
    -- Create test chart
    INSERT INTO spc_charts (
        chart_name,
        chart_code,
        chart_type,
        process_name,
        characteristic,
        unit_of_measure,
        target_value,
        usl,
        lsl,
        sample_size,
        created_by
    ) VALUES (
        'Shaft Diameter Test',
        'SHAFT-DIA-001',
        'individuals',
        'Turning Operation',
        'Shaft Diameter',
        'mm',
        25.000,
        25.050,
        24.950,
        1,
        1
    )
    RETURNING id INTO v_chart_id;

    -- Add sample measurements (normal process)
    FOR v_i IN 1..30 LOOP
        v_value := 25.000 + (random() - 0.5) * 0.03; -- Random around target
        
        INSERT INTO spc_measurements (
            chart_id,
            sample_number,
            measured_value,
            measured_by
        ) VALUES (
            v_chart_id,
            v_i,
            v_value,
            1
        );
    END LOOP;

    RAISE NOTICE 'Test SPC chart created with ID: %', v_chart_id;
    RAISE NOTICE 'Added 30 test measurements';
END $$;

-- =====================================================
-- End of Quality Management Functions
-- =====================================================
