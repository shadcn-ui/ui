# 🎯 Ocean ERP Implementation Plan - Skincare Retail (300+ Outlets)

**Date:** November 12, 2025  
**Status:** Ready to Build  
**Customization:** Indonesian Skincare Retail Chain

---

## 📋 Requirements Summary (Based on Your Answers)

### ✅ Confirmed Requirements

```yaml
Payment Gateway:
  - Midtrans integration ✓
  - Xendit integration ✓
  - Multiple payment methods support

Tax System:
  - Single tax rate (PPN 11% in Indonesia)
  - Applied to all taxable items
  - Non-taxable items flagged

Loyalty Program:
  - Points earned per Rupiah spent (admin configurable)
  - Point redemption rate (admin configurable)
  - 5 membership tiers: Bronze → Silver → Gold → Platinum → Titanium
  - Tier criteria fully customizable by admin

Commission System:
  - Not needed initially (Phase 2+)

Customer Database:
  - Starting fresh (no migration needed)
  - Sample data structure provided

Product Catalog:
  - Treatment-based SKU structure
  - Manual SKU entry + Barcode scanning
  - Sample catalog provided

Batch Tracking:
  - Will implement (future regulatory compliance)

Barcode System:
  - Scanner support + Manual entry fallback
  - Flexible input method

Network Resilience:
  - Offline-first architecture
  - Auto-sync when connection restored
  - Local data persistence (4-hour buffer)
```

---

## 🏗️ Architecture: Offline-First Design

### Network Disconnect Strategy

```
┌─────────────────────────────────────────────────────┐
│ ONLINE MODE (Normal Operation)                      │
├─────────────────────────────────────────────────────┤
│ POS Terminal                                        │
│   ↓ ↑ Real-time                                    │
│ Cloud Server (Central Database)                    │
│   ↓ ↑ Sync                                         │
│ All 300 Outlets                                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ OFFLINE MODE (Internet Disconnected)                │
├─────────────────────────────────────────────────────┤
│ POS Terminal (Local Storage)                        │
│   ├─ IndexedDB: Product catalog (cached)          │
│   ├─ LocalStorage: Current session                │
│   ├─ Transaction Queue: Pending sales             │
│   └─ Local Inventory: Last known stock            │
│                                                      │
│ Features Available Offline:                         │
│   ✓ Complete checkout (cash/card terminal)        │
│   ✓ Product search (cached catalog)               │
│   ✓ Customer lookup (cached data)                 │
│   ✓ Print receipts                                │
│   ✓ View inventory (last sync)                    │
│   ✗ Real-time stock check (uses cache)            │
│   ✗ New customer creation (queued)                │
│                                                      │
│ Auto-Sync When Online:                              │
│   1. Upload all pending transactions               │
│   2. Download inventory updates                    │
│   3. Sync customer changes                         │
│   4. Update product prices                         │
│   5. Validate transaction integrity                │
└─────────────────────────────────────────────────────┘

Visual Indicators:
🟢 Online  - Full features available
🟡 Syncing - Auto-sync in progress
🔴 Offline - Limited features, queuing enabled
```

---

## 💳 Payment Gateway Integration

### Supported Payment Methods

```typescript
// Midtrans Payment Methods
enum MidtransPaymentMethod {
  CREDIT_CARD = 'credit_card',
  GOPAY = 'gopay',
  SHOPEEPAY = 'shopeepay',
  QRIS = 'qris',
  BCA_VA = 'bca_va',
  BNI_VA = 'bni_va',
  MANDIRI_VA = 'mandiri_va',
  PERMATA_VA = 'permata_va',
  INDOMARET = 'indomaret',
  ALFAMART = 'alfamart',
}

// Xendit Payment Methods
enum XenditPaymentMethod {
  CREDIT_CARD = 'credit_card',
  OVO = 'ovo',
  DANA = 'dana',
  LINKAJA = 'linkaja',
  QRIS = 'qris',
  VA_BCA = 'va_bca',
  VA_BNI = 'va_bni',
  VA_MANDIRI = 'va_mandiri',
  VA_BRI = 'va_bri',
  RETAIL_OUTLET = 'retail_outlet', // Alfamart/Indomaret
}

// POS Transaction Payment
interface POSPayment {
  method: 'cash' | 'card_terminal' | 'qris' | 'ewallet' | 'split';
  cash_amount?: number;
  card_amount?: number;
  ewallet_amount?: number;
  ewallet_provider?: string; // GoPay, ShopeePay, OVO, DANA
  qris_amount?: number;
  tender_amount?: number;
  change_amount?: number;
}
```

---

## 💰 Indonesia-Specific Tax Configuration

```sql
-- Tax Configuration Table
CREATE TABLE tax_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tax_name VARCHAR(100) NOT NULL, -- "PPN" (Pajak Pertambahan Nilai)
    tax_type VARCHAR(50) NOT NULL, -- "vat" (Value Added Tax)
    tax_rate DECIMAL(5,2) NOT NULL, -- 11.00 (11%)
    is_active BOOLEAN DEFAULT true,
    effective_from DATE NOT NULL,
    effective_until DATE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default Indonesian tax
INSERT INTO tax_configurations (tax_name, tax_type, tax_rate, effective_from)
VALUES ('PPN', 'vat', 11.00, '2022-04-01');

-- Products tax configuration
ALTER TABLE products ADD COLUMN IF NOT EXISTS
    is_taxable BOOLEAN DEFAULT true,
    tax_category VARCHAR(50) DEFAULT 'standard'; -- standard, exempt, zero_rated
```

---

## 🎁 Loyalty Program Configuration

### Database Schema

```sql
-- Membership Tier Configuration (Admin Configurable)
CREATE TABLE membership_tiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tier_code VARCHAR(20) UNIQUE NOT NULL, -- BRONZE, SILVER, GOLD, PLATINUM, TITANIUM
    tier_name VARCHAR(50) NOT NULL,
    tier_level INTEGER NOT NULL, -- 1=Bronze, 2=Silver, 3=Gold, 4=Platinum, 5=Titanium
    tier_color VARCHAR(20), -- #CD7F32, #C0C0C0, #FFD700, #E5E4E2, #878681
    
    -- Upgrade Criteria (Admin Sets These)
    min_total_purchase DECIMAL(15,2), -- Total lifetime purchase in IDR
    min_annual_purchase DECIMAL(15,2), -- Purchase in last 12 months
    min_transaction_count INTEGER, -- Number of transactions
    min_points_earned INTEGER, -- Total points earned
    
    -- Benefits
    discount_percentage DECIMAL(5,2) DEFAULT 0, -- Base discount %
    points_multiplier DECIMAL(5,2) DEFAULT 1.0, -- 1x, 1.5x, 2x points
    birthday_bonus_points INTEGER DEFAULT 0,
    free_shipping BOOLEAN DEFAULT false,
    priority_support BOOLEAN DEFAULT false,
    exclusive_products BOOLEAN DEFAULT false,
    early_access_sales BOOLEAN DEFAULT false,
    
    -- Additional Benefits (Flexible)
    benefits JSONB DEFAULT '{}',
    
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default tiers (EXAMPLE - Admin can modify)
INSERT INTO membership_tiers (tier_code, tier_name, tier_level, tier_color, 
    min_total_purchase, points_multiplier, discount_percentage, display_order) 
VALUES 
    ('BRONZE', 'Bronze Member', 1, '#CD7F32', 0, 1.0, 0, 1),
    ('SILVER', 'Silver Member', 2, '#C0C0C0', 5000000, 1.2, 5, 2),
    ('GOLD', 'Gold Member', 3, '#FFD700', 15000000, 1.5, 10, 3),
    ('PLATINUM', 'Platinum Member', 4, '#E5E4E2', 50000000, 2.0, 15, 4),
    ('TITANIUM', 'Titanium Member', 5, '#878681', 100000000, 3.0, 20, 5);

-- Loyalty Points Configuration (Admin Configurable)
CREATE TABLE loyalty_points_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_name VARCHAR(100) NOT NULL,
    config_type VARCHAR(50) NOT NULL, -- earn_rate, redemption_rate, expiry_days
    
    -- Earning Points
    points_per_idr DECIMAL(10,4), -- e.g., 1 point per 10000 IDR = 0.0001
    min_purchase_for_points DECIMAL(15,2), -- Minimum purchase to earn points
    
    -- Redemption
    redemption_rate DECIMAL(10,4), -- e.g., 1 point = 1000 IDR = 0.0001
    min_points_for_redemption INTEGER, -- Minimum points to redeem
    max_points_per_transaction INTEGER, -- Max points usable per transaction
    max_redemption_percentage DECIMAL(5,2), -- Max % of transaction redeemable
    
    -- Expiry
    points_expiry_days INTEGER, -- Points expire after X days
    expiry_notification_days INTEGER, -- Notify X days before expiry
    
    is_active BOOLEAN DEFAULT true,
    effective_from DATE NOT NULL,
    effective_until DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default configuration (EXAMPLE - Admin can modify)
INSERT INTO loyalty_points_config (
    config_name, config_type, 
    points_per_idr, min_purchase_for_points,
    redemption_rate, min_points_for_redemption, 
    max_redemption_percentage, points_expiry_days,
    effective_from
) VALUES (
    'Default Points System', 'standard',
    0.0001, 50000, -- Earn 1 point per 10,000 IDR, min 50k purchase
    1000, 100, -- Redeem 1 point = 1000 IDR, min 100 points
    50, 365, -- Max 50% redemption, expire in 1 year
    CURRENT_DATE
);

-- Enhanced Customers Table
ALTER TABLE customers ADD COLUMN IF NOT EXISTS
    -- Membership
    membership_number VARCHAR(50) UNIQUE,
    membership_tier_id UUID REFERENCES membership_tiers(id),
    membership_status VARCHAR(20) DEFAULT 'active', -- active, expired, suspended
    membership_enrolled_date DATE,
    tier_upgrade_date DATE,
    
    -- Loyalty Points
    loyalty_points INTEGER DEFAULT 0,
    points_earned_lifetime INTEGER DEFAULT 0,
    points_redeemed_lifetime INTEGER DEFAULT 0,
    points_expired_lifetime INTEGER DEFAULT 0,
    
    -- Purchase History
    lifetime_purchase_value DECIMAL(15,2) DEFAULT 0,
    annual_purchase_value DECIMAL(15,2) DEFAULT 0, -- Rolling 12 months
    last_12_months_purchase DECIMAL(15,2) DEFAULT 0,
    total_transactions INTEGER DEFAULT 0,
    last_purchase_date DATE,
    
    -- Personal Info (for skincare profile)
    birth_date DATE,
    gender VARCHAR(20), -- male, female, other
    skin_type VARCHAR(50), -- normal, oily, dry, combination, sensitive
    skin_concerns TEXT[], -- ["acne", "aging", "pigmentation", "dryness"]
    allergies TEXT[],
    
    -- Preferences
    preferred_outlet_id UUID REFERENCES warehouses(id),
    preferred_brands TEXT[],
    communication_preferences JSONB DEFAULT '{"email": true, "sms": true, "whatsapp": false}',
    
    -- Metadata
    referral_code VARCHAR(20) UNIQUE,
    referred_by UUID REFERENCES customers(id);

-- Loyalty Points History (Detailed Tracking)
CREATE TABLE loyalty_points_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id),
    
    transaction_type VARCHAR(50) NOT NULL, 
    -- earned, redeemed, expired, adjusted, bonus, referral, birthday
    
    points INTEGER NOT NULL, -- Can be negative for redemption
    balance_before INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    
    -- Reference
    reference_type VARCHAR(50), -- sale, return, manual, promotion, birthday
    reference_id UUID, -- sales_order_id, etc.
    sales_order_id UUID REFERENCES sales_orders(id),
    
    -- Details
    description TEXT,
    notes TEXT,
    
    -- Expiry (for earned points)
    expires_at DATE,
    
    -- Tracking
    created_by UUID REFERENCES users(id),
    outlet_id UUID REFERENCES warehouses(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_loyalty_history_customer ON loyalty_points_history(customer_id);
CREATE INDEX idx_loyalty_history_type ON loyalty_points_history(transaction_type);
CREATE INDEX idx_loyalty_history_created ON loyalty_points_history(created_at);
CREATE INDEX idx_loyalty_history_expires ON loyalty_points_history(expires_at);
```

### Points Calculation Logic

```typescript
// Points Earning Example
interface PointsEarning {
  transactionAmount: number; // IDR
  membershipTier: string;
  
  calculatePoints(): number {
    // Base rate: 1 point per 10,000 IDR
    const baseRate = 0.0001;
    
    // Get tier multiplier
    const multipliers = {
      BRONZE: 1.0,
      SILVER: 1.2,
      GOLD: 1.5,
      PLATINUM: 2.0,
      TITANIUM: 3.0
    };
    
    const multiplier = multipliers[this.membershipTier] || 1.0;
    const points = Math.floor(this.transactionAmount * baseRate * multiplier);
    
    return points;
  }
}

// Example:
// Purchase: Rp 500,000
// Bronze: 500,000 * 0.0001 * 1.0 = 50 points
// Gold: 500,000 * 0.0001 * 1.5 = 75 points
// Titanium: 500,000 * 0.0001 * 3.0 = 150 points

// Points Redemption Example
interface PointsRedemption {
  pointsToRedeem: number;
  
  calculateDiscount(): number {
    // Redemption rate: 1 point = 1,000 IDR
    const redemptionRate = 1000;
    const discountAmount = this.pointsToRedeem * redemptionRate;
    
    return discountAmount;
  }
}

// Example:
// Redeem: 50 points
// Discount: 50 * 1,000 = Rp 50,000

// Auto Tier Upgrade Logic
async function checkAndUpgradeTier(customerId: string) {
  const customer = await getCustomer(customerId);
  const tiers = await getMembershipTiers();
  
  // Find highest tier customer qualifies for
  let qualifyingTier = null;
  for (const tier of tiers.sort((a, b) => b.tier_level - a.tier_level)) {
    if (customer.lifetime_purchase_value >= tier.min_total_purchase &&
        customer.annual_purchase_value >= tier.min_annual_purchase &&
        customer.total_transactions >= tier.min_transaction_count) {
      qualifyingTier = tier;
      break;
    }
  }
  
  // Upgrade if different from current
  if (qualifyingTier && qualifyingTier.id !== customer.membership_tier_id) {
    await upgradeTier(customerId, qualifyingTier.id);
    await sendUpgradeNotification(customer, qualifyingTier);
  }
}
```

---

## 📦 Product Catalog: Treatment-Based Structure

### Recommended SKU Structure for Skincare Treatments

```sql
-- Product Categories (Treatment-Based)
CREATE TABLE product_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_code VARCHAR(50) UNIQUE NOT NULL,
    category_name VARCHAR(255) NOT NULL,
    parent_category_id UUID REFERENCES product_categories(id),
    category_type VARCHAR(50), -- treatment, product_line, concern
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sample Treatment-Based Categories
INSERT INTO product_categories (category_code, category_name, category_type, display_order) VALUES
    -- Treatment Types
    ('FACIAL', 'Facial Treatments', 'treatment', 1),
    ('BODY', 'Body Treatments', 'treatment', 2),
    ('HAIR', 'Hair & Scalp Treatments', 'treatment', 3),
    ('HANDS_FEET', 'Hands & Feet Care', 'treatment', 4),
    ('WAXING', 'Waxing Services', 'treatment', 5),
    ('MAKEUP', 'Makeup Services', 'treatment', 6),
    
    -- Product Lines (if selling products)
    ('CLEANSERS', 'Cleansers', 'product_line', 10),
    ('TONERS', 'Toners & Essences', 'product_line', 11),
    ('SERUMS', 'Serums & Ampoules', 'product_line', 12),
    ('MOISTURIZERS', 'Moisturizers', 'product_line', 13),
    ('SUNSCREEN', 'Sunscreen & UV Protection', 'product_line', 14),
    ('MASKS', 'Masks & Treatments', 'product_line', 15),
    ('EYE_CARE', 'Eye Care', 'product_line', 16),
    ('LIP_CARE', 'Lip Care', 'product_line', 17),
    
    -- By Concern
    ('ANTI_AGING', 'Anti-Aging', 'concern', 20),
    ('ACNE_TREATMENT', 'Acne Treatment', 'concern', 21),
    ('WHITENING', 'Brightening & Whitening', 'concern', 22),
    ('HYDRATION', 'Hydration & Moisturizing', 'concern', 23),
    ('SENSITIVE_SKIN', 'Sensitive Skin Care', 'concern', 24);

-- Enhanced Products Table for Treatments
ALTER TABLE products ADD COLUMN IF NOT EXISTS
    -- Treatment Specific
    treatment_duration INTEGER, -- Duration in minutes
    treatment_type VARCHAR(50), -- service, product, package
    requires_therapist BOOLEAN DEFAULT false,
    max_daily_bookings INTEGER,
    
    -- Product Specific (if selling retail products)
    brand VARCHAR(255),
    product_line VARCHAR(255),
    size VARCHAR(50), -- "50ml", "100ml", "150ml"
    ingredients TEXT[],
    skin_type_suitable TEXT[], -- ["normal", "oily", "dry", "combination", "sensitive"]
    concerns_addressed TEXT[], -- ["acne", "aging", "pigmentation", "dryness"]
    
    -- Attributes
    is_vegan BOOLEAN DEFAULT false,
    is_cruelty_free BOOLEAN DEFAULT false,
    is_organic BOOLEAN DEFAULT false,
    is_halal BOOLEAN DEFAULT false,
    fragrance_free BOOLEAN DEFAULT false,
    paraben_free BOOLEAN DEFAULT false,
    
    -- Usage
    usage_instructions TEXT,
    warnings TEXT,
    
    -- Barcode
    barcode VARCHAR(100) UNIQUE,
    barcode_type VARCHAR(20), -- EAN13, CODE128, QR
    
    -- Batch Tracking
    requires_batch_tracking BOOLEAN DEFAULT false,
    shelf_life_days INTEGER, -- Unopened shelf life
    pao_months INTEGER; -- Period After Opening in months

-- Sample Treatment Products (SKU Structure)
INSERT INTO products (
    sku, name, category_id, treatment_type, treatment_duration, 
    price, cost, description, is_active
) VALUES
    -- Facial Treatments
    ('FAC-001', 'Basic Facial Treatment', (SELECT id FROM product_categories WHERE category_code = 'FACIAL'), 
     'service', 60, 300000, 150000, 'Deep cleansing, exfoliation, and moisturizing facial', true),
    
    ('FAC-002', 'Acne Treatment Facial', (SELECT id FROM product_categories WHERE category_code = 'FACIAL'),
     'service', 90, 500000, 250000, 'Specialized facial for acne-prone skin with extraction', true),
    
    ('FAC-003', 'Anti-Aging Facial', (SELECT id FROM product_categories WHERE category_code = 'FACIAL'),
     'service', 120, 800000, 400000, 'Premium anti-aging facial with collagen boost', true),
    
    ('FAC-004', 'Brightening Facial', (SELECT id FROM product_categories WHERE category_code = 'FACIAL'),
     'service', 75, 450000, 225000, 'Vitamin C facial for brighter, even skin tone', true),
    
    -- Body Treatments
    ('BOD-001', 'Full Body Scrub', (SELECT id FROM product_categories WHERE category_code = 'BODY'),
     'service', 60, 400000, 200000, 'Exfoliating body scrub with moisturizing', true),
    
    ('BOD-002', 'Body Massage & Mask', (SELECT id FROM product_categories WHERE category_code = 'BODY'),
     'service', 90, 600000, 300000, 'Relaxing massage with nourishing body mask', true),
    
    -- Hair Treatments
    ('HAIR-001', 'Hair Spa Treatment', (SELECT id FROM product_categories WHERE category_code = 'HAIR'),
     'service', 60, 350000, 175000, 'Deep conditioning hair spa with scalp massage', true),
    
    ('HAIR-002', 'Hair Loss Treatment', (SELECT id FROM product_categories WHERE category_code = 'HAIR'),
     'service', 45, 400000, 200000, 'Specialized treatment for hair fall and thinning', true),
    
    -- Packages
    ('PKG-001', 'Bridal Package', (SELECT id FROM product_categories WHERE category_code = 'FACIAL'),
     'package', 180, 2500000, 1250000, 'Complete bridal treatment package: facial, body, hair', true),
    
    ('PKG-002', 'Monthly Membership', (SELECT id FROM product_categories WHERE category_code = 'FACIAL'),
     'package', 0, 1500000, 750000, '4 basic facials per month + 10% discount on products', true);

-- Sample Retail Products (if selling skincare products)
INSERT INTO products (
    sku, name, category_id, treatment_type, brand, size, price, cost, 
    barcode, requires_batch_tracking, shelf_life_days, pao_months, description, is_active
) VALUES
    ('PROD-CLN-001', 'Gentle Foaming Cleanser', (SELECT id FROM product_categories WHERE category_code = 'CLEANSERS'),
     'product', 'Brand A', '150ml', 250000, 125000, '8992771234567', true, 730, 12,
     'Gentle daily cleanser for all skin types', true),
    
    ('PROD-SRM-001', 'Vitamin C Serum', (SELECT id FROM product_categories WHERE category_code = 'SERUMS'),
     'product', 'Brand A', '30ml', 450000, 225000, '8992771234574', true, 365, 6,
     'Brightening serum with 20% Vitamin C', true),
    
    ('PROD-MST-001', 'Hydrating Moisturizer', (SELECT id FROM product_categories WHERE category_code = 'MOISTURIZERS'),
     'product', 'Brand B', '50ml', 350000, 175000, '8992771234581', true, 730, 12,
     'Lightweight moisturizer for daily use', true),
    
    ('PROD-SUN-001', 'Sunscreen SPF 50+', (SELECT id FROM product_categories WHERE category_code = 'SUNSCREEN'),
     'product', 'Brand B', '50ml', 280000, 140000, '8992771234598', true, 730, 12,
     'Broad spectrum sun protection', true);
```

### SKU Naming Convention

```
Format: [TYPE]-[CATEGORY]-[NUMBER]

Types:
- FAC: Facial Treatment
- BOD: Body Treatment
- HAIR: Hair Treatment
- WAX: Waxing Service
- MKP: Makeup Service
- PKG: Package/Membership
- PROD: Retail Product

Categories (for products):
- CLN: Cleanser
- TNR: Toner
- SRM: Serum
- MST: Moisturizer
- SUN: Sunscreen
- MSK: Mask
- EYE: Eye Care
- LIP: Lip Care

Examples:
- FAC-001: Basic Facial Treatment
- FAC-002: Acne Facial Treatment
- PROD-CLN-001: Cleanser Product
- PROD-SRM-001: Serum Product
- PKG-001: Treatment Package
```

---

## 🔄 Complete Database Migration File

Let me create the complete migration with all the new tables:

<function_calls>
<invoke name="create_file">
<parameter name="content">-- =====================================================
-- Ocean ERP: POS & Loyalty System for Skincare Retail
-- Migration: 008_create_pos_and_loyalty_system
-- Date: 2025-11-12
-- =====================================================

-- =====================================================
-- 1. TAX CONFIGURATION
-- =====================================================

CREATE TABLE tax_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tax_name VARCHAR(100) NOT NULL,
    tax_type VARCHAR(50) NOT NULL,
    tax_rate DECIMAL(5,2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    effective_from DATE NOT NULL,
    effective_until DATE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert Indonesian PPN tax
INSERT INTO tax_configurations (tax_name, tax_type, tax_rate, effective_from, description)
VALUES ('PPN', 'vat', 11.00, '2022-04-01', 'Pajak Pertambahan Nilai (Value Added Tax) - Indonesia');

-- =====================================================
-- 2. LOYALTY PROGRAM
-- =====================================================

-- Membership Tiers
CREATE TABLE membership_tiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tier_code VARCHAR(20) UNIQUE NOT NULL,
    tier_name VARCHAR(50) NOT NULL,
    tier_level INTEGER NOT NULL,
    tier_color VARCHAR(20),
    
    -- Upgrade Criteria
    min_total_purchase DECIMAL(15,2) DEFAULT 0,
    min_annual_purchase DECIMAL(15,2) DEFAULT 0,
    min_transaction_count INTEGER DEFAULT 0,
    min_points_earned INTEGER DEFAULT 0,
    
    -- Benefits
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    points_multiplier DECIMAL(5,2) DEFAULT 1.0,
    birthday_bonus_points INTEGER DEFAULT 0,
    free_shipping BOOLEAN DEFAULT false,
    priority_support BOOLEAN DEFAULT false,
    exclusive_products BOOLEAN DEFAULT false,
    early_access_sales BOOLEAN DEFAULT false,
    
    benefits JSONB DEFAULT '{}',
    
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default tiers
INSERT INTO membership_tiers (tier_code, tier_name, tier_level, tier_color, min_total_purchase, points_multiplier, discount_percentage, display_order) VALUES
    ('BRONZE', 'Bronze Member', 1, '#CD7F32', 0, 1.0, 0, 1),
    ('SILVER', 'Silver Member', 2, '#C0C0C0', 5000000, 1.2, 5, 2),
    ('GOLD', 'Gold Member', 3, '#FFD700', 15000000, 1.5, 10, 3),
    ('PLATINUM', 'Platinum Member', 4, '#E5E4E2', 50000000, 2.0, 15, 4),
    ('TITANIUM', 'Titanium Member', 5, '#878681', 100000000, 3.0, 20, 5);

-- Loyalty Points Configuration
CREATE TABLE loyalty_points_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_name VARCHAR(100) NOT NULL,
    config_type VARCHAR(50) NOT NULL,
    
    -- Earning Points
    points_per_idr DECIMAL(10,6),
    min_purchase_for_points DECIMAL(15,2),
    
    -- Redemption
    idr_per_point DECIMAL(10,2),
    min_points_for_redemption INTEGER,
    max_points_per_transaction INTEGER,
    max_redemption_percentage DECIMAL(5,2),
    
    -- Expiry
    points_expiry_days INTEGER,
    expiry_notification_days INTEGER,
    
    is_active BOOLEAN DEFAULT true,
    effective_from DATE NOT NULL,
    effective_until DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default points configuration
INSERT INTO loyalty_points_config (
    config_name, config_type,
    points_per_idr, min_purchase_for_points,
    idr_per_point, min_points_for_redemption,
    max_redemption_percentage, points_expiry_days,
    effective_from
) VALUES (
    'Default Points System', 'standard',
    0.0001, 50000,
    1000, 100,
    50, 365,
    CURRENT_DATE
);

-- Loyalty Points History
CREATE TABLE loyalty_points_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id),
    transaction_type VARCHAR(50) NOT NULL,
    points INTEGER NOT NULL,
    balance_before INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    reference_type VARCHAR(50),
    reference_id UUID,
    sales_order_id UUID REFERENCES sales_orders(id),
    description TEXT,
    notes TEXT,
    expires_at DATE,
    created_by UUID REFERENCES users(id),
    outlet_id UUID REFERENCES warehouses(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_loyalty_history_customer ON loyalty_points_history(customer_id);
CREATE INDEX idx_loyalty_history_type ON loyalty_points_history(transaction_type);
CREATE INDEX idx_loyalty_history_created ON loyalty_points_history(created_at);
CREATE INDEX idx_loyalty_history_expires ON loyalty_points_history(expires_at);

-- =====================================================
-- 3. ENHANCED CUSTOMERS TABLE
-- =====================================================

ALTER TABLE customers ADD COLUMN IF NOT EXISTS
    membership_number VARCHAR(50) UNIQUE,
    membership_tier_id UUID REFERENCES membership_tiers(id),
    membership_status VARCHAR(20) DEFAULT 'active',
    membership_enrolled_date DATE,
    tier_upgrade_date DATE,
    loyalty_points INTEGER DEFAULT 0,
    points_earned_lifetime INTEGER DEFAULT 0,
    points_redeemed_lifetime INTEGER DEFAULT 0,
    points_expired_lifetime INTEGER DEFAULT 0,
    lifetime_purchase_value DECIMAL(15,2) DEFAULT 0,
    annual_purchase_value DECIMAL(15,2) DEFAULT 0,
    last_12_months_purchase DECIMAL(15,2) DEFAULT 0,
    total_transactions INTEGER DEFAULT 0,
    last_purchase_date DATE,
    birth_date DATE,
    gender VARCHAR(20),
    skin_type VARCHAR(50),
    skin_concerns TEXT[],
    allergies TEXT[],
    preferred_outlet_id UUID REFERENCES warehouses(id),
    preferred_brands TEXT[],
    communication_preferences JSONB DEFAULT '{"email": true, "sms": true, "whatsapp": false}',
    referral_code VARCHAR(20) UNIQUE,
    referred_by UUID REFERENCES customers(id);

-- =====================================================
-- 4. ENHANCED PRODUCTS TABLE
-- =====================================================

ALTER TABLE products ADD COLUMN IF NOT EXISTS
    treatment_duration INTEGER,
    treatment_type VARCHAR(50),
    requires_therapist BOOLEAN DEFAULT false,
    max_daily_bookings INTEGER,
    brand VARCHAR(255),
    product_line VARCHAR(255),
    size VARCHAR(50),
    ingredients TEXT[],
    skin_type_suitable TEXT[],
    concerns_addressed TEXT[],
    is_vegan BOOLEAN DEFAULT false,
    is_cruelty_free BOOLEAN DEFAULT false,
    is_organic BOOLEAN DEFAULT false,
    is_halal BOOLEAN DEFAULT false,
    fragrance_free BOOLEAN DEFAULT false,
    paraben_free BOOLEAN DEFAULT false,
    usage_instructions TEXT,
    warnings TEXT,
    barcode VARCHAR(100) UNIQUE,
    barcode_type VARCHAR(20),
    requires_batch_tracking BOOLEAN DEFAULT false,
    shelf_life_days INTEGER,
    pao_months INTEGER,
    is_taxable BOOLEAN DEFAULT true,
    tax_category VARCHAR(50) DEFAULT 'standard';

-- =====================================================
-- 5. ENHANCED WAREHOUSES (OUTLETS)
-- =====================================================

ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS
    outlet_code VARCHAR(50) UNIQUE,
    outlet_type VARCHAR(50),
    mall_name VARCHAR(255),
    floor_level VARCHAR(20),
    store_size_sqft INTEGER,
    operating_hours JSONB,
    store_manager_id UUID REFERENCES users(id),
    phone_number VARCHAR(20),
    email VARCHAR(255),
    monthly_rent DECIMAL(15,2),
    monthly_sales_target DECIMAL(15,2),
    region VARCHAR(100),
    area VARCHAR(100),
    is_franchise BOOLEAN DEFAULT false,
    franchise_owner VARCHAR(255),
    opening_date DATE,
    renovation_date DATE,
    has_consultation_room BOOLEAN DEFAULT false,
    has_treatment_room BOOLEAN DEFAULT false,
    pos_terminal_count INTEGER DEFAULT 1;

-- =====================================================
-- 6. POS TERMINALS
-- =====================================================

CREATE TABLE pos_terminals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    terminal_code VARCHAR(50) UNIQUE NOT NULL,
    terminal_name VARCHAR(255) NOT NULL,
    warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    device_type VARCHAR(50) DEFAULT 'standard',
    status VARCHAR(20) DEFAULT 'active',
    ip_address VARCHAR(45),
    mac_address VARCHAR(17),
    last_online_at TIMESTAMP WITH TIME ZONE,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pos_terminals_warehouse ON pos_terminals(warehouse_id);
CREATE INDEX idx_pos_terminals_status ON pos_terminals(status);

-- =====================================================
-- 7. POS SESSIONS
-- =====================================================

CREATE TABLE pos_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_number VARCHAR(50) UNIQUE NOT NULL,
    terminal_id UUID NOT NULL REFERENCES pos_terminals(id),
    user_id UUID NOT NULL REFERENCES users(id),
    warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    
    -- Cash Management
    opening_cash DECIMAL(15,2) NOT NULL DEFAULT 0,
    closing_cash DECIMAL(15,2),
    expected_cash DECIMAL(15,2),
    cash_difference DECIMAL(15,2),
    
    -- Session Totals
    total_sales DECIMAL(15,2) DEFAULT 0,
    total_transactions INTEGER DEFAULT 0,
    total_refunds DECIMAL(15,2) DEFAULT 0,
    total_discounts DECIMAL(15,2) DEFAULT 0,
    
    -- Payment Method Breakdown
    cash_sales DECIMAL(15,2) DEFAULT 0,
    card_sales DECIMAL(15,2) DEFAULT 0,
    qris_sales DECIMAL(15,2) DEFAULT 0,
    ewallet_sales DECIMAL(15,2) DEFAULT 0,
    other_sales DECIMAL(15,2) DEFAULT 0,
    
    status VARCHAR(20) DEFAULT 'open',
    opened_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pos_sessions_terminal ON pos_sessions(terminal_id);
CREATE INDEX idx_pos_sessions_user ON pos_sessions(user_id);
CREATE INDEX idx_pos_sessions_status ON pos_sessions(status);
CREATE INDEX idx_pos_sessions_opened_at ON pos_sessions(opened_at);

-- =====================================================
-- 8. POS TRANSACTIONS
-- =====================================================

CREATE TABLE pos_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_number VARCHAR(50) UNIQUE NOT NULL,
    
    -- Links to core ERP tables
    sales_order_id UUID NOT NULL REFERENCES sales_orders(id),
    invoice_id UUID NOT NULL REFERENCES invoices(id),
    customer_id UUID REFERENCES customers(id),
    
    -- POS Context
    pos_session_id UUID NOT NULL REFERENCES pos_sessions(id),
    terminal_id UUID NOT NULL REFERENCES pos_terminals(id),
    warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    cashier_id UUID NOT NULL REFERENCES users(id),
    
    -- Transaction Details
    transaction_type VARCHAR(20) NOT NULL,
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Amounts
    subtotal DECIMAL(15,2) NOT NULL,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    loyalty_points_redeemed INTEGER DEFAULT 0,
    loyalty_discount_amount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) NOT NULL,
    
    -- Payment Details
    payment_method VARCHAR(50) NOT NULL,
    tender_amount DECIMAL(15,2),
    change_amount DECIMAL(15,2),
    
    -- Payment Gateway Integration
    payment_gateway VARCHAR(50), -- midtrans, xendit
    payment_gateway_transaction_id VARCHAR(255),
    payment_gateway_status VARCHAR(50),
    
    -- Additional Data
    customer_display_name VARCHAR(255),
    items_count INTEGER DEFAULT 0,
    receipt_number VARCHAR(50),
    receipt_printed BOOLEAN DEFAULT false,
    receipt_emailed BOOLEAN DEFAULT false,
    
    -- Loyalty
    loyalty_points_earned INTEGER DEFAULT 0,
    
    status VARCHAR(20) DEFAULT 'completed',
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pos_transactions_session ON pos_transactions(pos_session_id);
CREATE INDEX idx_pos_transactions_terminal ON pos_transactions(terminal_id);
CREATE INDEX idx_pos_transactions_customer ON pos_transactions(customer_id);
CREATE INDEX idx_pos_transactions_cashier ON pos_transactions(cashier_id);
CREATE INDEX idx_pos_transactions_date ON pos_transactions(transaction_date);
CREATE INDEX idx_pos_transactions_status ON pos_transactions(status);
CREATE INDEX idx_pos_transactions_type ON pos_transactions(transaction_type);

-- =====================================================
-- 9. POS PAYMENTS (Split Payments)
-- =====================================================

CREATE TABLE pos_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pos_transaction_id UUID NOT NULL REFERENCES pos_transactions(id) ON DELETE CASCADE,
    payment_id UUID REFERENCES payments(id),
    
    payment_method VARCHAR(50) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    
    -- Card/Digital Payment Details
    card_type VARCHAR(50),
    card_last_four VARCHAR(4),
    card_holder_name VARCHAR(255),
    authorization_code VARCHAR(100),
    transaction_id VARCHAR(100),
    
    -- E-Wallet Details
    ewallet_provider VARCHAR(50), -- gopay, shopeepay, ovo, dana
    ewallet_phone VARCHAR(20),
    
    -- QRIS Details
    qris_issuer VARCHAR(50),
    qris_transaction_id VARCHAR(100),
    
    -- Cash Payment Details
    tender_amount DECIMAL(15,2),
    change_amount DECIMAL(15,2),
    
    status VARCHAR(20) DEFAULT 'approved',
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pos_payments_transaction ON pos_payments(pos_transaction_id);
CREATE INDEX idx_pos_payments_method ON pos_payments(payment_method);

-- =====================================================
-- 10. POS RECEIPTS
-- =====================================================

CREATE TABLE pos_receipts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    receipt_number VARCHAR(50) UNIQUE NOT NULL,
    pos_transaction_id UUID NOT NULL REFERENCES pos_transactions(id),
    
    receipt_type VARCHAR(20) NOT NULL,
    
    -- Delivery Methods
    printed BOOLEAN DEFAULT false,
    printed_at TIMESTAMP WITH TIME ZONE,
    emailed BOOLEAN DEFAULT false,
    emailed_to VARCHAR(255),
    emailed_at TIMESTAMP WITH TIME ZONE,
    sms_sent BOOLEAN DEFAULT false,
    sms_to VARCHAR(20),
    sms_sent_at TIMESTAMP WITH TIME ZONE,
    
    -- Receipt Data
    receipt_data JSONB NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pos_receipts_transaction ON pos_receipts(pos_transaction_id);
CREATE INDEX idx_pos_receipts_number ON pos_receipts(receipt_number);

-- =====================================================
-- 11. POS CASH MOVEMENTS
-- =====================================================

CREATE TABLE pos_cash_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pos_session_id UUID NOT NULL REFERENCES pos_sessions(id),
    
    movement_type VARCHAR(20) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    reason VARCHAR(255) NOT NULL,
    description TEXT,
    
    performed_by UUID NOT NULL REFERENCES users(id),
    authorized_by UUID REFERENCES users(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pos_cash_movements_session ON pos_cash_movements(pos_session_id);
CREATE INDEX idx_pos_cash_movements_type ON pos_cash_movements(movement_type);

-- =====================================================
-- 12. BATCH/LOT TRACKING
-- =====================================================

CREATE TABLE product_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id),
    batch_number VARCHAR(100) NOT NULL,
    lot_number VARCHAR(100),
    
    -- Manufacturing
    manufacture_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    
    -- Supplier
    supplier_id UUID REFERENCES suppliers(id),
    purchase_order_id UUID REFERENCES purchase_orders(id),
    
    -- Tracking
    quantity_received INTEGER NOT NULL,
    quantity_remaining INTEGER NOT NULL,
    quantity_sold INTEGER DEFAULT 0,
    quantity_expired INTEGER DEFAULT 0,
    
    status VARCHAR(20) DEFAULT 'active',
    recall_status VARCHAR(20),
    recall_date DATE,
    recall_reason TEXT,
    
    -- Storage
    warehouse_id UUID REFERENCES warehouses(id),
    storage_location VARCHAR(100),
    storage_conditions TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(batch_number, product_id)
);

CREATE INDEX idx_product_batches_product ON product_batches(product_id);
CREATE INDEX idx_product_batches_expiry ON product_batches(expiry_date);
CREATE INDEX idx_product_batches_status ON product_batches(status);

-- =====================================================
-- 13. OUTLET PERFORMANCE TRACKING
-- =====================================================

CREATE TABLE outlet_daily_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    outlet_id UUID NOT NULL REFERENCES warehouses(id),
    stat_date DATE NOT NULL,
    
    -- Sales Metrics
    total_sales DECIMAL(15,2) DEFAULT 0,
    transaction_count INTEGER DEFAULT 0,
    customer_count INTEGER DEFAULT 0,
    average_transaction_value DECIMAL(15,2),
    
    -- Customer Metrics
    new_customers INTEGER DEFAULT 0,
    returning_customers INTEGER DEFAULT 0,
    members_count INTEGER DEFAULT 0,
    
    -- Product Metrics
    top_selling_product_id UUID REFERENCES products(id),
    units_sold INTEGER DEFAULT 0,
    
    -- Staff Metrics
    staff_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(outlet_id, stat_date)
);

CREATE INDEX idx_outlet_stats_date ON outlet_daily_stats(stat_date);
CREATE INDEX idx_outlet_stats_outlet ON outlet_daily_stats(outlet_id);

-- =====================================================
-- 14. PROMOTIONS
-- =====================================================

CREATE TABLE promotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    promotion_code VARCHAR(50) UNIQUE NOT NULL,
    promotion_name VARCHAR(255) NOT NULL,
    promotion_type VARCHAR(50) NOT NULL,
    
    -- Timing
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    
    -- Conditions
    min_purchase_amount DECIMAL(15,2),
    applicable_products UUID[],
    applicable_categories UUID[],
    applicable_brands VARCHAR(100)[],
    member_only BOOLEAN DEFAULT false,
    membership_tiers VARCHAR(50)[],
    applicable_outlets UUID[],
    
    -- Discount Rules
    discount_type VARCHAR(20),
    discount_value DECIMAL(15,2),
    max_discount_amount DECIMAL(15,2),
    
    -- BOGO
    buy_quantity INTEGER,
    get_quantity INTEGER,
    get_product_id UUID REFERENCES products(id),
    
    -- GWP
    gwp_products UUID[],
    gwp_threshold DECIMAL(15,2),
    
    -- Usage Limits
    usage_limit_per_customer INTEGER,
    total_usage_limit INTEGER,
    current_usage_count INTEGER DEFAULT 0,
    
    status VARCHAR(20) DEFAULT 'active',
    priority INTEGER DEFAULT 0,
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_promotions_dates ON promotions(start_date, end_date);
CREATE INDEX idx_promotions_status ON promotions(status);

CREATE TABLE promotion_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    promotion_id UUID NOT NULL REFERENCES promotions(id),
    customer_id UUID REFERENCES customers(id),
    sales_order_id UUID NOT NULL REFERENCES sales_orders(id),
    discount_amount DECIMAL(15,2) NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_promotion_usage_customer ON promotion_usage(customer_id);
CREATE INDEX idx_promotion_usage_promotion ON promotion_usage(promotion_id);

-- =====================================================
-- 15. VIEWS
-- =====================================================

-- POS Session Summary View
CREATE OR REPLACE VIEW pos_session_summary AS
SELECT 
    s.id,
    s.session_number,
    s.terminal_id,
    t.terminal_name,
    s.user_id,
    u.name as cashier_name,
    s.warehouse_id,
    w.name as warehouse_name,
    s.opening_cash,
    s.closing_cash,
    s.expected_cash,
    s.cash_difference,
    s.total_sales,
    s.total_transactions,
    s.total_refunds,
    s.total_discounts,
    s.cash_sales,
    s.card_sales,
    s.qris_sales,
    s.ewallet_sales,
    s.other_sales,
    s.status,
    s.opened_at,
    s.closed_at,
    EXTRACT(EPOCH FROM (COALESCE(s.closed_at, NOW()) - s.opened_at))/3600 as hours_open
FROM pos_sessions s
JOIN pos_terminals t ON s.terminal_id = t.id
JOIN users u ON s.user_id = u.id
JOIN warehouses w ON s.warehouse_id = w.id;

-- POS Sales Summary View
CREATE OR REPLACE VIEW pos_sales_summary AS
SELECT 
    DATE(pt.transaction_date) as sale_date,
    pt.warehouse_id,
    w.name as warehouse_name,
    pt.terminal_id,
    t.terminal_name,
    COUNT(DISTINCT pt.id) as total_transactions,
    SUM(pt.items_count) as total_items_sold,
    SUM(pt.subtotal) as total_subtotal,
    SUM(pt.tax_amount) as total_tax,
    SUM(pt.discount_amount) as total_discounts,
    SUM(pt.loyalty_discount_amount) as total_loyalty_discounts,
    SUM(pt.total_amount) as total_sales,
    SUM(CASE WHEN pt.payment_method = 'cash' THEN pt.total_amount ELSE 0 END) as cash_sales,
    SUM(CASE WHEN pt.payment_method IN ('card', 'card_terminal') THEN pt.total_amount ELSE 0 END) as card_sales,
    SUM(CASE WHEN pt.payment_method = 'qris' THEN pt.total_amount ELSE 0 END) as qris_sales,
    SUM(CASE WHEN pt.payment_method = 'ewallet' THEN pt.total_amount ELSE 0 END) as ewallet_sales,
    AVG(pt.total_amount) as average_transaction_value,
    SUM(pt.loyalty_points_earned) as total_points_earned,
    SUM(pt.loyalty_points_redeemed) as total_points_redeemed
FROM pos_transactions pt
JOIN pos_terminals t ON pt.terminal_id = t.id
JOIN warehouses w ON pt.warehouse_id = w.id
WHERE pt.status = 'completed'
GROUP BY DATE(pt.transaction_date), pt.warehouse_id, w.name, pt.terminal_id, t.terminal_name;

-- Customer Loyalty Summary View
CREATE OR REPLACE VIEW customer_loyalty_summary AS
SELECT 
    c.id,
    c.membership_number,
    c.name,
    c.email,
    c.phone,
    mt.tier_name,
    mt.tier_level,
    mt.tier_color,
    c.loyalty_points,
    c.points_earned_lifetime,
    c.points_redeemed_lifetime,
    c.lifetime_purchase_value,
    c.annual_purchase_value,
    c.total_transactions,
    c.last_purchase_date,
    c.membership_enrolled_date,
    EXTRACT(DAYS FROM (CURRENT_DATE - c.membership_enrolled_date)) as days_as_member,
    CASE 
        WHEN c.total_transactions = 0 THEN 0
        ELSE c.lifetime_purchase_value / c.total_transactions 
    END as average_transaction_value
FROM customers c
LEFT JOIN membership_tiers mt ON c.membership_tier_id = mt.id;

-- =====================================================
-- 16. TRIGGERS
-- =====================================================

-- Update customer tier automatically
CREATE OR REPLACE FUNCTION update_customer_tier()
RETURNS TRIGGER AS $$
DECLARE
    qualifying_tier_id UUID;
BEGIN
    -- Find the highest tier the customer qualifies for
    SELECT id INTO qualifying_tier_id
    FROM membership_tiers
    WHERE 
        NEW.lifetime_purchase_value >= COALESCE(min_total_purchase, 0) AND
        NEW.annual_purchase_value >= COALESCE(min_annual_purchase, 0) AND
        NEW.total_transactions >= COALESCE(min_transaction_count, 0) AND
        is_active = true
    ORDER BY tier_level DESC
    LIMIT 1;
    
    -- Update tier if different from current
    IF qualifying_tier_id IS NOT NULL AND qualifying_tier_id != COALESCE(NEW.membership_tier_id, uuid_nil()) THEN
        NEW.membership_tier_id := qualifying_tier_id;
        NEW.tier_upgrade_date := CURRENT_DATE;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_customer_tier
    BEFORE UPDATE OF lifetime_purchase_value, annual_purchase_value, total_transactions
    ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_customer_tier();

-- =====================================================
-- 17. SAMPLE DATA
-- =====================================================

-- Sample Outlets (5 for pilot testing)
INSERT INTO warehouses (
    name, code, outlet_code, type, address, city, state, country, postal_code,
    outlet_type, region, status, is_franchise, pos_terminal_count
) VALUES
    ('Skincare Center Jakarta - Grand Indonesia', 'OUT-JKT-GI', 'JKT-GI-001', 'Outlet', 
     'Grand Indonesia Mall, Lantai 3', 'Jakarta Pusat', 'DKI Jakarta', 'Indonesia', '10310',
     'mall', 'Jakarta', 'Active', false, 3),
    
    ('Skincare Center Surabaya - Pakuwon Mall', 'OUT-SBY-PKW', 'SBY-PKW-001', 'Outlet',
     'Pakuwon Mall, Lantai 2', 'Surabaya', 'Jawa Timur', 'Indonesia', '60236',
     'mall', 'Surabaya', 'Active', false, 2),
    
    ('Skincare Center Bandung - Paris Van Java', 'OUT-BDG-PVJ', 'BDG-PVJ-001', 'Outlet',
     'Paris Van Java Mall, Lantai 1', 'Bandung', 'Jawa Barat', 'Indonesia', '40164',
     'mall', 'Bandung', 'Active', false, 2),
    
    ('Skincare Center Medan - Sun Plaza', 'OUT-MDN-SP', 'MDN-SP-001', 'Outlet',
     'Sun Plaza, Lantai 2', 'Medan', 'Sumatera Utara', 'Indonesia', '20111',
     'mall', 'Medan', 'Active', false, 2),
    
    ('Skincare Center Bali - Beachwalk', 'OUT-DPS-BW', 'DPS-BW-001', 'Outlet',
     'Beachwalk Shopping Center, Lantai GF', 'Kuta', 'Bali', 'Indonesia', '80361',
     'mall', 'Bali', 'Active', false, 2);

-- Sample POS Terminals
INSERT INTO pos_terminals (terminal_code, terminal_name, warehouse_id, device_type, status)
SELECT 
    w.outlet_code || '-T' || gs.n,
    w.name || ' - Terminal ' || gs.n,
    w.id,
    'standard',
    'active'
FROM warehouses w
CROSS JOIN generate_series(1, w.pos_terminal_count) as gs(n)
WHERE w.outlet_code IS NOT NULL;

-- Sample Treatment-Based Categories
INSERT INTO product_categories (category_code, category_name, parent_id, display_order, is_active) VALUES
    ('FACIAL', 'Facial Treatments', NULL, 1, true),
    ('BODY', 'Body Treatments', NULL, 2, true),
    ('HAIR', 'Hair & Scalp Treatments', NULL, 3, true),
    ('WAXING', 'Waxing Services', NULL, 4, true),
    ('PACKAGES', 'Treatment Packages', NULL, 5, true);

-- Sample Products (Treatments & Products)
-- Will be populated based on your actual catalog

-- =====================================================
-- END OF MIGRATION
-- =====================================================
