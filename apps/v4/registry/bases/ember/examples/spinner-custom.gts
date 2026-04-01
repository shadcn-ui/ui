import { cn } from '@/lib/utils';

import type { TOC } from '@ember/component/template-only';

import Loader from '~icons/lucide/loader';

interface CustomSpinnerSignature {
  Element: HTMLOrSVGElement;
  Args: {
    class?: string;
  };
}

const CustomSpinner: TOC<CustomSpinnerSignature> = <template>
  <Loader
    aria-label="Loading"
    class={{cn "size-4 animate-spin" @class}}
    role="status"
    ...attributes
  />
</template>;

const SpinnerCustom: TOC<{ Element: HTMLDivElement }> = <template>
  <div class="flex items-center gap-4">
    <CustomSpinner />
  </div>
</template>;

export default SpinnerCustom;
