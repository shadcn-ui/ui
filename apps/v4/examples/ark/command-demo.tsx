"use client"

import {
  Command,
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
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react"

export function CommandDemo() {
  const { collection, filter } = useListCollection({
    initialItems: [
      { label: "Calendar", value: "calendar", group: "suggestions" },
      { label: "Search Emoji", value: "search-emoji", group: "suggestions" },
      {
        label: "Calculator",
        value: "calculator",
        group: "suggestions",
        disabled: true,
      },
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
    calendar: <Calendar />,
    "search-emoji": <Smile />,
    calculator: <Calculator />,
    profile: <User />,
    billing: <CreditCard />,
    settings: <Settings />,
  }

  return (
    <Command className="max-w-sm rounded-lg border" collection={collection}>
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
  )
}
