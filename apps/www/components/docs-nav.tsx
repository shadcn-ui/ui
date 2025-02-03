"use client"

import * as React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SidebarNavItem } from "types/nav"

import { type DocsConfig } from "@/config/docs"
import { cn } from "@/lib/utils"

export function DocsNav({ config }: { config: DocsConfig }) {
  const pathname = usePathname()

  const items = config.sidebarNav

  return items.length ? (
    <div className="flex flex-col gap-6">
      {items.map((item, index) => (
        <div key={index} className="flex flex-col gap-1">
          <h4 className="px-2 py-1 text-sm font-semibold rounded-md">
            {item.title}{" "}
            {item.label && (
              <span className="ml-2 rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs font-normal leading-none text-[#000000] no-underline group-hover:no-underline">
                {item.label}
              </span>
            )}
          </h4>
          {item?.items?.length && (
            <DocsNavItems items={item.items} pathname={pathname} />
          )}
        </div>
      ))}
    </div>
  ) : null
}

function DocsNavItems({
  items,
  pathname,
}: {
  items: SidebarNavItem[]
  pathname: string | null
}) {
  return items?.length ? (
    <div className="grid grid-flow-row auto-rows-max gap-0.5 text-sm">
      {items.map((item, index) =>
        item.href && !item.disabled ? (
          <DocNavItem key={index} item={item} pathname={pathname} />
        ) : (
          <span
            key={index}
            className={cn(
              "flex w-full cursor-not-allowed items-center rounded-md p-2 text-muted-foreground hover:underline",
              item.disabled && "cursor-not-allowed opacity-60"
            )}
          >
            {item.title}
            {item.label && (
              <span className="ml-2 rounded-md bg-muted px-1.5 py-0.5 text-xs leading-none text-muted-foreground no-underline group-hover:no-underline">
                {item.label}
              </span>
            )}
          </span>
        )
      )}
    </div>
  ) : null
}

function DocNavItem({
  item,
  pathname,
}: {
  item: SidebarNavItem
  pathname: string | null
}) {
  const navItemRef = React.useRef<HTMLAnchorElement>(null)

  React.useLayoutEffect(() => {
    const sidebarContainer = navItemRef.current?.closest(".no-scrollbar")
    if (pathname === item.href && navItemRef.current && sidebarContainer) {
      const itemRect = navItemRef.current.getBoundingClientRect()
      const containerRect = sidebarContainer.getBoundingClientRect()

      if (itemRect.bottom > containerRect.bottom) {
        sidebarContainer.scrollTo({
          top:
            navItemRef.current.offsetTop - sidebarContainer?.clientHeight / 2,
          behavior: "smooth",
        })
      }
    }
  }, [])

  if (!item.href) return null
  return (
    <Link
      ref={navItemRef}
      href={item.href}
      className={cn(
        "group flex h-8 w-full items-center rounded-lg px-2 font-normal text-foreground underline-offset-2 hover:bg-accent hover:text-accent-foreground",
        item.disabled && "cursor-not-allowed opacity-60",
        pathname === item.href && "bg-accent font-medium text-accent-foreground"
      )}
      target={item.external ? "_blank" : ""}
      rel={item.external ? "noreferrer" : ""}
    >
      {item.title}
      {item.label && (
        <span className="ml-2 rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs leading-none text-[#000000] no-underline group-hover:no-underline">
          {item.label}
        </span>
      )}
    </Link>
  )
}
