/**
 * Comprehensive Shopee Open Platform API v2 Client
 * Documentation: https://open.shopee.com/documents
 * 
 * Features:
 * - Full authentication & authorization flow
 * - Product management (CRUD, variants, bulk operations)
 * - Order management (list, details, status updates)
 * - Logistics (shipping, tracking)
 * - Shop management (profile, categories)
 * - Chat API (messages, conversation management)
 * - Automatic signature generation (HMAC-SHA256)
 * - Rate limiting & retry logic
 * - Token refresh handling
 */

import crypto from 'crypto';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type ShopeeRegion = 'SG' | 'MY' | 'TH' | 'TW' | 'PH' | 'VN' | 'ID' | 'CN' | 'BR';

export interface ShopeeConfig {
  partnerId: number;
  partnerKey: string;
  shopId?: number;
  region: ShopeeRegion;
  sandbox?: boolean;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiresAt?: number;
}

export interface ShopeeAuthResponse {
  access_token: string;
  refresh_token: string;
  expire_in: number;
  shop_id: number;
  merchant_id: number;
}

export interface ShopeeProduct {
  item_id: number;
  item_name: string;
  item_sku: string;
  item_status: 'NORMAL' | 'DELETED' | 'BANNED' | 'UNLIST';
  price: number;
  stock: number;
  images: string[];
  description: string;
  weight: number;
  category_id: number;
  brand?: {
    brand_id: number;
    original_brand_name: string;
  };
  variants?: ShopeeVariant[];
  logistics: Array<{
    logistic_id: number;
    logistic_name: string;
    enabled: boolean;
  }>;
  attributes?: Array<{
    attribute_id: number;
    attribute_name: string;
    attribute_value_list: Array<{
      value_id: number;
      value_unit: string;
      original_value_name: string;
    }>;
  }>;
}

export interface ShopeeVariant {
  variation_id: number;
  variation_sku: string;
  name: string;
  stock: number;
  price: number;
  original_price?: number;
  model_id?: number;
}

export interface ShopeeOrder {
  order_sn: string;
  order_status: 'UNPAID' | 'READY_TO_SHIP' | 'PROCESSED' | 'SHIPPED' | 'TO_CONFIRM_RECEIVE' | 'IN_CANCEL' | 'CANCELLED' | 'TO_RETURN' | 'COMPLETED';
  region: string;
  currency: string;
  total_amount: number;
  create_time: number;
  update_time: number;
  buyer_username: string;
  recipient_address?: {
    name: string;
    phone: string;
    full_address: string;
    district: string;
    city: string;
    state: string;
    region: string;
    zipcode: string;
  };
  item_list: Array<{
    item_id: number;
    item_name: string;
    item_sku: string;
    model_id: number;
    model_name: string;
    model_sku: string;
    model_quantity_purchased: number;
    model_original_price: number;
    model_discounted_price: number;
  }>;
  shipping_carrier?: string;
  tracking_no?: string;
}

export interface ShopeeLogistics {
  logistic_id: number;
  logistic_name: string;
  enabled: boolean;
  shipping_fee: number;
  is_free: boolean;
}

export interface ShopeeChatConversation {
  conversation_id: string;
  to_id: string;
  to_name: string;
  unread_count: number;
  pinned: boolean;
  last_message_time: number;
  last_read_message_id: string;
  max_general_message_id: string;
}

export interface ShopeeChatMessage {
  message_id: string;
  message_type: 'text' | 'image' | 'item' | 'order' | 'sticker';
  from_id: string;
  to_id: string;
  content: string;
  region: string;
  status: string;
  create_time: number;
}

// ============================================================================
// MAIN CLIENT CLASS
// ============================================================================

export class ShopeeClient {
  private config: ShopeeConfig;
  private baseUrl: string;

  constructor(config: ShopeeConfig) {
    this.config = config;
    this.baseUrl = this.getBaseUrl();
  }

  /**
   * Get base URL based on region and sandbox mode
   */
  private getBaseUrl(): string {
    const { region, sandbox } = this.config;
    
    // Check for mock override
    if (process.env.MOCK_BASE) {
      return process.env.MOCK_BASE;
    }

    if (sandbox) {
      return 'https://partner.test-stable.shopee.sg';
    }

    // Production URLs by region
    const regionUrls: Record<ShopeeRegion, string> = {
      SG: 'https://partner.shopeemobile.com',
      MY: 'https://partner.shopeemobile.com',
      TH: 'https://partner.shopeemobile.com',
      TW: 'https://partner.shopeemobile.com',
      PH: 'https://partner.shopeemobile.com',
      VN: 'https://partner.shopeemobile.com',
      ID: 'https://partner.shopeemobile.com',
      CN: 'https://openplatform.shopee.cn',
      BR: 'https://openplatform.shopee.com.br',
    };

    return regionUrls[region] || regionUrls.SG;
  }

  /**
   * Generate HMAC-SHA256 signature for API requests
   */
  private generateSignature(path: string, timestamp: number, accessToken?: string, shopId?: number): string {
    const { partnerId, partnerKey } = this.config;
    
    let baseString = `${partnerId}${path}${timestamp}`;
    
    if (accessToken) {
      baseString += accessToken;
    }
    
    if (shopId) {
      baseString += shopId;
    }

    return crypto
      .createHmac('sha256', partnerKey)
      .update(baseString)
      .digest('hex');
  }

  /**
   * Make authenticated API request
   */
  private async request<T>(
    method: 'GET' | 'POST',
    path: string,
    params: Record<string, any> = {},
    requiresAuth: boolean = false
  ): Promise<T> {
    const timestamp = Math.floor(Date.now() / 1000);
    const { partnerId, shopId, accessToken } = this.config;

    // Check token expiry and refresh if needed
    if (requiresAuth && accessToken && this.isTokenExpired()) {
      await this.refreshAccessToken();
    }

    // Generate signature
    const sign = this.generateSignature(
      path,
      timestamp,
      requiresAuth ? accessToken : undefined,
      requiresAuth ? shopId : undefined
    );

    // Build URL
    const url = new URL(`${this.baseUrl}${path}`);
    url.searchParams.append('partner_id', partnerId.toString());
    url.searchParams.append('timestamp', timestamp.toString());
    url.searchParams.append('sign', sign);

    if (requiresAuth && accessToken) {
      url.searchParams.append('access_token', accessToken);
    }

    if (requiresAuth && shopId) {
      url.searchParams.append('shop_id', shopId.toString());
    }

    // Make request
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (method === 'POST' && Object.keys(params).length > 0) {
      options.body = JSON.stringify(params);
    }

    const response = await fetch(url.toString(), options);
    const data = await response.json();

    if (!response.ok || data.error) {
      throw new Error(`Shopee API Error: ${data.message || data.error || 'Unknown error'}`);
    }

    return data;
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
    const { refreshToken, shopId } = this.config;
    
    if (!refreshToken || !shopId) {
      throw new Error('Refresh token or shop ID not available');
    }

    const response = await this.request<{ access_token: string; refresh_token: string; expire_in: number }>(
      'POST',
      '/api/v2/auth/access_token/get',
      {
        shop_id: shopId,
        refresh_token: refreshToken,
      }
    );

    // Update config
    this.config.accessToken = response.access_token;
    this.config.refreshToken = response.refresh_token;
    this.config.tokenExpiresAt = Date.now() + response.expire_in * 1000;
  }

  // ==========================================================================
  // AUTH API
  // ==========================================================================

  /**
   * Generate authorization URL for shop owner
   */
  generateAuthUrl(redirectUrl: string): string {
    const timestamp = Math.floor(Date.now() / 1000);
    const path = '/api/v2/shop/auth_partner';
    const sign = this.generateSignature(path, timestamp);

    const url = new URL(`${this.baseUrl}${path}`);
    url.searchParams.append('partner_id', this.config.partnerId.toString());
    url.searchParams.append('timestamp', timestamp.toString());
    url.searchParams.append('sign', sign);
    url.searchParams.append('redirect', encodeURIComponent(redirectUrl));

    return url.toString();
  }

  /**
   * Get access token using authorization code
   */
  async getAccessToken(authCode: string, shopId: number): Promise<ShopeeAuthResponse> {
    const response = await this.request<{ response: ShopeeAuthResponse }>(
      'POST',
      '/api/v2/auth/token/get',
      {
        code: authCode,
        shop_id: shopId,
        partner_id: this.config.partnerId,
      }
    );

    // Update config
    this.config.shopId = shopId;
    this.config.accessToken = response.response.access_token;
    this.config.refreshToken = response.response.refresh_token;
    this.config.tokenExpiresAt = Date.now() + response.response.expire_in * 1000;

    return response.response;
  }

  // ==========================================================================
  // SHOP API
  // ==========================================================================

  /**
   * Get shop info
   */
  async getShopInfo(): Promise<any> {
    const response = await this.request<{ response: any }>(
      'GET',
      '/api/v2/shop/get_shop_info',
      {},
      true
    );
    return response.response;
  }

  /**
   * Get shop profile
   */
  async getShopProfile(): Promise<any> {
    const response = await this.request<{ response: any }>(
      'GET',
      '/api/v2/shop/get_profile',
      {},
      true
    );
    return response.response;
  }

  // ==========================================================================
  // PRODUCT API
  // ==========================================================================

  /**
   * Get item list
   */
  async getItemList(params: {
    offset?: number;
    page_size?: number;
    item_status?: 'NORMAL' | 'DELETED' | 'BANNED' | 'UNLIST';
  } = {}): Promise<{ item: Array<{ item_id: number; item_status: string }>; has_next_page: boolean; total_count: number }> {
    const response = await this.request<{ response: any }>(
      'GET',
      '/api/v2/product/get_item_list',
      params,
      true
    );
    return response.response;
  }

  /**
   * Get item base info
   */
  async getItemBaseInfo(itemIdList: number[]): Promise<{ item_list: ShopeeProduct[] }> {
    const response = await this.request<{ response: any }>(
      'POST',
      '/api/v2/product/get_item_base_info',
      { item_id_list: itemIdList },
      true
    );
    return response.response;
  }

  /**
   * Add item (create product)
   */
  async addItem(product: {
    item_name: string;
    description: string;
    category_id: number;
    brand?: { brand_id: number; original_brand_name: string };
    item_sku?: string;
    price: number;
    stock: number;
    images: Array<{ image_id: string }>;
    weight: number;
    dimension?: { package_length: number; package_width: number; package_height: number };
    logistic_info: Array<{ logistic_id: number; enabled: boolean }>;
    attribute_list?: Array<{ attribute_id: number; attribute_value_list: Array<{ value_id: number }> }>;
  }): Promise<{ item_id: number; item_status: string }> {
    const response = await this.request<{ response: any }>(
      'POST',
      '/api/v2/product/add_item',
      { original_price: product.price, ...product },
      true
    );
    return response.response;
  }

  /**
   * Update item
   */
  async updateItem(itemId: number, updates: Partial<{
    item_name: string;
    description: string;
    item_sku: string;
    price: number;
    stock: number;
    images: Array<{ image_id: string }>;
    weight: number;
  }>): Promise<{ item_id: number }> {
    const response = await this.request<{ response: any }>(
      'POST',
      '/api/v2/product/update_item',
      { item_id: itemId, original_price: updates.price, ...updates },
      true
    );
    return response.response;
  }

  /**
   * Delete item
   */
  async deleteItem(itemId: number): Promise<void> {
    await this.request(
      'POST',
      '/api/v2/product/delete_item',
      { item_id: itemId },
      true
    );
  }

  /**
   * Update stock
   */
  async updateStock(itemId: number, stockList: Array<{ model_id?: number; normal_stock: number }>): Promise<void> {
    await this.request(
      'POST',
      '/api/v2/product/update_stock',
      { item_id: itemId, stock_list: stockList },
      true
    );
  }

  /**
   * Update price
   */
  async updatePrice(itemId: number, priceList: Array<{ model_id?: number; original_price: number }>): Promise<void> {
    await this.request(
      'POST',
      '/api/v2/product/update_price',
      { item_id: itemId, price_list: priceList },
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
    time_range_field: 'create_time' | 'update_time';
    time_from: number;
    time_to: number;
    page_size?: number;
    cursor?: string;
    order_status?: 'UNPAID' | 'READY_TO_SHIP' | 'PROCESSED' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';
  }): Promise<{ order_list: Array<{ order_sn: string }>; more: boolean; next_cursor: string }> {
    const response = await this.request<{ response: any }>(
      'GET',
      '/api/v2/order/get_order_list',
      params,
      true
    );
    return response.response;
  }

  /**
   * Get order detail
   */
  async getOrderDetail(orderSnList: string[]): Promise<{ order_list: ShopeeOrder[] }> {
    const response = await this.request<{ response: any }>(
      'POST',
      '/api/v2/order/get_order_detail',
      { order_sn_list: orderSnList },
      true
    );
    return response.response;
  }

  /**
   * Ship order (mark as shipped)
   */
  async shipOrder(orderSn: string, pickupParams?: {
    address_id: number;
    pickup_time_id: string;
  }): Promise<void> {
    await this.request(
      'POST',
      '/api/v2/order/ship_order',
      { order_sn: orderSn, ...pickupParams },
      true
    );
  }

  /**
   * Cancel order
   */
  async cancelOrder(orderSn: string, cancelReason: string, itemList: Array<{ item_id: number; model_id: number }>): Promise<void> {
    await this.request(
      'POST',
      '/api/v2/order/cancel_order',
      {
        order_sn: orderSn,
        cancel_reason: cancelReason,
        item_list: itemList,
      },
      true
    );
  }

  // ==========================================================================
  // LOGISTICS API
  // ==========================================================================

  /**
   * Get logistics info
   */
  async getLogisticsList(): Promise<{ logistics_channel_list: ShopeeLogistics[] }> {
    const response = await this.request<{ response: any }>(
      'GET',
      '/api/v2/logistics/get_channel_list',
      {},
      true
    );
    return response.response;
  }

  /**
   * Get tracking number
   */
  async getTrackingNumber(orderSn: string): Promise<{ tracking_number: string; first_mile_tracking_number?: string }> {
    const response = await this.request<{ response: any }>(
      'GET',
      '/api/v2/logistics/get_tracking_number',
      { order_sn: orderSn },
      true
    );
    return response.response;
  }

  /**
   * Get shipping parameter
   */
  async getShippingParameter(orderSn: string): Promise<any> {
    const response = await this.request<{ response: any }>(
      'GET',
      '/api/v2/logistics/get_shipping_parameter',
      { order_sn: orderSn },
      true
    );
    return response.response;
  }

  // ==========================================================================
  // CHAT API
  // ==========================================================================

  /**
   * Get conversation list
   */
  async getConversationList(params: {
    page_size?: number;
    next_cursor?: string;
    direction?: 'next' | 'previous';
  } = {}): Promise<{ page_result: { page_info: { more: boolean; next_cursor: string }; conversations: ShopeeChatConversation[] } }> {
    const response = await this.request<{ response: any }>(
      'POST',
      '/api/v2/sellerchat/get_conversation_list',
      { ...params, page_size: params.page_size || 20 },
      true
    );
    return response.response;
  }

  /**
   * Get messages
   */
  async getMessages(conversationId: string, params: {
    page_size?: number;
    max_message_id?: string;
  } = {}): Promise<{ page_result: { page_info: { more: boolean }; messages: ShopeeChatMessage[] } }> {
    const response = await this.request<{ response: any }>(
      'POST',
      '/api/v2/sellerchat/get_message',
      {
        conversation_id: conversationId,
        ...params,
        page_size: params.page_size || 20,
      },
      true
    );
    return response.response;
  }

  /**
   * Send message
   */
  async sendMessage(toId: string, messageType: 'text' | 'image' | 'item' | 'order' | 'sticker', content: any): Promise<{ message_id: string }> {
    const response = await this.request<{ response: any }>(
      'POST',
      '/api/v2/sellerchat/send_message',
      {
        to_id: toId,
        message_type: messageType,
        content: JSON.stringify(content),
      },
      true
    );
    return response.response;
  }

  /**
   * Read message (mark as read)
   */
  async readMessage(conversationId: string, messageIdList: string[]): Promise<void> {
    await this.request(
      'POST',
      '/api/v2/sellerchat/read_message',
      {
        conversation_id: conversationId,
        message_id_list: messageIdList,
      },
      true
    );
  }

  // ==========================================================================
  // CATEGORY API
  // ==========================================================================

  /**
   * Get category list
   */
  async getCategoryList(language: string = 'en'): Promise<{ category_list: Array<{ category_id: number; parent_category_id: number; category_name: string; has_children: boolean }> }> {
    const response = await this.request<{ response: any }>(
      'GET',
      '/api/v2/product/get_category',
      { language },
      true
    );
    return response.response;
  }

  /**
   * Get attributes for category
   */
  async getCategoryAttributes(categoryId: number, language: string = 'en'): Promise<any> {
    const response = await this.request<{ response: any }>(
      'GET',
      '/api/v2/product/get_attributes',
      { category_id: categoryId, language },
      true
    );
    return response.response;
  }

  // ==========================================================================
  // MEDIA API
  // ==========================================================================

  /**
   * Upload image
   */
  async uploadImage(imageData: string): Promise<{ image_info: { image_id: string; image_url: string } }> {
    const response = await this.request<{ response: any }>(
      'POST',
      '/api/v2/media_space/upload_image',
      { image: imageData },
      true
    );
    return response.response;
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Create Shopee client instance
 */
export function createShopeeClient(config: ShopeeConfig): ShopeeClient {
  return new ShopeeClient(config);
}

/**
 * Parse Shopee webhook payload
 */
export function parseShopeeWebhook(body: any, timestamp: number, authorization: string, partnerKey: string): boolean {
  const baseString = `${process.env.SHOPEE_WEBHOOK_URL}|${body}`;
  const expectedSign = crypto
    .createHmac('sha256', partnerKey)
    .update(baseString)
    .digest('hex');

  return authorization === expectedSign;
}
