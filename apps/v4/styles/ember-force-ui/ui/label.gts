import Component from '@glimmer/component';

import { cn } from '@/lib/utils';

interface LabelSignature {
  Element: HTMLLabelElement;
  Args: {
    class?: string;
    for?: string;
  };
  Blocks: {
    default: [];
  };
}

class Label extends Component<LabelSignature> {
  get classes() {
    return cn(
      'cn-label flex items-center select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed',
      this.args.class
    );
  }

  <template>
    <label class={{this.classes}} data-slot="label" for={{@for}} ...attributes>
      {{yield}}
    </label>
  </template>
}

export { Label };
