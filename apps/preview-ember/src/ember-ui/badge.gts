import { hash } from '@ember/helper';
import Component from '@glimmer/component';

import { cn } from '@/ember-lib/utils';

type Variant = 'default' | 'secondary' | 'destructive' | 'warning' | 'outline' | 'success-solid' | 'warning-solid' | 'info-solid' | 'error-solid';

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
    'cn-badge inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden';

  const variantClasses: Record<Variant, string> = {
    default: 'cn-badge-variant-default',
    secondary: 'cn-badge-variant-secondary',
    destructive: 'cn-badge-variant-destructive',
    warning: 'cn-badge-variant-warning',
    'success-solid': 'cn-badge-variant-success-solid',
    'warning-solid': 'cn-badge-variant-warning-solid',
    'info-solid': 'cn-badge-variant-info-solid',
    'error-solid': 'cn-badge-variant-error-solid',
    outline: 'cn-badge-variant-outline',
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
