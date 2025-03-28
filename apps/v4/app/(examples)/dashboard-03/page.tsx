import { Metadata } from "next"
import {
  DownloadIcon,
  FilterIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react"

import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/new-york-v4/ui/tabs"
import { AnalyticsDatePicker } from "@/app/(examples)/dashboard-03/components/analytics-date-picker"
import { ChartRevenue } from "@/app/(examples)/dashboard-03/components/chart-revenue"
import { ChartVisitors } from "@/app/(examples)/dashboard-03/components/chart-visitors"
import { ProductsTable } from "@/app/(examples)/dashboard-03/components/products-table"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "An example dashboard to test the new components.",
}

// Load from database.
const products = [
  {
    id: "1",
    name: "BJÖRKSNÄS Dining Table",
    price: 599.99,
    stock: 12,
    dateAdded: "2023-06-15",
    status: "In Stock",
  },
  {
    id: "2",
    name: "POÄNG Armchair",
    price: 249.99,
    stock: 28,
    dateAdded: "2023-07-22",
    status: "In Stock",
  },
  {
    id: "3",
    name: "MALM Bed Frame",
    price: 399.99,
    stock: 15,
    dateAdded: "2023-08-05",
    status: "In Stock",
  },
  {
    id: "4",
    name: "KALLAX Shelf Unit",
    price: 179.99,
    stock: 32,
    dateAdded: "2023-09-12",
    status: "In Stock",
  },
  {
    id: "5",
    name: "STOCKHOLM Rug",
    price: 299.99,
    stock: 8,
    dateAdded: "2023-10-18",
    status: "Low Stock",
  },
  {
    id: "6",
    name: "KIVIK Sofa",
    price: 899.99,
    stock: 6,
    dateAdded: "2023-11-02",
    status: "Low Stock",
  },
  {
    id: "7",
    name: "LISABO Coffee Table",
    price: 149.99,
    stock: 22,
    dateAdded: "2023-11-29",
    status: "In Stock",
  },
  {
    id: "8",
    name: "HEMNES Bookcase",
    price: 249.99,
    stock: 17,
    dateAdded: "2023-12-10",
    status: "In Stock",
  },
  {
    id: "9",
    name: "EKEDALEN Dining Chairs (Set of 2)",
    price: 199.99,
    stock: 14,
    dateAdded: "2024-01-05",
    status: "In Stock",
  },
  {
    id: "10",
    name: "FRIHETEN Sleeper Sofa",
    price: 799.99,
    stock: 9,
    dateAdded: "2024-01-18",
    status: "Low Stock",
  },
]

export default function DashboardPage() {
  return (
    <div className="@container/page flex flex-1 flex-col gap-8 p-6">
      <Tabs defaultValue="overview" className="gap-6">
        <div
          data-slot="dashboard-header"
          className="flex items-center justify-between"
        >
          <TabsList className="w-full @3xl/page:w-fit">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="exports" disabled>
              Exports
            </TabsTrigger>
          </TabsList>
          <div className="hidden items-center gap-2 @3xl/page:flex">
            <AnalyticsDatePicker />
            <Button variant="outline">
              <FilterIcon />
              Filter
            </Button>
            <Button variant="outline">
              <DownloadIcon />
              Export
            </Button>
          </div>
        </div>
        <TabsContent value="overview" className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Revenue</CardTitle>
                <CardDescription>$1,250.00 in the last 30 days</CardDescription>
              </CardHeader>
              <CardFooter>
                <Badge variant="outline">
                  <TrendingUpIcon />
                  +12.5%
                </Badge>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>New Customers</CardTitle>
                <CardDescription>-12 customers from last month</CardDescription>
              </CardHeader>
              <CardFooter>
                <Badge variant="outline">
                  <TrendingDownIcon />
                  -20%
                </Badge>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Active Accounts</CardTitle>
                <CardDescription>+2,345 users from last month</CardDescription>
              </CardHeader>
              <CardFooter>
                <Badge variant="outline">
                  <TrendingUpIcon />
                  +12.5%
                </Badge>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Growth Rate</CardTitle>
                <CardDescription>+12.5% increase per month</CardDescription>
              </CardHeader>
              <CardFooter>
                <Badge variant="outline">
                  <TrendingUpIcon />
                  +4.5%
                </Badge>
              </CardFooter>
            </Card>
          </div>
          <div className="grid grid-cols-1 gap-4 @4xl/page:grid-cols-[2fr_1fr]">
            <ChartRevenue />
            <ChartVisitors />
          </div>
          <ProductsTable products={products} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
