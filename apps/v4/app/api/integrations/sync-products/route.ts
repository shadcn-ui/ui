/**
 * Integration Management API Routes
 * Handles product sync, order sync, and status management
 */

import { NextRequest, NextResponse } from 'next/server';
import { ProductSyncService } from '@/lib/services/product-sync-service';
import { OrderSyncService } from '@/lib/services/order-sync-service';
import { FulfillmentService, StockSyncService, ChatService } from '@/lib/services/fulfillment-stock-chat-services';
import { AnalyticsService } from '@/lib/services/analytics-service';
import { db } from '@/lib/db';

// POST /api/integrations/sync-products
export async function POST(request: NextRequest) {
  try {
    const { storefrontId, platform, productIds, direction } = await request.json();

    // Get storefront credentials
    const storefront = await db.query(
      `SELECT * FROM ecommerce_storefronts WHERE storefront_id = $1`,
      [storefrontId]
    );

    if (storefront.rows.length === 0) {
      return NextResponse.json({ error: 'Storefront not found' }, { status: 404 });
    }

    const credentials = buildCredentials(storefront.rows[0]);

    let result;
    if (direction === 'to_platform') {
      result = await ProductSyncService.bulkSyncToPlatform(
        productIds,
        storefrontId,
        platform,
        credentials
      );
    } else {
      result = await ProductSyncService.bulkSyncFromPlatform(
        storefrontId,
        platform,
        credentials
      );
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Helper function to build platform credentials
function buildCredentials(storefront: any) {
  const config = storefront.config || {};
  
  return {
    // Shopee
    partnerId: parseInt(storefront.api_key || '0'),
    partnerKey: storefront.api_secret,
    shopId: parseInt(config.shopId || '0'),
    region: config.region || 'ID',
    accessToken: storefront.api_token,
    refreshToken: config.refreshToken,
    sandbox: config.sandbox || false,
    storefrontId: storefront.storefront_id,

    // TikTok
    appKey: storefront.api_key,
    appSecret: storefront.api_secret,
    warehouseId: config.warehouseId,
    shippingProviderId: config.shippingProviderId,

    // Tokopedia
    clientId: storefront.api_key,
    clientSecret: storefront.api_secret,
    fsId: config.fsId,
    shopId: config.shopId,
  };
}
