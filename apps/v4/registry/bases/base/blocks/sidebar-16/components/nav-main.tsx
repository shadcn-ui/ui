"use client"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/bases/base/ui/collapsible"
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
} from "@/registry/bases/base/ui/sidebar"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: React.ReactNode
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            defaultOpen={item.isActive}
            render={<SidebarMenuItem />}
          >
            <SidebarMenuButton
              tooltip={item.title}
              render={<a href={item.url} />}
            >
              {item.icon}
              <span>{item.title}</span>
            </SidebarMenuButton>
            {item.items?.length ? (
              <>
                <SidebarMenuAction
                  render={<CollapsibleTrigger />}
                  className="aria-expanded:rotate-90"
                >
                  <IconPlaceholder
                    lucide="ChevronRightIcon"
                    tabler="IconChevronRight"
                    hugeicons="ArrowRight01Icon"
                    phosphor="CaretRightIcon"
                    remixicon="RiArrowRightSLine"
                  />
                  <span className="sr-only">Toggle</span>
                </SidebarMenuAction>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton render={<a href={subItem.url} />}>
                          <span>{subItem.title}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </>
            ) : null}
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
