import Component from '@glimmer/component';

import { Separator } from '@/ember-ui/separator';
import { cn } from '@/ember-lib/utils';

import type { TOC } from '@ember/component/template-only';

type ItemVariant = 'default' | 'outline' | 'muted';
type ItemSize = 'default' | 'sm' | 'xs';
type ItemMediaVariant = 'default' | 'icon' | 'image';

function itemVariants(
  variant: ItemVariant = 'default',
  size: ItemSize = 'default',
  className?: string
): string {
  const baseClasses =
    'cn-item group/item flex w-full flex-wrap items-center transition-colors duration-100 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [a]:transition-colors';

  const variantClasses: Record<ItemVariant, string> = {
    default: 'cn-item-variant-default',
    outline: 'cn-item-variant-outline',
    muted: 'cn-item-variant-muted',
  };

  const sizeClasses: Record<ItemSize, string> = {
    default: 'cn-item-size-default',
    sm: 'cn-item-size-sm',
    xs: 'cn-item-size-xs',
  };

  return cn(baseClasses, variantClasses[variant], sizeClasses[size], className);
}

function itemMediaVariants(
  variant: ItemMediaVariant = 'default',
  className?: string
): string {
  const baseClasses =
    'cn-item-media flex shrink-0 items-center justify-center [&_svg]:pointer-events-none';

  const variantClasses: Record<ItemMediaVariant, string> = {
    default: 'cn-item-media-variant-default',
    icon: 'cn-item-media-variant-icon',
    image: 'cn-item-media-variant-image',
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
    class={{cn "cn-item-group group/item-group flex w-full flex-col" @class}}
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
    @class={{cn "cn-item-separator" @class}}
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
      "cn-item-content flex flex-1 flex-col [&+[data-slot=item-content]]:flex-none"
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
      "cn-item-title line-clamp-1 flex w-fit items-center"
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
      "cn-item-description line-clamp-2 font-normal [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary"
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
    class={{cn "cn-item-actions flex items-center" @class}}
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
    class={{cn "cn-item-header flex basis-full items-center justify-between" @class}}
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
    class={{cn "cn-item-footer flex basis-full items-center justify-between" @class}}
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
