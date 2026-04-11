"use client"

import * as React from "react"
import {
  Table as TablePrimitive,
  TableHeader as TableHeaderPrimitive,
  TableBody as TableBodyPrimitive,
  Row as RowPrimitive,
  Column as ColumnPrimitive,
  Cell as CellPrimitive,
  type TableProps,
  type TableHeaderProps,
  type TableBodyProps,
  type RowProps,
  type ColumnProps,
  type CellProps
} from "react-aria-components"

import { cn } from "@/registry/bases/react-aria/lib/utils"
import { cva } from "class-variance-authority"

function Table({ className, ...props }: TableProps) {
  return (
    <div data-slot="table-container" className="cn-table-container">
      <TablePrimitive
        data-slot="table"
        className={cn("cn-table", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader<T extends object>({ className, ...props }: TableHeaderProps<T>) {
  return (
    <TableHeaderPrimitive
      data-slot="table-header"
      className={cn("cn-table-header", className)}
      {...props}
    />
  )
}

function TableBody<T extends object>({ className, ...props }: TableBodyProps<T>) {
  return (
    <TableBodyPrimitive
      data-slot="table-body"
      className={cn("cn-table-body data-empty:text-center data-empty:h-24", className)}
      {...props}
    />
  )
}

const rowVariants = cva("cn-table-row has-aria-expanded:bg-muted/50", {
  variants: {
    isFooter: {
      true: "cn-table-footer"
    }
  }
});

function TableRow<T extends object>({ className, isFooter, ...props }: RowProps<T> & {isFooter?: boolean}) {
  return (
    <RowPrimitive
      data-slot="table-row"
      className={cn(rowVariants({isFooter}), className)}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: ColumnProps) {
  return (
    <ColumnPrimitive
      data-slot="table-head"
      className={cn("cn-table-head", className)}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: CellProps) {
  return (
    <CellPrimitive
      data-slot="table-cell"
      className={cn("cn-table-cell", className)}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"figcaption">) {
  return (
    <figcaption
      data-slot="table-caption"
      className={cn("cn-table-caption text-center", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
