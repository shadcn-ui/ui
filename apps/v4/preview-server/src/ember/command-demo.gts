import {
  Command,
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

<template>
  <Command @class="rounded-lg border shadow-md md:min-w-[450px]">
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
        <CommandItem @disabled={{true}} @value="calculator">
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
</template>
