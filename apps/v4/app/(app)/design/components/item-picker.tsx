"use client"

import * as React from "react"
import Script from "next/script"
import { IconChevronDown, IconSearch } from "@tabler/icons-react"
import { useQueryStates } from "nuqs"
import { RegistryItem } from "shadcn/schema"

import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york-v4/ui/popover"
import {
  CustomizerPicker,
  CustomizerPickerGroup,
  CustomizerPickerItem,
} from "@/app/(app)/design/components/customizer"
import { designSystemSearchParams } from "@/app/(app)/design/lib/search-params"

export const CMD_P_FORWARD_TYPE = "cmd-p-forward"

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
          size="sm"
          variant="outline"
          className="dark:bg-input/30 border-input w-72 justify-between rounded-lg border"
        >
          {currentItem?.title} <IconSearch />
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
