import { hash } from '@ember/helper';
import Component from '@glimmer/component';

import { cn } from '@/lib/utils';

type Variant = 'default' | 'secondary' | 'destructive' | 'warning' | 'success' | 'info' | 'success-solid' | 'warning-solid' | 'info-solid' | 'error-solid' | 'outline' | 'ghost' | 'link';

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
    'cn-badge group/badge inline-flex w-fit shrink-0 items-center justify-center overflow-hidden whitespace-nowrap focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none';

  const variantClasses: Record<Variant, string> = {
    default: 'cn-badge-variant-default',
    secondary: 'cn-badge-variant-secondary',
    destructive: 'cn-badge-variant-destructive',
    warning: 'cn-badge-variant-warning',
    success: 'cn-badge-variant-success',
    info: 'cn-badge-variant-info',
    'success-solid': 'cn-badge-variant-success-solid',
    'warning-solid': 'cn-badge-variant-warning-solid',
    'info-solid': 'cn-badge-variant-info-solid',
    'error-solid': 'cn-badge-variant-error-solid',
    outline: 'cn-badge-variant-outline',
    ghost: 'cn-badge-variant-ghost',
    link: 'cn-badge-variant-link',
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
      <span class={{this.classes}} data-slot="badge" data-variant={{@variant}} ...attributes>
        {{yield}}
      </span>
    {{/if}}
  </template>
}

export { Badge, badgeVariants };
