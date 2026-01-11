# RFC: Ocean ERP POS - Phase 2 Offline Mode Implementation

**Status:** Draft  
**Author:** Development Team  
**Created:** November 12, 2025  
**Target:** Q1 2026

---

## Executive Summary

This RFC proposes implementing offline-first capabilities for the Ocean ERP Point of Sale system to ensure uninterrupted operation during network outages. The solution will enable POS terminals to:

- ✅ Process transactions without internet connectivity
- ✅ Queue transactions locally and sync when connection is restored
- ✅ Provide real-time UI feedback on connectivity status
- ✅ Handle data conflicts intelligently during sync
- ✅ Maintain data integrity across 300+ outlets

**Business Impact:**
- **Zero downtime** during network issues (common in Indonesia)
- **Improved customer experience** - no failed transactions
- **Higher sales volume** - terminals always operational
- **Reduced support costs** - fewer escalations for connectivity issues

---

## 1. Problem Statement

### Current Limitations (Phase 1)
- ❌ All POS operations require active internet connection
- ❌ Network outages halt all sales completely
- ❌ No local data persistence beyond browser memory
- ❌ Risk of data loss during transaction processing
- ❌ Poor UX in areas with unstable connectivity

### Indonesian Market Context
- Frequent power outages affecting network infrastructure
- Unreliable internet in tier 2/3 cities (target expansion markets)
- High-traffic periods (mall sales, holidays) causing network congestion
- Mobile POS terminals often on cellular networks (variable quality)
- Multi-floor retail locations with WiFi dead zones

### User Impact Scenarios
1. **Cashier during checkout:** Internet drops → transaction fails → customer waits or leaves
2. **Peak hours (12-2pm, 5-7pm):** Network congestion → slow/failed transactions → queue buildup
3. **New outlet onboarding:** Limited IT infrastructure → delayed operations
4. **Mall-wide network issues:** All stores affected simultaneously → significant revenue loss

---

## 2. Solution Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         POS Terminal UI                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Dashboard   │  │   Checkout   │  │  Session Management  │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└───────────────┬─────────────────────────────────┬───────────────┘
                │                                 │
                ▼                                 ▼
┌───────────────────────────────┐   ┌────────────────────────────┐
│     Service Worker Layer      │   │   Connectivity Monitor     │
│  - Request Interception       │   │  - Online/Offline Events   │
│  - Cache Management           │   │  - Heartbeat Checks        │
│  - Background Sync Trigger    │   │  - Status Broadcasting     │
└───────────────┬───────────────┘   └────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────────────────┐
│                    IndexedDB Local Store                       │
│  ┌────────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────┐ │
│  │ Pending    │  │ Products │  │ Customers│  │  Sessions   │ │
│  │ Transactions│  │  Cache   │  │  Cache   │  │   State     │ │
│  └────────────┘  └──────────┘  └──────────┘  └─────────────┘ │
└───────────────┬───────────────────────────────────────────────┘
                │
                ▼ (When Online)
┌───────────────────────────────────────────────────────────────┐
│                   Background Sync Manager                      │
│  - Transaction Queue Processing                               │
│  - Conflict Detection & Resolution                            │
│  - Retry Logic with Exponential Backoff                       │
│  - Partial Sync Support                                       │
└───────────────┬───────────────────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────────────────┐
│              Ocean ERP Backend APIs (Cloud/Server)            │
│    /api/pos/transactions, /api/pos/sync, /api/pos/sessions   │
└───────────────────────────────────────────────────────────────┘
```

---

## 3. Technical Implementation

### 3.1 Service Worker Strategy

**Workbox + Custom Logic**

```typescript
// sw.js - Service Worker Registration
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { BackgroundSyncPlugin } from 'workbox-background-sync';

// Precache static assets (UI components, images, fonts)
precacheAndRoute(self.__WB_MANIFEST);

// Strategy 1: Network First for API calls (with fallback to IndexedDB)
registerRoute(
  /\/api\/pos\/(sessions|products|customers)/,
  new NetworkFirst({
    cacheName: 'pos-api-cache',
    networkTimeoutSeconds: 5,
    plugins: [
      {
        cacheWillUpdate: async ({ response }) => {
          // Only cache successful responses
          return response.status === 200 ? response : null;
        },
      },
    ],
  })
);

// Strategy 2: Cache First for static product/customer data
registerRoute(
  /\/api\/pos\/products\/search/,
  new StaleWhileRevalidate({
    cacheName: 'pos-product-cache',
    plugins: [
      {
        cacheableResponse: { statuses: [200] },
        expiration: {
          maxEntries: 500,
          maxAgeSeconds: 3600, // 1 hour
        },
      },
    ],
  })
);

// Strategy 3: Background Sync for POST transactions
const bgSyncPlugin = new BackgroundSyncPlugin('pos-transactions-queue', {
  maxRetentionTime: 7 * 24 * 60, // Retry for 7 days
  onSync: async ({ queue }) => {
    let entry;
    while ((entry = await queue.shiftRequest())) {
      try {
        await fetch(entry.request.clone());
      } catch (error) {
        await queue.unshiftRequest(entry);
        throw error; // Re-queue and stop processing
      }
    }
  },
});

registerRoute(
  /\/api\/pos\/transactions/,
  async ({ request, event }) => {
    if (request.method === 'POST') {
      try {
        // Try network first
        return await fetch(request.clone());
      } catch (error) {
        // Network failed - queue for background sync
        await bgSyncPlugin.queue.pushRequest({ request: request.clone() });
        
        // Save to IndexedDB immediately
        const txnData = await request.json();
        await saveToIndexedDB('pending_transactions', txnData);
        
        // Return optimistic response
        return new Response(
          JSON.stringify({ 
            success: true, 
            offline: true,
            transaction: txnData,
            message: 'Transaction saved locally. Will sync when online.'
          }),
          { 
            status: 202, // Accepted
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
    }
    return fetch(request);
  }
);
```

### 3.2 IndexedDB Schema

**Database: `ocean-pos-offline`**

```typescript
// lib/offline/indexeddb.ts
import { openDB, DBSchema } from 'idb';

interface OceanPOSDB extends DBSchema {
  pending_transactions: {
    key: string; // UUID generated client-side
    value: {
      id: string;
      session_id: number;
      terminal_id: number;
      warehouse_id: number;
      customer_id: number | null;
      cashier_id: number;
      items: Array<{
        product_id: number;
        quantity: number;
        unit_price: number;
        discount: number;
      }>;
      payments: Array<{
        method: string;
        amount: number;
      }>;
      loyalty_points_to_redeem: number;
      created_at: string; // ISO timestamp
      synced: boolean;
      sync_attempts: number;
      last_sync_attempt: string | null;
      error_message: string | null;
    };
    indexes: { 
      'by-synced': boolean; 
      'by-session': number;
      'by-created': string;
    };
  };
  
  products_cache: {
    key: number; // product_id
    value: {
      id: number;
      name: string;
      sku: string;
      barcode: string;
      selling_price: number;
      cost_price: number;
      category_name: string;
      available_quantity: number;
      tax_rate: number;
      cached_at: string;
    };
    indexes: { 
      'by-barcode': string; 
      'by-sku': string;
      'by-name': string;
    };
  };
  
  customers_cache: {
    key: number; // customer_id
    value: {
      id: number;
      full_name: string;
      phone: string;
      email: string;
      membership_number: string;
      loyalty_tier: string;
      loyalty_points: number;
      cached_at: string;
    };
    indexes: { 
      'by-phone': string; 
      'by-membership': string;
    };
  };
  
  sessions_state: {
    key: number; // session_id
    value: {
      id: number;
      terminal_id: number;
      warehouse_id: number;
      cashier_id: number;
      session_number: string;
      opening_cash: number;
      status: 'open' | 'closed';
      opened_at: string;
      closed_at: string | null;
      transaction_count: number;
      total_sales: number;
      last_updated: string;
    };
    indexes: { 
      'by-terminal': number; 
      'by-status': string;
    };
  };
  
  sync_metadata: {
    key: string; // 'last_sync_timestamp', 'sync_status', etc.
    value: {
      key: string;
      value: any;
      updated_at: string;
    };
  };
}

export async function initDB() {
  return openDB<OceanPOSDB>('ocean-pos-offline', 1, {
    upgrade(db) {
      // Pending Transactions Store
      const txnStore = db.createObjectStore('pending_transactions', { 
        keyPath: 'id' 
      });
      txnStore.createIndex('by-synced', 'synced');
      txnStore.createIndex('by-session', 'session_id');
      txnStore.createIndex('by-created', 'created_at');
      
      // Products Cache Store
      const productsStore = db.createObjectStore('products_cache', { 
        keyPath: 'id' 
      });
      productsStore.createIndex('by-barcode', 'barcode', { unique: false });
      productsStore.createIndex('by-sku', 'sku', { unique: false });
      productsStore.createIndex('by-name', 'name', { unique: false });
      
      // Customers Cache Store
      const customersStore = db.createObjectStore('customers_cache', { 
        keyPath: 'id' 
      });
      customersStore.createIndex('by-phone', 'phone', { unique: false });
      customersStore.createIndex('by-membership', 'membership_number', { unique: false });
      
      // Sessions State Store
      const sessionsStore = db.createObjectStore('sessions_state', { 
        keyPath: 'id' 
      });
      sessionsStore.createIndex('by-terminal', 'terminal_id');
      sessionsStore.createIndex('by-status', 'status');
      
      // Sync Metadata Store
      db.createObjectStore('sync_metadata', { keyPath: 'key' });
    },
  });
}

// CRUD Operations
export async function savePendingTransaction(txn: any) {
  const db = await initDB();
  await db.put('pending_transactions', {
    ...txn,
    id: txn.id || crypto.randomUUID(),
    created_at: new Date().toISOString(),
    synced: false,
    sync_attempts: 0,
    last_sync_attempt: null,
    error_message: null,
  });
}

export async function getPendingTransactions() {
  const db = await initDB();
  return db.getAllFromIndex('pending_transactions', 'by-synced', false);
}

export async function markTransactionSynced(id: string) {
  const db = await initDB();
  const txn = await db.get('pending_transactions', id);
  if (txn) {
    txn.synced = true;
    await db.put('pending_transactions', txn);
  }
}

export async function cacheProduct(product: any) {
  const db = await initDB();
  await db.put('products_cache', {
    ...product,
    cached_at: new Date().toISOString(),
  });
}

export async function searchCachedProducts(query: string) {
  const db = await initDB();
  const allProducts = await db.getAll('products_cache');
  return allProducts.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.sku.toLowerCase().includes(query.toLowerCase()) ||
    p.barcode === query
  );
}
```

### 3.3 Connectivity Monitor

**Real-time Online/Offline Detection**

```typescript
// lib/offline/connectivity.ts
import { create } from 'zustand';

interface ConnectivityState {
  isOnline: boolean;
  lastOnlineAt: Date | null;
  pendingTransactionsCount: number;
  syncInProgress: boolean;
  setOnline: (online: boolean) => void;
  setPendingCount: (count: number) => void;
  setSyncInProgress: (inProgress: boolean) => void;
}

export const useConnectivity = create<ConnectivityState>((set) => ({
  isOnline: navigator.onLine,
  lastOnlineAt: navigator.onLine ? new Date() : null,
  pendingTransactionsCount: 0,
  syncInProgress: false,
  setOnline: (online) => set({ 
    isOnline: online, 
    lastOnlineAt: online ? new Date() : undefined 
  }),
  setPendingCount: (count) => set({ pendingTransactionsCount: count }),
  setSyncInProgress: (inProgress) => set({ syncInProgress: inProgress }),
}));

// Monitor connectivity changes
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    useConnectivity.getState().setOnline(true);
    triggerBackgroundSync();
  });
  
  window.addEventListener('offline', () => {
    useConnectivity.getState().setOnline(false);
  });
  
  // Heartbeat check every 30 seconds
  setInterval(async () => {
    try {
      const response = await fetch('/api/health', { 
        method: 'HEAD',
        cache: 'no-cache' 
      });
      useConnectivity.getState().setOnline(response.ok);
    } catch {
      useConnectivity.getState().setOnline(false);
    }
  }, 30000);
}

async function triggerBackgroundSync() {
  if ('serviceWorker' in navigator && 'sync' in navigator.serviceWorker) {
    const registration = await navigator.serviceWorker.ready;
    await registration.sync.register('sync-pos-transactions');
  }
}
```

### 3.4 Sync Manager

**Intelligent Background Synchronization**

```typescript
// lib/offline/sync-manager.ts
import { getPendingTransactions, markTransactionSynced } from './indexeddb';
import { useConnectivity } from './connectivity';

export class SyncManager {
  private syncInterval: NodeJS.Timer | null = null;
  private readonly SYNC_INTERVAL = 60000; // 1 minute
  private readonly MAX_RETRY_ATTEMPTS = 10;
  
  async startPeriodicSync() {
    this.syncInterval = setInterval(async () => {
      if (useConnectivity.getState().isOnline) {
        await this.syncPendingTransactions();
      }
    }, this.SYNC_INTERVAL);
  }
  
  stopPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }
  
  async syncPendingTransactions() {
    const { setSyncInProgress, setPendingCount } = useConnectivity.getState();
    
    try {
      setSyncInProgress(true);
      const pending = await getPendingTransactions();
      setPendingCount(pending.length);
      
      if (pending.length === 0) return;
      
      // Sync in batches of 10
      const batches = this.chunkArray(pending, 10);
      
      for (const batch of batches) {
        await Promise.allSettled(
          batch.map(txn => this.syncTransaction(txn))
        );
      }
      
      // Update count after sync
      const remainingPending = await getPendingTransactions();
      setPendingCount(remainingPending.length);
      
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setSyncInProgress(false);
    }
  }
  
  private async syncTransaction(txn: any) {
    if (txn.sync_attempts >= this.MAX_RETRY_ATTEMPTS) {
      console.warn(`Transaction ${txn.id} exceeded max retries. Manual review needed.`);
      return;
    }
    
    try {
      const response = await fetch('/api/pos/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...txn,
          offline_transaction_id: txn.id, // Preserve client-side ID
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }
      
      const result = await response.json();
      
      // Handle conflicts (if server returned different data)
      if (result.conflict) {
        await this.handleConflict(txn, result);
      } else {
        await markTransactionSynced(txn.id);
      }
      
    } catch (error) {
      // Increment retry count
      const db = await initDB();
      txn.sync_attempts += 1;
      txn.last_sync_attempt = new Date().toISOString();
      txn.error_message = (error as Error).message;
      await db.put('pending_transactions', txn);
      
      throw error; // Re-throw to mark as failed in Promise.allSettled
    }
  }
  
  private async handleConflict(localTxn: any, serverResponse: any) {
    // Conflict Resolution Strategies:
    // 1. Server Wins (default for inventory conflicts)
    // 2. Client Wins (for transaction amounts)
    // 3. Manual Resolution (flag for admin review)
    
    console.warn('Conflict detected:', {
      local: localTxn,
      server: serverResponse,
    });
    
    // For now, mark as synced but log the conflict
    await markTransactionSynced(localTxn.id);
    
    // TODO: Implement conflict resolution UI
    // Store conflict in separate table for admin review
  }
  
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}

// Singleton instance
export const syncManager = new SyncManager();
```

---

## 4. UI/UX Enhancements

### 4.1 Connectivity Status Indicator

**Component: `<ConnectivityBadge />`**

```typescript
// components/connectivity-badge.tsx
'use client';

import { useConnectivity } from '@/lib/offline/connectivity';
import { Badge } from '@/registry/new-york-v4/ui/badge';
import { Wifi, WifiOff, CloudUpload } from 'lucide-react';

export function ConnectivityBadge() {
  const { isOnline, pendingTransactionsCount, syncInProgress } = useConnectivity();
  
  if (syncInProgress) {
    return (
      <Badge variant="secondary" className="gap-2">
        <CloudUpload className="h-3 w-3 animate-pulse" />
        Syncing {pendingTransactionsCount} transactions...
      </Badge>
    );
  }
  
  if (!isOnline) {
    return (
      <Badge variant="destructive" className="gap-2">
        <WifiOff className="h-3 w-3" />
        Offline Mode
        {pendingTransactionsCount > 0 && ` (${pendingTransactionsCount} pending)`}
      </Badge>
    );
  }
  
  if (pendingTransactionsCount > 0) {
    return (
      <Badge variant="warning" className="gap-2">
        <Wifi className="h-3 w-3" />
        Online ({pendingTransactionsCount} pending sync)
      </Badge>
    );
  }
  
  return (
    <Badge variant="success" className="gap-2">
      <Wifi className="h-3 w-3" />
      Online
    </Badge>
  );
}
```

### 4.2 Offline Transaction Banner

**Component: `<OfflineBanner />`**

```typescript
// components/offline-banner.tsx
'use client';

import { useConnectivity } from '@/lib/offline/connectivity';
import { Alert, AlertDescription } from '@/registry/new-york-v4/ui/alert';
import { AlertTriangle } from 'lucide-react';

export function OfflineBanner() {
  const { isOnline, pendingTransactionsCount } = useConnectivity();
  
  if (isOnline && pendingTransactionsCount === 0) return null;
  
  return (
    <Alert variant={isOnline ? 'warning' : 'destructive'}>
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        {!isOnline && (
          <>
            <strong>Working Offline:</strong> Transactions will be saved locally and synced when connection is restored.
          </>
        )}
        {isOnline && pendingTransactionsCount > 0 && (
          <>
            <strong>Syncing:</strong> {pendingTransactionsCount} offline transaction(s) are being uploaded to the server.
          </>
        )}
      </AlertDescription>
    </Alert>
  );
}
```

### 4.3 Modified Checkout Flow

**Updated: `/app/(app)/erp/pos/checkout/page.tsx`**

```typescript
// Add offline handling to checkout
const processCheckout = async () => {
  const { isOnline } = useConnectivity.getState();
  
  const transactionData = {
    session_id: currentSessionId,
    terminal_id: terminalId,
    warehouse_id: warehouseId,
    customer_id: customer?.id,
    cashier_id: userId,
    items: cart,
    payments,
    loyalty_points_to_redeem: loyaltyPointsToRedeem,
  };
  
  try {
    if (isOnline) {
      // Online: Normal API call
      const response = await fetch('/api/pos/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData),
      });
      
      if (!response.ok) throw new Error('Transaction failed');
      
      const result = await response.json();
      showSuccessMessage(result);
      clearCart();
      
    } else {
      // Offline: Save to IndexedDB
      const offlineTxnId = crypto.randomUUID();
      await savePendingTransaction({
        id: offlineTxnId,
        ...transactionData,
      });
      
      showOfflineSuccessMessage(offlineTxnId);
      clearCart();
      
      // Update pending count
      const pending = await getPendingTransactions();
      useConnectivity.getState().setPendingCount(pending.length);
    }
    
  } catch (error) {
    showErrorMessage(error);
  }
};
```

---

## 5. Data Conflict Resolution

### 5.1 Conflict Types

| Conflict Type | Scenario | Resolution Strategy |
|---------------|----------|---------------------|
| **Inventory Shortage** | Offline transaction used stock that was sold by another terminal | **Server Wins** - Mark transaction as "Pending Review", notify manager, offer alternative products or backorder |
| **Duplicate Transaction** | Same transaction synced multiple times (network retry) | **Idempotency Check** - Use `offline_transaction_id` to detect duplicates, ignore subsequent attempts |
| **Customer Data Mismatch** | Customer info updated on another terminal while offline | **Last Write Wins (LWW)** - Use timestamp to determine which update is newer |
| **Session Closed** | Session was closed on server but offline terminal still used it | **Reject** - Create new session automatically, reassign transaction to new session |
| **Price Changes** | Product price changed while terminal was offline | **Historical Price** - Honor the price at transaction time (stored in transaction record) |
| **Loyalty Points Conflict** | Points redeemed offline that were already used elsewhere | **Server Wins** - Reverse redemption, notify cashier, offer alternative discount |

### 5.2 Conflict Detection API

**New Endpoint: POST /api/pos/sync/validate**

```typescript
// app/api/pos/sync/validate/route.ts
export async function POST(request: NextRequest) {
  const { offline_transaction_id, session_id, items, customer_id, loyalty_points_to_redeem } = await request.json();
  
  const conflicts = [];
  
  // Check 1: Session still open?
  const session = await pool.query(
    'SELECT status FROM pos_sessions WHERE id = $1',
    [session_id]
  );
  if (session.rows[0]?.status !== 'open') {
    conflicts.push({
      type: 'session_closed',
      message: 'Session was closed on server',
      resolution: 'create_new_session',
    });
  }
  
  // Check 2: Inventory availability
  for (const item of items) {
    const inventory = await pool.query(
      'SELECT quantity_available FROM inventory WHERE product_id = $1',
      [item.product_id]
    );
    if (inventory.rows[0]?.quantity_available < item.quantity) {
      conflicts.push({
        type: 'inventory_shortage',
        product_id: item.product_id,
        requested: item.quantity,
        available: inventory.rows[0]?.quantity_available || 0,
        resolution: 'reduce_quantity_or_reject',
      });
    }
  }
  
  // Check 3: Loyalty points still available?
  if (customer_id && loyalty_points_to_redeem > 0) {
    const customer = await pool.query(
      'SELECT loyalty_points FROM customers WHERE id = $1',
      [customer_id]
    );
    if (customer.rows[0]?.loyalty_points < loyalty_points_to_redeem) {
      conflicts.push({
        type: 'insufficient_loyalty_points',
        requested: loyalty_points_to_redeem,
        available: customer.rows[0]?.loyalty_points || 0,
        resolution: 'reduce_points_or_reject',
      });
    }
  }
  
  // Check 4: Duplicate transaction?
  const duplicate = await pool.query(
    'SELECT id FROM pos_transactions WHERE offline_transaction_id = $1',
    [offline_transaction_id]
  );
  if (duplicate.rows.length > 0) {
    conflicts.push({
      type: 'duplicate_transaction',
      existing_id: duplicate.rows[0].id,
      resolution: 'skip',
    });
  }
  
  return NextResponse.json({
    success: true,
    has_conflicts: conflicts.length > 0,
    conflicts,
  });
}
```

---

## 6. Implementation Roadmap

### Phase 2.1: Foundation (Weeks 1-2)
- ✅ Service Worker setup with Workbox
- ✅ IndexedDB schema design and implementation
- ✅ Connectivity monitor with UI indicators
- ✅ Basic offline transaction queueing
- ✅ Testing infrastructure for offline scenarios

**Deliverables:**
- Service Worker registered and active
- IndexedDB stores operational
- Connectivity status badge in all POS pages
- Basic offline mode working (no sync yet)

### Phase 2.2: Sync Engine (Weeks 3-4)
- ✅ Background sync implementation
- ✅ Sync manager with retry logic
- ✅ Conflict detection API
- ✅ Batch sync processing
- ✅ Error handling and logging

**Deliverables:**
- Automatic sync when connection restored
- Exponential backoff for failed syncs
- Conflict validation before sync
- Admin dashboard showing pending syncs

### Phase 2.3: Conflict Resolution (Weeks 5-6)
- ✅ Conflict resolution UI for cashiers
- ✅ Admin conflict review dashboard
- ✅ Automated resolution strategies
- ✅ Manual override capabilities
- ✅ Audit trail for all resolutions

**Deliverables:**
- Conflict resolution wizard in POS UI
- Admin panel for reviewing conflicts
- Comprehensive audit logs

### Phase 2.4: Caching & Optimization (Weeks 7-8)
- ✅ Product catalog caching strategy
- ✅ Customer data prefetching
- ✅ Smart cache invalidation
- ✅ Partial sync for large datasets
- ✅ Performance optimization

**Deliverables:**
- Sub-second product search (offline)
- Customer lookup without network
- Cache size under 50MB per terminal
- 95%+ cache hit rate

### Phase 2.5: Testing & Hardening (Weeks 9-10)
- ✅ End-to-end offline flow testing
- ✅ Network simulation testing (throttling, dropouts)
- ✅ Stress testing (1000+ pending transactions)
- ✅ Multi-terminal conflict scenarios
- ✅ User acceptance testing (UAT) with 5 pilot outlets

**Deliverables:**
- 100% test coverage for offline flows
- UAT sign-off from pilot outlets
- Performance benchmarks met
- Bug fixes and refinements

### Phase 2.6: Deployment & Training (Weeks 11-12)
- ✅ Gradual rollout to 50 outlets (Phase 1)
- ✅ Staff training materials and videos
- ✅ Monitoring and alerting setup
- ✅ Documentation and runbooks
- ✅ Post-deployment support

**Deliverables:**
- 50 outlets live with offline mode
- Training completed for 150 staff
- 24/7 support team ready
- Monitoring dashboards operational

---

## 7. Success Metrics

### Technical KPIs
- **Offline Transaction Success Rate:** >99%
- **Sync Success Rate:** >98% within 5 minutes of reconnection
- **Conflict Rate:** <2% of offline transactions
- **Cache Hit Rate:** >95% for product/customer searches
- **Service Worker Installation Rate:** >99% of active terminals

### Business KPIs
- **Revenue Protection:** 100% of sales captured during outages (vs 0% in Phase 1)
- **Average Downtime:** <30 seconds (time from offline to operational in offline mode)
- **Customer Wait Time:** No increase during network issues
- **Support Tickets (Connectivity):** 80% reduction
- **Cashier Satisfaction:** >90% positive feedback on offline reliability

### Performance Benchmarks
- **IndexedDB Write Speed:** <50ms per transaction
- **Background Sync Duration:** <2 minutes for 100 queued transactions
- **Product Search (Offline):** <200ms
- **Customer Lookup (Offline):** <100ms
- **Service Worker Boot Time:** <500ms

---

## 8. Risk Assessment

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|---------------------|
| **Browser Compatibility Issues** | Medium | High | Thorough testing on Chrome/Safari/Edge, fallback to online-only mode for unsupported browsers |
| **IndexedDB Quota Exceeded** | Low | Medium | Implement quota monitoring, automatic cleanup of synced data, warn cashiers at 80% quota |
| **Service Worker Update Failures** | Medium | Medium | Versioned service workers, graceful fallback, force update mechanism |
| **Data Corruption in IndexedDB** | Low | High | Regular data validation, backup to localStorage, auto-recovery from corruption |
| **Complex Conflicts (Edge Cases)** | Medium | High | Manual review queue, escalation to support team, detailed logging |
| **Performance Degradation (Large Queues)** | Medium | Medium | Batch processing, pagination, background throttling, queue size limits (max 1000) |
| **Security Concerns (Local Data)** | Medium | High | Encrypt sensitive data in IndexedDB, auto-logout after inactivity, clear cache on logout |
| **Multi-Tab Synchronization** | Low | Low | Use BroadcastChannel API for cross-tab communication, warn users about multiple tabs |

---

## 9. Security Considerations

### 9.1 Data Encryption

```typescript
// lib/offline/encryption.ts
import CryptoJS from 'crypto-js';

// Use session-based encryption key (derived from user password or session token)
function getEncryptionKey(): string {
  // In production: derive from authenticated session
  return sessionStorage.getItem('pos_encryption_key') || '';
}

export function encryptData(data: any): string {
  const key = getEncryptionKey();
  return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
}

export function decryptData(ciphertext: string): any {
  const key = getEncryptionKey();
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

// Store encrypted transactions
export async function savePendingTransactionEncrypted(txn: any) {
  const db = await initDB();
  const encrypted = encryptData(txn);
  await db.put('pending_transactions', {
    id: txn.id,
    data: encrypted, // Store encrypted blob
    created_at: new Date().toISOString(),
    synced: false,
  });
}
```

### 9.2 Auto-Logout on Offline

```typescript
// Clear IndexedDB on logout to prevent data leakage
export async function clearOfflineData() {
  const db = await initDB();
  await db.clear('pending_transactions');
  await db.clear('products_cache');
  await db.clear('customers_cache');
  await db.clear('sessions_state');
  sessionStorage.removeItem('pos_encryption_key');
}

// Auto-logout after 30 minutes of inactivity
let inactivityTimer: NodeJS.Timer | null = null;

function resetInactivityTimer() {
  if (inactivityTimer) clearTimeout(inactivityTimer);
  
  inactivityTimer = setTimeout(async () => {
    await clearOfflineData();
    window.location.href = '/logout';
  }, 30 * 60 * 1000); // 30 minutes
}

// Listen to user activity
['mousedown', 'keydown', 'touchstart'].forEach(event => {
  document.addEventListener(event, resetInactivityTimer);
});
```

---

## 10. Monitoring & Observability

### 10.1 Analytics Events

```typescript
// lib/offline/analytics.ts

export function trackOfflineEvent(event: string, metadata: any) {
  // Send to analytics service (e.g., Google Analytics, Mixpanel)
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', event, {
      event_category: 'offline_mode',
      ...metadata,
    });
  }
}

// Track key events
trackOfflineEvent('transaction_saved_offline', { transaction_id: txnId });
trackOfflineEvent('sync_started', { pending_count: count });
trackOfflineEvent('sync_completed', { success_count, failure_count });
trackOfflineEvent('conflict_detected', { conflict_type, transaction_id });
```

### 10.2 Error Reporting

```typescript
// lib/offline/error-reporting.ts
import * as Sentry from '@sentry/nextjs';

export function reportOfflineError(error: Error, context: any) {
  Sentry.captureException(error, {
    tags: {
      feature: 'offline_mode',
      conflict_type: context.conflictType,
    },
    extra: context,
  });
}
```

---

## 11. Open Questions

1. **Inventory Reserve Strategy:** Should offline transactions optimistically reserve inventory (risk of overselling) or allow overselling and resolve later?
   - **Proposed:** Allow overselling offline, flag conflicts on sync, notify manager for manual resolution

2. **Maximum Offline Duration:** How long should terminals support offline operation before requiring reconnection?
   - **Proposed:** 7 days max (configurable), warn at 24 hours, force sync at 7 days

3. **Shift Handover:** How to handle offline transactions when shift changes or session closes?
   - **Proposed:** Allow session to stay "open" in offline mode, auto-close when synced, create new session if conflict

4. **Bulk Data Updates:** How to handle catalog/pricing updates while terminals are offline?
   - **Proposed:** Force sync before accepting new data, temporarily block offline mode during major updates

---

## 12. Alternatives Considered

### Alternative 1: Replicated Local Database (PouchDB + CouchDB)
**Pros:**
- Full bi-directional sync
- Mature conflict resolution
- Works with existing PostgreSQL via CouchDB sync

**Cons:**
- Complex setup and maintenance
- Higher storage requirements
- Overkill for POS use case

**Decision:** Rejected - Too complex for our needs

### Alternative 2: Progressive Web App (PWA) Only (No Service Worker)
**Pros:**
- Simpler implementation
- Fewer browser compatibility issues

**Cons:**
- No background sync
- No offline API caching
- Poor offline UX

**Decision:** Rejected - Doesn't meet offline requirements

### Alternative 3: Electron Desktop App with SQLite
**Pros:**
- True offline database
- No browser limitations
- Better performance

**Cons:**
- Requires desktop installation
- No mobile support
- Higher deployment complexity

**Decision:** Rejected - Conflicts with web-first strategy

---

## 13. Dependencies

### Required Libraries
- `workbox-precaching` ^7.0.0
- `workbox-routing` ^7.0.0
- `workbox-strategies` ^7.0.0
- `workbox-background-sync` ^7.0.0
- `idb` ^8.0.0 (IndexedDB wrapper)
- `crypto-js` ^4.2.0 (for encryption)
- `uuid` ^9.0.0 (for client-side IDs)
- `zustand` ^4.5.0 (already in use)

### Infrastructure Requirements
- No additional backend infrastructure needed
- Existing PostgreSQL database
- Existing Next.js app
- Browser requirements: Chrome 90+, Safari 15+, Edge 90+

---

## 14. Documentation Requirements

1. **Developer Guide:** Service Worker architecture, IndexedDB schema, sync flow diagrams
2. **User Manual:** How offline mode works, what to expect, troubleshooting
3. **Training Videos:** Cashier training on offline scenarios (5-10 minutes)
4. **Admin Runbook:** Monitoring sync queues, resolving conflicts, handling escalations
5. **API Reference:** New sync endpoints, conflict resolution API

---

## 15. Approval & Next Steps

### Stakeholder Sign-Off Required
- [ ] **CTO/Technical Lead:** Architecture approval
- [ ] **Product Manager:** Feature requirements and roadmap
- [ ] **Operations Manager:** Training and rollout plan
- [ ] **Security Team:** Security review and approval
- [ ] **Finance:** Budget approval (development + infrastructure)

### Immediate Next Steps
1. **This Week:** Stakeholder review of this RFC, gather feedback
2. **Next Week:** Technical spike on Service Worker + IndexedDB (2 days)
3. **Week 3:** Finalize requirements, create detailed tickets in Jira
4. **Week 4:** Begin Phase 2.1 development (kick-off sprint)

---

## 16. Appendix

### A. Code Examples Repository
All code snippets in this RFC are available in:
`/docs/examples/offline-mode/`

### B. Testing Scenarios Checklist
See: `/docs/testing/offline-mode-scenarios.md`

### C. Performance Benchmarks
See: `/docs/performance/offline-mode-benchmarks.md`

### D. Browser Compatibility Matrix
| Browser | Version | Service Worker | IndexedDB | Background Sync | Status |
|---------|---------|----------------|-----------|-----------------|--------|
| Chrome | 90+ | ✅ | ✅ | ✅ | Fully Supported |
| Edge | 90+ | ✅ | ✅ | ✅ | Fully Supported |
| Safari | 15+ | ✅ | ✅ | ⚠️ Limited | Partial Support |
| Firefox | 90+ | ✅ | ✅ | ❌ No | Fallback Mode |

---

**End of RFC**

*Questions? Contact: dev-team@ocean-erp.com*
