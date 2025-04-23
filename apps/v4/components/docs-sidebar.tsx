"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import type { source } from "@/lib/docs"
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

export function DocsSidebar({
  tree,
  ...props
}: React.ComponentProps<typeof Sidebar> & { tree: typeof source.pageTree }) {
  const pathname = usePathname()

  return (
    <Sidebar
      className="border-border/40 sticky top-[calc((var(--spacing)*14)+1px)] z-30 hidden h-[calc(100svh-(var(--spacing)*14)+1px)] border-r lg:flex dark:bg-transparent"
      collapsible="none"
      {...props}
    >
      <SidebarContent className="no-scrollbar px-2 pb-12">
        {tree.children.map(
          (item: {
            $id: string
            name: string
            type: string
            children: { $id: string; name: string; type: string; url: string }[]
          }) => (
            <SidebarGroup key={item.$id}>
              <SidebarGroupLabel className="text-muted-foreground font-semibold uppercase">
                {item.name}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                {item.type === "folder" && (
                  <SidebarMenu>
                    {item.children.map((item) => {
                      return (
                        item.type === "page" && (
                          <SidebarMenuItem key={item.url}>
                            <SidebarMenuButton
                              asChild
                              isActive={item.url === pathname}
                              className="data-[active=true]:bg-background dark:data-[active=true]:bg-input/30 ring-border data-[active=true]:ring"
                            >
                              <Link href={item.url}>{item.name}</Link>
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
        )}
      </SidebarContent>
    </Sidebar>
  )
}
