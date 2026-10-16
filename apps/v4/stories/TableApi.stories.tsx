import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Badge } from "../registry/new-york-v4/ui/badge"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../registry/new-york-v4/ui/table"

const invoices = [
  { invoice: "INV001", status: "Paid", method: "Credit Card", amount: 250 },
  { invoice: "INV002", status: "Pending", method: "PayPal", amount: 150 },
  { invoice: "INV003", status: "Unpaid", method: "Bank Transfer", amount: 350 },
  { invoice: "INV004", status: "Paid", method: "Credit Card", amount: 450 },
  { invoice: "INV005", status: "Paid", method: "PayPal", amount: 550 },
]

const statusVariant = {
  Paid: "default",
  Pending: "secondary",
  Unpaid: "outline",
} as const

const currency = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" })

const meta = {
  title: "Shadcn/Components/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  // `Table` has no meaningful default content, so every story composes the
  // parts (Header / Body / Row / Head / Cell / Footer / Caption) explicitly.
  render: (args) => (
    <Table {...args}>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[120px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((row) => (
          <TableRow key={row.invoice}>
            <TableCell className="font-medium">{row.invoice}</TableCell>
            <TableCell>
              <Badge variant={statusVariant[row.status as keyof typeof statusVariant]}>
                {row.status}
              </Badge>
            </TableCell>
            <TableCell>{row.method}</TableCell>
            <TableCell className="text-right">{currency(row.amount)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">
            {currency(invoices.reduce((sum, r) => sum + r.amount, 0))}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

/** Caption, header, body rows with a status Badge, and a total footer. */
export const Default: Story = {}

/** Header and rows only — the minimal composition. */
export const Minimal: Story = {
  render: (args) => (
    <Table {...args}>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Ada Lovelace</TableCell>
          <TableCell>Engineer</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Grace Hopper</TableCell>
          <TableCell>Admiral</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}

/** A row can be highlighted with `data-state="selected"`. */
export const SelectedRow: Story = {
  render: (args) => (
    <Table {...args}>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Ada Lovelace</TableCell>
          <TableCell>Engineer</TableCell>
        </TableRow>
        <TableRow data-state="selected">
          <TableCell>Grace Hopper</TableCell>
          <TableCell>Admiral</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Alan Turing</TableCell>
          <TableCell>Mathematician</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}
