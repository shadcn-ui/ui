import { on } from '@ember/modifier';
import Component from '@glimmer/component';

import { Button } from '@/ember-ui/button';
import { Input } from '@/ember-ui/input';
import { Textarea } from '@/ember-ui/textarea';
import { cn } from '@/ember-lib/utils';

import type { TOC } from '@ember/component/template-only';

interface InputGroupSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const InputGroup: TOC<InputGroupSignature> = <template>
  <div
    class={{cn
      "group/input-group border-input dark:bg-input/30 relative flex w-full items-center rounded-md border shadow-xs transition-[color,box-shadow] outline-none"
      "h-9 min-w-0 has-[>textarea]:h-auto"
      "has-[>[data-align=inline-start]]:[&>input]:pl-2"
      "has-[>[data-align=inline-end]]:[&>input]:pr-2"
      "has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3"
      "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3"
      "has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot=input-group-control]:focus-visible]:ring-[3px]"
      "has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[[data-slot][aria-invalid=true]]:border-destructive dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40"
      @class
    }}
    data-slot="input-group"
    role="group"
    ...attributes
  >
    {{yield}}
  </div>
</template>;

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
      'inline-start':
        'order-first pl-3 has-[>button]:ml-[-0.45rem] has-[>kbd]:ml-[-0.35rem]',
      'inline-end':
        'order-last pr-3 has-[>button]:mr-[-0.45rem] has-[>kbd]:mr-[-0.35rem]',
      'block-start':
        'order-first w-full justify-start px-3 pt-3 [.border-b]:pb-3 group-has-[>input]/input-group:pt-2.5',
      'block-end':
        'order-last w-full justify-start px-3 pb-3 [.border-t]:pt-3 group-has-[>input]/input-group:pb-2.5',
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
        "text-muted-foreground flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium select-none [&>svg:not([class*='size-'])]:size-4 [&>kbd]:rounded-[calc(var(--radius)-5px)] group-data-[disabled=true]/input-group:opacity-50"
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
      xs: "h-6 gap-1 px-2 rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-3.5 has-[>svg]:px-2",
      sm: 'h-8 px-2.5 gap-1.5 rounded-md has-[>svg]:px-2.5',
      'icon-xs': 'size-6 rounded-[calc(var(--radius)-5px)] p-0 has-[>svg]:p-0',
      'icon-sm': 'size-8 p-0 has-[>svg]:p-0',
    };
    return sizeMap[size];
  }

  <template>
    <Button
      @class={{cn
        "text-sm shadow-none flex gap-2 items-center"
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
      "text-muted-foreground flex items-center gap-2 text-sm [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4"
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
      "flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent"
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
      "flex-1 resize-none rounded-none border-0 bg-transparent py-3 shadow-none focus-visible:ring-0 dark:bg-transparent"
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
