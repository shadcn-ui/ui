"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/registry/new-york-v4/ui/button";
import { Input } from "@/registry/new-york-v4/ui/input";
import { Card } from "@/registry/new-york-v4/ui/card";
import { Badge } from "@/registry/new-york-v4/ui/badge";
import { ScrollArea } from "@/registry/new-york-v4/ui/scroll-area";
import {
  Search,
  ShoppingCart,
  User,
  CreditCard,
  Trash2,
  Plus,
  Minus,
  X,
  Barcode,
  Calculator,
  Printer,
  AlertTriangle,
  Clock,
  Package,
  Keyboard,
  Monitor,
  Archive,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/registry/new-york-v4/ui/dialog";
import { Label } from "@/registry/new-york-v4/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/new-york-v4/ui/select";
import { Separator } from "@/registry/new-york-v4/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/registry/new-york-v4/ui/tooltip";
import { ReceiptDialog } from "@/components/pos/receipt-thermal";
import { MultiPaymentSplit } from "@/components/pos/multi-payment-split";
import { HoldTransactionDialog, RetrieveTransactionDialog } from "@/components/pos/hold-retrieve-transaction";

interface CartItem {
  product_id: number;
  name: string;
  sku: string;
  brand?: string;
  quantity: number;
  unit_price: number;
  discount: number;
  tax_rate: number;
  is_taxable: boolean;
  batch_id?: number;
  batch_number?: string;
  expiry_date?: string;
  available_quantity: number;
  primary_image_url?: string;
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  loyalty_points: number;
  tier_name: string;
  tier_discount: number;
}

interface Payment {
  method: string;
  amount: number;
  reference?: string;
}

export default function POSCheckoutEnhancedPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [barcodeInput, setBarcodeInput] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loyaltyPointsToRedeem, setLoyaltyPointsToRedeem] = useState(0);
  const [payments, setPayments] = useState<Payment[]>([]);
  
  // Dialogs
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showMultiPaymentDialog, setShowMultiPaymentDialog] = useState(false);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [showBatchSelector, setShowBatchSelector] = useState(false);
  const [showCashCalculator, setShowCashCalculator] = useState(false);
  const [showHoldDialog, setShowHoldDialog] = useState(false);
  const [showRetrieveDialog, setShowRetrieveDialog] = useState(false);
  
  const [customerSearch, setCustomerSearch] = useState("");
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [completedTransaction, setCompletedTransaction] = useState<any>(null);
  
  // Cash calculator
  const [tenderedAmount, setTenderedAmount] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("Cash");
  
  // Refs
  const barcodeInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load active session on mount
  useEffect(() => {
    loadActiveSession();
  }, []);

  const loadActiveSession = async () => {
    try {
      const response = await fetch("/api/pos/sessions/current");
      const data = await response.json();
      if (data.success && data.data) {
        setSessionId(data.data.id);
      } else {
        // No active session, try to open one automatically
        await openSession();
      }
    } catch (error) {
      console.error("Error loading session:", error);
    }
  };

  const openSession = async () => {
    try {
      const response = await fetch("/api/pos/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cashier_id: 1, // Default cashier
          terminal_id: 1,
          opening_balance: 0,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setSessionId(data.session.id);
        console.log("Session opened:", data.session.id);
      }
    } catch (error) {
      console.error("Error opening session:", error);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // F1: Focus search
      if (e.key === "F1") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      // F2: Customer search
      else if (e.key === "F2") {
        e.preventDefault();
        setShowCustomerDialog(true);
      }
      // F7: Multi-payment split
      else if (e.key === "F7") {
        e.preventDefault();
        if (cart.length > 0) {
          setShowMultiPaymentDialog(true);
        }
      }
      // F8: Payment
      else if (e.key === "F8") {
        e.preventDefault();
        if (cart.length > 0) {
          setShowPaymentDialog(true);
        }
      }
      // F9: Loyalty points
      else if (e.key === "F9") {
        e.preventDefault();
        if (customer && customer.loyalty_points > 0) {
          setLoyaltyPointsToRedeem(customer.loyalty_points);
        }
      }
      // F10: Clear cart
      else if (e.key === "F10") {
        e.preventDefault();
        if (confirm("Clear entire cart?")) {
          setCart([]);
        }
      }
      // F11: Hold transaction
      else if (e.key === "F11") {
        e.preventDefault();
        if (cart.length > 0) {
          setShowHoldDialog(true);
        }
      }
      // F12: Help
      else if (e.key === "F12") {
        e.preventDefault();
        setShowKeyboardHelp(true);
      }
      // Ctrl+H: Retrieve held transaction
      else if (e.ctrlKey && e.key === "h") {
        e.preventDefault();
        setShowRetrieveDialog(true);
      }
      // Ctrl+Enter: Quick payment
      else if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        if (cart.length > 0) {
          openPaymentDialog();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [cart, customer]);

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => {
      const itemTotal = item.quantity * item.unit_price - item.discount;
      return sum + itemTotal;
    }, 0);
  };

  const calculateTax = () => {
    return cart.reduce((sum, item) => {
      if (item.is_taxable) {
        const itemTotal = item.quantity * item.unit_price - item.discount;
        return sum + (itemTotal * item.tax_rate / 100);
      }
      return sum;
    }, 0);
  };

  const loyaltyDiscount = loyaltyPointsToRedeem * 1000;

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() - loyaltyDiscount;
  };

  const calculateChange = () => {
    const tendered = parseFloat(tenderedAmount) || 0;
    return Math.max(0, tendered - calculateTotal());
  };

  const searchProducts = async (query: string) => {
    if (query.length < 2) {
      setProducts([]);
      return;
    }

    try {
      const response = await fetch(
        `/api/pos/products/search?q=${encodeURIComponent(query)}&warehouse_id=1&limit=10`
      );
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  const searchByBarcode = async (barcode: string) => {
    if (!barcode) return;

    try {
      const response = await fetch(
        `/api/pos/products/search?barcode=${encodeURIComponent(barcode)}&warehouse_id=1`
      );
      const data = await response.json();
      if (data.success && data.data.length > 0) {
        // Barcode found, add directly to cart
        playBeep();
        addToCart(data.data[0]);
        setBarcodeInput("");
      } else {
        playError();
        alert("Product not found");
      }
    } catch (error) {
      console.error("Error searching barcode:", error);
      playError();
    }
  };

  // Update customer display
  const updateCustomerDisplay = (updatedCart = cart) => {
    if (typeof window !== "undefined" && window.BroadcastChannel) {
      const channel = new BroadcastChannel("pos-customer-display");
      const subtotal = updatedCart.reduce((sum, item) => sum + item.quantity * item.unit_price - item.discount, 0);
      const tax = updatedCart.reduce((sum, item) => {
        if (item.is_taxable) {
          const itemSubtotal = item.quantity * item.unit_price - item.discount;
          return sum + (itemSubtotal * item.tax_rate) / 100;
        }
        return sum;
      }, 0);
      const discount = loyaltyPointsToRedeem * 100; // Assuming 100 IDR per point
      const total = subtotal + tax - discount;

      channel.postMessage({
        cart: updatedCart,
        customer,
        subtotal,
        tax,
        discount,
        total,
      });
      channel.close();
    }
  };

  const addToCart = (product: any) => {
    // Check if product requires batch selection
    if (product.requires_batch_tracking && product.batches?.length > 0) {
      setSelectedProduct(product);
      setShowBatchSelector(true);
      return;
    }

    const existing = cart.find((item) => item.product_id === product.id);
    let updatedCart;

    if (existing) {
      updatedCart = cart.map((item) =>
        item.product_id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
    } else {
      updatedCart = [
        ...cart,
        {
          product_id: product.id,
          name: product.name,
          sku: product.sku,
          brand: product.brand,
          quantity: 1,
          unit_price: parseFloat(product.unit_price),
          discount: 0,
          tax_rate: product.tax_rate || 11,
          is_taxable: product.is_taxable,
          available_quantity: product.available_quantity,
          primary_image_url: product.primary_image_url,
        },
      ];
      setCart(updatedCart);
    }

    playBeep();
    updateCustomerDisplay(updatedCart);
    setSearchQuery("");
    setProducts([]);
  };

  const addToCartWithBatch = (product: any, batch: any) => {
    setCart([
      ...cart,
      {
        product_id: product.id,
        name: product.name,
        sku: product.sku,
        brand: product.brand,
        quantity: 1,
        unit_price: parseFloat(product.unit_price),
        discount: 0,
        tax_rate: product.tax_rate || 11,
        is_taxable: product.is_taxable,
        batch_id: batch.id,
        batch_number: batch.batch_number,
        expiry_date: batch.expiry_date,
        available_quantity: batch.quantity_remaining,
        primary_image_url: product.primary_image_url,
      },
    ]);
    playBeep();
    setShowBatchSelector(false);
  };

  const updateQuantity = (productId: number, change: number, batchId?: number) => {
    setCart(
      cart
        .map((item) => {
          const matchesProduct = item.product_id === productId;
          const matchesBatch = batchId ? item.batch_id === batchId : !item.batch_id;
          
          if (matchesProduct && matchesBatch) {
            const newQuantity = Math.max(0, item.quantity + change);
            
            // Check stock
            if (newQuantity > item.available_quantity) {
              playError();
              alert(`Only ${item.available_quantity} units available`);
              return item;
            }
            
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: number, batchId?: number) => {
    setCart(
      cart.filter((item) => {
        if (batchId) {
          return !(item.product_id === productId && item.batch_id === batchId);
        }
        return item.product_id !== productId;
      })
    );
  };

  const openPaymentDialog = () => {
    setShowPaymentDialog(true);
  };

  const processDirectPayment = async (paymentMethod: string) => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    if (!sessionId) {
      alert("No active session. Please open a session first.");
      return;
    }

    setLoading(true);
    setShowPaymentDialog(false);

    try {
      const totalAmount = calculateTotal();
      const response = await fetch("/api/pos/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          customer_id: customer?.id,
          warehouse_id: 1,
          items: cart.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            discount_amount: item.discount,
            batch_id: item.batch_id,
            notes: "",
          })),
          payment_method: paymentMethod,
          payment_amount: totalAmount,
          subtotal: calculateSubtotal(),
          tax_amount: calculateTax(),
          discount_amount: loyaltyDiscount,
          total_amount: totalAmount,
          loyalty_points_redeemed: loyaltyPointsToRedeem,
        }),
      });

      const data = await response.json();

      if (data.success) {
        playBeep();
        setCompletedTransaction(data.transaction);
        setShowReceiptDialog(true);
        
        // Reset cart
        setCart([]);
        setCustomer(null);
        setLoyaltyPointsToRedeem(0);
        updateCustomerDisplay([]);
      } else {
        playError();
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error processing checkout:", error);
      playError();
      alert("Failed to process payment");
    } finally {
      setLoading(false);
    }
  };

  const processCheckout = async () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    if (!sessionId) {
      alert("No active session. Please open a session first.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/pos/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          customer_id: customer?.id,
          warehouse_id: 1,
          items: cart.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            discount_amount: item.discount,
            batch_id: item.batch_id,
            notes: "",
          })),
          payment_method: selectedPaymentMethod,
          payment_amount: parseFloat(tenderedAmount) || calculateTotal(),
          subtotal: calculateSubtotal(),
          tax_amount: calculateTax(),
          discount_amount: loyaltyDiscount,
          total_amount: calculateTotal(),
          loyalty_points_redeemed: loyaltyPointsToRedeem,
        }),
      });

      const data = await response.json();

      if (data.success) {
        playSuccess();
        setCompletedTransaction(data.transaction);
        // Show receipt
        setShowReceiptDialog(true);
        setShowCashCalculator(false);
        setShowPaymentDialog(false);
        
        // Clear cart immediately
        setCart([]);
        setCustomer(null);
        setLoyaltyPointsToRedeem(0);
        setPayments([]);
        setTenderedAmount("");
        updateCustomerDisplay([]);
      } else {
        playError();
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error processing checkout:", error);
      playError();
      alert("Failed to process checkout");
    } finally {
      setLoading(false);
    }
  };

  // Audio feedback
  const playBeep = () => {
    const audio = new Audio("data:audio/wav;base64,UklGRhIAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAAABmYWN0BAAAAAAAAABkYXRhAAAAAA==");
    audio.play().catch(() => {});
  };

  const playSuccess = () => {
    playBeep();
  };

  const playError = () => {
    const audio = new Audio("data:audio/wav;base64,UklGRhIAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAAABmYWN0BAAAAAAAAABkYXRhAAAAAA==");
    audio.playbackRate = 0.5;
    audio.play().catch(() => {});
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchQuery) {
        searchProducts(searchQuery);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const days = Math.floor(
      (new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return days;
  };

  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">POS Checkout - Enhanced</h1>
              <p className="text-sm text-gray-600">
                Session #{sessionId || "N/A"} • Terminal 1 • Jakarta Main Store
              </p>
            </div>
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open("/erp/pos/customer-display", "_blank")}
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Open Customer Display</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowRetrieveDialog(true)}
                  >
                    <Archive className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Retrieve Held Transaction (Ctrl+H)</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowKeyboardHelp(true)}
                  >
                    <Keyboard className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Keyboard Shortcuts (F12)</TooltipContent>
              </Tooltip>
              {sessionId ? (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  ✓ Session #{sessionId}
                </Badge>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openSession}
                >
                  Open Session
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel */}
          <div className="flex-1 flex flex-col p-6 space-y-4">
            {/* Customer Section */}
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {customer ? (
                    <div>
                      <p className="font-semibold">{customer.name}</p>
                      <p className="text-sm text-gray-600">
                        {customer.tier_name} • {customer.loyalty_points.toLocaleString()} points
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-600">Walk-in Customer</p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCustomerDialog(true)}
                >
                  {customer ? "Change (F2)" : "Select (F2)"}
                </Button>
              </div>
            </Card>

            {/* Barcode Scanner */}
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-center gap-2">
                <Barcode className="h-5 w-5 text-blue-600" />
                <Input
                  ref={barcodeInputRef}
                  placeholder="Scan barcode or enter manually..."
                  className="flex-1 font-mono text-lg bg-white"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      searchByBarcode(barcodeInput);
                    }
                  }}
                />
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => searchByBarcode(barcodeInput)}
                >
                  Scan
                </Button>
              </div>
            </Card>

            {/* Product Search */}
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  ref={searchInputRef}
                  placeholder="Search products (F1)..."
                  className="pl-10 h-12 text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Search Results */}
              {products.length > 0 && (
                <Card className="absolute w-full mt-2 z-10 max-h-96 overflow-auto">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="p-4 hover:bg-gray-50 cursor-pointer border-b last:border-0 flex gap-3"
                      onClick={() => addToCart(product)}
                    >
                      {product.primary_image_url && (
                        <img
                          src={product.primary_image_url}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-semibold">{product.name}</p>
                            <p className="text-sm text-gray-600">
                              {product.brand} • {product.sku}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">
                              {formatCurrency(product.unit_price)}
                            </p>
                            <div className="flex gap-2 items-center justify-end">
                              <Badge
                                variant={
                                  product.available_quantity < product.reorder_level
                                    ? "destructive"
                                    : "outline"
                                }
                                className="text-xs"
                              >
                                {product.available_quantity < product.reorder_level && (
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                )}
                                Stock: {product.available_quantity}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Card>
              )}
            </div>
          </div>

          {/* Right Panel - Cart */}
          <div className="w-[480px] bg-white border-l flex flex-col">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  <h2 className="text-lg font-semibold">Cart ({cart.length})</h2>
                </div>
                {cart.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={() => setCart([])}>
                    Clear (F10)
                  </Button>
                )}
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <ShoppingCart className="h-16 w-16 mb-4" />
                  <p>Scan or search products</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item, index) => (
                    <Card key={`${item.product_id}-${item.batch_id || index}`} className="p-3">
                      <div className="flex gap-3">
                        {item.primary_image_url && (
                          <img
                            src={item.primary_image_url}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-semibold text-sm">{item.name}</p>
                              <p className="text-xs text-gray-600">{item.sku}</p>
                              {item.batch_number && (
                                <div className="flex items-center gap-1 mt-1">
                                  <Package className="h-3 w-3" />
                                  <span className="text-xs text-gray-600">
                                    Batch: {item.batch_number}
                                  </span>
                                  {item.expiry_date && (
                                    <Badge
                                      variant={
                                        getDaysUntilExpiry(item.expiry_date) < 30
                                          ? "destructive"
                                          : "outline"
                                      }
                                      className="text-xs ml-2"
                                    >
                                      <Clock className="h-3 w-3 mr-1" />
                                      Exp: {new Date(item.expiry_date).toLocaleDateString("id-ID")}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.product_id, item.batch_id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.product_id, -1, item.batch_id)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-12 text-center font-semibold">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.product_id, 1, item.batch_id)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            <div className="text-right">
                              <p className="text-xs text-gray-600">
                                {formatCurrency(item.unit_price)} × {item.quantity}
                              </p>
                              <p className="font-bold">
                                {formatCurrency(item.quantity * item.unit_price)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Loyalty Points */}
            {customer && customer.loyalty_points > 0 && (
              <div className="p-4 border-t bg-blue-50">
                <Label className="text-sm font-semibold">Redeem Points (F9)</Label>
                <p className="text-xs text-gray-600 mb-2">
                  Available: {customer.loyalty_points.toLocaleString()} pts = {formatCurrency(customer.loyalty_points * 100)}
                </p>
                
                {/* Quick buttons */}
                <div className="grid grid-cols-4 gap-1 mb-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-8"
                    onClick={() => setLoyaltyPointsToRedeem(Math.floor(customer.loyalty_points * 0.25))}
                  >
                    25%
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-8"
                    onClick={() => setLoyaltyPointsToRedeem(Math.floor(customer.loyalty_points * 0.5))}
                  >
                    50%
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-8"
                    onClick={() => setLoyaltyPointsToRedeem(Math.floor(customer.loyalty_points * 0.75))}
                  >
                    75%
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-8"
                    onClick={() => setLoyaltyPointsToRedeem(customer.loyalty_points)}
                  >
                    All
                  </Button>
                </div>
                
                {/* Manual input */}
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={loyaltyPointsToRedeem || ""}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      // Limit to available points and max discount
                      const maxPoints = Math.min(customer.loyalty_points, Math.floor(calculateTotal() / 100));
                      setLoyaltyPointsToRedeem(Math.min(value, maxPoints));
                    }}
                    max={customer.loyalty_points}
                    placeholder="Enter points"
                    className="h-8"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLoyaltyPointsToRedeem(0)}
                    className="h-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-green-600 mt-1 font-semibold">
                  Discount: {formatCurrency(loyaltyPointsToRedeem * 100)}
                </p>
              </div>
            )}

            {/* Summary */}
            <div className="p-4 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatCurrency(calculateSubtotal())}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (11%)</span>
                <span>{formatCurrency(calculateTax())}</span>
              </div>
              {loyaltyDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Loyalty ({loyaltyPointsToRedeem} pts)</span>
                  <span>-{formatCurrency(loyaltyDiscount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>{formatCurrency(calculateTotal())}</span>
              </div>
            </div>

            {/* Payment Buttons */}
            <div className="p-4 border-t space-y-2">
              <Button
                className="w-full h-14 text-lg"
                disabled={cart.length === 0 || loading}
                onClick={openPaymentDialog}
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Payment (Ctrl+Enter)
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  disabled={cart.length === 0 || loading}
                  onClick={() => setShowMultiPaymentDialog(true)}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Split Payment (F7)
                </Button>
                <Button
                  variant="outline"
                  disabled={cart.length === 0}
                  onClick={() => setShowHoldDialog(true)}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Hold (F11)
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Cash Calculator Dialog */}
        <Dialog open={showCashCalculator} onOpenChange={setShowCashCalculator}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Cash Payment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Total Amount</Label>
                <Input
                  value={formatCurrency(calculateTotal())}
                  disabled
                  className="text-2xl font-bold text-center"
                />
              </div>

              <div>
                <Label>Tendered Amount</Label>
                <Input
                  type="number"
                  value={tenderedAmount}
                  onChange={(e) => setTenderedAmount(e.target.value)}
                  className="text-2xl font-bold text-center"
                  autoFocus
                />
              </div>

              {tenderedAmount && parseFloat(tenderedAmount) >= calculateTotal() && (
                <Card className="p-4 bg-green-50 border-green-200">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Change</p>
                    <p className="text-3xl font-bold text-green-600">
                      {formatCurrency(calculateChange())}
                    </p>
                  </div>
                </Card>
              )}

              <div className="grid grid-cols-3 gap-2">
                {[50000, 100000, 200000, 500000, 1000000].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    onClick={() => setTenderedAmount(amount.toString())}
                  >
                    {formatCurrency(amount)}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  onClick={() => setTenderedAmount(Math.ceil(calculateTotal()).toString())}
                >
                  Exact
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCashCalculator(false)}>
                Cancel
              </Button>
              <Button
                onClick={processCheckout}
                disabled={!tenderedAmount || parseFloat(tenderedAmount) < calculateTotal()}
              >
                Complete Payment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Payment Method Selection Dialog */}
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Select Payment Method</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="text-sm text-gray-600 mb-4">
                <div className="flex justify-between mb-1">
                  <span>Total Amount:</span>
                  <span className="font-bold text-lg">{formatCurrency(calculateTotal())}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  className="h-20 flex flex-col items-center justify-center"
                  variant="outline"
                  onClick={() => {
                    setSelectedPaymentMethod("Cash");
                    setShowPaymentDialog(false);
                    setShowCashCalculator(true);
                  }}
                >
                  <Calculator className="h-6 w-6 mb-2" />
                  <span>Cash</span>
                </Button>

                <Button
                  className="h-20 flex flex-col items-center justify-center"
                  variant="outline"
                  onClick={() => processDirectPayment("Debit Card")}
                >
                  <CreditCard className="h-6 w-6 mb-2" />
                  <span>Debit Card</span>
                </Button>

                <Button
                  className="h-20 flex flex-col items-center justify-center"
                  variant="outline"
                  onClick={() => processDirectPayment("Credit Card")}
                >
                  <CreditCard className="h-6 w-6 mb-2" />
                  <span>Credit Card</span>
                </Button>

                <Button
                  className="h-20 flex flex-col items-center justify-center"
                  variant="outline"
                  onClick={() => processDirectPayment("QRIS")}
                >
                  <svg className="h-6 w-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="7" height="7" strokeWidth="2" />
                    <rect x="14" y="3" width="7" height="7" strokeWidth="2" />
                    <rect x="3" y="14" width="7" height="7" strokeWidth="2" />
                    <rect x="14" y="14" width="7" height="7" strokeWidth="2" />
                  </svg>
                  <span>QRIS</span>
                </Button>

                <Button
                  className="h-20 flex flex-col items-center justify-center"
                  variant="outline"
                  onClick={() => processDirectPayment("GoPay")}
                >
                  <span className="text-2xl mb-1">📱</span>
                  <span>GoPay</span>
                </Button>

                <Button
                  className="h-20 flex flex-col items-center justify-center"
                  variant="outline"
                  onClick={() => processDirectPayment("OVO")}
                >
                  <span className="text-2xl mb-1">💜</span>
                  <span>OVO</span>
                </Button>

                <Button
                  className="h-20 flex flex-col items-center justify-center"
                  variant="outline"
                  onClick={() => processDirectPayment("DANA")}
                >
                  <span className="text-2xl mb-1">💙</span>
                  <span>DANA</span>
                </Button>

                <Button
                  className="h-20 flex flex-col items-center justify-center"
                  variant="outline"
                  onClick={() => processDirectPayment("Bank Transfer")}
                >
                  <span className="text-2xl mb-1">🏦</span>
                  <span>Bank Transfer</span>
                </Button>
              </div>

              <Separator />

              <Button
                className="w-full"
                variant="outline"
                onClick={() => {
                  setShowPaymentDialog(false);
                  setShowMultiPaymentDialog(true);
                }}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Split Payment (Multiple Methods)
              </Button>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setShowPaymentDialog(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Keyboard Shortcuts Help */}
        <Dialog open={showKeyboardHelp} onOpenChange={setShowKeyboardHelp}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Keyboard Shortcuts</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">F1</span>
                <span>Focus product search</span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">F2</span>
                <span>Select customer</span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">F7</span>
                <span>Split payment (multi-method)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">F8</span>
                <span>Payment methods</span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">F9</span>
                <span>Redeem max loyalty points</span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">F10</span>
                <span>Clear cart</span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">F11</span>
                <span>Hold transaction</span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">F12</span>
                <span>Show this help</span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">Ctrl+Enter</span>
                <span>Open payment dialog</span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">Ctrl+H</span>
                <span>Retrieve held transaction</span>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Batch Selector Dialog */}
        <Dialog open={showBatchSelector} onOpenChange={setShowBatchSelector}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select Batch</DialogTitle>
            </DialogHeader>
            {selectedProduct?.batches && (
              <div className="space-y-2">
                {selectedProduct.batches.map((batch: any) => (
                  <Card
                    key={batch.id}
                    className="p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => addToCartWithBatch(selectedProduct, batch)}
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="font-semibold">{batch.batch_number}</p>
                        <p className="text-sm text-gray-600">
                          Qty: {batch.quantity_remaining}
                        </p>
                      </div>
                      <div>
                        <Badge
                          variant={
                            getDaysUntilExpiry(batch.expiry_date) < 30
                              ? "destructive"
                              : "outline"
                          }
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(batch.expiry_date).toLocaleDateString("id-ID")}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Multi-Payment Split Dialog */}
        <MultiPaymentSplit
          open={showMultiPaymentDialog}
          onOpenChange={setShowMultiPaymentDialog}
          totalAmount={calculateTotal()}
          onComplete={async (payments) => {
            setLoading(true);
            try {
              const response = await fetch("/api/pos/transactions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  session_id: sessionId,
                  customer_id: customer?.id,
                  items: cart.map((item) => ({
                    product_id: item.product_id,
                    batch_id: item.batch_id,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    discount: item.discount,
                    tax_rate: item.tax_rate,
                  })),
                  payments: payments,
                  loyalty_points_redeemed: loyaltyPointsToRedeem,
                }),
              });

              const data = await response.json();
              if (data.success) {
                playBeep();
                setCompletedTransaction(data.transaction);
                setShowReceiptDialog(true);
                setCart([]);
                setCustomer(null);
                setLoyaltyPointsToRedeem(0);
                updateCustomerDisplay([]);
              } else {
                alert(`Error: ${data.error}`);
                playError();
              }
            } catch (error) {
              console.error("Error:", error);
              alert("Failed to complete transaction");
              playError();
            } finally {
              setLoading(false);
              setShowMultiPaymentDialog(false);
            }
          }}
        />

        {/* Receipt Dialog */}
        {completedTransaction && (
          <ReceiptDialog
            open={showReceiptDialog}
            onOpenChange={setShowReceiptDialog}
            transaction={completedTransaction}
          />
        )}

        {/* Hold Transaction Dialog */}
        <HoldTransactionDialog
          open={showHoldDialog}
          onOpenChange={setShowHoldDialog}
          cart={cart}
          customer={customer}
          totalAmount={calculateTotal()}
          onHoldSaved={() => {
            setCart([]);
            setCustomer(null);
            setLoyaltyPointsToRedeem(0);
            updateCustomerDisplay([]);
            playBeep();
          }}
        />

        {/* Retrieve Transaction Dialog */}
        <RetrieveTransactionDialog
          open={showRetrieveDialog}
          onOpenChange={setShowRetrieveDialog}
          onRetrieve={(transaction) => {
            // Load transaction into cart
            const loadedCart = transaction.items.map((item: any) => ({
              ...item,
              discount: 0,
              tax_rate: 11,
              is_taxable: true,
              available_quantity: 999,
            }));
            setCart(loadedCart);
            updateCustomerDisplay(loadedCart);
            if (transaction.customerName) {
              // Try to find customer by name/phone
              // For now just show the name in a simpler way
              alert(`Loaded transaction for: ${transaction.customerName}`);
            }
            playBeep();
          }}
        />

        {/* Customer Selection Dialog */}
        <Dialog open={showCustomerDialog} onOpenChange={setShowCustomerDialog}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Select Customer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, phone, or email..."
                  className="pl-10"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  autoFocus
                />
              </div>

              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {/* Walk-in Customer Option */}
                  <Card
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      setCustomer(null);
                      setShowCustomerDialog(false);
                      setCustomerSearch("");
                      playBeep();
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <User className="h-8 w-8 text-gray-400" />
                      <div>
                        <p className="font-semibold">Walk-in Customer</p>
                        <p className="text-sm text-gray-600">No customer account</p>
                      </div>
                    </div>
                  </Card>

                  {/* Sample Customers - In production, this would fetch from API */}
                  {[
                    {
                      id: 1,
                      name: "John Doe",
                      phone: "+62 812-3456-7890",
                      loyalty_points: 1250,
                      tier_name: "Gold",
                      tier_discount: 10,
                    },
                    {
                      id: 2,
                      name: "Jane Smith",
                      phone: "+62 813-9876-5432",
                      loyalty_points: 750,
                      tier_name: "Silver",
                      tier_discount: 5,
                    },
                    {
                      id: 3,
                      name: "Bob Johnson",
                      phone: "+62 814-5555-1234",
                      loyalty_points: 2500,
                      tier_name: "Platinum",
                      tier_discount: 15,
                    },
                  ]
                    .filter(
                      (cust) =>
                        !customerSearch ||
                        cust.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
                        cust.phone.includes(customerSearch)
                    )
                    .map((cust) => (
                      <Card
                        key={cust.id}
                        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => {
                          setCustomer(cust);
                          setShowCustomerDialog(false);
                          setCustomerSearch("");
                          playBeep();
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <User className="h-8 w-8 text-blue-600" />
                            <div>
                              <p className="font-semibold">{cust.name}</p>
                              <p className="text-sm text-gray-600">{cust.phone}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="mb-1">
                              {cust.tier_name}
                            </Badge>
                            <p className="text-sm text-gray-600">
                              {cust.loyalty_points.toLocaleString()} pts
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              </ScrollArea>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCustomerDialog(false);
                  setCustomerSearch("");
                }}
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
