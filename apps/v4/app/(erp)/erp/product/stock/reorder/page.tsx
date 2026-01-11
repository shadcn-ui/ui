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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  Package,
  Search,
  Bell,
  TrendingDown,
  ShoppingCart,
  Edit,
  Save,
} from "lucide-react";

interface ReorderPoint {
  id: string;
  product: string;
  sku: string;
  category: string;
  currentStock: number;
  reorderPoint: number;
  reorderQuantity: number;
  leadTime: number; // in days
  warehouse: string;
  status: "ok" | "warning" | "critical";
  lastUpdated: string;
}

export default function StockReorderPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<ReorderPoint | null>(null);

  // Sample data
  const reorderPoints: ReorderPoint[] = [
    {
      id: "1",
      product: "Cetaphil Gentle Skin Cleanser",
      sku: "CET-CLN-001",
      category: "Cleansers",
      currentStock: 25,
      reorderPoint: 30,
      reorderQuantity: 100,
      leadTime: 7,
      warehouse: "Main Warehouse",
      status: "warning",
      lastUpdated: "2024-12-09",
    },
    {
      id: "2",
      product: "La Roche-Posay Effaclar Toner",
      sku: "LRP-TON-001",
      category: "Toners",
      currentStock: 15,
      reorderPoint: 25,
      reorderQuantity: 75,
      leadTime: 10,
      warehouse: "Main Warehouse",
      status: "critical",
      lastUpdated: "2024-12-09",
    },
    {
      id: "3",
      product: "The Ordinary Niacinamide Serum",
      sku: "ORD-SER-001",
      category: "Serums",
      currentStock: 120,
      reorderPoint: 50,
      reorderQuantity: 150,
      leadTime: 14,
      warehouse: "Main Warehouse",
      status: "ok",
      lastUpdated: "2024-12-08",
    },
    {
      id: "4",
      product: "CeraVe Moisturizing Cream",
      sku: "CER-MOI-001",
      category: "Moisturizers",
      currentStock: 40,
      reorderPoint: 35,
      reorderQuantity: 100,
      leadTime: 7,
      warehouse: "Secondary Warehouse",
      status: "ok",
      lastUpdated: "2024-12-08",
    },
    {
      id: "5",
      product: "Neutrogena Hydro Boost Eye Gel",
      sku: "NEU-EYE-001",
      category: "Eye Care",
      currentStock: 18,
      reorderPoint: 20,
      reorderQuantity: 60,
      leadTime: 5,
      warehouse: "Main Warehouse",
      status: "warning",
      lastUpdated: "2024-12-07",
    },
  ];

  const stats = {
    totalProducts: reorderPoints.length,
    criticalItems: reorderPoints.filter((r) => r.status === "critical").length,
    warningItems: reorderPoints.filter((r) => r.status === "warning").length,
    okItems: reorderPoints.filter((r) => r.status === "ok").length,
  };

  const getStatusBadge = (status: string, currentStock: number, reorderPoint: number) => {
    if (status === "critical") {
      return (
        <Badge className="bg-red-100 text-red-800" variant="outline">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Critical
        </Badge>
      );
    }
    if (status === "warning") {
      return (
        <Badge className="bg-yellow-100 text-yellow-800" variant="outline">
          <TrendingDown className="mr-1 h-3 w-3" />
          Low Stock
        </Badge>
      );
    }
    return (
      <Badge className="bg-green-100 text-green-800" variant="outline">
        OK
      </Badge>
    );
  };

  const handleEdit = (item: ReorderPoint) => {
    setEditingItem(item);
    setShowEditDialog(true);
  };

  const filteredReorderPoints = reorderPoints.filter((item) => {
    const matchesSearch =
      item.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reorder Points</h1>
          <p className="text-muted-foreground">
            Manage minimum stock levels and automatic reorder triggers
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Bell className="mr-2 h-4 w-4" />
            Configure Alerts
          </Button>
          <Button>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Create Bulk Orders
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">With reorder points</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.criticalItems}
            </div>
            <p className="text-xs text-muted-foreground">Order immediately</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.warningItems}
            </div>
            <p className="text-xs text-muted-foreground">Below reorder point</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Healthy Stock</CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.okItems}
            </div>
            <p className="text-xs text-muted-foreground">Above reorder point</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Reorder Point Management</CardTitle>
          <CardDescription>
            Monitor and adjust reorder points for automatic replenishment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by product name or SKU..."
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
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="warning">Low Stock</SelectItem>
                <SelectItem value="ok">Healthy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Current Stock</TableHead>
                  <TableHead className="text-right">Reorder Point</TableHead>
                  <TableHead className="text-right">Reorder Qty</TableHead>
                  <TableHead className="text-right">Lead Time</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReorderPoints.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8">
                      <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No products found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReorderPoints.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.product}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.sku}
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="text-right">
                        <span
                          className={
                            item.currentStock <= item.reorderPoint
                              ? item.currentStock < item.reorderPoint * 0.5
                                ? "text-red-600 font-bold"
                                : "text-yellow-600 font-semibold"
                              : ""
                          }
                        >
                          {item.currentStock}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {item.reorderPoint}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.reorderQuantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.leadTime} days
                      </TableCell>
                      <TableCell>{item.warehouse}</TableCell>
                      <TableCell>
                        {getStatusBadge(item.status, item.currentStock, item.reorderPoint)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.lastUpdated}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
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

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Reorder Point</DialogTitle>
            <DialogDescription>
              Adjust reorder settings for {editingItem?.product}
            </DialogDescription>
          </DialogHeader>
          {editingItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Product</Label>
                  <Input value={editingItem.product} disabled />
                </div>
                <div className="space-y-2">
                  <Label>SKU</Label>
                  <Input value={editingItem.sku} disabled />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Current Stock</Label>
                  <Input
                    type="number"
                    value={editingItem.currentStock}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label>Warehouse</Label>
                  <Input value={editingItem.warehouse} disabled />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reorder-point">Reorder Point</Label>
                  <Input
                    id="reorder-point"
                    type="number"
                    defaultValue={editingItem.reorderPoint}
                  />
                  <p className="text-xs text-muted-foreground">
                    Min stock before reorder
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reorder-qty">Reorder Quantity</Label>
                  <Input
                    id="reorder-qty"
                    type="number"
                    defaultValue={editingItem.reorderQuantity}
                  />
                  <p className="text-xs text-muted-foreground">
                    Qty to order
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lead-time">Lead Time (days)</Label>
                  <Input
                    id="lead-time"
                    type="number"
                    defaultValue={editingItem.leadTime}
                  />
                  <p className="text-xs text-muted-foreground">
                    Delivery time
                  </p>
                </div>
              </div>
              <div className="rounded-lg bg-blue-50 p-4">
                <p className="text-sm font-medium text-blue-900">
                  Reorder Calculation
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  When stock falls below {editingItem.reorderPoint} units, the system
                  will trigger an order for {editingItem.reorderQuantity} units.
                  Expected delivery in {editingItem.leadTime} days.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowEditDialog(false)}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
