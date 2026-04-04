"use client"

import * as React from "react"
import { Button } from "@/examples/ark/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandItemText,
  CommandList,
  CommandShortcut,
  useListCollection,
} from "@/examples/ark/ui/command"
import {
  CalculatorIcon,
  CalendarIcon,
  CreditCardIcon,
  SettingsIcon,
  SmileIcon,
  UserIcon,
} from "lucide-react"

export function CommandWithGroups() {
  const [open, setOpen] = React.useState(false)

  const { collection, filter } = useListCollection({
    initialItems: [
      { label: "Calendar", value: "calendar", group: "suggestions" },
      { label: "Search Emoji", value: "search-emoji", group: "suggestions" },
      { label: "Calculator", value: "calculator", group: "suggestions" },
      {
        label: "Profile",
        value: "profile",
        group: "settings",
        shortcut: "⌘P",
      },
      {
        label: "Billing",
        value: "billing",
        group: "settings",
        shortcut: "⌘B",
      },
      {
        label: "Settings",
        value: "settings",
        group: "settings",
        shortcut: "⌘S",
      },
    ],
    filter: (itemString, query) =>
      itemString.toLowerCase().includes(query.toLowerCase()),
    groupBy: (item) => item.group,
    groupSort: ["suggestions", "settings"],
  })

  const icons: Record<string, React.ReactNode> = {
    calendar: <CalendarIcon />,
    "search-emoji": <SmileIcon />,
    calculator: <CalculatorIcon />,
    profile: <UserIcon />,
    billing: <CreditCardIcon />,
    settings: <SettingsIcon />,
  }

  return (
    <div className="flex flex-col gap-4">
      <Button onClick={() => setOpen(true)} variant="outline" className="w-fit">
        Open Menu
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command
          collection={collection}
          onValueChange={() => {
            setOpen(false)
            filter("")
          }}
        >
          <CommandInput
            placeholder="Type a command or search..."
            onFilter={filter}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {collection.group().map(([group, items]) => (
              <CommandGroup key={group}>
                <CommandGroupLabel className="capitalize">
                  {group}
                </CommandGroupLabel>
                {items.map((item) => (
                  <CommandItem key={item.value} item={item}>
                    {icons[item.value]}
                    <CommandItemText>{item.label}</CommandItemText>
                    {item.shortcut && (
                      <CommandShortcut>{item.shortcut}</CommandShortcut>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  )
}
