import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { modifier } from 'ember-modifier';
import { provide, consume } from 'ember-provide-consume-context';

import { cn } from '@/ember-lib/utils';

import ChevronDown from '~icons/ms/keyboard_arrow_down';

const AccordionContext = 'accordion-context' as const;
const AccordionItemContext = 'accordion-item-context' as const;

interface AccordionContextValue {
  value: string | string[];
  type: 'single' | 'multiple';
  collapsible: boolean;
  disabled: boolean;
  toggle: (itemValue: string) => void;
}

interface AccordionItemContextValue {
  value: string;
  disabled: boolean;
  isRendered: boolean;
  finishClose: () => void;
}

interface ContextRegistry {
  [AccordionContext]: AccordionContextValue;
  [AccordionItemContext]: AccordionItemContextValue;
}

interface AccordionItemSignature {
  Element: HTMLDivElement;
  Args: {
    value: string;
    class?: string;
    disabled?: boolean;
  };
  Blocks: {
    default: [];
  };
}

interface AccordionTriggerSignature {
  Element: HTMLButtonElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

interface AccordionContentSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

interface AccordionSignature {
  Element: HTMLDivElement;
  Args: {
    type?: 'single' | 'multiple';
    value?: string | string[];
    defaultValue?: string | string[];
    onValueChange?: (value: string | string[]) => void;
    collapsible?: boolean;
    disabled?: boolean;
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

class AccordionTrigger extends Component<AccordionTriggerSignature> {
  @consume(AccordionContext)
  accordionContext!: ContextRegistry[typeof AccordionContext];
  @consume(AccordionItemContext)
  itemContext!: ContextRegistry[typeof AccordionItemContext];

  get isOpen() {
    if (Array.isArray(this.accordionContext.value)) {
      return this.accordionContext.value.includes(this.itemContext.value);
    }
    return this.accordionContext.value === this.itemContext.value;
  }

  handleClick = () => {
    if (!this.itemContext.disabled && !this.accordionContext.disabled) {
      this.accordionContext.toggle(this.itemContext.value);
    }
  };

  <template>
    <h3 class="flex">
      <button
        class={{cn
          "cn-accordion-trigger group/accordion-trigger relative flex flex-1 items-start justify-between border border-transparent transition-all outline-none disabled:pointer-events-none disabled:opacity-50"
          @class
        }}
        data-state={{if this.isOpen "open" "closed"}}
        type="button"
        {{on "click" this.handleClick}}
        ...attributes
      >
        {{yield}}
        <ChevronDown
          class="cn-accordion-trigger-icon pointer-events-none shrink-0 transition-transform duration-200 [&[data-state=open]]:rotate-180"
        />
      </button>
    </h3>
  </template>
}

class AccordionContent extends Component<AccordionContentSignature> {
  @consume(AccordionContext)
  accordionContext!: ContextRegistry[typeof AccordionContext];
  @consume(AccordionItemContext)
  itemContext!: ContextRegistry[typeof AccordionItemContext];

  get isOpen() {
    if (Array.isArray(this.accordionContext.value)) {
      return this.accordionContext.value.includes(this.itemContext.value);
    }
    return this.accordionContext.value === this.itemContext.value;
  }

  handleAnimationEnd = (event: AnimationEvent) => {
    if (event.target === event.currentTarget && !this.isOpen) {
      this.itemContext.finishClose();
    }
  };

  heightAnimation = modifier((element: HTMLElement) => {
    element.style.setProperty(
      '--radix-accordion-content-height',
      `${element.scrollHeight}px`
    );
  });

  <template>
    {{#if this.itemContext.isRendered}}
      <div
        class="cn-accordion-content overflow-hidden"
        data-state={{if this.isOpen "open" "closed"}}
        {{on "animationend" this.handleAnimationEnd}}
        {{this.heightAnimation}}
        ...attributes
      >
        <div class={{cn "cn-accordion-content-inner h-(--radix-accordion-content-height) [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4" @class}}>
          {{yield}}
        </div>
      </div>
    {{/if}}
  </template>
}

class AccordionItem extends Component<AccordionItemSignature> {
  @consume(AccordionContext)
  accordionContext!: ContextRegistry[typeof AccordionContext];

  @tracked isOpenOrClosing = false;

  get isOpen() {
    return Array.isArray(this.accordionContext.value)
      ? this.accordionContext.value.includes(this.args.value)
      : this.accordionContext.value === this.args.value;
  }

  get isRendered() {
    return this.isOpen || this.isOpenOrClosing;
  }

  finishClose = () => {
    if (!this.isOpen) {
      this.isOpenOrClosing = false;
    }
  };

  trackOpenState = modifier(() => {
    if (this.isOpen) {
      this.isOpenOrClosing = true;
    }
  });

  @provide(AccordionItemContext)
  get itemContext(): AccordionItemContextValue {
    return {
      value: this.args.value,
      disabled: this.args.disabled ?? false,
      isRendered: this.isRendered,
      finishClose: this.finishClose,
    };
  }

  <template>
    <div
      class={{cn "cn-accordion-item" @class}}
      data-disabled={{if @disabled "true"}}
      data-state={{if this.isOpen "open" "closed"}}
      {{this.trackOpenState}}
      ...attributes
    >
      {{yield}}
    </div>
  </template>
}

class Accordion extends Component<AccordionSignature> {
  @tracked internalValue: string | string[] | undefined = undefined;

  get value() {
    if (this.args.value !== undefined) {
      return this.args.value;
    }
    if (this.internalValue !== undefined) {
      return this.internalValue;
    }
    return this.args.defaultValue ?? (this.type === 'multiple' ? [] : '');
  }

  get type() {
    return this.args.type ?? 'single';
  }

  get collapsible() {
    return this.args.collapsible ?? false;
  }

  get disabled() {
    return this.args.disabled ?? false;
  }

  setValue = (newValue: string | string[]) => {
    this.internalValue = newValue;
    this.args.onValueChange?.(newValue);
  };

  toggle = (itemValue: string) => {
    if (this.type === 'multiple' && Array.isArray(this.value)) {
      const isCurrentlyOpen = this.value.includes(itemValue);
      const newValue = isCurrentlyOpen
        ? this.value.filter((v) => v !== itemValue)
        : [...this.value, itemValue];
      this.setValue(newValue);
    } else {
      const isCurrentlyOpen = this.value === itemValue;
      const newValue = isCurrentlyOpen && this.collapsible ? '' : itemValue;
      this.setValue(newValue);
    }
  };

  @provide(AccordionContext)
  get context(): AccordionContextValue {
    return {
      value: this.value,
      type: this.type,
      collapsible: this.collapsible,
      disabled: this.disabled,
      toggle: this.toggle,
    };
  }

  <template>
    <div class={{cn "cn-accordion flex w-full flex-col" @class}} data-orientation="vertical" ...attributes>
      {{yield}}
    </div>
  </template>
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
