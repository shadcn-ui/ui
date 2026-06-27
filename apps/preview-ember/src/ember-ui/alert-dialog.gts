import { hash } from '@ember/helper';
import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { modifier } from 'ember-modifier';
import { provide, consume } from 'ember-provide-consume-context';

import { cn } from '@/ember-lib/utils';

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
        "cn-alert-dialog-overlay fixed inset-0 z-50"
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
    size?: "default" | "sm";
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

  get size() {
    return this.args.size ?? "default";
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
            "cn-alert-dialog-content group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 outline-none"
            @class
          }}
          data-slot="alert-dialog-content"
          data-size={{this.size}}
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
    class={{cn "cn-alert-dialog-header" @class}}
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
    class={{cn
      "cn-alert-dialog-footer flex flex-col-reverse gap-2 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end"
      @class
    }}
    data-slot="alert-dialog-footer"
    ...attributes
  >
    {{yield}}
  </div>
</template>;

interface AlertDialogMediaSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const AlertDialogMedia: TOC<AlertDialogMediaSignature> = <template>
  <div
    class={{cn "cn-alert-dialog-media" @class}}
    data-slot="alert-dialog-media"
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
    class={{cn "cn-alert-dialog-title cn-font-heading" @class}}
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
    class={{cn "cn-alert-dialog-description" @class}}
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
        "cn-alert-dialog-action"
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
        "cn-alert-dialog-cancel"
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
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
