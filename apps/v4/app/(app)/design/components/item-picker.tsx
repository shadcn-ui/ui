"use client"

import * as React from "react"
import Script from "next/script"
import { IconCheck, IconChevronRight } from "@tabler/icons-react"
import { useQueryStates } from "nuqs"
import { RegistryItem } from "shadcn/schema"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/new-york-v4/ui/command"
import { ToolbarItem } from "@/app/(app)/design/components/toolbar"
import { designSystemSearchParams } from "@/app/(app)/design/lib/search-params"

export const CMD_P_FORWARD_TYPE = "cmd-p-forward"

export function ItemPicker({ items }: { items: RegistryItem[] }) {
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
    <ToolbarItem
      title="Component"
      description={
        items.find((item) => item.name === currentItem)?.title ??
        "Search items..."
      }
      icon={<IconChevronRight />}
      open={open}
      onOpenChange={setOpen}
    >
      <Command
        value={open && previousItemTitle ? previousItemTitle : undefined}
        className="**:data-[slot=command-input-wrapper]:bg-input/40 **:data-[slot=command-input-wrapper]:border-input rounded-none bg-transparent **:data-[slot=command-input]:!h-8 **:data-[slot=command-input]:py-0 **:data-[slot=command-input-wrapper]:mb-0 **:data-[slot=command-input-wrapper]:!h-8 **:data-[slot=command-input-wrapper]:rounded-md **:data-[slot=command-input-wrapper]:border"
      >
        <div className="border-popover border-b-4">
          <CommandInput placeholder="Search" />
        </div>
        <CommandList className="no-scrollbar min-h-96 scroll-pt-2 scroll-pb-1.5">
          <CommandEmpty className="text-muted-foreground py-12 text-center text-sm">
            No results found
          </CommandEmpty>
          <CommandGroup className="px-0">
            {items.map((item) => (
              <CommandItem
                key={item.name}
                value={item.title}
                onSelect={() => handleSelect(item.name)}
                data-active={item.name === currentItem}
                className="group/command-item"
              >
                {item.title}
                <IconCheck className="ml-auto size-4 opacity-0 transition-opacity group-data-[active=true]/command-item:opacity-100" />
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </ToolbarItem>
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
              // Forward Cmd/Ctrl + P
              document.addEventListener('keydown', function(e) {
                if (e.key === 'p' && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  if (window.parent && window.parent !== window) {
                    window.parent.postMessage({
                      type: '${CMD_P_FORWARD_TYPE}'
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
