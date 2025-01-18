import React from "react"
import { ChevronRightIcon, LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/new-york/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/registry/new-york/ui/sidebar"

type NavigationItem = {
  title: string
  href: string
  icon: LucideIcon
  isActive: boolean
}

type Navigation = {
  title: string
  href: string
  icon: LucideIcon
  isActive: boolean
  items: NavigationItem[]
}

interface SecondaryNavigationProps {
  items: Navigation[]
}

export function SecondaryNavigation({ items }: SecondaryNavigationProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton isActive={item.isActive} asChild>
                <a href={item.href}>
                  <item.icon size={16} strokeWidth={2} aria-hidden="true" />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRightIcon
                        size={16}
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <a href={subItem.href}>
                              <div className="flex items-center gap-2">
                                <subItem.icon
                                  size={16}
                                  strokeWidth={2}
                                  aria-hidden="true"
                                />
                                <span>{subItem.title}</span>
                              </div>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
