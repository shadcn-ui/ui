import { cn } from '@/lib/utils';
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
      "cn-kbd pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm px-1 font-sans text-xs font-medium select-none"
      "[&_svg:not([class*='size-'])]:size-3"
      (variantClasses[@variant ?? "default"])
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
    class={{cn "inline-flex items-center gap-1" @class}}
    data-slot="kbd-group"
    ...attributes
  >
    {{yield}}
  </kbd>
</template>;

export { Kbd, KbdGroup };
