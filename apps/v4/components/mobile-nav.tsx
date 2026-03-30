"use client"

import * as React from "react"
import Link, { type LinkProps } from "next/link"
import { usePathname, useRouter } from "next/navigation"

import { PAGES_NEW } from "@/lib/docs"
import { showMcpDocs } from "@/lib/flags"
import { getCurrentBase, getPagesFromFolder } from "@/lib/page-tree"
import { type source } from "@/lib/source"
import { cn } from "@/lib/utils"
import { useFramework } from "@/hooks/use-framework"
import { getDefaultBaseForFramework, isReactBase } from "@/registry/frameworks"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york-v4/ui/popover"

const TOP_LEVEL_SECTIONS = [
  { name: "Introduction", href: "/docs" },
  {
    name: "Components",
    href: "/docs/components",
  },
  {
    name: "Installation",
    href: "/docs/installation",
  },
  {
    name: "Theming",
    href: "/docs/theming",
  },
  {
    name: "CLI",
    href: "/docs/cli",
  },
  {
    name: "RTL",
    href: "/docs/rtl",
  },
  {
    name: "Skills",
    href: "/docs/skills",
  },
  {
    name: "MCP Server",
    href: "/docs/mcp",
  },
  {
    name: "Registry",
    href: "/docs/registry",
  },
  {
    name: "Forms",
    href: "/docs/forms",
  },
  {
    name: "Changelog",
    href: "/docs/changelog",
  },
]

export function MobileNav({
  tree,
  items,
  className,
}: {
  tree: typeof source.pageTree
  items: { href: string; label: string }[]
  className?: string
}) {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()
  const { framework } = useFramework()
  const isOnComponentPage =
    /\/docs\/components\/(radix|base|vue|svelte)\//.test(pathname)
  const currentBase = isOnComponentPage
    ? getCurrentBase(pathname)
    : getDefaultBaseForFramework(framework)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "extend-touch-target h-8 touch-manipulation items-center justify-start gap-2.5 p-0! hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 active:bg-transparent dark:hover:bg-transparent",
            className
          )}
        >
          <div className="relative flex h-8 w-4 items-center justify-center">
            <div className="relative size-4">
              <span
                className={cn(
                  "absolute left-0 block h-0.5 w-4 bg-foreground transition-all duration-100",
                  open ? "top-[0.4rem] -rotate-45" : "top-1"
                )}
              />
              <span
                className={cn(
                  "absolute left-0 block h-0.5 w-4 bg-foreground transition-all duration-100",
                  open ? "top-[0.4rem] rotate-45" : "top-2.5"
                )}
              />
            </div>
            <span className="sr-only">Toggle Menu</span>
          </div>
          <span className="flex h-8 items-center text-lg leading-none font-medium">
            Menu
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="no-scrollbar h-(--radix-popper-available-height) w-(--radix-popper-available-width) overflow-y-auto rounded-none border-none bg-background/90 p-0 shadow-none backdrop-blur duration-100 data-open:animate-none!"
        align="start"
        side="bottom"
        alignOffset={-16}
        sideOffset={14}
      >
        <div className="flex flex-col gap-12 overflow-auto px-6 py-6">
          <div className="flex flex-col gap-4">
            <div className="text-sm font-medium text-muted-foreground">
              Menu
            </div>
            <div className="flex flex-col gap-3">
              <MobileLink href="/" onOpenChange={setOpen}>
                Home
              </MobileLink>
              {items.map((item, index) => (
                <MobileLink key={index} href={item.href} onOpenChange={setOpen}>
                  {item.label}
                </MobileLink>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="text-sm font-medium text-muted-foreground">
              Sections
            </div>
            <div className="flex flex-col gap-3">
              {TOP_LEVEL_SECTIONS.map(({ name, href }) => {
                if (!showMcpDocs && href.includes("/mcp")) {
                  return null
                }
                return (
                  <MobileLink key={name} href={href} onOpenChange={setOpen}>
                    {name}
                    {PAGES_NEW.includes(href) && (
                      <span
                        className="flex size-2 rounded-full bg-blue-500"
                        title="New"
                      />
                    )}
                  </MobileLink>
                )
              })}
            </div>
          </div>
          <div className="flex flex-col gap-8">
            {tree?.children?.map((group, index) => {
              if (group.type === "folder") {
                const isComponentsSection =
                  group.$id === "components" || group.name === "Components"

                // For components: show canonical list, mark unavailable.
                const canonicalPages =
                  isComponentsSection && !isReactBase(currentBase)
                    ? getPagesFromFolder(group, "radix")
                    : getPagesFromFolder(group, currentBase)

                const availablePages = isComponentsSection
                  ? getPagesFromFolder(group, currentBase)
                  : canonicalPages
                const availableNames = new Set(
                  availablePages.map((p) => p.name)
                )
                const availableUrlMap = new Map(
                  availablePages.map((p) => [p.name, p.url])
                )

                return (
                  <div key={index} className="flex flex-col gap-4">
                    <div className="text-sm font-medium text-muted-foreground">
                      {group.name}
                    </div>
                    <div className="flex flex-col gap-3">
                      {canonicalPages.map((item) => {
                        if (!showMcpDocs && item.url.includes("/mcp")) {
                          return null
                        }

                        const isAvailable = availableNames.has(item.name)
                        const href = availableUrlMap.get(item.name) ?? item.url

                        if (!isAvailable) {
                          return (
                            <span
                              key={`${item.url}-${index}`}
                              className="flex items-center gap-2 text-2xl font-medium text-muted-foreground/40"
                            >
                              {item.name}
                            </span>
                          )
                        }

                        return (
                          <MobileLink
                            key={`${item.url}-${index}`}
                            href={href}
                            onOpenChange={setOpen}
                            className="flex items-center gap-2"
                          >
                            {item.name}{" "}
                            {PAGES_NEW.includes(item.url) && (
                              <span className="flex size-2 rounded-full bg-blue-500" />
                            )}
                          </MobileLink>
                        )
                      })}
                    </div>
                  </div>
                )
              }
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: LinkProps & {
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}) {
  const router = useRouter()
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString())
        onOpenChange?.(false)
      }}
      className={cn("flex items-center gap-2 text-2xl font-medium", className)}
      {...props}
    >
      {children}
    </Link>
  )
}
