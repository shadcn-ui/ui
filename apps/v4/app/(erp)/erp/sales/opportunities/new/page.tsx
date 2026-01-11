"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/registry/new-york-v4/ui/card"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Label } from "@/registry/new-york-v4/ui/label"
import { Textarea } from "@/registry/new-york-v4/ui/textarea"
import { SidebarTrigger } from "@/registry/new-york-v4/ui/sidebar"
import { Separator } from "@/registry/new-york-v4/ui/separator"
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
  Target,
  Building2,
  Users,
  Calendar,
  DollarSign,
  TrendingUp
} from "lucide-react"
import { toast } from "sonner"

interface OpportunityForm {
  title: string
  company: string
  contact: string
  email: string
  phone: string
  stage: string
  value: string
  probability: string
  expectedCloseDate: string
  assignedTo: string
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

const initialFormData: OpportunityForm = {
  title: "",
  company: "",
  contact: "",
  email: "",
  phone: "",
  stage: "Discovery",
  value: "",
  probability: "25",
  expectedCloseDate: "",
  assignedTo: "",
  source: "",
  description: "",
  notes: ""
}

export default function CreateOpportunityPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<OpportunityForm>(initialFormData)
  const [isLoading, setIsLoading] = useState(false)
  const [lookupData, setLookupData] = useState<LookupData>({ users: [] })
  const [isLoadingLookup, setIsLoadingLookup] = useState(true)

  // Fetch lookup data on component mount
  useEffect(() => {
    const fetchLookupData = async () => {
      try {
        const response = await fetch('/api/opportunities/lookup')
        const result = await response.json()
        
        if (result.success) {
          setLookupData(result.data)
        } else {
          console.error('Failed to fetch lookup data:', result.error)
        }
      } catch (error) {
        console.error('Error fetching lookup data:', error)
      } finally {
        setIsLoadingLookup(false)
      }
    }

    fetchLookupData()
  }, [])

  const handleInputChange = (field: keyof OpportunityForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Auto-update probability based on stage
    if (field === "stage") {
      const stageProbabilities: Record<string, string> = {
        "Discovery": "25",
        "Qualification": "40",
        "Proposal": "60",
        "Negotiation": "75",
        "Closed Won": "100",
        "Closed Lost": "0"
      }
      setFormData(prev => ({
        ...prev,
        probability: stageProbabilities[value] || prev.probability
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate required fields
      const requiredFields = ['title', 'company', 'contact', 'stage', 'value']
      const missingFields = requiredFields.filter(field => !formData[field as keyof OpportunityForm]?.trim())
      
      if (missingFields.length > 0) {
        toast.error('Missing Required Fields', {
          description: `Please fill in: ${missingFields.join(', ')}`,
        })
        setIsLoading(false)
        return
      }

      // Call API to create opportunity
      const response = await fetch('/api/opportunities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create opportunity')
      }

      toast.success('Opportunity Created Successfully', {
        description: `${formData.title} has been added to your pipeline.`,
      })
      router.push('/erp/sales/opportunities')

    } catch (error) {
      console.error('Error creating opportunity:', error)
      toast.error('Failed to create opportunity', {
        description: 'Please check your data and try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const stages = [
    { value: "Discovery", label: "Discovery", probability: 25 },
    { value: "Qualification", label: "Qualification", probability: 40 },
    { value: "Proposal", label: "Proposal", probability: 60 },
    { value: "Negotiation", label: "Negotiation", probability: 75 },
    { value: "Closed Won", label: "Closed Won", probability: 100 },
    { value: "Closed Lost", label: "Closed Lost", probability: 0 }
  ]

  const sources = [
    "Website Inquiry",
    "Referral", 
    "Cold Call",
    "Email Campaign",
    "Trade Show",
    "Social Media",
    "Partner Referral",
    "Existing Customer",
    "Other"
  ]

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center gap-2">
          <Link 
            href="/erp/sales" 
            className="text-muted-foreground hover:text-foreground"
          >
            Sales
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link 
            href="/erp/sales/opportunities" 
            className="text-muted-foreground hover:text-foreground"
          >
            Opportunities
          </Link>
          <span className="text-muted-foreground">/</span>
          <h1 className="text-lg font-semibold">Create New</h1>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/erp/sales/opportunities">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Create New Opportunity</h2>
              <p className="text-muted-foreground">
                Add a new sales opportunity to your pipeline
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Opportunity Details
                  </CardTitle>
                  <CardDescription>
                    Basic information about the sales opportunity
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Opportunity Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        placeholder="e.g., Enterprise Software Implementation"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="source">Lead Source</Label>
                      <Select value={formData.source} onValueChange={(value) => handleInputChange("source", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent>
                          {sources.map((source) => (
                            <SelectItem key={source} value={source}>
                              {source}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Describe the opportunity, customer needs, and solution overview..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Company & Contact Information
                  </CardTitle>
                  <CardDescription>
                    Details about the prospect and key contact
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name *</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        placeholder="e.g., TechCorp Inc."
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact">Primary Contact *</Label>
                      <Input
                        id="contact"
                        value={formData.contact}
                        onChange={(e) => handleInputChange("contact", e.target.value)}
                        placeholder="e.g., John Smith"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="john.smith@techcorp.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sales Information Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Sales Information
                  </CardTitle>
                  <CardDescription>
                    Pipeline stage and opportunity value
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="stage">Stage *</Label>
                    <Select value={formData.stage} onValueChange={(value) => handleInputChange("stage", value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        {stages.map((stage) => (
                          <SelectItem key={stage.value} value={stage.value}>
                            {stage.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="value">Opportunity Value ($) *</Label>
                    <Input
                      id="value"
                      type="number"
                      value={formData.value}
                      onChange={(e) => handleInputChange("value", e.target.value)}
                      placeholder="125000"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="probability">Probability (%)</Label>
                    <Input
                      id="probability"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.probability}
                      onChange={(e) => handleInputChange("probability", e.target.value)}
                      placeholder="75"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expectedCloseDate">Expected Close Date</Label>
                    <Input
                      id="expectedCloseDate"
                      type="date"
                      value={formData.expectedCloseDate}
                      onChange={(e) => handleInputChange("expectedCloseDate", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assignedTo">Assigned To</Label>
                    <Select value={formData.assignedTo} onValueChange={(value) => handleInputChange("assignedTo", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sales rep" />
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
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Additional Notes</CardTitle>
                  <CardDescription>
                    Any additional information or notes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Add any additional notes, requirements, or follow-up actions..."
                    rows={4}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6">
            <Button type="button" variant="outline" asChild>
              <Link href="/erp/sales/opportunities">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create Opportunity
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}