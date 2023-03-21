import Link from "next/link"

import { siteConfig } from "@/config/site"
import { Icons } from "@/components/icons"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb"

export function BreadcrumbWithRoutingLibrary() {
  return (
    <Breadcrumb>
      <BreadcrumbItem>
        <BreadcrumbLink as={Link} className="flex items-center gap-2" href="/">
          <Icons.logo className="h-4 w-4" />
          <span className="inline-block font-bold">{siteConfig.name}</span>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink as={Link} href="/docs/primitives/accordion">
          Components
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem isCurrentPage>
        <BreadcrumbLink as={Link} href="/docs/primitives/breadcrumb">
          Breadcrumb
        </BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  )
}
