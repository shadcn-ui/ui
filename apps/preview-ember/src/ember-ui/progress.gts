import { htmlSafe } from '@ember/template';
import Component from '@glimmer/component';

import { cn } from '@/ember-lib/utils';

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
        "cn-progress relative flex w-full items-center overflow-x-hidden"
        @class
      }}
      data-slot="progress"
      ...attributes
    >
      <div
        class="cn-progress-indicator size-full flex-1 transition-all"
        data-slot="progress-indicator"
        style={{this.indicatorStyle}}
      ></div>
    </div>
  </template>
}

export { Progress };
