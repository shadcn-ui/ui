import { fn } from '@ember/helper';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { consume } from 'ember-provide-consume-context';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import type { ComponentLike } from '@glint/template';

import ChevronsUpDown from '~icons/lucide/chevrons-up-down';
import Plus from '~icons/lucide/plus';

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

interface Team {
  name: string;
  logo: ComponentLike;
  plan: string;
}

interface TeamSwitcherSignature {
  Args: {
    teams: Team[];
  };
}

class TeamSwitcherComponent extends Component<TeamSwitcherSignature> {
  @consume(SidebarContext) context!: ContextRegistry[typeof SidebarContext];

  @tracked activeTeam: Team | undefined = undefined;

  get currentTeam(): Team | undefined {
    return this.activeTeam ?? this.args.teams[0];
  }

  setActiveTeam = (team: Team) => {
    this.activeTeam = team;
  };

  <template>
    {{#if this.currentTeam}}
      <SidebarMenu @class="w-full">
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger @class="w-full">
              <SidebarMenuButton
                @class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                @size="lg"
              >
                <div
                  class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
                >
                  <this.currentTeam.logo />
                </div>
                <div class="grid flex-1 text-left text-sm leading-tight">
                  <span
                    class="truncate font-medium"
                  >{{this.currentTeam.name}}</span>
                  <span
                    class="truncate text-xs"
                  >{{this.currentTeam.plan}}</span>
                </div>
                <ChevronsUpDown class="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              @align="start"
              @class="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              @side={{if this.context.isMobile "bottom" "right"}}
              @sideOffset={{4}}
            >
              <DropdownMenuLabel @class="text-muted-foreground text-xs">
                Teams
              </DropdownMenuLabel>
              {{#each @teams as |team index|}}
                <DropdownMenuItem
                  @class="gap-2 p-2"
                  @onSelect={{fn this.setActiveTeam team}}
                >
                  <div
                    class="flex size-6 items-center justify-center rounded-md border"
                  >
                    <team.logo />
                  </div>
                  {{team.name}}
                  <DropdownMenuShortcut>⌘{{index}}</DropdownMenuShortcut>
                </DropdownMenuItem>
              {{/each}}
              <DropdownMenuSeparator />
              <DropdownMenuItem @class="gap-2 p-2">
                <div
                  class="flex size-6 items-center justify-center rounded-md border bg-transparent"
                >
                  <Plus class="size-4" />
                </div>
                <div class="text-muted-foreground font-medium">Add team</div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    {{/if}}
  </template>
}

export { TeamSwitcherComponent as TeamSwitcher };
