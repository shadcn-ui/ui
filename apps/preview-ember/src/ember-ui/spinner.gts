import { cn } from '@/ember-lib/utils';

import type { TOC } from '@ember/component/template-only';

import Loader2 from '~icons/material-symbols/progress-activity';

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
