"use client"

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/bases/aria/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/registry/bases/aria/ui/sidebar"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const { isMobile } = useSidebar()
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <DropdownMenuTrigger>
              <SidebarMenuButton className="aria-expanded:bg-muted">
                {item.title}{" "}
                <IconPlaceholder
                  lucide="MoreHorizontalIcon"
                  tabler="IconDots"
                  hugeicons="MoreHorizontalCircle01Icon"
                  phosphor="DotsThreeOutlineIcon"
                  remixicon="RiMoreLine"
                  className="ml-auto"
                />
              </SidebarMenuButton>
              {item.items?.length ? (
                <DropdownMenu
                  placement={isMobile ? "bottom end" : "right top"}
                  className="min-w-56 rounded-lg"
                >
                  {item.items.map((item) => (
                    <DropdownMenuItem key={item.title} href={item.url}>
                      {item.title}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenu>
              ) : null}
            </DropdownMenuTrigger>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
