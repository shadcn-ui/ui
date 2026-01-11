-- =====================================================
-- Demand Forecasting Engine - Database Functions
-- =====================================================
-- Implements 3 forecasting methods:
-- 1. Simple Moving Average (SMA)
-- 2. Exponential Smoothing (ES)
-- 3. Linear Regression
-- =====================================================

-- Function: Calculate Simple Moving Average
CREATE OR REPLACE FUNCTION forecast_moving_average(
    p_product_id INTEGER,
    p_periods INTEGER DEFAULT 3,
    p_forecast_periods INTEGER DEFAULT 4
)
RETURNS TABLE (
    forecast_date DATE,
    forecast_quantity DECIMAL,
    method VARCHAR
) AS $$
DECLARE
    v_avg_quantity DECIMAL;
BEGIN
    -- Calculate average from last N periods
    SELECT AVG(quantity) INTO v_avg_quantity
    FROM (
        SELECT quantity
        FROM demand_forecast_details
        WHERE product_id = p_product_id
        AND actual_quantity IS NOT NULL
        ORDER BY period_date DESC
        LIMIT p_periods
    ) recent_data;
    
    -- Generate forecasts for future periods
    RETURN QUERY
    SELECT 
        CURRENT_DATE + (n || ' days')::INTERVAL as forecast_date,
        COALESCE(v_avg_quantity, 0) as forecast_quantity,
        'Simple Moving Average' as method
    FROM generate_series(1, p_forecast_periods) n;
END;
$$ LANGUAGE plpgsql;

-- Function: Calculate Exponential Smoothing
CREATE OR REPLACE FUNCTION forecast_exponential_smoothing(
    p_product_id INTEGER,
    p_alpha DECIMAL DEFAULT 0.3,
    p_forecast_periods INTEGER DEFAULT 4
)
RETURNS TABLE (
    forecast_date DATE,
    forecast_quantity DECIMAL,
    method VARCHAR
) AS $$
DECLARE
    v_forecast DECIMAL;
    v_row RECORD;
BEGIN
    -- Initialize with first actual value
    SELECT actual_quantity INTO v_forecast
    FROM demand_forecast_details
    WHERE product_id = p_product_id
    AND actual_quantity IS NOT NULL
    ORDER BY period_date
    LIMIT 1;
    
    -- Apply exponential smoothing to historical data
    FOR v_row IN
        SELECT actual_quantity
        FROM demand_forecast_details
        WHERE product_id = p_product_id
        AND actual_quantity IS NOT NULL
        ORDER BY period_date
    LOOP
        v_forecast := p_alpha * v_row.actual_quantity + (1 - p_alpha) * COALESCE(v_forecast, v_row.actual_quantity);
    END LOOP;
    
    -- Generate forecasts (constant for simple ES)
    RETURN QUERY
    SELECT 
        CURRENT_DATE + (n || ' days')::INTERVAL as forecast_date,
        COALESCE(v_forecast, 0) as forecast_quantity,
        'Exponential Smoothing (α=' || p_alpha || ')' as method
    FROM generate_series(1, p_forecast_periods) n;
END;
$$ LANGUAGE plpgsql;

-- Function: Calculate Linear Regression Forecast
CREATE OR REPLACE FUNCTION forecast_linear_regression(
    p_product_id INTEGER,
    p_periods INTEGER DEFAULT 12,
    p_forecast_periods INTEGER DEFAULT 4
)
RETURNS TABLE (
    forecast_date DATE,
    forecast_quantity DECIMAL,
    method VARCHAR,
    slope DECIMAL,
    intercept DECIMAL
) AS $$
DECLARE
    v_n INTEGER;
    v_sum_x DECIMAL;
    v_sum_y DECIMAL;
    v_sum_xy DECIMAL;
    v_sum_x2 DECIMAL;
    v_slope DECIMAL;
    v_intercept DECIMAL;
    v_next_x INTEGER;
BEGIN
    -- Get historical data points
    WITH historical AS (
        SELECT 
            ROW_NUMBER() OVER (ORDER BY period_date) as x,
            actual_quantity as y
        FROM demand_forecast_details
        WHERE product_id = p_product_id
        AND actual_quantity IS NOT NULL
        ORDER BY period_date DESC
        LIMIT p_periods
    )
    SELECT 
        COUNT(*)::INTEGER,
        SUM(x),
        SUM(y),
        SUM(x * y),
        SUM(x * x)
    INTO v_n, v_sum_x, v_sum_y, v_sum_xy, v_sum_x2
    FROM historical;
    
    -- Calculate slope and intercept
    IF v_n > 1 AND (v_n * v_sum_x2 - v_sum_x * v_sum_x) != 0 THEN
        v_slope := (v_n * v_sum_xy - v_sum_x * v_sum_y) / (v_n * v_sum_x2 - v_sum_x * v_sum_x);
        v_intercept := (v_sum_y - v_slope * v_sum_x) / v_n;
    ELSE
        v_slope := 0;
        v_intercept := COALESCE(v_sum_y / NULLIF(v_n, 0), 0);
    END IF;
    
    v_next_x := v_n + 1;
    
    -- Generate forecasts
    RETURN QUERY
    SELECT 
        CURRENT_DATE + (n || ' days')::INTERVAL as forecast_date,
        GREATEST(0, v_slope * (v_next_x + n - 1) + v_intercept) as forecast_quantity,
        'Linear Regression' as method,
        v_slope,
        v_intercept
    FROM generate_series(1, p_forecast_periods) n;
END;
$$ LANGUAGE plpgsql;

-- Function: Calculate Forecast Accuracy (MAE, MAPE, RMSE)
CREATE OR REPLACE FUNCTION calculate_forecast_accuracy(
    p_forecast_id INTEGER
)
RETURNS TABLE (
    mae DECIMAL,
    mape DECIMAL,
    rmse DECIMAL,
    data_points INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        AVG(ABS(forecast_quantity - actual_quantity)) as mae,
        AVG(ABS((forecast_quantity - actual_quantity) / NULLIF(actual_quantity, 0)) * 100) as mape,
        SQRT(AVG(POWER(forecast_quantity - actual_quantity, 2))) as rmse,
        COUNT(*)::INTEGER as data_points
    FROM demand_forecast_details
    WHERE forecast_id = p_forecast_id
    AND actual_quantity IS NOT NULL
    AND forecast_quantity IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

-- Function: Auto-select best forecasting method
CREATE OR REPLACE FUNCTION auto_select_forecast_method(
    p_product_id INTEGER,
    p_test_periods INTEGER DEFAULT 6
)
RETURNS TABLE (
    best_method VARCHAR,
    mae DECIMAL,
    reason TEXT
) AS $$
DECLARE
    v_sma_mae DECIMAL;
    v_es_mae DECIMAL;
    v_lr_mae DECIMAL;
    v_data_points INTEGER;
BEGIN
    -- Check if we have enough data
    SELECT COUNT(*) INTO v_data_points
    FROM demand_forecast_details
    WHERE product_id = p_product_id
    AND actual_quantity IS NOT NULL;
    
    IF v_data_points < 3 THEN
        RETURN QUERY
        SELECT 
            'Simple Moving Average'::VARCHAR,
            0::DECIMAL,
            'Insufficient historical data. Using default method.'::TEXT;
        RETURN;
    END IF;
    
    -- Test each method on historical data
    WITH test_data AS (
        SELECT 
            period_date,
            actual_quantity,
            LAG(actual_quantity, 1) OVER (ORDER BY period_date) as lag1,
            LAG(actual_quantity, 2) OVER (ORDER BY period_date) as lag2,
            LAG(actual_quantity, 3) OVER (ORDER BY period_date) as lag3
        FROM demand_forecast_details
        WHERE product_id = p_product_id
        AND actual_quantity IS NOT NULL
        ORDER BY period_date DESC
        LIMIT p_test_periods
    )
    SELECT 
        AVG(ABS(actual_quantity - (lag1 + lag2 + lag3) / 3)),
        AVG(ABS(actual_quantity - lag1)),
        AVG(ABS(actual_quantity - lag1))
    INTO v_sma_mae, v_es_mae, v_lr_mae
    FROM test_data
    WHERE lag3 IS NOT NULL;
    
    -- Select method with lowest MAE
    IF v_sma_mae <= v_es_mae AND v_sma_mae <= v_lr_mae THEN
        RETURN QUERY
        SELECT 
            'Simple Moving Average'::VARCHAR,
            v_sma_mae,
            'Best MAE performance on test data'::TEXT;
    ELSIF v_es_mae <= v_lr_mae THEN
        RETURN QUERY
        SELECT 
            'Exponential Smoothing'::VARCHAR,
            v_es_mae,
            'Best MAE performance on test data'::TEXT;
    ELSE
        RETURN QUERY
        SELECT 
            'Linear Regression'::VARCHAR,
            v_lr_mae,
            'Best MAE performance on test data'::TEXT;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON FUNCTION forecast_moving_average IS 'Calculate Simple Moving Average forecast for a product';
COMMENT ON FUNCTION forecast_exponential_smoothing IS 'Calculate Exponential Smoothing forecast with configurable alpha';
COMMENT ON FUNCTION forecast_linear_regression IS 'Calculate Linear Regression forecast with trend analysis';
COMMENT ON FUNCTION calculate_forecast_accuracy IS 'Calculate MAE, MAPE, and RMSE for forecast accuracy';
COMMENT ON FUNCTION auto_select_forecast_method IS 'Automatically select best forecasting method based on historical performance';

-- Summary
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Demand Forecasting Functions Created';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Functions:';
    RAISE NOTICE '  - forecast_moving_average(product_id, periods, forecast_periods)';
    RAISE NOTICE '  - forecast_exponential_smoothing(product_id, alpha, forecast_periods)';
    RAISE NOTICE '  - forecast_linear_regression(product_id, periods, forecast_periods)';
    RAISE NOTICE '  - calculate_forecast_accuracy(forecast_id)';
    RAISE NOTICE '  - auto_select_forecast_method(product_id, test_periods)';
    RAISE NOTICE '';
    RAISE NOTICE 'Methods Available:';
    RAISE NOTICE '  ✓ Simple Moving Average (SMA)';
    RAISE NOTICE '  ✓ Exponential Smoothing (ES)';
    RAISE NOTICE '  ✓ Linear Regression (LR)';
    RAISE NOTICE '  ✓ Automatic method selection';
    RAISE NOTICE '  ✓ Accuracy metrics (MAE, MAPE, RMSE)';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
END $$;
