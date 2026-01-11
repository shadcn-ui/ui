"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/registry/new-york-v4/ui/card"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Label } from "@/registry/new-york-v4/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/new-york-v4/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/new-york-v4/ui/dialog"
import { Checkbox } from "@/registry/new-york-v4/ui/checkbox"
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
  FileText,
  Download,
  Calendar,
  Filter,
  Plus,
  Eye,
  BarChart3,
  TrendingUp,
  Package,
  CheckCircle,
  FileSpreadsheet,
  Mail
} from "lucide-react"

interface ReportTemplate {
  id: string
  name: string
  description: string
  category: 'production' | 'quality' | 'financial' | 'inventory' | 'compliance'
  format: 'pdf' | 'excel' | 'csv'
  icon: any
}

const reportTemplates: ReportTemplate[] = [
  {
    id: 'production-efficiency',
    name: 'Production Efficiency Report',
    description: 'Detailed analysis of production performance, cycle times, and efficiency metrics',
    category: 'production',
    format: 'pdf',
    icon: TrendingUp
  },
  {
    id: 'quality-compliance',
    name: 'Quality & Compliance Report',
    description: 'BPOM and Halal compliance status, test results, and quality metrics',
    category: 'compliance',
    format: 'pdf',
    icon: CheckCircle
  },
  {
    id: 'cost-analysis',
    name: 'Cost Analysis Report',
    description: 'Production costs, material costs, labor costs, and cost breakdowns',
    category: 'financial',
    format: 'excel',
    icon: BarChart3
  },
  {
    id: 'supplier-performance',
    name: 'Supplier Performance Report',
    description: 'Supplier ratings, delivery times, quality scores, and performance trends',
    category: 'production',
    format: 'excel',
    icon: Package
  },
  {
    id: 'inventory-turnover',
    name: 'Inventory Turnover Report',
    description: 'Stock levels, turnover rates, slow-moving items, and reorder recommendations',
    category: 'inventory',
    format: 'excel',
    icon: Package
  },
  {
    id: 'monthly-summary',
    name: 'Monthly Executive Summary',
    description: 'Comprehensive monthly overview of all operations and KPIs',
    category: 'financial',
    format: 'pdf',
    icon: FileText
  }
]

export default function AdvancedReportingPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [reportConfig, setReportConfig] = useState<{
    dateFrom: string
    dateTo: string
    format: 'pdf' | 'excel' | 'csv'
    includeCharts: boolean
    includeRawData: boolean
    emailRecipients: string
    schedule: 'none' | 'daily' | 'weekly' | 'monthly'
  }>({
    dateFrom: '',
    dateTo: '',
    format: 'pdf',
    includeCharts: true,
    includeRawData: false,
    emailRecipients: '',
    schedule: 'none'
  })

  const handleGenerateReport = async () => {
    if (!selectedTemplate) return

    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          config: reportConfig
        })
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${selectedTemplate.id}-${new Date().toISOString().slice(0, 10)}.${reportConfig.format}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
        
        setIsDialogOpen(false)
        alert('Report generated successfully!')
      }
    } catch (error) {
      console.error('Error generating report:', error)
      alert('Error generating report')
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'production': return 'bg-blue-500'
      case 'quality': return 'bg-green-500'
      case 'financial': return 'bg-purple-500'
      case 'inventory': return 'bg-yellow-500'
      case 'compliance': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Advanced Reporting</h2>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Templates</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportTemplates.length}</div>
            <p className="text-xs text-muted-foreground">Report templates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Generated This Month</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">Reports generated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Reports</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Auto-generated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email Recipients</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Active recipients</p>
          </CardContent>
        </Card>
      </div>

      {/* Report Templates */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Templates</TabsTrigger>
          <TabsTrigger value="production">Production</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reportTemplates.map((template) => {
              const Icon = template.icon
              return (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-gray-600" />
                        <CardTitle className="text-base">{template.name}</CardTitle>
                      </div>
                      <Badge className={getCategoryColor(template.category)}>
                        {template.category}
                      </Badge>
                    </div>
                    <CardDescription className="mt-2">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FileSpreadsheet className="h-4 w-4" />
                        {template.format.toUpperCase()}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedTemplate(template)
                          setReportConfig({
                            ...reportConfig,
                            format: template.format,
                            dateFrom: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10),
                            dateTo: new Date().toISOString().slice(0, 10)
                          })
                          setIsDialogOpen(true)
                        }}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Generate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="production">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reportTemplates.filter(t => t.category === 'production').map((template) => {
              const Icon = template.icon
              return (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      <CardTitle className="text-base">{template.name}</CardTitle>
                    </div>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setSelectedTemplate(template)
                        setIsDialogOpen(true)
                      }}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="financial">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reportTemplates.filter(t => t.category === 'financial').map((template) => {
              const Icon = template.icon
              return (
                <Card key={template.id}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      <CardTitle className="text-base">{template.name}</CardTitle>
                    </div>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setSelectedTemplate(template)
                        setIsDialogOpen(true)
                      }}
                    >
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="compliance">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reportTemplates.filter(t => t.category === 'compliance').map((template) => {
              const Icon = template.icon
              return (
                <Card key={template.id}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      <CardTitle className="text-base">{template.name}</CardTitle>
                    </div>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setSelectedTemplate(template)
                        setIsDialogOpen(true)
                      }}
                    >
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Report Configuration Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Generate Report: {selectedTemplate?.name}</DialogTitle>
            <DialogDescription>
              Configure report parameters and output options
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateFrom">From Date</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={reportConfig.dateFrom}
                  onChange={(e) => setReportConfig({...reportConfig, dateFrom: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateTo">To Date</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={reportConfig.dateTo}
                  onChange={(e) => setReportConfig({...reportConfig, dateTo: e.target.value})}
                />
              </div>
            </div>

            {/* Format */}
            <div className="space-y-2">
              <Label>Output Format</Label>
              <Select value={reportConfig.format} onValueChange={(value: any) => setReportConfig({...reportConfig, format: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                  <SelectItem value="csv">CSV Data</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <Label>Report Options</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeCharts"
                  checked={reportConfig.includeCharts}
                  onCheckedChange={(checked) => setReportConfig({...reportConfig, includeCharts: checked as boolean})}
                />
                <Label htmlFor="includeCharts" className="text-sm font-normal cursor-pointer">
                  Include charts and visualizations
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeRawData"
                  checked={reportConfig.includeRawData}
                  onCheckedChange={(checked) => setReportConfig({...reportConfig, includeRawData: checked as boolean})}
                />
                <Label htmlFor="includeRawData" className="text-sm font-normal cursor-pointer">
                  Include raw data tables
                </Label>
              </div>
            </div>

            {/* Email Recipients */}
            <div className="space-y-2">
              <Label htmlFor="emailRecipients">Email Recipients (Optional)</Label>
              <Input
                id="emailRecipients"
                type="text"
                placeholder="email1@example.com, email2@example.com"
                value={reportConfig.emailRecipients}
                onChange={(e) => setReportConfig({...reportConfig, emailRecipients: e.target.value})}
              />
              <p className="text-xs text-gray-500">Comma-separated email addresses</p>
            </div>

            {/* Scheduling */}
            <div className="space-y-2">
              <Label>Schedule Report</Label>
              <Select value={reportConfig.schedule} onValueChange={(value: any) => setReportConfig({...reportConfig, schedule: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">One-time only</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerateReport}>
              <Download className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
