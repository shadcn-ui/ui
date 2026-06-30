import { hash } from '@ember/helper';

import { cn } from '@/ember-lib/utils';

import type { TOC } from '@ember/component/template-only';

import ChevronRight from '~icons/ms/chevron_right';
import MoreHorizontal from '~icons/ms/more_horiz';

interface BreadcrumbSignature {
  Element: HTMLElement;
  Args: {
    separator?: string;
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const Breadcrumb: TOC<BreadcrumbSignature> = <template>
  <nav
    aria-label="breadcrumb"
    class={{cn "cn-breadcrumb" @class}}
    data-slot="breadcrumb"
    ...attributes
  >
    {{yield}}
  </nav>
</template>;

interface BreadcrumbListSignature {
  Element: HTMLOListElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const BreadcrumbList: TOC<BreadcrumbListSignature> = <template>
  <ol
    class={{cn
      "cn-breadcrumb-list flex flex-wrap items-center wrap-break-word"
      @class
    }}
    data-slot="breadcrumb-list"
    ...attributes
  >
    {{yield}}
  </ol>
</template>;

interface BreadcrumbItemSignature {
  Element: HTMLLIElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const BreadcrumbItem: TOC<BreadcrumbItemSignature> = <template>
  <li
    class={{cn "cn-breadcrumb-item inline-flex items-center" @class}}
    data-slot="breadcrumb-item"
    ...attributes
  >
    {{yield}}
  </li>
</template>;

interface BreadcrumbLinkSignature {
  Element: HTMLAnchorElement;
  Args: {
    href?: string;
    class?: string;
    asChild?: boolean;
  };
  Blocks: {
    default: [{ classes: string }?];
  };
}

const BreadcrumbLink: TOC<BreadcrumbLinkSignature> = <template>
  {{#if @asChild}}
    {{yield
      (hash classes=(cn "cn-breadcrumb-link" @class))
    }}
  {{else}}
    <a
      class={{cn "cn-breadcrumb-link" @class}}
      data-slot="breadcrumb-link"
      href={{@href}}
      ...attributes
    >
      {{yield}}
    </a>
  {{/if}}
</template>;

interface BreadcrumbPageSignature {
  Element: HTMLSpanElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const BreadcrumbPage: TOC<BreadcrumbPageSignature> = <template>
  <span
    aria-current="page"
    aria-disabled="true"
    class={{cn "cn-breadcrumb-page" @class}}
    data-slot="breadcrumb-page"
    role="link"
    ...attributes
  >
    {{yield}}
  </span>
</template>;

interface BreadcrumbSeparatorSignature {
  Element: HTMLLIElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const BreadcrumbSeparator: TOC<BreadcrumbSeparatorSignature> = <template>
  <li
    aria-hidden="true"
    class={{cn "cn-breadcrumb-separator" @class}}
    data-slot="breadcrumb-separator"
    role="presentation"
    ...attributes
  >
    {{#if (has-block)}}
      {{yield}}
    {{else}}
      <ChevronRight />
    {{/if}}
  </li>
</template>;

interface BreadcrumbEllipsisSignature {
  Element: HTMLSpanElement;
  Args: {
    class?: string;
  };
}

const BreadcrumbEllipsis: TOC<BreadcrumbEllipsisSignature> = <template>
  <span
    aria-hidden="true"
    class={{cn "cn-breadcrumb-ellipsis flex items-center justify-center" @class}}
    data-slot="breadcrumb-ellipsis"
    role="presentation"
    ...attributes
  >
    <MoreHorizontal class="size-4" />
    <span class="sr-only">More</span>
  </span>
</template>;

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
