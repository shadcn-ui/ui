"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  FileText,
  Calendar,
  User,
} from "lucide-react";

interface Adjustment {
  id: string;
  adjustmentNumber: string;
  date: string;
  type: "increase" | "decrease" | "correction";
  product: string;
  warehouse: string;
  quantityBefore: number;
  quantityAfter: number;
  quantityChange: number;
  reason: string;
  createdBy: string;
  status: "pending" | "approved" | "rejected";
}

export default function InventoryAdjustmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showNewDialog, setShowNewDialog] = useState(false);

  // Sample data
  const adjustments: Adjustment[] = [
    {
      id: "1",
      adjustmentNumber: "ADJ-2024-001",
      date: "2024-12-09",
      type: "increase",
      product: "Cetaphil Gentle Skin Cleanser",
      warehouse: "Main Warehouse",
      quantityBefore: 50,
      quantityAfter: 75,
      quantityChange: 25,
      reason: "Stock count discrepancy - found additional units",
      createdBy: "John Doe",
      status: "approved",
    },
    {
      id: "2",
      adjustmentNumber: "ADJ-2024-002",
      date: "2024-12-08",
      type: "decrease",
      product: "La Roche-Posay Effaclar Toner",
      warehouse: "Main Warehouse",
      quantityBefore: 100,
      quantityAfter: 95,
      quantityChange: -5,
      reason: "Damaged units during handling",
      createdBy: "Jane Smith",
      status: "approved",
    },
    {
      id: "3",
      adjustmentNumber: "ADJ-2024-003",
      date: "2024-12-08",
      type: "correction",
      product: "The Ordinary Niacinamide Serum",
      warehouse: "Secondary Warehouse",
      quantityBefore: 120,
      quantityAfter: 115,
      quantityChange: -5,
      reason: "System correction after physical count",
      createdBy: "John Doe",
      status: "pending",
    },
  ];

  const stats = {
    totalAdjustments: adjustments.length,
    pendingApproval: adjustments.filter((a) => a.status === "pending").length,
    thisMonth: adjustments.filter(
      (a) => new Date(a.date).getMonth() === new Date().getMonth()
    ).length,
  };

  const getTypeBadge = (type: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      increase: { label: "Increase", className: "bg-green-100 text-green-800" },
      decrease: { label: "Decrease", className: "bg-red-100 text-red-800" },
      correction: { label: "Correction", className: "bg-blue-100 text-blue-800" },
    };
    const variant = variants[type] || variants.correction;
    return (
      <Badge className={variant.className} variant="outline">
        {variant.label}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
      approved: { label: "Approved", className: "bg-green-100 text-green-800" },
      rejected: { label: "Rejected", className: "bg-red-100 text-red-800" },
    };
    const variant = variants[status] || variants.pending;
    return (
      <Badge className={variant.className} variant="outline">
        {variant.label}
      </Badge>
    );
  };

  const filteredAdjustments = adjustments.filter((adjustment) => {
    const matchesSearch =
      adjustment.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      adjustment.adjustmentNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || adjustment.type === filterType;
    const matchesStatus = filterStatus === "all" || adjustment.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Adjustments</h1>
          <p className="text-muted-foreground">
            Manage stock adjustments and corrections
          </p>
        </div>
        <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Adjustment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Inventory Adjustment</DialogTitle>
              <DialogDescription>
                Record a new inventory adjustment for stock correction
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adjustment-date">Date</Label>
                  <Input
                    id="adjustment-date"
                    type="date"
                    defaultValue={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adjustment-type">Adjustment Type</Label>
                  <Select>
                    <SelectTrigger id="adjustment-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="increase">Increase</SelectItem>
                      <SelectItem value="decrease">Decrease</SelectItem>
                      <SelectItem value="correction">Correction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="product">Product</Label>
                <Select>
                  <SelectTrigger id="product">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Cetaphil Gentle Skin Cleanser</SelectItem>
                    <SelectItem value="2">La Roche-Posay Effaclar Toner</SelectItem>
                    <SelectItem value="3">The Ordinary Niacinamide Serum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="warehouse">Warehouse</Label>
                <Select>
                  <SelectTrigger id="warehouse">
                    <SelectValue placeholder="Select warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Main Warehouse</SelectItem>
                    <SelectItem value="2">Secondary Warehouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="qty-before">Current Quantity</Label>
                  <Input
                    id="qty-before"
                    type="number"
                    placeholder="0"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="qty-change">Adjustment (+/-)</Label>
                  <Input
                    id="qty-change"
                    type="number"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="qty-after">New Quantity</Label>
                  <Input
                    id="qty-after"
                    type="number"
                    placeholder="0"
                    disabled
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  id="reason"
                  placeholder="Explain the reason for this adjustment..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowNewDialog(false)}>
                Create Adjustment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Adjustments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAdjustments}</div>
            <p className="text-xs text-muted-foreground">All time adjustments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApproval}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisMonth}</div>
            <p className="text-xs text-muted-foreground">December 2024</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Adjustment History</CardTitle>
          <CardDescription>
            View and manage all inventory adjustments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by product or adjustment number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="increase">Increase</SelectItem>
                <SelectItem value="decrease">Decrease</SelectItem>
                <SelectItem value="correction">Correction</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Adjustment #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead className="text-right">Before</TableHead>
                  <TableHead className="text-right">Change</TableHead>
                  <TableHead className="text-right">After</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdjustments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center py-8">
                      <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No adjustments found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAdjustments.map((adjustment) => (
                    <TableRow key={adjustment.id}>
                      <TableCell className="font-medium">
                        {adjustment.adjustmentNumber}
                      </TableCell>
                      <TableCell>{adjustment.date}</TableCell>
                      <TableCell>{getTypeBadge(adjustment.type)}</TableCell>
                      <TableCell>{adjustment.product}</TableCell>
                      <TableCell>{adjustment.warehouse}</TableCell>
                      <TableCell className="text-right">
                        {adjustment.quantityBefore}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={
                            adjustment.quantityChange > 0
                              ? "text-green-600 font-medium"
                              : "text-red-600 font-medium"
                          }
                        >
                          {adjustment.quantityChange > 0 ? "+" : ""}
                          {adjustment.quantityChange}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {adjustment.quantityAfter}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {adjustment.reason}
                      </TableCell>
                      <TableCell>{adjustment.createdBy}</TableCell>
                      <TableCell>{getStatusBadge(adjustment.status)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
