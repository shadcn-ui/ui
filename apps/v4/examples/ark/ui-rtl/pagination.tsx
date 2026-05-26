"use client"

import * as React from "react"
import { cn } from "@/examples/ark/lib/utils"
import { Button } from "@/examples/ark/ui-rtl/button"
import { ark } from "@ark-ui/react/factory"
import { Pagination as PaginationPrimitive } from "@ark-ui/react/pagination"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  MoreHorizontalIcon,
} from "lucide-react"

function Pagination({
  className,
  ...props
}: React.ComponentProps<typeof PaginationPrimitive.Root>) {
  return (
    <PaginationPrimitive.Root
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<typeof ark.ul>) {
  return (
    <PaginationPrimitive.Context>
      {() => (
        <ark.ul
          data-slot="pagination-content"
          className={cn("flex items-center gap-0.5", className)}
          {...props}
        />
      )}
    </PaginationPrimitive.Context>
  )
}

function PaginationItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof PaginationPrimitive.Item>) {
  return (
    <PaginationPrimitive.Item
      data-slot="pagination-item"
      className={cn(className)}
      {...props}
    >
      {children}
    </PaginationPrimitive.Item>
  )
}

function PaginationPrevious({
  className,
  text = "Previous",
  ...props
}: Omit<
  React.ComponentProps<typeof PaginationPrimitive.PrevTrigger>,
  "children"
> & {
  text?: string
}) {
  return (
    <PaginationPrimitive.PrevTrigger asChild {...props}>
      <Button
        variant="ghost"
        size="default"
        aria-label="Go to previous page"
        data-slot="pagination-link"
        className={cn("ps-1.5!", className)}
      >
        <ChevronLeftIcon data-icon="inline-start" className="rtl:rotate-180" />
        <ark.span className="hidden sm:block">{text}</ark.span>
      </Button>
    </PaginationPrimitive.PrevTrigger>
  )
}

function PaginationNext({
  className,
  text = "Next",
  ...props
}: Omit<
  React.ComponentProps<typeof PaginationPrimitive.NextTrigger>,
  "children"
> & {
  text?: string
}) {
  return (
    <PaginationPrimitive.NextTrigger asChild {...props}>
      <Button
        variant="ghost"
        size="default"
        aria-label="Go to next page"
        data-slot="pagination-link"
        className={cn("pe-1.5!", className)}
      >
        <ark.span className="hidden sm:block">{text}</ark.span>
        <ChevronRightIcon data-icon="inline-end" className="rtl:rotate-180" />
      </Button>
    </PaginationPrimitive.NextTrigger>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<typeof PaginationPrimitive.Ellipsis>) {
  return (
    <PaginationPrimitive.Ellipsis
      data-slot="pagination-ellipsis"
      className={cn(
        "flex size-8 items-center justify-center [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <MoreHorizontalIcon />
      <ark.span className="sr-only">More pages</ark.span>
    </PaginationPrimitive.Ellipsis>
  )
}

function PaginationFirst({
  className,
  text = "First",
  ...props
}: Omit<
  React.ComponentProps<typeof PaginationPrimitive.FirstTrigger>,
  "children"
> & {
  text?: string
}) {
  return (
    <PaginationPrimitive.FirstTrigger asChild {...props}>
      <Button
        variant="ghost"
        size="default"
        aria-label="Go to first page"
        data-slot="pagination-link"
        className={cn(className)}
      >
        <ChevronsLeftIcon data-icon="inline-start" className="rtl:rotate-180" />
        <ark.span className="hidden sm:block">{text}</ark.span>
      </Button>
    </PaginationPrimitive.FirstTrigger>
  )
}

function PaginationLast({
  className,
  text = "Last",
  ...props
}: Omit<
  React.ComponentProps<typeof PaginationPrimitive.LastTrigger>,
  "children"
> & {
  text?: string
}) {
  return (
    <PaginationPrimitive.LastTrigger asChild {...props}>
      <Button
        variant="ghost"
        size="default"
        aria-label="Go to last page"
        data-slot="pagination-link"
        className={cn(className)}
      >
        <ark.span className="hidden sm:block">{text}</ark.span>
        <ChevronsRightIcon data-icon="inline-end" className="rtl:rotate-180" />
      </Button>
    </PaginationPrimitive.LastTrigger>
  )
}

// --- Context & RootProvider re-exports ---

const PaginationContext = PaginationPrimitive.Context
const PaginationRootProvider = PaginationPrimitive.RootProvider

export {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationNext,
  PaginationPrevious,
  PaginationContext,
  PaginationRootProvider,
}

export { usePagination, usePaginationContext } from "@ark-ui/react/pagination"
