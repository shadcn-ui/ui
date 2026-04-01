import { hash } from '@ember/helper';
import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { modifier } from 'ember-modifier';
import { provide, consume } from 'ember-provide-consume-context';

import { cn } from '@/lib/utils';

import type { TOC } from '@ember/component/template-only';

import X from '~icons/lucide/x';

type Side = 'top' | 'bottom' | 'left' | 'right';

const SheetContext = 'sheet-context' as const;

interface SheetContextValue {
  open: boolean;
  isRendered: boolean;
  setOpen: (open: boolean) => void;
  finishClose: () => void;
}

interface ContextRegistry {
  [SheetContext]: SheetContextValue;
}

function sheetVariants(side: Side = 'right', className?: string): string {
  const baseClasses =
    'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500';

  const sideClasses: Record<Side, string> = {
    right:
      'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
    left: 'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
    top: 'data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b',
    bottom:
      'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t',
  };

  return cn(baseClasses, sideClasses[side], className);
}

interface SheetSignature {
  Args: {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
  };
  Blocks: {
    default: [];
  };
}

class Sheet extends Component<SheetSignature> {
  @tracked isOpen = false;
  @tracked isOpenOrClosing = false;

  get open() {
    return this.args.open ?? this.isOpen;
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

  @provide(SheetContext)
  get context(): SheetContextValue {
    return {
      open: this.open,
      isRendered: this.isRendered,
      setOpen: this.setOpen,
      finishClose: this.finishClose,
    };
  }

  <template>
    <div data-slot="sheet">
      {{yield}}
    </div>
  </template>
}

interface SheetTriggerSignature {
  Element: HTMLButtonElement;
  Args: {
    class?: string;
    asChild?: boolean;
  };
  Blocks: {
    default: [];
  };
}

class SheetTrigger extends Component<SheetTriggerSignature> {
  @consume(SheetContext) context!: ContextRegistry[typeof SheetContext];

  handleClick = () => {
    this.context.setOpen(true);
  };

  <template>
    {{#if @asChild}}
      <span
        class="contents"
        data-slot="sheet-trigger"
        role="button"
        tabindex="0"
        {{on "click" this.handleClick}}
        {{on "keydown" this.handleClick}}
        ...attributes
      >
        {{yield (hash)}}
      </span>
    {{else}}
      <button
        class={{cn @class}}
        data-slot="sheet-trigger"
        type="button"
        {{on "click" this.handleClick}}
        ...attributes
      >
        {{yield}}
      </button>
    {{/if}}
  </template>
}

interface SheetCloseSignature {
  Element: HTMLButtonElement;
  Args: {
    class?: string;
    asChild?: boolean;
  };
  Blocks: {
    default: [];
  };
}

class SheetClose extends Component<SheetCloseSignature> {
  @consume(SheetContext) context!: ContextRegistry[typeof SheetContext];

  handleClick = () => {
    this.context.setOpen(false);
  };

  <template>
    {{#if @asChild}}
      <span
        class="contents"
        data-slot="sheet-close"
        role="button"
        tabindex="0"
        {{on "click" this.handleClick}}
        {{on "keydown" this.handleClick}}
        ...attributes
      >
        {{yield (hash)}}
      </span>
    {{else}}
      <button
        class={{cn @class}}
        data-slot="sheet-close"
        type="button"
        {{on "click" this.handleClick}}
        ...attributes
      >
        {{yield}}
      </button>
    {{/if}}
  </template>
}

interface SheetPortalSignature {
  Blocks: {
    default: [];
  };
}

const SheetPortal: TOC<SheetPortalSignature> = <template>
  <div data-slot="sheet-portal">
    {{yield}}
  </div>
</template>;

interface SheetOverlaySignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

class SheetOverlay extends Component<SheetOverlaySignature> {
  @consume(SheetContext) context!: ContextRegistry[typeof SheetContext];

  handleClick = () => {
    this.context.setOpen(false);
  };

  handleAnimationEnd = (event: AnimationEvent) => {
    if (event.target === event.currentTarget && !this.context.open) {
      this.context.finishClose();
    }
  };

  <template>
    {{! template-lint-disable no-invalid-interactive }}
    <div
      class={{cn
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50"
        @class
      }}
      data-slot="sheet-overlay"
      data-state={{if this.context.open "open" "closed"}}
      {{on "animationend" this.handleAnimationEnd}}
      {{on "click" this.handleClick}}
      ...attributes
    ></div>
  </template>
}

interface SheetContentSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
    side?: Side;
  };
  Blocks: {
    default: [];
  };
}

class SheetContent extends Component<SheetContentSignature> {
  @consume(SheetContext) context!: ContextRegistry[typeof SheetContext];

  get destinationElement() {
    return document.body;
  }

  get classes() {
    return sheetVariants(this.args.side ?? 'right', this.args.class);
  }

  scrollLock = modifier(
    (_element, _positional, { enabled = true }: { enabled?: boolean } = {}) => {
      if (!enabled) {
        return;
      }

      document.body.classList.add('overflow-hidden');

      return () => {
        document.body.classList.remove('overflow-hidden');
      };
    }
  );

  handleAnimationEnd = (event: AnimationEvent) => {
    if (event.target === event.currentTarget && !this.context.open) {
      this.context.finishClose();
    }
  };

  handleCloseClick = () => {
    this.context.setOpen(false);
  };

  <template>
    {{#if this.context.isRendered}}
      {{#in-element this.destinationElement insertBefore=null}}
        <SheetOverlay />
        <div
          class={{this.classes}}
          data-slot="sheet-content"
          data-state={{if this.context.open "open" "closed"}}
          role="dialog"
          {{on "animationend" this.handleAnimationEnd}}
          {{this.scrollLock enabled=this.context.open}}
          ...attributes
        >
          {{yield}}
          <button
            class="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none"
            type="button"
            {{on "click" this.handleCloseClick}}
          >
            <X class="size-4" />
            <span class="sr-only">Close</span>
          </button>
        </div>
      {{/in-element}}
    {{/if}}
  </template>
}

interface SheetHeaderSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const SheetHeader: TOC<SheetHeaderSignature> = <template>
  <div
    class={{cn "flex flex-col gap-1.5 p-4" @class}}
    data-slot="sheet-header"
    ...attributes
  >
    {{yield}}
  </div>
</template>;

interface SheetFooterSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const SheetFooter: TOC<SheetFooterSignature> = <template>
  <div
    class={{cn "mt-auto flex flex-col gap-2 p-4" @class}}
    data-slot="sheet-footer"
    ...attributes
  >
    {{yield}}
  </div>
</template>;

interface SheetTitleSignature {
  Element: HTMLHeadingElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const SheetTitle: TOC<SheetTitleSignature> = <template>
  <h2
    class={{cn "text-foreground font-semibold" @class}}
    data-slot="sheet-title"
    ...attributes
  >
    {{yield}}
  </h2>
</template>;

interface SheetDescriptionSignature {
  Element: HTMLParagraphElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const SheetDescription: TOC<SheetDescriptionSignature> = <template>
  <p
    class={{cn "text-muted-foreground text-sm" @class}}
    data-slot="sheet-description"
    ...attributes
  >
    {{yield}}
  </p>
</template>;

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetPortal,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
