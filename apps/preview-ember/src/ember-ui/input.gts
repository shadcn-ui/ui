import { cn } from '@/ember-lib/utils';
import type { TOC } from '@ember/component/template-only';

type Variant = 'outline' | 'filled' | 'underline' | 'ghost';

const variantClasses: Record<Variant, string> = {
  outline: 'cn-input-variant-outline',
  filled: 'cn-input-variant-filled',
  underline: 'cn-input-variant-underline',
  ghost: 'cn-input-variant-ghost',
};

export interface InputSignature {
  Element: HTMLInputElement;
  Args: {
    type?: string;
    variant?: Variant;
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const Input: TOC<InputSignature> = <template>
  <input
    class={{cn
      "cn-input w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
      (variantClasses (if @variant @variant "outline"))
      @class
    }}
    data-slot="input"
    type={{@type}}
    ...attributes
  />
</template>;

export { Input };
