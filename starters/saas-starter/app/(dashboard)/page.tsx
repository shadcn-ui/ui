import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  ArrowUpRightIcon,
  ArrowDownRightIcon,
  DollarSignIcon,
  UsersIcon,
  CreditCardIcon,
  ActivityIcon,
} from "lucide-react"

const metrics = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    trend: "up" as const,
    icon: DollarSignIcon,
    description: "from last month",
  },
  {
    title: "Subscriptions",
    value: "+2,350",
    change: "+180.1%",
    trend: "up" as const,
    icon: UsersIcon,
    description: "from last month",
  },
  {
    title: "Active Now",
    value: "+573",
    change: "+19%",
    trend: "up" as const,
    icon: ActivityIcon,
    description: "from last hour",
  },
  {
    title: "MRR",
    value: "$12,234.00",
    change: "-2.5%",
    trend: "down" as const,
    icon: CreditCardIcon,
    description: "from last month",
  },
]

const recentSales = [
  {
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    amount: "+$1,999.00",
  },
  {
    name: "Jackson Lee",
    email: "jackson.lee@email.com",
    amount: "+$39.00",
  },
  {
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    amount: "+$299.00",
  },
  {
    name: "William Kim",
    email: "will@email.com",
    amount: "+$99.00",
  },
  {
    name: "Sofia Davis",
    email: "sofia.davis@email.com",
    amount: "+$39.00",
  },
]

const recentTransactions = [
  {
    id: "INV-001",
    customer: "Olivia Martin",
    status: "Completed",
    amount: "$1,999.00",
    date: "2024-01-15",
  },
  {
    id: "INV-002",
    customer: "Jackson Lee",
    status: "Pending",
    amount: "$39.00",
    date: "2024-01-15",
  },
  {
    id: "INV-003",
    customer: "Isabella Nguyen",
    status: "Completed",
    amount: "$299.00",
    date: "2024-01-14",
  },
  {
    id: "INV-004",
    customer: "William Kim",
    status: "Failed",
    amount: "$99.00",
    date: "2024-01-14",
  },
  {
    id: "INV-005",
    customer: "Sofia Davis",
    status: "Completed",
    amount: "$39.00",
    date: "2024-01-13",
  },
]

export default function DashboardPage() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {metric.trend === "up" ? (
                  <ArrowUpRightIcon className="size-3 text-emerald-500" />
                ) : (
                  <ArrowDownRightIcon className="size-3 text-red-500" />
                )}
                <span
                  className={
                    metric.trend === "up"
                      ? "text-emerald-500"
                      : "text-red-500"
                  }
                >
                  {metric.change}
                </span>{" "}
                {metric.description}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Your latest payment transactions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {transaction.id}
                    </TableCell>
                    <TableCell>{transaction.customer}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          transaction.status === "Completed"
                            ? "default"
                            : transaction.status === "Pending"
                              ? "secondary"
                              : "destructive"
                        }
                        className="text-xs"
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {transaction.amount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>You made 265 sales this month.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentSales.map((sale) => (
                <div
                  key={sale.email}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-muted text-sm font-medium">
                      {sale.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">
                        {sale.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {sale.email}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm font-medium">{sale.amount}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
