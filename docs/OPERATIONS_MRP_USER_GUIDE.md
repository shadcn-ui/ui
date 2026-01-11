# MRP (Material Requirements Planning) - User Guide

## Ocean ERP - Operations Module Phase 1

**Version:** 1.0  
**Last Updated:** December 1, 2024  
**Module:** Operations > Manufacturing > MRP

---

## Table of Contents

1. [Overview](#overview)
2. [Key Features](#key-features)
3. [Getting Started](#getting-started)
4. [MRP Dashboard](#mrp-dashboard)
5. [Running MRP Calculations](#running-mrp-calculations)
6. [Understanding Shortages](#understanding-shortages)
7. [Material Reservations](#material-reservations)
8. [Issuing Materials to Production](#issuing-materials-to-production)
9. [Production Routing](#production-routing)
10. [Best Practices](#best-practices)
11. [Troubleshooting](#troubleshooting)

---

## Overview

The **Material Requirements Planning (MRP)** system helps you ensure that the right materials are available at the right time for production. It automatically calculates material requirements based on work orders and BOMs (Bill of Materials), checks inventory availability, identifies shortages, and helps you take action.

### What MRP Does

- ✅ Calculates exact material requirements for work orders
- ✅ Checks real-time inventory availability
- ✅ Identifies material shortages before production starts
- ✅ Reserves materials for specific work orders
- ✅ Tracks material consumption
- ✅ Provides purchase recommendations
- ✅ Supports multi-level BOM explosion

---

## Key Features

### 1. **Automated Material Calculation**
When you create a work order with a BOM, the system automatically populates all required materials and quantities.

### 2. **Availability Checking**
MRP calculates available inventory considering:
- Current stock levels
- Existing reservations
- Safety stock (minimum stock levels)

### 3. **Shortage Detection**
Identifies materials that are insufficient for production and calculates the exact shortage quantity.

### 4. **Material Reservations**
Reserve inventory for specific work orders to prevent double-allocation. Reservations expire after 7 days if not used.

### 5. **Material Issuance**
Track materials as they are issued from inventory to production floor.

### 6. **Production Routing**
Define operation sequences (cutting, sewing, assembly, etc.) for products with time and cost tracking.

---

## Getting Started

### Prerequisites

1. **Products** must be created in the system
2. **BOMs (Bill of Materials)** must be defined for products
3. **Work Orders** must be created for production
4. **Inventory** data must be up to date

### Access

Navigate to: **Operations > Manufacturing > MRP Dashboard**

---

## MRP Dashboard

### Dashboard Components

#### 1. **Statistics Cards**
- **Total Shortages**: Number of open material shortages
- **Shortage Value**: Total cost value of all shortages
- **Products Affected**: Unique products with shortages
- **Work Orders Affected**: Work orders that cannot proceed due to shortages

#### 2. **MRP Calculation Section**
- Select scope (all work orders or specific work order)
- Run button to execute MRP calculation
- Real-time calculation status

#### 3. **Top 10 Material Shortages**
Shows products with highest shortage value requiring immediate attention:
- Product code and name
- Total shortage quantity
- Current stock
- Shortage value (in currency)
- Number of affected work orders

#### 4. **Material Shortages Table**
Detailed list of all open shortages showing:
- Work order number
- Product details
- Required quantity
- Available quantity
- Shortage quantity
- Required date
- Recommendation (Purchase/Transfer)
- Status (Open/Resolved)

#### 5. **MRP Calculation History**
Recent MRP runs showing:
- Run date and time
- User who ran it
- Scope (all WOs or specific)
- Items checked
- Shortages found
- Execution time
- Status

---

## Running MRP Calculations

### Step-by-Step Guide

1. **Go to MRP Dashboard**
   ```
   Operations > Manufacturing > MRP Dashboard
   ```

2. **Select Scope**
   - Choose "All Open Work Orders" to check all
   - Or select specific work order from dropdown

3. **Click "Run MRP Calculation"**
   - System will process all materials
   - Calculation typically takes 1-5 seconds

4. **Review Results**
   - Success message shows summary
   - Statistics cards update automatically
   - Shortages table shows any issues found

### When to Run MRP

- **Daily**: At start of business day
- **Before Production**: When releasing work orders
- **After Inventory Changes**: When receiving new stock
- **On Demand**: When planning production schedules

### Example Scenario

**Scenario:** You have Work Order WO-2024-001 to produce 100 units of Product A.

**MRP Process:**
1. System reads BOM for Product A
2. Calculates: 
   - Component B: 100 units × 2 = 200 units needed
   - Component C: 100 units × 5 = 500 units needed
3. Checks inventory:
   - Component B: 250 in stock, 50 reserved = 200 available ✅
   - Component C: 300 in stock, 0 reserved = 300 available ❌ (shortage of 200)
4. Creates shortage record for Component C
5. Recommends: Purchase 200 units of Component C

---

## Understanding Shortages

### Shortage Calculation

```
Shortage = Required Quantity - Available Quantity

Where:
Available Quantity = Current Stock - Reserved Quantity - Safety Stock
```

### Shortage Status

- **Open**: Newly identified, requires action
- **In Progress**: Being procured or transferred
- **Resolved**: Sufficient inventory now available

### Recommendations

| Recommendation | Meaning | Action Required |
|---------------|---------|-----------------|
| **Purchase** | No stock available | Create purchase order |
| **Transfer** | Stock available in other location | Transfer inventory |
| **Sufficient** | Enough stock | No action needed |

### Taking Action on Shortages

1. **For Purchase Recommendations:**
   - Go to Operations > Procurement > Purchase Orders
   - Create new PO for the shortage quantity
   - Add supplier and expected delivery date
   - Mark shortage as "In Progress"

2. **For Transfer Recommendations:**
   - Go to Inventory > Transfers
   - Create transfer from source to destination warehouse
   - Mark shortage as "In Progress"

3. **After Receiving Materials:**
   - Update inventory
   - Run MRP again to verify
   - Shortage should auto-resolve if sufficient

---

## Material Reservations

### What is a Reservation?

A reservation "locks" inventory for a specific work order, preventing it from being allocated to other orders.

### How Reservations Work

1. **Manual Reservation**
   - Go to Work Order details
   - Materials tab
   - Click "Reserve" on each material
   - System creates reservation record

2. **Auto-Reservation** (Planned)
   - When work order status changes to "Ready"
   - System auto-reserves all materials
   - Only reserves if sufficient inventory

3. **Reservation Expiry**
   - Default: 7 days
   - After expiry, reservation auto-releases
   - Inventory becomes available for other orders

### Benefits

- ✅ Prevents double-allocation
- ✅ Ensures materials are available when needed
- ✅ Provides visibility into committed inventory
- ✅ Helps with production planning

### Managing Reservations

**View Reservations:**
```
Operations > Manufacturing > Work Orders > [Select WO] > Materials Tab
```

**Release Reservation:**
- Click "Release" button on reservation
- Inventory becomes available immediately
- Use when work order is cancelled or delayed

---

## Issuing Materials to Production

### Issue Process

1. **Navigate to Work Order**
   ```
   Operations > Manufacturing > Work Orders > [Select WO]
   ```

2. **Go to Materials Tab**
   - Shows all required materials
   - Status: Pending → Reserved → Issued

3. **Issue Material**
   - Click "Issue" button
   - Enter quantity to issue
   - Add notes (optional)
   - Confirm

4. **System Actions**
   - Updates issued quantity
   - Decrements inventory
   - Records transaction
   - Marks reservation as consumed

### Partial Issuance

You can issue materials in multiple batches:
- First issue: 50 units
- Second issue: 30 units
- Third issue: 20 units
- Total: 100 units

System tracks cumulative issued quantity.

### Material Consumption Report

View all material issuances:
```
Operations > Manufacturing > Material Consumption
```

Shows:
- Work order
- Product consumed
- Quantity issued
- Date and time
- Issued by (user)
- Unit cost
- Total value

---

## Production Routing

### What is a Production Route?

A production route defines the sequence of operations (steps) required to manufacture a product.

### Example Route: T-Shirt Production

| Seq | Operation | Workstation | Setup Time | Run Time/Unit | Labor Cost |
|-----|-----------|-------------|------------|---------------|------------|
| 1 | Cutting Fabric | Cutting Station | 15 min | 2 min | Rp 25,000/hr |
| 2 | Sewing | Sewing Station | 10 min | 5 min | Rp 20,000/hr |
| 3 | Quality Check | QC Station | 5 min | 1 min | Rp 22,000/hr |
| 4 | Packaging | Packaging Line | 10 min | 0.5 min | Rp 15,000/hr |

### Creating a Production Route

1. **Navigate to Routings**
   ```
   Operations > Manufacturing > Production Routing
   ```

2. **Click "New Route"**
   - Enter Route Code (e.g., "ROUTE-TSHIRT-001")
   - Enter Route Name (e.g., "T-Shirt Standard Production")
   - Select Product
   - Mark as "Default" if primary route

3. **Add Operations**
   - Sequence Number: 10, 20, 30, etc. (allows future insertions)
   - Operation Name: Descriptive name
   - Operation Type: Setup, Process, Inspection, Packaging
   - Select Workstation
   - Enter times and costs

4. **Save Route**

### Using Routes with Work Orders

When creating a work order:
- Select product
- System auto-loads default route
- Operations are copied to work order
- Can be modified per work order

### Benefits

- ✅ Standardized processes
- ✅ Accurate time estimates
- ✅ Cost tracking
- ✅ Capacity planning
- ✅ Shop floor instructions

---

## Best Practices

### 1. **Regular MRP Runs**
- Run MRP daily at minimum
- Run before releasing work orders
- Run after receiving inventory

### 2. **Keep BOMs Updated**
- Review and update BOMs quarterly
- Ensure quantities are accurate
- Include all components

### 3. **Maintain Safety Stock**
- Set minimum stock levels for critical materials
- MRP accounts for safety stock
- Helps prevent production delays

### 4. **Timely Material Reservations**
- Reserve materials when work order is approved
- Don't reserve too early (wastes inventory)
- Don't reserve too late (risk of shortage)

### 5. **Track Material Usage**
- Issue materials promptly
- Record actual consumption
- Compare planned vs. actual

### 6. **Monitor Shortage Trends**
- Review top shortage products weekly
- Identify patterns (seasonal, supplier delays)
- Adjust inventory policies accordingly

### 7. **Production Routing**
- Create routes for all manufactured products
- Keep operation times realistic
- Update based on actual performance

### 8. **Reservation Expiry**
- Monitor expiring reservations
- Extend if work order is still active
- Release if work order is cancelled

---

## Troubleshooting

### Issue: MRP Shows Shortages But Inventory Exists

**Possible Causes:**
1. Inventory is reserved for other work orders
2. Safety stock is set too high
3. Inventory is in different warehouse

**Solution:**
- Check material_reservations table
- Review safety stock settings
- Run MRP with specific warehouse filter

---

### Issue: Materials Not Auto-Populating on Work Order

**Possible Causes:**
1. BOM not defined for product
2. BOM is inactive
3. Trigger not working

**Solution:**
- Verify BOM exists: Operations > Manufacturing > BOM
- Check BOM status (must be active)
- Manually add materials if needed

---

### Issue: Cannot Reserve Material (Insufficient Inventory)

**Possible Causes:**
1. Another work order already reserved it
2. MRP not run recently
3. Inventory not updated after receiving

**Solution:**
- Run MRP calculation to refresh
- Check other work order reservations
- Verify inventory movements

---

### Issue: MRP Calculation Very Slow

**Possible Causes:**
1. Too many open work orders
2. Multi-level BOMs with many components
3. Database performance

**Solution:**
- Run MRP for specific work orders
- Schedule MRP runs during off-peak hours
- Contact system administrator for DB optimization

---

### Issue: Expired Reservations Not Auto-Releasing

**Possible Causes:**
1. Scheduled job not running
2. Expiry date not set

**Solution:**
- Manually release expired reservations
- Contact system administrator to check scheduled jobs

---

## Support

For additional help:
- **Email**: support@ocean-erp.com
- **Documentation**: /docs/OPERATIONS_MRP_API.md
- **System Admin**: Contact IT department

---

## Glossary

| Term | Definition |
|------|------------|
| **MRP** | Material Requirements Planning - System to calculate material needs |
| **BOM** | Bill of Materials - List of components needed to make a product |
| **Work Order** | Manufacturing order to produce specific quantity of a product |
| **Reservation** | Lock on inventory for a specific work order |
| **Shortage** | Insufficient inventory to meet production requirements |
| **Issuance** | Transfer of materials from inventory to production floor |
| **Route** | Sequence of operations to manufacture a product |
| **Workstation** | Machine or work center where operations are performed |
| **Safety Stock** | Minimum inventory level to prevent stockouts |

---

**End of User Guide**
