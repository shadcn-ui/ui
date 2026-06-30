import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { cn } from '@/ember-lib/utils';

interface SwitchSignature {
  Element: HTMLButtonElement;
  Args: {
    checked?: boolean;
    disabled?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    class?: string;
  };
}

class Switch extends Component<SwitchSignature> {
  @tracked internalChecked = false;

  get isChecked() {
    return this.args.checked ?? this.internalChecked;
  }

  get rootClasses() {
    return cn(
      'cn-switch peer group/switch relative inline-flex items-center transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 data-disabled:cursor-not-allowed data-disabled:opacity-50',
      this.args.class
    );
  }

  get thumbClasses() {
    return cn(
      'cn-switch-thumb pointer-events-none block ring-0 transition-transform'
    );
  }

  handleClick = (event: Event) => {
    event.preventDefault();
    if (this.args.disabled) return;

    const newChecked = !this.isChecked;

    // Update internal state if not controlled
    if (this.args.checked === undefined) {
      this.internalChecked = newChecked;
    }

    // Call the callback
    this.args.onCheckedChange?.(newChecked);
  };

  <template>
    <button
      aria-checked={{if this.isChecked "true" "false"}}
      class={{this.rootClasses}}
      data-slot="switch"
      data-state={{if this.isChecked "checked" "unchecked"}}
      disabled={{@disabled}}
      role="switch"
      type="button"
      {{on "click" this.handleClick}}
      ...attributes
    >
      <span
        class={{this.thumbClasses}}
        data-slot="switch-thumb"
        data-state={{if this.isChecked "checked" "unchecked"}}
      ></span>
    </button>
  </template>
}

export { Switch };
