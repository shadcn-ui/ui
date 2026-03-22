"use client"

import * as React from "react"
import { ark } from "@ark-ui/react/factory"
import { Pagination as PaginationPrimitive } from "@ark-ui/react/pagination"

import { cn } from "@/registry/ark-mira/lib/utils"
import { Button } from "@/registry/ark-mira/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

function Pagination({
  className,
  ...props
}: React.ComponentProps<typeof PaginationPrimitive.Root>) {
  return (
    <PaginationPrimitive.Root
      data-slot="pagination"
      className={cn(
        "mx-auto flex w-full justify-center",
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
            "gap-0.5 flex items-center",
            className
          )}
          {...props}
        />
      )}
    </PaginationPrimitive.Context>
  )
}

function PaginationItem({ ...props }: React.ComponentProps<typeof ark.li>) {
  return <ark.li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<typeof PaginationPrimitive.Item>

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <PaginationPrimitive.Item
      asChild
      {...props}
    >
      <Button
        variant={isActive ? "outline" : "ghost"}
        size={size}
        aria-current={isActive ? "page" : undefined}
        data-slot="pagination-link"
        data-active={isActive}
        className={cn(className)}
      />
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
        className={cn("pl-2!", className)}
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
        <ark.span className="hidden sm:block">
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
        className={cn("pr-2!", className)}
      >
        <ark.span className="hidden sm:block">
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
        "size-7 [&_svg:not([class*='size-'])]:size-3.5 flex items-center justify-center",
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
        className={cn(className)}
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
        <ark.span className="hidden sm:block">
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
        className={cn(className)}
      >
        <ark.span className="hidden sm:block">
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
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationContext,
  PaginationRootProvider,
}

export { usePagination, usePaginationContext } from "@ark-ui/react/pagination"
