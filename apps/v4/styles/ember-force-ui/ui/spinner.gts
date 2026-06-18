import { cn } from '@/lib/utils';
import type { TOC } from '@ember/component/template-only';
import Loader2 from '~icons/lucide/loader-2';

type Color = 'default' | 'primary' | 'onPrimary' | 'inherit';
type Size = 'xs' | 'sm' | 'md' | 'lg';

const colorClasses: Record<Color, string> = {
  default: 'cn-spinner-color-default',
  primary: 'cn-spinner-color-primary',
  onPrimary: 'cn-spinner-color-onPrimary',
  inherit: 'cn-spinner-color-inherit',
};

const sizeClasses: Record<Size, string> = {
  xs: 'cn-spinner-size-xs',
  sm: 'cn-spinner-size-sm',
  md: 'cn-spinner-size-md',
  lg: 'cn-spinner-size-lg',
};

interface SpinnerSignature {
  Element: HTMLOrSVGElement;
  Args: {
    color?: Color;
    size?: Size;
    class?: string;
  };
}

const Spinner: TOC<SpinnerSignature> = <template>
  <Loader2
    aria-label="Loading"
    class={{cn
      "cn-spinner animate-spin"
      (colorClasses[@color ?? "default"])
      (sizeClasses[@size ?? "sm"])
      @class
    }}
    role="status"
    ...attributes
  />
</template>;

export { Spinner };
