import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { provide, consume } from 'ember-provide-consume-context';

import { eq } from 'ember-truth-helpers';

import { cn } from '@/ember-lib/utils';

import type { TOC } from '@ember/component/template-only';

const TabsContext = 'tabs-context' as const;

interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
}

interface ContextRegistry {
  [TabsContext]: TabsContextValue;
}

interface TabsSignature {
  Args: {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    class?: string;
  };
  Blocks: {
    default: [];
  };
  Element: HTMLDivElement;
}

class Tabs extends Component<TabsSignature> {
  @tracked currentValue?: string;

  get value() {
    return this.args.value ?? this.currentValue ?? this.args.defaultValue ?? '';
  }

  setValue = (value: string) => {
    this.currentValue = value;
    this.args.onValueChange?.(value);
  };

  @provide(TabsContext)
  get context(): TabsContextValue {
    return {
      value: this.value,
      setValue: this.setValue,
    };
  }

  <template>
    <div
      class={{cn "cn-tabs group/tabs flex data-horizontal:flex-col" @class}}
      data-slot="tabs"
      ...attributes
    >
      {{yield}}
    </div>
  </template>
}

interface TabsListSignature {
  Args: {
    variant?: 'default' | 'line';
    class?: string;
  };
  Blocks: {
    default: [];
  };
  Element: HTMLDivElement;
}

const TabsList: TOC<TabsListSignature> = <template>
  <div
    class={{cn
      "cn-tabs-list group/tabs-list inline-flex w-fit items-center justify-center text-muted-foreground group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col"
      (if (eq @variant "line") "cn-tabs-list-variant-line gap-1 bg-transparent" "cn-tabs-list-variant-default bg-muted")
      @class
    }}
    data-slot="tabs-list"
    data-variant={{if @variant @variant "default"}}
    role="tablist"
    ...attributes
  >
    {{yield}}
  </div>
</template>;

interface TabsTriggerSignature {
  Args: {
    value: string;
    class?: string;
    disabled?: boolean;
  };
  Blocks: {
    default: [];
  };
  Element: HTMLButtonElement;
}

class TabsTrigger extends Component<TabsTriggerSignature> {
  @consume(TabsContext) context!: ContextRegistry[typeof TabsContext];

  get isActive() {
    return this.args.value === this.context.value;
  }

  handleClick = () => {
    if (!this.args.disabled) {
      this.context.setValue(this.args.value);
    }
  };

  <template>
    <button
      aria-selected={{if this.isActive "true" "false"}}
      class={{cn
        "cn-tabs-trigger relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center whitespace-nowrap text-foreground/60 transition-all group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 dark:text-muted-foreground dark:hover:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0"
        "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent dark:group-data-[variant=line]/tabs-list:data-active:border-transparent dark:group-data-[variant=line]/tabs-list:data-active:bg-transparent"
        "data-active:bg-background data-active:text-foreground dark:data-active:border-input dark:data-active:bg-input/30 dark:data-active:text-foreground"
        "after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:bottom-[-5px] group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-1 group-data-vertical/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-active:after:opacity-100"
        @class
      }}
      data-slot="tabs-trigger"
      data-state={{if this.isActive "active" "inactive"}}
      disabled={{@disabled}}
      role="tab"
      type="button"
      {{on "click" this.handleClick}}
      ...attributes
    >
      {{yield}}
    </button>
  </template>
}

interface TabsContentSignature {
  Args: {
    value: string;
    class?: string;
  };
  Blocks: {
    default: [];
  };
  Element: HTMLDivElement;
}

class TabsContent extends Component<TabsContentSignature> {
  @consume(TabsContext) context!: ContextRegistry[typeof TabsContext];

  get isActive() {
    return this.args.value === this.context.value;
  }

  <template>
    {{#if this.isActive}}
      <div
        class={{cn "cn-tabs-content flex-1 outline-none" @class}}
        data-slot="tabs-content"
        data-state={{if this.isActive "active" "inactive"}}
        role="tabpanel"
        tabindex="0"
        ...attributes
      >
        {{yield}}
      </div>
    {{/if}}
  </template>
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
