"use client"

import { Badge } from "@/registry/bases/radix/ui/badge"
import { Button } from "@/registry/bases/radix/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/bases/radix/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/bases/radix/ui/table"

const INVOICE_ITEMS = [
  { item: "Design System License", qty: 1, unitPrice: 499 },
  { item: "Priority Support", qty: 12, unitPrice: 99 },
  { item: "Custom Components", qty: 3, unitPrice: 250 },
] as const

const subtotal = INVOICE_ITEMS.reduce(
  (sum, row) => sum + row.qty * row.unitPrice,
  0
)
const tax = 0
const totalDue = subtotal + tax

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value)
}

export function Invoice() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice #INV-2847</CardTitle>
        <CardDescription>Due March 30, 2026</CardDescription>
        <CardAction>
          <Badge variant="secondary">Pending</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Rate</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {INVOICE_ITEMS.map((row) => (
              <TableRow key={row.item}>
                <TableCell className="text-sm">{row.item}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {row.qty}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCurrency(row.unitPrice)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCurrency(row.qty * row.unitPrice)}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} className="text-right">
                Subtotal
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatCurrency(subtotal)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3} className="text-right">
                Tax
              </TableCell>
              <TableCell className="text-right tabular-nums">$0.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3} className="text-right">
                Total Due
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatCurrency(totalDue)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm">
          Download PDF
        </Button>
        <Button size="sm" className="ml-auto">
          Pay Now
        </Button>
      </CardFooter>
    </Card>
  )
}
