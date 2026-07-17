"use client"

import Link from "next/link"

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/styles/aria-nova/ui/breadcrumb"

export function BreadcrumbEllipsisDemo() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            href="/"
            render={(props) =>
              "href" in props ? <Link {...props} /> : <span {...props} />
            }
          >
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbLink
            href="/docs/components"
            render={(props) =>
              "href" in props ? <Link {...props} /> : <span {...props} />
            }
          >
            Components
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
