"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
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
  Edit, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Calendar,
  User,
  DollarSign,
  ArrowLeft,
  RefreshCw
} from "lucide-react"

interface Lead {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  company: string
  job_title?: string
  website?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  country?: string
  source_name?: string
  status_name?: string
  status_color?: string
  assigned_name?: string
  estimated_value?: number
  notes?: string
  created_at: string
  updated_at?: string
}

const getStatusColor = (color?: string) => {
  if (!color) return "bg-gray-100 text-gray-800"
  
  switch (color) {
    case "#3B82F6": return "bg-blue-100 text-blue-800"
    case "#8B5CF6": return "bg-purple-100 text-purple-800"
    case "#06B6D4": return "bg-cyan-100 text-cyan-800"
    case "#10B981": return "bg-green-100 text-green-800"
    case "#22C55E": return "bg-emerald-100 text-emerald-800"
    case "#EF4444": return "bg-red-100 text-red-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

export default function LeadDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const [lead, setLead] = useState<Lead | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [leadId, setLeadId] = useState<string | null>(null)
  const router = useRouter()

  // Resolve params first
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params
      setLeadId(resolvedParams.id)
    }
    resolveParams()
  }, [params])

  const fetchLead = useCallback(async () => {
    if (!leadId) return
    
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/leads/${leadId}`)
      const result = await response.json()
      
      if (response.ok && result.success) {
        setLead(result.lead)
      } else {
        setError(result.error || 'Failed to fetch lead details')
      }
    } catch (error) {
      console.error('Error fetching lead:', error)
      setError('Failed to fetch lead details')
    } finally {
      setIsLoading(false)
    }
  }, [leadId])

  useEffect(() => {
    fetchLead()
  }, [fetchLead])

  const formatCurrency = (value?: number) => {
    if (!value) return "Rp0"
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatAddress = (lead: Lead) => {
    const parts = [lead.address, lead.city, lead.state, lead.zip_code].filter(Boolean)
    return parts.length > 0 ? parts.join(', ') : null
  }

  if (isLoading) {
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
                <BreadcrumbPage>Lead Details</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex-1 space-y-4 p-4 pt-6">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </>
    )
  }

  if (error || !lead) {
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
                <BreadcrumbPage>Lead Details</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex-1 space-y-4 p-4 pt-6">
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center">
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  {error || 'Lead not found'}
                </h3>
                <Button onClick={() => router.push('/erp/sales/leads')} variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Leads
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    )
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
              <BreadcrumbLink href="/erp/sales/leads">Leads</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{lead.first_name} {lead.last_name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-4 p-4 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {lead.first_name} {lead.last_name}
            </h2>
            <p className="text-muted-foreground">
              {lead.job_title && `${lead.job_title} at `}{lead.company}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={() => router.push('/erp/sales/leads')} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Leads
            </Button>
            <Button asChild>
              <Link href={`/erp/sales/leads/${leadId}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Lead
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline">
                  {lead.email}
                </a>
              </div>
              {lead.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${lead.phone}`} className="text-blue-600 hover:underline">
                    {lead.phone}
                  </a>
                </div>
              )}
              {lead.website && (
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {lead.website}
                  </a>
                </div>
              )}
              {formatAddress(lead) && (
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="text-sm">{formatAddress(lead)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lead Status & Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5" />
                Lead Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status:</span>
                <Badge className={getStatusColor(lead.status_color)}>
                  {lead.status_name}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Source:</span>
                <span className="text-sm">{lead.source_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Assigned to:</span>
                <span className="text-sm">{lead.assigned_name || "Unassigned"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Estimated Value:</span>
                <span className="text-sm font-bold">{formatCurrency(lead.estimated_value)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Created:</span>
                <span className="text-sm">{formatDate(lead.created_at)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notes */}
        {lead.notes && (
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{lead.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common actions for this lead
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2">
              <Button variant="outline" className="justify-start" asChild>
                <a href={`mailto:${lead.email}`}>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </a>
              </Button>
              {lead.phone && (
                <Button variant="outline" className="justify-start" asChild>
                  <a href={`tel:${lead.phone}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    Call Lead
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}