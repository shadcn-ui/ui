import { cn } from '@/lib/utils';

import type { TOC } from '@ember/component/template-only';

import ChevronDown from '~icons/lucide/chevron-down';

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
    class="group/native-select relative w-fit has-[select:disabled]:opacity-50"
    data-slot="native-select-wrapper"
  >
    <select
      class={{cn
        "border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 dark:hover:bg-input/50 h-9 w-full min-w-0 appearance-none rounded-md border bg-transparent px-3 py-2 pr-9 text-sm shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed data-[size=sm]:h-8 data-[size=sm]:py-1"
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
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
      class="text-muted-foreground pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 opacity-50 select-none"
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
  <option data-slot="native-select-option" ...attributes>
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
    class={{cn @class}}
    data-slot="native-select-optgroup"
    ...attributes
  >
    {{yield}}
  </optgroup>
</template>;

export { NativeSelect, NativeSelectOption, NativeSelectOptGroup };
