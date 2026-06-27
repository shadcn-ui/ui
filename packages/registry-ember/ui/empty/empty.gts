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
      "cn-empty flex w-full min-w-0 flex-1 flex-col items-center justify-center text-center text-balance"
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
    class={{cn "cn-empty-header flex max-w-sm flex-col items-center" @class}}
    data-slot="empty-header"
    ...attributes
  >
    {{yield}}
  </div>
</template>;

const emptyMediaVariants = cva(
  'cn-empty-media flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'cn-empty-media-default',
        icon: 'cn-empty-media-icon',
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
    class={{cn "cn-empty-title cn-font-heading" @class}}
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
      "cn-empty-description text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary"
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
      "cn-empty-content flex w-full max-w-sm min-w-0 flex-col items-center text-balance"
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
