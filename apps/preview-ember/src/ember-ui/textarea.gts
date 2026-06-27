import { cn } from '@/ember-lib/utils';

import type { TOC } from '@ember/component/template-only';

type Variant = 'outline' | 'filled' | 'underline' | 'ghost';

const variantClass: Record<Variant, string> = {
  outline: 'cn-textarea-variant-outline',
  filled: 'cn-textarea-variant-filled',
  underline: 'cn-textarea-variant-underline',
  ghost: 'cn-textarea-variant-ghost',
};

export interface TextareaSignature {
  Element: HTMLTextAreaElement;
  Args: {
    class?: string;
    variant?: Variant;
  };
  Blocks: {
    default: [];
  };
}

const Textarea: TOC<TextareaSignature> = <template>
  <textarea
    class={{cn
      "cn-textarea flex field-sizing-content min-h-16 w-full outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
      (variantClass [@variant ?? "outline"])
      @class
    }}
    data-slot="textarea"
    ...attributes
  />
</template>;

export { Textarea };
