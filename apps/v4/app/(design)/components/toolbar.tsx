"use client"

import * as React from "react"
import Script from "next/script"
import { useQueryStates } from "nuqs"
import { RegistryItem } from "shadcn/schema"

import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
} from "@/registry/new-york-v4/ui/combobox"
import { Kbd } from "@/registry/new-york-v4/ui/kbd"
import { InstallDialog } from "@/app/(design)/components/install-dialog"
import { designSystemSearchParams } from "@/app/(design)/lib/search-params"
import { groupItemsByType } from "@/app/(design)/lib/utils"

export const CMD_K_FORWARD_TYPE = "cmd-k-forward"

const cachedGroupedItems = React.cache(
  (items: Pick<RegistryItem, "name" | "title" | "type">[]) => {
    return groupItemsByType(items)
  }
)

export function Toolbar({
  items,
}: {
  items: Pick<RegistryItem, "name" | "title" | "type">[]
}) {
  const anchorRef = useComboboxAnchor()
  return (
    <div
      className="bg-background ring-foreground/10 3xl:-translate-x-1/2 fixed bottom-8 left-1/2 flex h-10 w-full max-w-lg translate-x-[calc((--spacing(27)+50%)*-1)] items-center gap-2 rounded-xl border-0 p-1.5 ring-1"
      ref={anchorRef}
    >
      <ItemPicker items={items} anchorRef={anchorRef} />
      <InstallDialog />
    </div>
  )
}

function ItemPicker({
  items,
  anchorRef,
}: {
  items: Pick<RegistryItem, "name" | "title" | "type">[]
  anchorRef: ReturnType<typeof useComboboxAnchor>
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
    (item: Pick<RegistryItem, "name" | "title" | "type">) => {
      setParams({ item: item.name })
      setOpen(false)
    },
    [setParams]
  )

  const comboboxValue = React.useMemo(() => {
    return currentItem ?? null
  }, [currentItem])

  return (
    <Combobox
      autoHighlight
      items={groupedItems}
      value={comboboxValue}
      onValueChange={(value) => {
        if (value) {
          handleSelect(value)
        }
      }}
      open={open}
      onOpenChange={setOpen}
      itemToStringValue={(item) => {
        if (!item) {
          return ""
        }
        // Handle both groups and items.
        if ("items" in item) {
          return item.title ?? ""
        }
        return item.title ?? item.name ?? ""
      }}
    >
      <ComboboxTrigger render={<Button variant="outline" />}>
        <ComboboxValue>
          {(value) => (
            <div className="text-foreground text-sm font-medium">
              {value?.title || "Not Found"}
            </div>
          )}
        </ComboboxValue>
        <Kbd className="ml-auto">⌘P</Kbd>
      </ComboboxTrigger>
      <ComboboxContent
        className="ring-foreground/10 w-64 rounded-xl border-0 ring-1 data-closed:animate-none data-open:animate-none"
        side="top"
        align="center"
        anchor={anchorRef}
      >
        <ComboboxInput
          showTrigger={false}
          placeholder="Search"
          className="bg-muted h-8 rounded-lg shadow-none has-focus-visible:border-inherit! has-focus-visible:ring-0!"
        />
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList className="no-scrollbar scroll-my-1 pb-1">
          {(group) => (
            <ComboboxGroup key={group.type} items={group.items}>
              <ComboboxLabel>{group.title}</ComboboxLabel>
              <ComboboxCollection>
                {(item) => (
                  <ComboboxItem
                    key={item.name}
                    value={item}
                    className="group/combobox-item rounded-lg"
                  >
                    {item.title}
                    <span className="text-muted-foreground ml-auto text-xs opacity-0 group-data-[selected=true]/combobox-item:opacity-100">
                      {group.title}
                    </span>
                  </ComboboxItem>
                )}
              </ComboboxCollection>
            </ComboboxGroup>
          )}
        </ComboboxList>
      </ComboboxContent>
      <div
        data-open={open}
        className="fixed inset-0 z-50 hidden bg-transparent data-[open=true]:block"
        onClick={() => setOpen(false)}
      />
    </Combobox>
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
