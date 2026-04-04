"use client"

import * as React from "react"
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
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react"

export function CommandDialogDemo() {
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
    calendar: <Calendar />,
    "search-emoji": <Smile />,
    calculator: <Calculator />,
    profile: <User />,
    billing: <CreditCard />,
    settings: <Settings />,
  }

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      <p className="text-sm text-muted-foreground">
        Press{" "}
        <kbd className="pointer-events-none inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 select-none">
          <span className="text-xs">⌘</span>J
        </kbd>
      </p>
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
    </>
  )
}
