import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { eq } from 'ember-truth-helpers';

import { cn } from '@/lib/utils';

import type { TOC } from '@ember/component/template-only';

interface AvatarSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const Avatar: TOC<AvatarSignature> = <template>
  <div
    class={{cn
      "cn-avatar group/avatar relative flex shrink-0 select-none after:absolute after:inset-0 after:border after:border-border after:mix-blend-darken dark:after:mix-blend-lighten"
      @class
    }}
    data-slot="avatar"
    ...attributes
  >
    {{yield}}
  </div>
</template>;

interface AvatarImageSignature {
  Element: HTMLImageElement;
  Args: {
    src: string;
    alt?: string;
    class?: string;
    onLoadingStatusChange?: (
      status: 'idle' | 'loading' | 'loaded' | 'error'
    ) => void;
  };
}

class AvatarImage extends Component<AvatarImageSignature> {
  @tracked loadingStatus: 'idle' | 'loading' | 'loaded' | 'error' = 'loading';

  handleLoad = () => {
    this.loadingStatus = 'loaded';
    this.args.onLoadingStatusChange?.('loaded');
  };

  handleError = () => {
    this.loadingStatus = 'error';
    this.args.onLoadingStatusChange?.('error');
  };

  <template>
    {{#unless (eq this.loadingStatus "error")}}
      <img
        alt={{if @alt @alt ""}}
        class={{cn "cn-avatar-image aspect-square size-full object-cover" @class}}
        src={{@src}}
        data-slot="avatar-image"
        {{on "error" this.handleError}}
        {{on "load" this.handleLoad}}
        ...attributes
      />
    {{/unless}}
  </template>
}

interface AvatarFallbackSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
    delayMs?: number;
  };
  Blocks: {
    default: [];
  };
}

const AvatarFallback: TOC<AvatarFallbackSignature> = <template>
  <div
    class={{cn
      "cn-avatar-fallback flex size-full items-center justify-center text-sm group-data-[size=sm]/avatar:text-xs"
      @class
    }}
    data-slot="avatar-fallback"
    ...attributes
  >
    {{yield}}
  </div>
</template>;

export { Avatar, AvatarImage, AvatarFallback };
