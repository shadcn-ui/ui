import { on } from '@ember/modifier';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';

import type { TOC } from '@ember/component/template-only';
import type { ComponentLike } from '@glint/template';

import ChevronRight from '~icons/lucide/chevron-right';

interface NavItem {
  title: string;
  url: string;
  icon?: ComponentLike;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}

interface Signature {
  Args: {
    items: NavItem[];
  };
}

const NavMainComponent: TOC<Signature> = <template>
  <SidebarGroup>
    <SidebarGroupLabel>Platform</SidebarGroupLabel>
    <SidebarMenu>
      {{#each @items as |item|}}
        <Collapsible @defaultOpen={{item.isActive}} class="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger @asChild={{true}} as |trigger|>
              <SidebarMenuButton
                @tooltip={{item.title}}
                aria-controls={{trigger.aria-controls}}
                aria-expanded={{trigger.aria-expanded}}
                data-slot={{trigger.data-slot}}
                data-state={{trigger.data-state}}
                {{on "click" trigger.onClick}}
              >
                {{#if item.icon}}
                  <item.icon />
                {{/if}}
                <span>{{item.title}}</span>
                <ChevronRight
                  class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {{#each item.items as |subItem|}}
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton>
                      <a href={{subItem.url}}>
                        <span>{{subItem.title}}</span>
                      </a>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                {{/each}}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      {{/each}}
    </SidebarMenu>
  </SidebarGroup>
</template>;

export { NavMainComponent as NavMain };
