/**
 * TikTok Shop Seller API Client
 * Documentation: https://partner.tiktokshop.com/docv2/
 * 
 * Features:
 * - Authorization & authentication (App Key/Secret)
 * - Product catalog management
 * - Order management & fulfillment
 * - Inventory management
 * - Live shopping integration
 * - Creator partnership & affiliate programs
 * - Promotions & marketing
 * - Returns & refunds
 * - Analytics & reports
 */

import crypto from 'crypto';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type TikTokRegion = 'US' | 'GB' | 'ID' | 'TH' | 'VN' | 'MY' | 'PH' | 'SG';

export interface TikTokShopConfig {
  appKey: string;
  appSecret: string;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiresAt?: number;
  shopId?: string;
  region?: TikTokRegion;
  sandbox?: boolean;
}

export interface TikTokAuthResponse {
  access_token: string;
  access_token_expire_in: number;
  refresh_token: string;
  refresh_token_expire_in: number;
  open_id: string;
  seller_name: string;
  seller_base_region: string;
  user_type: number;
}

export interface TikTokProduct {
  id: string;
  title: string;
  description: string;
  category_id: string;
  brand_id?: string;
  main_images: Array<{ url: string; thumb_urls: string[] }>;
  skus: TikTokSku[];
  size_chart?: {
    image: { url: string };
  };
  package_dimensions?: {
    height: string;
    length: string;
    width: string;
    unit: 'CENTIMETER' | 'INCH';
  };
  package_weight?: {
    value: string;
    unit: 'KILOGRAM' | 'POUND';
  };
  is_cod_open: boolean;
  delivery_option_ids: string[];
  product_certifications?: Array<{
    id: string;
    title: string;
    files: Array<{ url: string }>;
  }>;
}

export interface TikTokSku {
  id: string;
  seller_sku: string;
  sales_attributes: Array<{
    attribute_id: string;
    attribute_name: string;
    value_id: string;
    value_name: string;
  }>;
  inventory: Array<{
    warehouse_id: string;
    quantity: number;
  }>;
  price: {
    amount: string;
    currency: string;
  };
  identifier_code?: {
    code: string;
    type: 'EAN' | 'UPC' | 'ISBN';
  };
}

export interface TikTokOrder {
  id: string;
  order_status: 'UNPAID' | 'ON_HOLD' | 'AWAITING_SHIPMENT' | 'AWAITING_COLLECTION' | 'IN_TRANSIT' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED';
  create_time: number;
  update_time: number;
  buyer_email: string;
  buyer_message?: string;
  recipient_address: {
    full_address: string;
    name: string;
    phone_number: string;
    region_code: string;
    postal_code: string;
  };
  payment: {
    currency: string;
    total_amount: string;
    sub_total: string;
    shipping_fee: string;
    seller_discount: string;
    platform_discount: string;
    tax: string;
  };
  line_items: Array<{
    id: string;
    product_id: string;
    product_name: string;
    sku_id: string;
    sku_name: string;
    sku_image: string;
    quantity: number;
    sale_price: string;
    platform_discount: string;
    seller_discount: string;
  }>;
  tracking_number?: string;
  shipping_provider?: string;
  cancel_reason?: string;
}

export interface TikTokWarehouse {
  id: string;
  name: string;
  address: {
    full_address: string;
    region_code: string;
    postal_code: string;
    contact_name: string;
    phone_number: string;
  };
  is_default: boolean;
}

export interface TikTokPromotion {
  id: string;
  title: string;
  type: 'FLASH_SALE' | 'DISCOUNT' | 'BUNDLE' | 'FREE_SHIPPING';
  status: 'SCHEDULED' | 'ONGOING' | 'EXPIRED';
  start_time: number;
  end_time: number;
  applicable_products: Array<{
    product_id: string;
    sku_id?: string;
    discount_value: string;
    discount_type: 'PERCENTAGE' | 'FIXED_AMOUNT';
  }>;
}

// ============================================================================
// MAIN CLIENT CLASS
// ============================================================================

export class TikTokShopClient {
  private config: TikTokShopConfig;
  private baseUrl: string;

  constructor(config: TikTokShopConfig) {
    this.config = config;
    this.baseUrl = config.sandbox
      ? 'https://sandbox-api.tiktokshop.com'
      : 'https://open-api.tiktokglobalshop.com';
  }

  /**
   * Generate signature for API requests
   */
  private generateSignature(path: string, timestamp: number, params: string = ''): string {
    const { appKey, appSecret } = this.config;
    
    // Build signature string
    const signString = `${appKey}${path}${timestamp}${params}${appSecret}`;

    return crypto
      .createHmac('sha256', appSecret)
      .update(signString)
      .digest('hex');
  }

  /**
   * Make authenticated API request
   */
  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    params: Record<string, any> = {},
    requiresAuth: boolean = false
  ): Promise<T> {
    const timestamp = Math.floor(Date.now() / 1000);
    const { appKey, accessToken } = this.config;

    // Check token expiry
    if (requiresAuth && accessToken && this.isTokenExpired()) {
      await this.refreshAccessToken();
    }

    // Build request params string for signature
    const sortedParams = Object.keys(params).sort();
    const paramsString = sortedParams.map(key => `${key}${params[key]}`).join('');

    // Generate signature
    const sign = this.generateSignature(path, timestamp, paramsString);

    // Build URL
    const url = new URL(`${this.baseUrl}${path}`);

    // Build headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-tts-access-token': requiresAuth && accessToken ? accessToken : '',
    };

    // Build request body
    const body = {
      app_key: appKey,
      timestamp,
      sign,
      ...params,
    };

    const options: RequestInit = {
      method,
      headers,
      body: JSON.stringify(body),
    };

    const response = await fetch(url.toString(), options);
    const data = await response.json();

    if (!response.ok || data.code !== 0) {
      throw new Error(`TikTok Shop API Error: ${data.message || 'Unknown error'} (Code: ${data.code})`);
    }

    return data.data;
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
    const { refreshToken, appKey } = this.config;
    
    if (!refreshToken) {
      throw new Error('Refresh token not available');
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const sign = this.generateSignature('/api/token/refresh', timestamp, `app_key${appKey}refresh_token${refreshToken}`);

    const response = await fetch(`${this.baseUrl}/api/token/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app_key: appKey,
        timestamp,
        sign,
        refresh_token: refreshToken,
      }),
    });

    const data = await response.json();

    if (data.code !== 0) {
      throw new Error(`Token refresh failed: ${data.message}`);
    }

    // Update config
    this.config.accessToken = data.data.access_token;
    this.config.refreshToken = data.data.refresh_token;
    this.config.tokenExpiresAt = Date.now() + data.data.access_token_expire_in * 1000;
  }

  // ==========================================================================
  // AUTH API
  // ==========================================================================

  /**
   * Generate authorization URL
   */
  generateAuthUrl(redirectUri: string, state?: string): string {
    const { appKey } = this.config;
    const url = new URL(`${this.baseUrl}/oauth/authorize`);
    
    url.searchParams.append('app_key', appKey);
    url.searchParams.append('state', state || crypto.randomBytes(16).toString('hex'));
    url.searchParams.append('redirect_uri', redirectUri);

    return url.toString();
  }

  /**
   * Get access token using authorization code
   */
  async getAccessToken(authCode: string): Promise<TikTokAuthResponse> {
    const timestamp = Math.floor(Date.now() / 1000);
    const { appKey } = this.config;
    
    const params = `app_key${appKey}auth_code${authCode}`;
    const sign = this.generateSignature('/api/token/get', timestamp, params);

    const response = await fetch(`${this.baseUrl}/api/token/get`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app_key: appKey,
        timestamp,
        sign,
        auth_code: authCode,
      }),
    });

    const data = await response.json();

    if (data.code !== 0) {
      throw new Error(`Authorization failed: ${data.message}`);
    }

    // Update config
    this.config.accessToken = data.data.access_token;
    this.config.refreshToken = data.data.refresh_token;
    this.config.tokenExpiresAt = Date.now() + data.data.access_token_expire_in * 1000;

    return data.data;
  }

  // ==========================================================================
  // PRODUCT API
  // ==========================================================================

  /**
   * Get product list
   */
  async getProductList(params: {
    page_size?: number;
    page_number?: number;
    search_status?: 'ACTIVE' | 'DRAFT' | 'DELETED';
  } = {}): Promise<{ products: TikTokProduct[]; total: number }> {
    return this.request<any>(
      'POST',
      '/api/products/search',
      { page_size: 20, page_number: 1, ...params },
      true
    );
  }

  /**
   * Get product details
   */
  async getProductDetail(productId: string): Promise<TikTokProduct> {
    return this.request<any>(
      'POST',
      '/api/products/details',
      { product_id: productId },
      true
    );
  }

  /**
   * Create product
   */
  async createProduct(product: {
    title: string;
    description: string;
    category_id: string;
    brand_id?: string;
    main_images: Array<{ url: string }>;
    skus: Array<{
      seller_sku: string;
      sales_attributes?: Array<{
        attribute_id: string;
        value_id: string;
      }>;
      inventory: Array<{
        warehouse_id: string;
        quantity: number;
      }>;
      price: {
        amount: string;
        currency: string;
      };
    }>;
    package_dimensions?: {
      height: string;
      length: string;
      width: string;
      unit: 'CENTIMETER' | 'INCH';
    };
    package_weight?: {
      value: string;
      unit: 'KILOGRAM' | 'POUND';
    };
    is_cod_open?: boolean;
    delivery_option_ids?: string[];
  }): Promise<{ product_id: string }> {
    return this.request<any>(
      'POST',
      '/api/products',
      { product: product },
      true
    );
  }

  /**
   * Update product
   */
  async updateProduct(productId: string, updates: Partial<{
    title: string;
    description: string;
    main_images: Array<{ url: string }>;
  }>): Promise<void> {
    await this.request(
      'PUT',
      '/api/products',
      {
        product_id: productId,
        ...updates,
      },
      true
    );
  }

  /**
   * Delete product
   */
  async deleteProduct(productIds: string[]): Promise<void> {
    await this.request(
      'DELETE',
      '/api/products',
      { product_ids: productIds },
      true
    );
  }

  /**
   * Update stock
   */
  async updateStock(skuId: string, warehouseId: string, quantity: number): Promise<void> {
    await this.request(
      'POST',
      '/api/products/stock/update',
      {
        sku_id: skuId,
        warehouse_id: warehouseId,
        available_stock: quantity,
      },
      true
    );
  }

  /**
   * Update price
   */
  async updatePrice(skuId: string, price: { amount: string; currency: string }): Promise<void> {
    await this.request(
      'POST',
      '/api/products/prices/update',
      {
        sku_id: skuId,
        price,
      },
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
    page_size?: number;
    page_number?: number;
    order_status?: 'UNPAID' | 'ON_HOLD' | 'AWAITING_SHIPMENT' | 'AWAITING_COLLECTION' | 'IN_TRANSIT' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED';
    create_time_from?: number;
    create_time_to?: number;
  } = {}): Promise<{ orders: Array<{ id: string; order_status: string }>; total: number }> {
    return this.request<any>(
      'POST',
      '/api/orders/search',
      { page_size: 20, page_number: 1, ...params },
      true
    );
  }

  /**
   * Get order detail
   */
  async getOrderDetail(orderIds: string[]): Promise<{ orders: TikTokOrder[] }> {
    return this.request<any>(
      'POST',
      '/api/orders/detail/query',
      { order_ids: orderIds },
      true
    );
  }

  /**
   * Ship order
   */
  async shipOrder(orderId: string, params: {
    tracking_number: string;
    shipping_provider_id: string;
    pick_up_start_time?: number;
    pick_up_end_time?: number;
  }): Promise<void> {
    await this.request(
      'POST',
      '/api/fulfillment/ship',
      {
        order_id: orderId,
        ...params,
      },
      true
    );
  }

  /**
   * Cancel order
   */
  async cancelOrder(orderId: string, cancelReason: string): Promise<void> {
    await this.request(
      'POST',
      '/api/orders/cancel',
      {
        order_id: orderId,
        cancel_reason: cancelReason,
      },
      true
    );
  }

  // ==========================================================================
  // FULFILLMENT API
  // ==========================================================================

  /**
   * Get shipping providers
   */
  async getShippingProviders(): Promise<{ shipping_providers: Array<{ id: string; name: string }> }> {
    return this.request<any>(
      'POST',
      '/api/logistics/shipping_providers',
      {},
      true
    );
  }

  /**
   * Get warehouses
   */
  async getWarehouses(): Promise<{ warehouses: TikTokWarehouse[] }> {
    return this.request<any>(
      'POST',
      '/api/logistics/get_warehouse_list',
      {},
      true
    );
  }

  /**
   * Get shipping document
   */
  async getShippingDocument(orderIds: string[], documentType: 'SHIPPING_LABEL' | 'PICKING_LIST' | 'SL_PL' = 'SHIPPING_LABEL'): Promise<{ documents: Array<{ order_id: string; document_url: string }> }> {
    return this.request<any>(
      'POST',
      '/api/fulfillment/shipping_document',
      {
        order_ids: orderIds,
        document_type: documentType,
      },
      true
    );
  }

  // ==========================================================================
  // RETURNS & REFUNDS API
  // ==========================================================================

  /**
   * Get return list
   */
  async getReturnList(params: {
    page_size?: number;
    page_number?: number;
    create_time_from?: number;
    create_time_to?: number;
  } = {}): Promise<any> {
    return this.request<any>(
      'POST',
      '/api/reverse/reverse_request/list',
      { page_size: 20, page_number: 1, ...params },
      true
    );
  }

  /**
   * Approve return
   */
  async approveReturn(reverseRequestId: string): Promise<void> {
    await this.request(
      'POST',
      '/api/reverse/reverse_request/approve',
      { reverse_request_id: reverseRequestId },
      true
    );
  }

  /**
   * Reject return
   */
  async rejectReturn(reverseRequestId: string, rejectReason: string): Promise<void> {
    await this.request(
      'POST',
      '/api/reverse/reverse_request/reject',
      {
        reverse_request_id: reverseRequestId,
        reject_reason: rejectReason,
      },
      true
    );
  }

  // ==========================================================================
  // PROMOTION API
  // ==========================================================================

  /**
   * Get promotions
   */
  async getPromotions(params: {
    page_size?: number;
    page_number?: number;
    promotion_status?: 'SCHEDULED' | 'ONGOING' | 'EXPIRED';
  } = {}): Promise<{ promotions: TikTokPromotion[]; total: number }> {
    return this.request<any>(
      'POST',
      '/api/promotions/search',
      { page_size: 20, page_number: 1, ...params },
      true
    );
  }

  /**
   * Create promotion
   */
  async createPromotion(promotion: {
    title: string;
    type: 'FLASH_SALE' | 'DISCOUNT' | 'BUNDLE' | 'FREE_SHIPPING';
    start_time: number;
    end_time: number;
    applicable_products: Array<{
      product_id: string;
      sku_id?: string;
      discount_value: string;
      discount_type: 'PERCENTAGE' | 'FIXED_AMOUNT';
    }>;
  }): Promise<{ promotion_id: string }> {
    return this.request<any>(
      'POST',
      '/api/promotions',
      { promotion },
      true
    );
  }

  // ==========================================================================
  // SELLER API
  // ==========================================================================

  /**
   * Get seller info
   */
  async getSellerInfo(): Promise<any> {
    return this.request<any>(
      'POST',
      '/api/seller/get_seller',
      {},
      true
    );
  }

  /**
   * Get shop info
   */
  async getShopInfo(): Promise<any> {
    return this.request<any>(
      'POST',
      '/api/shop/get_shop',
      {},
      true
    );
  }

  // ==========================================================================
  // CREATOR & AFFILIATE API
  // ==========================================================================

  /**
   * Get creator list
   */
  async getCreatorList(params: {
    page_size?: number;
    page_number?: number;
  } = {}): Promise<any> {
    return this.request<any>(
      'POST',
      '/api/affiliate/creator_list',
      { page_size: 20, page_number: 1, ...params },
      true
    );
  }

  /**
   * Invite creator
   */
  async inviteCreator(creatorId: string, productIds: string[], commissionRate: string): Promise<void> {
    await this.request(
      'POST',
      '/api/affiliate/creator_invite',
      {
        creator_id: creatorId,
        product_ids: productIds,
        commission_rate: commissionRate,
      },
      true
    );
  }

  /**
   * Get open product list (products open for creators)
   */
  async getOpenProductList(params: {
    page_size?: number;
    page_number?: number;
  } = {}): Promise<any> {
    return this.request<any>(
      'POST',
      '/api/affiliate/open_product_list',
      { page_size: 20, page_number: 1, ...params },
      true
    );
  }

  // ==========================================================================
  // ANALYTICS API
  // ==========================================================================

  /**
   * Get shop performance
   */
  async getShopPerformance(params: {
    start_date: string; // YYYY-MM-DD
    end_date: string;
  }): Promise<any> {
    return this.request<any>(
      'POST',
      '/api/analytics/shop_performance',
      params,
      true
    );
  }

  /**
   * Get product performance
   */
  async getProductPerformance(productIds: string[], params: {
    start_date: string;
    end_date: string;
  }): Promise<any> {
    return this.request<any>(
      'POST',
      '/api/analytics/product_performance',
      {
        product_ids: productIds,
        ...params,
      },
      true
    );
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Create TikTok Shop client instance
 */
export function createTikTokShopClient(config: TikTokShopConfig): TikTokShopClient {
  return new TikTokShopClient(config);
}

/**
 * Verify TikTok Shop webhook signature
 */
export function verifyTikTokWebhook(body: string, timestamp: string, signature: string, appSecret: string): boolean {
  const signString = `${timestamp}${body}`;
  const expectedSign = crypto
    .createHmac('sha256', appSecret)
    .update(signString)
    .digest('hex');

  return signature === expectedSign;
}
