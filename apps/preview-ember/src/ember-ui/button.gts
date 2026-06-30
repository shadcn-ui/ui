import { hash } from '@ember/helper';
import Component from '@glimmer/component';

import { cn } from '@/ember-lib/utils';

type Variant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link';
type Size = 'default' | 'xs' | 'sm' | 'lg' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg';

interface ButtonSignature {
  Element: HTMLButtonElement;
  Args: {
    variant?: Variant;
    size?: Size;
    class?: string;
    asChild?: boolean;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
  };
  Blocks: {
    default: [{ classes: string }?];
  };
}

function buttonVariants(
  variant: Variant = 'default',
  size: Size = 'default',
  className?: string
): string {
  const baseClasses =
    'cn-button group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0';

  const variantClasses: Record<Variant, string> = {
    default: 'cn-button-variant-default',
    destructive: 'cn-button-variant-destructive',
    outline: 'cn-button-variant-outline',
    secondary: 'cn-button-variant-secondary',
    ghost: 'cn-button-variant-ghost',
    link: 'cn-button-variant-link',
  };

  const sizeClasses: Record<Size, string> = {
    default: 'cn-button-size-default',
    xs: 'cn-button-size-xs',
    sm: 'cn-button-size-sm',
    lg: 'cn-button-size-lg',
    icon: 'cn-button-size-icon',
    'icon-xs': 'cn-button-size-icon-xs',
    'icon-sm': 'cn-button-size-icon-sm',
    'icon-lg': 'cn-button-size-icon-lg',
  };

  return cn(baseClasses, variantClasses[variant], sizeClasses[size], className);
}

class Button extends Component<ButtonSignature> {
  get classes() {
    return buttonVariants(
      this.args.variant ?? 'default',
      this.args.size ?? 'default',
      this.args.class
    );
  }

  <template>
    {{#if @asChild}}
      {{yield (hash classes=this.classes)}}
    {{else}}
      <button
        class={{this.classes}}
        data-size={{if @size @size "default"}}
        data-slot="button"
        data-variant={{if @variant @variant "default"}}
        disabled={{@disabled}}
        type={{if @type @type "button"}}
        ...attributes
      >
        {{yield}}
      </button>
    {{/if}}
  </template>
}

export { Button, buttonVariants };
