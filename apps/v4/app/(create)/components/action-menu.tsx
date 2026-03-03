"use client"

import Script from "next/script"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/examples/base/ui/command"
import { type RegistryItem } from "shadcn/schema"

import { useActionMenu } from "@/app/(create)/hooks/use-action-menu"

export const CMD_K_FORWARD_TYPE = "cmd-k-forward"

export function ActionMenu({
  itemsByBase,
}: {
  itemsByBase: Record<string, Pick<RegistryItem, "name" | "title" | "type">[]>
}) {
  const {
    activeRegistryName,
    getCommandValue,
    groups,
    handleSelect,
    open,
    setOpen,
  } = useActionMenu(itemsByBase)

  return (
    <CommandDialog open={open} onOpenChange={setOpen} className="animate-none!">
      <Command loop>
        <CommandInput placeholder="Search" />
        <CommandList>
          <CommandEmpty>No items found.</CommandEmpty>
          <CommandGroup>
            {groups.map((group) =>
              group.items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={getCommandValue(item)}
                  data-checked={activeRegistryName === item.registryName}
                  className="px-2"
                  onSelect={() => {
                    handleSelect(item.registryName)
                  }}
                >
                  {item.label}
                </CommandItem>
              ))
            )}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}

export function ActionMenuScript() {
  return (
    <Script
      id="design-system-listener"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `
            (function() {
              // Forward Cmd/Ctrl + K (and P) to parent
              document.addEventListener('keydown', function(e) {
                if ((e.key === 'k' || e.key === 'p') && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  if (window.parent && window.parent !== window) {
                    window.parent.postMessage({
                      type: '${CMD_K_FORWARD_TYPE}',
                      key: e.key
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
