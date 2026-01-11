#!/bin/bash

# Ocean ERP - Complete UI Page Test Script
# Tests all 80+ UI pages for availability
# Last Updated: December 5, 2025

echo "🧪 Ocean ERP - UI Page Health Check"
echo "===================================="
echo ""
echo "Testing server at: http://localhost:4000"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
total=0
passed=0
failed=0

# Test function
test_url() {
    local url=$1
    local name=$2
    total=$((total + 1))
    
    status=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
    
    if [ "$status" = "200" ]; then
        echo -e "${GREEN}✓${NC} $name (200)"
        passed=$((passed + 1))
    else
        echo -e "${RED}✗${NC} $name ($status)"
        failed=$((failed + 1))
    fi
}

# Main Application
echo "🏠 Main Application"
echo "-------------------"
test_url "http://localhost:4000" "Home Page"
test_url "http://localhost:4000/erp" "ERP Dashboard"
echo ""

# Sales & CRM
echo "📊 Sales & CRM"
echo "---------------"
test_url "http://localhost:4000/erp/sales" "Sales Dashboard"
test_url "http://localhost:4000/erp/sales/leads" "Leads List"
test_url "http://localhost:4000/erp/sales/leads/new" "New Lead"
test_url "http://localhost:4000/erp/sales/leads/all" "All Leads"
test_url "http://localhost:4000/erp/sales/leads/hot" "Hot Leads"
test_url "http://localhost:4000/erp/sales/leads/import" "Import Leads"
test_url "http://localhost:4000/erp/sales/leads/reports" "Lead Reports"
test_url "http://localhost:4000/erp/sales/opportunities" "Opportunities List"
test_url "http://localhost:4000/erp/sales/opportunities/new" "New Opportunity"
test_url "http://localhost:4000/erp/sales/opportunities/pipeline" "Sales Pipeline"
test_url "http://localhost:4000/erp/sales/quotations" "Quotations List"
test_url "http://localhost:4000/erp/sales/quotations/new" "New Quotation"
test_url "http://localhost:4000/erp/sales/orders" "Orders List"
test_url "http://localhost:4000/erp/sales/orders/new" "New Order"
test_url "http://localhost:4000/erp/sales/customers" "Customers List"
test_url "http://localhost:4000/erp/sales/customers/new" "New Customer"
test_url "http://localhost:4000/erp/sales/analytics" "Sales Analytics"
test_url "http://localhost:4000/erp/sales/performance" "Sales Performance"
echo ""

# Product & Inventory
echo "📦 Product & Inventory"
echo "----------------------"
test_url "http://localhost:4000/erp/product" "Product Dashboard"
test_url "http://localhost:4000/erp/product/catalog" "Product Catalog"
test_url "http://localhost:4000/erp/product/inventory" "Inventory"
test_url "http://localhost:4000/erp/product/stock" "Stock Levels"
test_url "http://localhost:4000/erp/product/suppliers" "Suppliers"
test_url "http://localhost:4000/erp/product/suppliers/performance" "Supplier Performance"
test_url "http://localhost:4000/erp/product/suppliers/performance/detail" "Performance Detail"
test_url "http://localhost:4000/erp/product/suppliers/performance/compare" "Compare Suppliers"
test_url "http://localhost:4000/erp/product/purchase-orders" "Purchase Orders"
test_url "http://localhost:4000/erp/product/warehouses" "Warehouses"
echo ""

# Operations & Manufacturing
echo "🏭 Operations & Manufacturing"
echo "-----------------------------"
test_url "http://localhost:4000/erp/operations" "Operations Dashboard"
test_url "http://localhost:4000/erp/operations/manufacturing" "Manufacturing"
test_url "http://localhost:4000/erp/operations/manufacturing/bom" "Bill of Materials"
test_url "http://localhost:4000/erp/operations/manufacturing/capacity" "Capacity Planning"
test_url "http://localhost:4000/erp/operations/manufacturing/mps" "Master Production Schedule"
test_url "http://localhost:4000/erp/operations/manufacturing/mrp" "Material Requirements Planning"
test_url "http://localhost:4000/erp/operations/manufacturing/scheduler" "Production Scheduler"
test_url "http://localhost:4000/erp/operations/manufacturing/skincare-formulations" "Skincare Formulations"
test_url "http://localhost:4000/erp/operations/supply-chain" "Supply Chain"
test_url "http://localhost:4000/erp/operations/supply-chain/procurement" "Procurement"
test_url "http://localhost:4000/erp/operations/supply-chain/procurement-advanced" "Advanced Procurement"
test_url "http://localhost:4000/erp/operations/logistics" "Logistics"
test_url "http://localhost:4000/erp/operations/logistics/tracking" "Shipment Tracking"
test_url "http://localhost:4000/erp/operations/quality" "Quality Management"
test_url "http://localhost:4000/erp/operations/quality/reports" "Quality Reports"
test_url "http://localhost:4000/erp/operations/quality/skincare-compliance" "Skincare Compliance"
test_url "http://localhost:4000/erp/operations/planning" "Planning"
test_url "http://localhost:4000/erp/operations/planning/capacity" "Capacity Planning"
test_url "http://localhost:4000/erp/operations/multi-location" "Multi-Location"
test_url "http://localhost:4000/erp/operations/projects" "Projects"
test_url "http://localhost:4000/erp/operations/projects/timeline" "Project Timeline"
echo ""

# Human Resources
echo "👥 Human Resources (HRIS)"
echo "-------------------------"
test_url "http://localhost:4000/erp/hris" "HRIS Dashboard"
test_url "http://localhost:4000/erp/hris/employees" "Employees"
test_url "http://localhost:4000/erp/hris/employees/org-chart" "Organization Chart"
test_url "http://localhost:4000/erp/hris/payroll" "Payroll"
test_url "http://localhost:4000/erp/hris/leave" "Leave Management"
test_url "http://localhost:4000/erp/hris/performance" "Performance Management"
test_url "http://localhost:4000/erp/hris/recruitment" "Recruitment"
test_url "http://localhost:4000/erp/hris/training" "Training"
echo ""

# Accounting & Finance
echo "💰 Accounting & Finance"
echo "-----------------------"
test_url "http://localhost:4000/erp/accounting" "Accounting Dashboard"
test_url "http://localhost:4000/erp/accounting/chart-of-accounts" "Chart of Accounts"
test_url "http://localhost:4000/erp/accounting/journal-entries" "Journal Entries"
test_url "http://localhost:4000/erp/accounting/accounts-payable" "Accounts Payable"
test_url "http://localhost:4000/erp/accounting/accounts-receivable" "Accounts Receivable"
test_url "http://localhost:4000/erp/accounting/budgets" "Budgets"
test_url "http://localhost:4000/erp/accounting/reports" "Financial Reports"
echo ""

# Analytics & Reports
echo "📊 Analytics & Reports"
echo "----------------------"
test_url "http://localhost:4000/erp/analytics" "Analytics Dashboard"
test_url "http://localhost:4000/erp/reports" "Reports"
echo ""

# Point of Sale
echo "🛒 Point of Sale"
echo "----------------"
test_url "http://localhost:4000/erp/pos/checkout" "POS Checkout"
echo ""

# Mobile Features
echo "📱 Mobile Features"
echo "------------------"
test_url "http://localhost:4000/erp/mobile/inventory-scanner" "Inventory Scanner"
test_url "http://localhost:4000/erp/mobile/production-tracking" "Production Tracking"
echo ""

# Settings & Configuration
echo "⚙️ Settings & Configuration"
echo "---------------------------"
test_url "http://localhost:4000/erp/settings" "Settings"
test_url "http://localhost:4000/erp/settings/company" "Company Settings"
test_url "http://localhost:4000/erp/settings/users" "User Management"
test_url "http://localhost:4000/erp/settings/master-data" "Master Data"
test_url "http://localhost:4000/erp/settings/master-data/sales-team" "Sales Team"
test_url "http://localhost:4000/erp/settings/master-data/hris/departments" "Departments"
echo ""

# Integrations
echo "🔌 Integrations"
echo "---------------"
test_url "http://localhost:4000/erp/integrations" "Integrations Dashboard"
echo ""

# API Endpoints
echo "🔗 API Endpoints"
echo "----------------"
test_url "http://localhost:4000/api/analytics" "Analytics API"
test_url "http://localhost:4000/api/users" "Users API"
test_url "http://localhost:4000/api/crm/opportunities" "CRM Opportunities API"
test_url "http://localhost:4000/api/crm/cases" "CRM Cases API"
echo ""

# Summary
echo "===================================="
echo "📊 Test Summary"
echo "===================================="
echo -e "Total Tests: ${YELLOW}$total${NC}"
echo -e "Passed: ${GREEN}$passed${NC}"
echo -e "Failed: ${RED}$failed${NC}"
echo ""

if [ $failed -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed! Ocean ERP is running perfectly.${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed. Please check the server logs.${NC}"
    exit 1
fi
