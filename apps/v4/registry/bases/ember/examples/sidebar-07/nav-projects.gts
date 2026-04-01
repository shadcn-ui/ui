import Component from '@glimmer/component';
import { consume } from 'ember-provide-consume-context';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import type { ComponentLike } from '@glint/template';

import Folder from '~icons/lucide/folder';
import Forward from '~icons/lucide/forward';
import MoreHorizontal from '~icons/lucide/more-horizontal';
import Trash2 from '~icons/lucide/trash-2';

const SidebarContext = 'sidebar-context' as const;

interface SidebarContextValue {
  state: 'expanded' | 'collapsed';
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
}

interface ContextRegistry {
  [SidebarContext]: SidebarContextValue;
}

interface Project {
  name: string;
  url: string;
  icon: ComponentLike;
}

interface Signature {
  Args: {
    projects: Project[];
  };
  Element: HTMLDivElement;
}

class NavProjects extends Component<Signature> {
  @consume(SidebarContext) context!: ContextRegistry[typeof SidebarContext];

  <template>
    <SidebarGroup @class="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {{#each @projects as |item|}}
          <SidebarMenuItem>
            <SidebarMenuButton>
              <item.icon />
              <span>{{item.name}}</span>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger @asChild={{true}} as |trigger|>
                <SidebarMenuAction @showOnHover={{true}} {{trigger.modifiers}}>
                  <MoreHorizontal />
                  <span class="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                @align={{if this.context.isMobile "end" "start"}}
                @class="w-48 rounded-lg"
                @side={{if this.context.isMobile "bottom" "right"}}
              >
                <DropdownMenuItem>
                  <Folder class="text-muted-foreground" />
                  <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Forward class="text-muted-foreground" />
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 class="text-muted-foreground" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        {{/each}}
        <SidebarMenuItem>
          <SidebarMenuButton @class="text-sidebar-foreground/70">
            <MoreHorizontal class="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  </template>
}

export { NavProjects };
