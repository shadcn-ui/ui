/**
 * Analytics & Data Sync Service
 * Syncs sales data to data warehouse and pulls performance metrics from platforms
 * 
 * Features:
 * - Sales data aggregation
 * - Performance metrics from platforms
 * - Inventory analytics
 * - Revenue tracking
 * - Platform comparison reports
 */

import { createShopeeClient, type ShopeeConfig } from '../integrations/shopee-api-client';
import { createTikTokShopClient, type TikTokShopConfig } from '../integrations/tiktok-shop-api-client';
import { createTokopediaClient, type TokopediaConfig } from '../integrations/tokopedia-api-client';
import { db } from '../db';

export type Platform = 'shopee' | 'tiktok' | 'tokopedia';

export interface PlatformMetrics {
  platform: Platform;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  averageOrderValue: number;
  conversionRate?: number;
}

export class AnalyticsService {
  /**
   * Sync sales data to data warehouse
   */
  static async syncSalesToWarehouse(startDate: Date, endDate: Date): Promise<{ success: boolean }> {
    try {
      // Aggregate sales data from sales_orders
      const salesData = await db.query(
        `SELECT 
          DATE(created_at) as order_date,
          source_platform as platform,
          COUNT(*) as order_count,
          SUM(total_amount) as total_revenue,
          AVG(total_amount) as avg_order_value
         FROM sales_orders
         WHERE created_at BETWEEN $1 AND $2
         GROUP BY DATE(created_at), source_platform`,
        [startDate, endDate]
      );

      // Insert into fact tables
      for (const row of salesData.rows) {
        await db.query(
          `INSERT INTO agg_daily_inventory (
            date, platform, order_count, revenue, avg_order_value, created_at
          ) VALUES ($1, $2, $3, $4, $5, NOW())
          ON CONFLICT (date, platform) DO UPDATE SET
            order_count = $3,
            revenue = $4,
            avg_order_value = $5,
            updated_at = NOW()`,
          [row.order_date, row.platform, row.order_count, row.total_revenue, row.avg_order_value]
        );
      }

      return { success: true };
    } catch (error) {
      console.error('Warehouse sync error:', error);
      return { success: false };
    }
  }

  /**
   * Get platform performance metrics
   */
  static async getPlatformMetrics(
    storefrontId: number,
    platform: Platform,
    credentials: any,
    startDate: Date,
    endDate: Date
  ): Promise<PlatformMetrics | null> {
    try {
      const startStr = startDate.toISOString().split('T')[0];
      const endStr = endDate.toISOString().split('T')[0];

      let totalOrders = 0;
      let totalRevenue = 0;
      let totalProducts = 0;

      switch (platform) {
        case 'shopee': {
          const client = createShopeeClient(credentials as ShopeeConfig);
          // Get shop info for basic stats
          const shopInfo = await client.getShopInfo();
          // Note: Shopee doesn't provide detailed analytics via API
          // Use ERP data instead
          const erpStats = await this.getERPStats(storefrontId, startDate, endDate);
          totalOrders = erpStats.orders;
          totalRevenue = erpStats.revenue;
          totalProducts = erpStats.products;
          break;
        }

        case 'tiktok': {
          const client = createTikTokShopClient(credentials as TikTokShopConfig);
          // Get shop performance
          const performance = await client.getShopPerformance({
            start_date: startStr,
            end_date: endStr,
          });
          
          totalOrders = performance.order_count || 0;
          totalRevenue = parseFloat(performance.total_gmv || '0');
          
          // Get product count
          const products = await client.getProductList({ page_size: 1 });
          totalProducts = products.total;
          break;
        }

        case 'tokopedia': {
          const client = createTokopediaClient(credentials as TokopediaConfig);
          // Tokopedia doesn't have analytics API, use ERP data
          const erpStats = await this.getERPStats(storefrontId, startDate, endDate);
          totalOrders = erpStats.orders;
          totalRevenue = erpStats.revenue;
          totalProducts = erpStats.products;
          break;
        }
      }

      return {
        platform,
        totalOrders,
        totalRevenue,
        totalProducts,
        averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      };
    } catch (error) {
      console.error(`Error fetching ${platform} metrics:`, error);
      return null;
    }
  }

  /**
   * Get ERP stats for a storefront
   */
  private static async getERPStats(
    storefrontId: number,
    startDate: Date,
    endDate: Date
  ): Promise<{ orders: number; revenue: number; products: number }> {
    const orderStats = await db.query(
      `SELECT COUNT(*) as orders, COALESCE(SUM(total_amount), 0) as revenue
       FROM sales_orders so
       JOIN integration_mappings im ON im.internal_id = so.id AND im.entity_type = 'order'
       WHERE im.integration_id LIKE $1 AND so.created_at BETWEEN $2 AND $3`,
      [`%_${storefrontId}`, startDate, endDate]
    );

    const productCount = await db.query(
      `SELECT COUNT(*) as products
       FROM integration_mappings
       WHERE integration_id LIKE $1 AND entity_type = 'product'`,
      [`%_${storefrontId}`]
    );

    return {
      orders: parseInt(orderStats.rows[0]?.orders || '0'),
      revenue: parseFloat(orderStats.rows[0]?.revenue || '0'),
      products: parseInt(productCount.rows[0]?.products || '0'),
    };
  }

  /**
   * Get comparative analytics across all platforms
   */
  static async getComparativeAnalytics(
    startDate: Date,
    endDate: Date
  ): Promise<PlatformMetrics[]> {
    const storefronts = await db.query(
      `SELECT storefront_id, platform_type, api_key, api_secret, api_token, config
       FROM ecommerce_storefronts
       WHERE is_active = true`
    );

    const metrics: PlatformMetrics[] = [];

    for (const storefront of storefronts.rows) {
      const credentials = this.buildCredentials(storefront);
      const platformMetrics = await this.getPlatformMetrics(
        storefront.storefront_id,
        storefront.platform_type,
        credentials,
        startDate,
        endDate
      );

      if (platformMetrics) {
        metrics.push(platformMetrics);
      }
    }

    return metrics;
  }

  /**
   * Generate inventory analytics report
   */
  static async getInventoryAnalytics(): Promise<any> {
    const lowStockProducts = await db.query(
      `SELECT p.id, p.sku, p.name, i.quantity, i.reserved
       FROM products p
       JOIN inventory i ON i.product_id = p.id
       WHERE i.quantity < 10
       ORDER BY i.quantity ASC
       LIMIT 50`
    );

    const outOfStockProducts = await db.query(
      `SELECT p.id, p.sku, p.name
       FROM products p
       JOIN inventory i ON i.product_id = p.id
       WHERE i.quantity = 0
       ORDER BY p.name
       LIMIT 50`
    );

    const totalInventoryValue = await db.query(
      `SELECT SUM(p.price * i.quantity) as total_value
       FROM products p
       JOIN inventory i ON i.product_id = p.id`
    );

    return {
      lowStockProducts: lowStockProducts.rows,
      outOfStockProducts: outOfStockProducts.rows,
      totalInventoryValue: parseFloat(totalInventoryValue.rows[0]?.total_value || '0'),
    };
  }

  /**
   * Generate sales trend report
   */
  static async getSalesTrend(days: number = 30): Promise<any[]> {
    const result = await db.query(
      `SELECT 
        DATE(created_at) as date,
        COUNT(*) as orders,
        SUM(total_amount) as revenue,
        AVG(total_amount) as avg_order_value
       FROM sales_orders
       WHERE created_at >= NOW() - INTERVAL '${days} days'
       GROUP BY DATE(created_at)
       ORDER BY date ASC`
    );

    return result.rows.map(row => ({
      date: row.date,
      orders: parseInt(row.orders),
      revenue: parseFloat(row.revenue),
      avgOrderValue: parseFloat(row.avg_order_value),
    }));
  }

  /**
   * Get top selling products
   */
  static async getTopSellingProducts(limit: number = 20): Promise<any[]> {
    const result = await db.query(
      `SELECT 
        p.id,
        p.sku,
        p.name,
        COUNT(oi.id) as total_orders,
        SUM(oi.quantity) as total_quantity,
        SUM(oi.total_price) as total_revenue
       FROM products p
       JOIN order_items oi ON oi.product_id = p.id
       JOIN sales_orders so ON so.id = oi.order_id
       WHERE so.created_at >= NOW() - INTERVAL '30 days'
       GROUP BY p.id, p.sku, p.name
       ORDER BY total_revenue DESC
       LIMIT $1`,
      [limit]
    );

    return result.rows.map(row => ({
      productId: row.id,
      sku: row.sku,
      name: row.name,
      totalOrders: parseInt(row.total_orders),
      totalQuantity: parseInt(row.total_quantity),
      totalRevenue: parseFloat(row.total_revenue),
    }));
  }

  /**
   * Build credentials from storefront config
   */
  private static buildCredentials(storefront: any): any {
    const config = storefront.config || {};
    
    return {
      // Shopee
      partnerId: storefront.api_key,
      partnerKey: storefront.api_secret,
      shopId: config.shopId,
      region: config.region || 'ID',
      accessToken: storefront.api_token,
      sandbox: config.sandbox || false,

      // TikTok
      appKey: storefront.api_key,
      appSecret: storefront.api_secret,
      warehouseId: config.warehouseId,

      // Tokopedia
      clientId: storefront.api_key,
      clientSecret: storefront.api_secret,
      fsId: config.fsId,
      shopId: config.shopId,
    };
  }
}
