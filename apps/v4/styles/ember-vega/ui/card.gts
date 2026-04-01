import { cn } from '@/lib/utils';

import type { TOC } from '@ember/component/template-only';

interface CardSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const Card: TOC<CardSignature> = <template>
  <div
    class={{cn
      "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm"
      @class
    }}
    data-slot="card"
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
      "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6"
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
    class={{cn "leading-none font-semibold" @class}}
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
    class={{cn "text-muted-foreground text-sm" @class}}
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
      "col-start-2 row-span-2 row-start-1 self-start justify-self-end"
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
  <div class={{cn "px-6" @class}} data-slot="card-content" ...attributes>
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
    class={{cn "flex items-center px-6 [.border-t]:pt-6" @class}}
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
