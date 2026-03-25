"use client"

import * as React from "react"
import { ark } from "@ark-ui/react/factory"
import { Pagination as PaginationPrimitive } from "@ark-ui/react/pagination"

import { cn } from "@/registry/bases/ark/lib/utils"
import { Button } from "@/registry/bases/ark/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

function Pagination({
  className,
  ...props
}: React.ComponentProps<typeof PaginationPrimitive.Root>) {
  return (
    <PaginationPrimitive.Root
      data-slot="pagination"
      className={cn(
        "cn-pagination mx-auto flex w-full justify-center",
        className
      )}
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
          className={cn(
            "cn-pagination-content flex items-center",
            className
          )}
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
      className={cn("cn-pagination-link", className)}
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
}: Omit<React.ComponentProps<typeof PaginationPrimitive.PrevTrigger>, "children"> & {
  text?: string
}) {
  return (
    <PaginationPrimitive.PrevTrigger asChild {...props}>
      <Button
        variant="ghost"
        size="default"
        aria-label="Go to previous page"
        data-slot="pagination-link"
        className={cn("cn-pagination-previous", className)}
      >
        <IconPlaceholder
          lucide="ChevronLeftIcon"
          tabler="IconChevronLeft"
          hugeicons="ArrowLeft01Icon"
          phosphor="CaretLeftIcon"
          remixicon="RiArrowLeftSLine"
          data-icon="inline-start"
          className="cn-rtl-flip"
        />
        <ark.span className="cn-pagination-previous-text hidden sm:block">
          {text}
        </ark.span>
      </Button>
    </PaginationPrimitive.PrevTrigger>
  )
}

function PaginationNext({
  className,
  text = "Next",
  ...props
}: Omit<React.ComponentProps<typeof PaginationPrimitive.NextTrigger>, "children"> & {
  text?: string
}) {
  return (
    <PaginationPrimitive.NextTrigger asChild {...props}>
      <Button
        variant="ghost"
        size="default"
        aria-label="Go to next page"
        data-slot="pagination-link"
        className={cn("cn-pagination-next", className)}
      >
        <ark.span className="cn-pagination-next-text hidden sm:block">
          {text}
        </ark.span>
        <IconPlaceholder
          lucide="ChevronRightIcon"
          tabler="IconChevronRight"
          hugeicons="ArrowRight01Icon"
          phosphor="CaretRightIcon"
          remixicon="RiArrowRightSLine"
          data-icon="inline-end"
          className="cn-rtl-flip"
        />
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
        "cn-pagination-ellipsis flex items-center justify-center",
        className
      )}
      {...props}
    >
      <IconPlaceholder
        lucide="MoreHorizontalIcon"
        tabler="IconDots"
        hugeicons="MoreHorizontalCircle01Icon"
        phosphor="DotsThreeIcon"
        remixicon="RiMoreLine"
      />
      <ark.span className="sr-only">More pages</ark.span>
    </PaginationPrimitive.Ellipsis>
  )
}

function PaginationFirst({
  className,
  text = "First",
  ...props
}: Omit<React.ComponentProps<typeof PaginationPrimitive.FirstTrigger>, "children"> & {
  text?: string
}) {
  return (
    <PaginationPrimitive.FirstTrigger asChild {...props}>
      <Button
        variant="ghost"
        size="default"
        aria-label="Go to first page"
        data-slot="pagination-link"
        className={cn("cn-pagination-first", className)}
      >
        <IconPlaceholder
          lucide="ChevronsLeftIcon"
          tabler="IconChevronsLeft"
          hugeicons="ArrowLeftDoubleIcon"
          phosphor="CaretDoubleLeftIcon"
          remixicon="RiArrowLeftDoubleLine"
          data-icon="inline-start"
          className="cn-rtl-flip"
        />
        <ark.span className="cn-pagination-first-text hidden sm:block">
          {text}
        </ark.span>
      </Button>
    </PaginationPrimitive.FirstTrigger>
  )
}

function PaginationLast({
  className,
  text = "Last",
  ...props
}: Omit<React.ComponentProps<typeof PaginationPrimitive.LastTrigger>, "children"> & {
  text?: string
}) {
  return (
    <PaginationPrimitive.LastTrigger asChild {...props}>
      <Button
        variant="ghost"
        size="default"
        aria-label="Go to last page"
        data-slot="pagination-link"
        className={cn("cn-pagination-last", className)}
      >
        <ark.span className="cn-pagination-last-text hidden sm:block">
          {text}
        </ark.span>
        <IconPlaceholder
          lucide="ChevronsRightIcon"
          tabler="IconChevronsRight"
          hugeicons="ArrowRightDoubleIcon"
          phosphor="CaretDoubleRightIcon"
          remixicon="RiArrowRightDoubleLine"
          data-icon="inline-end"
          className="cn-rtl-flip"
        />
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
