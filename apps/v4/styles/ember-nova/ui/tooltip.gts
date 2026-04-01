import { on } from '@ember/modifier';
import { htmlSafe } from '@ember/template';
import { next } from '@ember/runloop';
import {
  computePosition,
  flip,
  shift,
  offset,
  arrow,
  autoUpdate,
  type Placement,
} from '@floating-ui/dom';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { cached } from '@glimmer/tracking';
import { modifier } from 'ember-modifier';
import { provide, consume } from 'ember-provide-consume-context';

import { cn } from '@/lib/utils';

const TooltipContext = 'tooltip-context' as const;

interface TooltipContextValue {
  isOpen: boolean;
  isRendered: boolean;
  setOpen: (open: boolean) => void;
  finishClose: () => void;
  triggerElement: HTMLElement | null;
  setTriggerElement: (element: HTMLElement | null) => void;
}

interface ContextRegistry {
  [TooltipContext]: TooltipContextValue;
}

interface TooltipSignature {
  Args: {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
  };
  Blocks: {
    default: [];
  };
}

class Tooltip extends Component<TooltipSignature> {
  @tracked currentOpen?: boolean;
  @tracked isOpenOrClosing = false;
  triggerElement: HTMLElement | null = null;
  shouldClose = false;

  get isOpen() {
    return this.args.open ?? this.currentOpen ?? this.args.defaultOpen ?? false;
  }

  get isRendered() {
    return this.isOpen || this.isOpenOrClosing;
  }

  setOpen = (open: boolean) => {
    if (open) {
      this.shouldClose = false;
      this.isOpenOrClosing = true;
      this.currentOpen = true;
    } else {
      this.shouldClose = true;
      // eslint-disable-next-line ember/no-runloop
      next(() => {
        if (this.shouldClose) {
          this.currentOpen = false;
          this.shouldClose = false;
        }
      });
    }
    this.args.onOpenChange?.(open);
  };

  finishClose = () => {
    if (!this.isOpen) {
      this.isOpenOrClosing = false;
    }
  };

  setTriggerElement = (element: HTMLElement | null) => {
    this.triggerElement = element;
  };

  @cached
  @provide(TooltipContext)
  get context(): TooltipContextValue {
    return {
      isOpen: this.isOpen,
      isRendered: this.isRendered,
      setOpen: this.setOpen,
      finishClose: this.finishClose,
      triggerElement: this.triggerElement,
      setTriggerElement: this.setTriggerElement,
    };
  }

  <template>
    <div data-slot="tooltip">
      {{yield}}
    </div>
  </template>
}

interface TooltipTriggerSignature {
  Element: HTMLElement;
  Args: {
    class?: string;
    asChild?: boolean;
  };
  Blocks: {
    default: [];
  };
}

class TooltipTrigger extends Component<TooltipTriggerSignature> {
  @consume(TooltipContext) context!: ContextRegistry[typeof TooltipContext];

  handleMouseEnter = () => {
    this.context.setOpen(true);
  };

  handleMouseLeave = () => {
    this.context.setOpen(false);
  };

  handleFocus = () => {
    this.context.setOpen(true);
  };

  handleBlur = () => {
    this.context.setOpen(false);
  };

  handlePointerDown = () => {
    this.context.setOpen(false);
  };

  registerElement = modifier((element: HTMLElement) => {
    this.context.setTriggerElement(element);
    return () => {
      this.context.setTriggerElement(null);
    };
  });

  <template>
    {{#if @asChild}}
      <span
        class={{cn "inline-block" @class}}
        data-slot="tooltip-trigger"
        {{on "blur" this.handleBlur}}
        {{on "focus" this.handleFocus}}
        {{on "mouseenter" this.handleMouseEnter}}
        {{on "mouseleave" this.handleMouseLeave}}
        {{! template-lint-disable no-pointer-down-event-binding }}
        {{on "pointerdown" this.handlePointerDown}}
        {{this.registerElement}}
        ...attributes
      >
        {{yield}}
      </span>
    {{else}}
      <span
        class={{cn "inline-block" @class}}
        data-slot="tooltip-trigger"
        {{on "blur" this.handleBlur}}
        {{on "focus" this.handleFocus}}
        {{on "mouseenter" this.handleMouseEnter}}
        {{on "mouseleave" this.handleMouseLeave}}
        {{! template-lint-disable no-pointer-down-event-binding }}
        {{on "pointerdown" this.handlePointerDown}}
        {{this.registerElement}}
        ...attributes
      >
        {{yield}}
      </span>
    {{/if}}
  </template>
}

interface TooltipContentSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
    sideOffset?: number;
  };
  Blocks: {
    default: [];
  };
}

class TooltipContent extends Component<TooltipContentSignature> {
  @consume(TooltipContext) context!: ContextRegistry[typeof TooltipContext];
  @tracked x = 0;
  @tracked y = 0;
  @tracked arrowX: number | undefined;
  @tracked arrowY: number | undefined;
  @tracked actualSide: 'top' | 'right' | 'bottom' | 'left' = 'top';
  cleanup?: () => void;
  arrowElement: HTMLElement | null = null;

  get destinationElement() {
    return document.body;
  }

  positionContent = modifier((element: HTMLElement) => {
    const triggerElement = this.context.triggerElement;
    if (!triggerElement) return;

    const align = this.args.align ?? 'center';
    const side = this.args.side ?? 'top';
    const placementMap: Record<string, Placement> = {
      'top-start': 'top-start',
      'top-center': 'top',
      'top-end': 'top-end',
      'right-start': 'right-start',
      'right-center': 'right',
      'right-end': 'right-end',
      'bottom-start': 'bottom-start',
      'bottom-center': 'bottom',
      'bottom-end': 'bottom-end',
      'left-start': 'left-start',
      'left-center': 'left',
      'left-end': 'left-end',
    };

    const placement = placementMap[`${side}-${align}`] || ('top' as Placement);

    const update = () => {
      void computePosition(triggerElement, element, {
        placement,
        strategy: 'fixed',
        middleware: [
          offset(this.args.sideOffset ?? 10),
          flip(),
          shift({ padding: 8 }),
          arrow({ element: this.arrowElement! }),
        ],
      }).then(({ x, y, placement: actualPlacement, middlewareData }) => {
        this.x = x;
        this.y = y;
        this.actualSide = actualPlacement.split('-')[0] as
          | 'top'
          | 'right'
          | 'bottom'
          | 'left';

        if (middlewareData.arrow) {
          this.arrowX = middlewareData.arrow.x;
          this.arrowY = middlewareData.arrow.y;
        }
      });
    };

    this.cleanup = autoUpdate(triggerElement, element, update);

    return () => {
      this.cleanup?.();
    };
  });

  arrowModifier = modifier((element: HTMLElement) => {
    this.arrowElement = element;
    return () => {
      this.arrowElement = null;
    };
  });

  get positionStyle() {
    return htmlSafe(
      `position: fixed; left: ${this.x}px; top: ${this.y}px; z-index: 50;`
    );
  }

  get arrowStyle() {
    const side = this.actualSide;
    const styles: string[] = [];

    // For top/bottom placement, arrow x is set by floating-ui, y is at the edge
    // For left/right placement, arrow y is set by floating-ui, x is at the edge
    if (side === 'top' || side === 'bottom') {
      if (this.arrowX != null) {
        styles.push(`left: ${this.arrowX}px`);
      }
      if (side === 'top') {
        styles.push('bottom: -3px');
      } else {
        styles.push('top: -3px');
      }
    } else {
      if (this.arrowY != null) {
        styles.push(`top: ${this.arrowY}px`);
      }
      if (side === 'left') {
        styles.push('right: -3px');
      } else {
        styles.push('left: -3px');
      }
    }

    return htmlSafe(styles.join('; '));
  }

  handleAnimationEnd = (event: AnimationEvent) => {
    if (event.target === event.currentTarget && !this.context.isOpen) {
      this.context.finishClose();
    }
  };

  handleMouseEnter = () => {
    this.context.setOpen(true);
  };

  handleMouseLeave = () => {
    this.context.setOpen(false);
  };

  <template>
    {{#if this.context.isRendered}}
      {{#in-element this.destinationElement insertBefore=null}}
        <div
          class={{cn
            "z-50 rounded-md bg-foreground px-3 py-1.5 text-xs text-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
            @class
          }}
          data-align={{if @align @align "center"}}
          data-side={{this.actualSide}}
          data-slot="tooltip-content"
          data-state={{if this.context.isOpen "open" "closed"}}
          role="tooltip"
          style={{this.positionStyle}}
          {{on "animationend" this.handleAnimationEnd}}
          {{on "mouseenter" this.handleMouseEnter}}
          {{on "mouseleave" this.handleMouseLeave}}
          {{this.positionContent}}
          ...attributes
        >
          {{yield}}
          <div
            class="absolute size-2.5 rotate-45 rounded-[2px] bg-foreground"
            style={{this.arrowStyle}}
            {{this.arrowModifier}}
          ></div>
        </div>
      {{/in-element}}
    {{/if}}
  </template>
}

export { Tooltip, TooltipTrigger, TooltipContent };
