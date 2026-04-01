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

import PanelLeft from '~icons/lucide/panel-left';

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
          "group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar relative flex min-h-svh h-full w-full"
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
          "bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col"
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
        class="group peer text-sidebar-foreground hidden md:block"
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
            "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear"
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
            "absolute inset-y-0 z-10 hidden h-full w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex"
            (if
              (eq this.side "left")
              "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
              "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]"
            )
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
            class="bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm"
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
      class={{cn "size-7" @class}}
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
        "hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-0.5 sm:flex"
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize"
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize"
        "hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full"
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
      "bg-background relative flex w-full flex-1 flex-col"
      "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2"
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
    class={{cn "bg-background h-8 w-full shadow-none" @class}}
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
    class={{cn "flex flex-col gap-2 p-2" @class}}
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
    class={{cn "flex flex-col gap-2 p-2" @class}}
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
    class={{cn "bg-sidebar-border mx-2 w-auto" @class}}
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
      "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden"
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
    class={{cn "relative flex w-full min-w-0 flex-col p-2" @class}}
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
      "text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0"
      "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0"
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
      "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0"
      "after:absolute after:-inset-2 md:after:hidden"
      "group-data-[collapsible=icon]:hidden"
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
    class={{cn "w-full text-sm" @class}}
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
    class={{cn "flex w-full min-w-0 flex-col gap-1" @class}}
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
      default: 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
      outline:
        'bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]',
    };
    return variants[this.variant];
  }

  get sizeClasses(): string {
    const sizes = {
      default: 'h-8 text-sm',
      sm: 'h-7 text-xs',
      lg: 'h-12 text-sm group-data-[collapsible=icon]:p-0!',
    };
    return sizes[this.size];
  }

  get classes(): string {
    return cn(
      'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
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
      "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0"
      "after:absolute after:-inset-2 md:after:hidden"
      "peer-data-[size=sm]/menu-button:top-1"
      "peer-data-[size=default]/menu-button:top-1.5"
      "peer-data-[size=lg]/menu-button:top-2.5"
      "group-data-[collapsible=icon]:hidden"
      (if
        @showOnHover
        "peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0"
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
      "text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none"
      "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground"
      "peer-data-[size=sm]/menu-button:top-1"
      "peer-data-[size=default]/menu-button:top-1.5"
      "peer-data-[size=lg]/menu-button:top-2.5"
      "group-data-[collapsible=icon]:hidden"
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
      class={{cn "flex h-8 items-center gap-2 rounded-md px-2" @class}}
      data-sidebar="menu-skeleton"
      data-slot="sidebar-menu-skeleton"
      ...attributes
    >
      {{#if @showIcon}}
        <Skeleton class="size-4 rounded-md" data-sidebar="menu-skeleton-icon" />
      {{/if}}
      <Skeleton
        class="h-4 max-w-(--skeleton-width) flex-1"
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
      "border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5"
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
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0"
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
        (if (eq size "sm") "text-xs")
        (if (eq size "md") "text-sm")
        "group-data-[collapsible=icon]:hidden"
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
