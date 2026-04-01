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
      'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
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
