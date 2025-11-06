"use client"

import * as React from "react"
import { IconCheck, IconChevronRight } from "@tabler/icons-react"
import { useQueryStates } from "nuqs"

import { Font } from "@/registry/fonts"
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

export function FontPicker({ fonts }: { fonts: readonly Font[] }) {
  const [open, setOpen] = React.useState(false)
  const [params, setParams] = useQueryStates(designSystemSearchParams, {
    shallow: false,
  })

  const handleSelect = React.useCallback(
    (fontValue: Font["value"]) => {
      setParams({ font: fontValue })
      setOpen(false)
    },
    [setParams]
  )

  return (
    <ToolbarItem
      title="Font"
      description={fonts.find((font) => font.value === params.font)?.name}
      icon={<IconChevronRight />}
      open={open}
      onOpenChange={setOpen}
    >
      <Command className="**:data-[slot=command-input-wrapper]:bg-input/40 **:data-[slot=command-input-wrapper]:border-input rounded-none bg-transparent pt-4 **:data-[slot=command-input]:!h-8 **:data-[slot=command-input]:py-0 **:data-[slot=command-input-wrapper]:mb-0 **:data-[slot=command-input-wrapper]:!h-8 **:data-[slot=command-input-wrapper]:rounded-md **:data-[slot=command-input-wrapper]:border">
        <div className="border-popover border-b-4">
          <CommandInput placeholder="Search" />
        </div>
        <CommandList className="no-scrollbar min-h-96 scroll-pt-2 scroll-pb-1.5">
          <CommandEmpty className="text-muted-foreground py-12 text-center text-sm">
            No results found
          </CommandEmpty>
          <CommandGroup className="px-0 *:[div]:flex *:[div]:flex-col *:[div]:gap-2">
            {fonts.map((font) => (
              <CommandItem
                key={font.value}
                value={font.name}
                onSelect={() => handleSelect(font.value)}
                data-active={font.value === params.font}
                className="group/command-item data-[active=true]:border-primary ring-primary border p-3"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-muted-foreground text-xs font-medium">
                    {font.name}
                  </span>
                  <span
                    className="text-sm"
                    style={{ fontFamily: font.font.style.fontFamily }}
                  >
                    The quick brown fox jumps over the lazy dog
                  </span>
                </div>
                <IconCheck className="ml-auto size-4 self-start opacity-0 transition-opacity group-data-[active=true]/command-item:opacity-100" />
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </ToolbarItem>
  )
}
