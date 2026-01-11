/**
 * Unified Fulfillment Automation Service
 * Handles order fulfillment across e-commerce platforms
 * 
 * Features:
 * - Automatic order acceptance
 * - Shipping label generation
 * - Tracking number updates
 * - Multi-platform fulfillment
 * - Warehouse integration
 */

import { createShopeeClient, type ShopeeConfig } from '../integrations/shopee-api-client';
import { createTikTokShopClient, type TikTokShopConfig } from '../integrations/tiktok-shop-api-client';
import { createTokopediaClient, type TokopediaConfig } from '../integrations/tokopedia-api-client';
import { db } from '../db';
import { OrderSyncService } from './order-sync-service';

export type Platform = 'shopee' | 'tiktok' | 'tokopedia';

export class FulfillmentService {
  /**
   * Accept order (confirm order acceptance)
   */
  static async acceptOrder(
    erpOrderId: number,
    storefrontId: number,
    platform: Platform,
    credentials: any
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const mapping = await this.getOrderMapping(erpOrderId, storefrontId, platform);
      if (!mapping) throw new Error('Order not synced');

      switch (platform) {
        case 'tokopedia': {
          const client = createTokopediaClient(credentials);
          await client.acceptOrder(mapping.external_id);
          break;
        }
        case 'shopee':
        case 'tiktok':
          // Auto-accepted
          break;
      }

      await db.query(
        `UPDATE sales_orders SET status = 'CONFIRMED', updated_at = NOW() WHERE id = $1`,
        [erpOrderId]
      );

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Ship order with tracking number
   */
  static async shipOrder(
    erpOrderId: number,
    storefrontId: number,
    platform: Platform,
    credentials: any,
    trackingNumber: string,
    carrier?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const mapping = await this.getOrderMapping(erpOrderId, storefrontId, platform);
      if (!mapping) throw new Error('Order not synced');

      switch (platform) {
        case 'shopee': {
          const client = createShopeeClient(credentials);
          await client.shipOrder(mapping.external_id);
          break;
        }
        case 'tiktok': {
          const client = createTikTokShopClient(credentials);
          await client.shipOrder(mapping.external_id, {
            tracking_number: trackingNumber,
            shipping_provider_id: credentials.shippingProviderId || '0',
          });
          break;
        }
        case 'tokopedia': {
          const client = createTokopediaClient(credentials);
          await client.confirmShipping(mapping.external_id, trackingNumber);
          break;
        }
      }

      // Update ERP
      await db.query(
        `UPDATE sales_orders 
         SET status = 'SHIPPED', tracking_number = $1, shipping_status = 'shipped', updated_at = NOW()
         WHERE id = $2`,
        [trackingNumber, erpOrderId]
      );

      // Log to shipping_orders
      await db.query(
        `INSERT INTO shipping_orders (order_id, tracking_number, carrier, status, created_at)
         VALUES ($1, $2, $3, 'shipped', NOW())
         ON CONFLICT (order_id) DO UPDATE SET tracking_number = $2, status = 'shipped', updated_at = NOW()`,
        [erpOrderId, trackingNumber, carrier]
      );

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get shipping label
   */
  static async getShippingLabel(
    erpOrderId: number,
    storefrontId: number,
    platform: Platform,
    credentials: any
  ): Promise<{ success: boolean; labelUrl?: string; error?: string }> {
    try {
      const mapping = await this.getOrderMapping(erpOrderId, storefrontId, platform);
      if (!mapping) throw new Error('Order not synced');

      let labelUrl: string | undefined;

      if (platform === 'tiktok') {
        const client = createTikTokShopClient(credentials);
        const result = await client.getShippingDocument([mapping.external_id], 'SHIPPING_LABEL');
        labelUrl = result.documents[0]?.document_url;
      }

      return { success: true, labelUrl };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Bulk fulfill orders
   */
  static async bulkFulfillOrders(
    orderIds: number[],
    storefrontId: number,
    platform: Platform,
    credentials: any
  ): Promise<{ success: boolean; fulfilled: number; errors: number }> {
    let fulfilled = 0;
    let errors = 0;

    for (const orderId of orderIds) {
      const result = await this.acceptOrder(orderId, storefrontId, platform, credentials);
      if (result.success) fulfilled++;
      else errors++;
    }

    return { success: errors === 0, fulfilled, errors };
  }

  private static async getOrderMapping(erpOrderId: number, storefrontId: number, platform: Platform) {
    const result = await db.query(
      `SELECT * FROM integration_mappings
       WHERE integration_id = $1 AND entity_type = 'order' AND internal_id = $2`,
      [`${platform}_${storefrontId}`, erpOrderId]
    );
    return result.rows[0] || null;
  }
}

/**
 * Real-Time Stock Synchronization Service
 * Syncs inventory across all platforms
 */
export class StockSyncService {
  /**
   * Sync stock to all connected platforms
   */
  static async syncStockToAllPlatforms(
    productId: number,
    newStock: number
  ): Promise<{ success: boolean; synced: number; errors: any[] }> {
    let synced = 0;
    const errors: any[] = [];

    try {
      // Get all platform mappings for this product
      const mappings = await db.query(
        `SELECT * FROM integration_mappings WHERE entity_type = 'product' AND internal_id = $1`,
        [productId]
      );

      for (const mapping of mappings.rows) {
        const [platform, storefrontId] = mapping.integration_id.split('_');
        
        // Get storefront credentials
        const storefront = await db.query(
          `SELECT * FROM ecommerce_storefronts WHERE storefront_id = $1`,
          [storefrontId]
        );

        if (storefront.rows.length === 0) continue;

        const credentials = this.getCredentials(storefront.rows[0]);

        try {
          await this.updatePlatformStock(platform, mapping.external_id, newStock, credentials);
          synced++;
        } catch (error: any) {
          errors.push({ platform, error: error.message });
        }
      }

      // Update ERP inventory
      await db.query(
        `UPDATE inventory SET quantity = $1, updated_at = NOW() WHERE product_id = $2`,
        [newStock, productId]
      );

      return { success: errors.length === 0, synced, errors };
    } catch (error: any) {
      return { success: false, synced, errors: [{ error: error.message }] };
    }
  }

  /**
   * Reserve stock for order
   */
  static async reserveStock(productId: number, quantity: number): Promise<boolean> {
    const result = await db.query(
      `UPDATE inventory 
       SET quantity = quantity - $1, reserved = reserved + $1 
       WHERE product_id = $2 AND quantity >= $1`,
      [quantity, productId]
    );
    return result.rowCount > 0;
  }

  /**
   * Release reserved stock (on cancellation)
   */
  static async releaseStock(productId: number, quantity: number): Promise<boolean> {
    const result = await db.query(
      `UPDATE inventory 
       SET quantity = quantity + $1, reserved = reserved - $1 
       WHERE product_id = $2`,
      [quantity, productId]
    );
    return result.rowCount > 0;
  }

  private static async updatePlatformStock(
    platform: string,
    externalId: string,
    stock: number,
    credentials: any
  ): Promise<void> {
    switch (platform) {
      case 'shopee': {
        const client = createShopeeClient(credentials);
        await client.updateStock(parseInt(externalId), [{ normal_stock: stock }]);
        break;
      }
      case 'tiktok': {
        const client = createTikTokShopClient(credentials);
        const product = await client.getProductDetail(externalId);
        if (product.skus[0]) {
          await client.updateStock(product.skus[0].id, credentials.warehouseId, stock);
        }
        break;
      }
      case 'tokopedia': {
        const client = createTokopediaClient(credentials);
        await client.updateStock(externalId, stock);
        break;
      }
    }
  }

  private static getCredentials(storefront: any): any {
    return {
      partnerId: storefront.api_key,
      partnerKey: storefront.api_secret,
      shopId: storefront.config?.shopId,
      region: storefront.config?.region || 'ID',
      accessToken: storefront.api_token,
      warehouseId: storefront.config?.warehouseId,
      shippingProviderId: storefront.config?.shippingProviderId,
      clientId: storefront.api_key,
      clientSecret: storefront.api_secret,
      fsId: storefront.config?.fsId,
      appKey: storefront.api_key,
      appSecret: storefront.api_secret,
    };
  }
}

/**
 * Chat Integration Service (Shopee)
 */
export class ChatService {
  /**
   * Fetch unread messages from Shopee
   */
  static async fetchUnreadMessages(
    storefrontId: number,
    credentials: ShopeeConfig
  ): Promise<any[]> {
    const client = createShopeeClient(credentials);
    const conversations = await client.getConversationList({ page_size: 50 });
    
    const unread = conversations.page_result.conversations.filter(c => c.unread_count > 0);
    
    const messages: any[] = [];
    for (const conv of unread) {
      const msgs = await client.getMessages(conv.conversation_id, { page_size: 20 });
      messages.push(...msgs.page_result.messages);
    }

    return messages;
  }

  /**
   * Send reply to customer
   */
  static async sendReply(
    conversationId: string,
    toId: string,
    message: string,
    credentials: ShopeeConfig
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const client = createShopeeClient(credentials);
      await client.sendMessage(toId, 'text', { text: message });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Mark messages as read
   */
  static async markAsRead(
    conversationId: string,
    messageIds: string[],
    credentials: ShopeeConfig
  ): Promise<void> {
    const client = createShopeeClient(credentials);
    await client.readMessage(conversationId, messageIds);
  }
}
