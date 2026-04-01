import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { cached } from '@glimmer/tracking';
import { modifier } from 'ember-modifier';
import { consume, provide } from 'ember-provide-consume-context';

import { cn } from '@/lib/utils';

import type { TOC } from '@ember/component/template-only';

import Minus from '~icons/lucide/minus';

const InputOTPContext = 'input-otp-context' as const;

interface SlotData {
  char: string;
  hasFakeCaret: boolean;
  isActive: boolean;
}

interface InputOTPContextValue {
  slots: SlotData[];
  activeIndex: number;
  handleSlotClick: (index: number) => void;
}

interface ContextRegistry {
  [InputOTPContext]: InputOTPContextValue;
}

interface InputOTPSignature {
  Element: HTMLDivElement;
  Args: {
    maxLength?: number;
    value?: string;
    onValueChange?: (value: string) => void;
    disabled?: boolean;
    containerClassName?: string;
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

interface InputOTPGroupSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

interface InputOTPSlotSignature {
  Element: HTMLDivElement;
  Args: {
    index: number;
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

interface InputOTPSeparatorSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

class InputOTP extends Component<InputOTPSignature> {
  @tracked internalValue = '';
  @tracked activeIndex = 0;
  @tracked isFocused = false;

  hiddenInputElement?: HTMLInputElement;

  get value(): string {
    return this.args.value ?? this.internalValue;
  }

  set value(newValue: string) {
    if (this.args.value === undefined) {
      this.internalValue = newValue;
    }
  }

  get maxLength() {
    return this.args.maxLength ?? 6;
  }

  get slots(): SlotData[] {
    const slots: SlotData[] = [];
    for (let i = 0; i < this.maxLength; i++) {
      const char = this.value[i] || '';
      const isActive = this.isFocused && i === this.activeIndex;
      const hasFakeCaret = isActive && !char;
      slots.push({ char, hasFakeCaret, isActive });
    }
    return slots;
  }

  @cached
  @provide(InputOTPContext)
  get contextValue(): InputOTPContextValue {
    return {
      slots: this.slots,
      activeIndex: this.activeIndex,
      handleSlotClick: this.handleSlotClick,
    };
  }

  setupHiddenInput = modifier((element: HTMLInputElement) => {
    this.hiddenInputElement = element;

    return () => {
      this.hiddenInputElement = undefined;
    };
  });

  handleFocus = () => {
    this.isFocused = true;
  };

  handleBlur = () => {
    this.isFocused = false;
  };

  updateValue(newValue: string, newActiveIndex?: number) {
    if (this.args.value === undefined) {
      this.internalValue = newValue;
    }
    if (newActiveIndex !== undefined) {
      this.activeIndex = newActiveIndex;
    }
    if (this.args.onValueChange) {
      this.args.onValueChange(newValue);
    }
  }

  handleInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    let inputValue = input.value;
    inputValue = inputValue.replace(/[^a-zA-Z0-9]/g, '');

    if (inputValue.length > 0) {
      const newValue = (
        this.value.slice(0, this.activeIndex) +
        inputValue[0] +
        this.value.slice(this.activeIndex + 1)
      ).slice(0, this.maxLength);

      const newActiveIndex = Math.min(this.activeIndex + 1, this.maxLength - 1);
      input.value = '';

      this.updateValue(newValue, newActiveIndex);
    }
  };

  handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Backspace') {
      event.preventDefault();
      if (this.value.length > 0) {
        const charAtCurrent = this.value[this.activeIndex];
        if (charAtCurrent) {
          const newValue =
            this.value.slice(0, this.activeIndex) +
            this.value.slice(this.activeIndex + 1);
          this.updateValue(newValue);
        } else if (this.activeIndex > 0) {
          const newValue =
            this.value.slice(0, this.activeIndex - 1) +
            this.value.slice(this.activeIndex);
          const newActiveIndex = Math.max(0, this.activeIndex - 1);
          this.updateValue(newValue, newActiveIndex);
        }
      }
    } else if (event.key === 'Delete') {
      event.preventDefault();
      if (this.activeIndex < this.value.length) {
        const newValue =
          this.value.slice(0, this.activeIndex) +
          this.value.slice(this.activeIndex + 1);
        this.updateValue(newValue);
      }
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.activeIndex = Math.max(0, this.activeIndex - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.activeIndex = Math.min(
        Math.min(this.value.length, this.maxLength - 1),
        this.activeIndex + 1
      );
    } else if (event.key === 'Home') {
      event.preventDefault();
      this.activeIndex = 0;
    } else if (event.key === 'End') {
      event.preventDefault();
      this.activeIndex = Math.min(this.value.length, this.maxLength - 1);
    }
  };

  handlePaste = (event: ClipboardEvent) => {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text') || '';
    const newValue = pastedText
      .replace(/[^a-zA-Z0-9]/g, '')
      .slice(0, this.maxLength);
    const newActiveIndex = Math.min(newValue.length, this.maxLength - 1);
    this.updateValue(newValue, newActiveIndex);
  };

  handleSlotClick = (index: number) => {
    if (!this.args.disabled) {
      this.activeIndex = Math.min(index, this.value.length);
      this.hiddenInputElement?.focus();
    }
  };

  <template>
    <div
      class={{cn
        "flex items-center gap-2 has-disabled:opacity-50"
        @containerClassName
        @class
      }}
      data-slot="input-otp"
      ...attributes
    >
      <input
        aria-label="OTP input"
        autocomplete="one-time-code"
        class="absolute left-0 top-0 size-0 opacity-0"
        disabled={{@disabled}}
        inputmode="text"
        type="text"
        {{on "blur" this.handleBlur}}
        {{on "focus" this.handleFocus}}
        {{on "input" this.handleInput}}
        {{on "keydown" this.handleKeyDown}}
        {{on "paste" this.handlePaste}}
        {{this.setupHiddenInput}}
      />
      {{yield}}
    </div>
  </template>
}

const InputOTPGroup: TOC<InputOTPGroupSignature> = <template>
  <div
    class={{cn "flex items-center" @class}}
    data-slot="input-otp-group"
    ...attributes
  >
    {{yield}}
  </div>
</template>;

class InputOTPSlot extends Component<InputOTPSlotSignature> {
  @consume(InputOTPContext)
  context!: ContextRegistry[typeof InputOTPContext];

  get slotData() {
    return (
      this.context.slots[this.args.index] ?? {
        char: '',
        hasFakeCaret: false,
        isActive: false,
      }
    );
  }

  handleClick = () => {
    this.context.handleSlotClick(this.args.index);
  };

  <template>
    <button
      class={{cn
        "data-[active=true]:border-ring data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive dark:bg-input/30 border-input relative flex h-9 w-9 items-center justify-center border-y border-r text-sm shadow-xs transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md data-[active=true]:z-10 data-[active=true]:ring-[3px]"
        @class
      }}
      data-active={{if this.slotData.isActive "true" "false"}}
      data-slot="input-otp-slot"
      type="button"
      {{on "click" this.handleClick}}
      ...attributes
    >
      {{this.slotData.char}}
      {{#if this.slotData.hasFakeCaret}}
        <div
          class="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div class="bg-foreground h-4 w-px animate-caret-blink"></div>
        </div>
      {{/if}}
    </button>
  </template>
}

const InputOTPSeparator: TOC<InputOTPSeparatorSignature> = <template>
  {{! template-lint-disable require-presentational-children }}
  <div data-slot="input-otp-separator" role="separator" ...attributes>
    <Minus aria-hidden="true" />
  </div>
</template>;

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
