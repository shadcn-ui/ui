# MRP API Documentation

## Ocean ERP - Operations Module Phase 1

**Version:** 1.0  
**Last Updated:** December 1, 2024  
**Base URL:** `http://localhost:4000/api/operations`

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [MRP Calculation](#mrp-calculation)
4. [MRP Runs](#mrp-runs)
5. [MRP Requirements](#mrp-requirements)
6. [Work Order Materials](#work-order-materials)
7. [Material Reservations](#material-reservations)
8. [Material Issuance](#material-issuance)
9. [Production Routing](#production-routing)
10. [Error Handling](#error-handling)
11. [Examples](#examples)

---

## Overview

The MRP API provides endpoints for managing Material Requirements Planning, including:
- Running MRP calculations
- Managing material reservations
- Issuing materials to production
- Creating and managing production routes

### Base URLs

- **Development:** `http://localhost:4000/api/operations`
- **Production:** `https://your-domain.com/api/operations`

---

## Authentication

Currently using session-based authentication. Future versions will support API tokens.

**Headers Required:**
```http
Content-Type: application/json
```

---

## MRP Calculation

### Run MRP Calculation

Calculate material requirements for work orders and identify shortages.

**Endpoint:** `POST /mrp/calculate`

**Request Body:**
```json
{
  "work_order_id": 123,  // optional - if omitted, calculates for all open WOs
  "user_id": 1           // optional - user running the calculation
}
```

**Response:**
```json
{
  "success": true,
  "message": "MRP calculation completed. Checked 25 items across 5 work orders. Found 3 shortages.",
  "calculation": {
    "id": 45,
    "run_date": "2024-12-01T10:30:00Z",
    "run_by": 1,
    "run_by_name": "John Doe",
    "work_order_id": null,
    "scope": "all",
    "status": "completed",
    "total_items_checked": 25,
    "total_shortages_found": 3,
    "execution_time_seconds": 1.23,
    "summary_data": {
      "work_orders_checked": 5,
      "shortages_by_wo": {
        "WO-2024-001": [
          {
            "product_code": "MAT-001",
            "product_name": "Steel Plate",
            "required": 100,
            "available": 50,
            "shortage": 50
          }
        ]
      }
    }
  },
  "shortages": [
    {
      "id": 789,
      "mrp_calculation_id": 45,
      "work_order_id": 123,
      "wo_number": "WO-2024-001",
      "product_id": 456,
      "product_name": "Steel Plate",
      "product_code": "MAT-001",
      "required_quantity": 100,
      "available_quantity": 50,
      "reserved_quantity": 0,
      "shortage_quantity": 50,
      "required_date": "2024-12-15",
      "recommendation": "purchase",
      "status": "open",
      "created_at": "2024-12-01T10:30:00Z"
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

## MRP Runs

### Get MRP Run History

Retrieve history of MRP calculation runs.

**Endpoint:** `GET /mrp/runs`

**Query Parameters:**
- `id` (optional) - Get specific MRP run
- `status` (optional) - Filter by status (`running`, `completed`, `failed`)
- `limit` (optional) - Limit results (default 50)

**Response (List):**
```json
{
  "runs": [
    {
      "id": 45,
      "run_date": "2024-12-01T10:30:00Z",
      "run_by": 1,
      "run_by_name": "John Doe",
      "work_order_id": null,
      "wo_number": null,
      "scope": "all",
      "status": "completed",
      "total_items_checked": 25,
      "total_shortages_found": 3,
      "execution_time_seconds": 1.23,
      "shortages_count": 3,
      "completed_at": "2024-12-01T10:30:01Z"
    }
  ],
  "statistics": {
    "total_runs": 150,
    "completed_runs": 145,
    "failed_runs": 2,
    "running_runs": 0,
    "total_shortages_all_time": 234,
    "avg_execution_time": 1.45
  },
  "total": 150
}
```

**Response (Single Run):**
```json
{
  "run": {
    "id": 45,
    "run_date": "2024-12-01T10:30:00Z",
    "run_by_name": "John Doe",
    ...
  },
  "shortages": [
    {
      "id": 789,
      "product_code": "MAT-001",
      "product_name": "Steel Plate",
      "required_quantity": 100,
      "shortage_quantity": 50,
      ...
    }
  ]
}
```

### Delete MRP Run

**Endpoint:** `DELETE /mrp/runs?id=45`

**Response:**
```json
{
  "success": true,
  "message": "MRP run deleted successfully"
}
```

---

## MRP Requirements

### Get Material Requirements

Retrieve material requirements and shortages.

**Endpoint:** `GET /mrp/requirements`

**Query Parameters:**
- `work_order_id` (optional) - Filter by work order
- `product_id` (optional) - Filter by product
- `status` (optional) - Filter by status (`open`, `in_progress`, `resolved`)
- `limit` (optional) - Limit results (default 100)

**Response:**
```json
{
  "requirements": [
    {
      "id": 789,
      "mrp_calculation_id": 45,
      "work_order_id": 123,
      "wo_number": "WO-2024-001",
      "product_id": 456,
      "product_code": "MAT-001",
      "product_name": "Steel Plate",
      "unit_of_measure": "kg",
      "current_stock": 50,
      "cost_price": 15000,
      "required_quantity": 100,
      "available_quantity": 50,
      "reserved_quantity": 0,
      "shortage_quantity": 50,
      "required_date": "2024-12-15",
      "work_order_status": "ready",
      "recommendation": "purchase",
      "status": "open",
      "run_date": "2024-12-01T10:30:00Z"
    }
  ],
  "statistics": {
    "total_shortages": 15,
    "open_shortages": 12,
    "resolved_shortages": 3,
    "total_shortage_value": 5000000,
    "unique_products_short": 8,
    "affected_work_orders": 5
  },
  "top_shortages": [
    {
      "id": 456,
      "product_code": "MAT-001",
      "product_name": "Steel Plate",
      "total_shortage": 150,
      "affected_wos": 3,
      "current_stock": 50,
      "cost_price": 15000,
      "shortage_value": 2250000
    }
  ],
  "total": 15
}
```

### Update Shortage Status

**Endpoint:** `PATCH /mrp/requirements`

**Request Body:**
```json
{
  "id": 789,
  "status": "resolved",  // open, in_progress, resolved
  "resolved_by": 1,
  "notes": "Material ordered from Supplier XYZ"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Shortage item updated successfully",
  "item": {
    "id": 789,
    "status": "resolved",
    "resolved_by": 1,
    "resolved_at": "2024-12-01T11:00:00Z",
    ...
  }
}
```

---

## Work Order Materials

### Get Work Order Materials

**Endpoint:** `GET /work-orders/[id]/materials`

**Response:**
```json
{
  "materials": [
    {
      "id": 1,
      "work_order_id": 123,
      "product_id": 456,
      "product_code": "MAT-001",
      "product_name": "Steel Plate",
      "unit_of_measure": "kg",
      "required_quantity": 100,
      "reserved_quantity": 80,
      "issued_quantity": 50,
      "returned_quantity": 0,
      "unit_cost": 15000,
      "line_total": 1500000,
      "status": "reserved",
      "warehouse_id": 1,
      "warehouse_name": "Main Warehouse",
      "current_stock": 200,
      "unreserved_quantity": 20,
      "pending_issue_quantity": 30,
      "availability_status": "sufficient"
    }
  ],
  "reservations": [
    {
      "id": 10,
      "work_order_id": 123,
      "work_order_material_id": 1,
      "product_id": 456,
      "product_code": "MAT-001",
      "product_name": "Steel Plate",
      "warehouse_id": 1,
      "warehouse_name": "Main Warehouse",
      "reserved_quantity": 80,
      "reservation_date": "2024-12-01T09:00:00Z",
      "expiry_date": "2024-12-08T09:00:00Z",
      "status": "active",
      "reserved_by": 1,
      "reserved_by_name": "John Doe"
    }
  ],
  "summary": {
    "total_materials": 5,
    "total_material_cost": 5000000,
    "pending_count": 1,
    "reserved_count": 3,
    "issued_count": 1,
    "completed_count": 0
  }
}
```

### Add Material to Work Order

**Endpoint:** `POST /work-orders/[id]/materials`

**Request Body:**
```json
{
  "product_id": 456,
  "required_quantity": 100,
  "warehouse_id": 1,  // optional
  "notes": "Additional material requirement"  // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Material added successfully",
  "material": {
    "id": 1,
    "work_order_id": 123,
    "product_id": 456,
    "required_quantity": 100,
    "unit_cost": 15000,
    "line_total": 1500000,
    "status": "pending",
    ...
  }
}
```

### Update Work Order Material

**Endpoint:** `PATCH /work-orders/[id]/materials?material_id=1`

**Request Body:**
```json
{
  "required_quantity": 120,  // optional
  "status": "reserved",      // optional
  "notes": "Updated quantity"  // optional
}
```

### Delete Work Order Material

**Endpoint:** `DELETE /work-orders/[id]/materials?material_id=1`

**Response:**
```json
{
  "success": true,
  "message": "Material deleted successfully"
}
```

**Note:** Cannot delete if there are active reservations.

---

## Material Reservations

### Reserve Material

**Endpoint:** `POST /materials/reserve`

**Request Body:**
```json
{
  "work_order_material_id": 1,
  "quantity": 100,
  "warehouse_id": 1,  // optional
  "expiry_days": 7,   // optional, default 7
  "reserved_by": 1,   // optional
  "notes": "Reserved for urgent order"  // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Material reserved successfully",
  "reservation": {
    "id": 10,
    "work_order_material_id": 1,
    "product_id": 456,
    "warehouse_id": 1,
    "reserved_quantity": 100,
    "reservation_date": "2024-12-01T09:00:00Z",
    "expiry_date": "2024-12-08T09:00:00Z",
    "status": "active",
    "reserved_by": 1
  }
}
```

### Release Reservation

**Endpoint:** `PATCH /materials/reserve?reservation_id=10`

**Request Body:**
```json
{
  "status": "released",
  "released_by": 1,
  "notes": "Work order cancelled"
}
```

### Get Reservations

**Endpoint:** `GET /materials/reserve`

**Query Parameters:**
- `work_order_id` (optional)
- `product_id` (optional)
- `status` (optional) - `active`, `released`, `expired`, `consumed`
- `limit` (optional) - default 100

---

## Material Issuance

### Issue Material to Production

**Endpoint:** `POST /materials/issue`

**Request Body:**
```json
{
  "work_order_material_id": 1,
  "quantity": 50,
  "issued_by": 1,  // optional
  "notes": "Issued for first batch"  // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully issued 50 units to production",
  "material": {
    "id": 1,
    "work_order_id": 123,
    "product_id": 456,
    "product_code": "MAT-001",
    "product_name": "Steel Plate",
    "unit_of_measure": "kg",
    "required_quantity": 100,
    "reserved_quantity": 100,
    "issued_quantity": 50,
    "current_stock": 150,
    "status": "issued",
    "wo_number": "WO-2024-001"
  }
}
```

**Validation:**
- Issue quantity cannot exceed reserved quantity
- Inventory must be sufficient
- Work order must be in appropriate status

### Get Issuance History

**Endpoint:** `GET /materials/issue`

**Query Parameters:**
- `work_order_id` (optional)
- `product_id` (optional)
- `limit` (optional) - default 100

**Response:**
```json
{
  "issuances": [
    {
      "id": 1,
      "work_order_id": 123,
      "wo_number": "WO-2024-001",
      "wo_status": "in_progress",
      "product_id": 456,
      "product_code": "MAT-001",
      "product_name": "Steel Plate",
      "unit_of_measure": "kg",
      "required_quantity": 100,
      "reserved_quantity": 100,
      "issued_quantity": 50,
      "status": "issued",
      "unit_cost": 15000,
      "line_total": 750000,
      "last_issue_date": "2024-12-01T10:00:00Z",
      "remaining_to_issue": 50
    }
  ],
  "statistics": {
    "work_orders_with_issues": 25,
    "total_material_lines": 150,
    "total_issued_value": 50000000,
    "total_units_issued": 5000
  },
  "total": 150
}
```

---

## Production Routing

### Get Production Routes

**Endpoint:** `GET /routings`

**Query Parameters:**
- `id` (optional) - Get specific route with operations
- `product_id` (optional) - Filter by product
- `limit` (optional) - default 100

**Response (List):**
```json
{
  "routes": [
    {
      "id": 1,
      "route_code": "ROUTE-TSHIRT-001",
      "route_name": "T-Shirt Standard Production",
      "product_id": 100,
      "product_code": "PROD-TSHIRT",
      "product_name": "Cotton T-Shirt",
      "is_default": true,
      "is_active": true,
      "operations_count": 4,
      "created_at": "2024-11-01T00:00:00Z"
    }
  ],
  "total": 15
}
```

**Response (Single Route):**
```json
{
  "route": {
    "id": 1,
    "route_code": "ROUTE-TSHIRT-001",
    "route_name": "T-Shirt Standard Production",
    "product_id": 100,
    "product_code": "PROD-TSHIRT",
    "product_name": "Cotton T-Shirt",
    "is_default": true,
    "is_active": true
  },
  "operations": [
    {
      "id": 1,
      "route_id": 1,
      "sequence_number": 10,
      "operation_name": "Cutting Fabric",
      "operation_type": "process",
      "workstation_id": 5,
      "workstation_code": "WS-CUT-01",
      "workstation_name": "Cutting Station 1",
      "workstation_cost_per_hour": 25000,
      "setup_time_minutes": 15,
      "run_time_per_unit": 2,
      "labor_cost_per_hour": 25000,
      "labor_hours_per_unit": 0.0333,
      "description": "Cut fabric according to pattern"
    }
  ],
  "totals": {
    "total_setup_time": 40,
    "total_run_time_per_unit": 8.5,
    "total_labor_hours_per_unit": 0.1417,
    "total_labor_cost_per_unit": 3542.5
  }
}
```

### Create Production Route

**Endpoint:** `POST /routings`

**Request Body:**
```json
{
  "route_code": "ROUTE-WIDGET-001",
  "route_name": "Widget Assembly Process",
  "product_id": 200,
  "is_default": true,
  "description": "Standard widget assembly route",
  "operations": [
    {
      "sequence_number": 10,
      "operation_name": "Component Assembly",
      "operation_type": "process",
      "workstation_id": 3,
      "setup_time_minutes": 20,
      "run_time_per_unit": 5,
      "labor_cost_per_hour": 28000,
      "labor_hours_per_unit": 0.0833,
      "description": "Assemble main components"
    },
    {
      "sequence_number": 20,
      "operation_name": "Quality Inspection",
      "operation_type": "inspection",
      "workstation_id": 7,
      "setup_time_minutes": 5,
      "run_time_per_unit": 2,
      "labor_cost_per_hour": 22000,
      "labor_hours_per_unit": 0.0333,
      "description": "Visual and dimensional inspection"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Production route created successfully",
  "route": {
    "id": 15,
    "route_code": "ROUTE-WIDGET-001",
    "route_name": "Widget Assembly Process",
    "product_id": 200,
    "is_default": true,
    "is_active": true
  },
  "operations": [
    { "id": 45, "sequence_number": 10, ... },
    { "id": 46, "sequence_number": 20, ... }
  ]
}
```

### Update Production Route

**Endpoint:** `PATCH /routings?id=15`

**Request Body:**
```json
{
  "route_name": "Widget Assembly Process - Updated",
  "is_default": false,
  "is_active": true,
  "description": "Updated description"
}
```

### Delete Production Route

**Endpoint:** `DELETE /routings?id=15`

**Response:**
```json
{
  "success": true,
  "message": "Production route deleted successfully"
}
```

**Note:** Cannot delete routes used in work orders. Deactivate instead.

---

## Error Handling

### Standard Error Response

```json
{
  "error": "Error message",
  "details": "Detailed error information"
}
```

### Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request - Invalid parameters |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error - Internal error |

### Common Errors

**Insufficient Inventory:**
```json
{
  "error": "Insufficient inventory",
  "details": {
    "requested": 100,
    "available": 50
  }
}
```

**Material Not Found:**
```json
{
  "error": "Work order material not found"
}
```

**Cannot Delete (In Use):**
```json
{
  "error": "Cannot delete route that is used in work orders. Consider deactivating instead."
}
```

---

## Examples

### Complete MRP Workflow

#### 1. Create Work Order
```bash
POST /api/operations/work-orders
{
  "product_id": 100,
  "quantity_to_produce": 50,
  "bom_id": 25
}
```
→ Materials auto-populated from BOM

#### 2. Run MRP
```bash
POST /api/operations/mrp/calculate
{
  "work_order_id": 123
}
```
→ Identifies shortages

#### 3. Check Shortages
```bash
GET /api/operations/mrp/requirements?work_order_id=123&status=open
```
→ Shows shortage details

#### 4. Resolve Shortages
- Create purchase order for short materials
- Update shortage status to "in_progress"

#### 5. Reserve Materials (After Receiving)
```bash
POST /api/operations/materials/reserve
{
  "work_order_material_id": 1,
  "quantity": 100
}
```

#### 6. Issue to Production
```bash
POST /api/operations/materials/issue
{
  "work_order_material_id": 1,
  "quantity": 50
}
```

#### 7. Verify
```bash
GET /api/operations/work-orders/123/materials
```
→ Check material status

---

## Rate Limiting

Currently no rate limits. Recommended best practices:
- Avoid concurrent MRP calculations
- Use pagination for large result sets
- Cache results where appropriate

---

## Changelog

### Version 1.0 (December 1, 2024)
- Initial release
- MRP calculation endpoints
- Material reservation endpoints
- Material issuance endpoints
- Production routing endpoints

---

## Support

For API support:
- **Documentation**: /docs/OPERATIONS_MRP_USER_GUIDE.md
- **Email**: api-support@ocean-erp.com
- **GitHub**: https://github.com/ocean-erp

---

**End of API Documentation**
