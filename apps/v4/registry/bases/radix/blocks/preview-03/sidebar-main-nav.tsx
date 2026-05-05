import * as React from "react"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Kbd } from "@/registry/bases/radix/ui/kbd"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/registry/bases/radix/ui/sidebar"

export function SidebarMainNav() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton>
          <IconPlaceholder
            data-icon="inline-start"
            lucide="PlusIcon"
            tabler="IconPlus"
            hugeicons="Add01Icon"
            phosphor="PlusIcon"
            remixicon="RiPlusLine"
          />
          New Chat{" "}
          <Kbd className="ml-auto" data-icon="inline-end">
            ⌘N
          </Kbd>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton>
          <IconPlaceholder
            data-icon="inline-start"
            lucide="BlocksIcon"
            tabler="IconCube"
            hugeicons="CubeIcon"
            phosphor="CubeIcon"
            remixicon="RiBox3Line"
          />
          Marketplace
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton>
          <IconPlaceholder
            data-icon="inline-start"
            lucide="SettingsIcon"
            tabler="IconSettings"
            hugeicons="SettingsIcon"
            phosphor="GearIcon"
            remixicon="RiSettingsLine"
          />
          Settings
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
