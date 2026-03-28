"use client"

import * as React from "react"
import { Button } from "@/examples/ark/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandItemText,
  CommandList,
  useListCollection,
} from "@/examples/ark/ui/command"

export function CommandBasic() {
  const [open, setOpen] = React.useState(false)

  const { collection, filter } = useListCollection({
    initialItems: [
      { label: "Calendar", value: "calendar" },
      { label: "Search Emoji", value: "search-emoji" },
      { label: "Calculator", value: "calculator" },
    ],
    filter: (itemString, query) =>
      itemString.toLowerCase().includes(query.toLowerCase()),
  })

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
            {collection.items.map((item) => (
              <CommandItem key={item.value} item={item}>
                <CommandItemText>{item.label}</CommandItemText>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  )
}
