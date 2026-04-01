import Component from '@glimmer/component';

import { cn } from '@/lib/utils';

import { buttonVariants } from './button.gts';

import type { TOC } from '@ember/component/template-only';

import ChevronLeft from '~icons/lucide/chevron-left';
import ChevronRight from '~icons/lucide/chevron-right';
import MoreHorizontal from '~icons/lucide/more-horizontal';

interface PaginationSignature {
  Element: HTMLElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const Pagination: TOC<PaginationSignature> = <template>
  <nav
    aria-label="pagination"
    class={{cn "mx-auto flex w-full justify-center" @class}}
    data-slot="pagination"
    role="navigation"
    ...attributes
  >
    {{yield}}
  </nav>
</template>;

interface PaginationContentSignature {
  Element: HTMLUListElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const PaginationContent: TOC<PaginationContentSignature> = <template>
  <ul
    class={{cn "flex flex-row items-center gap-1" @class}}
    data-slot="pagination-content"
    ...attributes
  >
    {{yield}}
  </ul>
</template>;

interface PaginationItemSignature {
  Element: HTMLLIElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const PaginationItem: TOC<PaginationItemSignature> = <template>
  <li data-slot="pagination-item" ...attributes>
    {{yield}}
  </li>
</template>;

interface PaginationLinkSignature {
  Element: HTMLAnchorElement;
  Args: {
    class?: string;
    isActive?: boolean;
    size?: 'default' | 'sm' | 'lg' | 'icon';
  };
  Blocks: {
    default: [];
  };
}

class PaginationLink extends Component<PaginationLinkSignature> {
  get classes() {
    const variant = this.args.isActive ? 'outline' : 'ghost';
    const size = this.args.size ?? 'icon';
    return buttonVariants(variant, size, this.args.class);
  }

  <template>
    {{! template-lint-disable link-href-attributes }}
    <a
      aria-current={{if @isActive "page"}}
      class={{this.classes}}
      data-active={{@isActive}}
      data-slot="pagination-link"
      ...attributes
    >
      {{yield}}
    </a>
  </template>
}

interface PaginationPreviousSignature {
  Element: HTMLAnchorElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const PaginationPrevious: TOC<PaginationPreviousSignature> = <template>
  <PaginationLink
    @size="default"
    aria-label="Go to previous page"
    class={{cn "gap-1 px-2.5 sm:pl-2.5" @class}}
    ...attributes
  >
    <ChevronLeft />
    <span class="hidden sm:block">Previous</span>
  </PaginationLink>
</template>;

interface PaginationNextSignature {
  Element: HTMLAnchorElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const PaginationNext: TOC<PaginationNextSignature> = <template>
  <PaginationLink
    @size="default"
    aria-label="Go to next page"
    class={{cn "gap-1 px-2.5 sm:pr-2.5" @class}}
    ...attributes
  >
    <span class="hidden sm:block">Next</span>
    <ChevronRight />
  </PaginationLink>
</template>;

interface PaginationEllipsisSignature {
  Element: HTMLSpanElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const PaginationEllipsis: TOC<PaginationEllipsisSignature> = <template>
  <span
    aria-hidden="true"
    class={{cn "flex size-9 items-center justify-center" @class}}
    data-slot="pagination-ellipsis"
    ...attributes
  >
    <MoreHorizontal class="size-4" />
    <span class="sr-only">More pages</span>
  </span>
</template>;

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
