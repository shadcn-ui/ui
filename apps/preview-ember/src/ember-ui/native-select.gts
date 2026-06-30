import { cn } from '@/ember-lib/utils';

import type { TOC } from '@ember/component/template-only';

import ChevronDown from '~icons/ms/keyboard_arrow_down';

interface NativeSelectSignature {
  Element: HTMLSelectElement;
  Args: {
    class?: string;
    size?: 'sm' | 'default';
  };
  Blocks: {
    default: [];
  };
}

const NativeSelect: TOC<NativeSelectSignature> = <template>
  <div
    class="cn-native-select-wrapper group/native-select relative w-fit has-[select:disabled]:opacity-50"
    data-slot="native-select-wrapper"
    data-size={{if @size @size "default"}}
  >
    <select
      class={{cn
        "cn-native-select outline-none disabled:pointer-events-none disabled:cursor-not-allowed"
        @class
      }}
      data-size={{if @size @size "default"}}
      data-slot="native-select"
      ...attributes
    >
      {{yield}}
    </select>
    <ChevronDown
      aria-hidden="true"
      class="cn-native-select-icon pointer-events-none absolute select-none"
      data-slot="native-select-icon"
    />
  </div>
</template>;

interface NativeSelectOptionSignature {
  Element: HTMLOptionElement;
  Args: Record<string, never>;
  Blocks: {
    default: [];
  };
}

const NativeSelectOption: TOC<NativeSelectOptionSignature> = <template>
  <option
    class="bg-[Canvas] text-[CanvasText]"
    data-slot="native-select-option"
    ...attributes
  >
    {{yield}}
  </option>
</template>;

interface NativeSelectOptGroupSignature {
  Element: HTMLOptGroupElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const NativeSelectOptGroup: TOC<NativeSelectOptGroupSignature> = <template>
  <optgroup
    class={{cn "bg-[Canvas] text-[CanvasText]" @class}}
    data-slot="native-select-optgroup"
    ...attributes
  >
    {{yield}}
  </optgroup>
</template>;

export { NativeSelect, NativeSelectOption, NativeSelectOptGroup };
