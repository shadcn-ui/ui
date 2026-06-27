import Component from '@glimmer/component';

import { cn } from '@/lib/utils';

interface AlertSignature {
  Element: HTMLDivElement;
  Args: {
    variant?: 'default' | 'destructive' | 'warning' | 'success' | 'info';
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

interface AlertActionSignature {
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
      default: 'cn-alert-variant-default',
      destructive: 'cn-alert-variant-destructive',
      warning: 'cn-alert-variant-warning',
      success: 'cn-alert-variant-success',
      info: 'cn-alert-variant-info',
    };

    return variants[variant];
  }

  get className() {
    return cn(
      'cn-alert group/alert relative w-full',
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
      'cn-alert-title [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground',
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
      'cn-alert-description [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground',
      this.args.class
    );
  }

  <template>
    <div class={{this.className}} data-slot="alert-description" ...attributes>
      {{yield}}
    </div>
  </template>
}

class AlertAction extends Component<AlertActionSignature> {
  get className() {
    return cn('cn-alert-action', this.args.class);
  }

  <template>
    <div class={{this.className}} data-slot="alert-action" ...attributes>
      {{yield}}
    </div>
  </template>
}

export { Alert, AlertTitle, AlertDescription, AlertAction };
