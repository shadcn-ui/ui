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
  Calculator,
  Receipt
} from "lucide-react";

interface Payment {
  id: string;
  method: string;
  amount: number;
  reference?: string;
  provider?: string;
  tender_amount?: number;
  change_amount?: number;
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
    color: "bg-green-100 text-green-700 border-green-200",
    requiresReference: false,
    provideTender: true,
    description: "Physical cash payment"
  },
  { 
    value: "Debit Card", 
    label: "Debit Card", 
    icon: CreditCard, 
    color: "bg-blue-100 text-blue-700 border-blue-200",
    requiresReference: true,
    provideTender: false,
    description: "Card terminal transaction"
  },
  { 
    value: "Credit Card", 
    label: "Credit Card", 
    icon: CreditCard, 
    color: "bg-purple-100 text-purple-700 border-purple-200",
    requiresReference: true,
    provideTender: false,
    description: "Credit card payment"
  },
  { 
    value: "GoPay", 
    label: "GoPay", 
    icon: Smartphone, 
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    requiresReference: true,
    provideTender: false,
    provider: "gopay",
    description: "GoPay e-wallet"
  },
  { 
    value: "OVO", 
    label: "OVO", 
    icon: Smartphone, 
    color: "bg-indigo-100 text-indigo-700 border-indigo-200",
    requiresReference: true,
    provideTender: false,
    provider: "ovo",
    description: "OVO e-wallet"
  },
  { 
    value: "DANA", 
    label: "DANA", 
    icon: Smartphone, 
    color: "bg-cyan-100 text-cyan-700 border-cyan-200",
    requiresReference: true,
    provideTender: false,
    provider: "dana",
    description: "DANA e-wallet"
  },
  { 
    value: "ShopeePay", 
    label: "ShopeePay", 
    icon: Smartphone, 
    color: "bg-orange-100 text-orange-700 border-orange-200",
    requiresReference: true,
    provideTender: false,
    provider: "shopeepay",
    description: "ShopeePay e-wallet"
  },
  { 
    value: "QRIS", 
    label: "QRIS", 
    icon: QrCode, 
    color: "bg-red-100 text-red-700 border-red-200",
    requiresReference: true,
    provideTender: false,
    description: "Universal QR payment"
  },
  { 
    value: "Bank Transfer", 
    label: "Bank Transfer", 
    icon: CreditCard, 
    color: "bg-gray-100 text-gray-700 border-gray-200",
    requiresReference: true,
    provideTender: false,
    description: "Direct bank transfer"
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
  const isComplete = Math.abs(remaining) < 0.01;
  const overpaid = totalPaid > totalAmount;
  const changeAmount = overpaid ? totalPaid - totalAmount : 0;

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setPayments([]);
      setAmount("");
      setReference("");
      setTenderAmount("");
      setSelectedMethod("Cash");
      setProcessing(false);
    }
  }, [open]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getPaymentMethodConfig = (methodValue: string) => {
    return PAYMENT_METHODS.find(m => m.value === methodValue);
  };

  const addPayment = () => {
    const paymentAmount = parseFloat(amount);
    if (!paymentAmount || paymentAmount <= 0) {
      toast.error("Please enter a valid payment amount");
      return;
    }

    if (paymentAmount > remaining + 0.01) {
      toast.error("Payment amount cannot exceed remaining balance");
      return;
    }

    const methodConfig = getPaymentMethodConfig(selectedMethod);
    
    // Validate reference for methods that require it
    if (methodConfig?.requiresReference && !reference.trim()) {
      toast.error(`${selectedMethod} requires a reference number`);
      return;
    }

    const newPayment: Payment = {
      id: Date.now().toString(),
      method: selectedMethod,
      amount: paymentAmount,
      reference: reference.trim() || undefined,
      provider: methodConfig?.provider,
    };

    // Handle cash payments with tender amount
    if (selectedMethod === "Cash" && tenderAmount) {
      const tender = parseFloat(tenderAmount);
      if (tender >= paymentAmount) {
        newPayment.tender_amount = tender;
        newPayment.change_amount = tender - paymentAmount;
      }
    }

    setPayments([...payments, newPayment]);
    setAmount("");
    setReference("");
    setTenderAmount("");
    
    toast.success(`${selectedMethod} payment added`);

    // Auto-complete if this payment completes the transaction
    const newTotalPaid = totalPaid + paymentAmount;
    if (Math.abs(totalAmount - newTotalPaid) < 0.01) {
      // Small delay to show the added payment before completing
      setTimeout(() => {
        handleComplete([...payments, newPayment]);
      }, 800);
    }
  };

  const removePayment = (id: string) => {
    const payment = payments.find(p => p.id === id);
    setPayments(payments.filter((p) => p.id !== id));
    if (payment) {
      toast.success(`${payment.method} payment removed`);
    }
  };

  const handleQuickAmount = (percentage: number) => {
    const quickAmount = Math.ceil((remaining * percentage) / 100);
    setAmount(quickAmount.toString());
    
    // For cash payments, also set tender amount to a round number
    if (selectedMethod === "Cash") {
      // Round up to nearest 1000, 5000, 10000, etc.
      let tender = quickAmount;
      if (quickAmount <= 10000) {
        tender = Math.ceil(quickAmount / 1000) * 1000;
      } else if (quickAmount <= 50000) {
        tender = Math.ceil(quickAmount / 5000) * 5000;
      } else {
        tender = Math.ceil(quickAmount / 10000) * 10000;
      }
      setTenderAmount(tender.toString());
    }
  };

  const handlePayExact = () => {
    setAmount(remaining.toFixed(0));
    if (selectedMethod === "Cash") {
      setTenderAmount(remaining.toFixed(0));
    }
  };

  const handleComplete = (paymentsToSubmit = payments) => {
    if (paymentsToSubmit.length === 0) {
      toast.error("Please add at least one payment method");
      return;
    }

    const totalPaymentAmount = paymentsToSubmit.reduce((sum, p) => sum + p.amount, 0);
    
    if (Math.abs(totalAmount - totalPaymentAmount) > 0.01) {
      toast.error("Payment amounts must equal the total amount");
      return;
    }

    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      onComplete(paymentsToSubmit);
      setProcessing(false);
      onOpenChange(false);
      toast.success("Payment processed successfully!");
    }, 1200);
  };

  const selectedMethodConfig = getPaymentMethodConfig(selectedMethod);
  const cashChange = selectedMethod === "Cash" && tenderAmount && parseFloat(amount) 
    ? Math.max(0, parseFloat(tenderAmount) - parseFloat(amount))
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Processing
          </DialogTitle>
        </DialogHeader>
          {/* Scrollable body */}
          <div className="flex-1 overflow-auto p-4">
            <div className="flex flex-col h-full space-y-4">
          {/* Payment Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Payment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-lg font-bold">{formatCurrency(totalAmount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Paid</p>
                  <p className="text-lg font-bold text-blue-600">{formatCurrency(totalPaid)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Remaining</p>
                  <p className={`text-lg font-bold ${remaining > 0.01 ? 'text-red-600' : 'text-green-600'}`}>
                    {formatCurrency(remaining)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <div className="flex justify-center">
                    {isComplete ? (
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Complete
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-orange-600 border-orange-200">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 flex-1 min-h-0">
            {/* Left: Add Payment */}
            <div className="flex-1">
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Add Payment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Payment Method Selection */}
                  <div>
                    <Label className="text-sm font-medium">Payment Method</Label>
                    <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PAYMENT_METHODS.map((method) => {
                          const Icon = method.icon;
                          return (
                            <SelectItem key={method.value} value={method.value}>
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                <div>
                                  <p>{method.label}</p>
                                  <p className="text-xs text-gray-500">{method.description}</p>
                                </div>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Quick Amount Buttons */}
                  <div>
                    <Label className="text-sm font-medium">Quick Amount</Label>
                    <div className="grid grid-cols-4 gap-2 mt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAmount(25)}
                        disabled={remaining <= 0}
                      >
                        25%
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAmount(50)}
                        disabled={remaining <= 0}
                      >
                        50%
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAmount(75)}
                        disabled={remaining <= 0}
                      >
                        75%
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePayExact}
                        disabled={remaining <= 0}
                      >
                        Exact
                      </Button>
                    </div>
                  </div>

                  {/* Amount Input */}
                  <div>
                    <Label className="text-sm font-medium">Payment Amount</Label>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="mt-1"
                      max={remaining}
                    />
                  </div>

                  {/* Cash Tender Amount */}
                  {selectedMethodConfig?.provideTender && (
                    <div>
                      <Label className="text-sm font-medium">Cash Tendered</Label>
                      <Input
                        type="number"
                        placeholder="Amount received"
                        value={tenderAmount}
                        onChange={(e) => setTenderAmount(e.target.value)}
                        className="mt-1"
                      />
                      {cashChange > 0 && (
                        <p className="text-sm text-blue-600 mt-1">
                          Change: {formatCurrency(cashChange)}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Reference Number */}
                  {selectedMethodConfig?.requiresReference && (
                    <div>
                      <Label className="text-sm font-medium">
                        Reference Number *
                      </Label>
                      <Input
                        placeholder="Transaction ID, approval code, etc."
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  )}

                  {/* Add Payment Button */}
                  <Button
                    className="w-full"
                    onClick={addPayment}
                    disabled={!amount || parseFloat(amount) <= 0 || remaining <= 0}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add {selectedMethod} Payment
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right: Payment List */}
            <div className="flex-1">
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Receipt className="w-5 h-5" />
                    Payment Methods ({payments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {payments.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <CreditCard className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                          <p>No payments added yet</p>
                          <p className="text-sm">Add payment methods on the left</p>
                        </div>
                      ) : (
                        payments.map((payment) => {
                          const methodConfig = getPaymentMethodConfig(payment.method);
                          const Icon = methodConfig?.icon || CreditCard;
                          
                          return (
                            <Card key={payment.id} className="p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-full ${methodConfig?.color}`}>
                                    <Icon className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <p className="font-medium">{payment.method}</p>
                                    <p className="text-sm text-gray-600">
                                      {formatCurrency(payment.amount)}
                                    </p>
                                    {payment.reference && (
                                      <p className="text-xs text-gray-500">
                                        Ref: {payment.reference}
                                      </p>
                                    )}
                                    {payment.change_amount && payment.change_amount > 0 && (
                                      <p className="text-xs text-blue-600">
                                        Change: {formatCurrency(payment.change_amount)}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                  onClick={() => removePayment(payment.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </Card>
                          );
                        })
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2 sticky bottom-0 bg-white/70 backdrop-blur py-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={processing}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleComplete()}
            disabled={!isComplete || processing}
            className="min-w-32"
          >
            {processing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-1" />
                Complete Payment
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}