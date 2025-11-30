"use client"

import * as React from "react"
import Script from "next/script"
import { IconSearch } from "@tabler/icons-react"
import { useQueryStates } from "nuqs"
import { RegistryItem } from "shadcn/schema"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Command,
  CommandEmpty,
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
          className="hover:bg-muted/30 flex-1 justify-start gap-1 rounded-lg px-3 text-left font-normal shadow-none"
        >
          <div className="flex flex-col gap-0.5">
            <div className="text-muted-foreground text-xs font-medium">
              Preview
            </div>
            <div className="text-foreground text-sm">{currentItem?.title}</div>
          </div>
          <Kbd className="ml-auto">⌘P</Kbd>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) overflow-hidden rounded-xl p-0 data-[state=closed]:animate-none data-[state=open]:animate-none"
        side="right"
        align="start"
      >
        <Command className="**:[[data-slot=command-input-wrapper]>svg]:hidden">
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
                      {group.title}
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
                if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
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

export function CustomizerPicker({
  children,
  value,
  currentValue,
  open,
  showSearch = false,
  ...props
}: {
  children: React.ReactNode
  value?: string
  currentValue?: string | null
  open?: boolean
  showSearch?: boolean
} & React.ComponentProps<typeof Command>) {
  const [previousValue, setPreviousValue] = React.useState<string | null>(
    currentValue ?? null
  )

  React.useEffect(() => {
    if (currentValue) {
      setPreviousValue(currentValue)
    }
  }, [currentValue])

  const commandValue = React.useMemo(() => {
    if (value !== undefined) {
      return value
    }
    if (open && previousValue) {
      return previousValue
    }
    return undefined
  }, [value, open, previousValue])

  return (
    <Command value={commandValue} {...props}>
      {showSearch && (
        <div className="bg-popover *:data-[slot=command-input-wrapper]:bg-input/40 *:data-[slot=command-input-wrapper]:border-input px-3 pt-0 pb-2 *:data-[slot=command-input-wrapper]:h-8 *:data-[slot=command-input-wrapper]:rounded-md *:data-[slot=command-input-wrapper]:border *:data-[slot=command-input-wrapper]:px-2">
          <CommandInput placeholder="Search" />
        </div>
      )}
      <CommandList className="no-scrollbar scroll-pt-2 scroll-pb-1.5">
        <CommandEmpty className="text-muted-foreground py-12 text-center text-sm">
          No results found
        </CommandEmpty>
        {children}
      </CommandList>
    </Command>
  )
}

export function CustomizerPickerGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandGroup>) {
  return (
    <CommandGroup
      className={cn("px-3 pt-px *:[div]:flex *:[div]:flex-col", className)}
      {...props}
    />
  )
}

export function CustomizerPickerItem({
  isActive,
  className,
  children,
  ...props
}: {
  isActive: boolean
  className?: string
  children: React.ReactNode
} & React.ComponentProps<typeof CommandItem>) {
  return (
    <CommandItem
      data-active={isActive}
      className={cn(
        "group/command-item data-[selected=true]:bg-accent/50 data-[selected=true]:text-accent-foreground ring-border px-2 py-1.5 data-[selected=true]:ring-1",
        className
      )}
      {...props}
    >
      {children}
    </CommandItem>
  )
}
