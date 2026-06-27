import { hash } from '@ember/helper';
import Component from '@glimmer/component';

import { Separator } from '@/ui/separator';
import { cn } from '@/lib/utils';

type Orientation = 'horizontal' | 'vertical';

interface ButtonGroupSignature {
  Element: HTMLDivElement;
  Args: {
    orientation?: Orientation;
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

interface ButtonGroupTextSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
    asChild?: boolean;
  };
  Blocks: {
    default: [];
  };
}

interface ButtonGroupSeparatorSignature {
  Element: HTMLDivElement;
  Args: {
    orientation?: Orientation;
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

function buttonGroupVariants(
  orientation: Orientation = 'horizontal',
  className?: string
): string {
  const baseClasses =
    "cn-button-group group/button-group flex w-fit items-stretch *:focus-visible:relative *:focus-visible:z-10 [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1";

  const orientationClasses: Record<Orientation, string> = {
    horizontal:
      'cn-button-group-orientation-horizontal [&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none',
    vertical:
      'cn-button-group-orientation-vertical flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none',
  };

  return cn(baseClasses, orientationClasses[orientation], className);
}

class ButtonGroup extends Component<ButtonGroupSignature> {
  get classes() {
    return buttonGroupVariants(
      this.args.orientation ?? 'horizontal',
      this.args.class
    );
  }

  <template>
    <div
      class={{this.classes}}
      data-orientation={{if @orientation @orientation "horizontal"}}
      data-slot="button-group"
      role="group"
      ...attributes
    >
      {{yield}}
    </div>
  </template>
}

class ButtonGroupText extends Component<ButtonGroupTextSignature> {
  get classes() {
    return cn(
      'cn-button-group-text flex items-center [&_svg]:pointer-events-none',
      this.args.class
    );
  }

  <template>
    {{#if @asChild}}
      {{yield (hash)}}
    {{else}}
      <div class={{this.classes}} ...attributes>
        {{yield}}
      </div>
    {{/if}}
  </template>
}

class ButtonGroupSeparator extends Component<ButtonGroupSeparatorSignature> {
  get classes() {
    return cn(
      'cn-button-group-separator relative self-stretch data-horizontal:mx-px data-horizontal:w-auto data-vertical:my-px data-vertical:h-auto',
      this.args.class
    );
  }

  <template>
    <Separator
      @class={{this.classes}}
      @orientation={{if @orientation @orientation "vertical"}}
      data-slot="button-group-separator"
      ...attributes
    />
  </template>
}

export {
  ButtonGroup,
  ButtonGroupText,
  ButtonGroupSeparator,
  buttonGroupVariants,
};
