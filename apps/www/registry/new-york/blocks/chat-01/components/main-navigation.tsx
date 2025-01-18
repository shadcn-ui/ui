import React from "react"
import { LucideIcon } from "lucide-react"

import { Badge } from "@/registry/new-york/ui/badge"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/registry/new-york/ui/sidebar"

interface MainNavigationProps {
  items: {
    title: string
    href: string
    icon: LucideIcon
    count?: number
    isActive?: boolean
  }[]
}

export function MainNavigation({ items }: MainNavigationProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>General</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton isActive={item.isActive} asChild>
              <a href={item.href}>
                <item.icon size={16} strokeWidth={2} aria-hidden="true" />
                <span className="flex-1">{item.title}</span>
                {item.count && (
                  <Badge
                    variant="outline"
                    className="bg-background px-1.5 text-xs"
                  >
                    {item.count}
                  </Badge>
                )}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
