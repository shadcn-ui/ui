"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/registry/new-york-v4/ui/card"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Label } from "@/registry/new-york-v4/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/new-york-v4/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/new-york-v4/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/registry/new-york-v4/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { WorkflowApprovalCard } from "@/components/workflow/WorkflowApprovalCard"

interface Item {
  id: number
  description: string
  quantity: number
  unit_price: number
  line_total: number
}

interface Quotation {
  id: number
  reference_number?: string
  customer: string
  total_value: number
  status?: string
  valid_until?: string
  created_at: string
}

interface Product {
  id: string
  name: string
  description: string
  unit_price: number
  sku: string
  category_id: number
  category_name: string
}

export default function QuotationDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const id = resolvedParams.id
  const router = useRouter()
  const [quotation, setQuotation] = useState<Quotation | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editDesc, setEditDesc] = useState("")
  const [editQty, setEditQty] = useState("1")
  const [editUnit, setEditUnit] = useState("0.00")
  const [loading, setLoading] = useState(true)
  
  // Product selection
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [open, setOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  
  // Form fields
  const [desc, setDesc] = useState("")
  const [qty, setQty] = useState("1")
  const [unit, setUnit] = useState("0.00")

  // Get unique categories from products
  const categories = Array.from(new Set(products.map(p => p.category_name).filter(Boolean)))
  
  // Filter products by category
  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(p => p.category_name === selectedCategory)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const resQ = await fetch(`/api/quotations/${id}`)
      if (resQ.ok) setQuotation((await resQ.json()).quotation)
      const resItems = await fetch(`/api/quotations/${id}/items`)
      if (resItems.ok) setItems((await resItems.json()).items || [])
      
      // Fetch products
      const resProducts = await fetch('/api/products')
      if (resProducts.ok) {
        const data = await resProducts.json()
        setProducts(data.products || [])
      }
      
      setLoading(false)
    }
    load()
  }, [id])

  // Handle product selection
  const handleProductSelect = (productId: string) => {
    setSelectedProduct(productId)
    setOpen(false)
    if (productId === "custom") {
      // Allow custom description
      setDesc("")
      setUnit("0.00")
    } else {
      const product = products.find(p => p.id === productId)
      if (product) {
        setDesc(product.name)
        setUnit(product.unit_price.toString())
      }
    }
  }

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/quotations/${id}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: desc, quantity: qty, unit_price: unit })
      })
      if (res.ok) {
        const data = await res.json()
        setItems(prev => [...prev, data.item])
        setQuotation(prev => prev ? { ...prev, total_value: data.total } : prev)
        setSelectedProduct("")
        setDesc("")
        setQty("1")
        setUnit("0.00")
      } else {
        console.error('Failed to add item')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const changeStatus = async (newStatus: string) => {
    try {
      const res = await fetch(`/api/quotations/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus }) })
      if (res.ok) setQuotation((await res.json()).quotation)
    } catch (err) { console.error(err) }
  }

  const exportHtml = () => {
    window.open(`/api/quotations/${id}/export`, '_blank')
  }

  const sendEmail = async () => {
    const to = prompt('Recipient email')
    if (!to) return
    try {
      const res = await fetch(`/api/quotations/${id}/send`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ to }) })
      const data = await res.json()
      alert(data.message || data.error || 'Done')
    } catch (err) { console.error(err) }
  }

  if (loading) return <div className="p-6">Loading...</div>
  if (!quotation) return <div className="p-6">Quotation not found</div>

  return (
    <div className="space-y-6 p-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quotation {quotation.reference_number || `Q-${quotation.id}`}</h1>
          <div className="text-muted-foreground">{quotation.customer}</div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => changeStatus('Sent')}>Mark Sent</Button>
          <Button onClick={exportHtml}>Export</Button>
          <Button onClick={sendEmail}>Send</Button>
          <Button variant="outline" asChild>
            <a href="/erp/sales/quotations">Back</a>
          </Button>
        </div>
      </header>

      <WorkflowApprovalCard documentType="quotation" documentId={Number(id)} />

      <Card>
        <CardHeader>
          <CardTitle>Line Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left font-semibold">#</th>
                    <th className="p-3 text-left font-semibold">Product/Description</th>
                    <th className="p-3 text-center font-semibold">Quantity</th>
                    <th className="p-3 text-right font-semibold">Unit Price</th>
                    <th className="p-3 text-right font-semibold">Line Total</th>
                    <th className="p-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        No items added yet. Add your first item below.
                      </td>
                    </tr>
                  ) : (
                    items.map((it, index) => (
                      <tr key={it.id} className="border-b hover:bg-muted/30 transition-colors">
                        {editingId === it.id ? (
                          <>
                            <td className="p-3 text-muted-foreground">{index + 1}</td>
                            <td className="p-3">
                              <Input 
                                value={editDesc} 
                                onChange={e => setEditDesc(e.target.value)} 
                                placeholder="Product description"
                                className="w-full"
                              />
                            </td>
                            <td className="p-3">
                              <Input 
                                value={editQty} 
                                onChange={e => setEditQty(e.target.value)} 
                                type="number" 
                                min="1"
                                className="w-24 text-center"
                              />
                            </td>
                            <td className="p-3">
                              <Input 
                                value={editUnit} 
                                onChange={e => setEditUnit(e.target.value)} 
                                type="number" 
                                min="0"
                                step="0.01"
                                className="w-32 text-right"
                              />
                            </td>
                            <td className="p-3 text-right font-medium">
                              Rp{(Number(editQty) * Number(editUnit)).toLocaleString('id-ID', { minimumFractionDigits: 0 })}
                            </td>
                            <td className="p-3">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  size="sm"
                                  onClick={async () => {
                                    try {
                                      const res = await fetch(`/api/quotations/${id}/items/${it.id}`, { 
                                        method: 'PATCH', 
                                        headers: { 'Content-Type': 'application/json' }, 
                                        body: JSON.stringify({ 
                                          description: editDesc, 
                                          quantity: Number(editQty), 
                                          unit_price: Number(editUnit) 
                                        }) 
                                      })
                                      if (res.ok) {
                                        const data = await res.json()
                                        setItems(prev => prev.map(p => p.id === it.id ? data.item : p))
                                        setQuotation(prev => prev ? { ...prev, total_value: data.total } : prev)
                                        setEditingId(null)
                                      } else {
                                        console.error('Failed to update item')
                                      }
                                    } catch (err) { console.error(err) }
                                  }}
                                >
                                  Save
                                </Button>
                                <Button 
                                  size="sm"
                                  variant="outline" 
                                  onClick={() => setEditingId(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="p-3 text-muted-foreground font-medium">{index + 1}</td>
                            <td className="p-3">
                              <div className="font-medium">{it.description}</div>
                            </td>
                            <td className="p-3 text-center font-medium">{it.quantity}</td>
                            <td className="p-3 text-right">
                              <span className="font-medium">
                                Rp{Number(it.unit_price).toLocaleString('id-ID', { minimumFractionDigits: 0 })}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <span className="font-semibold text-primary">
                                Rp{(it.quantity * it.unit_price).toLocaleString('id-ID', { minimumFractionDigits: 0 })}
                              </span>
                            </td>
                            <td className="p-3">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  size="sm"
                                  variant="outline"
                                  onClick={() => { 
                                    setEditingId(it.id); 
                                    setEditDesc(it.description); 
                                    setEditQty(String(it.quantity)); 
                                    setEditUnit(String(it.unit_price)) 
                                  }}
                                >
                                  Edit
                                </Button>
                                <Button 
                                  size="sm"
                                  variant="destructive" 
                                  onClick={async () => {
                                    if (!confirm('Delete this item?')) return
                                    try {
                                      const res = await fetch(`/api/quotations/${id}/items/${it.id}`, { method: 'DELETE' })
                                      if (res.ok) {
                                        const data = await res.json()
                                        setItems(prev => prev.filter(p => p.id !== it.id))
                                        setQuotation(prev => prev ? { ...prev, total_value: data.total } : prev)
                                      } else {
                                        console.error('Failed to delete item')
                                      }
                                    } catch (err) { console.error(err) }
                                  }}
                                >
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6 border-t pt-4">
              <div className="flex justify-end">
                <div className="w-80 space-y-3">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'}):</span>
                    <span>Rp{Number(quotation.total_value).toLocaleString('id-ID', { minimumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-3">
                    <span>Total:</span>
                    <span className="text-primary text-xl">
                      Rp{Number(quotation.total_value).toLocaleString('id-ID', { minimumFractionDigits: 0 })}
                    </span>
                  </div>
                  {quotation.valid_until && (
                    <div className="text-xs text-muted-foreground text-right pt-2 border-t">
                      Valid until: {new Date(quotation.valid_until).toLocaleDateString('id-ID', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold mb-3">Add New Item</h3>
              <form onSubmit={addItem} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category-filter">Filter by Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger id="category-filter">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="product-select">Product Name</Label>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-full justify-between"
                        >
                          {selectedProduct
                            ? selectedProduct === "custom"
                              ? "Custom Description"
                              : products.find((product) => product.id === selectedProduct)?.name
                            : "Select product..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[500px] p-0">
                        <Command>
                          <CommandInput placeholder="Search product..." />
                          <CommandList>
                            <CommandEmpty>No product found.</CommandEmpty>
                            <CommandGroup heading="Options">
                              <CommandItem
                                value="custom"
                                onSelect={() => handleProductSelect("custom")}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedProduct === "custom" ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                Custom Description
                              </CommandItem>
                            </CommandGroup>
                            {selectedCategory === "all" ? (
                              // Group by category when "All Categories" is selected
                              categories.map((category) => {
                                const categoryProducts = products.filter(p => p.category_name === category)
                                if (categoryProducts.length === 0) return null
                                return (
                                  <CommandGroup key={category} heading={category}>
                                    {categoryProducts.map((product) => (
                                      <CommandItem
                                        key={product.id}
                                        value={`${product.name} ${product.sku} ${product.category_name}`}
                                        onSelect={() => handleProductSelect(product.id)}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedProduct === product.id ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                        <div className="flex flex-col">
                                          <span>{product.name}</span>
                                          <span className="text-xs text-muted-foreground">
                                            SKU: {product.sku} | Rp{Number(product.unit_price).toLocaleString('id-ID')}
                                          </span>
                                        </div>
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                )
                              })
                            ) : (
                              // Show filtered products when a specific category is selected
                              <CommandGroup heading={selectedCategory}>
                                {filteredProducts.map((product) => (
                                  <CommandItem
                                    key={product.id}
                                    value={`${product.name} ${product.sku}`}
                                    onSelect={() => handleProductSelect(product.id)}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        selectedProduct === product.id ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    <div className="flex flex-col">
                                      <span>{product.name}</span>
                                      <span className="text-xs text-muted-foreground">
                                        SKU: {product.sku} | Rp{Number(product.unit_price).toLocaleString('id-ID')}
                                      </span>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            )}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                  
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input 
                      id="description"
                      placeholder="Product description" 
                      value={desc} 
                      onChange={e => setDesc(e.target.value)} 
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input 
                      id="quantity"
                      placeholder="Qty" 
                      value={qty} 
                      onChange={e => setQty(e.target.value)} 
                      type="number" 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="unit-price">Unit Price (Rp)</Label>
                    <Input 
                      id="unit-price"
                      placeholder="Unit price" 
                      value={unit} 
                      onChange={e => setUnit(e.target.value)} 
                      type="number" 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Line Total</Label>
                    <div className="flex h-10 items-center rounded-md border border-input bg-muted px-3 py-2 text-sm">
                      Rp{(Number(qty) * Number(unit)).toLocaleString('id-ID', { minimumFractionDigits: 0 })}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit">Add Item</Button>
                  <Button type="button" variant="outline" onClick={() => { 
                    setOpen(false);
                    setSelectedCategory('all');
                    setSelectedProduct(''); 
                    setDesc(''); 
                    setQty('1'); 
                    setUnit('0') 
                  }}>Clear</Button>
                </div>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
