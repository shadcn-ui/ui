-- =====================================================
-- Enhanced Multi-Level BOM Explosion for Phase 2
-- =====================================================
-- This script enhances the BOM system to support:
-- 1. Multi-level BOM explosion (recursive traversal)
-- 2. Phantom BOM handling (components that don't stock)
-- 3. Component substitution logic
-- 4. Automatic work_order_materials population with full hierarchy
-- =====================================================

-- Add columns to bom_items if they don't exist
DO $$ 
BEGIN
    -- Add is_phantom flag (component doesn't go into inventory, explodes directly)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'bom_items' AND column_name = 'is_phantom') THEN
        ALTER TABLE bom_items ADD COLUMN is_phantom BOOLEAN DEFAULT false;
    END IF;
    
    -- Add component_product_id to link to products table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'bom_items' AND column_name = 'component_product_id') THEN
        ALTER TABLE bom_items ADD COLUMN component_product_id INTEGER REFERENCES products(id);
    END IF;
    
    -- Add level indicator for display purposes
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'bom_items' AND column_name = 'level_number') THEN
        ALTER TABLE bom_items ADD COLUMN level_number INTEGER DEFAULT 1;
    END IF;
    
    -- Add scrap percentage
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'bom_items' AND column_name = 'scrap_percentage') THEN
        ALTER TABLE bom_items ADD COLUMN scrap_percentage DECIMAL(5,2) DEFAULT 0;
    END IF;
    
    -- Add substitutable flag
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'bom_items' AND column_name = 'is_substitutable') THEN
        ALTER TABLE bom_items ADD COLUMN is_substitutable BOOLEAN DEFAULT false;
    END IF;
    
    -- Add substitute_product_ids (array of product IDs that can substitute)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'bom_items' AND column_name = 'substitute_product_ids') THEN
        ALTER TABLE bom_items ADD COLUMN substitute_product_ids INTEGER[] DEFAULT ARRAY[]::INTEGER[];
    END IF;
END $$;

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_bom_items_component_product ON bom_items(component_product_id);
CREATE INDEX IF NOT EXISTS idx_bom_items_phantom ON bom_items(is_phantom) WHERE is_phantom = true;
CREATE INDEX IF NOT EXISTS idx_bom_items_substitutable ON bom_items(is_substitutable) WHERE is_substitutable = true;

-- =====================================================
-- Function: Recursive Multi-Level BOM Explosion
-- =====================================================
-- This function explodes a BOM to all levels, handling:
-- - Phantom BOMs (components that explode directly)
-- - Multi-level assemblies
-- - Quantity calculations with scrap
-- - Circular reference detection
-- =====================================================

CREATE OR REPLACE FUNCTION explode_bom_multilevel(
    p_bom_id INTEGER,
    p_quantity DECIMAL DEFAULT 1,
    p_level INTEGER DEFAULT 0,
    p_path INTEGER[] DEFAULT ARRAY[]::INTEGER[]
)
RETURNS TABLE (
    bom_item_id INTEGER,
    component_product_id INTEGER,
    component_code VARCHAR,
    component_name VARCHAR,
    level_number INTEGER,
    quantity_required DECIMAL,
    unit VARCHAR,
    unit_cost DECIMAL,
    total_cost DECIMAL,
    is_phantom BOOLEAN,
    is_substitutable BOOLEAN,
    substitute_ids INTEGER[],
    bom_path INTEGER[],
    has_sub_bom BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE bom_tree AS (
        -- Base case: Direct components of the BOM
        SELECT 
            bi.id as bom_item_id,
            bi.component_product_id,
            bi.component_code,
            bi.component_name,
            COALESCE(bi.level_number, 1) as level_number,
            (bi.quantity * p_quantity * (1 + COALESCE(bi.scrap_percentage, 0) / 100)) as quantity_required,
            bi.unit,
            bi.unit_cost,
            (bi.quantity * p_quantity * (1 + COALESCE(bi.scrap_percentage, 0) / 100) * bi.unit_cost) as total_cost,
            COALESCE(bi.is_phantom, false) as is_phantom,
            COALESCE(bi.is_substitutable, false) as is_substitutable,
            COALESCE(bi.substitute_product_ids, ARRAY[]::INTEGER[]) as substitute_ids,
            p_path || bi.id as bom_path,
            EXISTS(
                SELECT 1 
                FROM bill_of_materials sub_bom 
                WHERE sub_bom.product_code = bi.component_code 
                AND sub_bom.status = 'active'
            ) as has_sub_bom,
            0 as current_level
        FROM bom_items bi
        WHERE bi.bom_id = p_bom_id
        AND NOT (bi.id = ANY(p_path)) -- Prevent circular references
        
        UNION ALL
        
        -- Recursive case: Components of sub-assemblies
        SELECT 
            bi.id,
            bi.component_product_id,
            bi.component_code,
            bi.component_name,
            bt.current_level + COALESCE(bi.level_number, 1),
            (bi.quantity * bt.quantity_required * (1 + COALESCE(bi.scrap_percentage, 0) / 100)),
            bi.unit,
            bi.unit_cost,
            (bi.quantity * bt.quantity_required * (1 + COALESCE(bi.scrap_percentage, 0) / 100) * bi.unit_cost),
            COALESCE(bi.is_phantom, false),
            COALESCE(bi.is_substitutable, false),
            COALESCE(bi.substitute_product_ids, ARRAY[]::INTEGER[]),
            bt.bom_path || bi.id,
            EXISTS(
                SELECT 1 
                FROM bill_of_materials sub_bom 
                WHERE sub_bom.product_code = bi.component_code 
                AND sub_bom.status = 'active'
            ),
            bt.current_level + 1
        FROM bom_tree bt
        JOIN bill_of_materials sub_bom ON sub_bom.product_code = bt.component_code 
            AND sub_bom.status = 'active'
        JOIN bom_items bi ON bi.bom_id = sub_bom.id
        WHERE bt.has_sub_bom = true
        AND NOT (bi.id = ANY(bt.bom_path)) -- Prevent circular references
        AND bt.current_level < 10 -- Prevent infinite recursion (max 10 levels)
    )
    SELECT 
        bt.bom_item_id,
        bt.component_product_id,
        bt.component_code,
        bt.component_name,
        bt.level_number,
        bt.quantity_required,
        bt.unit,
        bt.unit_cost,
        bt.total_cost,
        bt.is_phantom,
        bt.is_substitutable,
        bt.substitute_ids,
        bt.bom_path,
        bt.has_sub_bom
    FROM bom_tree bt
    WHERE NOT bt.is_phantom -- Filter out phantom items (they're exploded but not shown)
    ORDER BY bt.level_number, bt.component_code;
END;
$$ LANGUAGE plpgsql STABLE;

-- =====================================================
-- Function: Enhanced Work Order Materials Population
-- =====================================================
-- Replaces the simple trigger with multi-level BOM explosion
-- =====================================================

CREATE OR REPLACE FUNCTION populate_work_order_materials_multilevel()
RETURNS TRIGGER AS $$
DECLARE
    v_count INTEGER;
BEGIN
    -- Only populate if work order has a BOM and is in draft/ready status
    IF NEW.bom_id IS NOT NULL AND NEW.status IN ('draft', 'ready') THEN
        
        -- Delete existing materials if re-calculating
        DELETE FROM work_order_materials WHERE work_order_id = NEW.id;
        
        -- Insert materials using multi-level BOM explosion
        INSERT INTO work_order_materials (
            work_order_id, 
            product_id, 
            bom_item_id, 
            required_quantity, 
            unit_cost, 
            line_total, 
            status,
            notes
        )
        SELECT 
            NEW.id,
            COALESCE(bom.component_product_id, p.id),
            bom.bom_item_id,
            bom.quantity_required * NEW.quantity_to_produce,
            COALESCE(p.cost_price, bom.unit_cost, 0),
            (bom.quantity_required * NEW.quantity_to_produce) * COALESCE(p.cost_price, bom.unit_cost, 0),
            'pending',
            CASE 
                WHEN bom.level_number > 1 THEN 'Level ' || bom.level_number || ' component'
                WHEN bom.is_substitutable THEN 'Substitutable component'
                ELSE NULL
            END
        FROM explode_bom_multilevel(NEW.bom_id, 1) bom
        LEFT JOIN products p ON p.sku = bom.component_code OR p.id = bom.component_product_id
        ON CONFLICT DO NOTHING;
        
        GET DIAGNOSTICS v_count = ROW_COUNT;
        
        RAISE NOTICE 'Populated % materials for work order % using multi-level BOM explosion', 
            v_count, NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Replace the existing trigger
DROP TRIGGER IF EXISTS trigger_populate_wo_materials ON work_orders;
CREATE TRIGGER trigger_populate_wo_materials
    AFTER INSERT OR UPDATE OF bom_id, quantity_to_produce ON work_orders
    FOR EACH ROW
    WHEN (NEW.bom_id IS NOT NULL AND NEW.status IN ('draft', 'ready'))
    EXECUTE FUNCTION populate_work_order_materials_multilevel();

-- =====================================================
-- Function: Auto-Substitute Materials
-- =====================================================
-- Automatically substitute components when primary is out of stock
-- =====================================================

CREATE OR REPLACE FUNCTION auto_substitute_material(
    p_work_order_material_id INTEGER,
    p_check_inventory BOOLEAN DEFAULT true
)
RETURNS TABLE (
    substituted BOOLEAN,
    original_product_id INTEGER,
    substitute_product_id INTEGER,
    substitute_sku VARCHAR,
    substitute_name VARCHAR,
    available_quantity DECIMAL,
    message TEXT
) AS $$
DECLARE
    v_wom work_order_materials%ROWTYPE;
    v_bom_item bom_items%ROWTYPE;
    v_sub_id INTEGER;
    v_sub_product products%ROWTYPE;
    v_available DECIMAL;
BEGIN
    -- Get the work order material
    SELECT * INTO v_wom FROM work_order_materials WHERE id = p_work_order_material_id;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, NULL::INTEGER, NULL::INTEGER, NULL::VARCHAR, 
            NULL::VARCHAR, NULL::DECIMAL, 'Work order material not found'::TEXT;
        RETURN;
    END IF;
    
    -- Get the BOM item to check if substitution is allowed
    SELECT * INTO v_bom_item FROM bom_items WHERE id = v_wom.bom_item_id;
    
    IF NOT FOUND OR NOT v_bom_item.is_substitutable THEN
        RETURN QUERY SELECT false, v_wom.product_id, NULL::INTEGER, NULL::VARCHAR,
            NULL::VARCHAR, NULL::DECIMAL, 'Component is not substitutable'::TEXT;
        RETURN;
    END IF;
    
    -- Try each substitute in order
    FOREACH v_sub_id IN ARRAY v_bom_item.substitute_product_ids LOOP
        SELECT * INTO v_sub_product FROM products WHERE id = v_sub_id;
        
        IF FOUND THEN
            -- Check inventory if required
            IF p_check_inventory THEN
                SELECT COALESCE(SUM(quantity), 0) INTO v_available
                FROM inventory
                WHERE product_id = v_sub_id
                AND quantity > 0;
                
                IF v_available >= v_wom.required_quantity THEN
                    -- Update the work order material with substitute
                    UPDATE work_order_materials
                    SET product_id = v_sub_id,
                        unit_cost = COALESCE(v_sub_product.cost_price, v_wom.unit_cost),
                        line_total = v_wom.required_quantity * COALESCE(v_sub_product.cost_price, v_wom.unit_cost),
                        notes = COALESCE(notes || E'\n', '') || 
                            'Auto-substituted from original product. Substitute has ' || v_available || ' units available.'
                    WHERE id = p_work_order_material_id;
                    
                    RETURN QUERY SELECT true, v_wom.product_id, v_sub_id, 
                        v_sub_product.sku, v_sub_product.name, v_available,
                        'Successfully substituted with ' || v_sub_product.sku::TEXT;
                    RETURN;
                END IF;
            ELSE
                -- Don't check inventory, just substitute
                UPDATE work_order_materials
                SET product_id = v_sub_id,
                    unit_cost = COALESCE(v_sub_product.cost_price, v_wom.unit_cost),
                    line_total = v_wom.required_quantity * COALESCE(v_sub_product.cost_price, v_wom.unit_cost),
                    notes = COALESCE(notes || E'\n', '') || 'Substituted from original product.'
                WHERE id = p_work_order_material_id;
                
                RETURN QUERY SELECT true, v_wom.product_id, v_sub_id,
                    v_sub_product.sku, v_sub_product.name, NULL::DECIMAL,
                    'Successfully substituted with ' || v_sub_product.sku::TEXT;
                RETURN;
            END IF;
        END IF;
    END LOOP;
    
    -- No suitable substitute found
    RETURN QUERY SELECT false, v_wom.product_id, NULL::INTEGER, NULL::VARCHAR,
        NULL::VARCHAR, NULL::DECIMAL, 'No substitute available with sufficient inventory'::TEXT;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- Function: Get BOM Cost Rollup
-- =====================================================
-- Calculate total cost including all sub-levels
-- =====================================================

CREATE OR REPLACE FUNCTION get_bom_cost_rollup(p_bom_id INTEGER, p_quantity DECIMAL DEFAULT 1)
RETURNS TABLE (
    total_material_cost DECIMAL,
    total_labor_cost DECIMAL,
    total_overhead_cost DECIMAL,
    grand_total DECIMAL,
    component_count INTEGER,
    max_level INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        SUM(bom.total_cost) as total_material_cost,
        0::DECIMAL as total_labor_cost, -- Can be enhanced with routing costs
        0::DECIMAL as total_overhead_cost, -- Can be enhanced with overhead rates
        SUM(bom.total_cost) as grand_total,
        COUNT(*)::INTEGER as component_count,
        MAX(bom.level_number) as max_level
    FROM explode_bom_multilevel(p_bom_id, p_quantity) bom;
END;
$$ LANGUAGE plpgsql STABLE;

-- =====================================================
-- Create sample data for testing
-- =====================================================

-- Update existing BOM items with new columns (if products exist)
DO $$
DECLARE
    v_product_id INTEGER;
BEGIN
    -- Link existing bom_items to products by matching component_code with SKU
    FOR v_product_id IN 
        SELECT p.id 
        FROM products p 
        JOIN bom_items bi ON bi.component_code = p.sku 
        WHERE bi.component_product_id IS NULL
        LIMIT 10
    LOOP
        UPDATE bom_items bi
        SET component_product_id = p.id
        FROM products p
        WHERE bi.component_code = p.sku 
        AND bi.component_product_id IS NULL
        AND p.id = v_product_id;
    END LOOP;
    
    RAISE NOTICE 'Linked existing BOM items to products';
END $$;

-- Create some sample phantom BOM items for testing (optional)
-- Phantom items are typically sub-assemblies that don't go into inventory
-- For example: A "wheel assembly" that is immediately assembled into a chair

COMMENT ON FUNCTION explode_bom_multilevel IS 'Recursively explodes a BOM to all levels, handling phantom BOMs and substitutions';
COMMENT ON FUNCTION populate_work_order_materials_multilevel IS 'Populates work order materials using multi-level BOM explosion';
COMMENT ON FUNCTION auto_substitute_material IS 'Automatically substitutes a component with an approved alternative';
COMMENT ON FUNCTION get_bom_cost_rollup IS 'Calculates total cost of a BOM including all sub-levels';

COMMENT ON COLUMN bom_items.is_phantom IS 'If true, this component is not stocked separately but exploded to its sub-components';
COMMENT ON COLUMN bom_items.component_product_id IS 'Link to products table for inventory management';
COMMENT ON COLUMN bom_items.is_substitutable IS 'If true, this component can be substituted with alternatives';
COMMENT ON COLUMN bom_items.substitute_product_ids IS 'Array of product IDs that can substitute this component';
COMMENT ON COLUMN bom_items.scrap_percentage IS 'Expected scrap/waste percentage to add to required quantity';

-- =====================================================
-- Summary
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Enhanced Multi-Level BOM System Created';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Features:';
    RAISE NOTICE '  ✓ Recursive multi-level BOM explosion';
    RAISE NOTICE '  ✓ Phantom BOM handling';
    RAISE NOTICE '  ✓ Component substitution logic';
    RAISE NOTICE '  ✓ Scrap percentage calculations';
    RAISE NOTICE '  ✓ Circular reference detection';
    RAISE NOTICE '  ✓ Auto-populate work order materials';
    RAISE NOTICE '';
    RAISE NOTICE 'Functions Created:';
    RAISE NOTICE '  - explode_bom_multilevel(bom_id, quantity, level, path)';
    RAISE NOTICE '  - populate_work_order_materials_multilevel()';
    RAISE NOTICE '  - auto_substitute_material(material_id, check_inventory)';
    RAISE NOTICE '  - get_bom_cost_rollup(bom_id, quantity)';
    RAISE NOTICE '';
    RAISE NOTICE 'Columns Added to bom_items:';
    RAISE NOTICE '  - is_phantom (BOOLEAN)';
    RAISE NOTICE '  - component_product_id (INTEGER)';
    RAISE NOTICE '  - level_number (INTEGER)';
    RAISE NOTICE '  - scrap_percentage (DECIMAL)';
    RAISE NOTICE '  - is_substitutable (BOOLEAN)';
    RAISE NOTICE '  - substitute_product_ids (INTEGER[])';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
END $$;
