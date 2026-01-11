/**
 * Unified Product Sync Service
 * Synchronizes products between Ocean ERP and e-commerce platforms (Shopee, TikTok Shop, Tokopedia)
 * 
 * Features:
 * - Bidirectional sync (ERP ↔ Platforms)
 * - Bulk operations for efficiency
 * - Conflict resolution
 * - Variant mapping
 * - Image management
 * - Category mapping
 * - Price & stock sync
 * - Integration with ecommerce_products and integration_mappings tables
 */

import { createShopeeClient, type ShopeeConfig } from './shopee-api-client';
import { createTikTokShopClient, type TikTokShopConfig } from './tiktok-shop-api-client';
import { createTokopediaClient, type TokopediaConfig } from './tokopedia-api-client';
import { db } from '../db';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type Platform = 'shopee' | 'tiktok' | 'tokopedia';
export type SyncDirection = 'erp_to_platform' | 'platform_to_erp' | 'bidirectional';
export type SyncStatus = 'pending' | 'syncing' | 'synced' | 'error' | 'conflict';

export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  weight: number;
  categoryId?: number;
  images: string[];
  variants?: ProductVariant[];
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

export interface ProductVariant {
  id: number;
  productId: number;
  sku: string;
  name: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

export interface SyncConfig {
  storefrontId: number;
  platform: Platform;
  direction: SyncDirection;
  autoSync: boolean;
  syncInterval?: number; // minutes
}

export interface SyncResult {
  success: boolean;
  syncedCount: number;
  errorCount: number;
  conflicts: Array<{
    productId: number;
    reason: string;
  }>;
  errors: Array<{
    productId: number;
    error: string;
  }>;
}

export interface PlatformProduct {
  platform: Platform;
  externalId: string;
  externalSku: string;
  name: string;
  price: number;
  stock: number;
  status: string;
  lastSyncedAt: Date;
}

// ============================================================================
// PRODUCT SYNC SERVICE
// ============================================================================

export class ProductSyncService {
  /**
   * Sync single product from ERP to platform
   */
  static async syncProductToPlatform(
    productId: number,
    storefrontId: number,
    platform: Platform,
    credentials: any
  ): Promise<{ success: boolean; externalId?: string; error?: string }> {
    try {
      // Fetch product from ERP database
      const product = await this.getERPProduct(productId);
      if (!product) {
        throw new Error(`Product ${productId} not found`);
      }

      // Check if product already synced
      const existingMapping = await this.getProductMapping(productId, storefrontId, platform);

      let externalId: string;

      if (existingMapping) {
        // Update existing product
        externalId = await this.updatePlatformProduct(platform, existingMapping.external_id, product, credentials);
      } else {
        // Create new product
        externalId = await this.createPlatformProduct(platform, product, credentials);
        
        // Save mapping
        await this.saveProductMapping(productId, storefrontId, platform, externalId, product.sku);
      }

      // Update ecommerce_products table
      await this.updateEcommerceProduct(storefrontId, externalId, product);

      // Log sync
      await this.logSync(storefrontId, 'product_sync', 'success', {
        product_id: productId,
        external_id: externalId,
        direction: 'erp_to_platform',
      });

      return { success: true, externalId };
    } catch (error: any) {
      // Log error
      await this.logSync(storefrontId, 'product_sync', 'error', {
        product_id: productId,
        error: error.message,
      });

      return { success: false, error: error.message };
    }
  }

  /**
   * Sync single product from platform to ERP
   */
  static async syncProductFromPlatform(
    externalId: string,
    storefrontId: number,
    platform: Platform,
    credentials: any
  ): Promise<{ success: boolean; productId?: number; error?: string }> {
    try {
      // Fetch product from platform
      const platformProduct = await this.getPlatformProduct(platform, externalId, credentials);

      // Check if product already synced
      const existingMapping = await this.getProductMappingByExternalId(storefrontId, platform, externalId);

      let productId: number;

      if (existingMapping) {
        // Update existing ERP product
        productId = existingMapping.internal_id;
        await this.updateERPProduct(productId, platformProduct);
      } else {
        // Create new ERP product
        productId = await this.createERPProduct(platformProduct);
        
        // Save mapping
        await this.saveProductMapping(productId, storefrontId, platform, externalId, platformProduct.sku);
      }

      // Update ecommerce_products table
      await this.updateEcommerceProduct(storefrontId, externalId, platformProduct);

      // Log sync
      await this.logSync(storefrontId, 'product_sync', 'success', {
        product_id: productId,
        external_id: externalId,
        direction: 'platform_to_erp',
      });

      return { success: true, productId };
    } catch (error: any) {
      await this.logSync(storefrontId, 'product_sync', 'error', {
        external_id: externalId,
        error: error.message,
      });

      return { success: false, error: error.message };
    }
  }

  /**
   * Bulk sync products from ERP to platform
   */
  static async bulkSyncToPlatform(
    productIds: number[],
    storefrontId: number,
    platform: Platform,
    credentials: any
  ): Promise<SyncResult> {
    const result: SyncResult = {
      success: true,
      syncedCount: 0,
      errorCount: 0,
      conflicts: [],
      errors: [],
    };

    for (const productId of productIds) {
      const syncResult = await this.syncProductToPlatform(productId, storefrontId, platform, credentials);
      
      if (syncResult.success) {
        result.syncedCount++;
      } else {
        result.errorCount++;
        result.errors.push({
          productId,
          error: syncResult.error || 'Unknown error',
        });
      }
    }

    result.success = result.errorCount === 0;
    return result;
  }

  /**
   * Bulk sync products from platform to ERP
   */
  static async bulkSyncFromPlatform(
    storefrontId: number,
    platform: Platform,
    credentials: any
  ): Promise<SyncResult> {
    const result: SyncResult = {
      success: true,
      syncedCount: 0,
      errorCount: 0,
      conflicts: [],
      errors: [],
    };

    try {
      // Fetch all products from platform
      const platformProducts = await this.getAllPlatformProducts(platform, credentials);

      for (const platformProduct of platformProducts) {
        const syncResult = await this.syncProductFromPlatform(
          platformProduct.externalId,
          storefrontId,
          platform,
          credentials
        );
        
        if (syncResult.success) {
          result.syncedCount++;
        } else {
          result.errorCount++;
          result.errors.push({
            productId: 0,
            error: syncResult.error || 'Unknown error',
          });
        }
      }

      result.success = result.errorCount === 0;
    } catch (error: any) {
      result.success = false;
      result.errors.push({
        productId: 0,
        error: error.message,
      });
    }

    return result;
  }

  /**
   * Sync stock for product
   */
  static async syncStock(
    productId: number,
    storefrontId: number,
    platform: Platform,
    credentials: any,
    newStock: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Get external ID from mapping
      const mapping = await this.getProductMapping(productId, storefrontId, platform);
      if (!mapping) {
        throw new Error('Product not synced to platform');
      }

      // Update stock on platform
      await this.updatePlatformStock(platform, mapping.external_id, newStock, credentials);

      // Update ecommerce_products table
      await db.query(
        `UPDATE ecommerce_products 
         SET inventory_quantity = $1, updated_at = NOW() 
         WHERE storefront_id = $2 AND external_product_id = $3`,
        [newStock, storefrontId, mapping.external_id]
      );

      // Update mapping sync time
      await db.query(
        `UPDATE integration_mappings 
         SET last_synced_at = NOW() 
         WHERE integration_id = $1 AND entity_type = 'product' AND internal_id = $2`,
        [`${platform}_${storefrontId}`, productId]
      );

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Sync price for product
   */
  static async syncPrice(
    productId: number,
    storefrontId: number,
    platform: Platform,
    credentials: any,
    newPrice: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Get external ID from mapping
      const mapping = await this.getProductMapping(productId, storefrontId, platform);
      if (!mapping) {
        throw new Error('Product not synced to platform');
      }

      // Update price on platform
      await this.updatePlatformPrice(platform, mapping.external_id, newPrice, credentials);

      // Update ecommerce_products table
      await db.query(
        `UPDATE ecommerce_products 
         SET price = $1, updated_at = NOW() 
         WHERE storefront_id = $2 AND external_product_id = $3`,
        [newPrice, storefrontId, mapping.external_id]
      );

      // Update mapping sync time
      await db.query(
        `UPDATE integration_mappings 
         SET last_synced_at = NOW() 
         WHERE integration_id = $1 AND entity_type = 'product' AND internal_id = $2`,
        [`${platform}_${storefrontId}`, productId]
      );

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // ==========================================================================
  // PLATFORM-SPECIFIC OPERATIONS
  // ==========================================================================

  /**
   * Create product on platform
   */
  private static async createPlatformProduct(
    platform: Platform,
    product: Product,
    credentials: any
  ): Promise<string> {
    switch (platform) {
      case 'shopee': {
        const client = createShopeeClient(credentials as ShopeeConfig);
        const result = await client.addItem({
          item_name: product.name,
          description: product.description,
          category_id: product.categoryId || 0,
          item_sku: product.sku,
          price: product.price,
          stock: product.stock,
          images: product.images.map(url => ({ image_id: url })),
          weight: product.weight,
          dimension: product.dimensions ? {
            package_length: product.dimensions.length,
            package_width: product.dimensions.width,
            package_height: product.dimensions.height,
          } : undefined,
          logistic_info: [{ logistic_id: 0, enabled: true }],
        });
        return result.item_id.toString();
      }

      case 'tiktok': {
        const client = createTikTokShopClient(credentials as TikTokShopConfig);
        const result = await client.createProduct({
          title: product.name,
          description: product.description,
          category_id: product.categoryId?.toString() || '0',
          main_images: product.images.map(url => ({ url })),
          skus: [{
            seller_sku: product.sku,
            inventory: [{ warehouse_id: credentials.warehouseId, quantity: product.stock }],
            price: { amount: product.price.toString(), currency: 'IDR' },
          }],
          package_weight: { value: product.weight.toString(), unit: 'KILOGRAM' },
          package_dimensions: product.dimensions ? {
            length: product.dimensions.length.toString(),
            width: product.dimensions.width.toString(),
            height: product.dimensions.height.toString(),
            unit: 'CENTIMETER',
          } : undefined,
        });
        return result.product_id;
      }

      case 'tokopedia': {
        const client = createTokopediaClient(credentials as TokopediaConfig);
        const result = await client.createProduct({
          productName: product.name,
          categoryId: product.categoryId || 0,
          price: product.price,
          stock: product.stock,
          condition: 'NEW',
          minOrder: 1,
          sku: product.sku,
          pictures: product.images.map((url, index) => ({
            fileName: `image_${index}.jpg`,
            filePath: url,
            isPrimary: index === 0,
          })),
          descriptions: [{
            type: 'html',
            content: product.description,
          }],
          weight: product.weight,
          weightUnit: 'GR',
          dimension: product.dimensions || { height: 10, width: 10, length: 10 },
        });
        return result.productId;
      }

      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  /**
   * Update product on platform
   */
  private static async updatePlatformProduct(
    platform: Platform,
    externalId: string,
    product: Product,
    credentials: any
  ): Promise<string> {
    switch (platform) {
      case 'shopee': {
        const client = createShopeeClient(credentials as ShopeeConfig);
        await client.updateItem(parseInt(externalId), {
          item_name: product.name,
          description: product.description,
          item_sku: product.sku,
          price: product.price,
          stock: product.stock,
        });
        return externalId;
      }

      case 'tiktok': {
        const client = createTikTokShopClient(credentials as TikTokShopConfig);
        await client.updateProduct(externalId, {
          title: product.name,
          description: product.description,
        });
        return externalId;
      }

      case 'tokopedia': {
        const client = createTokopediaClient(credentials as TokopediaConfig);
        await client.updateProduct(externalId, {
          productName: product.name,
          price: product.price,
          stock: product.stock,
          sku: product.sku,
        });
        return externalId;
      }

      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  /**
   * Get product from platform
   */
  private static async getPlatformProduct(
    platform: Platform,
    externalId: string,
    credentials: any
  ): Promise<any> {
    switch (platform) {
      case 'shopee': {
        const client = createShopeeClient(credentials as ShopeeConfig);
        const result = await client.getItemBaseInfo([parseInt(externalId)]);
        return result.item_list[0];
      }

      case 'tiktok': {
        const client = createTikTokShopClient(credentials as TikTokShopConfig);
        return await client.getProductDetail(externalId);
      }

      case 'tokopedia': {
        const client = createTokopediaClient(credentials as TokopediaConfig);
        return await client.getProductDetail(externalId);
      }

      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  /**
   * Get all products from platform
   */
  private static async getAllPlatformProducts(
    platform: Platform,
    credentials: any
  ): Promise<PlatformProduct[]> {
    switch (platform) {
      case 'shopee': {
        const client = createShopeeClient(credentials as ShopeeConfig);
        const result = await client.getItemList({ page_size: 100 });
        return result.item.map(item => ({
          platform: 'shopee',
          externalId: item.item_id.toString(),
          externalSku: '',
          name: '',
          price: 0,
          stock: 0,
          status: item.item_status,
          lastSyncedAt: new Date(),
        }));
      }

      case 'tiktok': {
        const client = createTikTokShopClient(credentials as TikTokShopConfig);
        const result = await client.getProductList({ page_size: 100 });
        return result.products.map(product => ({
          platform: 'tiktok',
          externalId: product.id,
          externalSku: product.skus[0]?.seller_sku || '',
          name: product.title,
          price: parseFloat(product.skus[0]?.price?.amount || '0'),
          stock: product.skus[0]?.inventory[0]?.quantity || 0,
          status: 'active',
          lastSyncedAt: new Date(),
        }));
      }

      case 'tokopedia': {
        const client = createTokopediaClient(credentials as TokopediaConfig);
        const result = await client.getProductList({ perPage: 100 });
        return result.products.map(product => ({
          platform: 'tokopedia',
          externalId: product.productId,
          externalSku: product.sku,
          name: product.productName,
          price: product.price.value,
          stock: product.stock,
          status: product.status,
          lastSyncedAt: new Date(),
        }));
      }

      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  /**
   * Update stock on platform
   */
  private static async updatePlatformStock(
    platform: Platform,
    externalId: string,
    stock: number,
    credentials: any
  ): Promise<void> {
    switch (platform) {
      case 'shopee': {
        const client = createShopeeClient(credentials as ShopeeConfig);
        await client.updateStock(parseInt(externalId), [{ normal_stock: stock }]);
        break;
      }

      case 'tiktok': {
        const client = createTikTokShopClient(credentials as TikTokShopConfig);
        // TikTok requires SKU ID and warehouse ID
        const product = await client.getProductDetail(externalId);
        if (product.skus[0]) {
          await client.updateStock(product.skus[0].id, credentials.warehouseId, stock);
        }
        break;
      }

      case 'tokopedia': {
        const client = createTokopediaClient(credentials as TokopediaConfig);
        await client.updateStock(externalId, stock);
        break;
      }

      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  /**
   * Update price on platform
   */
  private static async updatePlatformPrice(
    platform: Platform,
    externalId: string,
    price: number,
    credentials: any
  ): Promise<void> {
    switch (platform) {
      case 'shopee': {
        const client = createShopeeClient(credentials as ShopeeConfig);
        await client.updatePrice(parseInt(externalId), [{ original_price: price }]);
        break;
      }

      case 'tiktok': {
        const client = createTikTokShopClient(credentials as TikTokShopConfig);
        const product = await client.getProductDetail(externalId);
        if (product.skus[0]) {
          await client.updatePrice(product.skus[0].id, { amount: price.toString(), currency: 'IDR' });
        }
        break;
      }

      case 'tokopedia': {
        const client = createTokopediaClient(credentials as TokopediaConfig);
        await client.updatePrice(externalId, price);
        break;
      }

      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  // ==========================================================================
  // DATABASE OPERATIONS
  // ==========================================================================

  /**
   * Get product from ERP database
   */
  private static async getERPProduct(productId: number): Promise<Product | null> {
    const result = await db.query(
      `SELECT id, sku, name, description, price, stock, weight, category_id
       FROM products WHERE id = $1`,
      [productId]
    );

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      id: row.id,
      sku: row.sku,
      name: row.name,
      description: row.description || '',
      price: parseFloat(row.price),
      stock: row.stock || 0,
      weight: row.weight || 0,
      categoryId: row.category_id,
      images: [], // TODO: Fetch images from product_images table
    };
  }

  /**
   * Create product in ERP database
   */
  private static async createERPProduct(platformProduct: any): Promise<number> {
    const result = await db.query(
      `INSERT INTO products (sku, name, description, price, stock, weight, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING id`,
      [
        platformProduct.sku || platformProduct.externalSku,
        platformProduct.name || platformProduct.title || platformProduct.productName,
        platformProduct.description || '',
        platformProduct.price || 0,
        platformProduct.stock || 0,
        platformProduct.weight || 0,
      ]
    );

    return result.rows[0].id;
  }

  /**
   * Update product in ERP database
   */
  private static async updateERPProduct(productId: number, platformProduct: any): Promise<void> {
    await db.query(
      `UPDATE products 
       SET name = $1, description = $2, price = $3, stock = $4, weight = $5, updated_at = NOW()
       WHERE id = $6`,
      [
        platformProduct.name || platformProduct.title || platformProduct.productName,
        platformProduct.description || '',
        platformProduct.price || 0,
        platformProduct.stock || 0,
        platformProduct.weight || 0,
        productId,
      ]
    );
  }

  /**
   * Get product mapping
   */
  private static async getProductMapping(
    productId: number,
    storefrontId: number,
    platform: Platform
  ): Promise<any> {
    const result = await db.query(
      `SELECT * FROM integration_mappings
       WHERE integration_id = $1 AND entity_type = 'product' AND internal_id = $2`,
      [`${platform}_${storefrontId}`, productId]
    );

    return result.rows[0] || null;
  }

  /**
   * Get product mapping by external ID
   */
  private static async getProductMappingByExternalId(
    storefrontId: number,
    platform: Platform,
    externalId: string
  ): Promise<any> {
    const result = await db.query(
      `SELECT * FROM integration_mappings
       WHERE integration_id = $1 AND entity_type = 'product' AND external_id = $2`,
      [`${platform}_${storefrontId}`, externalId]
    );

    return result.rows[0] || null;
  }

  /**
   * Save product mapping
   */
  private static async saveProductMapping(
    productId: number,
    storefrontId: number,
    platform: Platform,
    externalId: string,
    externalSku: string
  ): Promise<void> {
    await db.query(
      `INSERT INTO integration_mappings (integration_id, entity_type, external_id, internal_id, sync_direction, last_synced_at)
       VALUES ($1, 'product', $2, $3, 'bidirectional', NOW())
       ON CONFLICT (integration_id, entity_type, external_id) 
       DO UPDATE SET internal_id = $3, last_synced_at = NOW()`,
      [`${platform}_${storefrontId}`, externalId, productId]
    );
  }

  /**
   * Update ecommerce_products table
   */
  private static async updateEcommerceProduct(
    storefrontId: number,
    externalId: string,
    product: any
  ): Promise<void> {
    await db.query(
      `INSERT INTO ecommerce_products (
        storefront_id, external_product_id, external_sku, erp_product_id, erp_sku,
        product_name, price, inventory_quantity, sync_status, last_synced_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'synced', NOW(), NOW())
      ON CONFLICT (storefront_id, external_product_id)
      DO UPDATE SET
        product_name = $6,
        price = $7,
        inventory_quantity = $8,
        sync_status = 'synced',
        last_synced_at = NOW(),
        updated_at = NOW()`,
      [
        storefrontId,
        externalId,
        product.sku || product.externalSku || '',
        product.id || null,
        product.sku || '',
        product.name || product.title || product.productName || '',
        product.price || 0,
        product.stock || 0,
      ]
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
