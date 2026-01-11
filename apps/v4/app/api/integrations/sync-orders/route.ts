/**
 * Order Sync API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { OrderSyncService } from '@/lib/services/order-sync-service';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { storefrontId, platform, startDate, endDate } = await request.json();

    // Get storefront credentials
    const storefront = await db.query(
      `SELECT * FROM ecommerce_storefronts WHERE storefront_id = $1`,
      [storefrontId]
    );

    if (storefront.rows.length === 0) {
      return NextResponse.json({ error: 'Storefront not found' }, { status: 404 });
    }

    const credentials = buildCredentials(storefront.rows[0]);

    const result = await OrderSyncService.syncOrdersFromPlatform(
      storefrontId,
      platform,
      credentials,
      {
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : undefined,
      }
    );

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function buildCredentials(storefront: any) {
  const config = storefront.config || {};
  
  return {
    partnerId: parseInt(storefront.api_key || '0'),
    partnerKey: storefront.api_secret,
    shopId: parseInt(config.shopId || '0'),
    region: config.region || 'ID',
    accessToken: storefront.api_token,
    refreshToken: config.refreshToken,
    sandbox: config.sandbox || false,
    storefrontId: storefront.storefront_id,
    appKey: storefront.api_key,
    appSecret: storefront.api_secret,
    warehouseId: config.warehouseId,
    shippingProviderId: config.shippingProviderId,
    clientId: storefront.api_key,
    clientSecret: storefront.api_secret,
    fsId: config.fsId,
  };
}
