import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { cn } from '@/lib/utils';

import Check from '~icons/ms/check';

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
      'cn-checkbox peer relative shrink-0 outline-none after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50',
      this.args.class
    );
  }

  get indicatorClasses() {
    return cn('cn-checkbox-indicator grid place-content-center text-current transition-none');
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
      data-slot="checkbox"
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
          data-slot="checkbox-indicator"
          data-state="checked"
        >
          <Check class="size-3.5" />
        </span>
      {{/if}}
    </button>
  </template>
}

export { Checkbox };
