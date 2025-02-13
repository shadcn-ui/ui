import React from "react"
import { LucideIcon } from "lucide-react"

import { Badge } from "@/registry/default/ui/badge"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/registry/default/ui/sidebar"

interface FooterNavigationProps {
  items: {
    title: string
    href: string
    icon: LucideIcon
    count?: number
    isActive?: boolean
  }[]
}

export function FooterNavigation({ items }: FooterNavigationProps) {
  return (
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
  )
}
