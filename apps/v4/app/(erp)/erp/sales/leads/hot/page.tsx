import { Metadata } from "next"
import Link from "next/link"
import {
  SidebarTrigger,
} from "@/registry/new-york-v4/ui/sidebar"
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/new-york-v4/ui/table"
import { 
  ArrowLeft, 
  AlertCircle, 
  Phone, 
  Mail, 
  Calendar,
  Clock,
  TrendingUp,
  Users,
  Filter
} from "lucide-react"

export const metadata: Metadata = {
  title: "Hot Leads - Ocean ERP",
  description: "High-priority leads requiring immediate attention",
}

interface HotLead {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  company: string
  job_title: string
  estimated_value: number
  source_name: string
  status_name: string
  status_color: string
  assigned_name: string
  created_at: string
  last_activity: string
  hot_score: number
  priority_reason: string
}

async function getHotLeads(): Promise<HotLead[]> {
  try {
    const res = await fetch('http://localhost:4000/api/leads/hot', {
      cache: 'no-store'
    })
    
    if (!res.ok) {
      throw new Error('Failed to fetch hot leads')
    }
    
    return await res.json()
  } catch (error) {
    console.error('Error fetching hot leads:', error)
    return []
  }
}

export default async function HotLeadsPage() {
  const hotLeads = await getHotLeads()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getTimeSince = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return `${Math.ceil(diffDays / 30)} months ago`
  }

  const getPriorityColor = (score: number) => {
    if (score >= 80) return 'bg-red-500'
    if (score >= 60) return 'bg-orange-500'
    return 'bg-yellow-500'
  }

  const totalValue = hotLeads.reduce((sum, lead) => sum + (lead.estimated_value || 0), 0)

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/erp">ERP</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/erp/sales">Sales</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/erp/sales/leads">Leads</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Hot Leads</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-4 p-4 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <AlertCircle className="h-8 w-8 text-red-500" />
              Hot Leads
            </h2>
            <p className="text-muted-foreground">
              High-priority leads requiring immediate attention
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button asChild variant="outline">
              <Link href="/erp/sales/leads">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Leads
              </Link>
            </Button>
          </div>
        </div>

        {/* Hot Leads Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hot Leads</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{hotLeads.length}</div>
              <p className="text-xs text-muted-foreground">
                Requiring immediate action
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
              <p className="text-xs text-muted-foreground">
                Potential revenue at risk
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Deal Size</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {hotLeads.length > 0 ? formatCurrency(totalValue / hotLeads.length) : 'Rp0'}
              </div>
              <p className="text-xs text-muted-foreground">
                Per hot lead
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Leads</CardTitle>
              <Clock className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {hotLeads.filter(lead => lead.hot_score >= 80).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Score 80+ (urgent)
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Hot Leads List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Hot Leads Overview
                </CardTitle>
                <CardDescription>
                  Leads requiring immediate attention based on value, activity, and urgency
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {hotLeads.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Hot Leads Found</h3>
                <p className="text-muted-foreground mb-4">
                  Great job! There are no leads requiring immediate attention at the moment.
                </p>
                <Button asChild>
                  <Link href="/erp/sales/leads/all">
                    View All Leads
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Priority</TableHead>
                      <TableHead>Lead</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hotLeads.map((lead) => (
                      <TableRow key={lead.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${getPriorityColor(lead.hot_score)}`} />
                            <span className="font-medium">{lead.hot_score}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {lead.first_name} {lead.last_name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {lead.job_title}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{lead.company}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {lead.estimated_value ? formatCurrency(lead.estimated_value) : 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="secondary"
                            style={{ backgroundColor: lead.status_color + '20', color: lead.status_color }}
                          >
                            {lead.status_name}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{lead.assigned_name || 'Unassigned'}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {lead.last_activity ? getTimeSince(lead.last_activity) : getTimeSince(lead.created_at)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-muted-foreground max-w-32 truncate">
                            {lead.priority_reason}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button asChild size="sm" variant="outline">
                              <Link href={`/erp/sales/leads/${lead.id}`}>
                                View
                              </Link>
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Mail className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}