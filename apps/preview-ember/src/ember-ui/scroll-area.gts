import Component from '@glimmer/component';

import { cn } from '@/ember-lib/utils';

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
  <div data-slot="scroll-area" class={{cn "cn-scroll-area relative" @class}} ...attributes>
    <div data-slot="scroll-area-viewport" class="cn-scroll-area-viewport size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1">
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
      return 'h-full w-2.5 border-l border-l-transparent';
    }
    return 'h-2.5 flex-col border-t border-t-transparent';
  }

  <template>
    <div
      data-slot="scroll-area-scrollbar"
      data-orientation={{if this.args.orientation this.args.orientation "vertical"}}
      class={{cn
        "cn-scroll-area-scrollbar flex touch-none p-px transition-colors select-none"
        this.orientationClasses
        @class
      }}
      ...attributes
    >
      <div data-slot="scroll-area-thumb" class="cn-scroll-area-thumb relative flex-1 bg-border"></div>
    </div>
  </template>
}

export { ScrollArea, ScrollBar };
