/**
 * Unified Order & Sales Sync Service
 * Synchronizes orders between e-commerce platforms and Ocean ERP
 * 
 * Features:
 * - Fetch orders from platforms (Shopee, TikTok Shop, Tokopedia)
 * - Map to sales_orders and ecommerce_orders tables
 * - Handle order status updates
 * - Process cancellations and refunds
 * - Automatic fulfillment triggers
 * - Payment status tracking
 * - Customer data sync
 */

import { createShopeeClient, type ShopeeConfig, type ShopeeOrder } from '../integrations/shopee-api-client';
import { createTikTokShopClient, type TikTokShopConfig, type TikTokOrder } from '../integrations/tiktok-shop-api-client';
import { createTokopediaClient, type TokopediaConfig, type TokopediaOrder } from '../integrations/tokopedia-api-client';
import { db } from '../db';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type Platform = 'shopee' | 'tiktok' | 'tokopedia';
export type OrderStatus = 'NEW' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'COMPLETED';

export interface UnifiedOrder {
  platformOrderId: string;
  platform: Platform;
  storefrontId: number;
  orderNumber?: string;
  status: OrderStatus;
  totalAmount: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
  customer: {
    name: string;
    email?: string;
    phone: string;
  };
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: Array<{
    productId?: number;
    externalProductId: string;
    sku: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  shipping: {
    carrier?: string;
    trackingNumber?: string;
    shippingFee: number;
  };
  payment: {
    method?: string;
    status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  };
}

export interface SyncOrdersResult {
  success: boolean;
  newOrders: number;
  updatedOrders: number;
  errors: Array<{
    orderId: string;
    error: string;
  }>;
}

// ============================================================================
// ORDER SYNC SERVICE
// ============================================================================

export class OrderSyncService {
  /**
   * Sync all orders from platform to ERP
   */
  static async syncOrdersFromPlatform(
    storefrontId: number,
    platform: Platform,
    credentials: any,
    params: {
      startDate: Date;
      endDate?: Date;
    }
  ): Promise<SyncOrdersResult> {
    const result: SyncOrdersResult = {
      success: true,
      newOrders: 0,
      updatedOrders: 0,
      errors: [],
    };

    try {
      // Fetch orders from platform
      const orders = await this.fetchOrdersFromPlatform(platform, credentials, params);

      for (const order of orders) {
        try {
          // Check if order already exists
          const existingMapping = await this.getOrderMapping(storefrontId, platform, order.platformOrderId);

          if (existingMapping) {
            // Update existing order
            await this.updateERPOrder(existingMapping.internal_id, order);
            result.updatedOrders++;
          } else {
            // Create new order
            const erpOrderId = await this.createERPOrder(order);
            
            // Save mapping
            await this.saveOrderMapping(erpOrderId, storefrontId, platform, order.platformOrderId);
            
            result.newOrders++;
          }

          // Update ecommerce_orders table
          await this.updateEcommerceOrder(storefrontId, order);

          // Log sync
          await this.logSync(storefrontId, 'order_sync', 'success', {
            platform_order_id: order.platformOrderId,
            status: order.status,
          });
        } catch (error: any) {
          result.errors.push({
            orderId: order.platformOrderId,
            error: error.message,
          });
        }
      }

      result.success = result.errors.length === 0;
    } catch (error: any) {
      result.success = false;
      result.errors.push({
        orderId: 'bulk_sync',
        error: error.message,
      });
    }

    return result;
  }

  /**
   * Sync single order from platform
   */
  static async syncSingleOrder(
    platformOrderId: string,
    storefrontId: number,
    platform: Platform,
    credentials: any
  ): Promise<{ success: boolean; erpOrderId?: number; error?: string }> {
    try {
      // Fetch order from platform
      const order = await this.fetchSingleOrder(platform, credentials, platformOrderId);

      // Check if order exists
      const existingMapping = await this.getOrderMapping(storefrontId, platform, platformOrderId);

      let erpOrderId: number;

      if (existingMapping) {
        // Update existing order
        erpOrderId = existingMapping.internal_id;
        await this.updateERPOrder(erpOrderId, order);
      } else {
        // Create new order
        erpOrderId = await this.createERPOrder(order);
        
        // Save mapping
        await this.saveOrderMapping(erpOrderId, storefrontId, platform, platformOrderId);
      }

      // Update ecommerce_orders table
      await this.updateEcommerceOrder(storefrontId, order);

      // Log sync
      await this.logSync(storefrontId, 'order_sync', 'success', {
        platform_order_id: platformOrderId,
        erp_order_id: erpOrderId,
      });

      return { success: true, erpOrderId };
    } catch (error: any) {
      await this.logSync(storefrontId, 'order_sync', 'error', {
        platform_order_id: platformOrderId,
        error: error.message,
      });

      return { success: false, error: error.message };
    }
  }

  /**
   * Update order status on platform
   */
  static async updateOrderStatus(
    erpOrderId: number,
    storefrontId: number,
    platform: Platform,
    credentials: any,
    newStatus: OrderStatus,
    trackingNumber?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Get platform order ID from mapping
      const mapping = await this.getOrderMappingByERPId(erpOrderId, storefrontId, platform);
      if (!mapping) {
        throw new Error('Order not synced to platform');
      }

      // Update status on platform
      await this.updatePlatformOrderStatus(
        platform,
        credentials,
        mapping.external_id,
        newStatus,
        trackingNumber
      );

      // Update ERP order
      await db.query(
        `UPDATE sales_orders 
         SET status = $1, tracking_number = $2, updated_at = NOW()
         WHERE id = $3`,
        [newStatus, trackingNumber, erpOrderId]
      );

      // Update ecommerce_orders
      await db.query(
        `UPDATE ecommerce_orders 
         SET status = $1, updated_at = NOW()
         WHERE storefront_id = $2 AND platform_order_id = $3`,
        [newStatus, storefrontId, mapping.external_id]
      );

      // Log update
      await this.logSync(storefrontId, 'order_status_update', 'success', {
        erp_order_id: erpOrderId,
        platform_order_id: mapping.external_id,
        new_status: newStatus,
        tracking_number: trackingNumber,
      });

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Cancel order
   */
  static async cancelOrder(
    erpOrderId: number,
    storefrontId: number,
    platform: Platform,
    credentials: any,
    cancelReason: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Get platform order ID
      const mapping = await this.getOrderMappingByERPId(erpOrderId, storefrontId, platform);
      if (!mapping) {
        throw new Error('Order not synced to platform');
      }

      // Cancel on platform
      await this.cancelPlatformOrder(platform, credentials, mapping.external_id, cancelReason);

      // Update ERP order
      await db.query(
        `UPDATE sales_orders 
         SET status = 'CANCELLED', notes = $1, updated_at = NOW()
         WHERE id = $2`,
        [cancelReason, erpOrderId]
      );

      // Update ecommerce_orders
      await db.query(
        `UPDATE ecommerce_orders 
         SET status = 'CANCELLED', notes = $1, updated_at = NOW()
         WHERE storefront_id = $2 AND platform_order_id = $3`,
        [cancelReason, storefrontId, mapping.external_id]
      );

      // Log cancellation
      await this.logSync(storefrontId, 'order_cancel', 'success', {
        erp_order_id: erpOrderId,
        platform_order_id: mapping.external_id,
        reason: cancelReason,
      });

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // ==========================================================================
  // PLATFORM-SPECIFIC OPERATIONS
  // ==========================================================================

  /**
   * Fetch orders from platform
   */
  private static async fetchOrdersFromPlatform(
    platform: Platform,
    credentials: any,
    params: { startDate: Date; endDate?: Date }
  ): Promise<UnifiedOrder[]> {
    const endDate = params.endDate || new Date();
    const startTimestamp = Math.floor(params.startDate.getTime() / 1000);
    const endTimestamp = Math.floor(endDate.getTime() / 1000);

    switch (platform) {
      case 'shopee': {
        const client = createShopeeClient(credentials as ShopeeConfig);
        const result = await client.getOrderList({
          time_range_field: 'create_time',
          time_from: startTimestamp,
          time_to: endTimestamp,
          page_size: 100,
        });

        // Fetch full details for each order
        if (result.order_list.length > 0) {
          const orderSns = result.order_list.map(o => o.order_sn);
          const detailResult = await client.getOrderDetail(orderSns);
          
          return detailResult.order_list.map(order => this.mapShopeeOrder(order, credentials.storefrontId));
        }

        return [];
      }

      case 'tiktok': {
        const client = createTikTokShopClient(credentials as TikTokShopConfig);
        const result = await client.getOrderList({
          create_time_from: startTimestamp,
          create_time_to: endTimestamp,
          page_size: 100,
        });

        // Fetch full details
        if (result.orders.length > 0) {
          const orderIds = result.orders.map(o => o.id);
          const detailResult = await client.getOrderDetail(orderIds);
          
          return detailResult.orders.map(order => this.mapTikTokOrder(order, credentials.storefrontId));
        }

        return [];
      }

      case 'tokopedia': {
        const client = createTokopediaClient(credentials as TokopediaConfig);
        const result = await client.getOrderList({
          fromDate: startTimestamp.toString(),
          toDate: endTimestamp.toString(),
          perPage: 100,
        });

        return result.orders.map(order => this.mapTokopediaOrder(order, credentials.storefrontId));
      }

      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  /**
   * Fetch single order from platform
   */
  private static async fetchSingleOrder(
    platform: Platform,
    credentials: any,
    platformOrderId: string
  ): Promise<UnifiedOrder> {
    switch (platform) {
      case 'shopee': {
        const client = createShopeeClient(credentials as ShopeeConfig);
        const result = await client.getOrderDetail([platformOrderId]);
        return this.mapShopeeOrder(result.order_list[0], credentials.storefrontId);
      }

      case 'tiktok': {
        const client = createTikTokShopClient(credentials as TikTokShopConfig);
        const result = await client.getOrderDetail([platformOrderId]);
        return this.mapTikTokOrder(result.orders[0], credentials.storefrontId);
      }

      case 'tokopedia': {
        const client = createTokopediaClient(credentials as TokopediaConfig);
        const order = await client.getSingleOrder(platformOrderId);
        return this.mapTokopediaOrder(order, credentials.storefrontId);
      }

      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  /**
   * Update order status on platform
   */
  private static async updatePlatformOrderStatus(
    platform: Platform,
    credentials: any,
    platformOrderId: string,
    status: OrderStatus,
    trackingNumber?: string
  ): Promise<void> {
    switch (platform) {
      case 'shopee': {
        const client = createShopeeClient(credentials as ShopeeConfig);
        if (status === 'SHIPPED' && trackingNumber) {
          await client.shipOrder(platformOrderId);
        }
        break;
      }

      case 'tiktok': {
        const client = createTikTokShopClient(credentials as TikTokShopConfig);
        if (status === 'SHIPPED' && trackingNumber) {
          await client.shipOrder(platformOrderId, {
            tracking_number: trackingNumber,
            shipping_provider_id: credentials.shippingProviderId || '0',
          });
        }
        break;
      }

      case 'tokopedia': {
        const client = createTokopediaClient(credentials as TokopediaConfig);
        if (status === 'CONFIRMED') {
          await client.acceptOrder(platformOrderId);
        } else if (status === 'SHIPPED' && trackingNumber) {
          await client.confirmShipping(platformOrderId, trackingNumber);
        }
        break;
      }

      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  /**
   * Cancel order on platform
   */
  private static async cancelPlatformOrder(
    platform: Platform,
    credentials: any,
    platformOrderId: string,
    reason: string
  ): Promise<void> {
    switch (platform) {
      case 'shopee': {
        const client = createShopeeClient(credentials as ShopeeConfig);
        await client.cancelOrder(platformOrderId, reason, []);
        break;
      }

      case 'tiktok': {
        const client = createTikTokShopClient(credentials as TikTokShopConfig);
        await client.cancelOrder(platformOrderId, reason);
        break;
      }

      case 'tokopedia': {
        const client = createTokopediaClient(credentials as TokopediaConfig);
        await client.rejectOrder(platformOrderId, {
          reasonCode: 1,
          reasonMessage: reason,
        });
        break;
      }

      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  // ==========================================================================
  // ORDER MAPPING FUNCTIONS
  // ==========================================================================

  /**
   * Map Shopee order to unified format
   */
  private static mapShopeeOrder(order: ShopeeOrder, storefrontId: number): UnifiedOrder {
    return {
      platformOrderId: order.order_sn,
      platform: 'shopee',
      storefrontId,
      orderNumber: order.order_sn,
      status: this.mapShopeeStatus(order.order_status),
      totalAmount: order.total_amount,
      currency: order.currency,
      createdAt: new Date(order.create_time * 1000),
      updatedAt: new Date(order.update_time * 1000),
      customer: {
        name: order.recipient_address?.name || order.buyer_username,
        phone: order.recipient_address?.phone || '',
      },
      shippingAddress: {
        name: order.recipient_address?.name || '',
        phone: order.recipient_address?.phone || '',
        address: order.recipient_address?.full_address || '',
        city: order.recipient_address?.city || '',
        state: order.recipient_address?.state || '',
        postalCode: order.recipient_address?.zipcode || '',
        country: order.recipient_address?.region || '',
      },
      items: order.item_list.map(item => ({
        externalProductId: item.item_id.toString(),
        sku: item.model_sku || item.item_sku,
        name: item.item_name,
        quantity: item.model_quantity_purchased,
        price: item.model_discounted_price,
      })),
      shipping: {
        carrier: order.shipping_carrier,
        trackingNumber: order.tracking_no,
        shippingFee: 0,
      },
      payment: {
        status: 'PAID',
      },
    };
  }

  /**
   * Map TikTok order to unified format
   */
  private static mapTikTokOrder(order: TikTokOrder, storefrontId: number): UnifiedOrder {
    return {
      platformOrderId: order.id,
      platform: 'tiktok',
      storefrontId,
      orderNumber: order.id,
      status: this.mapTikTokStatus(order.order_status),
      totalAmount: parseFloat(order.payment.total_amount),
      currency: order.payment.currency,
      createdAt: new Date(order.create_time * 1000),
      updatedAt: new Date(order.update_time * 1000),
      customer: {
        name: order.recipient_address.name,
        email: order.buyer_email,
        phone: order.recipient_address.phone_number,
      },
      shippingAddress: {
        name: order.recipient_address.name,
        phone: order.recipient_address.phone_number,
        address: order.recipient_address.full_address,
        city: '',
        state: '',
        postalCode: order.recipient_address.postal_code,
        country: order.recipient_address.region_code,
      },
      items: order.line_items.map(item => ({
        externalProductId: item.product_id,
        sku: item.sku_id,
        name: item.product_name,
        quantity: item.quantity,
        price: parseFloat(item.sale_price),
      })),
      shipping: {
        carrier: order.shipping_provider,
        trackingNumber: order.tracking_number,
        shippingFee: parseFloat(order.payment.shipping_fee),
      },
      payment: {
        status: 'PAID',
      },
    };
  }

  /**
   * Map Tokopedia order to unified format
   */
  private static mapTokopediaOrder(order: TokopediaOrder, storefrontId: number): UnifiedOrder {
    return {
      platformOrderId: order.orderId,
      platform: 'tokopedia',
      storefrontId,
      orderNumber: order.invoiceNumber,
      status: this.mapTokopediaStatus(order.orderStatus),
      totalAmount: order.totalAmount,
      currency: 'IDR',
      createdAt: new Date(order.createTime),
      updatedAt: new Date(order.updateTime),
      customer: {
        name: order.buyer.name,
        email: order.buyer.email,
        phone: order.buyer.phone,
      },
      shippingAddress: {
        name: order.recipient.name,
        phone: order.recipient.phone,
        address: order.recipient.address.addressFull,
        city: order.recipient.address.city,
        state: order.recipient.address.province,
        postalCode: order.recipient.address.postalCode,
        country: order.recipient.address.country,
      },
      items: order.products.map(item => ({
        externalProductId: item.productId,
        sku: item.sku || '',
        name: item.productName,
        quantity: item.quantity,
        price: item.price,
      })),
      shipping: {
        carrier: order.logistics.shippingAgency,
        trackingNumber: order.awbNumber,
        shippingFee: 0,
      },
      payment: {
        method: order.payment.method,
        status: 'PAID',
      },
    };
  }

  /**
   * Map platform-specific status to unified status
   */
  private static mapShopeeStatus(status: string): OrderStatus {
    const statusMap: Record<string, OrderStatus> = {
      'UNPAID': 'NEW',
      'READY_TO_SHIP': 'CONFIRMED',
      'PROCESSED': 'PROCESSING',
      'SHIPPED': 'SHIPPED',
      'TO_CONFIRM_RECEIVE': 'DELIVERED',
      'COMPLETED': 'COMPLETED',
      'CANCELLED': 'CANCELLED',
      'IN_CANCEL': 'CANCELLED',
    };
    return statusMap[status] || 'NEW';
  }

  private static mapTikTokStatus(status: string): OrderStatus {
    const statusMap: Record<string, OrderStatus> = {
      'UNPAID': 'NEW',
      'ON_HOLD': 'CONFIRMED',
      'AWAITING_SHIPMENT': 'CONFIRMED',
      'AWAITING_COLLECTION': 'PROCESSING',
      'IN_TRANSIT': 'SHIPPED',
      'DELIVERED': 'DELIVERED',
      'COMPLETED': 'COMPLETED',
      'CANCELLED': 'CANCELLED',
    };
    return statusMap[status] || 'NEW';
  }

  private static mapTokopediaStatus(status: string): OrderStatus {
    const statusMap: Record<string, OrderStatus> = {
      'NEW': 'NEW',
      'CONFIRM_SHIPPING': 'CONFIRMED',
      'REQUEST_PICKUP': 'PROCESSING',
      'ON_PROCESS': 'PROCESSING',
      'SHIPPED': 'SHIPPED',
      'DELIVERED': 'DELIVERED',
      'COMPLETED': 'COMPLETED',
      'CANCELLED': 'CANCELLED',
    };
    return statusMap[status] || 'NEW';
  }

  // ==========================================================================
  // DATABASE OPERATIONS
  // ==========================================================================

  /**
   * Create order in ERP
   */
  private static async createERPOrder(order: UnifiedOrder): Promise<number> {
    // Insert sales order
    const orderResult = await db.query(
      `INSERT INTO sales_orders (
        order_number, external_order_id, source_platform, status, total_amount, currency,
        customer_name, customer_email, customer_phone,
        shipping_address, shipping_city, shipping_state, shipping_postal_code,
        tracking_number, shipping_status, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW())
      RETURNING id`,
      [
        order.orderNumber || order.platformOrderId,
        order.platformOrderId,
        order.platform,
        order.status,
        order.totalAmount,
        order.currency,
        order.customer.name,
        order.customer.email,
        order.customer.phone,
        order.shippingAddress.address,
        order.shippingAddress.city,
        order.shippingAddress.state,
        order.shippingAddress.postalCode,
        order.shipping.trackingNumber,
        order.status === 'SHIPPED' ? 'shipped' : 'pending',
      ]
    );

    const erpOrderId = orderResult.rows[0].id;

    // Insert order items
    for (const item of order.items) {
      // Try to find internal product ID from mapping
      const productMapping = await db.query(
        `SELECT internal_id FROM integration_mappings
         WHERE integration_id = $1 AND entity_type = 'product' AND external_id = $2`,
        [`${order.platform}_${order.storefrontId}`, item.externalProductId]
      );

      const erpProductId = productMapping.rows[0]?.internal_id || null;

      await db.query(
        `INSERT INTO order_items (order_id, product_id, sku, product_name, quantity, unit_price, total_price)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [erpOrderId, erpProductId, item.sku, item.name, item.quantity, item.price, item.price * item.quantity]
      );
    }

    return erpOrderId;
  }

  /**
   * Update order in ERP
   */
  private static async updateERPOrder(erpOrderId: number, order: UnifiedOrder): Promise<void> {
    await db.query(
      `UPDATE sales_orders 
       SET status = $1, tracking_number = $2, shipping_status = $3, updated_at = NOW()
       WHERE id = $4`,
      [
        order.status,
        order.shipping.trackingNumber,
        order.status === 'SHIPPED' ? 'shipped' : 'pending',
        erpOrderId,
      ]
    );
  }

  /**
   * Update ecommerce_orders table
   */
  private static async updateEcommerceOrder(storefrontId: number, order: UnifiedOrder): Promise<void> {
    await db.query(
      `INSERT INTO ecommerce_orders (
        storefront_id, platform_order_id, order_number, status, currency, total_amount,
        buyer_name, buyer_email, buyer_phone, recipient_address,
        tracking_number, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
      ON CONFLICT (storefront_id, platform_order_id)
      DO UPDATE SET
        status = $4,
        total_amount = $6,
        tracking_number = $11,
        updated_at = NOW()`,
      [
        storefrontId,
        order.platformOrderId,
        order.orderNumber,
        order.status,
        order.currency,
        order.totalAmount,
        order.customer.name,
        order.customer.email,
        order.customer.phone,
        JSON.stringify(order.shippingAddress),
        order.shipping.trackingNumber,
        order.createdAt,
      ]
    );
  }

  /**
   * Get order mapping
   */
  private static async getOrderMapping(
    storefrontId: number,
    platform: Platform,
    platformOrderId: string
  ): Promise<any> {
    const result = await db.query(
      `SELECT * FROM integration_mappings
       WHERE integration_id = $1 AND entity_type = 'order' AND external_id = $2`,
      [`${platform}_${storefrontId}`, platformOrderId]
    );

    return result.rows[0] || null;
  }

  /**
   * Get order mapping by ERP order ID
   */
  private static async getOrderMappingByERPId(
    erpOrderId: number,
    storefrontId: number,
    platform: Platform
  ): Promise<any> {
    const result = await db.query(
      `SELECT * FROM integration_mappings
       WHERE integration_id = $1 AND entity_type = 'order' AND internal_id = $2`,
      [`${platform}_${storefrontId}`, erpOrderId]
    );

    return result.rows[0] || null;
  }

  /**
   * Save order mapping
   */
  private static async saveOrderMapping(
    erpOrderId: number,
    storefrontId: number,
    platform: Platform,
    platformOrderId: string
  ): Promise<void> {
    await db.query(
      `INSERT INTO integration_mappings (integration_id, entity_type, external_id, internal_id, sync_direction, last_synced_at)
       VALUES ($1, 'order', $2, $3, 'bidirectional', NOW())
       ON CONFLICT (integration_id, entity_type, external_id)
       DO UPDATE SET internal_id = $3, last_synced_at = NOW()`,
      [`${platform}_${storefrontId}`, platformOrderId, erpOrderId]
    );
  }

  /**
   * Log sync operation
   */
  private static async logSync(
    storefrontId: number,
    action: string,
    status: string,
    details: any
  ): Promise<void> {
    await db.query(
      `INSERT INTO integration_logs (integration_id, action, status, details, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [`storefront_${storefrontId}`, action, status, JSON.stringify(details)]
    );
  }
}
