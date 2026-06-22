import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/ui/command';

import Calculator from '~icons/material-symbols/calculate-outline-rounded';
import Calendar from '~icons/material-symbols/calendar-month-outline-rounded';
import CreditCard from '~icons/material-symbols/credit-card';
import Settings from '~icons/material-symbols/settings-outline-rounded';
import Smile from '~icons/material-symbols/mood-outline-rounded';
import User from '~icons/material-symbols/person-outline-rounded';

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
