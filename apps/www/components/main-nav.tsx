"use client"

import * as React from "react"
import Link from "next/link"
import { useSelectedLayoutSegment } from "next/navigation"
import { MainNavItem } from "types/nav"

import { docsConfig } from "@/config/docs"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"

interface MainNavProps {
  items?: MainNavItem[]
  children?: React.ReactNode
}

export function MainNav({ items, children }: MainNavProps) {
  const segment = useSelectedLayoutSegment()

  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="hidden items-center space-x-2 md:flex">
        <Icons.logo className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      {items?.length ? (
        <nav className="hidden gap-6 md:flex">
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center text-lg font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-100 sm:text-sm",
                    item.href.startsWith(`/${segment}`) && "text-slate-900",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  {item.title}
                </Link>
              )
          )}
        </nav>
      ) : null}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="-ml-4 text-base hover:bg-transparent focus:ring-0 md:hidden"
          >
            <Icons.logo className="mr-2 h-4 w-4" />{" "}
            <span className="font-bold">Menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          sideOffset={24}
          className="w-[300px] overflow-scroll"
        >
          <DropdownMenuLabel>
            <Link href="/" className="flex items-center">
              <Icons.logo className="mr-2 h-4 w-4" /> {siteConfig.name}
            </Link>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <ScrollArea className="h-[400px]">
            {items?.map(
              (item, index) =>
                item.href && (
                  <DropdownMenuItem key={index} asChild>
                    <Link href={item.href}>{item.title}</Link>
                  </DropdownMenuItem>
                )
            )}
            {docsConfig.sidebarNav.map((item, index) => (
              <DropdownMenuGroup key={index}>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>{item.title}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {item?.items?.length &&
                  item.items.map((item) => (
                    <DropdownMenuItem key={item.title} asChild>
                      {item.href ? (
                        <Link href={item.href}>{item.title}</Link>
                      ) : (
                        item.title
                      )}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuGroup>
            ))}
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
