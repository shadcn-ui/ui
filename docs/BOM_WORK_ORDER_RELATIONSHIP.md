# Bill of Materials (BOM), Work Orders, Products & Sales - Complete Guide

## 📚 Table of Contents
1. [Overview](#overview)
2. [The Product Lifecycle](#the-product-lifecycle)
3. [Bill of Materials (BOM)](#bill-of-materials-bom)
4. [Work Orders](#work-orders)
5. [Complete Flow Example](#complete-flow-example)
6. [Database Relationships](#database-relationships)

---

## Overview

In a manufacturing ERP system, these components work together to manage the entire product lifecycle from raw materials to customer delivery.

```
Raw Materials → BOM → Work Order → Finished Product → Sales Order → Customer
     (Buy)      (Recipe)  (Production)   (Inventory)      (Sell)      (Deliver)
```

---

## The Product Lifecycle

### 1. **Products** - The Foundation
Products can be categorized into:
- **Raw Materials**: Basic components you purchase (e.g., wood, screws, fabric)
- **Finished Goods**: Products you manufacture and sell (e.g., chair, table)
- **Both**: Items that can be bought OR manufactured (e.g., pre-made cushions)

### 2. **Bill of Materials (BOM)** - The Recipe
A BOM defines **HOW** to make a finished product from components.

**Example: Chair BOM**
```
Product: "Dining Chair" (SKU: CHAIR-001)
├── Components:
│   ├── Wood Plank (4 pieces)
│   ├── Screws (12 pieces)
│   ├── Cushion (1 piece)
│   ├── Varnish (0.5 liters)
│   └── Fabric (0.5 meters)
├── Version: 1.0
├── Status: Active
└── Total Cost: $45.00
```

**Key Points:**
- One finished product can have multiple BOMs (different versions)
- Only ONE BOM should be "active" at a time
- BOM includes quantities and costs for each component

### 3. **Work Order** - The Production Command
A Work Order is created when you want to **manufacture** a product.

**Example: Work Order WO000001**
```
Work Order: WO000001
├── Product to Make: "Dining Chair" (CHAIR-001)
├── Quantity: 10 chairs
├── Based on BOM: Chair BOM v1.0
├── Status: Draft → In Progress → Completed
├── Materials Needed (auto-loaded from BOM):
│   ├── Wood Plank: 40 pieces (4 × 10)
│   ├── Screws: 120 pieces (12 × 10)
│   ├── Cushion: 10 pieces (1 × 10)
│   ├── Varnish: 5 liters (0.5 × 10)
│   └── Fabric: 5 meters (0.5 × 10)
├── Planned: Start 22 Nov, End 25 Nov
└── Total Material Cost: $450.00 (45 × 10)
```

### 4. **Sales Order** - Customer Orders
When a customer wants to buy your manufactured product.

**Example: Sales Order SO-12345**
```
Sales Order: SO-12345
├── Customer: ABC Restaurant
├── Items:
│   └── Dining Chair × 50 chairs @ $120 each
├── Total: $6,000
├── Expected Delivery: 30 Nov
└── Status: Pending → Processing → Delivered
```

---

## Complete Flow Example

### Scenario: ABC Restaurant orders 50 dining chairs

#### Step 1: Check Inventory
```
Current Stock: 15 chairs
Customer Needs: 50 chairs
Need to Produce: 35 chairs (50 - 15)
```

#### Step 2: Create Work Orders
```
WO000010: Produce 35 chairs
├── Based on: Chair BOM v1.0
├── Materials Auto-loaded:
│   ├── Wood Plank: 140 pieces (need to check stock!)
│   ├── Screws: 420 pieces
│   └── etc...
└── Production Schedule: 22 Nov - 28 Nov
```

#### Step 3: Check Material Availability
The system automatically checks if you have enough raw materials:
```
✅ Wood Plank: 200 in stock (need 140) → OK
❌ Screws: 300 in stock (need 420) → SHORTAGE! Need to purchase 120
✅ Cushion: 50 in stock (need 35) → OK
```

#### Step 4: Purchase Missing Materials
```
Purchase Order: PO-5678
└── Screws: 200 pieces (to cover shortage + buffer)
```

#### Step 5: Start Production
Once materials are available:
```
WO000010: Status changed to "In Progress"
├── Materials Reserved from inventory
├── Production team starts assembly
└── Progress tracked daily
```

#### Step 6: Complete Production
```
WO000010: Status changed to "Completed"
├── Produced: 35 chairs
├── Material Consumption:
│   ├── Wood Plank: -140 pieces
│   ├── Screws: -420 pieces
│   └── etc...
└── Inventory Update:
    └── Dining Chair: +35 pieces (15 + 35 = 50 total)
```

#### Step 7: Fulfill Sales Order
```
SO-12345: Ready to ship
├── Pick 50 chairs from inventory
├── Inventory Update: 50 → 0 chairs
└── Ship to customer
```

---

## Database Relationships

### Current Schema Structure

```sql
-- 1. PRODUCTS (Everything is a product)
products
├── id
├── name
├── sku
├── current_stock
├── unit_of_measure
└── status

-- 2. BILL OF MATERIALS (Recipe for finished products)
bill_of_materials
├── id
├── product_name        -- "Dining Chair"
├── product_code        -- "CHAIR-001" (links to products.sku)
├── version             -- "1.0"
├── status              -- "active"
└── total_cost

-- 3. BOM ITEMS (Components needed)
bom_items
├── id
├── bom_id              -- links to bill_of_materials
├── component_name      -- "Wood Plank"
├── component_code      -- "WOOD-PLK" (links to products.sku)
├── quantity            -- 4.0
├── unit                -- "pieces"
└── unit_cost

-- 4. WORK ORDERS (Production commands)
work_orders
├── id
├── wo_number           -- "WO000001"
├── product_id          -- links to products.id (what to make)
├── product_name
├── product_code
├── bom_id              -- links to bill_of_materials (how to make it)
├── quantity_to_produce -- 10
├── quantity_produced   -- tracks progress
├── status              -- draft/in_progress/completed
├── planned_start_date
└── planned_end_date

-- 5. WORK ORDER ITEMS (Materials needed for THIS work order)
work_order_items
├── id
├── work_order_id       -- links to work_orders
├── product_id          -- links to products.id (component)
├── bom_item_id         -- links to bom_items
├── quantity_per_unit   -- from BOM
├── quantity_required   -- calculated (quantity_per_unit × quantity_to_produce)
├── quantity_available  -- current stock
├── is_available        -- true/false
└── quantity_consumed   -- actual used

-- 6. SALES ORDERS (Customer orders)
sales_orders
├── id
├── order_number
├── customer_id
├── status
└── delivery_date

-- 7. SALES ORDER ITEMS
sales_order_items
├── id
├── sales_order_id
├── product_id          -- links to products.id (finished goods)
├── quantity
└── unit_price
```

---

## Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    MANUFACTURING FLOW                            │
└─────────────────────────────────────────────────────────────────┘

1. DEFINE WHAT YOU CAN MAKE
┌──────────────────┐
│   bill_of_       │  Defines: "Chair = 4 Wood + 12 Screws"
│   materials      │  
│  (product_code)  │───────┐
└──────────────────┘       │
         │                 │
         │ has many        │
         ▼                 │
┌──────────────────┐       │
│   bom_items      │       │
│ (component_code) │       │
└──────────────────┘       │
         │                 │
         └─────────────────┘
              both link to products.sku


2. EXECUTE PRODUCTION
┌──────────────────┐
│  work_orders     │  "Make 10 chairs"
│  (product_id)    │───────┐
│  (bom_id)        │       │ copies items from
└──────────────────┘       │
         │                 │
         │ creates         ▼
         ▼          ┌──────────────────┐
┌──────────────────┐│ work_order_items │
│  Inventory +10   ││  (product_id)    │ "Need 40 wood, 120 screws"
└──────────────────┘└──────────────────┘
                             │
                             │ consumes
                             ▼
                    ┌──────────────────┐
                    │  Inventory -40   │ (Raw materials)
                    └──────────────────┘


3. SELL TO CUSTOMERS
┌──────────────────┐
│  sales_orders    │  "Customer wants 50 chairs"
└──────────────────┘
         │
         │ contains
         ▼
┌──────────────────┐
│ sales_order_     │
│     items        │
│  (product_id)    │───┐ check stock
└──────────────────┘   │
                       ▼
              ┌──────────────────┐
              │  Inventory -50   │ (If available)
              └──────────────────┘
                       │
                       ▼ If not enough
              ┌──────────────────┐
              │ Create Work Order│ (Make more)
              └──────────────────┘
```

---

## Real-World Example: Furniture Company

### Your Product Catalog
```
Raw Materials (Buy):
- WOOD-PLK: Wood Plank ($5/piece)
- SCREW-001: Screws ($0.10/piece)
- CUSH-001: Cushion ($8/piece)
- VARN-001: Varnish ($20/liter)
- FABR-001: Fabric ($15/meter)

Finished Goods (Manufacture & Sell):
- CHAIR-001: Dining Chair (Sell for $120)
- TABLE-001: Dining Table (Sell for $350)
```

### Setting Up Production

**1. Create BOM for Chair**
```
BOM #10: "How to make CHAIR-001"
├── Product: CHAIR-001 (Dining Chair)
├── Version: 1.0
├── Status: Active
└── Components:
    ├── WOOD-PLK × 4 pieces @ $5 = $20
    ├── SCREW-001 × 12 pieces @ $0.10 = $1.20
    ├── CUSH-001 × 1 piece @ $8 = $8
    ├── VARN-001 × 0.5 liter @ $20 = $10
    └── FABR-001 × 0.5 meter @ $15 = $7.50
    
Total Material Cost: $46.70 per chair
```

**2. Customer Orders**
```
Sales Order SO-001
├── Customer: Restaurant ABC
├── Order Date: 22 Nov 2025
├── Items:
│   └── CHAIR-001 × 50 @ $120 = $6,000
└── Delivery Date: 30 Nov 2025
```

**3. Check Inventory**
```
Current Stock:
├── CHAIR-001: 15 pieces ❌ (need 50)
└── Need to produce: 35 chairs
```

**4. Create Work Order**
```
Work Order WO000001
├── Product: CHAIR-001
├── Quantity: 35 chairs
├── BOM: #10 (v1.0)
├── Status: Draft
├── Materials Auto-loaded:
│   ├── WOOD-PLK: 140 (4×35) - Available: 200 ✅
│   ├── SCREW-001: 420 (12×35) - Available: 300 ❌
│   ├── CUSH-001: 35 (1×35) - Available: 50 ✅
│   ├── VARN-001: 17.5 (0.5×35) - Available: 20 ✅
│   └── FABR-001: 17.5 (0.5×35) - Available: 25 ✅
├── Planned: 23 Nov - 28 Nov
└── Cost: $1,634.50 (35 × $46.70)
```

**5. Purchase Missing Materials**
```
Purchase Order PO-001
└── SCREW-001: 200 pieces (to cover shortage)
```

**6. Production Starts**
```
23 Nov: WO000001 → In Progress
├── Materials reserved
├── Production team assigned
└── Daily updates on progress
```

**7. Production Completes**
```
28 Nov: WO000001 → Completed
├── Produced: 35 chairs
├── Inventory Changes:
│   ├── WOOD-PLK: 200 → 60
│   ├── SCREW-001: 500 → 80 (after purchase)
│   ├── CUSH-001: 50 → 15
│   ├── VARN-001: 20 → 2.5
│   ├── FABR-001: 25 → 7.5
│   └── CHAIR-001: 15 → 50 ✅
└── Cost Recorded: $1,634.50
```

**8. Ship to Customer**
```
29 Nov: SO-001 → Ready to Ship
├── Pick 50 chairs
├── Inventory: CHAIR-001: 50 → 0
├── Revenue: $6,000
├── Cost: $2,335 (Material cost for all 50)
└── Gross Profit: $3,665
```

---

## Key Insights

### 1. **BOM is the Recipe**
- Created once per product
- Can have multiple versions (improve over time)
- Defines the "correct" way to make something

### 2. **Work Order is the Action**
- Created whenever you need to produce
- Copies the BOM to calculate materials needed
- Tracks actual production vs planned

### 3. **Flexibility**
- Can create Work Order WITHOUT BOM (manual material entry)
- Can modify material quantities per Work Order
- BOM is a template, Work Order is the actual execution

### 4. **Cost Tracking**
```
BOM Cost (Standard) → $46.70 per chair
Work Order Cost (Actual) → May vary based on:
├── Material waste
├── Labor hours
├── Overhead
└── Scrap/defects
```

### 5. **Inventory Impact**
```
Before Production:
├── Raw Materials: HIGH
└── Finished Goods: LOW

After Production:
├── Raw Materials: LOW (consumed)
└── Finished Goods: HIGH (produced)

After Sales:
├── Finished Goods: LOW (sold)
└── Cash/Receivables: HIGH
```

---

## Common Questions

### Q: Can I make a product without a BOM?
**A:** Yes! You can create a Work Order without a BOM and manually add materials. BOM is just a convenience to avoid re-entering the same materials every time.

### Q: What if I run out of materials mid-production?
**A:** The system checks material availability when creating Work Orders. You can:
1. Create Purchase Orders for missing materials
2. Use substitute materials (if acceptable)
3. Pause the Work Order until materials arrive

### Q: Can one product have multiple BOMs?
**A:** Yes! You might have:
- Different versions (v1.0, v2.0)
- Different variants (Standard Chair, Premium Chair)
- Different production methods (Manual, Automated)

Only ONE should be "active" at a time for auto-loading.

### Q: What happens when a sales order exceeds inventory?
**A:** You have options:
1. **Make to Stock**: Create Work Orders to replenish inventory first
2. **Make to Order**: Create Work Orders specifically for this sales order
3. **Partial Fulfillment**: Ship what you have, produce the rest later

---

## Summary

```
BILL OF MATERIALS     →  The RECIPE (How to make it)
WORK ORDER           →  The ACTION (Making it now)
PRODUCT              →  The RESULT (What you made)
SALES ORDER          →  The REVENUE (Selling it)
```

**The complete cycle:**
1. Design your product → Create BOM
2. Customer orders → Create Sales Order
3. Need inventory → Create Work Order (uses BOM)
4. Produce → Complete Work Order (updates inventory)
5. Ship → Fulfill Sales Order (reduces inventory)
6. 🎉 Profit!

---

## Next Steps

1. **Set up your products** (raw materials + finished goods)
2. **Create BOMs** for products you manufacture
3. **Test with a small Work Order** (e.g., make 1 chair)
4. **Verify inventory changes** (raw materials down, finished goods up)
5. **Scale up** with confidence!

Need help? Check out:
- [Product Management Guide](./PRODUCT_MANAGEMENT_DOCUMENTATION.md)
- [Operations Module Guide](./OPERATIONS_MODULE_IMPLEMENTATION.md)
- [Quick Start Guide](../QUICK_START.md)
