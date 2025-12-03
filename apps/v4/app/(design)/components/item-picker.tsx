"use client"

import * as React from "react"
import Script from "next/script"
import { useQueryStates } from "nuqs"
import { RegistryItem } from "shadcn/schema"

import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/new-york-v4/ui/command"
import { Kbd } from "@/registry/new-york-v4/ui/kbd"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york-v4/ui/popover"
import { designSystemSearchParams } from "@/app/(design)/lib/search-params"
import { groupItemsByType } from "@/app/(design)/lib/utils"

export const CMD_K_FORWARD_TYPE = "cmd-k-forward"

const cachedGroupedItems = React.cache(
  (items: Pick<RegistryItem, "name" | "title" | "type">[]) => {
    return groupItemsByType(items)
  }
)

export function ItemPicker({
  items,
}: {
  items: Pick<RegistryItem, "name" | "title" | "type">[]
}) {
  const [open, setOpen] = React.useState(false)
  const [params, setParams] = useQueryStates(designSystemSearchParams, {
    history: "push",
    shallow: true,
  })

  const groupedItems = React.useMemo(() => cachedGroupedItems(items), [items])

  const currentItem = React.useMemo(
    () => items.find((item) => item.name === params.item) ?? null,
    [items, params.item]
  )

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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="hover:bg-muted ring-foreground/10 dark:hover:bg-muted/50 data-[state=open]:bg-muted/50 dark:data-[state=open]:bg-muted/50 h-12 flex-0 justify-start gap-1 rounded-lg border-0 px-2 py-1.5 text-left font-normal shadow-none dark:bg-transparent"
        >
          <div className="flex flex-col gap-0.5">
            <div className="text-muted-foreground text-xs">Preview</div>
            <div className="text-foreground text-sm font-medium">
              {currentItem?.title || "Not Found"}
            </div>
          </div>
          <Kbd className="ml-auto">⌘P</Kbd>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="ring-foreground/10 w-64 overflow-hidden rounded-xl border-0 p-0 ring-1 data-[state=closed]:animate-none data-[state=open]:animate-none"
        side="left"
        align="start"
      >
        <Command
          className="**:[[data-slot=command-input-wrapper]>svg]:hidden"
          defaultValue={params.item ?? ""}
        >
          <CommandInput placeholder="Search" />
          <CommandList>
            <CommandGroup>
              {groupedItems.map((group) =>
                group.items.map((item) => (
                  <CommandItem
                    key={item.name}
                    value={item.title ?? item.name}
                    onSelect={() => handleSelect(item.name)}
                    data-checked={item.name === currentItem?.name}
                    className="group/command-item rounded-lg"
                  >
                    {item.title}
                    <span className="text-muted-foreground ml-auto text-xs opacity-0 group-data-[selected=true]/command-item:opacity-100">
                      {group.type}
                    </span>
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
      <div
        data-open={open}
        className="fixed inset-0 z-50 hidden bg-transparent data-[open=true]:block"
        onClick={() => setOpen(false)}
      />
    </Popover>
  )
}

export function ItemPickerScript() {
  return (
    <Script
      id="design-system-listener"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `
            (function() {
              // Forward Cmd/Ctrl + K
              document.addEventListener('keydown', function(e) {
                if (e.key === 'p' && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  if (window.parent && window.parent !== window) {
                    window.parent.postMessage({
                      type: '${CMD_K_FORWARD_TYPE}'
                    }, '*');
                  }
                }
              });

            })();
          `,
      }}
    />
  )
}
