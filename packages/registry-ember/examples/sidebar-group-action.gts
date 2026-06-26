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
  SidebarTrigger,
} from '@/ui/sidebar';

import type { ComponentLike } from '@glint/template';

import Frame from '~icons/ms/crop_free';
import Map from '~icons/ms/map';
import PieChart from '~icons/ms/pie_chart';
import Plus from '~icons/ms/add';

const projects = [
  { name: 'Design Engineering', url: '#', icon: Frame as ComponentLike },
  { name: 'Sales & Marketing', url: '#', icon: PieChart as ComponentLike },
  { name: 'Travel', url: '#', icon: Map as ComponentLike },
];

<template>
  <SidebarProvider class="!min-h-full h-full">
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupAction title="Add Project">
            <Plus />
            <span class="sr-only">Add Project</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {{#each projects as |project|}}
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <a class="flex items-center gap-2" href={{project.url}}>
                      <project.icon />
                      <span>{{project.name}}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              {{/each}}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
    <main class="flex h-full flex-1 flex-col">
      <div class="flex items-center gap-2 border-b p-4">
        <SidebarTrigger />
      </div>
    </main>
  </SidebarProvider>
</template>
