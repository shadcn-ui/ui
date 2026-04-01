import { concat } from '@ember/helper';
import { on } from '@ember/modifier';
import { htmlSafe } from '@ember/template';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { provide, consume } from 'ember-provide-consume-context';

import { toggleVariants } from '@/ui/toggle';
import { cn } from '@/lib/utils';

type Variant = 'default' | 'outline';
type Size = 'default' | 'sm' | 'lg';

const ToggleGroupContext = 'toggle-group-context' as const;

interface ToggleGroupContextValue {
  variant?: Variant;
  size?: Size;
  spacing?: number;
  value: string | string[];
  toggleValue: (value: string) => void;
  disabled?: boolean;
}

interface ContextRegistry {
  [ToggleGroupContext]: ToggleGroupContextValue;
}

interface ToggleGroupSignature {
  Element: HTMLDivElement;
  Args: {
    type?: 'single' | 'multiple';
    value?: string | string[];
    defaultValue?: string | string[];
    onValueChange?: (value: string | string[]) => void;
    disabled?: boolean;
    variant?: Variant;
    size?: Size;
    spacing?: number;
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

class ToggleGroup extends Component<ToggleGroupSignature> {
  @tracked internalValue?: string | string[];

  get value() {
    return (
      this.args.value ??
      this.internalValue ??
      this.args.defaultValue ??
      (this.type === 'multiple' ? [] : '')
    );
  }

  get type() {
    return this.args.type ?? 'single';
  }

  get spacing() {
    return this.args.spacing ?? 0;
  }

  @provide(ToggleGroupContext)
  get contextValue(): ToggleGroupContextValue {
    return {
      variant: this.args.variant,
      size: this.args.size,
      spacing: this.spacing,
      value: this.value,
      toggleValue: this.toggleValue,
      disabled: this.args.disabled,
    };
  }

  toggleValue = (itemValue: string) => {
    if (this.args.disabled) return;

    let newValue: string | string[];

    if (this.type === 'multiple') {
      const currentValues = Array.isArray(this.value) ? this.value : [];
      if (currentValues.includes(itemValue)) {
        newValue = currentValues.filter((v) => v !== itemValue);
      } else {
        newValue = [...currentValues, itemValue];
      }
    } else {
      newValue = this.value === itemValue ? '' : itemValue;
    }

    this.internalValue = newValue;
    this.args.onValueChange?.(newValue);
  };

  isPressed = (itemValue: string): boolean => {
    if (this.type === 'multiple') {
      return Array.isArray(this.value) && this.value.includes(itemValue);
    }
    return this.value === itemValue;
  };

  <template>
    <div
      class={{cn
        "group/toggle-group flex w-fit items-center gap-[--spacing(var(--gap))] rounded-md data-[spacing=default]:data-[variant=outline]:shadow-xs"
        @class
      }}
      data-size={{@size}}
      data-slot="toggle-group"
      data-spacing={{this.spacing}}
      data-variant={{@variant}}
      role="group"
      style={{htmlSafe (concat "--gap: " this.spacing ";")}}
      ...attributes
    >
      {{yield}}
    </div>
  </template>
}

interface ToggleGroupItemSignature {
  Element: HTMLButtonElement;
  Args: {
    value: string;
    variant?: Variant;
    size?: Size;
    disabled?: boolean;
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

class ToggleGroupItem extends Component<ToggleGroupItemSignature> {
  @consume(ToggleGroupContext)
  context!: ContextRegistry[typeof ToggleGroupContext];

  get variant(): Variant | undefined {
    return this.context?.variant ?? this.args.variant;
  }

  get size(): Size | undefined {
    return this.context?.size ?? this.args.size;
  }

  get spacing(): number {
    return this.context?.spacing ?? 0;
  }

  get isDisabled(): boolean {
    return this.args.disabled ?? this.context?.disabled ?? false;
  }

  get pressed(): boolean {
    const contextValue = this.context?.value;
    if (Array.isArray(contextValue)) {
      return contextValue.includes(this.args.value);
    }
    return contextValue === this.args.value;
  }

  handleClick = () => {
    if (!this.isDisabled) {
      this.context?.toggleValue(this.args.value);
    }
  };

  get classes() {
    return cn(
      toggleVariants(this.variant ?? 'default', this.size ?? 'default'),
      'w-auto min-w-0 shrink-0 px-3 focus:z-10 focus-visible:z-10',
      'data-[spacing="0"]:rounded-none data-[spacing="0"]:shadow-none data-[spacing="0"]:first:rounded-l-md data-[spacing="0"]:last:rounded-r-md data-[spacing="0"]:data-[variant=outline]:border-l-0 data-[spacing="0"]:data-[variant=outline]:first:border-l',
      this.args.class
    );
  }

  <template>
    <button
      aria-pressed={{this.pressed}}
      class={{this.classes}}
      data-size={{this.size}}
      data-slot="toggle-group-item"
      data-spacing={{this.spacing}}
      data-state={{if this.pressed "on" "off"}}
      data-variant={{this.variant}}
      disabled={{this.isDisabled}}
      type="button"
      {{on "click" this.handleClick}}
      ...attributes
    >
      {{yield}}
    </button>
  </template>
}

export { ToggleGroup, ToggleGroupItem };
