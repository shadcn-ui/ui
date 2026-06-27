<script setup lang="ts">
import ChevronRight from "@material-symbols/svg-400/rounded/chevron_right.svg?component"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/ui/collapsible'
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
              <Collapsible
                v-for="(item, index) in items"
                :key="item.title"
                class="group/collapsible"
                :default-open="index === 0"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger as-child>
                    <SidebarMenuButton>
                      <span>{{ item.title }}</span>
                      <ChevronRight class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem v-for="subItem in item.items" :key="subItem.title">
                        <SidebarMenuSubButton as-child>
                          <a :href="subItem.url">
                            <span>{{ subItem.title }}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  </SidebarProvider>
</template>
