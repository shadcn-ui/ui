import { cn } from '@/lib/utils';

import type { TOC } from '@ember/component/template-only';

import Loader2 from '~icons/lucide/loader-2';

interface SpinnerSignature {
  Element: HTMLOrSVGElement;
  Args: {
    class?: string;
  };
}

const Spinner: TOC<SpinnerSignature> = <template>
  <Loader2
    aria-label="Loading"
    class={{cn "size-4 animate-spin" @class}}
    role="status"
    ...attributes
  />
</template>;

export { Spinner };
