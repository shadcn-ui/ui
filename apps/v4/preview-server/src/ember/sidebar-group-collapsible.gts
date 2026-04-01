import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/ember-ui/collapsible';
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
  SidebarTrigger,
} from '@/ember-ui/sidebar';

import type { ComponentLike } from '@glint/template';

import ChevronDown from '~icons/lucide/chevron-down';
import Frame from '~icons/lucide/frame';
import Map from '~icons/lucide/map';
import PieChart from '~icons/lucide/pie-chart';

const projects = [
  { name: 'Design Engineering', url: '#', icon: Frame as ComponentLike },
  { name: 'Sales & Marketing', url: '#', icon: PieChart as ComponentLike },
  { name: 'Travel', url: '#', icon: Map as ComponentLike },
];

<template>
  <SidebarProvider class="!min-h-full h-full">
    <Sidebar>
      <SidebarContent>
        <Collapsible @defaultOpen={{true}} class="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel>
              <CollapsibleTrigger>
                Help
                <ChevronDown
                  class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180"
                />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
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
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
    </Sidebar>
    <main class="flex h-full flex-1 flex-col">
      <div class="flex items-center gap-2 border-b p-4">
        <SidebarTrigger />
      </div>
    </main>
  </SidebarProvider>
</template>
