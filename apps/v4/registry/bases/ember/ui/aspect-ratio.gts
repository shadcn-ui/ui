import { htmlSafe } from '@ember/template';
import Component from '@glimmer/component';

import { cn } from '@/lib/utils';

interface AspectRatioSignature {
  Element: HTMLDivElement;
  Args: {
    ratio?: number;
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

class AspectRatio extends Component<AspectRatioSignature> {
  get style() {
    const ratio = this.args.ratio ?? 1;
    return htmlSafe(`padding-bottom: ${(1 / ratio) * 100}%`);
  }

  <template>
    <div class={{cn "relative w-full" @class}} ...attributes>
      <div style={{this.style}}></div>
      <div class="absolute inset-0">
        {{yield}}
      </div>
    </div>
  </template>
}

export { AspectRatio };
