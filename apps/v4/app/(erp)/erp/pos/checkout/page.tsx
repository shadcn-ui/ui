"use client";

import { useState, useEffect } from "react";
import { Button } from "@/registry/new-york-v4/ui/button";
import { Input } from "@/registry/new-york-v4/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/registry/new-york-v4/ui/card";
import { Badge } from "@/registry/new-york-v4/ui/badge";
import { ScrollArea } from "@/registry/new-york-v4/ui/scroll-area";
import { Separator } from "@/registry/new-york-v4/ui/separator";
import { toast } from "sonner";
import {
  Search,
  ShoppingCart,
  User,
  CreditCard,
  Trash2,
  Plus,
  Minus,
  X,
  Receipt,
  Users,
  Settings,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/registry/new-york-v4/ui/dialog";
import { Label } from "@/registry/new-york-v4/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select";
import { Textarea } from "@/registry/new-york-v4/ui/textarea";
import { MultiPaymentSplit } from "@/components/pos/multi-payment-split-enhanced";
import { ThermalReceipt } from "@/components/pos/thermal-receipt-enhanced";

interface CartItem {
  id: string;
  product_id: string;
  name: string;
  sku: string;
  quantity: number;
  unit_price: number;
  discount: number;
  tax_rate: number;
  is_taxable: boolean;
  batch_id?: number;
  batch_number?: string;
  available_quantity: number;
  category?: string;
  brand?: string;
}

interface Customer {
  id: string;
  name: string;
  contact_person: string;
  phone: string;
  email?: string;
  loyalty_points: number;
  tier_name: string;
  tier_discount: number;
  tier_points_multiplier: number;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  unit_price: string;
  cost_price: string;
  tax_rate: string;
  is_taxable: boolean;
  available_quantity: number;
  min_stock_level: number;
  max_stock_level: number;
  category_name?: string;
  brand?: string;
  barcode?: string;
  requires_batch_tracking: boolean;
  price_with_tax: number;
  in_stock: boolean;
  batches?: Array<{
    id: number;
    batch_number: string;
    quantity: number;
    expiry_date: string;
  }>;
}

interface POSSession {
  id: number;
  terminal_id: number;
  terminal_name: string;
  warehouse_id: number;
  warehouse_name: string;
  opened_by: number;
  opened_at: string;
  opening_balance: number;
  current_balance: number;
  session_status: string;
}

interface Payment {
  id: string;
  method: string;
  amount: number;
  reference?: string;
  provider?: string;
  tender_amount?: number;
  change_amount?: number;
}

const TAX_RATE = 11; // PPN 11% for Indonesia
const LOYALTY_POINTS_PER_RUPIAH = 0.001; // 1 point per 1000 IDR
const LOYALTY_REDEMPTION_RATE = 1000; // 1 point = 1000 IDR

export default function POSCheckoutEnhanced() {
  // Core state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [currentSession, setCurrentSession] = useState<POSSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Search and product state
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Customer state
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerLoading, setCustomerLoading] = useState(false);
  const [customerError, setCustomerError] = useState<string | null>(null);
  const [recentCustomers, setRecentCustomers] = useState<Customer[]>([]);
  const [focusedCustomerIndex, setFocusedCustomerIndex] = useState<number>(-1);

  // Payment state
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loyaltyPointsToRedeem, setLoyaltyPointsToRedeem] = useState(0);

  // Transaction state
  const [transactionNotes, setTransactionNotes] = useState("");
  const [showTransactionComplete, setShowTransactionComplete] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<any>(null);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);

  // Load current POS session on mount
  useEffect(() => {
    loadCurrentSession();
  }, []);

  const loadCurrentSession = async () => {
    try {
      // Try to get terminal_id from localStorage or use default
      const terminalId = localStorage.getItem('pos_terminal_id') || '1';
      
      const response = await fetch(`/api/pos/sessions/current?terminal_id=${terminalId}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setCurrentSession(data.data);
      } else {
        // No active session found - allow user to continue but warn
        console.warn("No active POS session found");
        // Create a mock session for demo purposes
        setCurrentSession({
          id: 0,
          terminal_id: parseInt(terminalId),
          terminal_name: "Terminal 1",
          warehouse_id: 1,
          warehouse_name: "Main Warehouse",
          opened_by: 1,
          opened_at: new Date().toISOString(),
          opening_balance: 0,
          current_balance: 0,
          session_status: "open"
        });
      }
    } catch (error) {
      console.error("Error loading session:", error);
      // Set a mock session so the POS can still work
      setCurrentSession({
        id: 0,
        terminal_id: 1,
        terminal_name: "Terminal 1",
        warehouse_id: 1,
        warehouse_name: "Main Warehouse",
        opened_by: 1,
        opened_at: new Date().toISOString(),
        opening_balance: 0,
        current_balance: 0,
        session_status: "open"
      });
    }
  };

  // Product search with debouncing
  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchQuery.trim() && searchQuery.length >= 2) {
        searchProducts(searchQuery);
      } else {
        setProducts([]);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const searchProducts = async (query: string) => {
    setSearchLoading(true);
    try {
      const response = await fetch(`/api/pos/products/search?q=${encodeURIComponent(query)}&limit=10&include_batches=true`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setProducts(data.data || []);
      } else {
        console.error("Product search failed:", data.error);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error searching products:", error);
      setProducts([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const searchCustomers = async (query: string) => {
    // Allow single-char suggestions in POS to be more responsive
    if (!query.trim() || query.length < 1) {
      setCustomers([]);
      return;
    }

    setCustomerLoading(true);
    setCustomerError(null);
    try {
      const response = await fetch(`/api/pos/customers/quick?q=${encodeURIComponent(query)}&limit=10`);
      const data = await response.json();

      // API returns the array in `data` (or older `customers` field in some places).
      const rawList = Array.isArray(data.data) ? data.data : Array.isArray(data.customers) ? data.customers : [];

      // Normalize fields so the UI always gets the expected shape
      const list: Customer[] = rawList.map((c: any) => ({
        id: String(c.id),
        name: c.name || c.company_name || `${c.contact_first_name || ""} ${c.contact_last_name || ""}`.trim(),
        contact_person: c.contact_person || `${c.contact_first_name || ""} ${c.contact_last_name || ""}`.trim(),
        phone: c.phone || c.contact_phone || "",
        email: c.email || c.contact_email || undefined,
        loyalty_points: Number(c.loyalty_points) || 0,
        tier_name: c.tier_name || c.membership_tier_name || "Standard",
        tier_discount: Number(c.tier_discount) || 0,
        tier_points_multiplier: Number(c.tier_points_multiplier) || Number(c.points_multiplier) || 1,
      }));

      console.debug("/api/pos/customers/quick response:", data);
      console.debug("normalized customers list length:", list.length);

      setCustomers(list);
      // update recent cache
      if (list.length > 0) setRecentCustomers(prev => {
        const merged = [...list, ...prev].slice(0, 20);
        // dedupe by id
        const uniq: Record<string, Customer> = {};
        merged.forEach((c) => { uniq[c.id] = c; });
        return Object.values(uniq).slice(0, 10);
      });
    } catch (error) {
      console.error("Error searching customers:", error);
      setCustomerError(String(error));
      setCustomers([]);
    } finally {
      setCustomerLoading(false);
    }
  };

  // Customer search debouncing
  useEffect(() => {
    const debounce = setTimeout(() => {
      if (customerSearch.trim()) {
        searchCustomers(customerSearch);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [customerSearch]);

  // Cart management functions
  const generateCartItemId = () => `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const addToCart = (product: Product, selectedBatchId?: number) => {
    const cartItemId = generateCartItemId();
    
    // Check if product with same batch already in cart
    const existingItemIndex = cart.findIndex(
      (item) => 
        item.product_id === product.id && 
        item.batch_id === selectedBatchId
    );

    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      updateCartItemQuantity(cart[existingItemIndex].id, cart[existingItemIndex].quantity + 1);
    } else {
      // Add new item to cart
      const newItem: CartItem = {
        id: cartItemId,
        product_id: product.id,
        name: product.name,
        sku: product.sku,
        quantity: 1,
        unit_price: parseFloat(product.unit_price),
        discount: 0,
        tax_rate: parseFloat(product.tax_rate) || TAX_RATE,
        is_taxable: product.is_taxable,
        batch_id: selectedBatchId,
        available_quantity: product.available_quantity,
        category: product.category_name,
        brand: product.brand || undefined,
      };

      setCart(prev => [...prev, newItem]);
      
      // Clear search after adding
      setSearchQuery("");
      setProducts([]);
      
      toast.success(`${product.name} added to cart`);
    }
  };

  const updateCartItemQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCart(prev =>
      prev.map(item => {
        if (item.id === cartItemId) {
          // Check stock availability
          if (newQuantity > item.available_quantity) {
            toast.error(`Only ${item.available_quantity} units available for ${item.name}`);
            return item;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const updateCartItemDiscount = (cartItemId: string, discount: number) => {
    setCart(prev =>
      prev.map(item =>
        item.id === cartItemId ? { ...item, discount: Math.max(0, discount) } : item
      )
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => {
      const item = prev.find(i => i.id === cartItemId);
      if (item) {
        toast.success(`${item.name} removed from cart`);
      }
      return prev.filter(i => i.id !== cartItemId);
    });
  };

  const clearCart = () => {
    setCart([]);
    setCustomer(null);
    setLoyaltyPointsToRedeem(0);
    setTransactionNotes("");
    setPayments([]);
    toast.success("Cart cleared");
  };

  // Calculation functions
  const calculateItemTotal = (item: CartItem) => {
    return (item.quantity * item.unit_price) - item.discount;
  };

  const calculateItemTax = (item: CartItem) => {
    if (!item.is_taxable) return 0;
    const itemTotal = calculateItemTotal(item);
    return itemTotal * (item.tax_rate / 100);
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };

  const calculateTotalTax = () => {
    return cart.reduce((sum, item) => sum + calculateItemTax(item), 0);
  };

  const calculateCustomerDiscount = () => {
    if (!customer || !customer.tier_discount) return 0;
    return calculateSubtotal() * (customer.tier_discount / 100);
  };

  const calculateLoyaltyDiscount = () => {
    return loyaltyPointsToRedeem * LOYALTY_REDEMPTION_RATE;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTotalTax();
    const customerDiscount = calculateCustomerDiscount();
    const loyaltyDiscount = calculateLoyaltyDiscount();
    
    return subtotal + tax - customerDiscount - loyaltyDiscount;
  };

  const calculateLoyaltyPointsEarned = () => {
    if (!customer) return 0;
    const subtotal = calculateSubtotal();
    const basePoints = subtotal * LOYALTY_POINTS_PER_RUPIAH;
    const multiplier = customer.tier_points_multiplier || 1;
    return Math.floor(basePoints * multiplier);
  };

  // Payment and checkout functions
  const handlePayment = (paymentData: Payment[]) => {
    setPayments(paymentData);
    setShowPaymentDialog(false);
    processTransaction(paymentData);
  };

  const processTransaction = async (paymentData: Payment[]) => {
    if (!currentSession || cart.length === 0) {
      toast.error("Cannot process transaction: missing session or empty cart");
      return;
    }

    setProcessing(true);

    try {
      const transactionPayload = {
        session_id: currentSession.id,
        terminal_id: currentSession.terminal_id,
        warehouse_id: currentSession.warehouse_id,
        customer_id: customer?.id || null,
        cashier_id: 1, // TODO: Get from auth context
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          discount: item.discount,
          batch_id: item.batch_id || null,
        })),
        payments: paymentData.map(payment => ({
          method: payment.method,
          amount: payment.amount,
          reference: payment.reference,
          provider: payment.provider,
        })),
        loyalty_points_to_redeem: loyaltyPointsToRedeem,
        notes: transactionNotes,
        subtotal: calculateSubtotal(),
        tax_amount: calculateTotalTax(),
        customer_discount: calculateCustomerDiscount(),
        loyalty_discount: calculateLoyaltyDiscount(),
        total_amount: calculateTotal(),
        loyalty_points_earned: calculateLoyaltyPointsEarned(),
      };

      const response = await fetch("/api/pos/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionPayload),
      });

      const result = await response.json();

      if (result.success) {
        setLastTransaction(result.transaction);
        setShowTransactionComplete(true);
        clearCart();
        toast.success("Transaction completed successfully!");
      } else {
        toast.error(result.error || "Transaction failed");
      }
    } catch (error) {
      console.error("Transaction error:", error);
      toast.error("Transaction failed: Network error");
    } finally {
      setProcessing(false);
    }
  };

  // Utility functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStockStatus = (available: number, minStock?: number) => {
    if (available <= 0) return { status: "out-of-stock", color: "bg-red-100 text-red-700" };
    if (minStock && available <= minStock) return { status: "low-stock", color: "bg-yellow-100 text-yellow-700" };
    return { status: "in-stock", color: "bg-green-100 text-green-700" };
  };

  const canCheckout = () => {
    return cart.length > 0 && currentSession && !processing;
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">POS Checkout</h1>
            {currentSession && (
              <p className="text-sm text-gray-600">
                {currentSession.terminal_name} • {currentSession.warehouse_name}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {currentSession ? (
              <Badge variant="outline" className="text-green-600 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Session Active
              </Badge>
            ) : (
              <Badge variant="outline" className="text-red-600 border-red-200">
                <AlertCircle className="w-3 h-3 mr-1" />
                No Session
              </Badge>
            )}
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-1" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Product Search & Selection */}
        <div className="flex-1 flex flex-col p-6 space-y-6">
          {/* Customer Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                {customer ? (
                  <div className="flex-1">
                    <p className="font-semibold text-lg">{customer.name}</p>
                    <p className="text-sm text-gray-600">{customer.contact_person}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {customer.tier_name}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {customer.loyalty_points.toLocaleString()} points
                      </span>
                      {customer.tier_discount > 0 && (
                        <span className="text-xs text-green-600">
                          {customer.tier_discount}% discount
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1">
                    <p className="text-gray-600">Walk-in Customer</p>
                    <p className="text-sm text-gray-500">No loyalty benefits</p>
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCustomerDialog(true)}
                >
                  <User className="w-4 h-4 mr-1" />
                  {customer ? "Change" : "Select"}
                </Button>
              </div>

              {/* Loyalty Points Redemption */}
              {customer && customer.loyalty_points > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <Label className="text-sm font-medium">Redeem Loyalty Points</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="number"
                      placeholder="Points to redeem"
                      value={loyaltyPointsToRedeem}
                      onChange={(e) => {
                        const points = parseInt(e.target.value) || 0;
                        setLoyaltyPointsToRedeem(
                          Math.min(points, customer.loyalty_points, Math.floor(calculateTotal() / LOYALTY_REDEMPTION_RATE))
                        );
                      }}
                      className="flex-1"
                      max={Math.min(customer.loyalty_points, Math.floor(calculateTotal() / LOYALTY_REDEMPTION_RATE))}
                    />
                    <span className="text-sm text-gray-500">
                      = {formatCurrency(loyaltyPointsToRedeem * LOYALTY_REDEMPTION_RATE)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Available: {customer.loyalty_points.toLocaleString()} points
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Search */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Search className="w-5 h-5" />
                Product Search
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search by name, SKU, or scan barcode..."
                    className="pl-10 h-12 text-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                </div>

                {/* Search Loading Indicator */}
                {searchLoading && (
                  <div className="absolute right-3 top-3">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              {/* Search Results */}
              {products && products.length > 0 && (
                <ScrollArea className="h-96 w-full border rounded-md">
                  <div className="p-1">
                    {products.map((product) => {
                      const stockStatus = getStockStatus(product.available_quantity, product.min_stock_level);
                      
                      return (
                        <div
                          key={product.id}
                          className="p-4 hover:bg-gray-50 cursor-pointer border-b last:border-0 rounded-md transition-colors"
                          onClick={() => addToCart(product)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold">{product.name}</p>
                                <Badge
                                  variant="secondary"
                                  className={`text-xs ${stockStatus.color}`}
                                >
                                  {stockStatus.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">{product.sku}</p>
                              {product.brand && (
                                <p className="text-xs text-gray-500">{product.brand}</p>
                              )}
                              {product.category_name && (
                                <Badge variant="outline" className="text-xs mt-1">
                                  {product.category_name}
                                </Badge>
                              )}
                            </div>
                            <div className="text-right ml-4">
                              <p className="font-bold text-lg">{formatCurrency(parseFloat(product.unit_price))}</p>
                              <p className="text-sm text-gray-600">
                                Stock: {product.available_quantity}
                              </p>
                              {product.available_quantity <= (product.min_stock_level || 0) && (
                                <p className="text-xs text-orange-600">Low stock</p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              )}

              {searchQuery && products.length === 0 && !searchLoading && (
                <div className="text-center py-8 text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No products found for "{searchQuery}"</p>
                  <p className="text-sm">Try a different search term</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Cart & Checkout */}
        <div className="w-96 bg-white border-l flex flex-col">
          {/* Cart Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Cart ({cart.length})
              </h2>
              {cart.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Cart Items */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {!cart || cart.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">Cart is empty</p>
                  <p className="text-sm">Search and add products to start</p>
                </div>
              ) : (
                cart.map((item) => (
                  <Card key={item.id} className="p-3">
                    <div className="space-y-2">
                      {/* Product Info */}
                      <div className="flex justify-between items-start">
                        <div className="flex-1 pr-2">
                          <p className="font-medium text-sm leading-tight">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.sku}</p>
                          {item.brand && (
                            <p className="text-xs text-gray-400">{item.brand}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border rounded">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="px-2 text-sm font-medium">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="text-right flex-1">
                          <p className="text-sm font-medium">{formatCurrency(item.unit_price)}</p>
                          <p className="text-xs text-gray-500">per unit</p>
                        </div>
                      </div>

                      {/* Discount Input */}
                      <div className="flex items-center gap-2">
                        <Label className="text-xs">Discount:</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          className="h-7 text-xs"
                          value={item.discount}
                          onChange={(e) => updateCartItemDiscount(item.id, parseFloat(e.target.value) || 0)}
                        />
                      </div>

                      {/* Item Total */}
                      <div className="pt-1 border-t">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal:</span>
                          <span className="font-medium">{formatCurrency(calculateItemTotal(item))}</span>
                        </div>
                        {item.is_taxable && (
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>Tax ({item.tax_rate}%):</span>
                            <span>{formatCurrency(calculateItemTax(item))}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Cart Summary & Checkout */}
          {cart.length > 0 && (
            <div className="border-t p-4 space-y-4">
              {/* Transaction Notes */}
              <div>
                <Label className="text-sm">Transaction Notes</Label>
                <Textarea
                  placeholder="Optional notes for this transaction..."
                  className="mt-1 h-16 text-sm"
                  value={transactionNotes}
                  onChange={(e) => setTransactionNotes(e.target.value)}
                />
              </div>

              {/* Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(calculateSubtotal())}</span>
                </div>
                
                {calculateCustomerDiscount() > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Customer Discount ({customer?.tier_discount}%):</span>
                    <span>-{formatCurrency(calculateCustomerDiscount())}</span>
                  </div>
                )}

                {calculateLoyaltyDiscount() > 0 && (
                  <div className="flex justify-between text-sm text-blue-600">
                    <span>Loyalty Discount ({loyaltyPointsToRedeem} pts):</span>
                    <span>-{formatCurrency(calculateLoyaltyDiscount())}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span>Tax:</span>
                  <span>{formatCurrency(calculateTotalTax())}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(calculateTotal())}</span>
                </div>

                {customer && (
                  <div className="flex justify-between text-xs text-green-600">
                    <span>Points to earn:</span>
                    <span>+{calculateLoyaltyPointsEarned()} points</span>
                  </div>
                )}
              </div>

              {/* Checkout Button */}
              <Button
                className="w-full h-12 text-lg font-semibold"
                onClick={() => setShowPaymentDialog(true)}
                disabled={!canCheckout()}
              >
                {processing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Checkout {formatCurrency(calculateTotal())}
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Customer Selection Dialog */}
      <Dialog open={showCustomerDialog} onOpenChange={setShowCustomerDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select Customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search customers..."
                className="pl-10"
                value={customerSearch}
                onChange={(e) => {
                  setCustomerSearch(e.target.value);
                  setFocusedCustomerIndex(-1);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setFocusedCustomerIndex(i => {
                      const listLen = (customerSearch.trim() === '' ? recentCustomers : customers).length;
                      return Math.min(listLen - 1, Math.max(0, i + 1));
                    });
                  }
                  if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setFocusedCustomerIndex(i => Math.max(-1, i - 1));
                  }
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const list = (customerSearch.trim() === '' ? recentCustomers : customers);
                    const idx = focusedCustomerIndex >= 0 ? focusedCustomerIndex : 0;
                    if (list && list[idx]) {
                      const cust = list[idx];
                      setCustomer(cust);
                      setShowCustomerDialog(false);
                      setLoyaltyPointsToRedeem(0);
                    }
                  }
                }}
              />
              {customerLoading && (
                <div className="absolute right-3 top-3">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            <ScrollArea className="h-64">
              <div className="space-y-2">
                {/* Walk-in customer option */}
                <div
                  className="p-3 hover:bg-gray-50 cursor-pointer rounded border"
                  onClick={() => {
                    setCustomer(null);
                    setShowCustomerDialog(false);
                    setLoyaltyPointsToRedeem(0);
                  }}
                >
                  <p className="font-medium">Walk-in Customer</p>
                  <p className="text-sm text-gray-600">No loyalty benefits</p>
                </div>

                {(customerSearch.trim() === '' ? recentCustomers : customers).map((cust, idx) => (
                  <div
                    key={cust.id}
                    className={`p-3 cursor-pointer rounded border ${focusedCustomerIndex === idx ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                    onMouseEnter={() => setFocusedCustomerIndex(idx)}
                    onClick={() => {
                      setCustomer(cust);
                      setShowCustomerDialog(false);
                      setLoyaltyPointsToRedeem(0);
                    }}
                  >
                    <p className="font-medium">{cust.name}</p>
                    <p className="text-sm text-gray-600">{cust.contact_person}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {cust.tier_name}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {cust.loyalty_points.toLocaleString()} points
                      </span>
                    </div>
                  </div>
                ))}

                {customerLoading && customers.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>Searching...</p>
                  </div>
                )}

                {customerError && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded mt-2">
                    <AlertCircle className="w-4 h-4 text-red-600 mt-1" />
                    <div className="text-sm text-red-700">
                      <p className="font-medium">Could not load customers</p>
                      <p className="text-xs text-red-600">{customerError}</p>
                    </div>
                  </div>
                )}

                {(!customerLoading && !customerError && customerSearch && customers.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No customers found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <MultiPaymentSplit
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        totalAmount={calculateTotal()}
        onComplete={handlePayment}
      />

      {/* Transaction Complete Dialog */}
      <Dialog open={showTransactionComplete} onOpenChange={setShowTransactionComplete}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-green-600 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Transaction Complete
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {lastTransaction && (
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold">
                  {formatCurrency(lastTransaction.total_amount)}
                </p>
                <p className="text-sm text-gray-600">
                  Transaction: {lastTransaction.transaction_number}
                </p>
                {lastTransaction.loyalty_points_earned > 0 && (
                  <p className="text-sm text-green-600">
                    +{lastTransaction.loyalty_points_earned} loyalty points earned
                  </p>
                )}
              </div>
            )}
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowTransactionComplete(false)}
            >
              Continue
            </Button>
            <Button
              onClick={() => {
                setShowReceiptDialog(true);
                setShowTransactionComplete(false);
              }}
            >
              <Receipt className="w-4 h-4 mr-1" />
              View Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Receipt Dialog */}
      {lastTransaction && (
        <ThermalReceipt
          open={showReceiptDialog}
          onOpenChange={setShowReceiptDialog}
          receiptData={{
            transaction_number: lastTransaction.transaction_number,
            invoice_number: lastTransaction.invoice_number,
            transaction_date: lastTransaction.created_at || new Date().toISOString(),
            cashier_name: "Current User", // TODO: Get from auth context
            terminal_name: currentSession?.terminal_name || "Terminal",
            warehouse_name: currentSession?.warehouse_name || "Warehouse",
            
            customer_name: customer?.name,
            customer_phone: customer?.phone,
            customer_tier: customer?.tier_name,
            
            items: cart.map(item => ({
              name: item.name,
              sku: item.sku,
              quantity: item.quantity,
              unit_price: item.unit_price,
              discount: item.discount,
              total: calculateItemTotal(item),
              tax_amount: calculateItemTax(item),
              batch_number: item.batch_id ? `B${item.batch_id}` : undefined,
            })),
            
            subtotal: calculateSubtotal(),
            tax_amount: calculateTotalTax(),
            customer_discount: calculateCustomerDiscount(),
            loyalty_discount: calculateLoyaltyDiscount(),
            total_amount: calculateTotal(),
            
            payments: payments.map(payment => ({
              method: payment.method,
              amount: payment.amount,
              reference: payment.reference,
              tender_amount: payment.method === "Cash" ? payment.tender_amount : undefined,
              change_amount: payment.method === "Cash" ? payment.change_amount : undefined,
            })),
            
            loyalty_points_earned: calculateLoyaltyPointsEarned(),
            loyalty_points_redeemed: loyaltyPointsToRedeem,
            loyalty_points_balance: customer ? customer.loyalty_points - loyaltyPointsToRedeem + calculateLoyaltyPointsEarned() : undefined,
            
            notes: transactionNotes,
          }}
          onPrint={() => {
            toast.success("Receipt printed successfully");
          }}
          onEmail={() => {
            toast.success("Receipt sent via email");
          }}
          onSMS={() => {
            toast.success("Receipt summary sent via SMS");
          }}
        />
      )}
    </div>
  );
}