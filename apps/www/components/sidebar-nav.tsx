"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SidebarNavItem } from "types/nav"

import { type DocsConfig } from "@/config/docs"
import { cn } from "@/lib/utils"

export interface DocsSidebarNavProps {
  config: DocsConfig
}

export function DocsSidebarNav({ config }: DocsSidebarNavProps) {
  const pathname = usePathname()

  const items = pathname?.startsWith("/charts")
    ? config.chartsNav
    : config.sidebarNav

  return items.length ? (
    <div className="w-full">
      {items.map((item, index) => (
        <div key={index} className={cn("pb-4")}>
          <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">
            {item.title}
          </h4>
          {item?.items?.length && (
            <DocsSidebarNavItems items={item.items} pathname={pathname} />
          )}
        </div>
      ))}
    </div>
  ) : null
}

interface DocsSidebarNavItemsProps {
  items: SidebarNavItem[]
  pathname: string | null
}

export function DocsSidebarNavItems({
  items,
  pathname,
}: DocsSidebarNavItemsProps) {
  return items?.length ? (
    <div className="grid grid-flow-row auto-rows-max gap-0.5 text-sm">
      {items.map((item, index) =>
        item.href && !item.disabled ? (
          <Link
            key={index}
            href={item.href}
            className="group flex w-full items-center px-2 py-1 font-normal text-foreground"
            target={item.external ? "_blank" : ""}
            rel={item.external ? "noreferrer" : ""}
          >
            <span
              className={cn(
                "underline-offset-2 group-hover:underline",
                pathname === item.href && "underline"
              )}
            >
              {item.title}
            </span>
            {item.label && (
              <span className="ml-2 rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs leading-none text-[#000000]">
                {item.label}
              </span>
            )}
          </Link>
        ) : (
          <span
            key={index}
            className="flex w-full cursor-not-allowed items-center rounded-md p-2 text-muted-foreground opacity-60"
          >
            {item.title}
            {item.label && (
              <span className="ml-2 rounded-md bg-muted px-1.5 py-0.5 text-xs leading-none text-muted-foreground">
                {item.label}
              </span>
            )}
          </span>
        )
      )}
    </div>
  ) : null
}
