import Component from '@glimmer/component';

import { Separator } from '@/ember-ui/separator';
import { cn } from '@/ember-lib/utils';

import type { TOC } from '@ember/component/template-only';

type ItemVariant = 'default' | 'outline' | 'muted';
type ItemSize = 'default' | 'sm';
type ItemMediaVariant = 'default' | 'icon' | 'image';

function itemVariants(
  variant: ItemVariant = 'default',
  size: ItemSize = 'default',
  className?: string
): string {
  const baseClasses =
    'group/item flex items-center border border-transparent text-sm rounded-md transition-colors [a]:hover:bg-accent/50 [a]:transition-colors duration-100 flex-wrap outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]';

  const variantClasses: Record<ItemVariant, string> = {
    default: 'bg-transparent',
    outline: 'border-border',
    muted: 'bg-muted/50',
  };

  const sizeClasses: Record<ItemSize, string> = {
    default: 'p-4 gap-4',
    sm: 'py-3 px-4 gap-2.5',
  };

  return cn(baseClasses, variantClasses[variant], sizeClasses[size], className);
}

function itemMediaVariants(
  variant: ItemMediaVariant = 'default',
  className?: string
): string {
  const baseClasses =
    'flex shrink-0 items-center justify-center gap-2 group-has-[[data-slot=item-description]]/item:self-start [&_svg]:pointer-events-none group-has-[[data-slot=item-description]]/item:translate-y-0.5';

  const variantClasses: Record<ItemMediaVariant, string> = {
    default: 'bg-transparent',
    icon: "size-8 border rounded-sm bg-muted [&_svg:not([class*='size-'])]:size-4",
    image:
      'size-10 rounded-sm overflow-hidden [&_img]:size-full [&_img]:object-cover',
  };

  return cn(baseClasses, variantClasses[variant], className);
}

interface ItemGroupSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const ItemGroup: TOC<ItemGroupSignature> = <template>
  <div
    class={{cn "group/item-group flex flex-col" @class}}
    data-slot="item-group"
    role="list"
    ...attributes
  >
    {{yield}}
  </div>
</template>;

interface ItemSeparatorSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const ItemSeparator: TOC<ItemSeparatorSignature> = <template>
  <Separator
    @class={{cn "my-0" @class}}
    @orientation="horizontal"
    data-slot="item-separator"
    ...attributes
  />
</template>;

interface ItemSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
    variant?: ItemVariant;
    size?: ItemSize;
    asChild?: boolean;
  };
  Blocks: {
    default: [
      {
        slot: string;
        variant: ItemVariant;
        size: ItemSize;
        class: string;
      },
    ];
  };
}

class Item extends Component<ItemSignature> {
  get variant(): ItemVariant {
    return this.args.variant ?? 'default';
  }

  get size(): ItemSize {
    return this.args.size ?? 'default';
  }

  get classes(): string {
    return itemVariants(this.variant, this.size, this.args.class);
  }

  get yieldedContext() {
    return {
      slot: 'item',
      variant: this.variant,
      size: this.size,
      class: this.classes,
    };
  }

  <template>
    {{#if @asChild}}
      {{yield this.yieldedContext}}
    {{else}}
      <div
        class={{this.classes}}
        data-size={{this.size}}
        data-slot="item"
        data-variant={{this.variant}}
        ...attributes
      >
        {{yield this.yieldedContext}}
      </div>
    {{/if}}
  </template>
}

interface ItemMediaSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
    variant?: ItemMediaVariant;
  };
  Blocks: {
    default: [];
  };
}

class ItemMedia extends Component<ItemMediaSignature> {
  get variant(): ItemMediaVariant {
    return this.args.variant ?? 'default';
  }

  get classes(): string {
    return itemMediaVariants(this.variant, this.args.class);
  }

  <template>
    <div
      class={{this.classes}}
      data-slot="item-media"
      data-variant={{this.variant}}
      ...attributes
    >
      {{yield}}
    </div>
  </template>
}

interface ItemContentSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const ItemContent: TOC<ItemContentSignature> = <template>
  <div
    class={{cn
      "flex flex-1 flex-col gap-1 [&+[data-slot=item-content]]:flex-none"
      @class
    }}
    data-slot="item-content"
    ...attributes
  >
    {{yield}}
  </div>
</template>;

interface ItemTitleSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const ItemTitle: TOC<ItemTitleSignature> = <template>
  <div
    class={{cn
      "flex w-fit items-center gap-2 text-sm leading-snug font-medium"
      @class
    }}
    data-slot="item-title"
    ...attributes
  >
    {{yield}}
  </div>
</template>;

interface ItemDescriptionSignature {
  Element: HTMLParagraphElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const ItemDescription: TOC<ItemDescriptionSignature> = <template>
  <p
    class={{cn
      "text-muted-foreground line-clamp-2 text-sm leading-normal font-normal text-balance [&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4"
      @class
    }}
    data-slot="item-description"
    ...attributes
  >
    {{yield}}
  </p>
</template>;

interface ItemActionsSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const ItemActions: TOC<ItemActionsSignature> = <template>
  <div
    class={{cn "flex items-center gap-2" @class}}
    data-slot="item-actions"
    ...attributes
  >
    {{yield}}
  </div>
</template>;

interface ItemHeaderSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const ItemHeader: TOC<ItemHeaderSignature> = <template>
  <div
    class={{cn "flex basis-full items-center justify-between gap-2" @class}}
    data-slot="item-header"
    ...attributes
  >
    {{yield}}
  </div>
</template>;

interface ItemFooterSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const ItemFooter: TOC<ItemFooterSignature> = <template>
  <div
    class={{cn "flex basis-full items-center justify-between gap-2" @class}}
    data-slot="item-footer"
    ...attributes
  >
    {{yield}}
  </div>
</template>;

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter,
};
