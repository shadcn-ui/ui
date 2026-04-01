import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { modifier } from 'ember-modifier';

import { Button } from '@/ember-ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/ember-ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/ember-ui/popover';
import { Sheet, SheetContent, SheetTrigger } from '@/ember-ui/sheet';

interface Status {
  value: string;
  label: string;
}

const statuses: Status[] = [
  { value: 'backlog', label: 'Backlog' },
  { value: 'todo', label: 'Todo' },
  { value: 'in progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
  { value: 'canceled', label: 'Canceled' },
];

const mediaQuery = modifier(
  (
    _element: HTMLElement,
    _positional: [],
    { onChange }: { onChange: (matches: boolean) => void }
  ) => {
    const mediaQueryList = window.matchMedia('(min-width: 768px)');

    const handler = (event: MediaQueryListEvent) => {
      onChange(event.matches);
    };

    onChange(mediaQueryList.matches);

    mediaQueryList.addEventListener('change', handler);

    return () => {
      mediaQueryList.removeEventListener('change', handler);
    };
  }
);

interface StatusListSignature {
  Args: {
    setOpen: (open: boolean) => void;
    setSelectedStatus: (status: Status | null) => void;
  };
}

class StatusList extends Component<StatusListSignature> {
  handleSelect = (value: string) => {
    const status = statuses.find((s) => s.value === value) || null;
    this.args.setSelectedStatus(status);
    this.args.setOpen(false);
  };

  <template>
    <Command>
      <CommandInput @placeholder="Filter status..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {{#each statuses as |status|}}
            <CommandItem
              @onSelect={{this.handleSelect}}
              @value={{status.value}}
            >
              {{status.label}}
            </CommandItem>
          {{/each}}
        </CommandGroup>
      </CommandList>
    </Command>
  </template>
}

export default class ComboboxResponsive extends Component {
  @tracked open = false;
  @tracked isDesktop = false;
  @tracked selectedStatus: Status | null = null;

  get buttonLabel() {
    return this.selectedStatus ? this.selectedStatus.label : '+ Set status';
  }

  setOpen = (open: boolean) => {
    this.open = open;
  };

  setSelectedStatus = (status: Status | null) => {
    this.selectedStatus = status;
  };

  handleMediaQueryChange = (matches: boolean) => {
    this.isDesktop = matches;
  };

  <template>
    <div {{mediaQuery onChange=this.handleMediaQueryChange}}>
      {{#if this.isDesktop}}
        <Popover @onOpenChange={{this.setOpen}} @open={{this.open}}>
          <PopoverTrigger>
            <Button @class="w-[150px] justify-start" @variant="outline">
              {{this.buttonLabel}}
            </Button>
          </PopoverTrigger>
          <PopoverContent @align="start" @class="w-[200px] p-0">
            <StatusList
              @setOpen={{this.setOpen}}
              @setSelectedStatus={{this.setSelectedStatus}}
            />
          </PopoverContent>
        </Popover>
      {{else}}
        <Sheet @onOpenChange={{this.setOpen}} @open={{this.open}}>
          <SheetTrigger @asChild={{true}}>
            <Button @class="w-[150px] justify-start" @variant="outline">
              {{this.buttonLabel}}
            </Button>
          </SheetTrigger>
          <SheetContent @side="bottom">
            <div class="mt-4 border-t">
              <StatusList
                @setOpen={{this.setOpen}}
                @setSelectedStatus={{this.setSelectedStatus}}
              />
            </div>
          </SheetContent>
        </Sheet>
      {{/if}}
    </div>
  </template>
}
