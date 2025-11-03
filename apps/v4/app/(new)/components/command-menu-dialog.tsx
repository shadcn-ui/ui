"use client"

import * as React from "react"
import { useQueryStates } from "nuqs"
import { RegistryItem } from "shadcn/schema"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Command } from "@/registry/new-york-v4/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/new-york-v4/ui/dialog"
import { Kbd, KbdGroup } from "@/registry/new-york-v4/ui/kbd"
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/radix-nova/ui/command"
import { designSystemSearchParams } from "@/app/(new)/lib/search-params"

export function CommandMenuDialog({ items }: { items: RegistryItem[] }) {
  const [open, setOpen] = React.useState(false)
  const [, setParams] = useQueryStates(designSystemSearchParams, {
    history: "push",
    shallow: true,
  })

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
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
          variant="secondary"
          className={cn(
            "bg-surface text-foreground dark:bg-card relative ml-auto h-8 justify-start shadow-none sm:pr-14"
          )}
          onClick={() => setOpen(true)}
        >
          Search items...
          <div className="absolute top-1.5 right-1.5 hidden gap-1 sm:flex">
            <KbdGroup>
              <Kbd className="border">⌘</Kbd>
              <Kbd className="border">P</Kbd>
            </KbdGroup>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="rounded-xl border-none bg-clip-padding p-2 shadow-2xl ring-4 ring-neutral-200/80 dark:bg-neutral-900 dark:ring-neutral-800"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Search documentation...</DialogTitle>
          <DialogDescription>Search for a command to run...</DialogDescription>
        </DialogHeader>
        <Command className="**:data-[slot=command-input-wrapper]:bg-input/50 **:data-[slot=command-input-wrapper]:border-input rounded-none bg-transparent **:data-[slot=command-input]:!h-9 **:data-[slot=command-input]:py-0 **:data-[slot=command-input-wrapper]:mb-0 **:data-[slot=command-input-wrapper]:!h-9 **:data-[slot=command-input-wrapper]:rounded-md **:data-[slot=command-input-wrapper]:border">
          <div className="relative">
            <CommandInput placeholder="Search documentation..." />
          </div>
          <CommandList className="no-scrollbar min-h-80 scroll-pt-2 scroll-pb-1.5">
            <CommandEmpty className="text-muted-foreground py-12 text-center text-sm">
              No results found
            </CommandEmpty>
            <CommandGroup className="p-0">
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
