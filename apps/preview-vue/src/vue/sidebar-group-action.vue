<script setup lang="ts">
import Frame from "@material-symbols/svg-400/rounded/crop_free.svg?component"
import Map from "@material-symbols/svg-400/rounded/map.svg?component"
import PieChart from "@material-symbols/svg-400/rounded/pie_chart.svg?component"
import Plus from "@material-symbols/svg-400/rounded/add.svg?component"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
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
]
</script>

<template>
  <SidebarProvider>
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupAction title="Add Project">
            <Plus /> <span class="sr-only">Add Project</span>
          </SidebarGroupAction>
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
