import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { provide, consume } from 'ember-provide-consume-context';

import { cn } from '@/lib/utils';

const RadioGroupContext = 'radio-group-context' as const;

interface RadioGroupContextValue {
  value: string;
  setValue: (value: string) => void;
  disabled?: boolean;
}

interface ContextRegistry {
  [RadioGroupContext]: RadioGroupContextValue;
}

interface RadioGroupSignature {
  Element: HTMLDivElement;
  Args: {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    disabled?: boolean;
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

class RadioGroup extends Component<RadioGroupSignature> {
  @tracked currentValue?: string;

  get value() {
    return this.args.value ?? this.currentValue ?? this.args.defaultValue ?? '';
  }

  setValue = (value: string) => {
    if (!this.args.disabled) {
      this.currentValue = value;
      this.args.onValueChange?.(value);
    }
  };

  @provide(RadioGroupContext)
  get context(): RadioGroupContextValue {
    return {
      value: this.value,
      setValue: this.setValue,
      disabled: this.args.disabled,
    };
  }

  <template>
    <div
      class={{cn "cn-radio-group w-full" @class}}
      data-slot="radio-group"
      role="radiogroup"
      ...attributes
    >
      {{yield}}
    </div>
  </template>
}

interface RadioGroupItemSignature {
  Element: HTMLButtonElement;
  Args: {
    value: string;
    disabled?: boolean;
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

class RadioGroupItem extends Component<RadioGroupItemSignature> {
  @consume(RadioGroupContext)
  context!: ContextRegistry[typeof RadioGroupContext];

  get checked() {
    return this.context.value === this.args.value;
  }

  get isDisabled() {
    return this.args.disabled || this.context.disabled;
  }

  handleClick = () => {
    if (!this.isDisabled) {
      this.context.setValue(this.args.value);
    }
  };

  <template>
    {{! template-lint-disable require-presentational-children }}
    <button
      aria-checked={{this.checked}}
      class={{cn
        "cn-radio-group-item group/radio-group-item peer relative aspect-square shrink-0 border outline-none after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50"
        @class
      }}
      data-slot="radio-group-item"
      data-state={{if this.checked "checked" "unchecked"}}
      disabled={{this.isDisabled}}
      role="radio"
      type="button"
      {{on "click" this.handleClick}}
      ...attributes
    >
      {{#if this.checked}}
        <span
          class="cn-radio-group-indicator"
          data-slot="radio-group-indicator"
          data-state="checked"
        >
          <span
            class="cn-radio-group-indicator-icon"
          />
        </span>
      {{/if}}
    </button>
  </template>
}

export { RadioGroup, RadioGroupItem };
