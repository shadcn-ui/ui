import { on } from '@ember/modifier';
import { htmlSafe } from '@ember/template';
import {
  computePosition,
  flip,
  shift,
  offset,
  autoUpdate,
} from '@floating-ui/dom';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { cached } from '@glimmer/tracking';
import onClickOutside from 'ember-click-outside/modifiers/on-click-outside';
import { modifier } from 'ember-modifier';
import { provide, consume } from 'ember-provide-consume-context';

import { cn } from '@/lib/utils';

import type { TOC } from '@ember/component/template-only';

import Check from '~icons/lucide/check';
import ChevronRight from '~icons/lucide/chevron-right';

const ContextMenuContext = 'context-menu-context' as const;
const ContextMenuGroupContext = 'context-menu-group-context' as const;
const ContextMenuSubContext = 'context-menu-sub-context' as const;
const SUBMENU_CLOSE_DELAY = 500;

interface ContextMenuContextValue {
  isOpen: boolean;
  isRendered: boolean;
  setOpen: (open: boolean) => void;
  finishClose: () => void;
  mousePosition: { x: number; y: number } | null;
  setMousePosition: (position: { x: number; y: number } | null) => void;
  closeAllSubmenus?: () => void;
  registerGroupCloseCallback?: (callback: () => void) => () => void;
  cancelPendingItemClose?: () => void;
  setPendingItemClose?: (timeout: ReturnType<typeof setTimeout>) => void;
}

interface ContextMenuGroupContextValue {
  closeAllSubmenus: () => void;
  registerSubmenu: (closeCallback: () => void) => () => void;
  setOpen: (open: boolean) => void;
}

interface ContextMenuSubContextValue {
  isOpen: boolean;
  isRendered: boolean;
  setOpen: (open: boolean) => void;
  finishClose: () => void;
  triggerElement: HTMLElement | null;
  setTriggerElement: (element: HTMLElement | null) => void;
  parentSetOpen: (open: boolean) => void;
  cancelPendingClose: () => void;
  setPendingClose: (timeout: ReturnType<typeof setTimeout>) => void;
}

interface ContextRegistry {
  [ContextMenuContext]: ContextMenuContextValue;
  [ContextMenuGroupContext]: ContextMenuGroupContextValue;
  [ContextMenuSubContext]: ContextMenuSubContextValue;
}

interface ContextMenuSignature {
  Args: {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
  };
  Blocks: {
    default: [];
  };
}

class ContextMenu extends Component<ContextMenuSignature> {
  @tracked isOpen?: boolean;
  @tracked isRendered = false;
  mousePosition: { x: number; y: number } | null = null;

  get open() {
    return this.args.open ?? this.isOpen ?? this.args.defaultOpen ?? false;
  }

  setOpen = (open: boolean) => {
    if (open) {
      this.isRendered = true;
      this.isOpen = true;
    } else {
      this.isOpen = false;
    }
    this.args.onOpenChange?.(open);
  };

  finishClose = () => {
    if (!this.isOpen) {
      this.isRendered = false;
    }
  };

  setMousePosition = (position: { x: number; y: number } | null) => {
    this.mousePosition = position;
  };

  @cached
  @provide(ContextMenuContext)
  get context(): ContextMenuContextValue {
    return {
      isOpen: this.open,
      isRendered: this.isRendered,
      setOpen: this.setOpen,
      finishClose: this.finishClose,
      mousePosition: this.mousePosition,
      setMousePosition: this.setMousePosition,
    };
  }

  <template>
    <div data-slot="context-menu">
      {{yield}}
    </div>
  </template>
}

interface ContextMenuTriggerSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

class ContextMenuTrigger extends Component<ContextMenuTriggerSignature> {
  @consume(ContextMenuContext)
  context!: ContextRegistry[typeof ContextMenuContext];

  handleContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    this.context.setMousePosition({ x: event.clientX, y: event.clientY });
    this.context.setOpen(true);
  };

  <template>
    <div
      class={{cn @class}}
      data-slot="context-menu-trigger"
      {{on "contextmenu" this.handleContextMenu}}
      ...attributes
    >
      {{yield}}
    </div>
  </template>
}

interface ContextMenuGroupSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

class ContextMenuGroup extends Component<ContextMenuGroupSignature> {
  @consume(ContextMenuContext)
  menuContext!: ContextRegistry[typeof ContextMenuContext];

  @tracked currentOpenSubmenu: symbol | null = null;
  submenuCloseCallbacks: Set<() => void> = new Set();
  unregister?: () => void;

  register = modifier(() => {
    const unregister = this.menuContext.registerGroupCloseCallback?.(
      this.closeAllSubmenus
    );
    return () => unregister?.();
  });

  closeAllSubmenus = () => {
    this.currentOpenSubmenu = null;
    this.submenuCloseCallbacks.forEach((close) => close());
  };

  setOpenSubmenu = (id: symbol) => {
    this.currentOpenSubmenu = id;
  };

  registerSubmenu = (closeCallback: () => void) => {
    this.submenuCloseCallbacks.add(closeCallback);
    return () => {
      this.submenuCloseCallbacks.delete(closeCallback);
    };
  };

  @cached
  @provide(ContextMenuGroupContext)
  get context(): ContextMenuGroupContextValue {
    return {
      closeAllSubmenus: this.closeAllSubmenus,
      registerSubmenu: this.registerSubmenu,
      setOpen: this.menuContext.setOpen,
    };
  }

  <template>
    <div
      class={{cn @class}}
      data-slot="context-menu-group"
      role="group"
      {{this.register}}
      ...attributes
    >
      {{yield}}
    </div>
  </template>
}

interface ContextMenuPortalSignature {
  Blocks: {
    default: [];
  };
}

const ContextMenuPortal: TOC<ContextMenuPortalSignature> = <template>
  <div data-slot="context-menu-portal">
    {{yield}}
  </div>
</template>;

interface ContextMenuSubSignature {
  Args: {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
  };
  Blocks: {
    default: [];
  };
}

class ContextMenuSub extends Component<ContextMenuSubSignature> {
  @consume(ContextMenuGroupContext)
  groupContext?: ContextRegistry[typeof ContextMenuGroupContext];

  @consume(ContextMenuContext)
  menuContext!: ContextRegistry[typeof ContextMenuContext];

  @tracked isOpen?: boolean;
  @tracked isRendered = false;
  triggerElement: HTMLElement | null = null;
  unregister?: () => void;
  closeTimeout?: ReturnType<typeof setTimeout>;

  get open() {
    return this.args.open ?? this.isOpen ?? this.args.defaultOpen ?? false;
  }

  register = modifier(() => {
    let unregister: (() => void) | undefined;
    if (this.groupContext) {
      unregister = this.groupContext.registerSubmenu(() => {
        this.isOpen = false;
      });
    }
    return () => {
      unregister?.();
      if (this.closeTimeout) {
        clearTimeout(this.closeTimeout);
      }
    };
  });

  setOpen = (open: boolean) => {
    if (open) {
      this.groupContext?.closeAllSubmenus();
      this.isRendered = true;
      this.isOpen = true;
    } else {
      this.isOpen = false;
    }
    this.args.onOpenChange?.(open);
  };

  finishClose = () => {
    if (!this.isOpen) {
      this.isRendered = false;
    }
  };

  setTriggerElement = (element: HTMLElement | null) => {
    this.triggerElement = element;
  };

  cancelPendingClose = () => {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = undefined;
    }
  };

  setPendingClose = (timeout: ReturnType<typeof setTimeout>) => {
    this.closeTimeout = timeout;
  };

  @cached
  @provide(ContextMenuSubContext)
  get context(): ContextMenuSubContextValue {
    return {
      isOpen: this.open,
      isRendered: this.isRendered,
      setOpen: this.setOpen,
      finishClose: this.finishClose,
      triggerElement: this.triggerElement,
      setTriggerElement: this.setTriggerElement,
      parentSetOpen: this.groupContext?.setOpen ?? this.menuContext.setOpen,
      cancelPendingClose: this.cancelPendingClose,
      setPendingClose: this.setPendingClose,
    };
  }

  <template>
    <div data-slot="context-menu-sub" {{this.register}}>
      {{yield}}
    </div>
  </template>
}

interface ContextMenuRadioGroupSignature {
  Element: HTMLDivElement;
  Args: {
    value?: string;
    onValueChange?: (value: string) => void;
    class?: string;
  };
  Blocks: {
    default: [value: string, setValue: (value: string) => void];
  };
}

class ContextMenuRadioGroup extends Component<ContextMenuRadioGroupSignature> {
  @tracked internalValue?: string;

  get value() {
    return this.args.value ?? this.internalValue ?? '';
  }

  setValue = (value: string) => {
    this.internalValue = value;
    this.args.onValueChange?.(value);
  };

  <template>
    <div
      class={{cn @class}}
      data-slot="context-menu-radio-group"
      role="radiogroup"
      ...attributes
    >
      {{yield this.value this.setValue}}
    </div>
  </template>
}

interface ContextMenuSubTriggerSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
    inset?: boolean;
  };
  Blocks: {
    default: [];
  };
}

class ContextMenuSubTrigger extends Component<ContextMenuSubTriggerSignature> {
  @consume(ContextMenuSubContext)
  context!: ContextRegistry[typeof ContextMenuSubContext];

  @consume(ContextMenuContext)
  menuContext!: ContextRegistry[typeof ContextMenuContext];

  mouseEnterPosition: { x: number; y: number } | null = null;

  handleMouseEnter = (event: MouseEvent) => {
    this.mouseEnterPosition = { x: event.clientX, y: event.clientY };
    this.menuContext.cancelPendingItemClose?.();
    this.context.cancelPendingClose();
    this.context.setOpen(true);
  };

  isPointInTriangle(
    px: number,
    py: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number
  ): boolean {
    const sign = (
      p1x: number,
      p1y: number,
      p2x: number,
      p2y: number,
      p3x: number,
      p3y: number
    ) => {
      return (p1x - p3x) * (p2y - p3y) - (p2x - p3x) * (p1y - p3y);
    };

    const d1 = sign(px, py, x1, y1, x2, y2);
    const d2 = sign(px, py, x2, y2, x3, y3);
    const d3 = sign(px, py, x3, y3, x1, y1);

    const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
    const hasPos = d1 > 0 || d2 > 0 || d3 > 0;

    return !(hasNeg && hasPos);
  }

  isMouseMovingTowardsSubmenu(event: MouseEvent): boolean {
    if (!this.mouseEnterPosition) return false;

    const submenuContent = document.querySelector(
      '[data-slot="context-menu-sub-content"][data-state="open"]'
    );

    if (!submenuContent) return false;

    const submenuRect = submenuContent.getBoundingClientRect();
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const enterX = this.mouseEnterPosition.x;
    const enterY = this.mouseEnterPosition.y;

    const submenuLeft = submenuRect.left;
    const submenuTop = submenuRect.top;
    const submenuBottom = submenuRect.bottom;

    return this.isPointInTriangle(
      mouseX,
      mouseY,
      enterX,
      enterY,
      submenuLeft,
      submenuTop,
      submenuLeft,
      submenuBottom
    );
  }

  handleMouseLeave = (event: MouseEvent) => {
    if (this.isMouseMovingTowardsSubmenu(event)) {
      const timeout = setTimeout(() => {
        this.context.setOpen(false);
      }, SUBMENU_CLOSE_DELAY);
      this.context.setPendingClose(timeout);
    } else {
      this.context.setOpen(false);
    }
  };

  registerElement = modifier((element: HTMLElement) => {
    this.context.setTriggerElement(element);
    return () => {
      this.context.setTriggerElement(null);
    };
  });

  <template>
    <div
      class={{cn
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-inset:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
        @class
      }}
      data-inset={{@inset}}
      data-slot="context-menu-sub-trigger"
      data-state={{if this.context.isOpen "open" "closed"}}
      {{on "mouseenter" this.handleMouseEnter}}
      {{on "mouseleave" this.handleMouseLeave}}
      {{this.registerElement}}
      ...attributes
    >
      {{yield}}
      <ChevronRight class="ml-auto" />
    </div>
  </template>
}

interface ContextMenuSubContentSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

class ContextMenuSubContent extends Component<ContextMenuSubContentSignature> {
  @consume(ContextMenuSubContext)
  subContext!: ContextRegistry[typeof ContextMenuSubContext];

  @consume(ContextMenuContext)
  menuContext!: ContextRegistry[typeof ContextMenuContext];

  @tracked x = 0;
  @tracked y = 0;
  cleanup?: () => void;

  get destinationElement() {
    return document.body;
  }

  @cached
  @provide(ContextMenuContext)
  get context(): ContextMenuContextValue {
    return {
      ...this.menuContext,
      closeAllSubmenus: undefined,
    };
  }

  positionSubmenu = modifier(
    (
      element: HTMLElement,
      [triggerElement]: [HTMLElement | null | undefined]
    ) => {
      if (!triggerElement) return;

      const update = () => {
        void computePosition(triggerElement, element, {
          placement: 'right-start',
          strategy: 'fixed',
          middleware: [
            offset(4),
            flip({ fallbackAxisSideDirection: 'start' }),
            shift({ padding: 8 }),
          ],
        }).then(({ x, y }) => {
          this.x = x;
          this.y = y;
        });
      };

      this.cleanup = autoUpdate(triggerElement, element, update);

      return () => {
        this.cleanup?.();
      };
    }
  );

  get positionStyle() {
    return htmlSafe(`position: fixed; left: ${this.x}px; top: ${this.y}px;`);
  }

  handleMouseEnter = () => {
    this.menuContext.cancelPendingItemClose?.();
    this.subContext.cancelPendingClose();
  };

  handleAnimationEnd = (event: AnimationEvent) => {
    if (event.target === event.currentTarget && !this.subContext.isOpen) {
      this.subContext.finishClose();
    }
  };

  <template>
    {{#if this.subContext.isRendered}}
      {{#in-element this.destinationElement insertBefore=null}}
        <div
          class={{cn
            "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-context-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg"
            @class
          }}
          data-side="right"
          data-slot="context-menu-sub-content"
          data-state={{if this.subContext.isOpen "open" "closed"}}
          role="menu"
          style={{this.positionStyle}}
          {{on "animationend" this.handleAnimationEnd}}
          {{on "mouseenter" this.handleMouseEnter}}
          {{this.positionSubmenu this.subContext.triggerElement}}
          ...attributes
        >
          {{yield}}
        </div>
      {{/in-element}}
    {{/if}}
  </template>
}

interface ContextMenuContentSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

class ContextMenuContent extends Component<ContextMenuContentSignature> {
  @consume(ContextMenuContext)
  menuContext!: ContextRegistry[typeof ContextMenuContext];

  @tracked x = 0;
  @tracked y = 0;
  cleanup?: () => void;
  groupCloseCallbacks: Set<() => void> = new Set();
  pendingItemCloseTimeout?: ReturnType<typeof setTimeout>;

  get destinationElement() {
    return document.body;
  }

  closeAllSubmenus = () => {
    this.groupCloseCallbacks.forEach((close) => close());
  };

  registerGroupCloseCallback = (closeCallback: () => void) => {
    this.groupCloseCallbacks.add(closeCallback);
    return () => {
      this.groupCloseCallbacks.delete(closeCallback);
    };
  };

  cancelPendingItemClose = () => {
    if (this.pendingItemCloseTimeout) {
      clearTimeout(this.pendingItemCloseTimeout);
      this.pendingItemCloseTimeout = undefined;
    }
  };

  setPendingItemClose = (timeout: ReturnType<typeof setTimeout>) => {
    this.pendingItemCloseTimeout = timeout;
  };

  @cached
  @provide(ContextMenuContext)
  get context(): ContextMenuContextValue {
    return {
      ...this.menuContext,
      closeAllSubmenus: this.closeAllSubmenus,
      registerGroupCloseCallback: this.registerGroupCloseCallback,
      cancelPendingItemClose: this.cancelPendingItemClose,
      setPendingItemClose: this.setPendingItemClose,
    };
  }

  handleClickOutside = () => {
    this.menuContext.setOpen(false);
  };

  handleAnimationEnd = (event: AnimationEvent) => {
    if (event.target === event.currentTarget && !this.menuContext.isOpen) {
      this.menuContext.finishClose();
    }
  };

  positionContent = modifier((element: HTMLElement) => {
    if (!this.menuContext.mousePosition) return;

    const { x, y } = this.menuContext.mousePosition;

    const virtualElement = {
      getBoundingClientRect() {
        return {
          width: 0,
          height: 0,
          x,
          y,
          top: y,
          left: x,
          right: x,
          bottom: y,
        };
      },
    };

    const update = () => {
      void computePosition(virtualElement, element, {
        placement: 'bottom-start',
        strategy: 'fixed',
        middleware: [offset(4), flip(), shift({ padding: 8 })],
      }).then(({ x, y }) => {
        this.x = x;
        this.y = y;
      });
    };

    this.cleanup = autoUpdate(virtualElement, element, update);

    return () => {
      this.cleanup?.();
    };
  });

  get positionStyle() {
    return htmlSafe(`position: fixed; left: ${this.x}px; top: ${this.y}px;`);
  }

  <template>
    {{#if this.context.isRendered}}
      {{#in-element this.destinationElement insertBefore=null}}
        <div
          class={{cn
            "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-context-menu-content-available-height) min-w-[8rem] origin-(--radix-context-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md"
            @class
          }}
          data-slot="context-menu-content"
          data-state={{if this.menuContext.isOpen "open" "closed"}}
          role="menu"
          style={{this.positionStyle}}
          {{on "animationend" this.handleAnimationEnd}}
          {{onClickOutside this.handleClickOutside}}
          {{this.positionContent}}
          ...attributes
        >
          {{yield}}
        </div>
      {{/in-element}}
    {{/if}}
  </template>
}

interface ContextMenuItemSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
    inset?: boolean;
    disabled?: boolean;
    variant?: 'default' | 'destructive';
    onSelect?: () => void;
  };
  Blocks: {
    default: [];
  };
}

class ContextMenuItem extends Component<ContextMenuItemSignature> {
  @consume(ContextMenuContext)
  menuContext!: ContextRegistry[typeof ContextMenuContext];

  handleMouseEnter = () => {
    this.menuContext.cancelPendingItemClose?.();
    const timeout = setTimeout(() => {
      this.menuContext.closeAllSubmenus?.();
    }, SUBMENU_CLOSE_DELAY);
    this.menuContext.setPendingItemClose?.(timeout);
  };

  handleClick = () => {
    if (!this.args.disabled) {
      this.args.onSelect?.();
      this.menuContext.setOpen(false);
    }
  };

  <template>
    <div
      class={{cn
        "focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:text-destructive! [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
        @class
      }}
      data-disabled={{@disabled}}
      data-inset={{@inset}}
      data-slot="context-menu-item"
      data-variant={{@variant}}
      role="menuitem"
      {{on "click" this.handleClick}}
      {{on "mouseenter" this.handleMouseEnter}}
      ...attributes
    >
      {{yield}}
    </div>
  </template>
}

interface ContextMenuCheckboxItemSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
  };
  Blocks: {
    default: [];
  };
}

class ContextMenuCheckboxItem extends Component<ContextMenuCheckboxItemSignature> {
  @consume(ContextMenuContext)
  menuContext!: ContextRegistry[typeof ContextMenuContext];

  handleMouseEnter = () => {
    this.menuContext.cancelPendingItemClose?.();
    const timeout = setTimeout(() => {
      this.menuContext.closeAllSubmenus?.();
    }, SUBMENU_CLOSE_DELAY);
    this.menuContext.setPendingItemClose?.(timeout);
  };

  handleClick = () => {
    this.args.onCheckedChange?.(!this.args.checked);
    this.menuContext.setOpen(false);
  };

  <template>
    {{! template-lint-disable require-presentational-children }}
    <div
      aria-checked={{@checked}}
      class={{cn
        "focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
        @class
      }}
      data-slot="context-menu-checkbox-item"
      role="menuitemcheckbox"
      {{on "click" this.handleClick}}
      {{on "mouseenter" this.handleMouseEnter}}
      ...attributes
    >
      <span
        class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center"
      >
        {{#if @checked}}
          <Check class="size-4" />
        {{/if}}
      </span>
      {{yield}}
    </div>
  </template>
}

interface ContextMenuRadioItemSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
    value: string;
    currentValue?: string;
    setValue?: (value: string) => void;
  };
  Blocks: {
    default: [];
  };
}

class ContextMenuRadioItem extends Component<ContextMenuRadioItemSignature> {
  @consume(ContextMenuContext)
  menuContext!: ContextRegistry[typeof ContextMenuContext];

  get checked() {
    return this.args.currentValue === this.args.value;
  }

  handleMouseEnter = () => {
    this.menuContext.cancelPendingItemClose?.();
    const timeout = setTimeout(() => {
      this.menuContext.closeAllSubmenus?.();
    }, SUBMENU_CLOSE_DELAY);
    this.menuContext.setPendingItemClose?.(timeout);
  };

  handleClick = () => {
    this.args.setValue?.(this.args.value);
    this.menuContext.setOpen(false);
  };

  <template>
    {{! template-lint-disable require-presentational-children }}
    <div
      aria-checked={{this.checked}}
      class={{cn
        "focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
        @class
      }}
      data-slot="context-menu-radio-item"
      role="menuitemradio"
      {{on "click" this.handleClick}}
      {{on "mouseenter" this.handleMouseEnter}}
      ...attributes
    >
      <span
        class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center"
      >
        {{#if this.checked}}
          <span class="bg-primary size-2 rounded-full" />
        {{/if}}
      </span>
      {{yield}}
    </div>
  </template>
}

interface ContextMenuLabelSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
    inset?: boolean;
  };
  Blocks: {
    default: [];
  };
}

class ContextMenuLabel extends Component<ContextMenuLabelSignature> {
  @consume(ContextMenuContext)
  menuContext!: ContextRegistry[typeof ContextMenuContext];

  handleMouseEnter = () => {
    this.menuContext.closeAllSubmenus?.();
  };

  <template>
    <div
      class={{cn
        "text-foreground px-2 py-1.5 text-sm font-medium data-inset:pl-8"
        @class
      }}
      data-inset={{@inset}}
      data-slot="context-menu-label"
      {{on "mouseenter" this.handleMouseEnter}}
      ...attributes
    >
      {{yield}}
    </div>
  </template>
}

interface ContextMenuSeparatorSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const ContextMenuSeparator: TOC<ContextMenuSeparatorSignature> = <template>
  <div
    class={{cn "bg-border -mx-1 my-1 h-px" @class}}
    data-slot="context-menu-separator"
    role="separator"
    ...attributes
  ></div>
</template>;

interface ContextMenuShortcutSignature {
  Element: HTMLSpanElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const ContextMenuShortcut: TOC<ContextMenuShortcutSignature> = <template>
  <span
    class={{cn "text-muted-foreground ml-auto text-xs tracking-widest" @class}}
    data-slot="context-menu-shortcut"
    ...attributes
  >
    {{yield}}
  </span>
</template>;

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuRadioGroup,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
};
