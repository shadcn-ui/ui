"use client"

import { useState, useEffect } from "react"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/new-york-v4/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Label } from "@/registry/new-york-v4/ui/label"
import { Textarea } from "@/registry/new-york-v4/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/new-york-v4/ui/tabs"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Switch } from "@/registry/new-york-v4/ui/switch"
import { Loader2, X } from "lucide-react"

interface ProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  product?: any
  categories: Array<{ id: number; name: string }>
}

export function ProductDialog({
  open,
  onOpenChange,
  onSuccess,
  product,
  categories,
}: ProductDialogProps) {
  const [loading, setLoading] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    description: "",
    category_id: "",
    unit_price: "",
    cost_price: "",
    currency: "IDR",
    unit_of_measure: "pcs",
    reorder_level: "0",
    reorder_quantity: "0",
    min_order_quantity: "1",
    max_order_quantity: "",
    barcode: "",
    manufacturer: "",
    brand: "",
    model_number: "",
    weight: "",
    dimensions: "",
    status: "Active",
    is_serialized: false,
    is_batch_tracked: false,
    is_taxable: true,
    treatment_type: "",
    treatment_duration: "",
    product_line: "",
    size: "",
    shelf_life_days: "",
    pao_months: "",
    is_vegan: false,
    is_cruelty_free: false,
    is_halal: false,
  })

  useEffect(() => {
    if (product) {
      setFormData({
        sku: product.sku || "",
        name: product.name || "",
        description: product.description || "",
        category_id: product.category_id?.toString() || "",
        unit_price: product.unit_price?.toString() || "",
        cost_price: product.cost_price?.toString() || "",
        currency: product.currency || "IDR",
        unit_of_measure: product.unit_of_measure || "pcs",
        reorder_level: product.reorder_level?.toString() || "0",
        reorder_quantity: product.reorder_quantity?.toString() || "0",
        min_order_quantity: product.min_order_quantity?.toString() || "1",
        max_order_quantity: product.max_order_quantity?.toString() || "",
        barcode: product.barcode || "",
        manufacturer: product.manufacturer || "",
        brand: product.brand || "",
        model_number: product.model_number || "",
        weight: product.weight?.toString() || "",
        dimensions: product.dimensions || "",
        status: product.status || "Active",
        is_serialized: product.is_serialized || false,
        is_batch_tracked: product.is_batch_tracked || false,
        is_taxable: product.is_taxable ?? true,
        treatment_type: product.treatment_type || "",
        treatment_duration: product.treatment_duration?.toString() || "",
        product_line: product.product_line || "",
        size: product.size || "",
        shelf_life_days: product.shelf_life_days?.toString() || "",
        pao_months: product.pao_months?.toString() || "",
        is_vegan: product.is_vegan || false,
        is_cruelty_free: product.is_cruelty_free || false,
        is_halal: product.is_halal || false,
      })
      setTags(product.tags || [])
    } else {
      // Reset form for new product
      setFormData({
        sku: "",
        name: "",
        description: "",
        category_id: "",
        unit_price: "",
        cost_price: "",
        currency: "IDR",
        unit_of_measure: "pcs",
        reorder_level: "0",
        reorder_quantity: "0",
        min_order_quantity: "1",
        max_order_quantity: "",
        barcode: "",
        manufacturer: "",
        brand: "",
        model_number: "",
        weight: "",
        dimensions: "",
        status: "Active",
        is_serialized: false,
        is_batch_tracked: false,
        is_taxable: true,
        treatment_type: "",
        treatment_duration: "",
        product_line: "",
        size: "",
        shelf_life_days: "",
        pao_months: "",
        is_vegan: false,
        is_cruelty_free: false,
        is_halal: false,
      })
      setTags([])
    }
  }, [product, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        unit_price: parseFloat(formData.unit_price) || 0,
        cost_price: parseFloat(formData.cost_price) || 0,
        reorder_level: parseInt(formData.reorder_level) || 0,
        reorder_quantity: parseInt(formData.reorder_quantity) || 0,
        min_order_quantity: parseInt(formData.min_order_quantity) || 1,
        max_order_quantity: formData.max_order_quantity ? parseInt(formData.max_order_quantity) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        treatment_duration: formData.treatment_duration ? parseInt(formData.treatment_duration) : null,
        shelf_life_days: formData.shelf_life_days ? parseInt(formData.shelf_life_days) : null,
        pao_months: formData.pao_months ? parseInt(formData.pao_months) : null,
        tags: tags.length > 0 ? tags : null,
      }

      const url = product
        ? `/api/products/${product.id}`
        : "/api/products"

      const method = product ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to save product")
      }

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving product:", error)
      alert(error instanceof Error ? error.message : "Failed to save product")
    } finally {
      setLoading(false)
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription>
            {product
              ? "Update product information and settings"
              : "Create a new product with pricing and inventory details"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">
                    SKU <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    placeholder="PROD-001"
                    required
                    disabled={!!product}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">
                    Product Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Premium Facial Cream"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Product description..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category_id">Category</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category_id: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.length === 0 ? (
                        <SelectItem value="no-categories" disabled>
                          No categories available
                        </SelectItem>
                      ) : (
                        categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Discontinued">Discontinued</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit_of_measure">Unit</Label>
                  <Select
                    value={formData.unit_of_measure}
                    onValueChange={(value) =>
                      setFormData({ ...formData, unit_of_measure: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pcs">Pieces</SelectItem>
                      <SelectItem value="kg">Kilogram</SelectItem>
                      <SelectItem value="g">Gram</SelectItem>
                      <SelectItem value="l">Liter</SelectItem>
                      <SelectItem value="ml">Milliliter</SelectItem>
                      <SelectItem value="box">Box</SelectItem>
                      <SelectItem value="pack">Pack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) =>
                      setFormData({ ...formData, brand: e.target.value })
                    }
                    placeholder="LuxeSkin"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input
                    id="manufacturer"
                    value={formData.manufacturer}
                    onChange={(e) =>
                      setFormData({ ...formData, manufacturer: e.target.value })
                    }
                    placeholder="Beauty Co"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-4 mt-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unit_price">
                    Unit Price <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="unit_price"
                    type="number"
                    step="0.01"
                    value={formData.unit_price}
                    onChange={(e) =>
                      setFormData({ ...formData, unit_price: e.target.value })
                    }
                    placeholder="49.99"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cost_price">Cost Price</Label>
                  <Input
                    id="cost_price"
                    type="number"
                    step="0.01"
                    value={formData.cost_price}
                    onChange={(e) =>
                      setFormData({ ...formData, cost_price: e.target.value })
                    }
                    placeholder="25.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) =>
                      setFormData({ ...formData, currency: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IDR">IDR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2 p-4 border rounded-lg">
                <Switch
                  id="is_taxable"
                  checked={formData.is_taxable}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_taxable: checked })
                  }
                />
                <Label htmlFor="is_taxable" className="cursor-pointer">
                  Taxable Product
                </Label>
              </div>

              {formData.unit_price && formData.cost_price && (
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Profit Margin:
                    </span>
                    <span className="font-medium">
                      {(
                        ((parseFloat(formData.unit_price) -
                          parseFloat(formData.cost_price)) /
                          parseFloat(formData.unit_price)) *
                        100
                      ).toFixed(2)}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Profit per Unit:
                    </span>
                    <span className="font-medium">
                      {formData.currency}{" "}
                      {(
                        parseFloat(formData.unit_price) -
                        parseFloat(formData.cost_price)
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="inventory" className="space-y-4 mt-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reorder_level">Reorder Level</Label>
                  <Input
                    id="reorder_level"
                    type="number"
                    value={formData.reorder_level}
                    onChange={(e) =>
                      setFormData({ ...formData, reorder_level: e.target.value })
                    }
                    placeholder="50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Alert when stock falls below this level
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reorder_quantity">Reorder Quantity</Label>
                  <Input
                    id="reorder_quantity"
                    type="number"
                    value={formData.reorder_quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        reorder_quantity: e.target.value,
                      })
                    }
                    placeholder="100"
                  />
                  <p className="text-xs text-muted-foreground">
                    Quantity to order when restocking
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="barcode">Barcode</Label>
                  <Input
                    id="barcode"
                    value={formData.barcode}
                    onChange={(e) =>
                      setFormData({ ...formData, barcode: e.target.value })
                    }
                    placeholder="5901234123457"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min_order_quantity">Min Order Qty</Label>
                  <Input
                    id="min_order_quantity"
                    type="number"
                    value={formData.min_order_quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        min_order_quantity: e.target.value,
                      })
                    }
                    placeholder="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_order_quantity">Max Order Qty</Label>
                  <Input
                    id="max_order_quantity"
                    type="number"
                    value={formData.max_order_quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        max_order_quantity: e.target.value,
                      })
                    }
                    placeholder="500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model_number">Model Number</Label>
                  <Input
                    id="model_number"
                    value={formData.model_number}
                    onChange={(e) =>
                      setFormData({ ...formData, model_number: e.target.value })
                    }
                    placeholder="LC-FC-001"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <Switch
                    id="is_serialized"
                    checked={formData.is_serialized}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_serialized: checked })
                    }
                  />
                  <div>
                    <Label htmlFor="is_serialized" className="cursor-pointer">
                      Serialized Product
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Track individual units with serial numbers
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <Switch
                    id="is_batch_tracked"
                    checked={formData.is_batch_tracked}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_batch_tracked: checked })
                    }
                  />
                  <div>
                    <Label htmlFor="is_batch_tracked" className="cursor-pointer">
                      Batch Tracked
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Track products by batch numbers
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="treatment_type">Treatment Type</Label>
                  <Input
                    id="treatment_type"
                    value={formData.treatment_type}
                    onChange={(e) =>
                      setFormData({ ...formData, treatment_type: e.target.value })
                    }
                    placeholder="facial, body, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="treatment_duration">
                    Treatment Duration (minutes)
                  </Label>
                  <Input
                    id="treatment_duration"
                    type="number"
                    value={formData.treatment_duration}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        treatment_duration: e.target.value,
                      })
                    }
                    placeholder="30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product_line">Product Line</Label>
                  <Input
                    id="product_line"
                    value={formData.product_line}
                    onChange={(e) =>
                      setFormData({ ...formData, product_line: e.target.value })
                    }
                    placeholder="Premium, Standard"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="size">Size</Label>
                  <Input
                    id="size"
                    value={formData.size}
                    onChange={(e) =>
                      setFormData({ ...formData, size: e.target.value })
                    }
                    placeholder="50ml, 100g"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (g)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.01"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: e.target.value })
                    }
                    placeholder="50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dimensions">Dimensions</Label>
                  <Input
                    id="dimensions"
                    value={formData.dimensions}
                    onChange={(e) =>
                      setFormData({ ...formData, dimensions: e.target.value })
                    }
                    placeholder="5x5x8 cm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shelf_life_days">Shelf Life (days)</Label>
                  <Input
                    id="shelf_life_days"
                    type="number"
                    value={formData.shelf_life_days}
                    onChange={(e) =>
                      setFormData({ ...formData, shelf_life_days: e.target.value })
                    }
                    placeholder="730"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pao_months">PAO (months)</Label>
                  <Input
                    id="pao_months"
                    type="number"
                    value={formData.pao_months}
                    onChange={(e) =>
                      setFormData({ ...formData, pao_months: e.target.value })
                    }
                    placeholder="12"
                  />
                  <p className="text-xs text-muted-foreground">
                    Period After Opening
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_vegan"
                      checked={formData.is_vegan}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, is_vegan: checked })
                      }
                    />
                    <Label htmlFor="is_vegan" className="cursor-pointer">
                      Vegan
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_cruelty_free"
                      checked={formData.is_cruelty_free}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, is_cruelty_free: checked })
                      }
                    />
                    <Label htmlFor="is_cruelty_free" className="cursor-pointer">
                      Cruelty Free
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_halal"
                      checked={formData.is_halal}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, is_halal: checked })
                      }
                    />
                    <Label htmlFor="is_halal" className="cursor-pointer">
                      Halal
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                    placeholder="Add tag and press Enter"
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    Add
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                        <X
                          className="ml-1 h-3 w-3 cursor-pointer"
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {product ? "Update Product" : "Create Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
