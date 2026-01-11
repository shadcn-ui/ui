"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/registry/new-york-v4/ui/card"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/new-york-v4/ui/select"
import { Textarea } from "@/registry/new-york-v4/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/new-york-v4/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/registry/new-york-v4/ui/command"
import { Trash2, Plus, Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface Lead {
  id: string
  first_name: string
  last_name: string
  email?: string
  phone?: string
  company?: string
}

interface Product {
  id: string
  sku: string
  name: string
  unit_price: string
  current_stock: number
  stock_status: string
}

interface OrderItem {
  id: string
  product_id: string | null
  product_name: string
  sku: string
  quantity: number
  unit_price: number
  total_price: number
}

export default function NewSalesOrderPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Customer info
  const [customer, setCustomer] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [billingAddress, setBillingAddress] = useState("")
  const [shippingAddress, setShippingAddress] = useState("")
  
  // Lead selection
  const [leads, setLeads] = useState<Lead[]>([])
  const [leadId, setLeadId] = useState<string | null>(null)
  
  // Order details
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0])
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("")
  const [status, setStatus] = useState("Pending")
  const [paymentStatus, setPaymentStatus] = useState("Unpaid")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [paymentTerms, setPaymentTerms] = useState("")
  const [notes, setNotes] = useState("")
  const [internalNotes, setInternalNotes] = useState("")
  
  // Order Items
  const [products, setProducts] = useState<Product[]>([])
  const [items, setItems] = useState<OrderItem[]>([])
  const [selectedProductId, setSelectedProductId] = useState<string>("")
  const [quantity, setQuantity] = useState<string>("1")
  const [openProductCombobox, setOpenProductCombobox] = useState(false)
  
  // Financial (auto-calculated)
  const [taxRate, setTaxRate] = useState<string>("11") // 11% PPN Indonesia
  const [discountAmount, setDiscountAmount] = useState<string>("0")

  useEffect(() => {
    loadLeads()
    loadProducts()
  }, [])

  const loadLeads = async () => {
    try {
      const res = await fetch('/api/leads')
      if (res.ok) {
        const data = await res.json()
        const payload = data.leads || data
        if (Array.isArray(payload)) {
          setLeads(payload.map((l: any) => ({
            id: String(l.id),
            first_name: l.first_name || l.firstName || '',
            last_name: l.last_name || l.lastName || '',
            email: l.email || '',
            phone: l.phone || '',
            company: l.company || ''
          })))
        }
      }
    } catch (error) {
      console.error('Failed to load leads', error)
    }
  }

  const loadProducts = async () => {
    try {
      const res = await fetch('/api/products?status=Active&limit=1000')
      if (res.ok) {
        const data = await res.json()
        const payload = data.products || data
        if (Array.isArray(payload)) {
          // Sort products alphabetically by product name for better UX
          const sortedProducts = payload.sort((a, b) => 
            a.name.localeCompare(b.name, 'id-ID', { sensitivity: 'base' })
          )
          setProducts(sortedProducts)
        }
      }
    } catch (error) {
      console.error('Failed to load products', error)
    }
  }

  // Calculate subtotal from items
  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.total_price, 0)
  }

  // Calculate tax from subtotal
  const calculateTax = () => {
    const subtotal = calculateSubtotal()
    const rate = parseFloat(taxRate) || 0
    return (subtotal * rate) / 100
  }

  // Calculate total
  const calculateTotal = () => {
    const sub = calculateSubtotal()
    const tax = calculateTax()
    const discount = parseFloat(discountAmount) || 0
    return sub + tax - discount
  }

  // Add item to order
  const handleAddItem = () => {
    if (!selectedProductId) {
      alert('⚠️ Please select a product from the dropdown')
      return
    }

    const product = products.find(p => p.id === selectedProductId)
    if (!product) {
      alert('❌ Selected product not found')
      return
    }

    // Check if item already added
    const existingItem = items.find(item => item.product_id === product.id)
    if (existingItem) {
      alert(`ℹ️ "${product.name}" is already in the order. Please update the quantity in the table.`)
      return
    }

    const qty = parseFloat(quantity) || 1
    if (qty <= 0) {
      alert('⚠️ Quantity must be greater than 0')
      return
    }

    // Stock validation
    if (qty > product.current_stock) {
      const confirm = window.confirm(
        `⚠️ Warning: Requested quantity (${qty}) exceeds available stock (${product.current_stock}).\n\nDo you want to continue anyway?`
      )
      if (!confirm) return
    }

    const unitPrice = parseFloat(product.unit_price) || 0
    const totalPrice = qty * unitPrice

    const newItem: OrderItem = {
      id: `temp-${Date.now()}`,
      product_id: product.id,
      product_name: product.name,
      sku: product.sku,
      quantity: qty,
      unit_price: unitPrice,
      total_price: totalPrice
    }

    setItems([...items, newItem])
    setSelectedProductId('')
    setQuantity('1')
  }

  // Remove item from order
  const handleRemoveItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId))
  }

  // Update item quantity
  const handleUpdateQuantity = (itemId: string, newQty: string) => {
    const qty = parseFloat(newQty) || 0
    setItems(items.map(item => {
      if (item.id === itemId) {
        const totalPrice = qty * item.unit_price
        return { ...item, quantity: qty, total_price: totalPrice }
      }
      return item
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0) {
      alert('Please add at least one item to the order')
      return
    }

    if (!customer.trim()) {
      alert('Please enter a customer name')
      return
    }

    setIsSubmitting(true)

    try {
      // Step 1: Create or get customer
      let customerId: string

      // Try to find existing customer by name
      const searchCustomerRes = await fetch(`/api/customers?search=${encodeURIComponent(customer)}&limit=1`)
      if (searchCustomerRes.ok) {
        const searchData = await searchCustomerRes.json()
        const customers = searchData.customers || searchData
        if (Array.isArray(customers) && customers.length > 0) {
          customerId = customers[0].id
        } else {
          // Create new customer
          const createCustomerRes = await fetch('/api/customers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              company_name: customer,
              contact_first_name: customer.split(' ')[0] || '',
              contact_last_name: customer.split(' ').slice(1).join(' ') || '',
              contact_email: customerEmail || null,
              contact_phone: customerPhone || null,
              billing_address: billingAddress || null,
              shipping_address: shippingAddress || billingAddress || null,
            })
          })
          
          if (!createCustomerRes.ok) {
            const errorData = await createCustomerRes.json()
            console.error('Customer creation error:', errorData)
            throw new Error(errorData.error || 'Failed to create customer')
          }
          
          const customerData = await createCustomerRes.json()
          customerId = customerData.customer?.id || customerData.id
          
          if (!customerId) {
            console.error('No customer ID in response:', customerData)
            throw new Error('Customer created but no ID returned')
          }
        }
      } else {
        throw new Error('Failed to search for customers')
      }

      // Step 2: Create sales order
      const subtotal = calculateSubtotal()
      const taxAmount = calculateTax()
      const totalAmount = calculateTotal()
      
      const orderBody = {
        customer_id: customerId,
        opportunity_id: null, // Can be added later if needed
        subtotal: subtotal,
        tax_amount: taxAmount,
        shipping_amount: 0,
        total_amount: totalAmount,
        status: status,
        payment_status: paymentStatus,
        order_date: orderDate,
        expected_ship_date: expectedDeliveryDate || null,
        notes: notes || null,
        created_by: null, // Should be set from session
      }

      const res = await fetch('/api/sales-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderBody)
      })

      if (res.ok) {
        const data = await res.json()
        const orderId = data.order.id

        // Add all items to the order
        for (const item of items) {
          const itemBody = {
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
          }
          
          const itemRes = await fetch(`/api/sales-orders/${orderId}/items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(itemBody)
          })
          
          if (!itemRes.ok) {
            const itemError = await itemRes.json()
            console.error('Failed to add item:', itemError)
            // Don't throw error, continue with other items
          }
        }

        alert('✓ Sales order created successfully!')
        router.push(`/erp/sales/orders/${orderId}`)
      } else {
        const error = await res.json()
        console.error('Failed to create order:', error)
        alert('Failed to create order: ' + (error.details || error.error))
      }
    } catch (error) {
      console.error('Error creating order:', error)
      alert('An error occurred while creating the order')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Create Sales Order</h1>
        <p className="text-muted-foreground mt-1">Enter order details and customer information</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {leads.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-1">Select from Existing Lead (Optional)</label>
                <Select value={leadId || undefined} onValueChange={(val: string) => {
                  const lead = leads.find(l => l.id === val)
                  if (lead) {
                    setLeadId(val)
                    setCustomer(`${lead.first_name} ${lead.last_name}${lead.company ? ` - ${lead.company}` : ''}`)
                    setCustomerEmail(lead.email || '')
                    setCustomerPhone(lead.phone || '')
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a lead" />
                  </SelectTrigger>
                  <SelectContent>
                    {leads.map((lead) => (
                      <SelectItem key={lead.id} value={lead.id}>
                        {lead.first_name} {lead.last_name}{lead.company ? ` - ${lead.company}` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Customer Name *</label>
              <Input 
                value={customer} 
                onChange={(e) => setCustomer(e.target.value)} 
                required 
                placeholder="Enter customer name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input 
                  type="email"
                  value={customerEmail} 
                  onChange={(e) => setCustomerEmail(e.target.value)} 
                  placeholder="customer@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <Input 
                  value={customerPhone} 
                  onChange={(e) => setCustomerPhone(e.target.value)} 
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Billing Address</label>
              <Textarea 
                value={billingAddress} 
                onChange={(e) => setBillingAddress(e.target.value)} 
                placeholder="Enter billing address"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Shipping Address</label>
              <Textarea 
                value={shippingAddress} 
                onChange={(e) => setShippingAddress(e.target.value)} 
                placeholder="Enter shipping address (leave blank if same as billing)"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Order Date *</label>
                <Input 
                  type="date"
                  value={orderDate} 
                  onChange={(e) => setOrderDate(e.target.value)} 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Expected Delivery Date</label>
                <Input 
                  type="date"
                  value={expectedDeliveryDate} 
                  onChange={(e) => setExpectedDeliveryDate(e.target.value)} 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Payment Status</label>
                <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Unpaid">Unpaid</SelectItem>
                    <SelectItem value="Partial">Partial</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Payment Method</label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
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
              <div>
                <label className="block text-sm font-medium mb-1">Payment Terms</label>
                <Input 
                  value={paymentTerms} 
                  onChange={(e) => setPaymentTerms(e.target.value)} 
                  placeholder="Net 30, Due on Receipt, etc."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Item Form with Searchable Combobox */}
            <div className="flex gap-2">
              <div className="flex-1">
                <Popover open={openProductCombobox} onOpenChange={setOpenProductCombobox}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openProductCombobox}
                      className="w-full justify-between"
                    >
                      {selectedProductId
                        ? (() => {
                            const product = products.find(p => p.id === selectedProductId)
                            return product ? (
                              <span className="flex items-center gap-2">
                                <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{product.sku}</span>
                                <span>{product.name}</span>
                                <span className="text-muted-foreground">
                                  (Rp{parseFloat(product.unit_price).toLocaleString('id-ID')})
                                </span>
                              </span>
                            ) : "Select product..."
                          })()
                        : "Search and select product..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[600px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search by product name or SKU..." />
                      <CommandList>
                        <CommandEmpty>No product found.</CommandEmpty>
                        <CommandGroup heading={`${products.length} Products Available`}>
                          {products.map((product) => (
                            <CommandItem
                              key={product.id}
                              value={`${product.sku} ${product.name}`}
                              onSelect={() => {
                                setSelectedProductId(product.id)
                                setOpenProductCombobox(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedProductId === product.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <div className="flex items-center gap-3 flex-1">
                                <span className="font-mono text-xs bg-muted px-2 py-1 rounded min-w-[80px]">
                                  {product.sku}
                                </span>
                                <span className="flex-1 font-medium">{product.name}</span>
                                <div className="flex flex-col items-end gap-0.5">
                                  <span className="text-sm font-semibold text-green-600">
                                    Rp{parseFloat(product.unit_price).toLocaleString('id-ID')}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    Stock: {product.current_stock}
                                  </span>
                                </div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="w-28">
                <Input
                  type="number"
                  placeholder="Qty"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                  className="text-center"
                />
              </div>
              <Button type="button" onClick={handleAddItem} size="default">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            {/* Items Table */}
            {items.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-2 text-left">Product</th>
                      <th className="px-4 py-2 text-left">SKU</th>
                      <th className="px-4 py-2 text-right">Unit Price</th>
                      <th className="px-4 py-2 text-center">Quantity</th>
                      <th className="px-4 py-2 text-right">Total</th>
                      <th className="px-4 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-t">
                        <td className="px-4 py-2">{item.product_name}</td>
                        <td className="px-4 py-2">{item.sku}</td>
                        <td className="px-4 py-2 text-right">
                          Rp{item.unit_price.toLocaleString('id-ID', { minimumFractionDigits: 0 })}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleUpdateQuantity(item.id, e.target.value)}
                            className="w-20 text-center"
                            min="1"
                          />
                        </td>
                        <td className="px-4 py-2 text-right font-medium">
                          Rp{item.total_price.toLocaleString('id-ID', { minimumFractionDigits: 0 })}
                        </td>
                        <td className="px-4 py-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {items.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No items added yet. Select a product and click "Add" to add items.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tax Rate (%)</label>
                <Input 
                  type="number"
                  step="0.01"
                  value={taxRate} 
                  onChange={(e) => setTaxRate(e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Discount Amount</label>
                <Input 
                  type="number"
                  step="0.01"
                  value={discountAmount} 
                  onChange={(e) => setDiscountAmount(e.target.value)} 
                />
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span className="font-medium">Rp{calculateSubtotal().toLocaleString('id-ID', { minimumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax ({taxRate}%):</span>
                <span className="font-medium">Rp{calculateTax().toLocaleString('id-ID', { minimumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Discount:</span>
                <span className="font-medium text-destructive">-Rp{parseFloat(discountAmount || '0').toLocaleString('id-ID', { minimumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total:</span>
                <span className="text-2xl">Rp{calculateTotal().toLocaleString('id-ID', { minimumFractionDigits: 0 })}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Customer Notes</label>
              <Textarea 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)} 
                placeholder="Notes visible to customer"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Internal Notes</label>
              <Textarea 
                value={internalNotes} 
                onChange={(e) => setInternalNotes(e.target.value)} 
                placeholder="Internal notes (not visible to customer)"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Order'}
          </Button>
        </div>
      </form>
    </div>
  )
}
