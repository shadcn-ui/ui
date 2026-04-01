import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import onKey from 'ember-keyboard/helpers/on-key';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/ember-ui/command';

import Calculator from '~icons/lucide/calculator';
import Calendar from '~icons/lucide/calendar';
import CreditCard from '~icons/lucide/credit-card';
import Settings from '~icons/lucide/settings';
import Smile from '~icons/lucide/smile';
import User from '~icons/lucide/user';

export default class CommandDialogDemo extends Component {
  @tracked open = false;

  toggleOpen = () => {
    this.open = !this.open;
  };

  <template>
    {{onKey "cmd+j" this.toggleOpen}}

    <div>
      <p class="text-muted-foreground text-sm">
        Press
        <kbd
          class="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none"
        >
          <span class="text-xs">⌘</span>J
        </kbd>
      </p>
      <CommandDialog @onOpenChange={{this.toggleOpen}} @open={{this.open}}>
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
      </CommandDialog>
    </div>
  </template>
}
