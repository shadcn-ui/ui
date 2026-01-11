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
  TrendingUp,
} from "lucide-react";

interface AccountsReceivable {
  id: number;
  customer_name: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  amount: number;
  received_amount: number;
  balance: number;
  status: string;
  description?: string;
  payment_terms?: string;
  created_at: string;
}

interface Receipt {
  id: number;
  receipt_date: string;
  amount: number;
  payment_method: string;
  reference_number?: string;
  notes?: string;
}

interface ARStats {
  totalOutstanding: number;
  totalOverdue: number;
  overdueCount: number;
  upcomingDue: number;
}

interface AgingBucket {
  label: string;
  amount: number;
  count: number;
  color: string;
}

export default function AccountsReceivablePage() {
  const [receivables, setReceivables] = useState<AccountsReceivable[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isAgingDialogOpen, setIsAgingDialogOpen] = useState(false);
  const [selectedReceivable, setSelectedReceivable] =
    useState<AccountsReceivable | null>(null);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [stats, setStats] = useState<ARStats>({
    totalOutstanding: 0,
    totalOverdue: 0,
    overdueCount: 0,
    upcomingDue: 0,
  });
  const [agingBuckets, setAgingBuckets] = useState<AgingBucket[]>([]);

  // Receipt form state
  const [receiptForm, setReceiptForm] = useState({
    receipt_date: new Date().toISOString().split("T")[0],
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
      const response = await fetch("/api/accounting/accounts-receivable");
      if (response.ok) {
        const data = await response.json();
        // Handle both array and object response formats
        const receivablesArray = Array.isArray(data) ? data : (data.receivables || []);
        setReceivables(receivablesArray);
        calculateStats(receivablesArray);
        calculateAging(receivablesArray);
      }
    } catch (error) {
      console.error("Error fetching receivables:", error);
      setReceivables([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: AccountsReceivable[]) => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    const stats = data.reduce(
      (acc, receivable) => {
        if (receivable.status !== "paid") {
          acc.totalOutstanding += receivable.balance;

          const dueDate = new Date(receivable.due_date);
          if (dueDate < today) {
            acc.totalOverdue += receivable.balance;
            acc.overdueCount += 1;
          } else if (dueDate <= nextWeek) {
            acc.upcomingDue += receivable.balance;
          }
        }
        return acc;
      },
      { totalOutstanding: 0, totalOverdue: 0, overdueCount: 0, upcomingDue: 0 }
    );

    setStats(stats);
  };

  const calculateAging = (data: AccountsReceivable[]) => {
    const today = new Date();
    const buckets: AgingBucket[] = [
      { label: "Current", amount: 0, count: 0, color: "bg-green-500" },
      { label: "1-30 Days", amount: 0, count: 0, color: "bg-blue-500" },
      { label: "31-60 Days", amount: 0, count: 0, color: "bg-yellow-500" },
      { label: "61-90 Days", amount: 0, count: 0, color: "bg-orange-500" },
      { label: "90+ Days", amount: 0, count: 0, color: "bg-red-500" },
    ];

    data.forEach((receivable) => {
      if (receivable.status !== "paid") {
        const daysOverdue = getDaysOverdue(receivable.due_date);

        if (daysOverdue < 0) {
          buckets[0].amount += receivable.balance;
          buckets[0].count += 1;
        } else if (daysOverdue <= 30) {
          buckets[1].amount += receivable.balance;
          buckets[1].count += 1;
        } else if (daysOverdue <= 60) {
          buckets[2].amount += receivable.balance;
          buckets[2].count += 1;
        } else if (daysOverdue <= 90) {
          buckets[3].amount += receivable.balance;
          buckets[3].count += 1;
        } else {
          buckets[4].amount += receivable.balance;
          buckets[4].count += 1;
        }
      }
    });

    setAgingBuckets(buckets);
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

  const handleOpenReceiptDialog = (receivable: AccountsReceivable) => {
    setSelectedReceivable(receivable);
    setReceiptForm({
      receipt_date: new Date().toISOString().split("T")[0],
      amount: receivable.balance.toString(),
      payment_method: "bank_transfer",
      reference_number: "",
      notes: "",
    });
    setIsReceiptDialogOpen(true);
  };

  const handleViewDetails = (receivable: AccountsReceivable) => {
    setSelectedReceivable(receivable);
    setIsViewDialogOpen(true);
  };

  const handleViewHistory = async (receivable: AccountsReceivable) => {
    setSelectedReceivable(receivable);
    try {
      const response = await fetch(
        `/api/accounting/accounts-receivable/${receivable.id}/receipts`
      );
      if (response.ok) {
        const data = await response.json();
        setReceipts(data);
      }
    } catch (error) {
      console.error("Error fetching receipt history:", error);
      setReceipts([]);
    }
    setIsHistoryDialogOpen(true);
  };

  const handleSubmitReceipt = async () => {
    if (!selectedReceivable) return;

    const amount = parseFloat(receiptForm.amount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid receipt amount");
      return;
    }

    if (amount > selectedReceivable.balance) {
      alert("Receipt amount cannot exceed the outstanding balance");
      return;
    }

    try {
      const response = await fetch(
        `/api/accounting/accounts-receivable/${selectedReceivable.id}/receipt`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            receipt_date: receiptForm.receipt_date,
            amount,
            payment_method: receiptForm.payment_method,
            reference_number: receiptForm.reference_number || null,
            notes: receiptForm.notes || null,
          }),
        }
      );

      if (response.ok) {
        await fetchData();
        setIsReceiptDialogOpen(false);
        setSelectedReceivable(null);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || "Failed to record receipt"}`);
      }
    } catch (error) {
      console.error("Error recording receipt:", error);
      alert("Failed to record receipt");
    }
  };

  const filterReceivables = () => {
    return receivables.filter((receivable) => {
      const matchesSearch =
        receivable.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receivable.invoice_number.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || receivable.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  };

  const filteredReceivables = filterReceivables();

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
          <h1 className="text-3xl font-bold tracking-tight">
            Accounts Receivable
          </h1>
          <p className="text-muted-foreground">
            Manage customer invoices and receipts
          </p>
        </div>
        <Button onClick={() => setIsAgingDialogOpen(true)}>
          <TrendingUp className="mr-2 h-4 w-4" />
          Aging Report
        </Button>
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
              All unpaid invoices
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
              {stats.overdueCount} invoices overdue
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
            <CardDescription>Total Invoices</CardDescription>
            <CardTitle className="text-2xl">{receivables.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground">
              <CheckCircle className="mr-1 h-4 w-4" />
              All statuses
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Receivables Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Customer Invoices</CardTitle>
              <CardDescription>
                {filteredReceivables.length} invoices found
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search invoices..."
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
                <TableHead>Customer</TableHead>
                <TableHead>Invoice #</TableHead>
                <TableHead>Invoice Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Received</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReceivables.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    No invoices found
                  </TableCell>
                </TableRow>
              ) : (
                filteredReceivables.map((receivable) => {
                  const isOverdue =
                    receivable.status !== "paid" &&
                    getDaysOverdue(receivable.due_date) > 0;

                  return (
                    <TableRow
                      key={receivable.id}
                      className={isOverdue ? "bg-red-50/50" : ""}
                    >
                      <TableCell className="font-medium">
                        {receivable.customer_name}
                      </TableCell>
                      <TableCell>{receivable.invoice_number}</TableCell>
                      <TableCell>{formatDate(receivable.invoice_date)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {formatDate(receivable.due_date)}
                          {isOverdue && (
                            <Badge variant="destructive" className="text-xs">
                              {getDaysOverdue(receivable.due_date)}d
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatIDR(receivable.amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatIDR(receivable.received_amount)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatIDR(receivable.balance)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(receivable.status, receivable.due_date)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetails(receivable)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {receivable.status !== "paid" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenReceiptDialog(receivable)}
                              title="Record Receipt"
                            >
                              <CreditCard className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                          {receivable.received_amount > 0 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewHistory(receivable)}
                              title="Receipt History"
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

      {/* Receipt Dialog */}
      <Dialog open={isReceiptDialogOpen} onOpenChange={setIsReceiptDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Record Receipt</DialogTitle>
            <DialogDescription>
              {selectedReceivable && (
                <>
                  {selectedReceivable.customer_name} - Invoice{" "}
                  {selectedReceivable.invoice_number}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedReceivable && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-lg font-semibold">
                    {formatIDR(selectedReceivable.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Received Amount</p>
                  <p className="text-lg font-semibold">
                    {formatIDR(selectedReceivable.received_amount)}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">
                    Outstanding Balance
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatIDR(selectedReceivable.balance)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="receipt_date">Receipt Date</Label>
                  <Input
                    id="receipt_date"
                    type="date"
                    value={receiptForm.receipt_date}
                    onChange={(e) =>
                      setReceiptForm({
                        ...receiptForm,
                        receipt_date: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Receipt Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={receiptForm.amount}
                    onChange={(e) =>
                      setReceiptForm({ ...receiptForm, amount: e.target.value })
                    }
                    placeholder="0"
                    min="0"
                    step="0.01"
                    max={selectedReceivable.balance}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_method">Payment Method</Label>
                <Select
                  value={receiptForm.payment_method}
                  onValueChange={(value) =>
                    setReceiptForm({ ...receiptForm, payment_method: value })
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
                  value={receiptForm.reference_number}
                  onChange={(e) =>
                    setReceiptForm({
                      ...receiptForm,
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
                  value={receiptForm.notes}
                  onChange={(e) =>
                    setReceiptForm({ ...receiptForm, notes: e.target.value })
                  }
                  placeholder="Additional receipt notes"
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsReceiptDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmitReceipt}>Record Receipt</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
            <DialogDescription>
              {selectedReceivable?.invoice_number}
            </DialogDescription>
          </DialogHeader>

          {selectedReceivable && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-semibold">
                    {selectedReceivable.customer_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Invoice Number</p>
                  <p className="font-semibold">
                    {selectedReceivable.invoice_number}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Invoice Date</p>
                  <p className="font-semibold">
                    {formatDate(selectedReceivable.invoice_date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p className="font-semibold">
                    {formatDate(selectedReceivable.due_date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Terms</p>
                  <p className="font-semibold">
                    {selectedReceivable.payment_terms || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div>
                    {getStatusBadge(
                      selectedReceivable.status,
                      selectedReceivable.due_date
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-xl font-bold">
                      {formatIDR(selectedReceivable.amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Received</p>
                    <p className="text-xl font-bold text-green-600">
                      {formatIDR(selectedReceivable.received_amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Balance</p>
                    <p className="text-xl font-bold text-orange-600">
                      {formatIDR(selectedReceivable.balance)}
                    </p>
                  </div>
                </div>
              </div>

              {selectedReceivable.description && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Description
                  </p>
                  <p className="text-sm p-3 bg-muted rounded-lg">
                    {selectedReceivable.description}
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

      {/* Receipt History Dialog */}
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Receipt History</DialogTitle>
            <DialogDescription>
              {selectedReceivable?.customer_name} - Invoice{" "}
              {selectedReceivable?.invoice_number}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {receipts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No receipts recorded
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
                  {receipts.map((receipt) => (
                    <TableRow key={receipt.id}>
                      <TableCell>{formatDate(receipt.receipt_date)}</TableCell>
                      <TableCell className="font-semibold">
                        {formatIDR(receipt.amount)}
                      </TableCell>
                      <TableCell className="capitalize">
                        {receipt.payment_method.replace("_", " ")}
                      </TableCell>
                      <TableCell>{receipt.reference_number || "-"}</TableCell>
                      <TableCell>{receipt.notes || "-"}</TableCell>
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

      {/* Aging Report Dialog */}
      <Dialog open={isAgingDialogOpen} onOpenChange={setIsAgingDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Accounts Receivable Aging Report</DialogTitle>
            <DialogDescription>
              Outstanding invoices grouped by age
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Visual Aging Bars */}
            <div className="space-y-3">
              {agingBuckets.map((bucket, index) => {
                const totalOutstanding = agingBuckets.reduce(
                  (sum, b) => sum + b.amount,
                  0
                );
                const percentage =
                  totalOutstanding > 0
                    ? (bucket.amount / totalOutstanding) * 100
                    : 0;

                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{bucket.label}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-muted-foreground">
                          {bucket.count} invoices
                        </span>
                        <span className="font-semibold min-w-[120px] text-right">
                          {formatIDR(bucket.amount)}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full ${bucket.color} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Aging Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Age Range</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agingBuckets.map((bucket, index) => {
                  const totalOutstanding = agingBuckets.reduce(
                    (sum, b) => sum + b.amount,
                    0
                  );
                  const percentage =
                    totalOutstanding > 0
                      ? ((bucket.amount / totalOutstanding) * 100).toFixed(1)
                      : "0.0";

                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {bucket.label}
                      </TableCell>
                      <TableCell className="text-right">{bucket.count}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatIDR(bucket.amount)}
                      </TableCell>
                      <TableCell className="text-right">{percentage}%</TableCell>
                    </TableRow>
                  );
                })}
                <TableRow className="font-bold bg-muted/50">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-right">
                    {agingBuckets.reduce((sum, b) => sum + b.count, 0)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatIDR(
                      agingBuckets.reduce((sum, b) => sum + b.amount, 0)
                    )}
                  </TableCell>
                  <TableCell className="text-right">100%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAgingDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
