"use client"

import * as React from "react"
import Script from "next/script"
import { IconChevronRight } from "@tabler/icons-react"
import { useQueryStates } from "nuqs"
import { RegistryItem } from "shadcn/schema"

import {
  ToolbarItem,
  ToolbarPicker,
  ToolbarPickerGroup,
  ToolbarPickerItem,
} from "@/app/(app)/design/components/toolbar"
import { designSystemSearchParams } from "@/app/(app)/design/lib/search-params"

export const CMD_P_FORWARD_TYPE = "cmd-p-forward"

export function ItemPicker({ items }: { items: RegistryItem[] }) {
  const [open, setOpen] = React.useState(false)
  const [params, setParams] = useQueryStates(designSystemSearchParams, {
    history: "push",
    shallow: true,
  })

  const currentItem = React.useMemo(() => params.item, [params.item])

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
        items.find((item) => item.name === currentItem)?.title ?? "Search"
      }
      icon={<IconChevronRight />}
      open={open}
      onOpenChange={setOpen}
    >
      <ToolbarPicker
        currentValue={
          items.find((item) => item.name === currentItem)?.title ?? null
        }
        open={open}
        showSearch
      >
        <ToolbarPickerGroup className="pb-3.5">
          {items.map((item) => (
            <ToolbarPickerItem
              key={item.name}
              value={item.title ?? item.name}
              onSelect={() => handleSelect(item.name)}
              isActive={item.name === currentItem}
            >
              {item.title}
            </ToolbarPickerItem>
          ))}
        </ToolbarPickerGroup>
      </ToolbarPicker>
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
