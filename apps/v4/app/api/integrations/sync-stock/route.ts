/**
 * Stock Sync API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { StockSyncService } from '@/lib/services/fulfillment-stock-chat-services';

export async function POST(request: NextRequest) {
  try {
    const { productId, newStock } = await request.json();

    const result = await StockSyncService.syncStockToAllPlatforms(productId, newStock);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
