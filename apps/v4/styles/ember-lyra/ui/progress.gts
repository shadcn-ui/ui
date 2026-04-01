import { htmlSafe } from '@ember/template';
import Component from '@glimmer/component';

import { cn } from '@/lib/utils';

interface ProgressSignature {
  Element: HTMLDivElement;
  Args: {
    value?: number;
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

class Progress extends Component<ProgressSignature> {
  get indicatorStyle() {
    const value = this.args.value ?? 0;
    return htmlSafe(`transform: translateX(-${100 - value}%)`);
  }

  <template>
    <div
      class={{cn
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full"
        @class
      }}
      data-slot="progress"
      ...attributes
    >
      <div
        class="bg-primary h-full w-full flex-1 transition-all"
        data-slot="progress-indicator"
        style={{this.indicatorStyle}}
      ></div>
    </div>
  </template>
}

export { Progress };
