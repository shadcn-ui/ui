/**
 * Tokopedia API Client
 * Documentation: https://developer.tokopedia.com/openapi/guide/
 * 
 * Features:
 * - OAuth 2.0 authentication (fs_id + Client Credentials)
 * - Product management (CRUD, variants, bulk operations)
 * - Order management & fulfillment
 * - Inventory synchronization
 * - Shop management (profile, categories, showcases)
 * - Logistics & shipping
 * - Webhooks for real-time updates
 * - Campaign & promotion management
 * - Chat/message handling
 * - Financial reports
 */

import crypto from 'crypto';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface TokopediaConfig {
  clientId: string;
  clientSecret: string;
  fsId: string; // Fulfillment Service ID
  shopId: string;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiresAt?: number;
  sandbox?: boolean;
}

export interface TokopediaAuthResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  sq_check: string;
  event_code: string;
}

export interface TokopediaProduct {
  productId: string;
  productName: string;
  sku: string;
  condition: 'NEW' | 'SECOND';
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED' | 'DELETED' | 'PENDING' | 'MODERATE';
  price: {
    value: number;
    currency: string;
  };
  stock: number;
  minOrder: number;
  categoryId: number;
  pictures: Array<{
    fileName: string;
    filePath: string;
    isPrimary: boolean;
  }>;
  descriptions: Array<{
    type: string;
    content: string;
  }>;
  weight: number;
  weightUnit: 'GR' | 'KG';
  dimension: {
    height: number;
    width: number;
    length: number;
  };
  mustInsurance: boolean;
  isFreeReturns: boolean;
  variants?: TokopediaVariant[];
  wholesales?: Array<{
    minQty: number;
    price: number;
  }>;
  preorder?: {
    isActive: boolean;
    duration: number;
    timeUnit: 'DAY' | 'WEEK';
  };
}

export interface TokopediaVariant {
  variantId: string;
  combination: Array<{
    optionId: string;
    valueId: string;
  }>;
  sku: string;
  price: number;
  stock: number;
  pictures: string[];
  status: 'ACTIVE' | 'INACTIVE';
}

export interface TokopediaOrder {
  orderId: string;
  invoiceNumber: string;
  orderStatus: 'NEW' | 'CONFIRM_SHIPPING' | 'REQUEST_PICKUP' | 'ON_PROCESS' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'COMPLETED';
  createTime: string;
  updateTime: string;
  buyer: {
    name: string;
    email: string;
    phone: string;
  };
  recipient: {
    name: string;
    phone: string;
    address: {
      addressFull: string;
        district: string;
      city: string;
      province: string;
      country: string;
      postalCode: string;
    };
  };
  logistics: {
    shippingId: number;
    districtId: number;
    shippingAgency: string;
    serviceType: string;
  };
  totalAmount: number;
  products: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    currency: string;
    notes?: string;
    weight: number;
    sku?: string;
  }>;
  payment: {
    method: string;
    gatewayName: string;
    transactionId: string;
  };
  waybill?: string;
  awbNumber?: string;
}

export interface TokopediaShopInfo {
  shopId: string;
  shopName: string;
  domain: string;
  description: string;
  tagLine: string;
  shopLogo: string;
  badgeImage: string;
  shopLevel: number;
  location: string;
  status: {
    statusTitle: string;
    shopStatus: number;
  };
  openSince: string;
  closedInfo: {
    reason: string;
    until: string;
    detail: string;
  };
  isOpen: boolean;
}

export interface TokopediaLogistics {
  shipperId: number;
  shipperName: string;
  shipperProduct: Array<{
    shipperProductId: number;
    shipperProductName: string;
    uiName: string;
    isAvailable: boolean;
  }>;
}

export interface TokopediaWebhook {
  eventType: 'ORDER_NOTIFICATION' | 'PRODUCT_NOTIFICATION' | 'SHOP_NOTIFICATION' | 'CHAT_NOTIFICATION';
  payload: any;
  timestamp: string;
  signature: string;
}

// ============================================================================
// MAIN CLIENT CLASS
// ============================================================================

export class TokopediaClient {
  private config: TokopediaConfig;
  private baseUrl: string;

  constructor(config: TokopediaConfig) {
    this.config = config;
    this.baseUrl = config.sandbox
      ? 'https://fs.tokopedia.net'
      : 'https://fs.tokopedia.net';
  }

  /**
   * Generate authorization header (Basic Auth for OAuth)
   */
  private getAuthorizationHeader(): string {
    const { clientId, clientSecret } = this.config;
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    return `Basic ${credentials}`;
  }

  /**
   * Make authenticated API request
   */
  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    path: string,
    params: Record<string, any> = {},
    requiresAuth: boolean = false
  ): Promise<T> {
    const { fsId, shopId, accessToken } = this.config;

    // Check token expiry
    if (requiresAuth && accessToken && this.isTokenExpired()) {
      await this.refreshAccessToken();
    }

    // Build URL
    const url = new URL(`${this.baseUrl}${path}`);

    // Build headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (requiresAuth && accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    // Add fs_id and shop_id to query params for authenticated requests
    if (requiresAuth) {
      url.searchParams.append('fs_id', fsId);
      url.searchParams.append('shop_id', shopId);
    }

    // Build request
    const options: RequestInit = {
      method,
      headers,
    };

    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      options.body = JSON.stringify(params);
    } else if (method === 'GET') {
      // Add query params for GET requests
      Object.keys(params).forEach(key => {
        url.searchParams.append(key, params[key]);
      });
    }

    const response = await fetch(url.toString(), options);
    const data = await response.json();

    // Tokopedia uses header.error_code to indicate errors
    if (data.header && data.header.error_code !== '') {
      throw new Error(`Tokopedia API Error: ${data.header.messages?.[0] || 'Unknown error'} (Code: ${data.header.error_code})`);
    }

    return data.data || data;
  }

  /**
   * Check if access token is expired
   */
  private isTokenExpired(): boolean {
    const { tokenExpiresAt } = this.config;
    if (!tokenExpiresAt) return true;
    
    // Add 5 minute buffer
    return Date.now() > tokenExpiresAt - 300000;
  }

  /**
   * Refresh access token
   */
  private async refreshAccessToken(): Promise<void> {
    const { clientId, clientSecret } = this.config;

    const response = await fetch(`${this.baseUrl}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': this.getAuthorizationHeader(),
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.access_token) {
      throw new Error(`Token refresh failed: ${data.error_description || 'Unknown error'}`);
    }

    // Update config
    this.config.accessToken = data.access_token;
    this.config.tokenExpiresAt = Date.now() + data.expires_in * 1000;
  }

  // ==========================================================================
  // AUTH API
  // ==========================================================================

  /**
   * Get access token using client credentials
   */
  async getAccessToken(): Promise<TokopediaAuthResponse> {
    const response = await fetch(`${this.baseUrl}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': this.getAuthorizationHeader(),
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.access_token) {
      throw new Error(`Authorization failed: ${data.error_description || 'Unknown error'}`);
    }

    // Update config
    this.config.accessToken = data.access_token;
    this.config.tokenExpiresAt = Date.now() + data.expires_in * 1000;

    return data;
  }

  // ==========================================================================
  // SHOP API
  // ==========================================================================

  /**
   * Get shop info
   */
  async getShopInfo(): Promise<TokopediaShopInfo> {
    return this.request<any>(
      'GET',
      '/v1/shop/fs/${fs_id}/shop-info',
      {},
      true
    );
  }

  /**
   * Update shop status
   */
  async updateShopStatus(params: {
    action: 'open' | 'close';
    closeNow?: boolean;
    closeEnd?: string; // ISO 8601 date
    closeNote?: string;
  }): Promise<void> {
    await this.request(
      'POST',
      '/v1/shop/fs/${fs_id}/shop-status',
      params,
      true
    );
  }

  /**
   * Get showcases
   */
  async getShowcases(): Promise<any> {
    return this.request<any>(
      'GET',
      '/v1/shop/fs/${fs_id}/showcases',
      {},
      true
    );
  }

  // ==========================================================================
  // PRODUCT API
  // ==========================================================================

  /**
   * Get product list
   */
  async getProductList(params: {
    page?: number;
    perPage?: number;
    shopId?: string;
  } = {}): Promise<{ products: TokopediaProduct[]; totalData: number }> {
    return this.request<any>(
      'GET',
      '/v3/products/fs/${fs_id}/products',
      { page: 1, per_page: 50, ...params },
      true
    );
  }

  /**
   * Get product detail
   */
  async getProductDetail(productId: string): Promise<TokopediaProduct> {
    return this.request<any>(
      'GET',
      `/v3/products/fs/\${fs_id}/products/${productId}`,
      {},
      true
    );
  }

  /**
   * Create product
   */
  async createProduct(product: {
    productName: string;
    categoryId: number;
    price: number;
    stock: number;
    condition: 'NEW' | 'SECOND';
    minOrder: number;
    sku?: string;
    pictures: Array<{
      fileName: string;
      filePath: string;
      isPrimary: boolean;
    }>;
    descriptions: Array<{
      type: string;
      content: string;
    }>;
    weight: number;
    weightUnit: 'GR' | 'KG';
    dimension: {
      height: number;
      width: number;
      length: number;
    };
    mustInsurance?: boolean;
    isFreeReturns?: boolean;
  }): Promise<{ productId: string }> {
    return this.request<any>(
      'POST',
      '/v3/products/fs/${fs_id}/create',
      product,
      true
    );
  }

  /**
   * Update product
   */
  async updateProduct(productId: string, updates: Partial<{
    productName: string;
    price: number;
    stock: number;
    status: 'ACTIVE' | 'INACTIVE';
    sku: string;
    descriptions: Array<{
      type: string;
      content: string;
    }>;
    weight: number;
  }>): Promise<void> {
    await this.request(
      'PATCH',
      `/v3/products/fs/\${fs_id}/products/${productId}`,
      updates,
      true
    );
  }

  /**
   * Delete product
   */
  async deleteProduct(productId: string): Promise<void> {
    await this.request(
      'POST',
      `/v3/products/fs/\${fs_id}/delete/${productId}`,
      {},
      true
    );
  }

  /**
   * Update stock
   */
  async updateStock(productId: string, stock: number): Promise<void> {
    await this.request(
      'POST',
      `/v1/inventory/fs/\${fs_id}/stock/${productId}`,
      { stock },
      true
    );
  }

  /**
   * Update price
   */
  async updatePrice(productId: string, price: number): Promise<void> {
    await this.request(
      'POST',
      `/v1/products/fs/\${fs_id}/price/${productId}`,
      { price },
      true
    );
  }

  /**
   * Get variant by product ID
   */
  async getVariants(productId: string): Promise<{ variants: TokopediaVariant[] }> {
    return this.request<any>(
      'GET',
      `/v1/products/fs/\${fs_id}/products/${productId}/variant`,
      {},
      true
    );
  }

  // ==========================================================================
  // ORDER API
  // ==========================================================================

  /**
   * Get order list
   */
  async getOrderList(params: {
    fromDate?: string; // timestamp
    toDate?: string;
    page?: number;
    perPage?: number;
    shopId?: string;
    orderStatus?: number; // 0=all, 100=new, 103=confirm_shipping, etc.
  } = {}): Promise<{ orders: TokopediaOrder[]; totalOrder: number }> {
    return this.request<any>(
      'GET',
      '/v2/order/list',
      { page: 1, per_page: 50, ...params },
      true
    );
  }

  /**
   * Get single order detail
   */
  async getSingleOrder(orderId: string): Promise<TokopediaOrder> {
    return this.request<any>(
      'GET',
      `/v2/fs/\${fs_id}/order/${orderId}`,
      {},
      true
    );
  }

  /**
   * Accept order
   */
  async acceptOrder(orderId: string): Promise<void> {
    await this.request(
      'POST',
      '/v1/order/fs/${fs_id}/ack',
      { order_id: parseInt(orderId) },
      true
    );
  }

  /**
   * Reject order
   */
  async rejectOrder(orderId: string, params: {
    reasonCode: number;
    reasonMessage?: string;
    shopCloseEndDate?: string;
    shopCloseNote?: string;
  }): Promise<void> {
    await this.request(
      'POST',
      '/v1/order/fs/${fs_id}/nack',
      {
        order_id: parseInt(orderId),
        ...params,
      },
      true
    );
  }

  /**
   * Request pickup (mark as ready to ship)
   */
  async requestPickup(orderId: string, params: {
    orderDate: string;
    shipmentDate: string;
  }): Promise<void> {
    await this.request(
      'POST',
      '/v1/order/fs/${fs_id}/rp',
      {
        order_id: parseInt(orderId),
        ...params,
      },
      true
    );
  }

  /**
   * Confirm shipping
   */
  async confirmShipping(orderId: string, shippingRef: string): Promise<void> {
    await this.request(
      'POST',
      '/v1/order/fs/${fs_id}/status',
      {
        order_id: parseInt(orderId),
        shipping_ref_num: shippingRef,
      },
      true
    );
  }

  // ==========================================================================
  // LOGISTICS API
  // ==========================================================================

  /**
   * Get shipping info
   */
  async getShippingInfo(shopId: string): Promise<{ shippingInfo: TokopediaLogistics[] }> {
    return this.request<any>(
      'GET',
      `/v2/logistic/fs/\${fs_id}/info`,
      { shop_id: shopId },
      true
    );
  }

  /**
   * Get active shipping info
   */
  async getActiveShipping(productId: string): Promise<any> {
    return this.request<any>(
      'GET',
      `/v2/logistic/fs/\${fs_id}/active`,
      { product_id: productId },
      true
    );
  }

  /**
   * Update shipping status
   */
  async updateShippingStatus(orderId: string, params: {
    bookingCode?: string;
    shippingRef?: string;
  }): Promise<void> {
    await this.request(
      'POST',
      `/v1/order/fs/\${fs_id}/shipping/${orderId}`,
      params,
      true
    );
  }

  // ==========================================================================
  // CATEGORY API
  // ==========================================================================

  /**
   * Get all categories
   */
  async getCategories(): Promise<any> {
    return this.request<any>(
      'GET',
      '/inventory/v1/fs/${fs_id}/category/get_all_categories',
      {},
      true
    );
  }

  // ==========================================================================
  // WEBHOOK API
  // ==========================================================================

  /**
   * Register webhook
   */
  async registerWebhook(params: {
    fsId: string;
    url: string;
    event: 'ORDER_NOTIFICATION' | 'PRODUCT_NOTIFICATION' | 'SHOP_NOTIFICATION' | 'CHAT_NOTIFICATION';
  }): Promise<void> {
    await this.request(
      'POST',
      '/v1/webhook/fs/${fs_id}/register',
      params,
      true
    );
  }

  /**
   * Unregister webhook
   */
  async unregisterWebhook(fsId: string, event: string): Promise<void> {
    await this.request(
      'POST',
      `/v1/webhook/fs/\${fs_id}/unregister`,
      { event },
      true
    );
  }

  // ==========================================================================
  // CHAT/MESSAGE API
  // ==========================================================================

  /**
   * Get messages
   */
  async getMessages(params: {
    msgId?: number;
    page?: number;
  } = {}): Promise<any> {
    return this.request<any>(
      'GET',
      '/v1/chat/fs/${fs_id}/messages',
      { page: 1, ...params },
      true
    );
  }

  /**
   * Reply to message
   */
  async replyMessage(msgId: number, message: string): Promise<void> {
    await this.request(
      'POST',
      '/v1/chat/fs/${fs_id}/reply',
      {
        msg_id: msgId,
        msg: message,
      },
      true
    );
  }

  // ==========================================================================
  // CAMPAIGN API
  // ==========================================================================

  /**
   * Get campaigns
   */
  async getCampaigns(params: {
    campaignType?: 'FLASH_SALE' | 'CAMPAIGN' | 'SLASH_PRICE';
    status?: 'ONGOING' | 'UPCOMING' | 'FINISHED';
  } = {}): Promise<any> {
    return this.request<any>(
      'GET',
      '/v1/campaign/fs/${fs_id}/list',
      params,
      true
    );
  }

  /**
   * Get campaign products
   */
  async getCampaignProducts(campaignId: string): Promise<any> {
    return this.request<any>(
      'GET',
      `/v1/campaign/fs/\${fs_id}/view/${campaignId}`,
      {},
      true
    );
  }

  /**
   * Add product to campaign
   */
  async addProductToCampaign(campaignId: string, params: {
    productId: string;
    discountedPrice: number;
    customStock: number;
  }): Promise<void> {
    await this.request(
      'POST',
      `/v1/campaign/fs/\${fs_id}/add/${campaignId}`,
      params,
      true
    );
  }

  // ==========================================================================
  // FINANCE API
  // ==========================================================================

  /**
   * Get seller balance
   */
  async getSellerBalance(): Promise<any> {
    return this.request<any>(
      'GET',
      '/v1/fs/${fs_id}/shop-balance',
      {},
      true
    );
  }

  /**
   * Get saldo history
   */
  async getSaldoHistory(params: {
    fromDate?: string;
    toDate?: string;
    page?: number;
    perPage?: number;
  } = {}): Promise<any> {
    return this.request<any>(
      'GET',
      '/v1/fs/${fs_id}/saldo-history',
      { page: 1, per_page: 50, ...params },
      true
    );
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Create Tokopedia client instance
 */
export function createTokopediaClient(config: TokopediaConfig): TokopediaClient {
  return new TokopediaClient(config);
}

/**
 * Verify Tokopedia webhook signature
 */
export function verifyTokopediaWebhook(body: string, signature: string, fsId: string): boolean {
  const expectedSignature = crypto
    .createHash('sha256')
    .update(`${fsId}${body}`)
    .digest('hex');

  return signature === expectedSignature;
}
