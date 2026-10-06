"use client"

import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/styles/aria-nova/ui/command"

export function CommandDemo() {
  return (
    <Command className="max-w-sm rounded-lg border">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList
        renderEmptyState={() => <CommandEmpty>No results found.</CommandEmpty>}
      >
        <CommandGroup heading="Suggestions">
          <CommandItem textValue="Calendar">
            <Calendar />
            <span>Calendar</span>
          </CommandItem>
          <CommandItem textValue="Search Emoji">
            <Smile />
            <span>Search Emoji</span>
          </CommandItem>
          <CommandItem textValue="Calculator" isDisabled>
            <Calculator />
            <span>Calculator</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem textValue="Profile">
            <User />
            <span>Profile</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem textValue="Billing">
            <CreditCard />
            <span>Billing</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem textValue="Settings">
            <Settings />
            <span>Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
