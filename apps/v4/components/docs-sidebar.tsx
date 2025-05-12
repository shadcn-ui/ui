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
      className="sticky top-[calc(var(--header-height)+1px)] z-30 hidden h-[calc(100svh-var(--header-height)-var(--footer-height)+1px)] bg-transparent lg:flex"
      collapsible="none"
      {...props}
    >
      <SidebarContent className="no-scrollbar px-2 pb-12">
        {tree.children.map((item) => (
          <SidebarGroup key={item.$id}>
            <SidebarGroupLabel className="text-muted-foreground font-semibold uppercase">
              {item.name}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              {item.type === "folder" && (
                <SidebarMenu className="gap-0.5">
                  {item.children.map((item) => {
                    return (
                      item.type === "page" && (
                        <SidebarMenuItem key={item.url}>
                          <SidebarMenuButton
                            asChild
                            isActive={item.url === pathname}
                            className="data-[active=true]:bg-accent dark:data-[active=true]:bg-input/30 data-[active=true]:border-border relative h-[30px] border border-transparent after:absolute after:inset-0 after:z-0 after:-my-1 after:rounded-md"
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
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
