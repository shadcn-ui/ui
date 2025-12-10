"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/registry/new-york-v4/ui/card"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Input } from "@/registry/new-york-v4/ui/input"
import { SidebarTrigger } from "@/registry/new-york-v4/ui/sidebar"
import { Separator } from "@/registry/new-york-v4/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/new-york-v4/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/new-york-v4/ui/dropdown-menu"
import { 
  Target, 
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  TrendingUp,
  Clock,
  Users,
  Calendar,
  Building2
} from "lucide-react"

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
  created_at: string
  updated_at: string
}

export default function OpportunitiesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [stageFilter, setStageFilter] = useState("all")
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch opportunities from API
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await fetch('/api/opportunities')
        const data = await response.json()
        
        if (response.ok) {
          setOpportunities(data.opportunities || [])
          setFilteredOpportunities(data.opportunities || [])
        } else {
          console.error('Failed to fetch opportunities:', data.error)
        }
      } catch (error) {
        console.error('Error fetching opportunities:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOpportunities()
  }, [])

  // Filter opportunities based on search and stage filter
  useEffect(() => {
    let filtered = opportunities

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(opportunity =>
        opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opportunity.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opportunity.contact.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply stage filter
    if (stageFilter !== "all") {
      filtered = filtered.filter(opportunity => opportunity.stage === stageFilter)
    }

    setFilteredOpportunities(filtered)
  }, [opportunities, searchTerm, stageFilter])

  // Calculate pipeline statistics
  const stats = {
    totalValue: opportunities.reduce((sum, opp) => sum + Number(opp.value), 0),
    weightedPipeline: opportunities.reduce((sum, opp) => sum + (Number(opp.value) * Number(opp.probability) / 100), 0),
    activeOpportunities: opportunities.filter(opp => !['Closed Won', 'Closed Lost'].includes(opp.stage)).length,
    wonDeals: opportunities.filter(opp => opp.stage === 'Closed Won').length
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set"
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  if (isLoading) {
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
            <h1 className="text-lg font-semibold">Opportunities</h1>
          </div>
        </header>
        <div className="flex-1 space-y-6 p-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading opportunities...</p>
            </div>
          </div>
        </div>
      </>
    )
  }

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
          <h1 className="text-lg font-semibold">Opportunities</h1>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Sales Opportunities</h2>
            <p className="text-muted-foreground">
              Manage your sales pipeline and track deal progress
            </p>
          </div>
          <Button asChild>
            <Link href="/erp/sales/opportunities/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Opportunity
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pipeline Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weighted Pipeline</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.weightedPipeline)}</div>
              <p className="text-xs text-muted-foreground">
                Based on win probability
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Opportunities</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeOpportunities}</div>
              <p className="text-xs text-muted-foreground">
                In sales pipeline
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Won Deals</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.wonDeals}</div>
              <p className="text-xs text-muted-foreground">
                Closed successfully
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Opportunity Pipeline</CardTitle>
            <CardDescription>
              Track and manage your sales opportunities through each stage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search opportunities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={stageFilter} onValueChange={setStageFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  <SelectItem value="Discovery">Discovery</SelectItem>
                  <SelectItem value="Qualification">Qualification</SelectItem>
                  <SelectItem value="Proposal">Proposal</SelectItem>
                  <SelectItem value="Negotiation">Negotiation</SelectItem>
                  <SelectItem value="Closed Won">Closed Won</SelectItem>
                  <SelectItem value="Closed Lost">Closed Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Opportunity</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Probability</TableHead>
                    <TableHead>Expected Close</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOpportunities.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="h-24 text-center">
                        No opportunities found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOpportunities.map((opportunity) => (
                      <TableRow key={opportunity.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-semibold">{opportunity.title}</div>
                            <div className="text-sm text-muted-foreground">
                              Created {formatDate(opportunity.created_at)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                            {opportunity.company}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{opportunity.contact}</div>
                            {opportunity.email && (
                              <div className="text-sm text-muted-foreground">{opportunity.email}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="secondary" 
                            className={getStageColor(opportunity.stage)}
                          >
                            {opportunity.stage}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(Number(opportunity.value))}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${opportunity.probability}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{opportunity.probability}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                            {formatDate(opportunity.expected_close_date)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Users className="mr-1 h-3 w-3 text-muted-foreground" />
                            {opportunity.assigned_to || "Unassigned"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}