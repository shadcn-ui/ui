#!/bin/bash

# Ocean ERP Database Initialization Script
# This script initializes the PostgreSQL database with all required schemas and seed data

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "Ocean ERP Database Initialization"
echo "=========================================="
echo ""

if [ "${ERP_PRODUCTION_MODE}" = "true" ] || [ "${ERP_PRODUCTION_MODE}" = "1" ] || [ "${ERP_PRODUCTION_MODE}" = "yes" ]; then
    echo -e "${RED}ERP_PRODUCTION_MODE is enabled. Reseed scripts are disabled in production.${NC}"
    exit 1
fi

# Check if running inside Docker or on host
if [ -f "/.dockerenv" ]; then
    echo "Running inside Docker container..."
    DB_HOST="postgres"
    DB_USER="${DB_USER:-ocean_erp}"
    DB_NAME="${DB_NAME:-ocean_erp}"
    PSQL_CMD="psql -h $DB_HOST -U $DB_USER -d $DB_NAME"
else
    echo "Running on host..."
    DB_HOST="${DB_HOST:-localhost}"
    DB_USER="${DB_USER:-ocean_erp}"
    DB_NAME="${DB_NAME:-ocean_erp}"
    PSQL_CMD="psql -h $DB_HOST -U $DB_USER -d $DB_NAME"
fi

echo "Database: $DB_NAME"
echo "Host: $DB_HOST"
echo "User: $DB_USER"
echo ""

# Function to execute SQL file
execute_sql() {
    local file=$1
    local filename=$(basename "$file")
    
    echo -n "Executing $filename... "
    
    if $PSQL_CMD -f "$file" > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${RED}✗${NC}"
        echo -e "${RED}Error executing $filename${NC}"
        # Continue with other files even if one fails
    fi
}

# Check if database exists and is accessible
echo "Testing database connection..."
if $PSQL_CMD -c "SELECT 1;" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Database connection successful${NC}"
    echo ""
else
    echo -e "${RED}✗ Cannot connect to database${NC}"
    echo "Please ensure PostgreSQL is running and credentials are correct."
    exit 1
fi

# Schema files in order
SCHEMA_FILES=(
    "database/01_create_tables.sql"
    "database/029_rbac_authentication_system.sql"
    "database/008_create_pos_and_loyalty_system.sql"
    "database/009_pos_loyalty_clean.sql"
    "database/010_pos_loyalty_integer.sql"
    "database/011_create_accounting_tables.sql"
    "database/011_skincare_formulations.sql"
    "database/012_multi_location_management.sql"
    "database/013_integrations_system.sql"
    "database/014_hris_comprehensive.sql"
    "database/014_integration_multi_account.sql"
    "database/014_phase7_crm_foundation.sql"
    "database/015_operations_mrp_and_routing_fixed.sql"
    "database/015_phase7_sales_pipeline.sql"
    "database/016_phase2_scheduling_capacity.sql"
    "database/016_phase7_customer_service.sql"
    "database/017_enhanced_bom_explosion.sql"
    "database/017_phase7_marketing_automation.sql"
    "database/018_demand_forecasting_functions.sql"
    "database/018_phase7_hrm_employees.sql"
    "database/019_phase7_hrm_time_attendance.sql"
    "database/019_quality_management_system.sql"
    "database/020_phase7_asset_management.sql"
    "database/020_quality_management_functions.sql"
    "database/021_phase7_ecommerce_integration.sql"
    "database/021_supply_chain_management.sql"
    "database/022_phase7_project_management.sql"
    "database/022_supply_chain_fixes.sql"
    "database/023_supply_chain_view_fixes.sql"
    "database/024_logistics_distribution.sql"
    "database/025_logistics_schema_fixes.sql"
    "database/026_analytics_intelligence.sql"
    "database/027_data_warehouse.sql"
    "database/028_etl_procedures.sql"
)

echo "Executing schema files..."
echo ""

for file in "${SCHEMA_FILES[@]}"; do
    if [ -f "$file" ]; then
        execute_sql "$file"
    else
        echo -e "${YELLOW}⚠ File not found: $file${NC}"
    fi
done

echo ""
echo "Executing seed data files..."
echo ""

# Seed data files
SEED_FILES=(
    "database/02_seed_data.sql"
    "database/012_seed_accounting_data.sql"
    "database/seed_indonesian_rupiah_data.sql"
    "database/seed_indonesian_customers.sql"
    "database/seed_indonesian_sales_orders.sql"
)

for file in "${SEED_FILES[@]}"; do
    if [ -f "$file" ]; then
        execute_sql "$file"
    else
        echo -e "${YELLOW}⚠ File not found: $file${NC}"
    fi
done

echo ""
echo "=========================================="
echo -e "${GREEN}✓ Database initialization complete!${NC}"
echo "=========================================="
echo ""
echo "Summary:"
$PSQL_CMD -c "
SELECT 
    schemaname,
    COUNT(*) as table_count
FROM pg_tables 
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
GROUP BY schemaname
ORDER BY schemaname;
"

echo ""
echo "User count:"
$PSQL_CMD -c "SELECT COUNT(*) as total_users FROM users;" 2>/dev/null || echo "Users table not found"

echo ""
