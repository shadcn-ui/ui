import Component from '@glimmer/component';

import { cn } from '@/lib/utils';

import type { TOC } from '@ember/component/template-only';

// ScrollArea Root Component
interface ScrollAreaSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const ScrollArea: TOC<ScrollAreaSignature> = <template>
  <div class={{cn "relative overflow-hidden" @class}} ...attributes>
    <div class="h-full w-full rounded-[inherit] overflow-auto">
      {{yield}}
    </div>
    <ScrollBar />
  </div>
</template>;

// ScrollBar Component
interface ScrollBarSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
    orientation?: 'vertical' | 'horizontal';
  };
  Blocks: {
    default: [];
  };
}

class ScrollBar extends Component<ScrollBarSignature> {
  get orientationClasses() {
    const orientation = this.args.orientation ?? 'vertical';
    if (orientation === 'vertical') {
      return 'h-full w-2.5 border-l border-l-transparent p-[1px]';
    }
    return 'h-2.5 flex-col border-t border-t-transparent p-[1px]';
  }

  <template>
    <div
      class={{cn
        "flex touch-none select-none transition-colors"
        this.orientationClasses
        @class
      }}
      ...attributes
    >
      <div class="relative flex-1 rounded-full bg-border"></div>
    </div>
  </template>
}

export { ScrollArea, ScrollBar };
