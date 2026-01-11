-- Skincare Manufacturing Enhancement Tables
-- Enhanced BOM system for skincare industry with regulatory compliance

-- Skincare Formulations Table (Enhanced BOM for skincare)
CREATE TABLE skincare_formulations (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    product_code VARCHAR(100) UNIQUE NOT NULL,
    version VARCHAR(20) DEFAULT '1.0',
    status VARCHAR(50) DEFAULT 'draft', -- draft, testing, approved, discontinued
    formulation_type VARCHAR(100), -- serum, cream, cleanser, toner, mask, oil, essence
    skin_type_target TEXT[], -- array of target skin types: dry, oily, sensitive, combination
    ph_level DECIMAL(3,2) DEFAULT 5.5, -- Target pH level for the product
    preservation_system VARCHAR(255), -- Preservation method used
    regulatory_status VARCHAR(100) DEFAULT 'pending', -- pending, bpom_approved, halal_certified, both_approved
    shelf_life_months INTEGER DEFAULT 24, -- Product shelf life in months
    batch_size INTEGER DEFAULT 1000, -- Standard batch size in grams
    total_cost DECIMAL(15,2) DEFAULT 0, -- Total cost per batch
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Skincare Ingredients Table (Enhanced BOM Items for skincare)
CREATE TABLE skincare_ingredients (
    id SERIAL PRIMARY KEY,
    formulation_id INTEGER NOT NULL REFERENCES skincare_formulations(id) ON DELETE CASCADE,
    ingredient_name VARCHAR(255) NOT NULL,
    inci_name VARCHAR(255), -- International Nomenclature of Cosmetic Ingredients
    cas_number VARCHAR(50), -- Chemical Abstracts Service registry number
    function_type VARCHAR(100), -- active, base, emulsifier, preservative, fragrance, colorant, stabilizer, humectant
    percentage DECIMAL(5,2) NOT NULL, -- Percentage of ingredient in formulation
    quantity_grams DECIMAL(10,3) NOT NULL, -- Quantity needed for batch size
    unit_cost DECIMAL(15,2) DEFAULT 0, -- Cost per gram
    total_cost DECIMAL(15,2) DEFAULT 0, -- Total cost for this ingredient in batch
    supplier_name VARCHAR(255),
    safety_rating CHAR(1) DEFAULT 'B', -- A=excellent, B=good, C=caution
    allergenic_potential BOOLEAN DEFAULT false, -- Known allergen potential
    pregnancy_safe BOOLEAN DEFAULT true, -- Safe for pregnant women
    halal_certified BOOLEAN DEFAULT false, -- Halal certification status
    vegan_approved BOOLEAN DEFAULT false, -- Vegan-friendly ingredient
    organic_certified BOOLEAN DEFAULT false, -- Organic certification
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Product Quality Tests Table (for batch testing and quality control)
CREATE TABLE product_quality_tests (
    id SERIAL PRIMARY KEY,
    formulation_id INTEGER NOT NULL REFERENCES skincare_formulations(id),
    batch_number VARCHAR(100) NOT NULL,
    test_date DATE NOT NULL,
    test_type VARCHAR(100) NOT NULL, -- microbiological, stability, ph, viscosity, appearance
    test_result VARCHAR(50) NOT NULL, -- pass, fail, conditional
    test_value DECIMAL(10,3), -- Numerical test result if applicable
    test_range VARCHAR(100), -- Expected range for the test
    tested_by VARCHAR(255),
    notes TEXT,
    certificate_url TEXT, -- Link to certificate of analysis
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Regulatory Compliance Tracking Table
CREATE TABLE regulatory_compliance (
    id SERIAL PRIMARY KEY,
    formulation_id INTEGER NOT NULL REFERENCES skincare_formulations(id),
    compliance_type VARCHAR(100) NOT NULL, -- bpom, halal, organic, vegan, etc.
    certificate_number VARCHAR(255),
    issued_date DATE,
    expiry_date DATE,
    issuing_authority VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, expired
    certificate_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Production Batches Table (for tracking actual production runs)
CREATE TABLE production_batches (
    id SERIAL PRIMARY KEY,
    formulation_id INTEGER NOT NULL REFERENCES skincare_formulations(id),
    batch_number VARCHAR(100) UNIQUE NOT NULL,
    work_order_id INTEGER, -- Link to work orders if available
    production_date DATE NOT NULL,
    batch_size_actual DECIMAL(10,3) NOT NULL, -- Actual batch size produced
    yield_percentage DECIMAL(5,2), -- Actual yield vs expected
    production_cost DECIMAL(15,2), -- Actual production cost
    quality_status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
    expiry_date DATE, -- When this batch expires
    storage_location VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Ingredient Suppliers Performance Table
CREATE TABLE ingredient_supplier_performance (
    id SERIAL PRIMARY KEY,
    supplier_name VARCHAR(255) NOT NULL,
    ingredient_name VARCHAR(255) NOT NULL,
    last_order_date DATE,
    average_lead_time_days INTEGER,
    quality_rating DECIMAL(3,2), -- 1-5 rating
    price_stability_rating DECIMAL(3,2), -- 1-5 rating
    delivery_reliability_rating DECIMAL(3,2), -- 1-5 rating
    total_orders INTEGER DEFAULT 0,
    total_value DECIMAL(15,2) DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_skincare_formulations_status ON skincare_formulations(status);
CREATE INDEX idx_skincare_formulations_type ON skincare_formulations(formulation_type);
CREATE INDEX idx_skincare_formulations_regulatory ON skincare_formulations(regulatory_status);
CREATE INDEX idx_skincare_ingredients_formulation ON skincare_ingredients(formulation_id);
CREATE INDEX idx_skincare_ingredients_function ON skincare_ingredients(function_type);
CREATE INDEX idx_skincare_ingredients_safety ON skincare_ingredients(safety_rating);
CREATE INDEX idx_quality_tests_formulation ON product_quality_tests(formulation_id);
CREATE INDEX idx_quality_tests_batch ON product_quality_tests(batch_number);
CREATE INDEX idx_production_batches_formulation ON production_batches(formulation_id);
CREATE INDEX idx_production_batches_date ON production_batches(production_date);

-- Insert some sample formulation types
INSERT INTO skincare_formulations (product_name, product_code, formulation_type, skin_type_target, ph_level, regulatory_status, notes) VALUES
('Vitamin C Brightening Serum', 'VCS-001', 'serum', ARRAY['all', 'dull'], 4.5, 'bpom_approved', 'High-potency vitamin C serum with MAP and magnesium ascorbyl phosphate'),
('Gentle Hydrating Cleanser', 'GHC-001', 'cleanser', ARRAY['sensitive', 'dry'], 6.0, 'halal_certified', 'Sulfate-free cleanser with ceramides and hyaluronic acid'),
('Niacinamide Oil Control Toner', 'NOT-001', 'toner', ARRAY['oily', 'combination'], 5.8, 'both_approved', '10% niacinamide with zinc PCA for oil control');

-- Insert sample ingredients for the Vitamin C Serum
INSERT INTO skincare_ingredients (formulation_id, ingredient_name, inci_name, function_type, percentage, quantity_grams, unit_cost, safety_rating, halal_certified, vegan_approved) VALUES
(1, 'Distilled Water', 'Aqua', 'base', 65.0, 650.0, 0.001, 'A', true, true),
(1, 'Magnesium Ascorbyl Phosphate', 'Magnesium Ascorbyl Phosphate', 'active', 15.0, 150.0, 2.5, 'A', true, true),
(1, 'Hyaluronic Acid', 'Sodium Hyaluronate', 'humectant', 2.0, 20.0, 15.0, 'A', true, true),
(1, 'Glycerin', 'Glycerin', 'humectant', 10.0, 100.0, 0.05, 'A', true, true),
(1, 'Phenoxyethanol', 'Phenoxyethanol', 'preservative', 0.8, 8.0, 0.25, 'B', true, true),
(1, 'Vitamin E', 'Tocopherol', 'antioxidant', 0.2, 2.0, 8.0, 'A', true, true);