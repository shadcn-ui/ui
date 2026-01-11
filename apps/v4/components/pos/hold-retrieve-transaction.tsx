"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/registry/new-york-v4/ui/button";
import { Input } from "@/registry/new-york-v4/ui/input";
import { Label } from "@/registry/new-york-v4/ui/label";
import { Card } from "@/registry/new-york-v4/ui/card";
import { Badge } from "@/registry/new-york-v4/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/registry/new-york-v4/ui/dialog";
import { ScrollArea } from "@/registry/new-york-v4/ui/scroll-area";
import { Separator } from "@/registry/new-york-v4/ui/separator";
import { Clock, Search, User, ShoppingCart, Calendar, X } from "lucide-react";

interface HeldTransaction {
  id: string;
  holdNumber: string;
  timestamp: Date;
  customerName?: string;
  customerPhone?: string;
  items: Array<{
    product_id: number;
    name: string;
    quantity: number;
    unit_price: number;
  }>;
  totalAmount: number;
  itemCount: number;
  expiresAt: Date;
}

interface HoldTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: any[];
  customer: any | null;
  totalAmount: number;
  onHoldSaved: () => void;
}

interface RetrieveTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRetrieve: (transaction: HeldTransaction) => void;
}

const HOLD_STORAGE_KEY = "pos-held-transactions";
const HOLD_EXPIRY_MINUTES = 30;

// Helper functions for localStorage
function getHeldTransactions(): HeldTransaction[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(HOLD_STORAGE_KEY);
  if (!stored) return [];
  
  const transactions: HeldTransaction[] = JSON.parse(stored);
  
  // Convert date strings back to Date objects and filter expired
  const now = new Date();
  const active = transactions
    .map((t) => ({
      ...t,
      timestamp: new Date(t.timestamp),
      expiresAt: new Date(t.expiresAt),
    }))
    .filter((t) => t.expiresAt > now);
  
  // Save back without expired transactions
  localStorage.setItem(HOLD_STORAGE_KEY, JSON.stringify(active));
  return active;
}

function saveHeldTransaction(transaction: HeldTransaction) {
  const transactions = getHeldTransactions();
  transactions.push(transaction);
  localStorage.setItem(HOLD_STORAGE_KEY, JSON.stringify(transactions));
}

function removeHeldTransaction(id: string) {
  const transactions = getHeldTransactions();
  const filtered = transactions.filter((t) => t.id !== id);
  localStorage.setItem(HOLD_STORAGE_KEY, JSON.stringify(filtered));
}

// Hold Transaction Dialog
export function HoldTransactionDialog({
  open,
  onOpenChange,
  cart,
  customer,
  totalAmount,
  onHoldSaved,
}: HoldTransactionDialogProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  useEffect(() => {
    if (customer) {
      setCustomerName(customer.name || "");
      setCustomerPhone(customer.phone || "");
    }
  }, [customer]);

  const handleSave = () => {
    if (cart.length === 0) {
      alert("Cannot hold empty cart");
      return;
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + HOLD_EXPIRY_MINUTES * 60 * 1000);
    const holdNumber = `HOLD-${Date.now().toString().slice(-6)}`;

    const heldTransaction: HeldTransaction = {
      id: Date.now().toString(),
      holdNumber,
      timestamp: now,
      customerName: customerName || undefined,
      customerPhone: customerPhone || undefined,
      items: cart.map((item) => ({
        product_id: item.product_id,
        name: item.name,
        quantity: item.quantity,
        unit_price: item.unit_price,
      })),
      totalAmount,
      itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
      expiresAt,
    };

    saveHeldTransaction(heldTransaction);
    alert(`Transaction held! Hold number: ${holdNumber}`);
    onHoldSaved();
    onOpenChange(false);
    setCustomerName("");
    setCustomerPhone("");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Hold Transaction</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center gap-2 text-sm text-blue-900 mb-2">
              <Clock className="h-4 w-4" />
              <span className="font-semibold">Will expire in {HOLD_EXPIRY_MINUTES} minutes</span>
            </div>
            <p className="text-xs text-blue-700">
              Transaction will be automatically removed after {HOLD_EXPIRY_MINUTES} minutes if not retrieved.
            </p>
          </Card>

          <div>
            <Label>Customer Name (Optional)</Label>
            <Input
              placeholder="Enter customer name for easier retrieval"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          <div>
            <Label>Customer Phone (Optional)</Label>
            <Input
              placeholder="Enter phone number"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
          </div>

          <Separator />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Items:</span>
              <span className="font-semibold">{cart.length} products</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-semibold">{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Hold Transaction
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Retrieve Transaction Dialog
export function RetrieveTransactionDialog({
  open,
  onOpenChange,
  onRetrieve,
}: RetrieveTransactionDialogProps) {
  const [transactions, setTransactions] = useState<HeldTransaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (open) {
      loadTransactions();
    }
  }, [open]);

  const loadTransactions = () => {
    const held = getHeldTransactions();
    setTransactions(held);
  };

  const handleRetrieve = (transaction: HeldTransaction) => {
    removeHeldTransaction(transaction.id);
    onRetrieve(transaction);
    onOpenChange(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this held transaction?")) {
      removeHeldTransaction(id);
      loadTransactions();
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    const query = searchQuery.toLowerCase();
    return (
      t.holdNumber.toLowerCase().includes(query) ||
      t.customerName?.toLowerCase().includes(query) ||
      t.customerPhone?.includes(query)
    );
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeRemaining = (expiresAt: Date) => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    const minutes = Math.floor(diff / 60000);
    return minutes;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Retrieve Held Transaction</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by hold number, customer name, or phone..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Transaction List */}
          <ScrollArea className="h-[400px]">
            {filteredTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 py-12">
                <ShoppingCart className="h-16 w-16 mb-4" />
                <p className="text-lg">No held transactions found</p>
                <p className="text-sm">Held transactions expire after {HOLD_EXPIRY_MINUTES} minutes</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTransactions.map((transaction) => {
                  const timeRemaining = getTimeRemaining(transaction.expiresAt);
                  const isExpiringSoon = timeRemaining < 10;

                  return (
                    <Card
                      key={transaction.id}
                      className={`p-4 hover:shadow-lg transition-shadow cursor-pointer ${
                        isExpiringSoon ? "border-red-200 bg-red-50" : ""
                      }`}
                      onClick={() => handleRetrieve(transaction)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="font-mono">{transaction.holdNumber}</Badge>
                            <Badge
                              variant={isExpiringSoon ? "destructive" : "outline"}
                              className="text-xs"
                            >
                              <Clock className="h-3 w-3 mr-1" />
                              {timeRemaining} min left
                            </Badge>
                          </div>

                          {transaction.customerName && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                              <User className="h-4 w-4" />
                              <span>{transaction.customerName}</span>
                              {transaction.customerPhone && (
                                <span className="text-gray-400">• {transaction.customerPhone}</span>
                              )}
                            </div>
                          )}

                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatTime(transaction.timestamp)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ShoppingCart className="h-4 w-4" />
                              <span>{transaction.itemCount} items</span>
                            </div>
                          </div>

                          <div className="mt-3">
                            <p className="text-xs text-gray-500 mb-1">Items:</p>
                            <div className="text-sm space-y-1">
                              {transaction.items.slice(0, 3).map((item, idx) => (
                                <div key={idx} className="text-gray-700">
                                  {item.quantity}x {item.name}
                                </div>
                              ))}
                              {transaction.items.length > 3 && (
                                <div className="text-gray-500 text-xs">
                                  +{transaction.items.length - 3} more items...
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right flex flex-col items-end gap-2">
                          <p className="text-xl font-bold">{formatCurrency(transaction.totalAmount)}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(transaction.id);
                            }}
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
