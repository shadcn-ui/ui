'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/registry/new-york-v4/ui/card'
import { Button } from '@/registry/new-york-v4/ui/button'
import { SidebarTrigger } from '@/registry/new-york-v4/ui/sidebar'
import { Separator } from '@/registry/new-york-v4/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/registry/new-york-v4/ui/tabs'
import { Badge } from '@/registry/new-york-v4/ui/badge'
import { OperationsNav } from '@/components/operations-nav'
import { FileBarChart, CheckCircle, XCircle, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react'

interface QualityInspection {
  id: number
  inspection_number: string
  product_name: string
  batch_number: string
  inspection_date: string
  inspector: string
  status: string
  pass_rate: number
  defects_found: number
}

export default function QualityReportsPage() {
  const [inspections, setInspections] = useState<QualityInspection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data
    setInspections([
      {
        id: 1,
        inspection_number: "QI-2025-134",
        product_name: "Brightening Face Serum with Vitamin C & Niacinamide 30ml",
        batch_number: "BATCH-20251210-VCS",
        inspection_date: "2025-12-12",
        inspector: "Dr. Siti Rahmawati",
        status: "passed",
        pass_rate: 98.8,
        defects_found: 12
      },
      {
        id: 2,
        inspection_number: "QI-2025-135",
        product_name: "Hydrating Day Cream with SPF 50 PA++++ 50ml",
        batch_number: "BATCH-20251211-HDC",
        inspection_date: "2025-12-13",
        inspector: "Dr. Budi Santoso",
        status: "passed",
        pass_rate: 99.4,
        defects_found: 6
      },
      {
        id: 3,
        inspection_number: "QI-2025-136",
        product_name: "Gentle Foaming Cleanser with Green Tea Extract 100ml",
        batch_number: "BATCH-20251211-GFC",
        inspection_date: "2025-12-13",
        inspector: "Dr. Siti Rahmawati",
        status: "passed",
        pass_rate: 97.2,
        defects_found: 28
      },
      {
        id: 4,
        inspection_number: "QI-2025-137",
        product_name: "Anti-Aging Night Cream with Retinol 0.5% 40ml",
        batch_number: "BATCH-20251212-ANC",
        inspection_date: "2025-12-14",
        inspector: "Dr. Budi Santoso",
        status: "passed",
        pass_rate: 99.1,
        defects_found: 9
      },
      {
        id: 5,
        inspection_number: "QI-2025-138",
        product_name: "Acne Treatment Spot Gel with Salicylic Acid 15ml",
        batch_number: "BATCH-20251209-ATG",
        inspection_date: "2025-12-11",
        inspector: "Dr. Siti Rahmawati",
        status: "failed",
        pass_rate: 89.3,
        defects_found: 107
      }
    ])
    setLoading(false)
  }, [])

  const getStatusBadge = (status: string) => {
    const config: { [key: string]: { variant: any; icon: any } } = {
      passed: { variant: "default" as any, icon: CheckCircle },
      failed: { variant: "destructive" as any, icon: XCircle },
      pending: { variant: "secondary" as any, icon: AlertTriangle }
    }
    const { variant, icon: Icon } = config[status] || config.pending
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quality reports...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Quality Reports</h1>
      </header>

      <OperationsNav />

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <FileBarChart className="h-8 w-8 text-primary" />
              Quality Reports
            </h2>
            <p className="text-muted-foreground mt-1">
              Track quality metrics, inspections, and compliance
            </p>
          </div>
          <Button>
            <FileBarChart className="h-4 w-4 mr-2" />
            New Inspection
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Pass Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">95.1%</div>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +1.2% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Inspections</CardTitle>
              <FileBarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed Batches</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-red-600">Requires investigation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Defects</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">9.7</div>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingDown className="h-3 w-3" />
                -15% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="inspections" className="space-y-4">
          <TabsList>
            <TabsTrigger value="inspections">Inspections</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="inspections">
            <Card>
              <CardHeader>
                <CardTitle>Recent Quality Inspections</CardTitle>
                <CardDescription>Inspection results and defect tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inspections.map((inspection) => (
                    <div key={inspection.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-lg">{inspection.inspection_number}</h4>
                          <p className="text-sm text-gray-600">{inspection.product_name}</p>
                        </div>
                        {getStatusBadge(inspection.status)}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-600">Batch Number</p>
                          <p className="font-semibold">{inspection.batch_number}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Inspection Date</p>
                          <p className="font-semibold">
                            {new Date(inspection.inspection_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Inspector</p>
                          <p className="font-semibold">{inspection.inspector}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Defects Found</p>
                          <p className="font-semibold">{inspection.defects_found}</p>
                        </div>
                      </div>

                      <div className="mb-2">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Pass Rate</span>
                          <span className={`text-sm ${inspection.pass_rate >= 95 ? 'text-green-600' : 'text-red-600'}`}>
                            {inspection.pass_rate}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${inspection.pass_rate >= 95 ? 'bg-green-600' : 'bg-red-600'}`}
                            style={{ width: `${inspection.pass_rate}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <CardTitle>Quality Trends Analysis</CardTitle>
                <CardDescription>Track quality metrics over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-4">Monthly Pass Rate Trend</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>December 2025</span>
                          <span className="font-semibold">95.1%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: "95.1%" }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>November 2025</span>
                          <span className="font-semibold">93.9%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: "93.9%" }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>October 2025</span>
                          <span className="font-semibold">96.5%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: "96.5%" }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4">Top Defect Categories</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between p-3 border rounded">
                        <span className="text-sm">Packaging Issues</span>
                        <span className="font-semibold">45%</span>
                      </div>
                      <div className="flex justify-between p-3 border rounded">
                        <span className="text-sm">Label Misalignment</span>
                        <span className="font-semibold">30%</span>
                      </div>
                      <div className="flex justify-between p-3 border rounded">
                        <span className="text-sm">Product Consistency</span>
                        <span className="font-semibold">15%</span>
                      </div>
                      <div className="flex justify-between p-3 border rounded">
                        <span className="text-sm">Other</span>
                        <span className="font-semibold">10%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance">
            <Card>
              <CardHeader>
                <CardTitle>Compliance & Certifications</CardTitle>
                <CardDescription>Regulatory compliance status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-semibold">ISO 9001:2015</p>
                        <p className="text-sm text-gray-600">Quality Management System</p>
                      </div>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-semibold">GMP Certification</p>
                        <p className="text-sm text-gray-600">Good Manufacturing Practice</p>
                      </div>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="font-semibold">BPOM Registration</p>
                        <p className="text-sm text-gray-600">Expires in 45 days</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Renewal Required</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
