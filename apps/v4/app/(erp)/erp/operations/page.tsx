import { Metadata } from "next"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Factory, Truck, ClipboardCheck, Clock, Target, Activity } from "lucide-react"

export const metadata: Metadata = {
  title: "Operations Management - Ocean ERP",
  description: "Manage manufacturing, logistics, and operational processes",
}

export default function OperationsPage() {
  return (
    <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Operations Management</h2>
          <div className="flex items-center space-x-2">
            <Button>New Work Order</Button>
          </div>
        </div>

        {/* Operations Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
              <Factory className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
              <p className="text-xs text-muted-foreground">
                +5 from yesterday
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94.2%</div>
              <p className="text-xs text-muted-foreground">
                +2.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98.7%</div>
              <p className="text-xs text-muted-foreground">
                +0.5% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87.3%</div>
              <p className="text-xs text-muted-foreground">
                +3.2% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Operations Management Modules */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Manufacturing</CardTitle>
              <CardDescription>
                Manage production processes and work orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/operations/manufacturing">Work Orders</a>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/operations/manufacturing/bom">Bill of Materials</a>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/operations/manufacturing/skincare-formulations">Skincare Formulations</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Production Planning</CardTitle>
              <CardDescription>
                Plan and schedule production activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/operations/planning">Production Schedule</a>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/operations/planning/capacity">Capacity Planning</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quality Control</CardTitle>
              <CardDescription>
                Monitor and ensure product quality standards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/operations/quality">Quality Checks</a>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/operations/quality/reports">Quality Reports</a>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/operations/quality/skincare-compliance">Skincare Compliance</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Logistics</CardTitle>
              <CardDescription>
                Manage shipping, transportation, and delivery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/operations/logistics">Shipments</a>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/operations/logistics/tracking">Track Deliveries</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Supply Chain</CardTitle>
              <CardDescription>
                Optimize supply chain operations and procurement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/operations/supply-chain">Supply Chain Overview</a>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/operations/supply-chain/procurement-advanced">Procurement Advanced</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Management</CardTitle>
              <CardDescription>
                Manage projects, tasks, and resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/operations/projects">Active Projects</a>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/operations/projects/timeline">Project Timeline</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
    </div>
  )
}