import { fn } from '@ember/helper';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { Button } from '@/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/ui/command';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';

import MoreHorizontalIcon from '~icons/lucide/more-horizontal';

const labels = [
  'feature',
  'bug',
  'enhancement',
  'documentation',
  'design',
  'question',
  'maintenance',
];

export default class ComboboxDropdownMenu extends Component {
  @tracked label = 'feature';
  @tracked open = false;

  handleLabelSelect = (value: string) => {
    this.label = value;
    this.open = false;
  };

  <template>
    <div
      class="flex w-full flex-col items-start justify-between rounded-md border px-4 py-3 sm:flex-row sm:items-center"
    >
      <p class="text-sm leading-none font-medium">
        <span
          class="bg-primary text-primary-foreground mr-2 rounded-lg px-2 py-1 text-xs"
        >
          {{this.label}}
        </span>
        <span class="text-muted-foreground">Create a new project</span>
      </p>
      <DropdownMenu @onOpenChange={{fn (mut this.open)}} @open={{this.open}}>
        <DropdownMenuTrigger>
          <Button @size="sm" @variant="ghost">
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent @align="end" @class="w-[200px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem>Assign to...</DropdownMenuItem>
            <DropdownMenuItem>Set due date...</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Apply label</DropdownMenuSubTrigger>
              <DropdownMenuSubContent @class="p-0">
                <Command>
                  <CommandInput @placeholder="Filter label..." />
                  <CommandList>
                    <CommandEmpty>No label found.</CommandEmpty>
                    <CommandGroup>
                      {{#each labels as |label|}}
                        <CommandItem
                          @onSelect={{this.handleLabelSelect}}
                          @value={{label}}
                        >
                          {{label}}
                        </CommandItem>
                      {{/each}}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem @class="text-red-600">
              Delete
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </template>
}
