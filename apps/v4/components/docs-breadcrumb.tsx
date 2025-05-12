"use client"

import { Fragment } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useBreadcrumb } from "fumadocs-core/breadcrumb"
import type { PageTree } from "fumadocs-core/server"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/registry/new-york-v4/ui/breadcrumb"

export function DocsBreadcrumb({
  tree,
  className,
}: {
  tree: PageTree.Root
  className?: string
}) {
  const pathname = usePathname()
  const items = useBreadcrumb(pathname, tree)

  if (items.length === 0) return null

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/docs" className="hover:text-accent-foreground">
              Docs
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {items.map((item, i) => (
          <Fragment key={i}>
            {i !== 0 && <BreadcrumbSeparator />}
            {item.url ? (
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href={item.url}
                    className="hover:text-accent-foreground truncate"
                  >
                    {item.name}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            ) : (
              <BreadcrumbItem>
                <BreadcrumbPage>{item.name}</BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
