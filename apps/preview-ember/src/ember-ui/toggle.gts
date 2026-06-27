import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { cn } from '@/ember-lib/utils';

type Variant = 'default' | 'outline';
type Size = 'default' | 'sm' | 'lg';

interface ToggleSignature {
  Element: HTMLButtonElement;
  Args: {
    variant?: Variant;
    size?: Size;
    class?: string;
    pressed?: boolean;
    defaultPressed?: boolean;
    onPressedChange?: (pressed: boolean) => void;
    disabled?: boolean;
  };
  Blocks: {
    default: [];
  };
}

function toggleVariants(
  variant: Variant = 'default',
  size: Size = 'default',
  className?: string
): string {
  const baseClasses =
    "cn-toggle group/toggle inline-flex items-center justify-center whitespace-nowrap outline-none hover:bg-muted focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0";

  const variantClasses: Record<Variant, string> = {
    default: 'cn-toggle-variant-default',
    outline: 'cn-toggle-variant-outline',
  };

  const sizeClasses: Record<Size, string> = {
    default: 'cn-toggle-size-default',
    sm: 'cn-toggle-size-sm',
    lg: 'cn-toggle-size-lg',
  };

  return cn(baseClasses, variantClasses[variant], sizeClasses[size], className);
}

class Toggle extends Component<ToggleSignature> {
  @tracked internalPressed?: boolean;

  get pressed() {
    return (
      this.args.pressed ??
      this.internalPressed ??
      this.args.defaultPressed ??
      false
    );
  }

  get classes() {
    return toggleVariants(
      this.args.variant ?? 'default',
      this.args.size ?? 'default',
      this.args.class
    );
  }

  handleClick = () => {
    if (!this.args.disabled) {
      const newPressed = !this.pressed;
      this.internalPressed = newPressed;
      this.args.onPressedChange?.(newPressed);
    }
  };

  <template>
    <button
      aria-pressed={{this.pressed}}
      class={{this.classes}}
      data-slot="toggle"
      data-state={{if this.pressed "on" "off"}}
      disabled={{@disabled}}
      type="button"
      {{on "click" this.handleClick}}
      ...attributes
    >
      {{yield}}
    </button>
  </template>
}

export { Toggle, toggleVariants };
