import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

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
} from '@/ui/sidebar';

import Home from '~icons/lucide/home';
import Inbox from '~icons/lucide/inbox';
import Settings from '~icons/lucide/settings';

const items = [
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  { title: 'Home', url: '#', icon: Home },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  { title: 'Inbox', url: '#', icon: Inbox },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  { title: 'Settings', url: '#', icon: Settings },
];

export default class SidebarControlled extends Component {
  @tracked open = false;

  setOpen = (value: boolean) => {
    this.open = value;
  };

  <template>
    <SidebarProvider
      @onOpenChange={{this.setOpen}}
      @open={{this.open}}
      class="!min-h-full h-full"
    >
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
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
}
