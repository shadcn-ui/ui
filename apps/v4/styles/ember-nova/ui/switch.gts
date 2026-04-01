import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { cn } from '@/lib/utils';

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
      'peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
      this.args.class
    );
  }

  get thumbClasses() {
    return cn(
      'bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0'
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
