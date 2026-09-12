"use client"

import * as React from "react"
import { ark } from "@ark-ui/react/factory"

import { cn } from "@/registry/bases/ark/lib/utils"

function Table({ className, ...props }: React.ComponentProps<typeof ark.table>) {
  return (
    <ark.div data-slot="table-container" className="cn-table-container">
      <ark.table
        data-slot="table"
        className={cn("cn-table", className)}
        {...props}
      />
    </ark.div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<typeof ark.thead>) {
  return (
    <ark.thead
      data-slot="table-header"
      className={cn("cn-table-header", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<typeof ark.tbody>) {
  return (
    <ark.tbody
      data-slot="table-body"
      className={cn("cn-table-body", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<typeof ark.tfoot>) {
  return (
    <ark.tfoot
      data-slot="table-footer"
      className={cn("cn-table-footer", className)}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<typeof ark.tr>) {
  return (
    <ark.tr
      data-slot="table-row"
      className={cn("cn-table-row", className)}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<typeof ark.th>) {
  return (
    <ark.th
      data-slot="table-head"
      className={cn("cn-table-head", className)}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<typeof ark.td>) {
  return (
    <ark.td
      data-slot="table-cell"
      className={cn("cn-table-cell", className)}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<typeof ark.caption>) {
  return (
    <ark.caption
      data-slot="table-caption"
      className={cn("cn-table-caption", className)}
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
