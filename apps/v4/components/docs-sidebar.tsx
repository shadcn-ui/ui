"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { showMcpDocs } from "@/lib/flags"
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
  { name: "Get Started", href: "/docs" },
  {
    name: "Components",
    href: "/docs/components",
  },
  {
    name: "Registry",
    href: "/docs/registry",
  },
  {
    name: "MCP Server",
    href: "/docs/mcp",
  },
]
const EXCLUDED_SECTIONS = ["installation", "dark-mode"]
const EXCLUDED_PAGES = ["/docs"]

export function DocsSidebar({
  tree,
  ...props
}: React.ComponentProps<typeof Sidebar> & { tree: typeof source.pageTree }) {
  const pathname = usePathname()

  return (
    <Sidebar
      className="sticky top-[calc(var(--header-height)+1px)] z-30 hidden h-[calc(100svh-var(--footer-height)+2rem)] bg-transparent lg:flex"
      collapsible="none"
      {...props}
    >
      <SidebarContent className="no-scrollbar overflow-x-hidden px-2 pb-12">
        <div className="h-(--top-spacing) shrink-0" />
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground font-medium">
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
                      className="data-[active=true]:bg-accent data-[active=true]:border-accent 3xl:fixed:w-full 3xl:fixed:max-w-48 relative h-[30px] w-fit overflow-visible border border-transparent text-[0.8rem] font-medium after:absolute after:inset-x-0 after:-inset-y-1 after:z-0 after:rounded-md"
                    >
                      <Link href={href}>
                        <span className="absolute inset-0 flex w-(--sidebar-width) bg-transparent" />
                        {name}
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
              <SidebarGroupLabel className="text-muted-foreground font-medium">
                {item.name}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                {item.type === "folder" && (
                  <SidebarMenu className="gap-0.5">
                    {item.children.map((item) => {
                      if (
                        !showMcpDocs &&
                        item.type === "page" &&
                        item.url?.includes("/mcp")
                      ) {
                        return null
                      }

                      return (
                        item.type === "page" &&
                        !EXCLUDED_PAGES.includes(item.url) && (
                          <SidebarMenuItem key={item.url}>
                            <SidebarMenuButton
                              asChild
                              isActive={item.url === pathname}
                              className="data-[active=true]:bg-accent data-[active=true]:border-accent 3xl:fixed:w-full 3xl:fixed:max-w-48 relative h-[30px] w-fit overflow-visible border border-transparent text-[0.8rem] font-medium after:absolute after:inset-x-0 after:-inset-y-1 after:z-0 after:rounded-md"
                            >
                              <Link href={item.url}>
                                <span className="absolute inset-0 flex w-(--sidebar-width) bg-transparent" />
                                {item.name}
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        )
                      )
                    })}
                  </SidebarMenu>
                )}
              </SidebarGroupContent>
            </SidebarGroup>
          )
        })}
      </SidebarContent>
    </Sidebar>
  )
}
