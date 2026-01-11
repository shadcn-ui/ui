"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card";
import { Button } from "@/registry/new-york-v4/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/new-york-v4/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/new-york-v4/ui/dialog";
import { Input } from "@/registry/new-york-v4/ui/input";
import { Label } from "@/registry/new-york-v4/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select";
import { Badge } from "@/registry/new-york-v4/ui/badge";
import { Skeleton } from "@/registry/new-york-v4/ui/skeleton";
import { Textarea } from "@/registry/new-york-v4/ui/textarea";
import {
  AlertCircle,
  DollarSign,
  Clock,
  CheckCircle,
  Search,
  Filter,
  Eye,
  CreditCard,
  History,
} from "lucide-react";

interface AccountsPayable {
  id: number;
  supplier_name: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  amount: number;
  paid_amount: number;
  balance: number;
  status: string;
  description?: string;
  payment_terms?: string;
  created_at: string;
}

interface Payment {
  id: number;
  payment_date: string;
  amount: number;
  payment_method: string;
  reference_number?: string;
  notes?: string;
}

interface APStats {
  totalOutstanding: number;
  totalOverdue: number;
  overdueCount: number;
  upcomingDue: number;
}

export default function AccountsPayablePage() {
  const [payables, setPayables] = useState<AccountsPayable[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedPayable, setSelectedPayable] = useState<AccountsPayable | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<APStats>({
    totalOutstanding: 0,
    totalOverdue: 0,
    overdueCount: 0,
    upcomingDue: 0,
  });

  // Payment form state
  const [paymentForm, setPaymentForm] = useState({
    payment_date: new Date().toISOString().split("T")[0],
    amount: "",
    payment_method: "bank_transfer",
    reference_number: "",
    notes: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/accounting/accounts-payable");
      if (response.ok) {
        const data = await response.json();
        // Handle both array and object response formats
        const payablesArray = Array.isArray(data) ? data : (data.payables || []);
        setPayables(payablesArray);
        calculateStats(payablesArray);
      }
    } catch (error) {
      console.error("Error fetching payables:", error);
      setPayables([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: AccountsPayable[]) => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    const stats = data.reduce(
      (acc, payable) => {
        if (payable.status !== "paid") {
          acc.totalOutstanding += payable.balance;

          const dueDate = new Date(payable.due_date);
          if (dueDate < today) {
            acc.totalOverdue += payable.balance;
            acc.overdueCount += 1;
          } else if (dueDate <= nextWeek) {
            acc.upcomingDue += payable.balance;
          }
        }
        return acc;
      },
      { totalOutstanding: 0, totalOverdue: 0, overdueCount: 0, upcomingDue: 0 }
    );

    setStats(stats);
  };

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysOverdue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = (status: string, dueDate: string) => {
    if (status === "paid") {
      return (
        <Badge variant="default" className="bg-green-600">
          <CheckCircle className="mr-1 h-3 w-3" />
          Paid
        </Badge>
      );
    }

    const daysOverdue = getDaysOverdue(dueDate);
    if (daysOverdue > 0) {
      return (
        <Badge variant="destructive">
          <AlertCircle className="mr-1 h-3 w-3" />
          Overdue ({daysOverdue}d)
        </Badge>
      );
    }

    if (status === "partially_paid") {
      return (
        <Badge variant="secondary">
          <Clock className="mr-1 h-3 w-3" />
          Partial
        </Badge>
      );
    }

    return (
      <Badge variant="secondary">
        <Clock className="mr-1 h-3 w-3" />
        Unpaid
      </Badge>
    );
  };

  const handleOpenPaymentDialog = (payable: AccountsPayable) => {
    setSelectedPayable(payable);
    setPaymentForm({
      payment_date: new Date().toISOString().split("T")[0],
      amount: payable.balance.toString(),
      payment_method: "bank_transfer",
      reference_number: "",
      notes: "",
    });
    setIsPaymentDialogOpen(true);
  };

  const handleViewDetails = (payable: AccountsPayable) => {
    setSelectedPayable(payable);
    setIsViewDialogOpen(true);
  };

  const handleViewHistory = async (payable: AccountsPayable) => {
    setSelectedPayable(payable);
    try {
      const response = await fetch(
        `/api/accounting/accounts-payable/${payable.id}/payments`
      );
      if (response.ok) {
        const data = await response.json();
        setPayments(data);
      }
    } catch (error) {
      console.error("Error fetching payment history:", error);
      setPayments([]);
    }
    setIsHistoryDialogOpen(true);
  };

  const handleSubmitPayment = async () => {
    if (!selectedPayable) return;

    const amount = parseFloat(paymentForm.amount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid payment amount");
      return;
    }

    if (amount > selectedPayable.balance) {
      alert("Payment amount cannot exceed the outstanding balance");
      return;
    }

    try {
      const response = await fetch(
        `/api/accounting/accounts-payable/${selectedPayable.id}/payment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            payment_date: paymentForm.payment_date,
            amount,
            payment_method: paymentForm.payment_method,
            reference_number: paymentForm.reference_number || null,
            notes: paymentForm.notes || null,
          }),
        }
      );

      if (response.ok) {
        await fetchData();
        setIsPaymentDialogOpen(false);
        setSelectedPayable(null);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || "Failed to record payment"}`);
      }
    } catch (error) {
      console.error("Error recording payment:", error);
      alert("Failed to record payment");
    }
  };

  const filterPayables = () => {
    return payables.filter((payable) => {
      const matchesSearch =
        payable.supplier_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payable.invoice_number.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || payable.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  };

  const filteredPayables = filterPayables();

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Accounts Payable</h1>
          <p className="text-muted-foreground">
            Manage supplier invoices and payments
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Outstanding</CardDescription>
            <CardTitle className="text-2xl">
              {formatIDR(stats.totalOutstanding)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground">
              <DollarSign className="mr-1 h-4 w-4" />
              All unpaid bills
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Overdue Amount</CardDescription>
            <CardTitle className="text-2xl text-red-600">
              {formatIDR(stats.totalOverdue)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground">
              <AlertCircle className="mr-1 h-4 w-4" />
              {stats.overdueCount} bills overdue
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Due This Week</CardDescription>
            <CardTitle className="text-2xl text-orange-600">
              {formatIDR(stats.upcomingDue)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-1 h-4 w-4" />
              Next 7 days
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Bills</CardDescription>
            <CardTitle className="text-2xl">{payables.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground">
              <CheckCircle className="mr-1 h-4 w-4" />
              All statuses
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payables Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Supplier Bills</CardTitle>
              <CardDescription>
                {filteredPayables.length} bills found
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="partially_paid">Partial</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier</TableHead>
                <TableHead>Invoice #</TableHead>
                <TableHead>Invoice Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Paid</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayables.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    No bills found
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayables.map((payable) => {
                  const isOverdue =
                    payable.status !== "paid" &&
                    getDaysOverdue(payable.due_date) > 0;

                  return (
                    <TableRow
                      key={payable.id}
                      className={isOverdue ? "bg-red-50/50" : ""}
                    >
                      <TableCell className="font-medium">
                        {payable.supplier_name}
                      </TableCell>
                      <TableCell>{payable.invoice_number}</TableCell>
                      <TableCell>{formatDate(payable.invoice_date)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {formatDate(payable.due_date)}
                          {isOverdue && (
                            <Badge variant="destructive" className="text-xs">
                              {getDaysOverdue(payable.due_date)}d
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatIDR(payable.amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatIDR(payable.paid_amount)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatIDR(payable.balance)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(payable.status, payable.due_date)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetails(payable)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {payable.status !== "paid" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenPaymentDialog(payable)}
                              title="Record Payment"
                            >
                              <CreditCard className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                          {payable.paid_amount > 0 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewHistory(payable)}
                              title="Payment History"
                            >
                              <History className="h-4 w-4 text-blue-600" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              {selectedPayable && (
                <>
                  {selectedPayable.supplier_name} - Invoice{" "}
                  {selectedPayable.invoice_number}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedPayable && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-lg font-semibold">
                    {formatIDR(selectedPayable.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Paid Amount</p>
                  <p className="text-lg font-semibold">
                    {formatIDR(selectedPayable.paid_amount)}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">
                    Outstanding Balance
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatIDR(selectedPayable.balance)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="payment_date">Payment Date</Label>
                  <Input
                    id="payment_date"
                    type="date"
                    value={paymentForm.payment_date}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        payment_date: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Payment Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={paymentForm.amount}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, amount: e.target.value })
                    }
                    placeholder="0"
                    min="0"
                    step="0.01"
                    max={selectedPayable.balance}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_method">Payment Method</Label>
                <Select
                  value={paymentForm.payment_method}
                  onValueChange={(value) =>
                    setPaymentForm({ ...paymentForm, payment_method: value })
                  }
                >
                  <SelectTrigger id="payment_method">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reference_number">Reference Number</Label>
                <Input
                  id="reference_number"
                  value={paymentForm.reference_number}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      reference_number: e.target.value,
                    })
                  }
                  placeholder="Transaction reference or check number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={paymentForm.notes}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, notes: e.target.value })
                  }
                  placeholder="Additional payment notes"
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPaymentDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmitPayment}>Record Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bill Details</DialogTitle>
            <DialogDescription>
              {selectedPayable?.invoice_number}
            </DialogDescription>
          </DialogHeader>

          {selectedPayable && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Supplier</p>
                  <p className="font-semibold">{selectedPayable.supplier_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Invoice Number</p>
                  <p className="font-semibold">{selectedPayable.invoice_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Invoice Date</p>
                  <p className="font-semibold">
                    {formatDate(selectedPayable.invoice_date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p className="font-semibold">
                    {formatDate(selectedPayable.due_date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Terms</p>
                  <p className="font-semibold">
                    {selectedPayable.payment_terms || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div>
                    {getStatusBadge(
                      selectedPayable.status,
                      selectedPayable.due_date
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-xl font-bold">
                      {formatIDR(selectedPayable.amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Paid</p>
                    <p className="text-xl font-bold text-green-600">
                      {formatIDR(selectedPayable.paid_amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Balance</p>
                    <p className="text-xl font-bold text-orange-600">
                      {formatIDR(selectedPayable.balance)}
                    </p>
                  </div>
                </div>
              </div>

              {selectedPayable.description && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Description
                  </p>
                  <p className="text-sm p-3 bg-muted rounded-lg">
                    {selectedPayable.description}
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment History Dialog */}
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Payment History</DialogTitle>
            <DialogDescription>
              {selectedPayable?.supplier_name} - Invoice{" "}
              {selectedPayable?.invoice_number}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {payments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No payments recorded
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{formatDate(payment.payment_date)}</TableCell>
                      <TableCell className="font-semibold">
                        {formatIDR(payment.amount)}
                      </TableCell>
                      <TableCell className="capitalize">
                        {payment.payment_method.replace("_", " ")}
                      </TableCell>
                      <TableCell>{payment.reference_number || "-"}</TableCell>
                      <TableCell>{payment.notes || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsHistoryDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
