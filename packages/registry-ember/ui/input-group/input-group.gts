import { on } from '@ember/modifier';
import Component from '@glimmer/component';

import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Textarea } from '@/ui/textarea';
import { cn } from '@/lib/utils';

import type { TOC } from '@ember/component/template-only';

// [FORCE-UI-START]
type InputGroupVariant = 'outline' | 'filled' | 'underline' | 'ghost';

const inputGroupVariantMap: Record<InputGroupVariant, string> = {
  outline: 'cn-input-group-variant-outline',
  filled: 'cn-input-group-variant-filled',
  underline: 'cn-input-group-variant-underline',
  ghost: 'cn-input-group-variant-ghost',
};
// [FORCE-UI-END]

interface InputGroupSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
    variant?: InputGroupVariant; // [FORCE-UI]
  };
  Blocks: {
    default: [];
  };
}

class InputGroup extends Component<InputGroupSignature> {
  get variantClass() {
    const variant = this.args.variant ?? 'outline';
    return inputGroupVariantMap[variant];
  }

  <template>
    <div
      class={{cn
        "group/input-group cn-input-group relative flex w-full min-w-0 items-center outline-none has-[>textarea]:h-auto"
        this.variantClass
        @class
      }}
      data-slot="input-group"
      role="group"
      ...attributes
    >
      {{yield}}
    </div>
  </template>
}

type InputGroupAddonAlign =
  | 'inline-start'
  | 'inline-end'
  | 'block-start'
  | 'block-end';

interface InputGroupAddonSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
    align?: InputGroupAddonAlign;
  };
  Blocks: {
    default: [];
  };
}

class InputGroupAddon extends Component<InputGroupAddonSignature> {
  get alignClasses() {
    const align = this.args.align ?? 'inline-start';
    const alignMap: Record<InputGroupAddonAlign, string> = {
      'inline-start': 'cn-input-group-addon-align-inline-start order-first',
      'inline-end': 'cn-input-group-addon-align-inline-end order-last',
      'block-start':
        'cn-input-group-addon-align-block-start order-first w-full justify-start',
      'block-end':
        'cn-input-group-addon-align-block-end order-last w-full justify-start',
    };
    return alignMap[align];
  }

  handleClick = (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    (e.currentTarget as HTMLElement).parentElement
      ?.querySelector('input')
      ?.focus();
  };

  <template>
    {{! template-lint-disable no-invalid-interactive }}
    <div
      class={{cn
        "cn-input-group-addon flex cursor-text items-center justify-center select-none"
        this.alignClasses
        @class
      }}
      data-align={{@align}}
      data-slot="input-group-addon"
      role="group"
      {{on "click" this.handleClick}}
      ...attributes
    >
      {{yield}}
    </div>
  </template>
}

type InputGroupButtonSize = 'xs' | 'sm' | 'icon-xs' | 'icon-sm';

interface InputGroupButtonSignature {
  Element: HTMLButtonElement;
  Args: {
    class?: string;
    size?: InputGroupButtonSize;
    variant?:
      | 'default'
      | 'destructive'
      | 'outline'
      | 'secondary'
      | 'ghost'
      | 'link';
    type?: 'button' | 'submit' | 'reset';
  };
  Blocks: {
    default: [];
  };
}

class InputGroupButton extends Component<InputGroupButtonSignature> {
  get sizeClasses() {
    const size = this.args.size ?? 'xs';
    const sizeMap: Record<InputGroupButtonSize, string> = {
      xs: 'cn-input-group-button-size-xs',
      sm: 'cn-input-group-button-size-sm',
      'icon-xs': 'cn-input-group-button-size-icon-xs',
      'icon-sm': 'cn-input-group-button-size-icon-sm',
    };
    return sizeMap[size];
  }

  <template>
    <Button
      @class={{cn
        "cn-input-group-button flex items-center shadow-none"
        this.sizeClasses
        @class
      }}
      @type={{if @type @type "button"}}
      @variant={{if @variant @variant "ghost"}}
      data-size={{@size}}
      ...attributes
    >
      {{yield}}
    </Button>
  </template>
}

interface InputGroupTextSignature {
  Element: HTMLSpanElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const InputGroupText: TOC<InputGroupTextSignature> = <template>
  <span
    class={{cn
      "cn-input-group-text flex items-center [&_svg]:pointer-events-none"
      @class
    }}
    ...attributes
  >
    {{yield}}
  </span>
</template>;

interface InputGroupInputSignature {
  Element: HTMLInputElement;
  Args: {
    class?: string;
    placeholder?: string;
  };
}

const InputGroupInput: TOC<InputGroupInputSignature> = <template>
  <Input
    @class={{cn
      "cn-input-group-input flex-1"
      @class
    }}
    data-slot="input-group-control"
    ...attributes
  />
</template>;

interface InputGroupTextareaSignature {
  Element: HTMLTextAreaElement;
  Args: {
    class?: string;
  };
}

const InputGroupTextarea: TOC<InputGroupTextareaSignature> = <template>
  <Textarea
    @class={{cn
      "cn-input-group-textarea flex-1 resize-none"
      @class
    }}
    data-slot="input-group-control"
    ...attributes
  />
</template>;

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
};
