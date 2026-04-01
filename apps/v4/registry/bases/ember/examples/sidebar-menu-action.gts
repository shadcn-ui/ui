import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/ui/sidebar';

import Frame from '~icons/lucide/frame';
import Map from '~icons/lucide/map';
import MoreHorizontal from '~icons/lucide/more-horizontal';
import PieChart from '~icons/lucide/pie-chart';

const projects = [
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  { name: 'Design Engineering', url: '#', icon: Frame },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  { name: 'Sales & Marketing', url: '#', icon: PieChart },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  { name: 'Travel', url: '#', icon: Map },
];

<template>
  <SidebarProvider class="!min-h-full h-full">
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
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
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <SidebarMenuAction @showOnHover={{true}}>
                        <MoreHorizontal />
                        <span class="sr-only">More</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent @align="start" @side="right">
                      <DropdownMenuItem>
                        <span>Edit Project</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <span>Delete Project</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
