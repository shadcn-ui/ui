"use client"

import * as React from "react"
import { ChevronRightIcon, MoreHorizontalIcon } from "lucide-react"
import {
  Breadcrumb as BreadcrumbPrimitive,
  Breadcrumbs as BreadcrumbsPrimitive,
  composeRenderProps,
  Link as LinkPrimitive,
  type BreadcrumbProps,
  type BreadcrumbsProps,
  type LinkProps,
} from "react-aria-components"

import { cn } from "@/lib/utils"

function Breadcrumb({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      aria-label="breadcrumb"
      data-slot="breadcrumb"
      className={cn(className)}
      {...props}
    />
  )
}

function BreadcrumbList<T extends object>({
  className,
  ...props
}: BreadcrumbsProps<T>) {
  return (
    <BreadcrumbsPrimitive
      data-slot="breadcrumb-list"
      className={cn(
        "flex flex-wrap items-center gap-1.5 text-sm wrap-break-word text-muted-foreground sm:gap-2.5",
        className
      )}
      {...props}
    />
  )
}

function BreadcrumbItem({
  className,
  children,
  separatorClassName,
  ...props
}: BreadcrumbProps & { separatorClassName?: string }) {
  return (
    <BreadcrumbPrimitive
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    >
      {composeRenderProps(children, (children, { isCurrent }) => (
        <>
          {children}
          {!isCurrent && (
            <span
              data-slot="breadcrumb-separator"
              role="presentation"
              aria-hidden="true"
              className={cn("[&>svg]:size-3.5", separatorClassName)}
            >
              <ChevronRightIcon className="cn-rtl-flip" />
            </span>
          )}
        </>
      ))}
    </BreadcrumbPrimitive>
  )
}

function BreadcrumbLink({ className, render, ...props }: LinkProps) {
  return (
    <LinkPrimitive
      data-slot="breadcrumb-link"
      className={cn("transition-colors hover:text-foreground", className)}
      render={render}
      {...props}
    />
  )
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("font-normal text-foreground", className)}
      {...props}
    />
  )
}

function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn(
        "flex size-5 items-center justify-center [&>svg]:size-4",
        className
      )}
      {...props}
    >
      <MoreHorizontalIcon />
      <span className="sr-only">More</span>
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbEllipsis,
}
