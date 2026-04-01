import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { cn } from '@/lib/utils';

import Check from '~icons/lucide/check';

interface CheckboxSignature {
  Element: HTMLButtonElement;
  Args: {
    checked?: boolean;
    disabled?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    class?: string;
  };
}

class Checkbox extends Component<CheckboxSignature> {
  @tracked internalChecked = this.args.checked ?? false;

  get isControlled() {
    return this.args.onCheckedChange !== undefined;
  }

  get isChecked() {
    return this.isControlled && this.args.checked !== undefined
      ? this.args.checked
      : this.internalChecked;
  }

  get rootClasses() {
    return cn(
      'peer border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary',
      this.isChecked ? 'bg-primary text-primary-foreground' : '',
      this.args.class
    );
  }

  get indicatorClasses() {
    return cn('grid place-content-center text-current');
  }

  handleClick = (event: Event) => {
    event.preventDefault();
    if (this.args.disabled) return;

    const newChecked = !this.isChecked;

    if (!this.isControlled) {
      this.internalChecked = newChecked;
    }

    this.args.onCheckedChange?.(newChecked);
  };

  <template>
    {{! template-lint-disable require-presentational-children }}
    <button
      aria-checked={{if this.isChecked "true" "false"}}
      class={{this.rootClasses}}
      data-state={{if this.isChecked "checked" "unchecked"}}
      disabled={{@disabled}}
      role="checkbox"
      type="button"
      {{on "click" this.handleClick}}
      ...attributes
    >
      {{#if this.isChecked}}
        <span
          aria-hidden="true"
          class={{this.indicatorClasses}}
          data-state="checked"
        >
          <Check class="size-3.5" />
        </span>
      {{/if}}
    </button>
  </template>
}

export { Checkbox };
