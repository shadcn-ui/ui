"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/registry/new-york-v4/ui/card"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Label } from "@/registry/new-york-v4/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/new-york-v4/ui/tabs"
import { Switch } from "@/registry/new-york-v4/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/new-york-v4/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/new-york-v4/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/new-york-v4/ui/select"
import { SidebarTrigger } from "@/registry/new-york-v4/ui/sidebar"
import { Separator } from "@/registry/new-york-v4/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/registry/new-york-v4/ui/breadcrumb"
import { 
  Plug,
  CheckCircle,
  XCircle,
  Settings,
  RefreshCw,
  Plus,
  ShoppingBag,
  CreditCard,
  Truck,
  Calculator,
  Webhook,
  Activity,
  Store,
  MessageSquare,
  BarChart3,
  Package
} from "lucide-react"
import { toast } from "sonner"

// Helper function to format date consistently (avoids hydration mismatch)
function formatLastSync(dateString: string): string {
  const date = new Date(dateString)
  const month = date.toLocaleString('en-US', { month: 'short' })
  const day = date.getDate()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${day} ${month}, ${hours}:${minutes}`
}

interface Integration {
  id: string
  name: string
  category: 'accounting' | 'ecommerce' | 'payment' | 'logistics' | 'webhook'
  status: 'active' | 'inactive' | 'error'
  icon: any
  description: string
  lastSync?: string
  syncCount?: number
  config?: any
  features?: string[]
}

const availableIntegrations: Integration[] = [
  // Accounting
  {
    id: 'accurate-accounting',
    name: 'Accurate Online',
    category: 'accounting',
    status: 'inactive',
    icon: Calculator,
    description: 'Sync financial data, journal entries, and reports with Accurate accounting software'
  },
  {
    id: 'zahir-accounting',
    name: 'Zahir Accounting',
    category: 'accounting',
    status: 'inactive',
    icon: Calculator,
    description: 'Integrate with Zahir accounting system for financial management'
  },
  {
    id: 'jurnal',
    name: 'Jurnal by Mekari',
    category: 'accounting',
    status: 'inactive',
    icon: Calculator,
    description: 'Cloud-based accounting integration with Jurnal'
  },
  
  // E-Commerce Platforms
  {
    id: 'tokopedia',
    name: 'Tokopedia',
    category: 'ecommerce',
    status: 'active',
    icon: ShoppingBag,
    description: 'Official Tokopedia API integration: Product management, order fulfillment, inventory sync, shop info, logistics, webhooks (fs_id & Client Credentials OAuth)',
    lastSync: '2025-12-01T10:00:00Z',
    syncCount: 1245
  },
  {
    id: 'shopee',
    name: 'Shopee',
    category: 'ecommerce',
    status: 'active',
    icon: ShoppingBag,
    description: 'Official Shopee Open Platform API: Product listing, order fulfillment, logistics, promotions, shop management, chat API (Partner ID & Partner Key authentication)',
    lastSync: '2025-12-01T09:45:00Z',
    syncCount: 892
  },
  {
    id: 'lazada',
    name: 'Lazada',
    category: 'ecommerce',
    status: 'inactive',
    icon: ShoppingBag,
    description: 'Connect with Lazada marketplace for Southeast Asia region'
  },
  {
    id: 'tiktok-shop',
    name: 'TikTok Shop',
    category: 'ecommerce',
    status: 'inactive',
    icon: ShoppingBag,
    description: 'Official TikTok Shop Seller API: Product catalog, order management, live shopping, creator partnerships, affiliate programs, video commerce (App Key & App Secret authentication)'
  },
  {
    id: 'blibli',
    name: 'Blibli',
    category: 'ecommerce',
    status: 'inactive',
    icon: ShoppingBag,
    description: 'Integrate with Blibli.com marketplace'
  },
  {
    id: 'bukalapak',
    name: 'Bukalapak',
    category: 'ecommerce',
    status: 'inactive',
    icon: ShoppingBag,
    description: 'Manage products and orders on Bukalapak platform'
  },
  {
    id: 'whatsapp-business',
    name: 'WhatsApp Business',
    category: 'ecommerce',
    status: 'inactive',
    icon: ShoppingBag,
    description: 'WhatsApp Business API for chat commerce and customer service'
  },
  
  // Payment Gateways
  {
    id: 'midtrans',
    name: 'Midtrans',
    category: 'payment',
    status: 'active',
    icon: CreditCard,
    description: 'Payment gateway supporting cards, e-wallets, and bank transfers',
    lastSync: '2025-12-01T09:30:00Z',
    syncCount: 2341
  },
  {
    id: 'xendit',
    name: 'Xendit',
    category: 'payment',
    status: 'inactive',
    icon: CreditCard,
    description: 'Payment processing with Xendit for Indonesia and Southeast Asia'
  },
  {
    id: 'doku',
    name: 'DOKU',
    category: 'payment',
    status: 'inactive',
    icon: CreditCard,
    description: 'DOKU payment gateway for various payment methods'
  },
  {
    id: 'ovo',
    name: 'OVO',
    category: 'payment',
    status: 'inactive',
    icon: CreditCard,
    description: 'Direct integration with OVO e-wallet'
  },
  {
    id: 'gopay',
    name: 'GoPay',
    category: 'payment',
    status: 'inactive',
    icon: CreditCard,
    description: 'GoPay payment integration for seamless transactions'
  },
  
  // Logistics & Shipping
  {
    id: 'jne',
    name: 'JNE Express',
    category: 'logistics',
    status: 'active',
    icon: Truck,
    description: 'Track shipments, print labels, and get rates from JNE',
    lastSync: '2025-12-01T09:15:00Z',
    syncCount: 567
  },
  {
    id: 'sicepat',
    name: 'SiCepat',
    category: 'logistics',
    status: 'inactive',
    icon: Truck,
    description: 'Shipping integration with SiCepat for fast delivery'
  },
  {
    id: 'jnt',
    name: 'J&T Express',
    category: 'logistics',
    status: 'inactive',
    icon: Truck,
    description: 'J&T Express courier service integration'
  },
  {
    id: 'anteraja',
    name: 'AnterAja',
    category: 'logistics',
    status: 'inactive',
    icon: Truck,
    description: 'AnterAja logistics for nationwide delivery'
  },
  {
    id: 'pos-indonesia',
    name: 'Pos Indonesia',
    category: 'logistics',
    status: 'inactive',
    icon: Truck,
    description: 'National postal service integration'
  },
  {
    id: 'ninja-xpress',
    name: 'Ninja Xpress',
    category: 'logistics',
    status: 'inactive',
    icon: Truck,
    description: 'Ninja Xpress courier integration'
  },
  
  // Webhooks & Custom
  {
    id: 'webhook-custom',
    name: 'Custom Webhooks',
    category: 'webhook',
    status: 'active',
    icon: Webhook,
    description: 'Configure custom webhook endpoints for real-time events and notifications',
    syncCount: 5
  }
]

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>(availableIntegrations)
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  // Shopee form state
  const [partnerIdInput, setPartnerIdInput] = useState('')
  const [partnerKeyInput, setPartnerKeyInput] = useState('')
  const [shopIdInput, setShopIdInput] = useState('')
  const [regionInput, setRegionInput] = useState('ID')
  const [webhookUrlInput, setWebhookUrlInput] = useState('')

  const handleToggleIntegration = (id: string, enabled: boolean) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === id 
          ? { ...integration, status: enabled ? 'active' : 'inactive' }
          : integration
      )
    )
    toast.success(enabled ? 'Integration enabled' : 'Integration disabled')
  }

  const handleSync = (id: string) => {
    toast.success('Sync initiated for ' + id)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'accounting': return 'bg-blue-100 text-blue-800'
      case 'ecommerce': return 'bg-purple-100 text-purple-800'
      case 'payment': return 'bg-green-100 text-green-800'
      case 'logistics': return 'bg-orange-100 text-orange-800'
      case 'webhook': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  useEffect(() => {
    // Reset form inputs when opening a new integration config
    if (selectedIntegration?.id === 'shopee') {
      setPartnerIdInput('')
      setPartnerKeyInput('')
      setShopIdInput('')
      setRegionInput('ID')
      setWebhookUrlInput('')
    }
  }, [selectedIntegration])

  useEffect(() => {
    const handler = (ev: MessageEvent) => {
      try {
        const data = ev.data
        if (data?.type === 'shopee_auth') {
          // Persist mock credentials and mark Shopee active
          const creds = { partner_id: data.partner_id, shop_id: data.shop_id, access_token: data.access_token }
          try { localStorage.setItem('shopee_mock_credentials', JSON.stringify(creds)) } catch (e) {}

          setIntegrations(prev => prev.map(i => i.id === 'shopee' ? { ...i, status: 'active' } : i))
          toast.success('Shopee authorized (mock)')
        }
      } catch (e) {
        // ignore
      }
    }

    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  const handleConnect = async () => {
    if (!partnerIdInput || !partnerKeyInput || !shopIdInput) {
      toast.error('Please fill Partner ID, Partner Key and Shop ID before connecting')
      return
    }

    toast.promise(
      (async () => {
        // Ask server to generate signed Shopee auth URL (avoids exposing partner_key in client-side URL)
        const resp = await fetch('/api/integrations/shopee/authorize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ partnerId: partnerIdInput, partnerKey: partnerKeyInput, shopId: shopIdInput, region: regionInput, sandbox })
        })

        const data = await resp.json()
        if (!resp.ok || !data.url) throw new Error(data?.error || 'Failed to generate authorization URL')

        try { window.open(data.url, '_blank', 'width=980,height=820') } catch (e) {}
        setIsDialogOpen(false)
        return true
      })(),
      {
        loading: 'Starting Shopee connect...',
        success: 'Shopee connect initiated',
        error: (e) => String(e)
      }
    )
  }

  const handleSaveConfiguration = () => {
    // Generic save (placeholder)
    toast.success('Configuration saved')
    setIsDialogOpen(false)
  }

  const stats = {
    totalIntegrations: integrations.length,
    activeIntegrations: integrations.filter(i => i.status === 'active').length,
    totalSyncs: integrations.reduce((sum, i) => sum + (i.syncCount || 0), 0),
    healthStatus: 'good'
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-6" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/erp">ERP</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Integrations</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Integrations</h1>
          <p className="text-gray-600">Connect and manage third-party services</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Integrations</CardTitle>
            <Plug className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalIntegrations}</div>
            <p className="text-xs text-gray-600">Available services</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeIntegrations}</div>
            <p className="text-xs text-gray-600">Currently connected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Syncs</CardTitle>
            <RefreshCw className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSyncs.toLocaleString()}</div>
            <p className="text-xs text-gray-600">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Status</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Good</div>
            <p className="text-xs text-gray-600">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      {/* Integrations Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="accounting">Accounting</TabsTrigger>
          <TabsTrigger value="ecommerce">E-Commerce</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="logistics">Logistics</TabsTrigger>
          <TabsTrigger value="webhook">Webhooks</TabsTrigger>
          <TabsTrigger value="testing">Automation Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Integrations</CardTitle>
              <CardDescription>
                Manage all third-party integrations and API connections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Sync</TableHead>
                    <TableHead>Syncs</TableHead>
                    <TableHead>Enabled</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {integrations.map((integration) => {
                    const Icon = integration.icon
                    return (
                      <TableRow key={integration.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Icon className="h-5 w-5 text-gray-600" />
                            <div>
                              <div className="font-medium">{integration.name}</div>
                              <div className="text-xs text-gray-500">{integration.description}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getCategoryColor(integration.category)}>
                            {integration.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(integration.status)}>
                            {integration.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {integration.lastSync
                            ? formatLastSync(integration.lastSync)
                            : 'Never'}
                        </TableCell>
                        <TableCell>{integration.syncCount?.toLocaleString() || 0}</TableCell>
                        <TableCell>
                          <Switch
                            checked={integration.status === 'active'}
                            onCheckedChange={(checked) => handleToggleIntegration(integration.id, checked)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {integration.status === 'active' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSync(integration.id)}
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedIntegration(integration)
                                setIsDialogOpen(true)
                              }}
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {['accounting', 'ecommerce', 'payment', 'logistics', 'webhook'].map((category) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {integrations.filter(i => i.category === category).map((integration) => {
                const Icon = integration.icon
                return (
                  <Card key={integration.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-6 w-6" />
                          <CardTitle className="text-base">{integration.name}</CardTitle>
                        </div>
                        <Badge className={getStatusColor(integration.status)}>
                          {integration.status}
                        </Badge>
                      </div>
                      <CardDescription>{integration.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {integration.lastSync && (
                          <div className="text-sm text-gray-600">
                            Last sync: {formatLastSync(integration.lastSync)}
                          </div>
                        )}
                        {integration.syncCount !== undefined && (
                          <div className="text-sm text-gray-600">
                            Total syncs: {integration.syncCount.toLocaleString()}
                          </div>
                        )}
                        <div className="flex gap-2">
                          {integration.status === 'active' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => handleSync(integration.id)}
                            >
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Sync
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              setSelectedIntegration(integration)
                              setIsDialogOpen(true)
                            }}
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            Configure
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        ))}

        {/* Automation Testing Tab Content */}
        <TabsContent value="testing" className="space-y-4">
          <AutomationTesting />
        </TabsContent>
      </Tabs>

      {/* Configuration Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configure {selectedIntegration?.name}</DialogTitle>
            <DialogDescription>
              Set up connection parameters and sync options for {selectedIntegration?.category} integration
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Tokopedia-specific fields */}
            {selectedIntegration?.id === 'tokopedia' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fsId">FS ID (Fulfillment Service ID)</Label>
                  <Input 
                    id="fsId" 
                    placeholder="Enter your Tokopedia FS ID" 
                  />
                  <p className="text-xs text-gray-500">
                    Your shop's unique Fulfillment Service identifier from Tokopedia Seller Center
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shopId">Shop ID</Label>
                  <Input 
                    id="shopId" 
                    placeholder="Enter your Shop ID" 
                  />
                  <p className="text-xs text-gray-500">
                    Found in Tokopedia Seller Center → Shop Settings
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientId">Client ID</Label>
                  <Input 
                    id="clientId" 
                    placeholder="Enter Client ID from Tokopedia Developer Console" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientSecret">Client Secret</Label>
                  <Input 
                    id="clientSecret" 
                    type="password" 
                    placeholder="Enter Client Secret" 
                  />
                  <p className="text-xs text-gray-500">
                    OAuth 2.0 credentials from developer.tokopedia.com
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>API Features to Enable</Label>
                  <div className="space-y-2 pl-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="syncProducts" defaultChecked />
                      <Label htmlFor="syncProducts" className="font-normal">Product Management (Create, Update, Delete)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="syncOrders" defaultChecked />
                      <Label htmlFor="syncOrders" className="font-normal">Order Management & Fulfillment</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="syncInventory" defaultChecked />
                      <Label htmlFor="syncInventory" className="font-normal">Stock & Inventory Sync</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="syncLogistics" />
                      <Label htmlFor="syncLogistics" className="font-normal">Logistics & Shipping Integration</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="syncShopInfo" />
                      <Label htmlFor="syncShopInfo" className="font-normal">Shop Information & Statistics</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="webhooks" />
                      <Label htmlFor="webhooks" className="font-normal">Real-time Webhooks (Order, Product, Chat)</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Webhook Callback URL</Label>
                  <Input 
                    id="webhookUrl" 
                    placeholder="https://yourdomain.com/api/webhooks/tokopedia" 
                  />
                  <p className="text-xs text-gray-500">
                    Endpoint to receive real-time notifications from Tokopedia
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="syncInterval">Auto-Sync Interval</Label>
                  <select id="syncInterval" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors">
                    <option value="manual">Manual Only</option>
                    <option value="5">Every 5 minutes</option>
                    <option value="15">Every 15 minutes</option>
                    <option value="30">Every 30 minutes</option>
                    <option value="60">Every hour</option>
                  </select>
                </div>
              </>
            )}

            {/* Shopee-specific fields */}
            {selectedIntegration?.id === 'shopee' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="partnerId">Partner ID</Label>
                  <Input 
                    id="partnerId" 
                    placeholder="Enter your Shopee Partner ID" 
                    value={partnerIdInput}
                    onChange={(e) => setPartnerIdInput((e.target as HTMLInputElement).value)}
                  />
                  <p className="text-xs text-gray-500">
                    Your unique Partner ID from Shopee Open Platform
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="partnerKey">Partner Key</Label>
                  <Input 
                    id="partnerKey" 
                    type="password" 
                    placeholder="Enter your Partner Key" 
                    value={partnerKeyInput}
                    onChange={(e) => setPartnerKeyInput((e.target as HTMLInputElement).value)}
                  />
                  <p className="text-xs text-gray-500">
                    Partner Key from Shopee Open Platform for API authentication
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shopId">Shop ID</Label>
                  <Input 
                    id="shopId" 
                    placeholder="Enter your Shop ID" 
                    value={shopIdInput}
                    onChange={(e) => setShopIdInput((e.target as HTMLInputElement).value)}
                  />
                  <p className="text-xs text-gray-500">
                    Found in Shopee Seller Centre → My Account
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region">Region/Country</Label>
                  <select id="region" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors" value={regionInput} onChange={(e) => setRegionInput(e.target.value)}>
                    <option value="ID">Indonesia (shopee.co.id)</option>
                    <option value="SG">Singapore (shopee.sg)</option>
                    <option value="MY">Malaysia (shopee.com.my)</option>
                    <option value="TH">Thailand (shopee.co.th)</option>
                    <option value="TW">Taiwan (shopee.tw)</option>
                    <option value="PH">Philippines (shopee.ph)</option>
                    <option value="VN">Vietnam (shopee.vn)</option>
                  </select>
                  <p className="text-xs text-gray-500">
                    Select your Shopee marketplace region
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>API Features to Enable</Label>
                  <div className="space-y-2 pl-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="syncProducts" defaultChecked />
                      <Label htmlFor="syncProducts" className="font-normal">Product Management (Create, Update, Delete)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="syncOrders" defaultChecked />
                      <Label htmlFor="syncOrders" className="font-normal">Order Management & Shipping</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="syncInventory" defaultChecked />
                      <Label htmlFor="syncInventory" className="font-normal">Stock & Price Sync</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="syncLogistics" />
                      <Label htmlFor="syncLogistics" className="font-normal">Logistics & Tracking</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="syncPromotions" />
                      <Label htmlFor="syncPromotions" className="font-normal">Promotions & Discounts</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="syncReturns" />
                      <Label htmlFor="syncReturns" className="font-normal">Returns & Refunds</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="chatApi" />
                      <Label htmlFor="chatApi" className="font-normal">Chat API (Customer Messages)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="shopPerformance" />
                      <Label htmlFor="shopPerformance" className="font-normal">Shop Performance & Analytics</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Webhook Callback URL</Label>
                  <Input 
                    id="webhookUrl" 
                    placeholder="https://yourdomain.com/api/webhooks/shopee" 
                    value={webhookUrlInput}
                    onChange={(e) => setWebhookUrlInput((e.target as HTMLInputElement).value)}
                  />
                  <p className="text-xs text-gray-500">
                    Endpoint to receive real-time push notifications from Shopee
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="syncInterval">Auto-Sync Interval</Label>
                  <select id="syncInterval" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors">
                    <option value="manual">Manual Only</option>
                    <option value="5">Every 5 minutes</option>
                    <option value="15">Every 15 minutes</option>
                    <option value="30">Every 30 minutes</option>
                    <option value="60">Every hour</option>
                  </select>
                </div>
              </>
            )}

            {/* TikTok Shop-specific fields */}
            {selectedIntegration?.id === 'tiktok-shop' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="appKey">App Key</Label>
                  <Input 
                    id="appKey" 
                    placeholder="Enter your TikTok Shop App Key" 
                  />
                  <p className="text-xs text-gray-500">
                    App Key from TikTok Shop Partner Center
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="appSecret">App Secret</Label>
                  <Input 
                    id="appSecret" 
                    type="password" 
                    placeholder="Enter your App Secret" 
                  />
                  <p className="text-xs text-gray-500">
                    App Secret for API authentication and signature generation
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shopId">Shop ID</Label>
                  <Input 
                    id="shopId" 
                    placeholder="Enter your Shop ID" 
                  />
                  <p className="text-xs text-gray-500">
                    Found in TikTok Shop Seller Center → Shop Settings
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region">Region/Market</Label>
                  <select id="region" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors">
                    <option value="US">United States (us.tiktokshop.com)</option>
                    <option value="UK">United Kingdom (uk.tiktokshop.com)</option>
                    <option value="ID">Indonesia (id.tiktokshop.com)</option>
                    <option value="SG">Singapore (sg.tiktokshop.com)</option>
                    <option value="MY">Malaysia (my.tiktokshop.com)</option>
                    <option value="TH">Thailand (th.tiktokshop.com)</option>
                    <option value="VN">Vietnam (vn.tiktokshop.com)</option>
                    <option value="PH">Philippines (ph.tiktokshop.com)</option>
                  </select>
                  <p className="text-xs text-gray-500">
                    Select your TikTok Shop marketplace region
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>API Features to Enable</Label>
                  <div className="space-y-2 pl-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="syncProducts" defaultChecked />
                      <Label htmlFor="syncProducts" className="font-normal">Product Catalog Management</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="syncOrders" defaultChecked />
                      <Label htmlFor="syncOrders" className="font-normal">Order & Fulfillment</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="syncInventory" defaultChecked />
                      <Label htmlFor="syncInventory" className="font-normal">Inventory & Stock Sync</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="syncLogistics" />
                      <Label htmlFor="syncLogistics" className="font-normal">Logistics & Shipping</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="syncPromotions" />
                      <Label htmlFor="syncPromotions" className="font-normal">Promotions & Campaigns</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="syncReturns" />
                      <Label htmlFor="syncReturns" className="font-normal">Returns & Cancellations</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="liveCommerce" />
                      <Label htmlFor="liveCommerce" className="font-normal">Live Shopping Integration</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="affiliateProgram" />
                      <Label htmlFor="affiliateProgram" className="font-normal">Affiliate & Creator Programs</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="shopAnalytics" />
                      <Label htmlFor="shopAnalytics" className="font-normal">Shop Analytics & Insights</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Webhook Callback URL</Label>
                  <Input 
                    id="webhookUrl" 
                    placeholder="https://yourdomain.com/api/webhooks/tiktok" 
                  />
                  <p className="text-xs text-gray-500">
                    Endpoint to receive real-time event notifications from TikTok Shop
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="syncInterval">Auto-Sync Interval</Label>
                  <select id="syncInterval" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors">
                    <option value="manual">Manual Only</option>
                    <option value="5">Every 5 minutes</option>
                    <option value="15">Every 15 minutes</option>
                    <option value="30">Every 30 minutes</option>
                    <option value="60">Every hour</option>
                  </select>
                </div>
              </>
            )}

            {/* Generic fields for other integrations */}
            {selectedIntegration?.id !== 'tokopedia' && selectedIntegration?.id !== 'shopee' && selectedIntegration?.id !== 'tiktok-shop' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input id="apiKey" type="password" placeholder="Enter API key" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiSecret">API Secret</Label>
                  <Input id="apiSecret" type="password" placeholder="Enter API secret" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Webhook URL (Optional)</Label>
                  <Input id="webhookUrl" placeholder="https://your-domain.com/webhook" />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="autoSync" />
                  <Label htmlFor="autoSync">Enable automatic sync</Label>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={() => selectedIntegration?.id === 'shopee' ? handleConnect() : handleSaveConfiguration()}>
              {selectedIntegration?.id === 'tokopedia' || selectedIntegration?.id === 'shopee' || selectedIntegration?.id === 'tiktok-shop'
                ? 'Connect & Authorize' 
                : 'Save Configuration'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Automation Testing Component
function AutomationTesting() {
  const [selectedModules, setSelectedModules] = useState<string[]>([])
  const [testing, setTesting] = useState(false)
  const [testResults, setTestResults] = useState<any>(null)

  const modules = [
    { id: 'sales', name: 'Sales Management', tests: ['Create Sales Order', 'Create Lead', 'Create Opportunity'] },
    { id: 'products', name: 'Product Management', tests: ['List Products', 'Check Stock Levels'] },
    { id: 'customers', name: 'Customer Management', tests: ['List Customers'] },
    { id: 'accounting', name: 'Accounting', tests: ['Check Chart of Accounts', 'Check Journal Entries'] },
    { id: 'hris', name: 'Human Resources', tests: ['List Employees'] },
    { id: 'pos', name: 'Point of Sale', tests: ['Product Search'] },
  ]

  const toggleModule = (moduleId: string) => {
    setSelectedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    )
  }

  const runTests = async (runAll: boolean = false) => {
    setTesting(true)
    setTestResults(null)

    try {
      const response = await fetch('/api/integrations/testing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modules: runAll ? [] : selectedModules,
          runAll
        })
      })

      const data = await response.json()
      setTestResults(data)

      if (data.success) {
        toast.success(`Tests completed: ${data.summary.passed}/${data.summary.total} passed`)
      } else {
        toast.error('Test execution failed')
      }
    } catch (error) {
      toast.error('Failed to run tests')
      console.error('Test error:', error)
    } finally {
      setTesting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Automation Testing
        </CardTitle>
        <CardDescription>
          Run automated tests for all modules to verify functionality and integrations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Module Selection */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <Label className="text-base font-semibold">Select Modules to Test</Label>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedModules(modules.map(m => m.id))}
              >
                Select All
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedModules([])}
              >
                Clear All
              </Button>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {modules.map(module => (
              <Card
                key={module.id}
                className={`cursor-pointer transition-all ${
                  selectedModules.includes(module.id)
                    ? 'border-primary bg-primary/5'
                    : 'hover:border-gray-400'
                }`}
                onClick={() => toggleModule(module.id)}
              >
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{module.name}</CardTitle>
                    <Switch
                      checked={selectedModules.includes(module.id)}
                      onCheckedChange={() => toggleModule(module.id)}
                    />
                  </div>
                  <CardDescription className="text-xs">
                    {module.tests.length} tests available
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    {module.tests.map(test => (
                      <li key={test}>• {test}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => runTests(false)}
            disabled={testing || selectedModules.length === 0}
            className="flex-1"
          >
            {testing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <Activity className="mr-2 h-4 w-4" />
                Run Selected Tests ({selectedModules.length})
              </>
            )}
          </Button>
          <Button
            onClick={() => runTests(true)}
            disabled={testing}
            variant="outline"
          >
            {testing ? 'Running...' : 'Run All Tests'}
          </Button>
        </div>

        {/* Test Results */}
        {testResults && testResults.success && (
          <div className="space-y-4">
            <Separator />
            
            {/* Summary */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="p-4">
                  <CardDescription>Total Tests</CardDescription>
                  <CardTitle className="text-2xl">{testResults.summary.total}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="p-4">
                  <CardDescription>Passed</CardDescription>
                  <CardTitle className="text-2xl text-green-600">
                    {testResults.summary.passed}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="p-4">
                  <CardDescription>Failed</CardDescription>
                  <CardTitle className="text-2xl text-red-600">
                    {testResults.summary.failed}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="p-4">
                  <CardDescription>Duration</CardDescription>
                  <CardTitle className="text-2xl">
                    {testResults.summary.duration}ms
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Detailed Results */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Test Results</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Module</TableHead>
                      <TableHead>Feature</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Duration</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testResults.results.map((result: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium capitalize">
                          {result.module}
                        </TableCell>
                        <TableCell>{result.feature}</TableCell>
                        <TableCell>
                          {result.status === 'passed' ? (
                            <Badge className="bg-green-100 text-green-700">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Passed
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-700">
                              <XCircle className="mr-1 h-3 w-3" />
                              Failed
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {result.message}
                        </TableCell>
                        <TableCell className="text-sm">{result.duration}ms</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
