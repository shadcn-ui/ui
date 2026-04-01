import { hash } from '@ember/helper';
import { on } from '@ember/modifier';
import { htmlSafe } from '@ember/template';
import {
  computePosition,
  flip,
  shift,
  offset,
  autoUpdate,
  type Placement,
} from '@floating-ui/dom';
import Component from '@glimmer/component';
import { tracked, cached } from '@glimmer/tracking';
import onClickOutside from 'ember-click-outside/modifiers/on-click-outside';
import { modifier } from 'ember-modifier';
import { provide, consume } from 'ember-provide-consume-context';

import { cn } from '@/lib/utils';

import type { TOC } from '@ember/component/template-only';

const PopoverContext = 'popover-context' as const;

interface PopoverContextValue {
  open: boolean;
  isRendered: boolean;
  setOpen: (open: boolean) => void;
  finishClose: () => void;
  triggerElement: HTMLElement | null;
  setTriggerElement: (element: HTMLElement | null) => void;
}

interface ContextRegistry {
  [PopoverContext]: PopoverContextValue;
}

interface PopoverSignature {
  Args: {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
  };
  Blocks: {
    default: [];
  };
}

class Popover extends Component<PopoverSignature> {
  @tracked isOpen?: boolean;
  @tracked isOpenOrClosing = false;
  triggerElement: HTMLElement | null = null;

  get open() {
    return this.args.open ?? this.isOpen ?? this.args.defaultOpen ?? false;
  }

  get isRendered() {
    return this.open || this.isOpenOrClosing;
  }

  setOpen = (open: boolean) => {
    if (open) {
      this.isOpenOrClosing = true;
      this.isOpen = true;
    } else {
      this.isOpen = false;
    }
    this.args.onOpenChange?.(open);
  };

  finishClose = () => {
    if (!this.open) {
      this.isOpenOrClosing = false;
    }
  };

  setTriggerElement = (element: HTMLElement | null) => {
    this.triggerElement = element;
  };

  @cached
  @provide(PopoverContext)
  get context(): PopoverContextValue {
    return {
      open: this.open,
      isRendered: this.isRendered,
      setOpen: this.setOpen,
      finishClose: this.finishClose,
      triggerElement: this.triggerElement,
      setTriggerElement: this.setTriggerElement,
    };
  }

  <template>
    {{! template-lint-disable no-yield-only }}
    {{yield}}
  </template>
}

interface PopoverTriggerSignatureAsChild {
  Element: HTMLButtonElement;
  Args: {
    class?: string;
    asChild: true;
  };
  Blocks: {
    default: [
      trigger: {
        modifiers: typeof PopoverTrigger.prototype.applyTriggerBehavior;
      },
    ];
  };
}

interface PopoverTriggerSignatureAsRoot {
  Element: HTMLButtonElement;
  Args: {
    class?: string;
    asChild?: false;
  };
  Blocks: {
    default: [];
  };
}

type PopoverTriggerSignature =
  | PopoverTriggerSignatureAsChild
  | PopoverTriggerSignatureAsRoot;

class PopoverTrigger extends Component<PopoverTriggerSignature> {
  @consume(PopoverContext) context!: ContextRegistry[typeof PopoverContext];

  handleClick = () => {
    const newOpen = !this.context.open;
    this.context.setOpen(newOpen);
  };

  registerElement = modifier((element: HTMLElement) => {
    this.context.setTriggerElement(element);
    return () => {
      this.context.setTriggerElement(null);
    };
  });

  applyTriggerBehavior = modifier((element: HTMLElement) => {
    element.setAttribute('data-slot', 'popover-trigger');
    element.addEventListener('click', this.handleClick);
    this.context.setTriggerElement(element);
    return () => {
      element.removeEventListener('click', this.handleClick);
      this.context.setTriggerElement(null);
    };
  });

  <template>
    {{#if @asChild}}
      {{yield (hash modifiers=this.applyTriggerBehavior)}}
    {{else}}
      <button
        class={{cn @class}}
        data-slot="popover-trigger"
        type="button"
        {{on "click" this.handleClick}}
        {{this.registerElement}}
        ...attributes
      >
        {{yield}}
      </button>
    {{/if}}
  </template>
}

interface PopoverAnchorSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const PopoverAnchor: TOC<PopoverAnchorSignature> = <template>
  <div class={{cn @class}} data-slot="popover-anchor" ...attributes>
    {{yield}}
  </div>
</template>;

interface PopoverContentSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
    align?: 'start' | 'center' | 'end';
    side?: 'top' | 'right' | 'bottom' | 'left';
    sideOffset?: number;
  };
  Blocks: {
    default: [];
  };
}

class PopoverContent extends Component<PopoverContentSignature> {
  @consume(PopoverContext) context!: ContextRegistry[typeof PopoverContext];
  @tracked x = 0;
  @tracked y = 0;
  cleanup?: () => void;

  get destinationElement() {
    return document.body;
  }

  handleClickOutside = () => {
    this.context.setOpen(false);
  };

  positionContent = modifier((element: HTMLElement) => {
    const triggerElement = this.context.triggerElement;
    if (!triggerElement) return;

    const align = this.args.align ?? 'center';
    const side = this.args.side ?? 'bottom';
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

    const placement =
      placementMap[`${side}-${align}`] || ('bottom' as Placement);

    const update = () => {
      void computePosition(triggerElement, element, {
        placement,
        strategy: 'fixed',
        middleware: [
          offset(this.args.sideOffset ?? 4),
          flip(),
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
  });

  handleAnimationEnd = (event: AnimationEvent) => {
    if (event.target === event.currentTarget && !this.context.open) {
      this.context.finishClose();
    }
  };

  get positionStyle() {
    return htmlSafe(
      `position: fixed; left: ${this.x}px; top: ${this.y}px; z-index: 50;`
    );
  }

  <template>
    {{#if this.context.isRendered}}
      {{#in-element this.destinationElement insertBefore=null}}
        <div
          class={{cn
            "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden"
            @class
          }}
          data-align={{if @align @align "center"}}
          data-side={{if @side @side "bottom"}}
          data-slot="popover-content"
          data-state={{if this.context.open "open" "closed"}}
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

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
