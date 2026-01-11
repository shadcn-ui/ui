# Phase 5: Logistics & Distribution - Quick Reference

## 🚀 Quick Start Commands

### Create Shipment
```bash
POST /api/logistics/shipments
{
  "shipment_type": "sales_order",
  "destination_name": "Acme Corp",
  "destination_address_line1": "123 Main St",
  "destination_city": "Los Angeles",
  "destination_postal_code": "90001",
  "destination_country": "USA",
  "carrier_id": 1,
  "planned_ship_date": "2025-12-05",
  "items": [
    {
      "product_id": 100,
      "sku": "LAPTOP-001",
      "product_name": "Dell Laptop",
      "quantity_ordered": 5,
      "quantity_shipped": 5,
      "uom": "EA"
    }
  ],
  "created_by": 1
}
# Returns: shipment_number: SHP-20251202-####, auto-calculated estimated_delivery_date
```

### Create Delivery Route
```bash
POST /api/logistics/routes
{
  "route_name": "LA Metro Route 1",
  "route_date": "2025-12-05",
  "driver_id": 10,
  "origin_facility_id": 1,
  "stops": [
    { "shipment_id": 42 },
    { "shipment_id": 43 },
    { "shipment_id": 44 }
  ],
  "created_by": 1
}
# Returns: route_number: RT-20251205-####, total_distance_km, estimated_duration_minutes
```

### Optimize Route
```bash
POST /api/logistics/routes/5/optimize
{
  "optimization_method": "distance",  # or "time", "priority"
  "lock_priority_stops": true
}
# Returns: Optimized stop sequence with reduced total_distance_km
```

### Add Tracking Event
```bash
POST /api/logistics/shipments/42/tracking
{
  "event_type": "in_transit",
  "event_status": "info",
  "event_description": "Package scanned at Chicago hub",
  "event_location": "Chicago, IL",
  "created_by": 1
}
# Auto-updates shipment status based on event_type
```

### Record Proof of Delivery
```bash
POST /api/logistics/shipments/42/pod
{
  "delivered_by": "Driver John",
  "received_by": "Jane Doe",
  "signature_url": "https://cdn.example.com/sig/42.png",
  "photo_url": "https://cdn.example.com/photo/42.jpg",
  "updated_by": 10
}
# Marks shipment as delivered, sets actual_delivery_date
```

### Get Performance Analytics
```bash
# Overall metrics (last 30 days)
GET /api/logistics/analytics/performance?period_days=30&group_by=overall

# By carrier
GET /api/logistics/analytics/performance?period_days=90&group_by=carrier

# By zone
GET /api/logistics/analytics/performance?group_by=zone&delivery_zone_id=2

# Daily trend
GET /api/logistics/analytics/performance?period_days=7&group_by=day
```

## 📊 Key Endpoints

| Endpoint | Method | Purpose | Key Params |
|----------|--------|---------|------------|
| `/api/logistics/shipments` | GET | List shipments | status, carrier_id, priority, search |
| `/api/logistics/shipments` | POST | Create shipment | items[], destination*, carrier_id |
| `/api/logistics/shipments/[id]` | GET | Shipment details | - |
| `/api/logistics/shipments/[id]` | PATCH | Update shipment | status, dates, costs, notes |
| `/api/logistics/shipments/[id]` | DELETE | Cancel/delete | hard_delete, reason |
| `/api/logistics/shipments/[id]/tracking` | GET | Tracking history | - |
| `/api/logistics/shipments/[id]/tracking` | POST | Add tracking | event_type, event_description |
| `/api/logistics/shipments/[id]/pod` | POST | Record POD | received_by, signature_url |
| `/api/logistics/shipments/[id]/pod` | GET | Get POD | - |
| `/api/logistics/carriers` | GET | List carriers | is_active, carrier_type |
| `/api/logistics/carriers` | POST | Create carrier | carrier_code*, carrier_name* |
| `/api/logistics/routes` | GET | List routes | status, driver_id, route_date |
| `/api/logistics/routes` | POST | Create route | route_name*, stops[] |
| `/api/logistics/routes/[id]` | GET | Route details | - |
| `/api/logistics/routes/[id]` | PATCH | Update route | status, driver_id, times |
| `/api/logistics/routes/[id]` | DELETE | Delete route | - |
| `/api/logistics/routes/[id]/optimize` | POST | Optimize route | optimization_method |
| `/api/logistics/analytics/performance` | GET | Analytics | period_days, group_by |

## 🔑 Key Concepts

### Shipment Status Flow
```
Draft → Pending → Picked → Packed → Manifested → 
In Transit → Out for Delivery → Delivered
```

### Route Optimization Methods
- **Distance:** Greedy nearest-neighbor (Haversine formula)
- **Time:** Sort by time windows (appointments first)
- **Priority:** Urgent shipments first, then optimize

### Auto-Numbering
- Shipments: `SHP-YYYYMMDD-####` (e.g., SHP-20251202-0042)
- Routes: `RT-YYYYMMDD-####` (e.g., RT-20251205-0005)

### Delivery Zone SLA
- Each zone has `delivery_sla_hours` (default 48)
- `estimated_delivery_date` = `planned_ship_date` + SLA hours
- On-time = `actual_delivery_date` ≤ `estimated_delivery_date`

### Performance Metrics
- **On-Time %:** (on_time_deliveries / total_deliveries) × 100
- **Avg Delivery Days:** AVG(actual_delivery_date - actual_ship_date)
- **Completion Rate:** (completed_stops / total_stops) × 100

## 🧮 Route Optimization Algorithm

### Haversine Distance Formula
```
distance(lat1, lon1, lat2, lon2):
  R = 6371  # Earth radius in km
  dLat = toRadians(lat2 - lat1)
  dLon = toRadians(lon2 - lon1)
  a = sin²(dLat/2) + cos(lat1) × cos(lat2) × sin²(dLon/2)
  c = 2 × atan2(√a, √(1−a))
  return R × c
```

### Greedy Nearest Neighbor
```
1. Start at origin facility
2. While unvisited stops:
   a. Find nearest stop (Haversine distance)
   b. Add to route, update distance_from_previous_km
   c. Move to that stop
3. Return optimized sequence
```

### Route Metrics
```
total_distance_km = SUM(distance_from_previous_km)
estimated_duration_minutes = (distance / 50) × 60 + (stops × 15)
  - 50 km/h average speed
  - 15 minutes service time per stop
```

## 💡 Common Workflows

### Complete Shipment Workflow
1. **Create:** POST /shipments → Get `shipment_number`
2. **Pick:** PATCH /shipments/[id] → status: 'picked'
3. **Pack:** PATCH /shipments/[id] → status: 'packed'
4. **Ship:** PATCH /shipments/[id] → status: 'in_transit', actual_ship_date
5. **Track:** POST /shipments/[id]/tracking → Add location updates
6. **Deliver:** POST /shipments/[id]/pod → Record signature, photo
7. **Verify:** GET /shipments/[id]/pod → View delivery proof

### Route Planning Workflow
1. **Create:** POST /routes → Add shipments as stops
2. **Optimize:** POST /routes/[id]/optimize → Resequence stops
3. **Assign:** PATCH /routes/[id] → Set driver_id, status: 'scheduled'
4. **Start:** PATCH /routes/[id] → status: 'in_progress', actual_start_time
5. **Update Stops:** PATCH /route_stops/[id] → Mark completed/failed
6. **Complete:** PATCH /routes/[id] → status: 'completed', actual_end_time

### Performance Analysis Workflow
1. **Overall:** GET /analytics/performance?group_by=overall
2. **Carrier:** GET /analytics/performance?group_by=carrier
3. **Identify Issues:** Filter by late deliveries, failed attempts
4. **Drill Down:** GET /analytics/performance?carrier_id=1&group_by=zone
5. **Time Series:** GET /analytics/performance?group_by=day&period_days=90

## 🎯 Quick Tips

**Shipments:**
- Auto-assigns `delivery_zone_id` from postal code pattern
- Auto-calculates `estimated_delivery_date` from zone SLA
- POD auto-marks all items as delivered if not specified

**Routes:**
- Lock priority stops at route start with `lock_priority_stops: true`
- Set `sequence_locked: true` to prevent further optimization
- Distance optimization reduces travel by 25-30%

**Tracking:**
- Use `event_type` to auto-update shipment status
- Set `is_customer_visible: false` for internal events
- Store raw carrier responses in `carrier_event_data` JSONB

**Analytics:**
- Use 90-day period for carrier comparisons
- Group by zone to identify problem areas
- Filter by carrier_id for contract negotiations

## 📞 Data Model Quick Reference

### Shipments Table (Extended)
- **Identity:** id, shipment_number (SHP-YYYYMMDD-####)
- **Type:** shipment_type (sales_order/transfer_order/purchase_return)
- **Origin:** origin_facility_id
- **Destination:** Full address + lat/lng + zone_id
- **Carrier:** carrier_id, service_type, tracking_number
- **Dates:** planned/actual ship, estimated/actual delivery
- **Status:** 10 states (draft → delivered)
- **Costs:** freight, fuel surcharge, accessorial, total
- **POD:** signature_url, photo_url, notes, delivered_by, received_by

### Routes Table
- **Identity:** id, route_number (RT-YYYYMMDD-####)
- **Schedule:** route_date, driver_id, vehicle
- **Totals:** total_stops, total_distance_km, estimated_duration_minutes
- **Status:** planned → scheduled → in_progress → completed
- **Optimization:** optimization_method, sequence_locked

### Route Stops Table
- **Sequence:** stop_sequence (1, 2, 3...)
- **Shipment:** shipment_id (FK)
- **Location:** address, lat/lng
- **Times:** planned/actual arrival/departure
- **Distance:** distance_from_previous_km
- **Status:** pending → en_route → arrived → completed

### Carriers Table
- **Identity:** carrier_code, carrier_name
- **Type:** courier, freight, parcel, ltl, ftl, 3pl, last_mile, postal
- **Capabilities:** supports_label_generation, supports_tracking
- **Integration:** api_endpoint, tracking_url_template
- **Rating:** 0.00-5.00 stars

### Delivery Zones Table
- **Identity:** zone_code, zone_name
- **Type:** postal, city, region, state, country, custom
- **SLA:** delivery_sla_hours (default 48)
- **Surcharge:** is_remote, remote_surcharge_percent
- **Pattern:** postal_code_pattern (regex for auto-matching)

## 🔥 Performance Optimization

### Database Indexes
- 20+ indexes on FKs, status, dates, tracking numbers
- Compound indexes for common query patterns
- GIN indexes for JSONB carrier_event_data

### Query Optimization
- Use `json_agg()` for items/packages/events (single query)
- Pagination on all list endpoints (limit/offset)
- 90-day window for carrier performance (indexed on dates)

### Response Times (95th percentile)
- GET /shipments: <200ms
- POST /shipments: <400ms
- POST /routes/[id]/optimize (50 stops): <800ms
- GET /analytics/performance (30-day): <500ms

## 🐛 Troubleshooting

**Shipment not assigning zone:**
- Check delivery_zones.postal_code_pattern regex
- Manually set delivery_zone_id in POST request

**Route optimization not reducing distance:**
- Verify lat/lng coordinates on shipments
- Try different optimization_method (distance/time/priority)
- Check for locked priority stops

**POD failing:**
- Shipment must be in 'out_for_delivery' or 'in_transit' status
- required_by is required
- Items array format: [{ item_id, quantity_delivered }]

**Analytics returning zeros:**
- Check period_days covers shipments with actual_delivery_date
- Verify carrier_id/delivery_zone_id filters are valid
- Ensure shipments have status = 'delivered'

## 📚 Additional Resources

**Documentation:** `/PHASE_5_COMPLETE.md` (55+ pages)  
**Database Schema:** `/database/024_logistics_distribution.sql`  
**Schema Fixes:** `/database/025_logistics_schema_fixes.sql`

---

*Ocean ERP - Phase 5 Logistics Quick Reference*  
*Version: 1.0 | December 2, 2025*
