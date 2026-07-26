"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button, buttonVariants } from "@/styles/aria-nova/ui/button"
import { Checkbox } from "@/styles/aria-nova/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/styles/aria-nova/ui/dropdown-menu"
import { Input } from "@/styles/aria-nova/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/styles/aria-nova/ui/table"

const data: Payment[] = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "success",
    email: "Abe45@example.com",
  },
  {
    id: "derv1ws0",
    amount: 837,
    status: "processing",
    email: "Monserrat44@example.com",
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "success",
    email: "Silas22@example.com",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@example.com",
  },
]

export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: () => <Checkbox slot="selection" />,
    cell: () => <Checkbox slot="selection" />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: () => {
      return (
        <div className={buttonVariants({ variant: "ghost" })}>
          Email
          <ArrowUpDown />
        </div>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))

      // Format the amount as a dollar amount.
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original

      return (
        <DropdownMenuTrigger>
          <Button variant="ghost" size="icon-xs">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
          <DropdownMenu placement="bottom end" className="w-44">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(payment.id)}
              >
                Copy payment ID
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>View customer</DropdownMenuItem>
              <DropdownMenuItem>View payment details</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenu>
        </DropdownMenuTrigger>
      )
    },
  },
]

export function DataTableDemo() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenuTrigger>
          <Button variant="outline" className="ml-auto">
            Columns <ChevronDown />
          </Button>
          <DropdownMenu placement="bottom end" className="w-44">
            <DropdownMenuGroup
              selectionMode="multiple"
              selectedKeys={table
                .getVisibleFlatColumns()
                .filter((column) => column.getCanHide())
                .map((column) => column.id)}
              onSelectionChange={(keys) => {
                table.setColumnVisibility(
                  Object.fromEntries(
                    table
                      .getAllFlatColumns()
                      .map((c) => [
                        c.id,
                        !c.getCanHide() || keys === "all" || keys.has(c.id),
                      ])
                  )
                )
              }}
            >
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuItem
                      key={column.id}
                      id={column.id}
                      className="capitalize"
                    >
                      {column.id}
                    </DropdownMenuItem>
                  )
                })}
            </DropdownMenuGroup>
          </DropdownMenu>
        </DropdownMenuTrigger>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table
          aria-label="Tasks"
          selectionMode="multiple"
          selectedKeys={table.getSelectedRowModel().rows.map((row) => row.id)}
          onSelectionChange={(selection) => {
            if (selection === "all") {
              table.toggleAllRowsSelected()
            } else {
              table.setRowSelection(
                Object.fromEntries([...selection].map((key) => [key, true]))
              )
            }
          }}
          sortDescriptor={
            sorting.length
              ? {
                  column: sorting[0].id,
                  direction: sorting[0].desc ? "descending" : "ascending",
                }
              : undefined
          }
          onSortChange={(sortDescriptor) => {
            table.setSorting([
              {
                id: "" + sortDescriptor.column,
                desc: sortDescriptor.direction === "descending",
              },
            ])
          }}
        >
          <TableHeader>
            {table.getFlatHeaders().map((header) => (
              <TableHead
                key={header.id}
                id={header.id}
                isRowHeader={header.index === 1}
                allowsSorting={header.column.getCanSort()}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableHeader>
          <TableBody renderEmptyState={() => "No results."}>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} id={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            isDisabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            isDisabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
