import { hash } from '@ember/helper';
import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { modifier } from 'ember-modifier';
import { provide, consume } from 'ember-provide-consume-context';

import { cn } from '@/lib/utils';

import type { TOC } from '@ember/component/template-only';

const AlertDialogContext = 'alert-dialog-context' as const;

interface AlertDialogContextValue {
  open: boolean;
  isRendered: boolean;
  setOpen: (open: boolean) => void;
  finishClose: () => void;
}

interface ContextRegistry {
  [AlertDialogContext]: AlertDialogContextValue;
}

interface AlertDialogSignature {
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

class AlertDialog extends Component<AlertDialogSignature> {
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

  @provide(AlertDialogContext)
  get context(): AlertDialogContextValue {
    return {
      open: this.open,
      isRendered: this.isRendered,
      setOpen: this.setOpen,
      finishClose: this.finishClose,
    };
  }

  <template>
    <div class={{cn @class}} data-slot="alert-dialog" ...attributes>
      {{yield}}
    </div>
  </template>
}

interface AlertDialogTriggerSignature {
  Element: HTMLButtonElement;
  Args: {
    class?: string;
    asChild?: boolean;
  };
  Blocks: {
    default: [];
  };
}

class AlertDialogTrigger extends Component<AlertDialogTriggerSignature> {
  @consume(AlertDialogContext)
  context!: ContextRegistry[typeof AlertDialogContext];

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
        data-slot="alert-dialog-trigger"
        type="button"
        {{on "click" this.handleClick}}
        ...attributes
      >
        {{yield}}
      </button>
    {{/if}}
  </template>
}

interface AlertDialogPortalSignature {
  Blocks: {
    default: [];
  };
}

const AlertDialogPortal: TOC<AlertDialogPortalSignature> = <template>
  <div data-slot="alert-dialog-portal">
    {{yield}}
  </div>
</template>;

interface AlertDialogOverlaySignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

class AlertDialogOverlay extends Component<AlertDialogOverlaySignature> {
  @consume(AlertDialogContext)
  context!: ContextRegistry[typeof AlertDialogContext];

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
      data-slot="alert-dialog-overlay"
      data-state={{if this.context.open "open" "closed"}}
      {{on "animationend" this.handleAnimationEnd}}
      ...attributes
    ></div>
  </template>
}

interface AlertDialogContentSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

class AlertDialogContent extends Component<AlertDialogContentSignature> {
  @consume(AlertDialogContext)
  context!: ContextRegistry[typeof AlertDialogContext];

  get destinationElement() {
    return document.body;
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
        <AlertDialogOverlay />
        <div
          aria-modal="true"
          class={{cn
            "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg"
            @class
          }}
          data-slot="alert-dialog-content"
          data-state={{if this.context.open "open" "closed"}}
          role="alertdialog"
          tabindex="-1"
          {{on "animationend" this.handleAnimationEnd}}
          {{on "click" this.handleOverlayClick}}
          {{on "keydown" this.handleKeyDown}}
          {{this.scrollLock enabled=this.context.open}}
          ...attributes
        >
          {{yield}}
        </div>
      {{/in-element}}
    {{/if}}
  </template>
}

interface AlertDialogHeaderSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const AlertDialogHeader: TOC<AlertDialogHeaderSignature> = <template>
  <div
    class={{cn "flex flex-col gap-2 text-center sm:text-left" @class}}
    data-slot="alert-dialog-header"
    ...attributes
  >
    {{yield}}
  </div>
</template>;

interface AlertDialogFooterSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const AlertDialogFooter: TOC<AlertDialogFooterSignature> = <template>
  <div
    class={{cn "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end" @class}}
    data-slot="alert-dialog-footer"
    ...attributes
  >
    {{yield}}
  </div>
</template>;

interface AlertDialogTitleSignature {
  Element: HTMLHeadingElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const AlertDialogTitle: TOC<AlertDialogTitleSignature> = <template>
  <h2
    class={{cn "text-lg font-semibold" @class}}
    data-slot="alert-dialog-title"
    ...attributes
  >
    {{yield}}
  </h2>
</template>;

interface AlertDialogDescriptionSignature {
  Element: HTMLParagraphElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const AlertDialogDescription: TOC<AlertDialogDescriptionSignature> = <template>
  <p
    class={{cn "text-muted-foreground text-sm" @class}}
    data-slot="alert-dialog-description"
    ...attributes
  >
    {{yield}}
  </p>
</template>;

interface AlertDialogActionSignature {
  Element: HTMLButtonElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

class AlertDialogAction extends Component<AlertDialogActionSignature> {
  @consume(AlertDialogContext)
  context!: ContextRegistry[typeof AlertDialogContext];

  handleClick = () => {
    this.context.setOpen(false);
  };

  <template>
    <button
      class={{cn
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
        @class
      }}
      data-slot="alert-dialog-action"
      type="button"
      {{on "click" this.handleClick}}
      ...attributes
    >
      {{yield}}
    </button>
  </template>
}

interface AlertDialogCancelSignature {
  Element: HTMLButtonElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

class AlertDialogCancel extends Component<AlertDialogCancelSignature> {
  @consume(AlertDialogContext)
  context!: ContextRegistry[typeof AlertDialogContext];

  handleClick = () => {
    this.context.setOpen(false);
  };

  <template>
    <button
      class={{cn
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2"
        @class
      }}
      data-slot="alert-dialog-cancel"
      type="button"
      {{on "click" this.handleClick}}
      ...attributes
    >
      {{yield}}
    </button>
  </template>
}

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
