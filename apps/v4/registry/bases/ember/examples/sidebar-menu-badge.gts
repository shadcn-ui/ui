import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/ui/sidebar';

import Inbox from '~icons/lucide/inbox';
import MessageSquare from '~icons/lucide/message-square';
import Send from '~icons/lucide/send';

const items = [
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  { title: 'Inbox', url: '#', icon: Inbox, badge: '24' },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  { title: 'Drafts', url: '#', icon: Send, badge: '3' },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  { title: 'Sent', url: '#', icon: MessageSquare },
];

<template>
  <SidebarProvider class="!min-h-full h-full">
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Messages</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {{#each items as |item|}}
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <a class="flex items-center gap-2" href={{item.url}}>
                      <item.icon />
                      <span>{{item.title}}</span>
                    </a>
                  </SidebarMenuButton>
                  {{#if item.badge}}
                    <SidebarMenuBadge>{{item.badge}}</SidebarMenuBadge>
                  {{/if}}
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
