import { concat } from '@ember/helper';
import { on } from '@ember/modifier';
import { htmlSafe } from '@ember/template';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { modifier } from 'ember-modifier';
import { consume, provide } from 'ember-provide-consume-context';
import { and, eq, not, or } from 'ember-truth-helpers';

import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Separator } from '@/ui/separator';
import { Sheet, SheetContent } from '@/ui/sheet';
import { Skeleton } from '@/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/ui/tooltip';
import { cn } from '@/lib/utils';

import type { TOC } from '@ember/component/template-only';

import PanelLeft from '~icons/ms/left_panel_open';

const SIDEBAR_COOKIE_NAME = 'sidebar_state';
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = '16rem';
const SIDEBAR_WIDTH_MOBILE = '18rem';
const SIDEBAR_WIDTH_ICON = '3rem';
const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

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

const useMediaQuery = modifier<{
  Element: HTMLElement;
  Args: { Named: { query: string; onChange: (matches: boolean) => void } };
}>((element, _positional, { query, onChange }) => {
  const mediaQuery = window.matchMedia(query);
  const handler = (e: MediaQueryListEvent | MediaQueryList) =>
    onChange(e.matches);

  handler(mediaQuery);
  mediaQuery.addEventListener('change', handler);

  return () => {
    mediaQuery.removeEventListener('change', handler);
  };
});

const useKeyboard = modifier<{
  Element: HTMLElement;
  Args: { Named: { onKeyDown: (e: KeyboardEvent) => void } };
}>((element, _positional, { onKeyDown }) => {
  window.addEventListener('keydown', onKeyDown);
  return () => {
    window.removeEventListener('keydown', onKeyDown);
  };
});

interface SidebarProviderSignature {
  Element: HTMLDivElement;
  Args: {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    class?: string;
    style?: string;
  };
  Blocks: {
    default: [];
  };
}

class SidebarProvider extends Component<SidebarProviderSignature> {
  @tracked _open = this.args.defaultOpen ?? true;
  @tracked openMobile = false;
  @tracked isMobile = false;

  get open(): boolean {
    return this.args.open ?? this._open;
  }

  setOpen = (value: boolean): void => {
    const openState = value;
    if (this.args.onOpenChange) {
      this.args.onOpenChange(openState);
    } else {
      this._open = openState;
    }
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
  };

  setOpenMobile = (value: boolean): void => {
    this.openMobile = value;
  };

  toggleSidebar = (): void => {
    if (this.isMobile) {
      this.setOpenMobile(!this.openMobile);
    } else {
      this.setOpen(!this.open);
    }
  };

  handleKeyDown = (event: KeyboardEvent): void => {
    if (
      event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
      (event.metaKey || event.ctrlKey)
    ) {
      event.preventDefault();
      this.toggleSidebar();
    }
  };

  handleMediaChange = (matches: boolean): void => {
    this.isMobile = matches;
  };

  get state(): 'expanded' | 'collapsed' {
    return this.open ? 'expanded' : 'collapsed';
  }

  @provide(SidebarContext)
  get context(): SidebarContextValue {
    return {
      state: this.state,
      open: this.open,
      setOpen: this.setOpen,
      openMobile: this.openMobile,
      setOpenMobile: this.setOpenMobile,
      isMobile: this.isMobile,
      toggleSidebar: this.toggleSidebar,
    };
  }

  <template>
    <div
      {{useKeyboard onKeyDown=this.handleKeyDown}}
      {{useMediaQuery
        query="(max-width: 768px)"
        onChange=this.handleMediaChange
      }}
    >
      <div
        class={{cn
          "group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar"
          @class
        }}
        data-slot="sidebar-wrapper"
        style={{htmlSafe
          (if
            @style
            (concat
              "--sidebar-width: "
              SIDEBAR_WIDTH
              "; --sidebar-width-icon: "
              SIDEBAR_WIDTH_ICON
              "; "
              @style
            )
            (concat
              "--sidebar-width: "
              SIDEBAR_WIDTH
              "; --sidebar-width-icon: "
              SIDEBAR_WIDTH_ICON
            )
          )
        }}
        ...attributes
      >
        {{yield}}
      </div>
    </div>
  </template>
}

interface SidebarSignature {
  Element: HTMLDivElement;
  Args: {
    side?: 'left' | 'right';
    variant?: 'sidebar' | 'floating' | 'inset';
    collapsible?: 'offcanvas' | 'icon' | 'none';
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

class Sidebar extends Component<SidebarSignature> {
  @consume(SidebarContext) context!: ContextRegistry[typeof SidebarContext];

  get side(): 'left' | 'right' {
    return this.args.side ?? 'left';
  }

  get variant(): 'sidebar' | 'floating' | 'inset' {
    return this.args.variant ?? 'sidebar';
  }

  get collapsible(): 'offcanvas' | 'icon' | 'none' {
    return this.args.collapsible ?? 'offcanvas';
  }

  <template>
    {{#if (eq this.collapsible "none")}}
      <div
        class={{cn
          "flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground"
          @class
        }}
        data-slot="sidebar"
        ...attributes
      >
        {{yield}}
      </div>
    {{else if this.context.isMobile}}
      <Sheet
        @onOpenChange={{this.context.setOpenMobile}}
        @open={{this.context.openMobile}}
      >
        <SheetContent
          @side={{this.side}}
          class="bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden"
          data-mobile="true"
          data-sidebar="sidebar"
          data-slot="sidebar"
          style={{htmlSafe (concat "--sidebar-width: " SIDEBAR_WIDTH_MOBILE)}}
        >
          <div class="flex h-full w-full flex-col">
            {{yield}}
          </div>
        </SheetContent>
      </Sheet>
    {{else}}
      <div
        class="group peer hidden text-sidebar-foreground md:block"
        data-collapsible={{if
          (eq this.context.state "collapsed")
          this.collapsible
          ""
        }}
        data-side={{this.side}}
        data-slot="sidebar"
        data-state={{this.context.state}}
        data-variant={{this.variant}}
      >
        <div
          class={{cn
            "cn-sidebar-gap relative w-(--sidebar-width) bg-transparent"
            "group-data-[collapsible=offcanvas]:w-0"
            "group-data-[side=right]:rotate-180"
            (if
              (or (eq this.variant "floating") (eq this.variant "inset"))
              "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
              "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
            )
          }}
          data-slot="sidebar-gap"
        />
        <div
          class={{cn
            "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear data-[side=left]:left-0 data-[side=left]:group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)] data-[side=right]:right-0 data-[side=right]:group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)] md:flex"
            (if
              (or (eq this.variant "floating") (eq this.variant "inset"))
              "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
              "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l"
            )
            @class
          }}
          data-slot="sidebar-container"
          ...attributes
        >
          <div
            class="cn-sidebar-inner flex size-full flex-col"
            data-sidebar="sidebar"
            data-slot="sidebar-inner"
          >
            {{yield}}
          </div>
        </div>
      </div>
    {{/if}}
  </template>
}

interface SidebarTriggerSignature {
  Element: HTMLButtonElement;
  Args: {
    class?: string;
    variant?:
      | 'ghost'
      | 'default'
      | 'destructive'
      | 'outline'
      | 'secondary'
      | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    onClick?: (event: MouseEvent) => void;
  };
  Blocks: {
    default: [];
  };
}

class SidebarTrigger extends Component<SidebarTriggerSignature> {
  @consume(SidebarContext) context!: ContextRegistry[typeof SidebarContext];

  handleClick = (event: MouseEvent): void => {
    this.args.onClick?.(event);
    this.context.toggleSidebar();
  };

  <template>
    <Button
      @size={{or @size "icon"}}
      @variant={{or @variant "ghost"}}
      class={{cn "cn-sidebar-trigger" @class}}
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      {{on "click" this.handleClick}}
      ...attributes
    >
      {{#if (has-block)}}
        {{yield}}
      {{else}}
        <PanelLeft />
        <span class="sr-only">Toggle Sidebar</span>
      {{/if}}
    </Button>
  </template>
}

interface SidebarRailSignature {
  Element: HTMLButtonElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

class SidebarRail extends Component<SidebarRailSignature> {
  @consume(SidebarContext) context!: ContextRegistry[typeof SidebarContext];

  <template>
    <button
      aria-label="Toggle Sidebar"
      class={{cn
        "cn-sidebar-rail absolute inset-y-0 z-20 hidden w-4 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:start-1/2 after:w-[2px] sm:flex ltr:-translate-x-1/2 rtl:-translate-x-1/2"
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize"
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize"
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full hover:group-data-[collapsible=offcanvas]:bg-sidebar"
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2"
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2"
        @class
      }}
      data-sidebar="rail"
      data-slot="sidebar-rail"
      tabindex="-1"
      title="Toggle Sidebar"
      type="button"
      {{on "click" this.context.toggleSidebar}}
      ...attributes
    >
      {{yield}}
    </button>
  </template>
}

interface SidebarInsetSignature {
  Element: HTMLElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const SidebarInset: TOC<SidebarInsetSignature> = <template>
  <main
    class={{cn
      "cn-sidebar-inset relative flex w-full flex-1 flex-col"
      @class
    }}
    data-slot="sidebar-inset"
    ...attributes
  >
    {{yield}}
  </main>
</template>;

interface SidebarInputSignature {
  Element: HTMLInputElement;
  Args: {
    class?: string;
    type?: string;
  };
}

const SidebarInput: TOC<SidebarInputSignature> = <template>
  <Input
    @type={{@type}}
    class={{cn "cn-sidebar-input" @class}}
    data-sidebar="input"
    data-slot="sidebar-input"
    ...attributes
  />
</template>;

interface SidebarHeaderSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const SidebarHeader: TOC<SidebarHeaderSignature> = <template>
  <div
    class={{cn "cn-sidebar-header flex flex-col" @class}}
    data-sidebar="header"
    data-slot="sidebar-header"
    ...attributes
  >
    {{yield}}
  </div>
</template>;

interface SidebarFooterSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const SidebarFooter: TOC<SidebarFooterSignature> = <template>
  <div
    class={{cn "cn-sidebar-footer flex flex-col" @class}}
    data-sidebar="footer"
    data-slot="sidebar-footer"
    ...attributes
  >
    {{yield}}
  </div>
</template>;

interface SidebarSeparatorSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
    orientation?: 'horizontal' | 'vertical';
    decorative?: boolean;
  };
}

const SidebarSeparator: TOC<SidebarSeparatorSignature> = <template>
  <Separator
    @decorative={{@decorative}}
    @orientation={{@orientation}}
    class={{cn "cn-sidebar-separator w-auto" @class}}
    data-sidebar="separator"
    data-slot="sidebar-separator"
    ...attributes
  />
</template>;

interface SidebarContentSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const SidebarContent: TOC<SidebarContentSignature> = <template>
  <div
    class={{cn
      "cn-sidebar-content flex min-h-0 flex-1 flex-col overflow-auto group-data-[collapsible=icon]:overflow-hidden"
      @class
    }}
    data-sidebar="content"
    data-slot="sidebar-content"
    ...attributes
  >
    {{yield}}
  </div>
</template>;

interface SidebarGroupSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const SidebarGroup: TOC<SidebarGroupSignature> = <template>
  <div
    class={{cn "cn-sidebar-group relative flex w-full min-w-0 flex-col" @class}}
    data-sidebar="group"
    data-slot="sidebar-group"
    ...attributes
  >
    {{yield}}
  </div>
</template>;

interface SidebarGroupLabelSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const SidebarGroupLabel: TOC<SidebarGroupLabelSignature> = <template>
  <div
    class={{cn
      "cn-sidebar-group-label flex shrink-0 items-center outline-hidden [&>svg]:shrink-0"
      @class
    }}
    data-sidebar="group-label"
    data-slot="sidebar-group-label"
    ...attributes
  >
    {{yield}}
  </div>
</template>;

interface SidebarGroupActionSignature {
  Element: HTMLButtonElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const SidebarGroupAction: TOC<SidebarGroupActionSignature> = <template>
  <button
    class={{cn
      "cn-sidebar-group-action flex aspect-square items-center justify-center outline-hidden transition-transform group-data-[collapsible=icon]:hidden after:absolute after:-inset-2 md:after:hidden [&>svg]:shrink-0"
      @class
    }}
    data-sidebar="group-action"
    data-slot="sidebar-group-action"
    type="button"
    ...attributes
  >
    {{yield}}
  </button>
</template>;

interface SidebarGroupContentSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const SidebarGroupContent: TOC<SidebarGroupContentSignature> = <template>
  <div
    class={{cn "cn-sidebar-group-content w-full" @class}}
    data-sidebar="group-content"
    data-slot="sidebar-group-content"
    ...attributes
  >
    {{yield}}
  </div>
</template>;

interface SidebarMenuSignature {
  Element: HTMLUListElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const SidebarMenu: TOC<SidebarMenuSignature> = <template>
  <ul
    class={{cn "cn-sidebar-menu flex w-full min-w-0 flex-col" @class}}
    data-sidebar="menu"
    data-slot="sidebar-menu"
    ...attributes
  >
    {{yield}}
  </ul>
</template>;

interface SidebarMenuItemSignature {
  Element: HTMLLIElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const SidebarMenuItem: TOC<SidebarMenuItemSignature> = <template>
  <li
    class={{cn "group/menu-item relative" @class}}
    data-sidebar="menu-item"
    data-slot="sidebar-menu-item"
    ...attributes
  >
    {{yield}}
    {{! [FORCE-UI] active-state accent indicator, see style-force-ui.css }}
    <span aria-hidden="true" class="cn-sidebar-menu-item-indicator"></span>
  </li>
</template>;

interface SidebarMenuButtonSignature {
  Element: HTMLButtonElement;
  Args: {
    isActive?: boolean;
    variant?: 'default' | 'outline';
    size?: 'default' | 'sm' | 'lg';
    tooltip?: string;
    class?: string;
    asChild?: boolean;
  };
  Blocks: {
    default: [];
  };
}

class SidebarMenuButton extends Component<SidebarMenuButtonSignature> {
  @consume(SidebarContext) context!: ContextRegistry[typeof SidebarContext];

  get variant(): 'default' | 'outline' {
    return this.args.variant ?? 'default';
  }

  get size(): 'default' | 'sm' | 'lg' {
    return this.args.size ?? 'default';
  }

  get variantClasses(): string {
    const variants = {
      default: 'cn-sidebar-menu-button-variant-default',
      outline: 'cn-sidebar-menu-button-variant-outline',
    };
    return variants[this.variant];
  }

  get sizeClasses(): string {
    const sizes = {
      default: 'cn-sidebar-menu-button-size-default',
      sm: 'cn-sidebar-menu-button-size-sm',
      lg: 'cn-sidebar-menu-button-size-lg',
    };
    return sizes[this.size];
  }

  get classes(): string {
    return cn(
      'cn-sidebar-menu-button peer/menu-button group/menu-button flex w-full items-center overflow-hidden outline-hidden disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 [&>span:last-child]:truncate',
      this.variantClasses,
      this.sizeClasses,
      this.args.class
    );
  }

  <template>
    {{#if @tooltip}}
      <Tooltip>
        <TooltipTrigger @asChild={{true}} @class="w-full">
          <button
            class={{this.classes}}
            data-active={{@isActive}}
            data-sidebar="menu-button"
            data-size={{this.size}}
            data-slot="sidebar-menu-button"
            type="button"
            ...attributes
          >
            {{yield}}
          </button>
        </TooltipTrigger>
        {{#if
          (and (eq this.context.state "collapsed") (not this.context.isMobile))
        }}
          <TooltipContent @align="center" @side="right">
            {{@tooltip}}
          </TooltipContent>
        {{/if}}
      </Tooltip>
    {{else}}
      <button
        class={{this.classes}}
        data-active={{@isActive}}
        data-sidebar="menu-button"
        data-size={{this.size}}
        data-slot="sidebar-menu-button"
        type="button"
        ...attributes
      >
        {{yield}}
      </button>
    {{/if}}
  </template>
}

interface SidebarMenuActionSignature {
  Element: HTMLButtonElement;
  Args: {
    showOnHover?: boolean;
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const SidebarMenuAction: TOC<SidebarMenuActionSignature> = <template>
  <button
    class={{cn
      "cn-sidebar-menu-action flex items-center justify-center outline-hidden transition-transform group-data-[collapsible=icon]:hidden after:absolute after:-inset-2 md:after:hidden [&>svg]:shrink-0"
      (if
        @showOnHover
        "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 peer-data-active/menu-button:text-sidebar-accent-foreground aria-expanded:opacity-100 md:opacity-0"
      )
      @class
    }}
    data-sidebar="menu-action"
    data-slot="sidebar-menu-action"
    type="button"
    ...attributes
  >
    {{yield}}
  </button>
</template>;

interface SidebarMenuBadgeSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const SidebarMenuBadge: TOC<SidebarMenuBadgeSignature> = <template>
  <div
    class={{cn
      "cn-sidebar-menu-badge flex items-center justify-center tabular-nums select-none group-data-[collapsible=icon]:hidden"
      @class
    }}
    data-sidebar="menu-badge"
    data-slot="sidebar-menu-badge"
    ...attributes
  >
    {{yield}}
  </div>
</template>;

interface SidebarMenuSkeletonSignature {
  Element: HTMLDivElement;
  Args: {
    showIcon?: boolean;
    class?: string;
  };
}

class SidebarMenuSkeleton extends Component<SidebarMenuSkeletonSignature> {
  get width(): string {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }

  <template>
    <div
      class={{cn "cn-sidebar-menu-skeleton flex items-center" @class}}
      data-sidebar="menu-skeleton"
      data-slot="sidebar-menu-skeleton"
      ...attributes
    >
      {{#if @showIcon}}
        <Skeleton class="cn-sidebar-menu-skeleton-icon" data-sidebar="menu-skeleton-icon" />
      {{/if}}
      <Skeleton
        class="cn-sidebar-menu-skeleton-text max-w-(--skeleton-width) flex-1"
        data-sidebar="menu-skeleton-text"
        style={{htmlSafe (concat "--skeleton-width: " this.width)}}
      />
    </div>
  </template>
}

interface SidebarMenuSubSignature {
  Element: HTMLUListElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const SidebarMenuSub: TOC<SidebarMenuSubSignature> = <template>
  <ul
    class={{cn
      "cn-sidebar-menu-sub flex min-w-0 flex-col"
      "group-data-[collapsible=icon]:hidden"
      @class
    }}
    data-sidebar="menu-sub"
    data-slot="sidebar-menu-sub"
    ...attributes
  >
    {{yield}}
  </ul>
</template>;

interface SidebarMenuSubItemSignature {
  Element: HTMLLIElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const SidebarMenuSubItem: TOC<SidebarMenuSubItemSignature> = <template>
  <li
    class={{cn "group/menu-sub-item relative" @class}}
    data-sidebar="menu-sub-item"
    data-slot="sidebar-menu-sub-item"
    ...attributes
  >
    {{yield}}
  </li>
</template>;

interface SidebarMenuSubButtonSignature {
  Element: HTMLAnchorElement;
  Args: {
    size?: 'sm' | 'md';
    isActive?: boolean;
    class?: string;
    href?: string;
  };
  Blocks: {
    default: [];
  };
}

const SidebarMenuSubButton: TOC<SidebarMenuSubButtonSignature> = <template>
  {{#let (or @size "md") as |size|}}
    <a
      class={{cn
        "cn-sidebar-menu-sub-button flex min-w-0 -translate-x-px items-center overflow-hidden outline-hidden group-data-[collapsible=icon]:hidden disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:shrink-0"
        @class
      }}
      data-active={{@isActive}}
      data-sidebar="menu-sub-button"
      data-size={{size}}
      data-slot="sidebar-menu-sub-button"
      href={{@href}}
      ...attributes
    >
      {{yield}}
    </a>
  {{/let}}
</template>;

export {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarRail,
  SidebarInset,
  SidebarInput,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
};
