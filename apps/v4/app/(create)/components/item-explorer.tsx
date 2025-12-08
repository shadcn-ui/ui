"use client"

import * as React from "react"
import { useQueryStates } from "nuqs"
import { RegistryItem } from "shadcn/schema"

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
import { ItemPicker } from "@/app/(create)/components/item-picker"
import { designSystemSearchParams } from "@/app/(create)/lib/search-params"
import { groupItemsByType } from "@/app/(create)/lib/utils"

const cachedGroupedItems = React.cache(
  (items: Pick<RegistryItem, "name" | "title" | "type">[]) => {
    return groupItemsByType(items)
  }
)

export function ItemExplorer({
  items,
}: {
  items: Pick<RegistryItem, "name" | "title" | "type">[]
}) {
  const [params, setParams] = useQueryStates(designSystemSearchParams, {
    history: "push",
    shallow: true,
  })

  const groupedItems = React.useMemo(() => cachedGroupedItems(items), [items])

  const currentItem = React.useMemo(
    () => items.find((item) => item.name === params.item) ?? null,
    [items, params.item]
  )

  return (
    <Sidebar
      className="sticky z-30 hidden h-[calc(100svh-var(--header-height)-2rem)] overscroll-none bg-transparent"
      collapsible="none"
    >
      <SidebarContent className="no-scrollbar overflow-x-hidden">
        <div className="from-background via-background/80 to-background/50 sticky -top-1 z-10 -mb-6 h-6 shrink-0 bg-gradient-to-b blur-xs" />
        {groupedItems.map((group) => (
          <SidebarGroup key={group.type} className="px-0">
            <SidebarGroupLabel className="text-muted-foreground font-medium">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      onClick={() => setParams({ item: item.name })}
                      className="data-[active=true]:bg-accent data-[active=true]:border-accent 3xl:fixed:w-full 3xl:fixed:max-w-48 relative h-[30px] w-fit cursor-pointer overflow-visible border border-transparent text-[0.8rem] font-medium after:absolute after:inset-x-0 after:-inset-y-1 after:-z-0 after:rounded-md"
                      data-active={item.name === currentItem?.name}
                      isActive={item.name === currentItem?.name}
                    >
                      {item.title}
                      <span className="absolute inset-0 flex w-(--sidebar-width) bg-transparent" />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        <div className="from-background via-background/80 to-background/50 sticky -bottom-1 z-10 h-16 shrink-0 bg-gradient-to-t blur-xs"></div>
      </SidebarContent>
    </Sidebar>
  )
}
