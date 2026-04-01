import Component from '@glimmer/component';

import { cn } from '@/lib/utils';

interface AlertSignature {
  Element: HTMLDivElement;
  Args: {
    variant?: 'default' | 'destructive';
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

interface AlertTitleSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

interface AlertDescriptionSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

class Alert extends Component<AlertSignature> {
  get variantClasses() {
    const { variant = 'default' } = this.args;

    const variants = {
      default: 'bg-card text-card-foreground',
      destructive:
        'text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90',
    };

    return variants[variant];
  }

  get className() {
    return cn(
      'relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current',
      this.variantClasses,
      this.args.class
    );
  }

  <template>
    <div class={{this.className}} data-slot="alert" role="alert" ...attributes>
      {{yield}}
    </div>
  </template>
}

class AlertTitle extends Component<AlertTitleSignature> {
  get className() {
    return cn(
      'col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight',
      this.args.class
    );
  }

  <template>
    <div class={{this.className}} data-slot="alert-title" ...attributes>
      {{yield}}
    </div>
  </template>
}

class AlertDescription extends Component<AlertDescriptionSignature> {
  get className() {
    return cn(
      'text-card-foreground/80 col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed',
      this.args.class
    );
  }

  <template>
    <div class={{this.className}} data-slot="alert-description" ...attributes>
      {{yield}}
    </div>
  </template>
}

export { Alert, AlertTitle, AlertDescription };
