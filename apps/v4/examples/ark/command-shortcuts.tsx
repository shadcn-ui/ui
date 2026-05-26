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
import { CreditCardIcon, SettingsIcon, UserIcon } from "lucide-react"

export function CommandWithShortcuts() {
  const [open, setOpen] = React.useState(false)

  const { collection, filter } = useListCollection({
    initialItems: [
      { label: "Profile", value: "profile", shortcut: "⌘P" },
      { label: "Billing", value: "billing", shortcut: "⌘B" },
      { label: "Settings", value: "settings", shortcut: "⌘S" },
    ],
    filter: (itemString, query) =>
      itemString.toLowerCase().includes(query.toLowerCase()),
  })

  const icons: Record<string, React.ReactNode> = {
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
            <CommandGroup>
              <CommandGroupLabel>Settings</CommandGroupLabel>
              {collection.items.map((item) => (
                <CommandItem key={item.value} item={item}>
                  {icons[item.value]}
                  <CommandItemText>{item.label}</CommandItemText>
                  <CommandShortcut>{item.shortcut}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  )
}
