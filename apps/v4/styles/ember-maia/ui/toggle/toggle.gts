import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { cn } from '@/lib/utils';

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
    "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium hover:bg-muted hover:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[color,box-shadow] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap";

  const variantClasses: Record<Variant, string> = {
    default: 'bg-transparent',
    outline:
      'border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground',
  };

  const sizeClasses: Record<Size, string> = {
    default: 'h-9 px-2 min-w-9',
    sm: 'h-8 px-1.5 min-w-8',
    lg: 'h-10 px-2.5 min-w-10',
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
