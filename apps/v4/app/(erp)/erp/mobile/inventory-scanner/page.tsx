"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/registry/new-york-v4/ui/card"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/new-york-v4/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/new-york-v4/ui/dialog"
import { Label } from "@/registry/new-york-v4/ui/label"
import { 
  Scan, 
  Package, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Camera,
  Plus,
  Minus,
  Search,
  History
} from "lucide-react"

interface InventoryItem {
  id: number
  sku: string
  name: string
  quantity: number
  location: string
  status: 'available' | 'low_stock' | 'out_of_stock'
  last_updated: string
}

interface ScanHistory {
  id: number
  sku: string
  product_name: string
  action: 'scan' | 'add' | 'remove'
  quantity: number
  timestamp: string
  user: string
}

export default function MobileInventoryScannerPage() {
  const [scanInput, setScanInput] = useState("")
  const [scannedItem, setScannedItem] = useState<InventoryItem | null>(null)
  const [scanHistory, setScanHistory] = useState<ScanHistory[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [adjustmentQuantity, setAdjustmentQuantity] = useState(0)
  const [activeTab, setActiveTab] = useState("scanner")

  useEffect(() => {
    loadScanHistory()
  }, [])

  const loadScanHistory = async () => {
    try {
      const response = await fetch('/api/mobile/scan-history')
      if (response.ok) {
        const data = await response.json()
        setScanHistory(data)
      }
    } catch (error) {
      console.error('Error loading scan history:', error)
    }
  }

  const handleScan = async (sku: string) => {
    if (!sku.trim()) return

    setIsScanning(true)
    try {
      const response = await fetch(`/api/mobile/inventory-scan?sku=${sku}`)
      if (response.ok) {
        const data = await response.json()
        setScannedItem(data)
        setShowDialog(true)
        
        // Add to history
        const historyEntry: ScanHistory = {
          id: Date.now(),
          sku: data.sku,
          product_name: data.name,
          action: 'scan',
          quantity: data.quantity,
          timestamp: new Date().toISOString(),
          user: 'Current User'
        }
        setScanHistory([historyEntry, ...scanHistory])
      } else {
        alert('Product not found!')
      }
    } catch (error) {
      console.error('Error scanning item:', error)
      alert('Error scanning item')
    } finally {
      setIsScanning(false)
      setScanInput("")
    }
  }

  const handleAdjustment = async (action: 'add' | 'remove') => {
    if (!scannedItem || adjustmentQuantity === 0) return

    try {
      const response = await fetch('/api/mobile/inventory-adjustment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku: scannedItem.sku,
          action,
          quantity: adjustmentQuantity
        })
      })

      if (response.ok) {
        const updated = await response.json()
        setScannedItem(updated)
        
        // Add to history
        const historyEntry: ScanHistory = {
          id: Date.now(),
          sku: scannedItem.sku,
          product_name: scannedItem.name,
          action,
          quantity: adjustmentQuantity,
          timestamp: new Date().toISOString(),
          user: 'Current User'
        }
        setScanHistory([historyEntry, ...scanHistory])
        
        setAdjustmentQuantity(0)
        alert(`Successfully ${action === 'add' ? 'added' : 'removed'} ${adjustmentQuantity} units`)
      }
    } catch (error) {
      console.error('Error adjusting inventory:', error)
      alert('Error adjusting inventory')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500'
      case 'low_stock': return 'bg-yellow-500'
      case 'out_of_stock': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'add': return <Plus className="h-4 w-4 text-green-500" />
      case 'remove': return <Minus className="h-4 w-4 text-red-500" />
      default: return <Scan className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Mobile-Optimized Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Inventory Scanner</h1>
        <p className="text-sm text-gray-600">Mobile barcode scanner for warehouse operations</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Scanned Today</p>
                <p className="text-2xl font-bold">{scanHistory.length}</p>
              </div>
              <Scan className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Last Action</p>
                <p className="text-sm font-semibold">
                  {scanHistory.length > 0 ? new Date(scanHistory[0].timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'N/A'}
                </p>
              </div>
              <History className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scanner">Scanner</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Scanner Tab */}
        <TabsContent value="scanner" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scan className="h-5 w-5" />
                Scan Item
              </CardTitle>
              <CardDescription>
                Enter or scan barcode to check inventory
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Scanner Input */}
              <div className="space-y-2">
                <Label htmlFor="scan-input">Barcode / SKU</Label>
                <div className="flex gap-2">
                  <Input
                    id="scan-input"
                    type="text"
                    placeholder="Scan or enter SKU..."
                    value={scanInput}
                    onChange={(e) => setScanInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleScan(scanInput)
                      }
                    }}
                    className="text-lg"
                    autoFocus
                  />
                  <Button 
                    size="lg" 
                    onClick={() => handleScan(scanInput)}
                    disabled={isScanning || !scanInput.trim()}
                  >
                    {isScanning ? (
                      <>
                        <div className="animate-spin mr-2">⏳</div>
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-5 w-5" />
                        Scan
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Camera Button */}
              <Button variant="outline" className="w-full" size="lg">
                <Camera className="mr-2 h-5 w-5" />
                Open Camera Scanner
              </Button>

              {/* Quick Access Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => handleScan('SKU-CREAM-001')}
                  className="h-20"
                >
                  <div className="text-center">
                    <Package className="h-6 w-6 mx-auto mb-1" />
                    <div className="text-xs">Test Scan 1</div>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleScan('SKU-SERUM-002')}
                  className="h-20"
                >
                  <div className="text-center">
                    <Package className="h-6 w-6 mx-auto mb-1" />
                    <div className="text-xs">Test Scan 2</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-3">
          {scanHistory.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <History className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p className="text-gray-600">No scan history yet</p>
                <p className="text-sm text-gray-400">Start scanning items to see history</p>
              </CardContent>
            </Card>
          ) : (
            scanHistory.map((entry) => (
              <Card key={entry.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getActionIcon(entry.action)}
                        <span className="font-semibold">{entry.product_name}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        SKU: {entry.sku}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(entry.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={entry.action === 'add' ? 'default' : entry.action === 'remove' ? 'destructive' : 'secondary'}>
                        {entry.action === 'add' && '+'}
                        {entry.action === 'remove' && '-'}
                        {entry.quantity}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Scanned Item Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Item Scanned</DialogTitle>
            <DialogDescription>
              Review item details and adjust quantity
            </DialogDescription>
          </DialogHeader>
          
          {scannedItem && (
            <div className="space-y-4">
              {/* Item Info */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Product:</span>
                  <span className="font-semibold">{scannedItem.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">SKU:</span>
                  <span className="font-mono text-sm">{scannedItem.sku}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Location:</span>
                  <span className="text-sm">{scannedItem.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Stock:</span>
                  <Badge className={getStatusColor(scannedItem.status)}>
                    {scannedItem.quantity} units
                  </Badge>
                </div>
              </div>

              {/* Quantity Adjustment */}
              <div className="space-y-2">
                <Label>Adjustment Quantity</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setAdjustmentQuantity(Math.max(0, adjustmentQuantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={adjustmentQuantity}
                    onChange={(e) => setAdjustmentQuantity(parseInt(e.target.value) || 0)}
                    className="text-center text-lg font-bold"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setAdjustmentQuantity(adjustmentQuantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Quick Adjustment Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[1, 5, 10, 50].map((qty) => (
                  <Button
                    key={qty}
                    variant="outline"
                    size="sm"
                    onClick={() => setAdjustmentQuantity(qty)}
                  >
                    {qty}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="destructive"
              onClick={() => handleAdjustment('remove')}
              disabled={adjustmentQuantity === 0}
              className="flex-1"
            >
              <Minus className="mr-2 h-4 w-4" />
              Remove
            </Button>
            <Button
              onClick={() => handleAdjustment('add')}
              disabled={adjustmentQuantity === 0}
              className="flex-1"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
