"use client"

import { Product } from "@prisma/client"
import { EyeClosedIcon, EyeNoneIcon, EyeOpenIcon } from "@radix-ui/react-icons"
import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/registry/new-york/ui/badge"
import { Button } from "@/registry/new-york/ui/button"
import { Checkbox } from "@/registry/new-york/ui/checkbox"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/new-york/ui/tooltip"

import { statuses } from "../data/data"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"

export const columns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("name")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate ">
            {row.getValue("description")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "priceWithoutTax",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price without tax" />
    ),
    cell: ({ row }) => {
      return (
        row.getValue("priceWithoutTax") && (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium">
              {row.getValue("priceWithoutTax") + "€"}
            </span>
          </div>
        )
      )
    },
  },
  {
    accessorKey: "taxRate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tax rate" />
    ),
    cell: ({ row }) => {
      return (
        row.getValue("taxRate") && (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium">
              {row.getValue("taxRate") + "%"}
            </span>
          </div>
        )
      )
    },
  },
  {
    accessorKey: "taxAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tax amount" />
    ),
    cell: ({ row }) => {
      return (
        row.getValue("taxAmount") && (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium">
              {row.getValue("taxAmount") + "€"}
            </span>
          </div>
        )
      )
    },
  },
  {
    accessorKey: "priceWithTax",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price with tax" />
    ),
    cell: ({ row }) => {
      return (
        row.getValue("priceWithTax") && (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium">
              {row.getValue("priceWithTax") + "€"}
            </span>
          </div>
        )
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      )

      if (!status) {
        return null
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "isDisplayed",
    cell: ({ row, table }) => {
      return (
        <>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <>
                  {row.original.hidden && (
                    <EyeNoneIcon
                      className="mr-2 h-4 w-4 text-muted-foreground"
                      onClick={() => {
                        //@ts-ignore
                        table.options.meta?.updateById(
                          row.original.id,
                          "hidden",
                          false
                        )
                      }}
                    />
                  )}
                  {!row.original.hidden && (
                    <EyeOpenIcon
                      className="mr-2 h-4 w-4 text-muted-foreground"
                      onClick={() => {
                        //@ts-ignore
                        table.options.meta?.updateById(
                          row.original.id,
                          "hidden",
                          true
                        )
                      }}
                    />
                  )}
                </>
              </TooltipTrigger>
              <TooltipContent>
                <p>{row.original.hidden ? "Show" : "Hide"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => <DataTableRowActions row={row} table={table} />,
  },
]
