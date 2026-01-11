"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRightLeft,
  Plus,
  Search,
  Package,
  Truck,
  CheckCircle,
  Clock,
  FileText,
} from "lucide-react";

interface Transfer {
  id: string;
  transferNumber: string;
  date: string;
  fromWarehouse: string;
  toWarehouse: string;
  status: "pending" | "in-transit" | "completed" | "cancelled";
  items: number;
  totalQuantity: number;
  requestedBy: string;
  notes: string;
}

export default function WarehouseTransfersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [transferItems, setTransferItems] = useState<
    Array<{ product: string; quantity: number }>
  >([{ product: "", quantity: 0 }]);

  // Sample data
  const transfers: Transfer[] = [
    {
      id: "1",
      transferNumber: "TRF-2024-001",
      date: "2024-12-09",
      fromWarehouse: "Main Warehouse",
      toWarehouse: "Secondary Warehouse",
      status: "in-transit",
      items: 3,
      totalQuantity: 125,
      requestedBy: "John Doe",
      notes: "Urgent transfer for retail location",
    },
    {
      id: "2",
      transferNumber: "TRF-2024-002",
      date: "2024-12-08",
      fromWarehouse: "Secondary Warehouse",
      toWarehouse: "Main Warehouse",
      status: "completed",
      items: 5,
      totalQuantity: 200,
      requestedBy: "Jane Smith",
      notes: "Restocking main warehouse",
    },
    {
      id: "3",
      transferNumber: "TRF-2024-003",
      date: "2024-12-07",
      fromWarehouse: "Main Warehouse",
      toWarehouse: "Regional Warehouse",
      status: "pending",
      items: 8,
      totalQuantity: 350,
      requestedBy: "John Doe",
      notes: "New location setup",
    },
  ];

  const stats = {
    totalTransfers: transfers.length,
    pending: transfers.filter((t) => t.status === "pending").length,
    inTransit: transfers.filter((t) => t.status === "in-transit").length,
    completed: transfers.filter((t) => t.status === "completed").length,
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      { label: string; className: string; icon: any }
    > = {
      pending: {
        label: "Pending",
        className: "bg-yellow-100 text-yellow-800",
        icon: Clock,
      },
      "in-transit": {
        label: "In Transit",
        className: "bg-blue-100 text-blue-800",
        icon: Truck,
      },
      completed: {
        label: "Completed",
        className: "bg-green-100 text-green-800",
        icon: CheckCircle,
      },
      cancelled: {
        label: "Cancelled",
        className: "bg-red-100 text-red-800",
        icon: FileText,
      },
    };
    const variant = variants[status] || variants.pending;
    const Icon = variant.icon;
    return (
      <Badge className={variant.className} variant="outline">
        <Icon className="mr-1 h-3 w-3" />
        {variant.label}
      </Badge>
    );
  };

  const addTransferItem = () => {
    setTransferItems([...transferItems, { product: "", quantity: 0 }]);
  };

  const removeTransferItem = (index: number) => {
    setTransferItems(transferItems.filter((_, i) => i !== index));
  };

  const updateTransferItem = (
    index: number,
    field: "product" | "quantity",
    value: string | number
  ) => {
    const updated = [...transferItems];
    updated[index] = { ...updated[index], [field]: value };
    setTransferItems(updated);
  };

  const filteredTransfers = transfers.filter((transfer) => {
    const matchesSearch =
      transfer.transferNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.fromWarehouse.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.toWarehouse.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || transfer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Warehouse Transfers</h1>
          <p className="text-muted-foreground">
            Manage inter-warehouse inventory transfers
          </p>
        </div>
        <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Transfer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Warehouse Transfer</DialogTitle>
              <DialogDescription>
                Transfer inventory between warehouses
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transfer-date">Transfer Date</Label>
                  <Input
                    id="transfer-date"
                    type="date"
                    defaultValue={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="requested-by">Requested By</Label>
                  <Input
                    id="requested-by"
                    placeholder="Name"
                    defaultValue="Current User"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from-warehouse">From Warehouse</Label>
                  <Select>
                    <SelectTrigger id="from-warehouse">
                      <SelectValue placeholder="Select source warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Main Warehouse</SelectItem>
                      <SelectItem value="2">Secondary Warehouse</SelectItem>
                      <SelectItem value="3">Regional Warehouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="to-warehouse">To Warehouse</Label>
                  <Select>
                    <SelectTrigger id="to-warehouse">
                      <SelectValue placeholder="Select destination warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Main Warehouse</SelectItem>
                      <SelectItem value="2">Secondary Warehouse</SelectItem>
                      <SelectItem value="3">Regional Warehouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Transfer Items</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTransferItem}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </div>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Available</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transferItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Select
                              value={item.product}
                              onValueChange={(value) =>
                                updateTransferItem(index, "product", value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select product" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">
                                  Cetaphil Gentle Skin Cleanser
                                </SelectItem>
                                <SelectItem value="2">
                                  La Roche-Posay Effaclar Toner
                                </SelectItem>
                                <SelectItem value="3">
                                  The Ordinary Niacinamide Serum
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <span className="text-muted-foreground">
                              {item.product ? "125 units" : "-"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              placeholder="0"
                              value={item.quantity || ""}
                              onChange={(e) =>
                                updateTransferItem(
                                  index,
                                  "quantity",
                                  parseInt(e.target.value) || 0
                                )
                              }
                            />
                          </TableCell>
                          <TableCell>
                            {transferItems.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeTransferItem(index)}
                              >
                                Remove
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional notes or instructions..."
                  rows={3}
                />
              </div>

              <div className="rounded-lg bg-blue-50 p-4">
                <p className="text-sm font-medium text-blue-900">
                  Transfer Summary
                </p>
                <div className="mt-2 space-y-1 text-sm text-blue-700">
                  <p>
                    Total Items:{" "}
                    {transferItems.filter((i) => i.product).length}
                  </p>
                  <p>
                    Total Quantity:{" "}
                    {transferItems.reduce((sum, item) => sum + (item.quantity || 0), 0)}
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowNewDialog(false)}>
                Create Transfer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transfers</CardTitle>
            <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTransfers}</div>
            <p className="text-xs text-muted-foreground">All time transfers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.inTransit}
            </div>
            <p className="text-xs text-muted-foreground">Currently moving</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.completed}
            </div>
            <p className="text-xs text-muted-foreground">Successfully transferred</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transfer History</CardTitle>
          <CardDescription>
            View and manage all warehouse transfers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by transfer number or warehouse..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-transit">In Transit</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transfer #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>From Warehouse</TableHead>
                  <TableHead>To Warehouse</TableHead>
                  <TableHead className="text-right">Items</TableHead>
                  <TableHead className="text-right">Total Quantity</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransfers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No transfers found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransfers.map((transfer) => (
                    <TableRow key={transfer.id}>
                      <TableCell className="font-medium">
                        {transfer.transferNumber}
                      </TableCell>
                      <TableCell>{transfer.date}</TableCell>
                      <TableCell>{transfer.fromWarehouse}</TableCell>
                      <TableCell>{transfer.toWarehouse}</TableCell>
                      <TableCell className="text-right">{transfer.items}</TableCell>
                      <TableCell className="text-right font-medium">
                        {transfer.totalQuantity}
                      </TableCell>
                      <TableCell>{transfer.requestedBy}</TableCell>
                      <TableCell>{getStatusBadge(transfer.status)}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {transfer.notes}
                      </TableCell>
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
