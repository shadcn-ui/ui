import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CheckIcon, DownloadIcon } from "lucide-react"

const invoices = [
  {
    id: "INV-2024-001",
    date: "Jan 1, 2024",
    amount: "$49.00",
    status: "Paid",
  },
  {
    id: "INV-2023-012",
    date: "Dec 1, 2023",
    amount: "$49.00",
    status: "Paid",
  },
  {
    id: "INV-2023-011",
    date: "Nov 1, 2023",
    amount: "$49.00",
    status: "Paid",
  },
  {
    id: "INV-2023-010",
    date: "Oct 1, 2023",
    amount: "$49.00",
    status: "Paid",
  },
  {
    id: "INV-2023-009",
    date: "Sep 1, 2023",
    amount: "$29.00",
    status: "Paid",
  },
]

const plans = [
  {
    name: "Starter",
    price: "$0",
    description: "For individuals getting started",
    features: ["1 user", "5 projects", "1GB storage", "Community support"],
    current: false,
  },
  {
    name: "Pro",
    price: "$49",
    description: "For growing teams and businesses",
    features: [
      "Unlimited users",
      "Unlimited projects",
      "100GB storage",
      "Priority support",
      "Custom integrations",
      "Advanced analytics",
    ],
    current: true,
  },
  {
    name: "Enterprise",
    price: "$199",
    description: "For large-scale organizations",
    features: [
      "Everything in Pro",
      "Unlimited storage",
      "Dedicated support",
      "SLA guarantee",
      "Custom contracts",
      "SSO / SAML",
    ],
    current: false,
  },
]

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Billing</h2>
        <p className="text-muted-foreground">
          Manage your subscription and billing details.
        </p>
      </div>
      <Separator />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Current Plan
              <Badge>Pro</Badge>
            </CardTitle>
            <CardDescription>
              Your plan renews on February 1, 2024
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">$49</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">API Requests</span>
                <span>8,450 / 10,000</span>
              </div>
              <Progress value={84.5} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Storage</span>
                <span>42GB / 100GB</span>
              </div>
              <Progress value={42} />
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button variant="outline">Cancel plan</Button>
            <Button>Upgrade plan</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>
              Update your billing information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <div className="flex size-10 items-center justify-center rounded-md bg-muted font-bold text-sm">
                VISA
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Visa ending in 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/2025</p>
              </div>
              <Button variant="ghost" size="sm">
                Edit
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Add payment method
            </Button>
          </CardFooter>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Plans</CardTitle>
          <CardDescription>
            Choose the plan that works best for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-lg border p-6 ${
                  plan.current ? "border-primary ring-1 ring-primary" : ""
                }`}
              >
                <h3 className="font-semibold">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {plan.description}
                </p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <CheckIcon className="size-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-6 w-full"
                  variant={plan.current ? "secondary" : "default"}
                  disabled={plan.current}
                >
                  {plan.current ? "Current plan" : "Upgrade"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
          <CardDescription>
            Download your past invoices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Download</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{invoice.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon-sm">
                      <DownloadIcon className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
