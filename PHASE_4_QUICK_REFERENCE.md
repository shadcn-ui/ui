# Phase 4: Supply Chain - Quick Reference

## 🚀 Quick Start Commands

### Supplier Scorecards

```bash
# Auto-calculate scorecard
curl -X POST http://localhost:4000/api/supply-chain/scorecards/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "supplier_id": 1,
    "evaluation_period_start": "2025-10-01",
    "evaluation_period_end": "2025-12-01",
    "evaluated_by": 1
  }'

# Get supplier rankings
curl http://localhost:4000/api/supply-chain/suppliers/rankings
```

### Reorder Points

```bash
# Calculate reorder point
curl -X POST http://localhost:4000/api/supply-chain/reorder-points/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 100,
    "supplier_id": 5,
    "service_level_target": 95
  }'

# Get products needing reorder
curl "http://localhost:4000/api/supply-chain/reorder-points?review_due=true"
```

### RFQ Workflow

```bash
# 1. Create RFQ
curl -X POST http://localhost:4000/api/supply-chain/rfqs \
  -d '{"title":"Office Supplies","response_deadline":"2026-01-15",...}'

# 2. Auto-invite suppliers
curl -X POST http://localhost:4000/api/supply-chain/rfqs/1/invite \
  -d '{"auto_select":true,"min_score":70,"max_suppliers":10}'

# 3. Submit quote (vendor)
curl -X POST http://localhost:4000/api/supply-chain/rfqs/1/quotes \
  -d '{"supplier_id":5,"valid_until":"2026-02-01","items":[...]}'

# 4. Evaluate quotes
curl -X POST http://localhost:4000/api/supply-chain/rfqs/1/evaluate \
  -d '{"price_weight":50,"quality_weight":30,"delivery_weight":20}'

# 5. Award RFQ
curl -X POST http://localhost:4000/api/supply-chain/rfqs/1/award \
  -d '{"quote_id":10,"awarded_by":1,"create_purchase_order":true}'
```

### Purchase Orders

```bash
# Receive goods
curl -X POST http://localhost:4000/api/supply-chain/purchase-orders/5/receive \
  -d '{"delivery_number":"DEL-001","received_by":1,"items":[...]}'

# Record invoice (3-way match)
curl -X POST http://localhost:4000/api/supply-chain/purchase-orders/5/invoice \
  -d '{"invoice_number":"INV-001","total_amount":10000,...}'
```

### Analytics

```bash
# Spend analysis
curl "http://localhost:4000/api/supply-chain/analytics/spend?period=90&group_by=supplier"

# Contract expiry
curl "http://localhost:4000/api/supply-chain/contracts?expiring_soon=30"
```

## 📊 Key Formulas

### Safety Stock
```
SS = Z × √(LT × σ²_demand + D² × σ²_LT)

Z-Scores:
- 95% service level: 1.645
- 99% service level: 2.326
```

### Reorder Point
```
ROP = (Avg Daily Demand × Avg Lead Time) + Safety Stock
```

### EOQ
```
EOQ = √((2 × Annual Demand × Order Cost) / Holding Cost per Unit)
```

### Quote Scoring
```
Total Score = (Price Score × 50%) + (Quality Score × 30%) + (Delivery Score × 20%)
```

## 🔑 Key Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/supply-chain/scorecards` | GET/POST | Supplier scorecards |
| `/api/supply-chain/scorecards/calculate` | POST | Auto-calculate scorecard |
| `/api/supply-chain/reorder-points` | GET/POST | Reorder point rules |
| `/api/supply-chain/reorder-points/calculate` | POST | Calculate reorder point |
| `/api/supply-chain/rfqs` | GET/POST | RFQ management |
| `/api/supply-chain/rfqs/[id]/invite` | POST | Invite suppliers |
| `/api/supply-chain/rfqs/[id]/evaluate` | POST | Evaluate quotes |
| `/api/supply-chain/rfqs/[id]/award` | POST | Award RFQ |
| `/api/supply-chain/purchase-orders/[id]/receive` | POST | Receive goods |
| `/api/supply-chain/purchase-orders/[id]/invoice` | POST | 3-way match |
| `/api/supply-chain/analytics/spend` | GET | Spend analysis |
| `/api/supply-chain/contracts` | GET/POST | Contract management |

## 🎯 Common Workflows

### Supplier Evaluation
1. Calculate scorecard (auto pulls quality data)
2. Review rankings
3. Update criteria weights if needed
4. Approve final scorecard

### Inventory Replenishment
1. System calculates reorder points nightly
2. Products at/below ROP trigger alerts
3. Review reorder recommendations
4. Create RFQ or direct PO

### Procurement Cycle
1. **Create PR** → Approval → Create RFQ
2. **Invite Suppliers** → Receive Quotes
3. **Evaluate** → Award → Generate PO
4. **Receive Goods** → Quality Inspection
5. **Invoice Match** → Approve Payment

## 💡 Pro Tips

**Scorecards:**
- Run monthly for trending
- Adjust criteria weights per industry
- Use auto-calculation for objectivity

**Reorder Points:**
- 95% service level = good balance
- Review every 90 days
- Higher variability = higher safety stock

**RFQs:**
- Auto-invite saves time
- Adjust scoring weights per purchase type
- Critical items: quality weight > price weight

**3-Way Matching:**
- <5% variance = auto-approve
- >5% variance = manual review
- Track rejection patterns

## 🐛 Troubleshooting

**Reorder Point Too High:**
- Check demand variability (CV)
- Reduce service level (95% → 90%)
- Verify lead time accuracy

**No Quotes Received:**
- Check supplier scorecard minimums
- Verify response deadline reasonable
- Review invited supplier list

**Invoice Mismatch:**
- Verify all items received
- Check PO amendments
- Review pricing contracts

## 📞 Support

**Quick Help:** #supply-chain-support (Slack)
**Docs:** /docs/supply-chain
**Training:** /training/procurement
