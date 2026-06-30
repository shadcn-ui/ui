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
  CommandSeparator,
  CommandShortcut,
} from '@/ember-ui/command';

import Calculator from '~icons/ms/calculate';
import Calendar from '~icons/ms/calendar_month';
import CreditCard from '~icons/ms/credit_card';
import Settings from '~icons/ms/settings';
import Smile from '~icons/ms/mood';
import User from '~icons/ms/person';

export default class CommandGroupsDemo extends Component {
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
              <CommandItem @value="calendar">
                <Calendar />
                <span>Calendar</span>
              </CommandItem>
              <CommandItem @value="emoji">
                <Smile />
                <span>Search Emoji</span>
              </CommandItem>
              <CommandItem @value="calculator">
                <Calculator />
                <span>Calculator</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup @heading="Settings">
              <CommandItem @value="profile">
                <User />
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem @value="billing">
                <CreditCard />
                <span>Billing</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem @value="settings">
                <Settings />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  </template>
}
