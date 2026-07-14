"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { PAGES_NEW } from "@/lib/docs"
import { showMcpDocs } from "@/lib/flags"
import { getCurrentBase, getPagesFromFolder } from "@/lib/page-tree"
import type { source } from "@/lib/source"
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
    name: "Typeset",
    href: "/docs/typeset",
  },
  {
    name: "Skills",
    href: "/docs/skills",
  },
  {
    name: "Registry",
    href: "/docs/registry",
  },
  {
    name: "Changelog",
    href: "/docs/changelog",
  },
]
const EXCLUDED_SECTIONS = ["installation", "dark-mode", "changelog", "rtl"]
const EXCLUDED_PAGES = ["/docs", "/docs/changelog", "/docs/rtl", "/docs/new"]

const SCROLL_STORAGE_KEY = "docs-sidebar-scroll"

// Runs before first paint on hard loads. A refresh restores the exact
// position; arriving from another page brings the active item into view.
const SCROLL_RESTORE_SCRIPT = `(function () {
  try {
    var container = document.currentScript.previousElementSibling
    if (!container || !container.clientHeight) return
    try {
      var stored = JSON.parse(sessionStorage.getItem("${SCROLL_STORAGE_KEY}"))
      if (stored && stored.pathname === location.pathname) {
        container.scrollTop = stored.scrollTop
        return
      }
    } catch (e) {}
    var items = container.querySelectorAll('[data-active="true"]')
    var active = null
    var activePathLength = -1
    var activeDistance = Infinity
    var containerCenter = container.getBoundingClientRect().top + container.clientHeight / 2
    for (var i = 0; i < items.length; i++) {
      var link = items[i].querySelector('a[href]')
      var href = items[i].getAttribute('href') || (link && link.getAttribute('href'))
      var pathLength = href ? href.length : 0
      var itemRect = items[i].getBoundingClientRect()
      var distance = Math.abs(itemRect.top + itemRect.height / 2 - containerCenter)
      if (pathLength > activePathLength || (pathLength === activePathLength && distance < activeDistance)) {
        active = items[i]
        activePathLength = pathLength
        activeDistance = distance
      }
    }
    if (!active) return
    var containerRect = container.getBoundingClientRect()
    var activeRect = active.getBoundingClientRect()
    if (activeRect.top >= containerRect.top && activeRect.bottom <= containerRect.bottom) return
    container.scrollTop += activeRect.top - containerRect.top - (container.clientHeight - activeRect.height) / 2
  } catch (e) {}
})()`

function readScrollState() {
  try {
    return JSON.parse(sessionStorage.getItem(SCROLL_STORAGE_KEY) ?? "") as {
      pathname: string
      scrollTop: number
    }
  } catch {
    return null
  }
}

function saveScrollState(container: HTMLElement) {
  try {
    sessionStorage.setItem(
      SCROLL_STORAGE_KEY,
      JSON.stringify({
        pathname: location.pathname,
        scrollTop: container.scrollTop,
      })
    )
  } catch {}
}

function getActiveItem(container: HTMLElement) {
  const items = container.querySelectorAll<HTMLElement>('[data-active="true"]')
  let active: HTMLElement | null = null
  let activePathLength = -1
  let activeDistance = Infinity
  const containerRect = container.getBoundingClientRect()
  const containerCenter = containerRect.top + container.clientHeight / 2

  for (const item of items) {
    const link = item.querySelector<HTMLAnchorElement>("a[href]")
    const href = item.getAttribute("href") ?? link?.getAttribute("href")
    const pathLength = href?.length ?? 0
    const itemRect = item.getBoundingClientRect()
    const distance = Math.abs(
      itemRect.top + itemRect.height / 2 - containerCenter
    )

    if (
      pathLength > activePathLength ||
      (pathLength === activePathLength && distance < activeDistance)
    ) {
      active = item
      activePathLength = pathLength
      activeDistance = distance
    }
  }

  return active
}

export function DocsSidebar({
  tree,
  ...props
}: React.ComponentProps<typeof Sidebar> & { tree: typeof source.pageTree }) {
  const pathname = usePathname()
  const currentBase = getCurrentBase(pathname)
  const contentRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const container = contentRef.current

    if (!container) {
      return
    }

    // A refresh restores the exact position (the inline script already did).
    // Only bring the active item into view when arriving from another page.
    if (readScrollState()?.pathname !== pathname) {
      // Prefer the longest route because section links also match by prefix.
      // Equal routes keep the item closest to the current viewport.
      const active = getActiveItem(container)

      if (active) {
        const containerRect = container.getBoundingClientRect()
        const activeRect = active.getBoundingClientRect()

        if (
          activeRect.top < containerRect.top ||
          activeRect.bottom > containerRect.bottom
        ) {
          container.scrollTo({
            top:
              container.scrollTop +
              (activeRect.top - containerRect.top) -
              (container.clientHeight - activeRect.height) / 2,
          })
        }
      }
    }

    saveScrollState(container)
  }, [pathname])

  React.useEffect(() => {
    const container = contentRef.current

    if (!container) {
      return
    }

    const onScroll = () => saveScrollState(container)
    container.addEventListener("scroll", onScroll, { passive: true })
    return () => container.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <Sidebar
      className="sticky top-[calc(var(--header-height)+0.6rem)] z-30 hidden h-[calc(100svh-10rem)] overflow-hidden overscroll-none bg-transparent [--sidebar-menu-width:--spacing(56)] lg:flex"
      collapsible="none"
      {...props}
    >
      <div className="absolute top-12 right-2 bottom-0 hidden h-full w-px bg-[linear-gradient(to_bottom,transparent_0%,var(--border)_10%,var(--border)_90%,transparent_100%)] lg:flex" />
      <SidebarContent
        ref={contentRef}
        className="w-(--sidebar-menu-width) scroll-fade scrollbar-none overflow-x-hidden pl-2.5"
      >
        <SidebarGroup className="pt-12">
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

          return (
            <SidebarGroup key={item.$id}>
              <SidebarGroupLabel className="font-medium text-muted-foreground">
                {item.name}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                {item.type === "folder" && (
                  <SidebarMenu className="gap-0.5">
                    {getPagesFromFolder(item, currentBase).map((page) => {
                      if (!showMcpDocs && page.url.includes("/mcp")) {
                        return null
                      }

                      if (EXCLUDED_PAGES.includes(page.url)) {
                        return null
                      }

                      return (
                        <SidebarMenuItem key={page.url}>
                          <SidebarMenuButton
                            asChild
                            isActive={page.url === pathname}
                            className="relative h-[30px] w-fit overflow-visible border border-transparent text-[0.8rem] font-medium after:absolute after:inset-x-0 after:-inset-y-1 after:z-0 after:rounded-md data-[active=true]:border-accent data-[active=true]:bg-accent 3xl:fixed:w-full 3xl:fixed:max-w-48"
                          >
                            <Link href={page.url}>
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
                    })}
                  </SidebarMenu>
                )}
              </SidebarGroupContent>
            </SidebarGroup>
          )
        })}
      </SidebarContent>
      <script dangerouslySetInnerHTML={{ __html: SCROLL_RESTORE_SCRIPT }} />
    </Sidebar>
  )
}
