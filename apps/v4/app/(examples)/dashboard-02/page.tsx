import { Metadata } from "next"
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/registry/new-york-v4/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card"
import { DataTable } from "@/app/(examples)/dashboard-02/components/data-table"

import data from "./data.json"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "A dashboard with tabs, table and sidebar.",
}

export default async function Dashboard02() {
  return (
    <div className="flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4 lg:px-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Revenue</CardTitle>
              <CardDescription>$1,250.00 in the last 30 days</CardDescription>
            </CardHeader>
            <CardFooter>
              <Badge variant="outline">
                <IconTrendingUp />
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
                <IconTrendingDown />
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
                <IconTrendingUp />
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
                <IconTrendingUp />
                +4.5%
              </Badge>
            </CardFooter>
          </Card>
        </div>
        <DataTable data={data} />
      </div>
    </div>
  )
}
