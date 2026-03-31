<script setup lang="ts">
import IconPlaceholder from "@/components/IconPlaceholder.vue"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/ui/sidebar"
import { Example } from "@/components"

const menuItems = [
  { title: "Home", lucide: "HomeIcon", tabler: "IconHome", hugeicons: "HomeIcon", phosphor: "HouseIcon", remixicon: "RiHomeLine", url: "#" },
  { title: "Dashboard", lucide: "LayoutDashboardIcon", tabler: "IconLayoutDashboard", hugeicons: "LayoutLeftIcon", phosphor: "LayoutIcon", remixicon: "RiDashboardLine", url: "#" },
  { title: "Settings", lucide: "SettingsIcon", tabler: "IconSettings", hugeicons: "SettingsIcon", phosphor: "GearIcon", remixicon: "RiSettings3Line", url: "#" },
  { title: "Profile", lucide: "UserIcon", tabler: "IconUser", hugeicons: "UserIcon", phosphor: "UserIcon", remixicon: "RiUserLine", url: "#" },
]
</script>

<template>
  <Example title="Collapsible Sidebar">
    <SidebarProvider>
      <div class="flex h-screen w-full">
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <div class="flex items-center gap-2 px-2 py-4">
              <IconPlaceholder
                lucide="LayoutDashboardIcon"
                tabler="IconLayoutDashboard"
                hugeicons="LayoutLeftIcon"
                phosphor="LayoutIcon"
                remixicon="RiDashboardLine"
              />
              <span class="font-semibold">My App</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem v-for="item in menuItems" :key="item.title">
                    <SidebarMenuButton :as-child="true">
                      <a :href="item.url" class="flex items-center gap-2">
                        <IconPlaceholder
                          :lucide="item.lucide"
                          :tabler="item.tabler"
                          :hugeicons="item.hugeicons"
                          :phosphor="item.phosphor"
                          :remixicon="item.remixicon"
                        />
                        <span>{{ item.title }}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main class="flex-1 p-6">
          <SidebarTrigger />
          <div class="mt-4">
            <h1 class="text-2xl font-bold">
              Collapsible Sidebar
            </h1>
            <p class="mt-2 text-muted-foreground">
              Click the trigger to collapse the sidebar to icons only.
            </p>
          </div>
        </main>
      </div>
    </SidebarProvider>
  </Example>
</template>
