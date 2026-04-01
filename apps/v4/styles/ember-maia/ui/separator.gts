import Component from '@glimmer/component';

import { cn } from '@/lib/utils';

type Orientation = 'horizontal' | 'vertical';

interface SeparatorSignature {
  Element: HTMLDivElement;
  Args: {
    orientation?: Orientation;
    decorative?: boolean;
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

class Separator extends Component<SeparatorSignature> {
  get classes() {
    return cn(
      'bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
      this.args.class
    );
  }

  get role() {
    return (this.args.decorative ?? true) ? 'none' : 'separator';
  }

  get orientation() {
    return this.args.orientation ?? 'horizontal';
  }

  <template>
    <div
      class={{this.classes}}
      data-orientation={{this.orientation}}
      data-slot="separator"
      role={{this.role}}
      ...attributes
    ></div>
  </template>
}

export { Separator };
