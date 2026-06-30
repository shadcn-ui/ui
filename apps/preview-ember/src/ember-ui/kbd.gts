import { cn } from '@/ember-lib/utils';
import type { TOC } from '@ember/component/template-only';

type Variant = 'default' | 'primary';

const variantClasses: Record<Variant, string> = {
  default: 'cn-kbd-variant-default',
  primary: 'cn-kbd-variant-primary',
};

interface KbdSignature {
  Element: HTMLElement;
  Args: {
    variant?: Variant;
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const Kbd: TOC<KbdSignature> = <template>
  <kbd
    class={{cn
      "cn-kbd pointer-events-none inline-flex items-center justify-center select-none"
      (variantClasses (if @variant @variant "default"))
      @class
    }}
    data-slot="kbd"
    ...attributes
  >
    {{yield}}
  </kbd>
</template>;

interface KbdGroupSignature {
  Element: HTMLElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const KbdGroup: TOC<KbdGroupSignature> = <template>
  <kbd
    class={{cn "cn-kbd-group inline-flex items-center" @class}}
    data-slot="kbd-group"
    ...attributes
  >
    {{yield}}
  </kbd>
</template>;

export { Kbd, KbdGroup };
