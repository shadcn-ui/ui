import Component from '@glimmer/component';

import { cn } from '@/ember-lib/utils';

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
      'shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch',
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
