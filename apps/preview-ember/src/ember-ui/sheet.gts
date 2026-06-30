import { hash } from '@ember/helper';
import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { modifier } from 'ember-modifier';
import { provide, consume } from 'ember-provide-consume-context';

import { cn } from '@/ember-lib/utils';

import type { TOC } from '@ember/component/template-only';

import X from '~icons/ms/close';

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
        "cn-sheet-overlay fixed inset-0 z-50 duration-100 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
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
    return cn(
      'cn-sheet-content data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[side=bottom]:data-[state=open]:slide-in-from-bottom-10 data-[side=left]:data-[state=open]:slide-in-from-left-10 data-[side=right]:data-[state=open]:slide-in-from-right-10 data-[side=top]:data-[state=open]:slide-in-from-top-10 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[side=bottom]:data-[state=closed]:slide-out-to-bottom-10 data-[side=left]:data-[state=closed]:slide-out-to-left-10 data-[side=right]:data-[state=closed]:slide-out-to-right-10 data-[side=top]:data-[state=closed]:slide-out-to-top-10',
      this.args.class
    );
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
          data-side={{if @side @side "right"}}
          data-state={{if this.context.open "open" "closed"}}
          role="dialog"
          {{on "animationend" this.handleAnimationEnd}}
          {{this.scrollLock enabled=this.context.open}}
          ...attributes
        >
          {{yield}}
          <button
            class="cn-sheet-close"
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
    class={{cn "cn-sheet-header flex flex-col" @class}}
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
    class={{cn "cn-sheet-footer mt-auto flex flex-col" @class}}
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
    class={{cn "cn-sheet-title cn-font-heading" @class}}
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
    class={{cn "cn-sheet-description" @class}}
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
