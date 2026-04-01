import { registerDestructor } from '@ember/destroyable';
import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { modifier } from 'ember-modifier';
import { consume, provide } from 'ember-provide-consume-context';
import { TrackedArray } from 'tracked-built-ins';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/ui/dialog';
import { cn } from '@/lib/utils';

import type { TOC } from '@ember/component/template-only';

import Search from '~icons/lucide/search';

const CommandContext = 'command-context' as const;
const CommandGroupContext = 'command-group-context' as const;

interface CommandItemData {
  value: string;
  keywords: string[];
  isVisible: () => boolean;
  isDisabled: () => boolean;
}

interface CommandContextValue {
  search: string;
  setSearch: (value: string) => void;
  selectedValue: string | null;
  setSelectedValue: (value: string | null) => void;
  allGroups: CommandGroupContextValue[];
}

interface CommandGroupContextValue {
  items: CommandItemData[];
}

interface ContextRegistry {
  [CommandContext]: CommandContextValue;
  [CommandGroupContext]: CommandGroupContextValue;
}

interface CommandRootSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

class Command extends Component<CommandRootSignature> {
  @tracked search = '';
  @tracked selectedValue: string | null = null;
  allGroups = new TrackedArray<CommandGroupContextValue>();

  get firstVisibleItem(): string | null {
    for (const group of this.allGroups) {
      for (const item of group.items) {
        if (item.isVisible() && !item.isDisabled()) {
          return item.value;
        }
      }
    }
    return null;
  }

  setSearch = (value: string) => {
    this.search = value;
    requestAnimationFrame(() => {
      this.selectedValue = this.firstVisibleItem;
    });
  };

  setSelectedValue = (value: string | null) => {
    this.selectedValue = value;
  };

  initializeSelection = modifier(() => {
    requestAnimationFrame(() => {
      this.selectedValue = this.firstVisibleItem;
    });
  });

  handleKeyDown = (event: KeyboardEvent) => {
    const key = event.key;

    if (key !== 'ArrowDown' && key !== 'ArrowUp' && key !== 'Enter') {
      return;
    }

    event.preventDefault();

    if (key === 'Enter') {
      const currentTarget = event.currentTarget as HTMLElement;
      const selectedItem = currentTarget.querySelector<HTMLElement>(
        '[data-slot="command-item"][data-selected="true"]'
      );
      selectedItem?.click();
      return;
    }

    const currentTarget = event.currentTarget as HTMLElement;
    const items = Array.from(
      currentTarget.querySelectorAll<HTMLElement>(
        '[data-slot="command-item"]:not([hidden]):not([data-disabled="true"])'
      )
    );

    if (items.length === 0) return;

    const currentIndex = items.findIndex(
      (item) => item.getAttribute('data-selected') === 'true'
    );

    const newIndex =
      key === 'ArrowDown'
        ? currentIndex === -1
          ? 0
          : Math.min(currentIndex + 1, items.length - 1)
        : currentIndex === -1
          ? 0
          : Math.max(currentIndex - 1, 0);

    const newItem = items[newIndex];
    const value = newItem?.getAttribute('data-value');

    if (value && newItem) {
      this.selectedValue = value;
      newItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  };

  @provide(CommandContext)
  get context(): CommandContextValue {
    return {
      search: this.search,
      setSearch: this.setSearch,
      selectedValue: this.selectedValue,
      setSelectedValue: this.setSelectedValue,
      allGroups: this.allGroups,
    };
  }

  <template>
    <div
      aria-controls="command-list"
      aria-expanded="true"
      class={{cn
        "bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md"
        @class
      }}
      data-slot="command"
      role="combobox"
      tabindex="0"
      {{on "keydown" this.handleKeyDown}}
      {{this.initializeSelection}}
      ...attributes
    >
      {{yield}}
    </div>
  </template>
}

interface CommandDialogSignature {
  Args: {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    title?: string;
    description?: string;
    class?: string;
    showCloseButton?: boolean;
  };
  Blocks: {
    default: [];
  };
}

class CommandDialog extends Component<CommandDialogSignature> {
  get title() {
    return this.args.title ?? 'Command Palette';
  }

  get description() {
    return this.args.description ?? 'Search for a command to run...';
  }

  get showCloseButton() {
    return this.args.showCloseButton ?? true;
  }

  <template>
    <Dialog @onOpenChange={{@onOpenChange}} @open={{@open}}>
      <DialogHeader class="sr-only">
        <DialogTitle>{{this.title}}</DialogTitle>
        <DialogDescription>{{this.description}}</DialogDescription>
      </DialogHeader>
      <DialogContent
        @class={{cn "overflow-hidden p-0" @class}}
        @showCloseButton={{this.showCloseButton}}
      >
        <Command
          @class="[&_[data-cmdk-group-heading]]:text-muted-foreground [&_[data-slot=command-input-wrapper]]:h-12 [&_[data-cmdk-group-heading]]:px-2 [&_[data-cmdk-group-heading]]:font-medium [&_[data-cmdk-group]]:px-2 [&_[data-cmdk-group]:not([hidden])_~[data-cmdk-group]]:pt-0 [&_[data-slot=command-input-wrapper]_svg]:h-5 [&_[data-slot=command-input-wrapper]_svg]:w-5 [&_[data-slot=command-input]]:h-12 [&_[data-slot=command-item]]:px-2 [&_[data-slot=command-item]]:py-3 [&_[data-slot=command-item]_svg]:h-5 [&_[data-slot=command-item]_svg]:w-5"
        >
          {{yield}}
        </Command>
      </DialogContent>
    </Dialog>
  </template>
}

interface CommandInputSignature {
  Element: HTMLInputElement;
  Args: {
    class?: string;
    placeholder?: string;
    inputClass?: string;
  };
  Blocks: {
    default: [];
  };
}

class CommandInput extends Component<CommandInputSignature> {
  @consume(CommandContext) context!: ContextRegistry[typeof CommandContext];

  handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    this.context.setSearch(target.value);
  };

  preventDropdownClose = (event: Event) => {
    event.stopPropagation();
  };

  focusInput = modifier((element: HTMLInputElement) => {
    const isInDialogOrPopover =
      element.closest('[data-slot="dialog-content"]') ||
      element.closest('[data-slot="popover-content"]') ||
      element.closest('[data-slot="dropdown-menu-sub-content"]');

    if (isInDialogOrPopover) {
      requestAnimationFrame(() => {
        element.focus();
      });
    }
  });

  <template>
    {{! template-lint-disable no-invalid-interactive no-pointer-down-event-binding }}
    <div
      class={{cn "flex h-9 items-center gap-2 border-b px-3" @class}}
      data-slot="command-input-wrapper"
      role="search"
      {{on "click" this.preventDropdownClose}}
      {{on "mousedown" this.preventDropdownClose}}
    >
      <Search class="size-4 shrink-0 opacity-50" />
      <input
        class={{cn
          "placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
          @inputClass
        }}
        data-slot="command-input"
        placeholder={{@placeholder}}
        type="text"
        value={{this.context.search}}
        {{on "input" this.handleInput}}
        {{this.focusInput}}
        ...attributes
      />
    </div>
  </template>
}

interface CommandListSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const CommandList: TOC<CommandListSignature> = <template>
  <div
    class={{cn
      "max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto"
      @class
    }}
    data-slot="command-list"
    id="command-list"
    role="listbox"
    ...attributes
  >
    {{yield}}
  </div>
</template>;

interface CommandEmptySignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

class CommandEmpty extends Component<CommandEmptySignature> {
  @consume(CommandContext) context!: ContextRegistry[typeof CommandContext];

  get hasVisibleItems(): boolean {
    return this.context.allGroups.some((group) =>
      group.items.some((item) => item.isVisible())
    );
  }

  <template>
    {{#unless this.hasVisibleItems}}
      <div
        class={{cn "py-6 text-center text-sm" @class}}
        data-slot="command-empty"
        ...attributes
      >
        {{yield}}
      </div>
    {{/unless}}
  </template>
}

interface CommandGroupSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
    heading?: string;
  };
  Blocks: {
    default: [];
  };
}

class CommandGroup extends Component<CommandGroupSignature> {
  @consume(CommandContext)
  declare commandContext?: ContextRegistry[typeof CommandContext];
  items = new TrackedArray<CommandItemData>();

  @provide(CommandGroupContext)
  groupContext: CommandGroupContextValue = { items: this.items };

  get hasVisibleItems(): boolean {
    return this.items.some((item) => item.isVisible());
  }

  registerWithCommand = modifier(() => {
    if (!this.commandContext) return;

    this.commandContext.allGroups.push(this.groupContext);

    registerDestructor(this, () => {
      const index = this.commandContext!.allGroups.indexOf(this.groupContext);
      if (index > -1) {
        this.commandContext!.allGroups.splice(index, 1);
      }
    });
  });

  <template>
    <div
      class={{cn
        "text-foreground [&_[data-cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[data-cmdk-group-heading]]:px-2 [&_[data-cmdk-group-heading]]:py-1.5 [&_[data-cmdk-group-heading]]:text-xs [&_[data-cmdk-group-heading]]:font-medium"
        @class
      }}
      data-slot="command-group"
      hidden={{unless this.hasVisibleItems true}}
      {{this.registerWithCommand}}
      ...attributes
    >
      {{#if @heading}}
        <div data-cmdk-group-heading>{{@heading}}</div>
      {{/if}}
      {{yield}}
    </div>
  </template>
}

interface CommandSeparatorSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

class CommandSeparator extends Component<CommandSeparatorSignature> {
  @consume(CommandContext) context!: ContextRegistry[typeof CommandContext];

  get hasVisibleItems(): boolean {
    return this.context.allGroups.some((group) =>
      group.items.some((item) => item.isVisible())
    );
  }

  <template>
    {{#if this.hasVisibleItems}}
      <div
        class={{cn "bg-border -mx-1 h-px" @class}}
        data-slot="command-separator"
        ...attributes
      ></div>
    {{/if}}
  </template>
}

interface CommandItemComponentSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
    disabled?: boolean;
    value: string;
    keywords?: string[];
    onSelect?: (value: string) => void;
  };
  Blocks: {
    default: [];
  };
}

class CommandItem extends Component<CommandItemComponentSignature> {
  @consume(CommandContext) context!: ContextRegistry[typeof CommandContext];
  @consume(CommandGroupContext)
  declare groupContext?: ContextRegistry[typeof CommandGroupContext];

  get isVisible(): boolean {
    const search = this.context.search?.trim();
    if (!search) return true;

    const searchLower = search.toLowerCase();
    const value = this.args.value.toLowerCase();
    const keywords = this.args.keywords || [];

    return (
      value.includes(searchLower) ||
      keywords.some((keyword) => keyword.toLowerCase().includes(searchLower))
    );
  }

  get isSelected(): boolean {
    return this.context.selectedValue === this.args.value;
  }

  registerWithGroup = modifier(() => {
    if (!this.groupContext) return;

    const item: CommandItemData = {
      value: this.args.value,
      keywords: this.args.keywords || [],
      isVisible: () => this.isVisible,
      isDisabled: () => this.args.disabled ?? false,
    };

    this.groupContext.items.push(item);

    registerDestructor(this, () => {
      const index = this.groupContext!.items.indexOf(item);
      if (index > -1) {
        this.groupContext!.items.splice(index, 1);
      }
    });
  });

  handleClick = () => {
    if (!this.args.disabled && this.args.onSelect) {
      this.args.onSelect(this.args.value);
    }
  };

  handleMouseEnter = () => {
    if (!this.args.disabled) {
      this.context.setSelectedValue(this.args.value);
    }
  };

  <template>
    {{#if this.isVisible}}
      <div
        aria-selected={{if this.isSelected "true" "false"}}
        class={{cn
          "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          @class
        }}
        data-disabled={{if @disabled "true" "false"}}
        data-selected={{if this.isSelected "true" "false"}}
        data-slot="command-item"
        data-value={{@value}}
        hidden={{unless this.isVisible true}}
        role="option"
        {{on "click" this.handleClick}}
        {{on "mouseenter" this.handleMouseEnter passive=true}}
        {{this.registerWithGroup}}
        ...attributes
      >
        {{yield}}
      </div>
    {{/if}}
  </template>
}

interface CommandShortcutSignature {
  Element: HTMLSpanElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const CommandShortcut: TOC<CommandShortcutSignature> = <template>
  <span
    class={{cn "text-muted-foreground ml-auto text-xs tracking-widest" @class}}
    data-slot="command-shortcut"
    ...attributes
  >
    {{yield}}
  </span>
</template>;

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
