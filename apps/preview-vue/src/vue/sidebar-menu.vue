<script setup lang="ts">
import Frame from "@material-symbols/svg-400/rounded/crop_free.svg?component"
import LifeBuoy from "@material-symbols/svg-400/rounded/help.svg?component"
import Map from "@material-symbols/svg-400/rounded/map.svg?component"
import PieChart from "@material-symbols/svg-400/rounded/pie_chart.svg?component"
import Send from "@material-symbols/svg-400/rounded/send.svg?component"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/ui/sidebar'

const projects = [
  { name: 'Design Engineering', url: '#', icon: Frame },
  { name: 'Sales & Marketing', url: '#', icon: PieChart },
  { name: 'Travel', url: '#', icon: Map },
  { name: 'Support', url: '#', icon: LifeBuoy },
  { name: 'Feedback', url: '#', icon: Send },
]
</script>

<template>
  <SidebarProvider>
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem v-for="project in projects" :key="project.name">
                <SidebarMenuButton as-child>
                  <a :href="project.url">
                    <component :is="project.icon" />
                    <span>{{ project.name }}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  </SidebarProvider>
</template>
