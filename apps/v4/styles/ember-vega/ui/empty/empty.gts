import Component from '@glimmer/component';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

import type { TOC } from '@ember/component/template-only';

interface EmptySignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const Empty: TOC<EmptySignature> = <template>
  <div
    class={{cn
      "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance md:p-12"
      @class
    }}
    data-slot="empty"
    ...attributes
  >
    {{yield}}
  </div>
</template>;

interface EmptyHeaderSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const EmptyHeader: TOC<EmptyHeaderSignature> = <template>
  <div
    class={{cn "flex max-w-sm flex-col items-center gap-2 text-center" @class}}
    data-slot="empty-header"
    ...attributes
  >
    {{yield}}
  </div>
</template>;

const emptyMediaVariants = cva(
  'flex shrink-0 items-center justify-center mb-2 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        icon: "bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-6",
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface EmptyMediaSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
    variant?: 'default' | 'icon';
  };
  Blocks: {
    default: [];
  };
}

class EmptyMedia extends Component<EmptyMediaSignature> {
  get classes() {
    return emptyMediaVariants({
      variant: this.args.variant ?? 'default',
      className: this.args.class,
    });
  }

  <template>
    <div
      class={{this.classes}}
      data-slot="empty-icon"
      data-variant={{if @variant @variant "default"}}
      ...attributes
    >
      {{yield}}
    </div>
  </template>
}

interface EmptyTitleSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const EmptyTitle: TOC<EmptyTitleSignature> = <template>
  <div
    class={{cn "text-lg font-medium tracking-tight" @class}}
    data-slot="empty-title"
    ...attributes
  >
    {{yield}}
  </div>
</template>;

interface EmptyDescriptionSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const EmptyDescription: TOC<EmptyDescriptionSignature> = <template>
  <div
    class={{cn
      "text-muted-foreground [&>a:hover]:text-primary text-sm/relaxed [&>a]:underline [&>a]:underline-offset-4"
      @class
    }}
    data-slot="empty-description"
    ...attributes
  >
    {{yield}}
  </div>
</template>;

interface EmptyContentSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const EmptyContent: TOC<EmptyContentSignature> = <template>
  <div
    class={{cn
      "flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance"
      @class
    }}
    data-slot="empty-content"
    ...attributes
  >
    {{yield}}
  </div>
</template>;

export {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
};
