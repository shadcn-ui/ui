"use client"

import * as React from "react"
import { Pagination as PaginationPrimitive } from "@ark-ui/react/pagination"

import { cn } from "@/examples/ark/lib/utils"
import { Button } from "@/examples/ark/ui-rtl/button"
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react"

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
}: React.ComponentProps<"ul">) {
  return (
    <PaginationPrimitive.Context>
      {() => (
        <ul
          data-slot="pagination-content"
          className={cn("flex items-center gap-0.5", className)}
          {...props}
        />
      )}
    </PaginationPrimitive.Context>
  )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
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
    <PaginationPrimitive.Item asChild {...props}>
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
        <span className="hidden sm:block">{text}</span>
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
        <span className="hidden sm:block">{text}</span>
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
      <MoreHorizontalIcon
      />
      <span className="sr-only">More pages</span>
    </PaginationPrimitive.Ellipsis>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
