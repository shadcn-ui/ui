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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Trash2,
  Save,
  Calculator,
  Package,
  ShoppingCart,
  Calendar,
  Building2,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface OrderItem {
  id: string;
  product: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  total: number;
}

export default function NewPurchaseOrderPage() {
  const router = useRouter();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    {
      id: "1",
      product: "",
      sku: "",
      quantity: 0,
      unitPrice: 0,
      discount: 0,
      tax: 0,
      total: 0,
    },
  ]);

  const [orderDetails, setOrderDetails] = useState({
    orderDate: new Date().toISOString().split("T")[0],
    expectedDate: "",
    supplier: "",
    warehouse: "",
    paymentTerms: "",
    shippingMethod: "",
    notes: "",
  });

  const addOrderItem = () => {
    const newItem: OrderItem = {
      id: Date.now().toString(),
      product: "",
      sku: "",
      quantity: 0,
      unitPrice: 0,
      discount: 0,
      tax: 0,
      total: 0,
    };
    setOrderItems([...orderItems, newItem]);
  };

  const removeOrderItem = (id: string) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter((item) => item.id !== id));
    }
  };

  const updateOrderItem = (id: string, field: keyof OrderItem, value: any) => {
    setOrderItems(
      orderItems.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          
          // Recalculate total
          if (["quantity", "unitPrice", "discount", "tax"].includes(field)) {
            const subtotal = updated.quantity * updated.unitPrice;
            const afterDiscount = subtotal - (subtotal * updated.discount) / 100;
            updated.total = afterDiscount + (afterDiscount * updated.tax) / 100;
          }
          
          return updated;
        }
        return item;
      })
    );
  };

  const calculateTotals = () => {
    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    const totalDiscount = orderItems.reduce(
      (sum, item) =>
        sum + (item.quantity * item.unitPrice * item.discount) / 100,
      0
    );
    const totalTax = orderItems.reduce((sum, item) => {
      const afterDiscount =
        item.quantity * item.unitPrice -
        (item.quantity * item.unitPrice * item.discount) / 100;
      return sum + (afterDiscount * item.tax) / 100;
    }, 0);
    const grandTotal = subtotal - totalDiscount + totalTax;

    return { subtotal, totalDiscount, totalTax, grandTotal };
  };

  const totals = calculateTotals();

  const handleSave = (status: "draft" | "submitted") => {
    console.log("Saving purchase order:", { orderDetails, orderItems, status });
    // API call would go here
    router.push("/erp/product/purchase-orders");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            New Purchase Order
          </h1>
          <p className="text-muted-foreground">
            Create a new purchase order for inventory replenishment
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/erp/product/purchase-orders")}
          >
            Cancel
          </Button>
          <Button variant="outline" onClick={() => handleSave("draft")}>
            <Save className="mr-2 h-4 w-4" />
            Save as Draft
          </Button>
          <Button onClick={() => handleSave("submitted")}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Submit Order
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
              <CardDescription>Basic information about the purchase order</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="order-date">Order Date</Label>
                  <Input
                    id="order-date"
                    type="date"
                    value={orderDetails.orderDate}
                    onChange={(e) =>
                      setOrderDetails({ ...orderDetails, orderDate: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expected-date">Expected Delivery</Label>
                  <Input
                    id="expected-date"
                    type="date"
                    value={orderDetails.expectedDate}
                    onChange={(e) =>
                      setOrderDetails({
                        ...orderDetails,
                        expectedDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Select
                    value={orderDetails.supplier}
                    onValueChange={(value) =>
                      setOrderDetails({ ...orderDetails, supplier: value })
                    }
                  >
                    <SelectTrigger id="supplier">
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">PT Unilever Indonesia</SelectItem>
                      <SelectItem value="2">L'Oréal Indonesia</SelectItem>
                      <SelectItem value="3">Johnson & Johnson Indonesia</SelectItem>
                      <SelectItem value="4">Beiersdorf Indonesia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="warehouse">Delivery Warehouse</Label>
                  <Select
                    value={orderDetails.warehouse}
                    onValueChange={(value) =>
                      setOrderDetails({ ...orderDetails, warehouse: value })
                    }
                  >
                    <SelectTrigger id="warehouse">
                      <SelectValue placeholder="Select warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Main Warehouse</SelectItem>
                      <SelectItem value="2">Secondary Warehouse</SelectItem>
                      <SelectItem value="3">Regional Warehouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="payment-terms">Payment Terms</Label>
                  <Select
                    value={orderDetails.paymentTerms}
                    onValueChange={(value) =>
                      setOrderDetails({ ...orderDetails, paymentTerms: value })
                    }
                  >
                    <SelectTrigger id="payment-terms">
                      <SelectValue placeholder="Select payment terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="net-30">Net 30 Days</SelectItem>
                      <SelectItem value="net-60">Net 60 Days</SelectItem>
                      <SelectItem value="net-90">Net 90 Days</SelectItem>
                      <SelectItem value="cod">Cash on Delivery</SelectItem>
                      <SelectItem value="advance">Advance Payment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipping-method">Shipping Method</Label>
                  <Select
                    value={orderDetails.shippingMethod}
                    onValueChange={(value) =>
                      setOrderDetails({ ...orderDetails, shippingMethod: value })
                    }
                  >
                    <SelectTrigger id="shipping-method">
                      <SelectValue placeholder="Select shipping method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard Shipping</SelectItem>
                      <SelectItem value="express">Express Shipping</SelectItem>
                      <SelectItem value="freight">Freight</SelectItem>
                      <SelectItem value="pickup">Pickup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any special instructions or notes..."
                  rows={3}
                  value={orderDetails.notes}
                  onChange={(e) =>
                    setOrderDetails({ ...orderDetails, notes: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Order Items</CardTitle>
                  <CardDescription>Add products to the purchase order</CardDescription>
                </div>
                <Button onClick={addOrderItem} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Product</TableHead>
                      <TableHead className="w-[100px]">Quantity</TableHead>
                      <TableHead className="w-[120px]">Unit Price</TableHead>
                      <TableHead className="w-[100px]">Discount %</TableHead>
                      <TableHead className="w-[100px]">Tax %</TableHead>
                      <TableHead className="text-right w-[120px]">Total</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Select
                            value={item.product}
                            onValueChange={(value) =>
                              updateOrderItem(item.id, "product", value)
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
                              <SelectItem value="4">
                                CeraVe Moisturizing Cream
                              </SelectItem>
                              <SelectItem value="5">
                                Neutrogena Hydro Boost Eye Gel
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            placeholder="0"
                            min="0"
                            value={item.quantity || ""}
                            onChange={(e) =>
                              updateOrderItem(
                                item.id,
                                "quantity",
                                parseInt(e.target.value) || 0
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            placeholder="0"
                            min="0"
                            step="0.01"
                            value={item.unitPrice || ""}
                            onChange={(e) =>
                              updateOrderItem(
                                item.id,
                                "unitPrice",
                                parseFloat(e.target.value) || 0
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            placeholder="0"
                            min="0"
                            max="100"
                            value={item.discount || ""}
                            onChange={(e) =>
                              updateOrderItem(
                                item.id,
                                "discount",
                                parseFloat(e.target.value) || 0
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            placeholder="0"
                            min="0"
                            max="100"
                            value={item.tax || ""}
                            onChange={(e) =>
                              updateOrderItem(
                                item.id,
                                "tax",
                                parseFloat(e.target.value) || 0
                              )
                            }
                          />
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          Rp {item.total.toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeOrderItem(item.id)}
                            disabled={orderItems.length === 1}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="mr-2 h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">
                    Rp {totals.subtotal.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="font-medium text-green-600">
                    - Rp {totals.totalDiscount.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium">
                    Rp {totals.totalTax.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-lg">
                      Rp {totals.grandTotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Items</span>
                  <span className="font-medium">
                    {orderItems.filter((i) => i.product).length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Quantity</span>
                  <span className="font-medium">
                    {orderItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base">
                <Package className="mr-2 h-4 w-4" />
                Quick Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                <p className="text-muted-foreground">
                  Set expected delivery date to track order fulfillment
                </p>
              </div>
              <div className="flex gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                <p className="text-muted-foreground">
                  Select the correct warehouse for automatic stock updates
                </p>
              </div>
              <div className="flex gap-2">
                <ShoppingCart className="h-4 w-4 text-muted-foreground mt-0.5" />
                <p className="text-muted-foreground">
                  Save as draft to continue editing later
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
