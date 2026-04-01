import { hash } from '@ember/helper';
import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { modifier } from 'ember-modifier';
import { provide, consume } from 'ember-provide-consume-context';

import { cn } from '@/lib/utils';

import type { TOC } from '@ember/component/template-only';

import XIcon from '~icons/lucide/x';

const DialogContext = 'dialog-context' as const;

interface DialogContextValue {
  open: boolean;
  isRendered: boolean;
  setOpen: (open: boolean) => void;
  finishClose: () => void;
}

interface ContextRegistry {
  [DialogContext]: DialogContextValue;
}

interface DialogSignature {
  Args: {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    class?: string;
  };
  Blocks: {
    default: [];
  };
  Element: HTMLDivElement;
}

class Dialog extends Component<DialogSignature> {
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

  @provide(DialogContext)
  get context(): DialogContextValue {
    return {
      open: this.open,
      isRendered: this.isRendered,
      setOpen: this.setOpen,
      finishClose: this.finishClose,
    };
  }

  <template>
    <div class={{cn @class}} data-slot="dialog" ...attributes>
      {{yield}}
    </div>
  </template>
}

interface DialogTriggerSignature {
  Element: HTMLButtonElement;
  Args: {
    class?: string;
    asChild?: boolean;
  };
  Blocks: {
    default: [];
  };
}

class DialogTrigger extends Component<DialogTriggerSignature> {
  @consume(DialogContext) context!: ContextRegistry[typeof DialogContext];

  handleClick = (event: MouseEvent) => {
    event.preventDefault();
    this.context.setOpen(true);
  };

  <template>
    {{#if @asChild}}
      {{yield (hash)}}
    {{else}}
      <button
        class={{cn @class}}
        data-slot="dialog-trigger"
        type="button"
        {{on "click" this.handleClick}}
        ...attributes
      >
        {{yield}}
      </button>
    {{/if}}
  </template>
}

interface DialogPortalSignature {
  Blocks: {
    default: [];
  };
}

const DialogPortal: TOC<DialogPortalSignature> = <template>
  <div data-slot="dialog-portal">
    {{yield}}
  </div>
</template>;

interface DialogOverlaySignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

class DialogOverlay extends Component<DialogOverlaySignature> {
  @consume(DialogContext) context!: ContextRegistry[typeof DialogContext];

  handleClick = () => {
    this.context.setOpen(false);
  };

  handleAnimationEnd = (event: AnimationEvent) => {
    if (event.target === event.currentTarget && !this.context.open) {
      this.context.finishClose();
    }
  };

  <template>
    <div
      class={{cn
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50"
        @class
      }}
      data-slot="dialog-overlay"
      data-state={{if this.context.open "open" "closed"}}
      role="button"
      tabindex="0"
      {{on "animationend" this.handleAnimationEnd}}
      {{on "click" this.handleClick}}
      ...attributes
    ></div>
  </template>
}

interface DialogCloseSignature {
  Element: HTMLButtonElement;
  Args: {
    class?: string;
    asChild?: boolean;
  };
  Blocks: {
    default: [];
  };
}

class DialogClose extends Component<DialogCloseSignature> {
  @consume(DialogContext) context!: ContextRegistry[typeof DialogContext];

  handleClick = () => {
    this.context.setOpen(false);
  };

  <template>
    {{#if @asChild}}
      <span
        class="contents"
        data-slot="dialog-close"
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
        data-slot="dialog-close"
        type="button"
        {{on "click" this.handleClick}}
        ...attributes
      >
        {{yield}}
      </button>
    {{/if}}
  </template>
}

interface DialogContentSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
    showCloseButton?: boolean;
  };
  Blocks: {
    default: [];
  };
}

class DialogContent extends Component<DialogContentSignature> {
  @consume(DialogContext) context!: ContextRegistry[typeof DialogContext];

  get destinationElement() {
    return document.body;
  }

  get showCloseButton() {
    return this.args.showCloseButton ?? true;
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

  handleOverlayClick = (event: MouseEvent) => {
    event.stopPropagation();
  };

  handleCloseClick = () => {
    this.context.setOpen(false);
  };

  handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      this.context.setOpen(false);
    }
  };

  handleAnimationEnd = (event: AnimationEvent) => {
    if (event.target === event.currentTarget && !this.context.open) {
      this.context.finishClose();
    }
  };

  <template>
    {{#if this.context.isRendered}}
      {{#in-element this.destinationElement insertBefore=null}}
        <DialogOverlay />
        <div
          aria-modal="true"
          class={{cn
            "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 outline-none sm:max-w-lg"
            @class
          }}
          data-slot="dialog-content"
          data-state={{if this.context.open "open" "closed"}}
          role="dialog"
          tabindex="-1"
          {{on "animationend" this.handleAnimationEnd}}
          {{on "click" this.handleOverlayClick}}
          {{on "keydown" this.handleKeyDown}}
          {{this.scrollLock enabled=this.context.open}}
          ...attributes
        >
          {{yield}}
          {{#if this.showCloseButton}}
            <DialogClose
              @class="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
            >
              <XIcon />
              <span class="sr-only">Close</span>
            </DialogClose>
          {{/if}}
        </div>
      {{/in-element}}
    {{/if}}
  </template>
}

interface DialogHeaderSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const DialogHeader: TOC<DialogHeaderSignature> = <template>
  <div
    class={{cn "flex flex-col gap-2 text-center sm:text-left" @class}}
    data-slot="dialog-header"
    ...attributes
  >
    {{yield}}
  </div>
</template>;

interface DialogFooterSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const DialogFooter: TOC<DialogFooterSignature> = <template>
  <div
    class={{cn "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end" @class}}
    data-slot="dialog-footer"
    ...attributes
  >
    {{yield}}
  </div>
</template>;

interface DialogTitleSignature {
  Element: HTMLHeadingElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const DialogTitle: TOC<DialogTitleSignature> = <template>
  <h2
    class={{cn "text-lg leading-none font-semibold" @class}}
    data-slot="dialog-title"
    ...attributes
  >
    {{yield}}
  </h2>
</template>;

interface DialogDescriptionSignature {
  Element: HTMLParagraphElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const DialogDescription: TOC<DialogDescriptionSignature> = <template>
  <p
    class={{cn "text-muted-foreground text-sm" @class}}
    data-slot="dialog-description"
    ...attributes
  >
    {{yield}}
  </p>
</template>;

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
};
