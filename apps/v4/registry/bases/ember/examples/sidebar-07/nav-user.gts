import Component from '@glimmer/component';
import { consume } from 'ember-provide-consume-context';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import BadgeCheck from '~icons/lucide/badge-check';
import Bell from '~icons/lucide/bell';
import ChevronsUpDown from '~icons/lucide/chevrons-up-down';
import CreditCard from '~icons/lucide/credit-card';
import LogOut from '~icons/lucide/log-out';
import Sparkles from '~icons/lucide/sparkles';

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

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface Signature {
  Args: {
    user: User;
  };
  Element: HTMLDivElement;
}

class NavUserComponent extends Component<Signature> {
  @consume(SidebarContext) context!: ContextRegistry[typeof SidebarContext];

  <template>
    <SidebarMenu @class="w-full">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger @class="w-full">
            <SidebarMenuButton
              @class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              @size="lg"
            >
              <Avatar @class="h-8 w-8 rounded-lg">
                <AvatarImage @alt={{@user.name}} @src={{@user.avatar}} />
                <AvatarFallback @class="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-medium">{{@user.name}}</span>
                <span class="truncate text-xs">{{@user.email}}</span>
              </div>
              <ChevronsUpDown class="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            @align="end"
            @class="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            @side={{if this.context.isMobile "bottom" "right"}}
            @sideOffset={{4}}
          >
            <DropdownMenuLabel @class="p-0 font-normal">
              <div
                class="flex items-center gap-2 px-1 py-1.5 text-left text-sm"
              >
                <Avatar @class="h-8 w-8 rounded-lg">
                  <AvatarImage @alt={{@user.name}} @src={{@user.avatar}} />
                  <AvatarFallback @class="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div class="grid flex-1 text-left text-sm leading-tight">
                  <span class="truncate font-medium">{{@user.name}}</span>
                  <span class="truncate text-xs">{{@user.email}}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  </template>
}

export { NavUserComponent as NavUser };
