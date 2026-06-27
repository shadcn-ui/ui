<script setup lang="ts">
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
} from '@/ui/sidebar'

const items = [
  {
    title: 'Getting Started',
    url: '#',
    items: [
      { title: 'Installation', url: '#' },
      { title: 'Project Structure', url: '#' },
    ],
  },
  {
    title: 'Build Your Application',
    url: '#',
    items: [
      { title: 'Routing', url: '#' },
      { title: 'Data Fetching', url: '#' },
      { title: 'Rendering', url: '#' },
    ],
  },
  {
    title: 'API Reference',
    url: '#',
    items: [
      { title: 'Components', url: '#' },
      { title: 'File Conventions', url: '#' },
      { title: 'Functions', url: '#' },
    ],
  },
]
</script>

<template>
  <SidebarProvider>
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem v-for="item in items" :key="item.title">
                <SidebarMenuButton as-child>
                  <a :href="item.url">
                    <span>{{ item.title }}</span>
                  </a>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  <SidebarMenuSubItem v-for="subItem in item.items" :key="subItem.title">
                    <SidebarMenuSubButton as-child>
                      <a :href="subItem.url">
                        <span>{{ subItem.title }}</span>
                      </a>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  </SidebarProvider>
</template>
