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
import { tracked } from '@glimmer/tracking';
import { cached } from '@glimmer/tracking';
import onClickOutside from 'ember-click-outside/modifiers/on-click-outside';
import { modifier } from 'ember-modifier';
import { provide, consume } from 'ember-provide-consume-context';

import { cn } from '@/ember-lib/utils';

import type { TOC } from '@ember/component/template-only';

import Check from '~icons/ms/check';
import ChevronDown from '~icons/ms/keyboard_arrow_down';
import ChevronUp from '~icons/ms/keyboard_arrow_up';

const SelectContext = 'select-context' as const;

interface SelectContextValue {
  value: string;
  selectedLabel: string;
  isOpen: boolean;
  isRendered: boolean;
  disabled: boolean;
  toggle: () => void;
  close: () => void;
  finishClose: () => void;
  selectValue: (value: string, label: string) => void;
  triggerElement: HTMLElement | null;
  setTriggerElement: (element: HTMLElement | null) => void;
}

interface ContextRegistry {
  [SelectContext]: SelectContextValue;
}

interface SelectSignature {
  Args: {
    value?: string;
    defaultValue?: string;
    valueLabel?: string;
    onValueChange?: (value: string) => void;
    disabled?: boolean;
    name?: string;
    required?: boolean;
  };
  Blocks: {
    default: [];
  };
}

class Select extends Component<SelectSignature> {
  @tracked isOpen = false;
  @tracked isRendered = false;
  @tracked selectedValue?: string;
  @tracked selectedLabel = '';
  triggerElement: HTMLElement | null = null;

  get value() {
    return (
      this.args.value ?? this.selectedValue ?? this.args.defaultValue ?? ''
    );
  }

  get resolvedLabel() {
    return this.selectedLabel || this.args.valueLabel || '';
  }

  toggle = () => {
    if (!this.args.disabled) {
      if (this.isOpen) {
        this.close();
      } else {
        this.isRendered = true;
        this.isOpen = true;
      }
    }
  };

  close = () => {
    this.isOpen = false;
  };

  finishClose = () => {
    if (!this.isOpen) {
      this.isRendered = false;
    }
  };

  selectValue = (value: string, label: string) => {
    this.selectedValue = value;
    this.selectedLabel = label;
    this.close();
    this.args.onValueChange?.(value);
  };

  setTriggerElement = (element: HTMLElement | null) => {
    this.triggerElement = element;
  };

  @cached
  @provide(SelectContext)
  get context(): SelectContextValue {
    return {
      value: this.value,
      selectedLabel: this.resolvedLabel,
      isOpen: this.isOpen,
      isRendered: this.isRendered,
      disabled: this.args.disabled ?? false,
      toggle: this.toggle,
      close: this.close,
      finishClose: this.finishClose,
      selectValue: this.selectValue,
      triggerElement: this.triggerElement,
      setTriggerElement: this.setTriggerElement,
    };
  }

  <template>
    {{! template-lint-disable no-yield-only }}
    {{yield}}
  </template>
}

interface SelectTriggerSignature {
  Element: HTMLButtonElement;
  Args: {
    class?: string;
    size?: 'sm' | 'default';
  };
  Blocks: {
    default: [];
  };
}

class SelectTrigger extends Component<SelectTriggerSignature> {
  @consume(SelectContext) context!: ContextRegistry[typeof SelectContext];

  registerElement = modifier((element: HTMLElement) => {
    this.context.setTriggerElement(element);
    return () => {
      this.context.setTriggerElement(null);
    };
  });

  <template>
    <button
      class={{cn
        "cn-select-trigger flex w-fit items-center justify-between whitespace-nowrap outline-none disabled:cursor-not-allowed disabled:opacity-50 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center [&_svg]:pointer-events-none [&_svg]:shrink-0"
        @class
      }}
      data-placeholder={{if this.context.value null ""}}
      data-size={{if @size @size "default"}}
      data-slot="select-trigger"
      disabled={{this.context.disabled}}
      type="button"
      {{on "click" this.context.toggle}}
      {{this.registerElement}}
      ...attributes
    >
      {{yield}}
      <ChevronDown class="cn-select-trigger-icon pointer-events-none" />
    </button>
  </template>
}

interface SelectValueSignature {
  Element: HTMLSpanElement;
  Args: {
    class?: string;
    placeholder?: string;
  };
  Blocks: {
    default: [];
  };
}

class SelectValue extends Component<SelectValueSignature> {
  @consume(SelectContext) context!: ContextRegistry[typeof SelectContext];

  <template>
    <span class={{cn @class}} data-slot="select-value" ...attributes>
      {{#if (has-block)}}
        {{yield}}
      {{else if this.context.selectedLabel}}
        {{this.context.selectedLabel}}
      {{else if this.context.value}}
        {{this.context.value}}
      {{else}}
        {{@placeholder}}
      {{/if}}
    </span>
  </template>
}

interface SelectContentSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
    position?: 'popper' | 'item-aligned';
    align?: 'start' | 'center' | 'end';
  };
  Blocks: {
    default: [];
  };
}

class SelectContent extends Component<SelectContentSignature> {
  @consume(SelectContext) context!: ContextRegistry[typeof SelectContext];

  @tracked x = 0;
  @tracked y = 0;
  @tracked triggerWidth = 0;
  cleanup?: () => void;

  get destinationElement() {
    return document.body;
  }

  get positionClass() {
    return this.args.position === 'popper'
      ? 'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1'
      : '';
  }

  handleClickOutside = () => {
    this.context.close();
  };

  handleAnimationEnd = (event: AnimationEvent) => {
    if (event.target === event.currentTarget && !this.context.isOpen) {
      this.context.finishClose();
    }
  };

  positionContent = modifier(
    (
      element: HTMLElement,
      [triggerElement]: [HTMLElement | null | undefined]
    ) => {
      if (!triggerElement) return;

      const align = this.args.align ?? 'start';
      const placementMap: Record<string, Placement> = {
        start: 'bottom-start',
        center: 'bottom',
        end: 'bottom-end',
      };

      const update = () => {
        void computePosition(triggerElement, element, {
          placement: placementMap[align] || 'bottom-start',
          strategy: 'fixed',
          middleware: [offset(4), flip(), shift({ padding: 8 })],
        }).then(({ x, y }) => {
          this.x = x;
          this.y = y;
          this.triggerWidth = triggerElement.offsetWidth;
          element.style.setProperty(
            '--select-trigger-width',
            `${triggerElement.offsetWidth}px`
          );
        });
      };

      this.cleanup = autoUpdate(triggerElement, element, update);

      return () => {
        this.cleanup?.();
      };
    }
  );

  get positionStyle() {
    return htmlSafe(
      `position: fixed; left: ${this.x}px; top: ${this.y}px; z-index: 50; --select-trigger-width: ${this.triggerWidth}px;`
    );
  }

  <template>
    {{#if this.context.isRendered}}
      {{#in-element this.destinationElement insertBefore=null}}
        <div
          class={{cn
            "cn-select-content cn-menu-target cn-menu-translucent relative z-50 max-h-96 overflow-x-hidden overflow-y-auto"
            this.positionClass
            @class
          }}
          data-slot="select-content"
          data-state={{if this.context.isOpen "open" "closed"}}
          role="listbox"
          style={{this.positionStyle}}
          {{on "animationend" this.handleAnimationEnd}}
          {{onClickOutside this.handleClickOutside}}
          {{this.positionContent this.context.triggerElement}}
          ...attributes
        >
          <div class="cn-select-viewport p-1">
            {{yield}}
          </div>
        </div>
      {{/in-element}}
    {{/if}}
  </template>
}

interface SelectGroupSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const SelectGroup: TOC<SelectGroupSignature> = <template>
  <div class={{cn "cn-select-group" @class}} data-slot="select-group" ...attributes>
    {{yield}}
  </div>
</template>;

interface SelectLabelSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const SelectLabel: TOC<SelectLabelSignature> = <template>
  <div
    class={{cn "cn-select-label" @class}}
    data-slot="select-label"
    ...attributes
  >
    {{yield}}
  </div>
</template>;

interface SelectItemSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
    value: string;
    disabled?: boolean;
  };
  Blocks: {
    default: [];
  };
}

class SelectItem extends Component<SelectItemSignature> {
  @consume(SelectContext) context!: ContextRegistry[typeof SelectContext];

  itemElement: HTMLDivElement | null = null;

  get isSelected() {
    return this.args.value === this.context.value;
  }

  handleClick = () => {
    if (!this.args.disabled) {
      const label = this.itemElement?.textContent?.trim() || this.args.value;
      this.context.selectValue(this.args.value, label);
    }
  };

  registerElement = modifier((element: HTMLDivElement) => {
    this.itemElement = element;
  });

  <template>
    {{! template-lint-disable require-mandatory-role-attributes require-presentational-children }}
    <div
      class={{cn
        "cn-select-item relative flex w-full cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0"
        @class
      }}
      data-disabled={{if @disabled "true"}}
      data-slot="select-item"
      role="option"
      {{on "click" this.handleClick}}
      {{this.registerElement}}
      ...attributes
    >
      <span
        class="cn-select-item-indicator"
        data-slot="select-item-indicator"
      >
        {{#if this.isSelected}}
          <Check class="cn-select-item-indicator-icon pointer-events-none" />
        {{/if}}
      </span>
      {{yield}}
    </div>
  </template>
}

interface SelectSeparatorSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
}

const SelectSeparator: TOC<SelectSeparatorSignature> = <template>
  <div
    class={{cn "cn-select-separator pointer-events-none" @class}}
    data-slot="select-separator"
    ...attributes
  ></div>
</template>;

interface SelectScrollUpButtonSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
}

const SelectScrollUpButton: TOC<SelectScrollUpButtonSignature> = <template>
  <div
    class={{cn "cn-select-scroll-up-button" @class}}
    data-slot="select-scroll-up-button"
    ...attributes
  >
    <ChevronUp class="size-4" />
  </div>
</template>;

interface SelectScrollDownButtonSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
}

const SelectScrollDownButton: TOC<SelectScrollDownButtonSignature> = <template>
  <div
    class={{cn "cn-select-scroll-down-button" @class}}
    data-slot="select-scroll-down-button"
    ...attributes
  >
    <ChevronDown class="size-4" />
  </div>
</template>;

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
