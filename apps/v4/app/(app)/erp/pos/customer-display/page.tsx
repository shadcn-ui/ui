"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/registry/new-york-v4/ui/card";
import { Badge } from "@/registry/new-york-v4/ui/badge";
import { Separator } from "@/registry/new-york-v4/ui/separator";
import { ScrollArea } from "@/registry/new-york-v4/ui/scroll-area";
import { ShoppingCart, Star, Gift, TrendingUp } from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  brand?: string;
  quantity: number;
  unit_price: number;
  discount: number;
  total: number;
  primary_image_url?: string;
}

interface CustomerDisplayProps {
  cart: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  loyaltyPointsEarned?: number;
  customerTier?: string;
  storeName?: string;
  storeLogo?: string;
  promotions?: Array<{
    title: string;
    description: string;
    image?: string;
  }>;
}

export function CustomerDisplay({
  cart = [],
  subtotal = 0,
  tax = 0,
  discount = 0,
  total = 0,
  loyaltyPointsEarned = 0,
  customerTier,
  storeName = "Beauty Store",
  storeLogo,
  promotions = [],
}: CustomerDisplayProps) {
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const [showPromotion, setShowPromotion] = useState(false);

  // Rotate promotions every 5 seconds
  useEffect(() => {
    if (promotions.length > 0 && cart.length === 0) {
      setShowPromotion(true);
      const interval = setInterval(() => {
        setCurrentPromoIndex((prev) => (prev + 1) % promotions.length);
      }, 5000);
      return () => clearInterval(interval);
    } else {
      setShowPromotion(false);
    }
  }, [promotions.length, cart.length]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Show promotions when cart is empty
  if (showPromotion && promotions.length > 0) {
    const currentPromo = promotions[currentPromoIndex];
    
    return (
      <div className="h-screen flex flex-col bg-gradient-to-br from-pink-50 to-purple-50 p-8">
        <div className="text-center mb-8">
          {storeLogo ? (
            <img src={storeLogo} alt={storeName} className="h-20 mx-auto mb-4" />
          ) : (
            <h1 className="text-4xl font-bold text-gray-800">{storeName}</h1>
          )}
          <p className="text-xl text-gray-600">Welcome! Selamat Datang!</p>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <Card className="max-w-4xl w-full p-12 bg-white shadow-2xl">
            {currentPromo.image && (
              <img
                src={currentPromo.image}
                alt={currentPromo.title}
                className="w-full h-80 object-cover rounded-lg mb-6"
              />
            )}
            <div className="text-center">
              <h2 className="text-5xl font-bold text-gray-800 mb-4">
                {currentPromo.title}
              </h2>
              <p className="text-2xl text-gray-600">
                {currentPromo.description}
              </p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8">
          <Card className="p-6 text-center bg-white/80">
            <Gift className="h-12 w-12 mx-auto mb-3 text-pink-600" />
            <p className="font-semibold text-lg">Free Samples</p>
            <p className="text-sm text-gray-600">With every purchase</p>
          </Card>
          <Card className="p-6 text-center bg-white/80">
            <Star className="h-12 w-12 mx-auto mb-3 text-yellow-600" />
            <p className="font-semibold text-lg">Loyalty Points</p>
            <p className="text-sm text-gray-600">Earn with every purchase</p>
          </Card>
          <Card className="p-6 text-center bg-white/80">
            <TrendingUp className="h-12 w-12 mx-auto mb-3 text-green-600" />
            <p className="font-semibold text-lg">Best Prices</p>
            <p className="text-sm text-gray-600">Guaranteed quality</p>
          </Card>
        </div>
      </div>
    );
  }

  // Show transaction when items in cart
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {storeLogo ? (
              <img src={storeLogo} alt={storeName} className="h-16" />
            ) : (
              <h1 className="text-3xl font-bold text-gray-800">{storeName}</h1>
            )}
          </div>
          {customerTier && (
            <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600">
              <Star className="h-5 w-5 mr-2" />
              {customerTier} Member
            </Badge>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="grid grid-cols-2 gap-6 h-full">
          {/* Left: Cart Items */}
          <Card className="p-6 bg-white shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Your Items</h2>
                <p className="text-gray-600">{cart.length} items</p>
              </div>
            </div>

            <ScrollArea className="h-[calc(100%-120px)]">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 py-20">
                  <ShoppingCart className="h-24 w-24 mb-4" />
                  <p className="text-2xl">Start shopping!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <Card key={item.id} className="p-4 bg-gray-50 border-2">
                      <div className="flex gap-4">
                        {item.primary_image_url && (
                          <img
                            src={item.primary_image_url}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                          {item.brand && (
                            <p className="text-sm text-gray-600 mb-2">{item.brand}</p>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="text-sm">
                              <span className="font-semibold text-gray-700">
                                {item.quantity} x {formatCurrency(item.unit_price)}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-gray-800">
                                {formatCurrency(item.total)}
                              </p>
                              {item.discount > 0 && (
                                <p className="text-sm text-green-600">
                                  Save {formatCurrency(item.discount)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </Card>

          {/* Right: Total Summary */}
          <Card className="p-6 bg-white shadow-lg flex flex-col">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            <div className="flex-1 flex flex-col justify-center">
              <div className="space-y-4 text-lg">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">{formatCurrency(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-semibold">-{formatCurrency(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (11%)</span>
                  <span className="font-semibold">{formatCurrency(tax)}</span>
                </div>

                <Separator className="my-2" />

                <div className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                  <span className="text-3xl font-bold text-gray-800">TOTAL</span>
                  <span className="text-5xl font-bold text-blue-600">
                    {formatCurrency(total)}
                  </span>
                </div>

                {loyaltyPointsEarned > 0 && (
                  <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                    <div className="flex items-center justify-center gap-3">
                      <Star className="h-10 w-10 text-yellow-600" />
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">You will earn</p>
                        <p className="text-4xl font-bold text-yellow-700">
                          +{loyaltyPointsEarned.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">Loyalty Points</p>
                      </div>
                      <Star className="h-10 w-10 text-yellow-600" />
                    </div>
                  </Card>
                )}
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-600 text-lg">Thank you for shopping with us!</p>
              <p className="text-gray-500 mt-2">Terima kasih!</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Standalone page component
export default function CustomerDisplayPage() {
  const [displayData, setDisplayData] = useState<CustomerDisplayProps>({
    cart: [],
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
    loyaltyPointsEarned: 0,
    customerTier: undefined,
    storeName: "Beauty Store Jakarta",
    promotions: [
      {
        title: "🎉 Grand Opening Sale!",
        description: "Get up to 50% OFF on selected skincare products",
      },
      {
        title: "💎 Join Our Loyalty Program",
        description: "Earn points with every purchase and get exclusive rewards",
      },
      {
        title: "🎁 Free Gift with Purchase",
        description: "Spend IDR 500,000 or more and get a FREE luxury sample kit",
      },
    ],
  });

  // Listen for updates from main POS terminal
  useEffect(() => {
    // Use BroadcastChannel API for cross-tab communication
    const channel = new BroadcastChannel("pos-customer-display");

    channel.onmessage = (event) => {
      setDisplayData(event.data);
    };

    return () => {
      channel.close();
    };
  }, []);

  return <CustomerDisplay {...displayData} />;
}

// Helper function to send updates from main POS
export function updateCustomerDisplay(data: CustomerDisplayProps) {
  if (typeof window !== "undefined" && window.BroadcastChannel) {
    const channel = new BroadcastChannel("pos-customer-display");
    channel.postMessage(data);
    channel.close();
  }
}
