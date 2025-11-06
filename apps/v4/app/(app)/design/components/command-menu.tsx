"use client"

import * as React from "react"
import { IconSearch } from "@tabler/icons-react"
import { useQueryStates } from "nuqs"
import { RegistryItem } from "shadcn/schema"

import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/new-york-v4/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/new-york-v4/ui/dialog"
import { designSystemSearchParams } from "@/app/(app)/design/lib/search-params"

export function CommandMenu({ items }: { items: RegistryItem[] }) {
  const [open, setOpen] = React.useState(false)
  const [params, setParams] = useQueryStates(designSystemSearchParams, {
    history: "push",
    shallow: true,
  })

  const currentItem = params.item
  const [previousItem, setPreviousItem] = React.useState<string | null>(
    currentItem ?? null
  )

  React.useEffect(() => {
    if (currentItem) {
      setPreviousItem(currentItem)
    }
  }, [currentItem])

  const previousItemTitle = React.useMemo(() => {
    if (!previousItem) {
      return null
    }
    const item = items.find((item) => item.name === previousItem)
    return item?.title ?? null
  }, [items, previousItem])

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "p" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleSelect = React.useCallback(
    (itemName: string) => {
      setParams({ item: itemName })
      setOpen(false)
    },
    [setParams]
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          className="justify-between font-normal"
        >
          Search items...
          <IconSearch className="text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="rounded-xl border-none bg-clip-padding p-2 shadow-2xl ring-4 ring-neutral-200/80 dark:bg-neutral-900 dark:ring-neutral-800"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Search items...</DialogTitle>
          <DialogDescription>Search items...</DialogDescription>
        </DialogHeader>
        <Command
          value={open && previousItemTitle ? previousItemTitle : undefined}
          className="**:data-[slot=command-input-wrapper]:bg-input/50 **:data-[slot=command-input-wrapper]:border-input rounded-none bg-transparent **:data-[slot=command-input]:!h-9 **:data-[slot=command-input]:py-0 **:data-[slot=command-input-wrapper]:mb-0 **:data-[slot=command-input-wrapper]:!h-9 **:data-[slot=command-input-wrapper]:rounded-md **:data-[slot=command-input-wrapper]:border"
        >
          <div className="relative">
            <CommandInput placeholder="Search items..." />
          </div>
          <CommandList className="no-scrollbar min-h-80 scroll-pt-2 scroll-pb-1.5">
            <CommandEmpty className="text-muted-foreground py-12 text-center text-sm">
              No results found
            </CommandEmpty>
            <CommandGroup className="px-0">
              {items.map((item) => (
                <CommandItem
                  key={item.name}
                  value={item.title}
                  onSelect={() => handleSelect(item.name)}
                >
                  {item.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
