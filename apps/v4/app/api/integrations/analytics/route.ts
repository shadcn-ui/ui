/**
 * Analytics API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/lib/services/analytics-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    const [salesTrend, topProducts, inventoryAnalytics, comparativeAnalytics] = await Promise.all([
      AnalyticsService.getSalesTrend(days),
      AnalyticsService.getTopSellingProducts(20),
      AnalyticsService.getInventoryAnalytics(),
      AnalyticsService.getComparativeAnalytics(
        new Date(Date.now() - days * 24 * 60 * 60 * 1000),
        new Date()
      ),
    ]);

    return NextResponse.json({
      salesTrend,
      topProducts,
      inventoryAnalytics,
      comparativeAnalytics,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
