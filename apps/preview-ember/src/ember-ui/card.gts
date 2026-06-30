import { cn } from '@/ember-lib/utils';

import type { TOC } from '@ember/component/template-only';

interface CardSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
    size?: 'default' | 'sm';
  };
  Blocks: {
    default: [];
  };
}

const Card: TOC<CardSignature> = <template>
  <div
    class={{cn "cn-card group/card flex flex-col" @class}}
    data-slot="card"
    data-size={{@size}}
    ...attributes
  >
    {{yield}}
  </div>
</template>;

interface CardHeaderSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const CardHeader: TOC<CardHeaderSignature> = <template>
  <div
    class={{cn
      "cn-card-header group/card-header @container/card-header grid auto-rows-min items-start has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]"
      @class
    }}
    data-slot="card-header"
    ...attributes
  >
    {{yield}}
  </div>
</template>;

interface CardTitleSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const CardTitle: TOC<CardTitleSignature> = <template>
  <div
    class={{cn "cn-card-title cn-font-heading" @class}}
    data-slot="card-title"
    ...attributes
  >
    {{yield}}
  </div>
</template>;

interface CardDescriptionSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const CardDescription: TOC<CardDescriptionSignature> = <template>
  <div
    class={{cn "cn-card-description" @class}}
    data-slot="card-description"
    ...attributes
  >
    {{yield}}
  </div>
</template>;

interface CardActionSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const CardAction: TOC<CardActionSignature> = <template>
  <div
    class={{cn
      "cn-card-action col-start-2 row-span-2 row-start-1 self-start justify-self-end"
      @class
    }}
    data-slot="card-action"
    ...attributes
  >
    {{yield}}
  </div>
</template>;

interface CardContentSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const CardContent: TOC<CardContentSignature> = <template>
  <div class={{cn "cn-card-content" @class}} data-slot="card-content" ...attributes>
    {{yield}}
  </div>
</template>;

interface CardFooterSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const CardFooter: TOC<CardFooterSignature> = <template>
  <div
    class={{cn "cn-card-footer flex items-center" @class}}
    data-slot="card-footer"
    ...attributes
  >
    {{yield}}
  </div>
</template>;

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
};
