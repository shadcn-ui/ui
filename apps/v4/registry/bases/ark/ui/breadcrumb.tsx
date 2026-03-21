import * as React from "react"
import { ark } from "@ark-ui/react/factory"

import { cn } from "@/registry/bases/ark/lib/utils"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

function Breadcrumb({ className, ...props }: React.ComponentProps<typeof ark.nav>) {
  return (
    <ark.nav
      aria-label="breadcrumb"
      data-slot="breadcrumb"
      className={cn("cn-breadcrumb", className)}
      {...props}
    />
  )
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<typeof ark.ol>) {
  return (
    <ark.ol
      data-slot="breadcrumb-list"
      className={cn(
        "cn-breadcrumb-list flex flex-wrap items-center wrap-break-word",
        className
      )}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<typeof ark.li>) {
  return (
    <ark.li
      data-slot="breadcrumb-item"
      className={cn("cn-breadcrumb-item inline-flex items-center", className)}
      {...props}
    />
  )
}

function BreadcrumbLink({
  asChild,
  className,
  ...props
}: React.ComponentProps<typeof ark.a> & {
  asChild?: boolean
}) {
  const Comp = asChild ? ark.a : ark.a

  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn("cn-breadcrumb-link", className)}
      {...props}
    />
  )
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<typeof ark.span>) {
  return (
    <ark.span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("cn-breadcrumb-page", className)}
      {...props}
    />
  )
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<typeof ark.li>) {
  return (
    <ark.li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("cn-breadcrumb-separator", className)}
      {...props}
    >
      {children ?? (
        <IconPlaceholder
          lucide="ChevronRightIcon"
          tabler="IconChevronRight"
          hugeicons="ArrowRight01Icon"
          phosphor="CaretRightIcon"
          remixicon="RiArrowRightSLine"
          className="cn-rtl-flip"
        />
      )}
    </ark.li>
  )
}

function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<typeof ark.span>) {
  return (
    <ark.span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn(
        "cn-breadcrumb-ellipsis flex items-center justify-center",
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
      <ark.span className="sr-only">More</ark.span>
    </ark.span>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
