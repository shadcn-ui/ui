"use client"

import * as React from "react"
import Script from "next/script"
import { IconSearch } from "@tabler/icons-react"
import { useQueryStates } from "nuqs"
import { RegistryItem } from "shadcn/schema"

import { Button } from "@/registry/new-york-v4/ui/button"
import { Kbd, KbdGroup } from "@/registry/new-york-v4/ui/kbd"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york-v4/ui/popover"
import {
  CustomizerPicker,
  CustomizerPickerGroup,
  CustomizerPickerItem,
} from "@/app/(design)/design/components/customizer"
import { designSystemSearchParams } from "@/app/(design)/design/lib/search-params"

export const CMD_K_FORWARD_TYPE = "cmd-k-forward"

export function ItemPicker({
  items,
}: {
  items: Pick<RegistryItem, "name" | "title">[]
}) {
  const [open, setOpen] = React.useState(false)
  const [params, setParams] = useQueryStates(designSystemSearchParams, {
    history: "push",
    shallow: true,
  })

  const currentItem = React.useMemo(
    () => items.find((item) => item.name === params.item) ?? null,
    [items, params.item]
  )

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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="w-72 justify-start rounded-lg border shadow-none"
        >
          {currentItem?.title}
          <KbdGroup className="ml-auto translate-x-1.5">
            <Kbd className="border">⌘</Kbd>
            <Kbd className="border">K</Kbd>
          </KbdGroup>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="rounded-xl px-0" side="bottom" align="end">
        <CustomizerPicker
          currentValue={currentItem?.title ?? null}
          open={open}
          showSearch
        >
          <CustomizerPickerGroup className="pb-3.5">
            {items.map((item) => (
              <CustomizerPickerItem
                key={item.name}
                value={item.title ?? item.name}
                onSelect={() => handleSelect(item.name)}
                isActive={item.name === currentItem?.name}
              >
                {item.title}
              </CustomizerPickerItem>
            ))}
          </CustomizerPickerGroup>
        </CustomizerPicker>
      </PopoverContent>
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
