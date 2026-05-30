"use client"

import * as React from "react"
import {
  Table as TablePrimitive,
  TableHeader as TableHeaderPrimitive,
  TableBody as TableBodyPrimitive,
  TableFooter as TableFooterPrimitive,
  Row as RowPrimitive,
  Column as ColumnPrimitive,
  Cell as CellPrimitive,
  type TableProps,
  type TableHeaderProps,
  type TableBodyProps,
  type TableFooterProps,
  type RowProps,
  type ColumnProps,
  type CellProps
} from "react-aria-components"

import { cn } from "@/registry/bases/react-aria/lib/utils"

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

function TableHeader<T>({ className, ...props }: TableHeaderProps<T>) {
  return (
    <TableHeaderPrimitive
      data-slot="table-header"
      className={cn("cn-table-header", className)}
      {...props}
    />
  )
}

function TableBody<T>({ className, ...props }: TableBodyProps<T>) {
  return (
    <TableBodyPrimitive
      data-slot="table-body"
      className={cn("cn-table-body data-empty:text-center data-empty:h-24", className)}
      {...props}
    />
  )
}

function TableFooter<T>({ className, ...props }: TableFooterProps<T>) {
  return (
    <TableFooterPrimitive
      data-slot="table-footer"
      className={cn("cn-table-footer", className)}
      {...props}
    />
  )
}

function TableRow<T>({ className, ...props }: RowProps<T>) {
  return (
    <RowPrimitive
      data-slot="table-row"
      className={cn("cn-table-row has-aria-expanded:bg-muted/50", className)}
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
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
