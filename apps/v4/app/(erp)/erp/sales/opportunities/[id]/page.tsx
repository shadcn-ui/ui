import { Pool } from 'pg'
import Link from 'next/link'
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
import { Label } from "@/registry/new-york-v4/ui/label"
import { 
  ArrowLeft,
  Edit,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  DollarSign,
  Target,
  Calendar,
  Users,
  TrendingUp,
  Clock
} from "lucide-react"

const pool = new Pool({
  user: process.env.DB_USER || 'mac',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'ocean-erp',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '5432'),
})

export default async function OpportunityDetailsPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  if (isNaN(id)) {
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
                <BreadcrumbLink href="/erp/sales/opportunities">Opportunities</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Invalid ID</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex-1 space-y-4 p-4 pt-6">
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center">
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  Invalid opportunity ID
                </h3>
                <Button asChild variant="outline">
                  <Link href="/erp/sales/opportunities">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Opportunities
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  try {
    const client = await pool.connect()
    try {
      const result = await client.query('SELECT * FROM opportunities WHERE id = $1', [id])
      if (result.rowCount === 0) {
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
                    <BreadcrumbLink href="/erp/sales/opportunities">Opportunities</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Not Found</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </header>
            <div className="flex-1 space-y-4 p-4 pt-6">
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">
                      Opportunity not found
                    </h3>
                    <Button asChild variant="outline">
                      <Link href="/erp/sales/opportunities">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Opportunities
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )
      }
      
      const opp = result.rows[0]
      
      const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(amount)
      }

      const formatDate = (dateString?: string) => {
        if (!dateString) return "Not set"
        return new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      }

      const getStageColor = (stage: string) => {
        const colors: Record<string, string> = {
          "Discovery": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
          "Qualification": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300", 
          "Proposal": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
          "Negotiation": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
          "Closed Won": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
          "Closed Lost": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
        }
        return colors[stage] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      }

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
                  <BreadcrumbLink href="/erp/sales/opportunities">Opportunities</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{opp.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          <div className="flex-1 space-y-6 p-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">{opp.title}</h2>
                <p className="text-muted-foreground">
                  {opp.company} • Created {formatDate(opp.created_at)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button asChild variant="outline">
                  <Link href="/erp/sales/opportunities">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Opportunities
                  </Link>
                </Button>
                <Button asChild>
                  <Link href={`/erp/sales/opportunities/${id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Opportunity
                  </Link>
                </Button>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Stage</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <Badge 
                    variant="secondary" 
                    className={getStageColor(opp.stage)}
                  >
                    {opp.stage}
                  </Badge>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Value</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(Number(opp.value) || 0)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Probability</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${opp.probability || 0}%` }}
                      ></div>
                    </div>
                    <span className="text-xl font-bold">{opp.probability || 0}%</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Expected Close</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-medium">{formatDate(opp.expected_close_date)}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                  <CardDescription>
                    Primary contact details for this opportunity
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{opp.company}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{opp.contact}</span>
                    </div>
                  </div>
                  {opp.email && (
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                        <a href={`mailto:${opp.email}`} className="text-blue-600 hover:text-blue-800">
                          {opp.email}
                        </a>
                      </div>
                    </div>
                  )}
                  {opp.phone && (
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                        <a href={`tel:${opp.phone}`} className="text-blue-600 hover:text-blue-800">
                          {opp.phone}
                        </a>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Assignment & Source */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Assignment & Source
                  </CardTitle>
                  <CardDescription>
                    Ownership and origin information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Assigned To</Label>
                    <div className="text-sm">
                      {opp.assigned_to || "Unassigned"}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Source</Label>
                    <div className="text-sm">
                      {opp.source || "Not specified"}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Last Updated</Label>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(opp.updated_at)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Description and Notes */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                  <CardDescription>
                    Detailed description of the opportunity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-wrap text-sm">
                    {opp.description || "No description provided."}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Internal Notes</CardTitle>
                  <CardDescription>
                    Private notes and follow-up reminders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-wrap text-sm">
                    {opp.notes || "No notes available."}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Details page error', error)
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
                <BreadcrumbLink href="/erp/sales/opportunities">Opportunities</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Error</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex-1 space-y-4 p-4 pt-6">
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center">
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  Failed to load opportunity
                </h3>
                <Button asChild variant="outline">
                  <Link href="/erp/sales/opportunities">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Opportunities
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }
}
