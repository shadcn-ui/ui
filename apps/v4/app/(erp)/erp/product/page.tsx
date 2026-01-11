"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/new-york-v4/ui/tabs"
import { Package, Warehouse, ShoppingCart, AlertTriangle, Plus, RefreshCw } from "lucide-react"
import { ProductDialog } from "@/components/product-dialog"
import { ProductTable } from "@/components/product-table"

export default function ProductPage() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    inStock: 0,
    lowStock: 0,
    purchaseOrders: 0,
  })

  useEffect(() => {
    loadProducts()
    loadCategories()
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/products?limit=1000")
      const data = await response.json()
      if (data.products) {
        setProducts(data.products)
        calculateMetrics(data.products)
      }
    } catch (error) {
      console.error("Error loading products:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const response = await fetch("/api/product-categories")
      const data = await response.json()
      if (Array.isArray(data)) {
        setCategories(data)
      }
    } catch (error) {
      console.error("Error loading categories:", error)
    }
  }

  const calculateMetrics = (productList: any[]) => {
    const totalProducts = productList.length
    const inStock = productList.reduce((sum, p) => sum + Number(p.total_stock || 0), 0)
    const lowStock = productList.filter(
      (p) => p.stock_status === "Low Stock" || p.stock_status === "Out of Stock"
    ).length

    setMetrics({
      totalProducts,
      inStock,
      lowStock,
      purchaseOrders: 0, // TODO: Get from purchase orders API
    })
  }

  const handleAddProduct = () => {
    setEditingProduct(null)
    setDialogOpen(true)
  }

  const handleEditProduct = (product: any) => {
    setEditingProduct(product)
    setDialogOpen(true)
  }

  const handleDeleteProduct = async (productId: number) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        loadProducts()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to delete product")
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("Failed to delete product")
    }
  }

  const handleSuccess = () => {
    loadProducts()
  }

  return (
    <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Product Management</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={loadProducts}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button onClick={handleAddProduct}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Product
            </Button>
          </div>
        </div>

        {/* Inventory Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : metrics.totalProducts.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Active in catalog
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Stock</CardTitle>
              <Warehouse className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : metrics.inStock.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Total units available
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : metrics.lowStock}
              </div>
              <p className="text-xs text-muted-foreground">
                Need immediate attention
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : categories.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Product categories
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="products" className="space-y-4">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="modules">Modules</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Product Catalog</CardTitle>
                <CardDescription>
                  Manage your product inventory, pricing, and stock levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <ProductTable
                    products={products}
                    categories={categories}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="modules" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Product Catalog</CardTitle>
                  <CardDescription>
                    Manage product information and specifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button asChild variant="outline" className="w-full justify-start">
                      <a href="/erp/product/catalog">View Catalog</a>
                    </Button>
                    <Button asChild variant="outline" className="w-full justify-start">
                      <a href="/erp/product/catalog/categories">Categories</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Inventory Management</CardTitle>
                  <CardDescription>
                    Track stock levels and inventory movements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button asChild variant="outline" className="w-full justify-start">
                      <a href="/erp/product/inventory">View Inventory</a>
                    </Button>
                    <Button asChild variant="outline" className="w-full justify-start">
                      <a href="/erp/product/inventory/adjustments">Stock Adjustments</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Stock Management</CardTitle>
                  <CardDescription>
                    Monitor stock levels and reorder points
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button asChild variant="outline" className="w-full justify-start">
                      <a href="/erp/product/stock">Stock Overview</a>
                    </Button>
                    <Button asChild variant="outline" className="w-full justify-start">
                      <a href="/erp/product/stock/reorder">Reorder Points</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Warehouses</CardTitle>
                  <CardDescription>
                    Manage warehouse locations and operations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button asChild variant="outline" className="w-full justify-start">
                      <a href="/erp/product/warehouses">View Warehouses</a>
                    </Button>
                    <Button asChild variant="outline" className="w-full justify-start">
                      <a href="/erp/product/warehouses/transfers">Stock Transfers</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Purchase Orders</CardTitle>
                  <CardDescription>
                    Create and manage purchase orders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button asChild variant="outline" className="w-full justify-start">
                      <a href="/erp/product/purchase-orders">View Orders</a>
                    </Button>
                    <Button asChild variant="outline" className="w-full justify-start">
                      <a href="/erp/product/purchase-orders/new">Create Order</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Suppliers</CardTitle>
                  <CardDescription>
                    Manage supplier relationships and information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button asChild variant="outline" className="w-full justify-start">
                      <a href="/erp/product/suppliers">View Suppliers</a>
                    </Button>
                    <Button asChild variant="outline" className="w-full justify-start">
                      <a href="/erp/product/suppliers/performance">Supplier Performance</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Product Dialog */}
        <ProductDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSuccess={handleSuccess}
          product={editingProduct}
          categories={categories}
        />
    </div>
  )
}