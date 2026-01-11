"use client"

import { use, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/registry/new-york-v4/ui/card"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Input } from "@/registry/new-york-v4/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"

interface SalesOrder {
  id: number
  order_number: string
  customer: string
  customer_email?: string
  customer_phone?: string
  billing_address?: string
  shipping_address?: string
  subtotal: number
  tax_amount: number
  discount_amount: number
  total_amount: number
  status: string
  payment_status: string
  payment_method?: string
  payment_terms?: string
  order_date: string
  expected_delivery_date?: string
  actual_delivery_date?: string
  notes?: string
  internal_notes?: string
  created_at: string
}

interface OrderItem {
  id: number
  product_code?: string
  product_name: string
  description?: string
  quantity: number
  unit_price: number
  discount_amount: number
  tax_amount: number
  line_total: number
}

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-yellow-500",
  Confirmed: "bg-blue-500",
  Processing: "bg-purple-500",
  Shipped: "bg-indigo-500",
  Delivered: "bg-green-500",
  Cancelled: "bg-red-500",
  Refunded: "bg-gray-500",
}

const PAYMENT_COLORS: Record<string, string> = {
  Unpaid: "bg-red-500",
  Partial: "bg-orange-500",
  Paid: "bg-green-500",
  Refunded: "bg-gray-500",
}

export default function SalesOrderDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = use(params)
  const [order, setOrder] = useState<SalesOrder | null>(null)
  const [items, setItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)
  
  // Edit mode for status and payment
  const [isEditingStatus, setIsEditingStatus] = useState(false)
  const [editStatus, setEditStatus] = useState("")
  const [editPaymentStatus, setEditPaymentStatus] = useState("")
  const [editPaymentMethod, setEditPaymentMethod] = useState("")
  
  // Add item form
  const [showAddItem, setShowAddItem] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [productSearchQuery, setProductSearchQuery] = useState("")
  const [selectedProductId, setSelectedProductId] = useState<string>("")
  const [productName, setProductName] = useState("")
  const [productCode, setProductCode] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [unitPrice, setUnitPrice] = useState("0")

  useEffect(() => {
    loadOrder()
    loadItems()
    loadProducts()
  }, [id])

  const loadProducts = async () => {
    try {
      const res = await fetch('/api/products?status=Active&limit=1000')
      if (res.ok) {
        const data = await res.json()
        const productList = data.products || []
        // Filter out any products without valid IDs
        const validProducts = productList.filter((p: any) => p.id)
        setProducts(validProducts)
        setFilteredProducts(validProducts)
      }
    } catch (error) {
      console.error('Failed to load products', error)
    }
  }

  const handleProductSearch = (query: string) => {
    setProductSearchQuery(query)
    if (!query.trim()) {
      setFilteredProducts(products)
      return
    }
    
    const searchLower = query.toLowerCase()
    const filtered = products.filter(product => 
      product.name?.toLowerCase().includes(searchLower) ||
      product.sku?.toLowerCase().includes(searchLower) ||
      product.description?.toLowerCase().includes(searchLower)
    )
    setFilteredProducts(filtered)
  }

  const loadOrder = async () => {
    try {
      const res = await fetch(`/api/sales-orders/${id}`)
      if (res.ok) {
        const data = await res.json()
        // Normalize status values to capitalized format
        const normalizedOrder = {
          ...data.order,
          status: data.order.status?.charAt(0).toUpperCase() + data.order.status?.slice(1).toLowerCase() || 'Pending',
          payment_status: data.order.payment_status?.charAt(0).toUpperCase() + data.order.payment_status?.slice(1).toLowerCase() || 'Unpaid',
        }
        setOrder(normalizedOrder)
        // Initialize edit form values
        setEditStatus(normalizedOrder.status)
        setEditPaymentStatus(normalizedOrder.payment_status)
        setEditPaymentMethod(normalizedOrder.payment_method || "")
      }
    } catch (error) {
      console.error('Failed to load order', error)
    } finally {
      setLoading(false)
    }
  }

  const loadItems = async () => {
    try {
      const res = await fetch(`/api/sales-orders/${id}/items`)
      if (res.ok) {
        const data = await res.json()
        setItems(data.items || [])
      }
    } catch (error) {
      console.error('Failed to load items', error)
    }
  }

  const handleEditStatus = () => {
    setIsEditingStatus(true)
  }

  const handleCancelEdit = () => {
    setIsEditingStatus(false)
    if (order) {
      setEditStatus(order.status)
      setEditPaymentStatus(order.payment_status)
      setEditPaymentMethod(order.payment_method || "")
    }
  }

  const handleSaveStatus = async () => {
    try {
      const res = await fetch(`/api/sales-orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editStatus,
          payment_status: editPaymentStatus,
        })
      })

      if (res.ok) {
        await loadOrder()
        setIsEditingStatus(false)
        alert('Order updated successfully!')
      } else {
        const errorData = await res.json()
        alert(`Failed to update order: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Failed to update order', error)
      alert('Failed to update order')
    }
  }

  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId)
    const product = products.find(p => p.id && p.id.toString() === productId)
    if (product) {
      setProductCode(product.sku || '')
      setProductName(product.name || '')
      setUnitPrice(product.unit_price?.toString() || '0')
      setProductSearchQuery(product.name || '')
    }
  }

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedProductId) {
      alert('Please select a product')
      return
    }
    
    const lineTotal = parseFloat(quantity) * parseFloat(unitPrice)
    
    try {
      const res = await fetch(`/api/sales-orders/${id}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: selectedProductId,
          quantity: parseFloat(quantity),
          unit_price: parseFloat(unitPrice),
        })
      })

      if (res.ok) {
        setSelectedProductId("")
        setProductCode("")
        setProductName("")
        setProductSearchQuery("")
        setQuantity("1")
        setUnitPrice("0")
        setShowAddItem(false)
        loadItems()
        loadOrder() // Reload to get updated totals
      } else {
        const errorData = await res.json()
        console.error('Failed to add item:', errorData)
        alert(`Failed to add item: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Failed to add item', error)
      alert('Failed to add item. Please try again.')
    }
  }

  const handleDeleteItem = async (itemId: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    
    try {
      const res = await fetch(`/api/sales-orders/${id}/items/${itemId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        loadItems()
        loadOrder() // Reload to get updated totals
      }
    } catch (error) {
      console.error('Failed to delete item', error)
    }
  }

  if (loading) {
    return <div className="p-6">Loading order...</div>
  }

  if (!order) {
    return <div className="p-6">Order not found</div>
  }

  return (
    <div className="p-6 space-y-6">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{order.order_number}</h1>
          <p className="text-muted-foreground mt-1">
            Created on {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href="/erp/sales/orders">Back to Orders</a>
          </Button>
        </div>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Order Information</CardTitle>
            {!isEditingStatus ? (
              <Button variant="outline" size="sm" onClick={handleEditStatus}>
                Edit Status
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSaveStatus}>
                  Save
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Status:</span>
              {!isEditingStatus ? (
                <Badge className={STATUS_COLORS[order.status] || "bg-gray-500"}>
                  {order.status}
                </Badge>
              ) : (
                <Select value={editStatus} onValueChange={setEditStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                    <SelectItem value="Refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Payment Status:</span>
              {!isEditingStatus ? (
                <Badge className={PAYMENT_COLORS[order.payment_status] || "bg-gray-500"}>
                  {order.payment_status}
                </Badge>
              ) : (
                <Select value={editPaymentStatus} onValueChange={setEditPaymentStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Unpaid">Unpaid</SelectItem>
                    <SelectItem value="Partial">Partial</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
            {isEditingStatus && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Payment Method:</span>
                <Select value={editPaymentMethod} onValueChange={setEditPaymentMethod}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="Debit Card">Debit Card</SelectItem>
                    <SelectItem value="E-Wallet">E-Wallet</SelectItem>
                    <SelectItem value="Check">Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Date:</span>
              <span>{new Date(order.order_date).toLocaleDateString()}</span>
            </div>
            {order.expected_delivery_date && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expected Delivery:</span>
                <span>{new Date(order.expected_delivery_date).toLocaleDateString()}</span>
              </div>
            )}
            {order.payment_method && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method:</span>
                <span>{order.payment_method}</span>
              </div>
            )}
            {order.payment_terms && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Terms:</span>
                <span>{order.payment_terms}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-sm text-muted-foreground">Customer</div>
              <div className="font-medium">{order.customer}</div>
            </div>
            {order.customer_email && (
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div>{order.customer_email}</div>
              </div>
            )}
            {order.customer_phone && (
              <div>
                <div className="text-sm text-muted-foreground">Phone</div>
                <div>{order.customer_phone}</div>
              </div>
            )}
            {order.billing_address && (
              <div>
                <div className="text-sm text-muted-foreground">Billing Address</div>
                <div className="whitespace-pre-line">{order.billing_address}</div>
              </div>
            )}
            {order.shipping_address && (
              <div>
                <div className="text-sm text-muted-foreground">Shipping Address</div>
                <div className="whitespace-pre-line">{order.shipping_address}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Order Items</CardTitle>
          <Button 
            size="sm" 
            onClick={() => setShowAddItem(!showAddItem)}
          >
            {showAddItem ? 'Cancel' : 'Add Item'}
          </Button>
        </CardHeader>
        <CardContent>
          {showAddItem && (
            <form onSubmit={handleAddItem} className="mb-6 p-4 border rounded-lg space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Select Product *</label>
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Search products by name, SKU, or description..."
                    value={productSearchQuery}
                    onChange={(e) => handleProductSearch(e.target.value)}
                    className="w-full"
                  />
                  {productSearchQuery && (
                    <Select value={selectedProductId} onValueChange={handleProductSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder={
                          filteredProducts.length === 0 
                            ? "No products found" 
                            : `${filteredProducts.length} product(s) found - Click to select`
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredProducts.length === 0 ? (
                          <div className="p-4 text-sm text-muted-foreground text-center">
                            No products match your search
                          </div>
                        ) : (
                          filteredProducts
                            .filter((product) => product.id) // Filter out products without IDs
                            .map((product) => (
                              <SelectItem key={product.id} value={product.id.toString()}>
                                <div className="flex flex-col">
                                  <div className="font-medium">{product.sku} - {product.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    IDR {product.unit_price?.toLocaleString('id-ID') || '0'} • Stock: {product.total_stock || product.current_stock || 0}
                                  </div>
                                </div>
                              </SelectItem>
                            ))
                        )}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Type to search, then select from dropdown • Or enter product details manually below
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Product Code</label>
                  <Input 
                    value={productCode}
                    onChange={(e) => setProductCode(e.target.value)}
                    placeholder="SKU/Code"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Product Name *</label>
                  <Input 
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                    placeholder="Product name"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Quantity</label>
                  <Input 
                    type="number"
                    step="0.01"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Unit Price</label>
                  <Input 
                    type="number"
                    step="0.01"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm text-muted-foreground">Line Total: </span>
                <span className="font-medium">
                  Rp{(parseFloat(quantity) * parseFloat(unitPrice)).toLocaleString('id-ID', { minimumFractionDigits: 0 })}
                </span>
              </div>
              <Button type="submit">Add Item</Button>
            </form>
          )}

          {items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No items added yet. Click "Add Item" to get started.
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{item.product_name}</div>
                    {item.product_code && (
                      <div className="text-sm text-muted-foreground">SKU: {item.product_code}</div>
                    )}
                    {item.description && (
                      <div className="text-sm text-muted-foreground">{item.description}</div>
                    )}
                    <div className="text-sm mt-1">
                      Qty: {item.quantity} × Rp{parseFloat(item.unit_price?.toString() || '0').toLocaleString('id-ID', { minimumFractionDigits: 0 })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-medium">
                      Rp{parseFloat(item.line_total?.toString() || '0').toLocaleString('id-ID', { minimumFractionDigits: 0 })}
                    </div>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>Rp{parseFloat(order.subtotal?.toString() || '0').toLocaleString('id-ID', { minimumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>Rp{parseFloat(order.tax_amount?.toString() || '0').toLocaleString('id-ID', { minimumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount:</span>
              <span>-Rp{parseFloat(order.discount_amount?.toString() || '0').toLocaleString('id-ID', { minimumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between text-xl font-bold border-t pt-2">
              <span>Total:</span>
              <span>Rp{parseFloat(order.total_amount?.toString() || '0').toLocaleString('id-ID', { minimumFractionDigits: 0 })}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {(order.notes || order.internal_notes) && (
        <div className="grid md:grid-cols-2 gap-6">
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Customer Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{order.notes}</p>
              </CardContent>
            </Card>
          )}
          {order.internal_notes && (
            <Card>
              <CardHeader>
                <CardTitle>Internal Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{order.internal_notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
