"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/registry/new-york-v4/ui/button";
import { Input } from "@/registry/new-york-v4/ui/input";
import { Label } from "@/registry/new-york-v4/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/registry/new-york-v4/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/new-york-v4/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/registry/new-york-v4/ui/dialog";
import { ScrollArea } from "@/registry/new-york-v4/ui/scroll-area";
import { Separator } from "@/registry/new-york-v4/ui/separator";
import { Badge } from "@/registry/new-york-v4/ui/badge";
import { toast } from "sonner";
import { 
  Plus, 
  Trash2, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  QrCode, 
  CheckCircle,
  AlertCircle,
  Calculator
} from "lucide-react";

interface Payment {
  id: string;
  method: string;
  amount: number;
  reference?: string;
  provider?: string;
  tender_amount?: number; // For cash payments
  change_amount?: number; // For cash payments
}

interface MultiPaymentSplitProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  totalAmount: number;
  onComplete: (payments: Payment[]) => void;
}

const PAYMENT_METHODS = [
  { 
    value: "Cash", 
    label: "Cash", 
    icon: Banknote, 
    color: "bg-green-100 text-green-700",
    requiresReference: false,
    provideTender: true
  },
  { 
    value: "Debit Card", 
    label: "Debit Card", 
    icon: CreditCard, 
    color: "bg-blue-100 text-blue-700",
    requiresReference: true,
    provideTender: false
  },
  { 
    value: "Credit Card", 
    label: "Credit Card", 
    icon: CreditCard, 
    color: "bg-purple-100 text-purple-700",
    requiresReference: true,
    provideTender: false
  },
  { 
    value: "GoPay", 
    label: "GoPay", 
    icon: Smartphone, 
    color: "bg-emerald-100 text-emerald-700",
    requiresReference: true,
    provideTender: false,
    provider: "gopay"
  },
  { 
    value: "OVO", 
    label: "OVO", 
    icon: Smartphone, 
    color: "bg-indigo-100 text-indigo-700",
    requiresReference: true,
    provideTender: false,
    provider: "ovo"
  },
  { 
    value: "DANA", 
    label: "DANA", 
    icon: Smartphone, 
    color: "bg-cyan-100 text-cyan-700",
    requiresReference: true,
    provideTender: false,
    provider: "dana"
  },
  { 
    value: "ShopeePay", 
    label: "ShopeePay", 
    icon: Smartphone, 
    color: "bg-orange-100 text-orange-700",
    requiresReference: true,
    provideTender: false,
    provider: "shopeepay"
  },
  { 
    value: "QRIS", 
    label: "QRIS", 
    icon: QrCode, 
    color: "bg-red-100 text-red-700",
    requiresReference: true,
    provideTender: false
  },
  { 
    value: "Bank Transfer", 
    label: "Bank Transfer", 
    icon: CreditCard, 
    color: "bg-gray-100 text-gray-700",
    requiresReference: true,
    provideTender: false
  },
];

export function MultiPaymentSplit({ open, onOpenChange, totalAmount, onComplete }: MultiPaymentSplitProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedMethod, setSelectedMethod] = useState("Cash");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [tenderAmount, setTenderAmount] = useState("");
  const [processing, setProcessing] = useState(false);

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const remaining = totalAmount - totalPaid;
  const isComplete = Math.abs(remaining) < 0.01; // Account for floating point
  const overpaid = totalPaid > totalAmount;
  const changeAmount = overpaid ? totalPaid - totalAmount : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const addPayment = () => {
    const paymentAmount = parseFloat(amount);
    if (!paymentAmount || paymentAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (paymentAmount > remaining) {
      alert(`Amount exceeds remaining balance of ${formatCurrency(remaining)}`);
      return;
    }

    const newPayment: Payment = {
      id: Date.now().toString(),
      method: selectedMethod,
      amount: paymentAmount,
      reference: reference || undefined,
    };

    setPayments([...payments, newPayment]);
    setAmount("");
    setReference("");
    setSelectedMethod("Cash");
  };

  const removePayment = (id: string) => {
    setPayments(payments.filter((p) => p.id !== id));
  };

  const updatePayment = (id: string, field: keyof Payment, value: any) => {
    setPayments(
      payments.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleQuickAmount = (percentage: number) => {
    const quickAmount = Math.ceil((remaining * percentage) / 100);
    setAmount(quickAmount.toString());
  };

  const handleComplete = () => {
    if (!isComplete) {
      alert(`Please pay the remaining ${formatCurrency(remaining)}`);
      return;
    }

    onComplete(payments);
    onOpenChange(false);
    
    // Reset
    setPayments([{ id: "1", method: "Cash", amount: 0, reference: "" }]);
    setAmount("");
    setReference("");
  };

  const getMethodIcon = (method: string) => {
    const methodConfig = PAYMENT_METHODS.find((m) => m.value === method);
    return methodConfig || PAYMENT_METHODS[0];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Split Payment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Summary Card */}
          <Card className="p-4 bg-gray-50">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-lg font-bold">{formatCurrency(totalAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Paid</p>
                <p className="text-lg font-bold text-blue-600">{formatCurrency(totalPaid)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Remaining</p>
                <p className={`text-lg font-bold ${remaining > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(remaining)}
                </p>
              </div>
            </div>
          </Card>

          {/* Add Payment Section */}
          {remaining > 0 && (
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Add Payment</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Payment Method</Label>
                  <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_METHODS.map((method) => {
                        const Icon = method.icon;
                        return (
                          <SelectItem key={method.value} value={method.value}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              {method.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addPayment();
                      }
                    }}
                  />
                </div>

                {["Debit Card", "Credit Card", "Bank Transfer", "QRIS", "GoPay", "OVO", "DANA"].includes(selectedMethod) && (
                  <div className="col-span-2">
                    <Label>Reference Number (Optional)</Label>
                    <Input
                      placeholder="Transaction ID / Approval Code"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Quick Amount Buttons */}
              <div className="flex gap-2 mt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAmount(25)}
                >
                  25%
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAmount(50)}
                >
                  50%
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAmount(75)}
                >
                  75%
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(remaining.toString())}
                >
                  Remaining
                </Button>
                <Button
                  type="button"
                  onClick={addPayment}
                  className="ml-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </Card>
          )}

          {/* Payment List */}
          <div>
            <h3 className="font-semibold mb-3">Payment Breakdown</h3>
            <ScrollArea className="max-h-[300px]">
              <div className="space-y-2">
                {payments.map((payment, index) => {
                  const methodConfig = getMethodIcon(payment.method);
                  const Icon = methodConfig.icon;

                  return (
                    <Card key={payment.id} className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`h-10 w-10 rounded-full ${methodConfig.color} flex items-center justify-center flex-shrink-0`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">{payment.method}</p>
                              <span className="text-xs text-gray-500">#{index + 1}</span>
                            </div>
                            {payment.reference && (
                              <p className="text-xs text-gray-600 mt-1">
                                Ref: {payment.reference}
                              </p>
                            )}
                            <div className="mt-2">
                              <Input
                                type="number"
                                value={payment.amount}
                                onChange={(e) =>
                                  updatePayment(payment.id, "amount", parseFloat(e.target.value) || 0)
                                }
                                className="w-full"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <p className="text-lg font-bold">{formatCurrency(payment.amount)}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removePayment(payment.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Completion Status */}
          {isComplete && (
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="flex items-center gap-2 text-green-700">
                <CreditCard className="h-5 w-5" />
                <p className="font-semibold">Payment Complete! Ready to process.</p>
              </div>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleComplete} disabled={!isComplete}>
            Complete Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
