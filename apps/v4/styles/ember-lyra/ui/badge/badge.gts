import { hash } from '@ember/helper';
import Component from '@glimmer/component';

import { cn } from '@/lib/utils';

type Variant = 'default' | 'secondary' | 'destructive' | 'outline';

interface BadgeSignature {
  Element: HTMLSpanElement;
  Args: {
    variant?: Variant;
    class?: string;
    asChild?: boolean;
  };
  Blocks: {
    default: [{ classes: string }?];
  };
}

function badgeVariants(
  variant: Variant = 'default',
  className?: string
): string {
  const baseClasses =
    'inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden';

  const variantClasses: Record<Variant, string> = {
    default:
      'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
    secondary:
      'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
    destructive:
      'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
    outline:
      'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
  };

  return cn(baseClasses, variantClasses[variant], className);
}

class Badge extends Component<BadgeSignature> {
  get classes() {
    return badgeVariants(this.args.variant ?? 'default', this.args.class);
  }

  <template>
    {{#if @asChild}}
      {{yield (hash classes=this.classes)}}
    {{else}}
      <span class={{this.classes}} data-slot="badge" ...attributes>
        {{yield}}
      </span>
    {{/if}}
  </template>
}

export { Badge, badgeVariants };
