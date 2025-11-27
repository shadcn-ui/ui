"use client"

import * as React from "react"
import Script from "next/script"
import { IconSearch } from "@tabler/icons-react"
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
} from "@/app/(design)/components/customizer"
import { designSystemSearchParams } from "@/app/(design)/lib/search-params"

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
          className="w-full max-w-xs justify-start rounded-lg shadow-none"
        >
          <IconSearch className="text-muted-foreground" />
          {currentItem?.title}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) rounded-xl px-0 duration-100 data-[state=closed]:animate-none data-[state=open]:animate-none"
        side="bottom"
        align="center"
      >
        <CustomizerPicker
          currentValue={currentItem?.title ?? null}
          open={open}
          showSearch
        >
          <CustomizerPickerGroup className="pb-px">
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
