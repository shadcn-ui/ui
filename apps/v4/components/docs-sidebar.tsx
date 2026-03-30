"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { PAGES_NEW } from "@/lib/docs"
import { showMcpDocs } from "@/lib/flags"
import { getCurrentBase, getPagesFromFolder } from "@/lib/page-tree"
import type { source } from "@/lib/source"
import { cn } from "@/lib/utils"
import { useFramework } from "@/hooks/use-framework"
import { getDefaultBaseForFramework, isReactBase } from "@/registry/frameworks"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/registry/new-york-v4/ui/sidebar"

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
const EXCLUDED_SECTIONS = ["installation", "dark-mode", "changelog", "rtl"]
const EXCLUDED_PAGES = ["/docs", "/docs/changelog", "/docs/rtl", "/docs/new"]

export function DocsSidebar({
  tree,
  ...props
}: React.ComponentProps<typeof Sidebar> & { tree: typeof source.pageTree }) {
  const pathname = usePathname()
  const { framework } = useFramework()
  const isOnComponentPage =
    /\/docs\/components\/(radix|base|vue|svelte)\//.test(pathname)
  const currentBase = isOnComponentPage
    ? getCurrentBase(pathname)
    : getDefaultBaseForFramework(framework)

  return (
    <Sidebar
      className="sticky top-[calc(var(--header-height)+0.6rem)] z-30 hidden h-[calc(100svh-10rem)] overscroll-none bg-transparent [--sidebar-menu-width:--spacing(56)] lg:flex"
      collapsible="none"
      {...props}
    >
      <div className="h-9" />
      <div className="absolute top-8 z-10 h-8 w-(--sidebar-menu-width) shrink-0 bg-linear-to-b from-background via-background/80 to-background/50 blur-xs" />
      <div className="absolute top-12 right-2 bottom-0 hidden h-full w-px bg-linear-to-b from-transparent via-border to-transparent lg:flex" />
      <SidebarContent className="mx-auto no-scrollbar w-(--sidebar-menu-width) overflow-x-hidden px-2">
        <SidebarGroup className="pt-6">
          <SidebarGroupLabel className="font-medium text-muted-foreground">
            Sections
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {TOP_LEVEL_SECTIONS.map(({ name, href }) => {
                if (!showMcpDocs && href.includes("/mcp")) {
                  return null
                }
                return (
                  <SidebarMenuItem key={name}>
                    <SidebarMenuButton
                      asChild
                      isActive={
                        href === "/docs"
                          ? pathname === href
                          : pathname.startsWith(href)
                      }
                      className="relative h-[30px] w-fit overflow-visible border border-transparent text-[0.8rem] font-medium after:absolute after:inset-x-0 after:-inset-y-1 after:z-0 after:rounded-md data-[active=true]:border-accent data-[active=true]:bg-accent 3xl:fixed:w-full 3xl:fixed:max-w-48"
                    >
                      <Link href={href}>
                        <span className="absolute inset-0 flex w-(--sidebar-menu-width) bg-transparent" />
                        {name}
                        {PAGES_NEW.includes(href) && (
                          <span
                            className="flex size-2 rounded-full bg-blue-500"
                            title="New"
                          />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {tree.children.map((item) => {
          if (EXCLUDED_SECTIONS.includes(item.$id ?? "")) {
            return null
          }

          const isComponentsSection =
            item.$id === "components" || item.name === "Components"

          return (
            <SidebarGroup key={item.$id}>
              <SidebarGroupLabel className="font-medium text-muted-foreground">
                {item.name}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                {item.type === "folder" && (
                  <SidebarMenu className="gap-0.5">
                    {(() => {
                      // For the components section, show all components (canonical from radix)
                      // and mark unavailable ones for the current framework.
                      const canonicalPages =
                        isComponentsSection && !isReactBase(currentBase)
                          ? getPagesFromFolder(item, "radix")
                          : getPagesFromFolder(item, currentBase)

                      const availablePages = isComponentsSection
                        ? getPagesFromFolder(item, currentBase)
                        : canonicalPages
                      const availableNames = new Set(
                        availablePages.map((p) => p.name)
                      )
                      const availableUrlMap = new Map(
                        availablePages.map((p) => [p.name, p.url])
                      )

                      return canonicalPages.map((page) => {
                        if (!showMcpDocs && page.url.includes("/mcp")) {
                          return null
                        }

                        if (EXCLUDED_PAGES.includes(page.url)) {
                          return null
                        }

                        const isAvailable = availableNames.has(page.name)
                        const href = availableUrlMap.get(page.name) ?? page.url

                        if (!isAvailable) {
                          return (
                            <SidebarMenuItem key={page.url}>
                              <SidebarMenuButton
                                disabled
                                className="relative h-[30px] w-fit overflow-visible text-[0.8rem] font-medium opacity-40"
                              >
                                {page.name}
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          )
                        }

                        return (
                          <SidebarMenuItem key={page.url}>
                            <SidebarMenuButton
                              asChild
                              isActive={href === pathname}
                              className="relative h-[30px] w-fit overflow-visible border border-transparent text-[0.8rem] font-medium after:absolute after:inset-x-0 after:-inset-y-1 after:z-0 after:rounded-md data-[active=true]:border-accent data-[active=true]:bg-accent 3xl:fixed:w-full 3xl:fixed:max-w-48"
                            >
                              <Link href={href}>
                                <span className="absolute inset-0 flex w-(--sidebar-menu-width) bg-transparent" />
                                {page.name}
                                {PAGES_NEW.includes(page.url) && (
                                  <span
                                    className="flex size-2 rounded-full bg-blue-500"
                                    title="New"
                                  />
                                )}
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        )
                      })
                    })()}
                  </SidebarMenu>
                )}
              </SidebarGroupContent>
            </SidebarGroup>
          )
        })}
        <div className="sticky -bottom-1 z-10 h-16 shrink-0 bg-linear-to-t from-background via-background/80 to-background/50 blur-xs" />
      </SidebarContent>
    </Sidebar>
  )
}
