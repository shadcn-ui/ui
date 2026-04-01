import { cn } from '@/lib/utils';

import type { TOC } from '@ember/component/template-only';

interface SkeletonSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const Skeleton: TOC<SkeletonSignature> = <template>
  <div
    class={{cn "bg-accent animate-pulse rounded-md" @class}}
    data-slot="skeleton"
    ...attributes
  >
    {{yield}}
  </div>
</template>;

export { Skeleton };
