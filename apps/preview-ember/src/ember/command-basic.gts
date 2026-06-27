import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { Button } from '@/ember-ui/button';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/ember-ui/command';

export default class CommandBasicDemo extends Component {
  @tracked open = false;

  setOpen = (open: boolean) => {
    this.open = open;
  };

  <template>
    <div class="flex flex-col gap-4">
      <Button @variant="outline" @class="w-fit" {{on "click" (fn this.setOpen true)}}>
        Open Menu
      </Button>
      <CommandDialog @open={{this.open}} @onOpenChange={{this.setOpen}}>
        <Command>
          <CommandInput @placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup @heading="Suggestions">
              <CommandItem @value="calendar">Calendar</CommandItem>
              <CommandItem @value="emoji">Search Emoji</CommandItem>
              <CommandItem @value="calculator">Calculator</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  </template>
}
