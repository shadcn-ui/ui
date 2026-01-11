import { Metadata } from "next"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Users, UserPlus, DollarSign, Award, Calendar, TrendingUp } from "lucide-react"

export const metadata: Metadata = {
  title: "HRIS - Ocean ERP",
  description: "Human Resource Information System and employee management",
}

export default function HRISPage() {
  return (
    <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Human Resources Information System</h2>
          <div className="flex items-center space-x-2">
            <Button>Add Employee</Button>
          </div>
        </div>

        {/* HR Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">847</div>
              <p className="text-xs text-muted-foreground">
                +12 new hires this month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">
                5 urgent positions
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Payroll Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2.4M</div>
              <p className="text-xs text-muted-foreground">
                Monthly payroll expense
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.2/5</div>
              <p className="text-xs text-muted-foreground">
                +0.3 from last quarter
              </p>
            </CardContent>
          </Card>
        </div>

        {/* HRIS Modules */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Employee Management</CardTitle>
              <CardDescription>
                Manage employee profiles and information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/hris/employees">Employee Directory</a>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/hris/employees/org-chart">Organization Chart</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recruitment</CardTitle>
              <CardDescription>
                Manage job postings and hiring process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/hris/recruitment">Job Postings</a>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/hris/recruitment/candidates">Candidates</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payroll Management</CardTitle>
              <CardDescription>
                Process payroll and manage compensation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/hris/payroll">Payroll Processing</a>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/hris/payroll/reports">Payroll Reports</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Management</CardTitle>
              <CardDescription>
                Track and evaluate employee performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/hris/performance">Performance Reviews</a>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/hris/performance/goals">Goals & Objectives</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Training & Development</CardTitle>
              <CardDescription>
                Manage employee training and skill development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/hris/training">Training Programs</a>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/hris/training/certifications">Certifications</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Expenses</CardTitle>
              <CardDescription>
                Manage employee expense claims and reimbursements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/hris/expense-claims">Expense Claims</a>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/hris/expense-claims/reports">Expense Reports</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Leave Management</CardTitle>
              <CardDescription>
                Track employee attendance and leave requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/hris/leave">Leave Requests</a>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/hris/leave/calendar">Leave Calendar</a>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/hris/expense-claims">Expense Claims</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
    </div>
  )
}