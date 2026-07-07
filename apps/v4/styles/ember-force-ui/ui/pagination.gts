import Component from '@glimmer/component';

import { cn } from '@/lib/utils';

import { buttonVariants } from './button.gts';

import type { TOC } from '@ember/component/template-only';

import ChevronLeft from '~icons/ms/chevron_left';
import ChevronRight from '~icons/ms/chevron_right';
import MoreHorizontal from '~icons/ms/more_horiz';

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
    class={{cn "cn-pagination mx-auto flex w-full justify-center" @class}}
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
    class={{cn "cn-pagination-content flex items-center" @class}}
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
    return buttonVariants(variant, size, cn('cn-pagination-link', this.args.class));
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
    class={{cn "cn-pagination-previous" @class}}
    ...attributes
  >
    <ChevronLeft class="cn-rtl-flip" />
    <span class="cn-pagination-previous-text hidden sm:block">Previous</span>
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
    class={{cn "cn-pagination-next" @class}}
    ...attributes
  >
    <span class="cn-pagination-next-text hidden sm:block">Next</span>
    <ChevronRight class="cn-rtl-flip" />
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

// [FORCE-UI] aria-hidden scoped to the icon only — hiding it on the host span
// also hid the sr-only label below, a WCAG 4.1.2 defect
const PaginationEllipsis: TOC<PaginationEllipsisSignature> = <template>
  <span
    role="presentation"
    class={{cn "cn-pagination-ellipsis flex items-center justify-center" @class}}
    data-slot="pagination-ellipsis"
    ...attributes
  >
    <span aria-hidden="true">
      <MoreHorizontal />
    </span>
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
