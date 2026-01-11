"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Users, UserPlus, TrendingUp, CheckCircle, Clock, AlertCircle, Upload } from "lucide-react"

interface LeadSummary {
  totalLeads: number
  newLeads: number
  qualifiedLeads: number
  hotLeads: number
  conversionRate: number
}

export default function LeadsPage() {
  const [summary, setSummary] = useState<LeadSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSummary() {
      try {
        const response = await fetch('/api/leads/summary')
        if (response.ok) {
          const data = await response.json()
          setSummary(data)
        }
      } catch (error) {
        console.error('Failed to fetch lead summary:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [])
  return (
    <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Lead Management</h2>
          <div className="flex items-center space-x-2">
            <Button asChild>
              <Link href="/erp/sales/leads/new">
                <UserPlus className="mr-2 h-4 w-4" />
                Create New Lead
              </Link>
            </Button>
          </div>
        </div>

        {/* Lead Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : summary?.totalLeads || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                All leads in system
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Leads</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : summary?.newLeads || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Last 30 days
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Qualified Leads</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : summary?.qualifiedLeads || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Ready for engagement
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : `${summary?.conversionRate || 0}%`}
              </div>
              <p className="text-xs text-muted-foreground">
                Lead to customer rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">View All Leads</CardTitle>
              <CardDescription>
                Browse and manage all leads in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/erp/sales/leads/all">
                  <Users className="mr-2 h-4 w-4" />
                  View All Leads
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Create New Lead</CardTitle>
              <CardDescription>
                Add a new potential customer to the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/erp/sales/leads/new">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create Lead
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bulk Import Leads</CardTitle>
              <CardDescription>
                Upload CSV or Excel file to import multiple leads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="outline">
                <Link href="/erp/sales/leads/import">
                  <Upload className="mr-2 h-4 w-4" />
                  Import Leads
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hot Leads</CardTitle>
              <CardDescription>
                View leads that require immediate attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/erp/sales/leads/hot">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Hot Leads ({loading ? "..." : summary?.hotLeads || 0})
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lead Reports</CardTitle>
              <CardDescription>
                Analyze lead performance and metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/erp/sales/leads/reports">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Reports
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Lead Activity</CardTitle>
            <CardDescription>
              Latest updates and activities on your leads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 rounded-md border p-4">
                <div className="flex h-2 w-2 rounded-full bg-green-500"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    New lead created: Acme Corporation
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Contact: John Doe - john@acme.com
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">2 minutes ago</div>
              </div>
              <div className="flex items-center space-x-4 rounded-md border p-4">
                <div className="flex h-2 w-2 rounded-full bg-blue-500"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Lead qualified: TechStart Solutions
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Moved to qualified status by Sarah Johnson
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">1 hour ago</div>
              </div>
              <div className="flex items-center space-x-4 rounded-md border p-4">
                <div className="flex h-2 w-2 rounded-full bg-orange-500"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Follow-up scheduled: Global Innovations
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Meeting scheduled for tomorrow at 2:00 PM
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">3 hours ago</div>
              </div>
            </div>
          </CardContent>
        </Card>
    </div>
  )
}