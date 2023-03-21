"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb"

export function BreadcrumbWithCustomSeparator() {
  return (
    <Breadcrumb separator="/">
      <BreadcrumbItem>
        <BreadcrumbLink href="/">UI</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href="/components">Components</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem isCurrentPage>
        <BreadcrumbLink href="/components/breadcrumb">
          Breadcrumb
        </BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  )
}
