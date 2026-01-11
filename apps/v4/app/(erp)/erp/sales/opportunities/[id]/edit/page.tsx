"use client"

import { useState, useEffect } from "react"
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
import { Input } from "@/registry/new-york-v4/ui/input"
import { Label } from "@/registry/new-york-v4/ui/label"
import { Textarea } from "@/registry/new-york-v4/ui/textarea"
import { Alert, AlertDescription } from "@/registry/new-york-v4/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import { 
  Save, 
  ArrowLeft,
  RefreshCw,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  DollarSign,
  Target,
  Calendar,
  Users
} from "lucide-react"
import { toast } from "sonner"

interface FormData {
  title: string
  company: string
  contact: string
  email: string
  phone: string
  stage: string
  value: string
  probability: string
  expected_close_date: string
  assigned_to: string
  source: string
  description: string
  notes: string
}

interface LookupData {
  users: Array<{
    id: string
    full_name: string
    email: string
    role: string
  }>
}

interface Opportunity {
  id: number
  title: string
  company: string
  contact: string
  email?: string
  phone?: string
  stage: string
  value: number
  probability: number
  expected_close_date?: string
  assigned_to?: string
  source?: string
  description?: string
  notes?: string
}

export default function EditOpportunityPage({ params }: { params: Promise<{ id: string }> }) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    company: '',
    contact: '',
    email: '',
    phone: '',
    stage: 'Discovery',
    value: '',
    probability: '',
    expected_close_date: '',
    assigned_to: '',
    source: '',
    description: '',
    notes: ''
  })
  const [lookupData, setLookupData] = useState<LookupData>({ users: [] })
  const [isLoadingLookup, setIsLoadingLookup] = useState(true)
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [opportunityId, setOpportunityId] = useState<string | null>(null)
  
  const router = useRouter()

  // Resolve params first
  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolvedParams = await params
        setOpportunityId(resolvedParams.id)
      } catch (error) {
        console.error('Error resolving params:', error)
        setError('Failed to load opportunity ID')
      }
    }
    resolveParams()
  }, [params])

  // Fetch opportunity data and lookup data
  useEffect(() => {
    if (!opportunityId) return
    
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // Fetch both opportunity data and lookup data in parallel
        const [oppResponse, lookupResponse] = await Promise.all([
          fetch(`/api/opportunities/${opportunityId}`),
          fetch('/api/opportunities/lookup')
        ])

        if (!oppResponse.ok) {
          throw new Error(`Failed to fetch opportunity: ${oppResponse.status} ${oppResponse.statusText}`)
        }

        const oppResult = await oppResponse.json()
        const lookupResult = await lookupResponse.json()

        if (oppResult.opportunity) {
          const opp = oppResult.opportunity
          setFormData({
            title: opp.title || '',
            company: opp.company || '',
            contact: opp.contact || '',
            email: opp.email || '',
            phone: opp.phone || '',
            stage: opp.stage || 'Discovery',
            value: opp.value?.toString() || '',
            probability: opp.probability?.toString() || '',
            expected_close_date: opp.expected_close_date || '',
            assigned_to: opp.assigned_to || 'unassigned',
            source: opp.source || '',
            description: opp.description || '',
            notes: opp.notes || ''
          })
        } else {
          throw new Error('Opportunity not found')
        }

        if (lookupResult.success) {
          setLookupData(lookupResult.data)
        } else {
          console.error('Failed to fetch lookup data:', lookupResult.error)
        }
        
      } catch (error) {
        console.error('Error fetching data:', error)
        setError(error instanceof Error ? error.message : 'Failed to load data')
      } finally {
        setIsLoading(false)
        setIsLoadingLookup(false)
      }
    }

    fetchData()
  }, [opportunityId])

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)
    setSuccessMessage(null)

    try {
      // Clean and parse numeric values - handle both comma and period as decimal separator
      const cleanValue = formData.value.replace(/,/g, '.')
      const cleanProbability = formData.probability.replace(/,/g, '.')
      
      const submitData = {
        title: formData.title,
        company: formData.company,
        contact: formData.contact,
        email: formData.email || null,
        phone: formData.phone || null,
        stage: formData.stage,
        value: parseFloat(cleanValue) || 0,
        probability: parseInt(cleanProbability) || 0,
        expected_close_date: formData.expected_close_date || null,
        assigned_to: formData.assigned_to,
        source: formData.source || null,
        description: formData.description || null,
        notes: formData.notes || null,
      }

      console.log('Submitting opportunity data:', submitData)
      
      const response = await fetch(`/api/opportunities/${opportunityId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      const result = await response.json()

      console.log('API Response:', { status: response.status, result })

      if (response.ok) {
        setSuccessMessage("Opportunity updated successfully!")
        toast.success("Opportunity updated successfully!")
        // Redirect after showing success message
        setTimeout(() => {
          router.push(`/erp/sales/opportunities/${opportunityId}`)
        }, 1500)
      } else {
        const errorMsg = result.error || 'Failed to update opportunity'
        setSubmitError(errorMsg)
        toast.error(errorMsg)
        console.error('Update failed:', errorMsg, result.details)
      }
    } catch (error) {
      console.error('Error updating opportunity:', error)
      const errorMsg = error instanceof Error ? error.message : "Failed to update opportunity"
      setSubmitError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
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
                <BreadcrumbLink href="/erp/sales/opportunities">Opportunities</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Edit Opportunity</BreadcrumbPage>
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

  if (error) {
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
                <BreadcrumbPage>Edit Opportunity</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex-1 space-y-4 p-4 pt-6">
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center">
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  {error}
                </h3>
                <Button onClick={() => router.push('/erp/sales/opportunities')} variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Opportunities
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
              <BreadcrumbLink href="/erp/sales/opportunities">Opportunities</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit Opportunity</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Edit Opportunity</h2>
            <p className="text-muted-foreground">
              Update opportunity details and track progress
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => router.push('/erp/sales/opportunities')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Opportunities
            </Button>
          </div>
        </div>

        {/* Error and Success Messages */}
        {submitError && (
          <Alert variant="destructive">
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Essential opportunity details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Opportunity Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Person *</Label>
                  <Input
                    id="contact"
                    value={formData.contact}
                    onChange={(e) => handleInputChange("contact", e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Opportunity Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Opportunity Management
                </CardTitle>
                <CardDescription>
                  Stage, value, and tracking details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="stage">Stage *</Label>
                  <Select value={formData.stage} onValueChange={(value) => handleInputChange("stage", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Discovery">Discovery</SelectItem>
                      <SelectItem value="Qualification">Qualification</SelectItem>
                      <SelectItem value="Proposal">Proposal</SelectItem>
                      <SelectItem value="Negotiation">Negotiation</SelectItem>
                      <SelectItem value="Closed Won">Closed Won</SelectItem>
                      <SelectItem value="Closed Lost">Closed Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="value">Value ($)</Label>
                    <Input
                      id="value"
                      type="number"
                      value={formData.value}
                      onChange={(e) => handleInputChange("value", e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="probability">Probability (%)</Label>
                    <Input
                      id="probability"
                      type="number"
                      value={formData.probability}
                      onChange={(e) => handleInputChange("probability", e.target.value)}
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expected_close_date">Expected Close Date</Label>
                  <Input
                    id="expected_close_date"
                    type="date"
                    value={formData.expected_close_date}
                    onChange={(e) => handleInputChange("expected_close_date", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assigned_to">Assigned To</Label>
                  <Select value={formData.assigned_to} onValueChange={(value) => handleInputChange("assigned_to", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select assigned user" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {isLoadingLookup ? (
                        <SelectItem value="loading" disabled>Loading...</SelectItem>
                      ) : (
                        lookupData.users.map((user) => (
                          <SelectItem key={user.id} value={user.full_name}>
                            {user.full_name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <Input
                    id="source"
                    value={formData.source}
                    onChange={(e) => handleInputChange("source", e.target.value)}
                    placeholder="How was this opportunity discovered?"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Details */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
              <CardDescription>
                Description and notes for this opportunity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Detailed description of the opportunity..."
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Internal Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Internal notes and follow-up reminders..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push('/erp/sales/opportunities')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
