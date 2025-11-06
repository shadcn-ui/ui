"use client"

import * as React from "react"
import { IconCheck, IconChevronRight } from "@tabler/icons-react"
import { useQueryStates } from "nuqs"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/new-york-v4/ui/command"
import { Theme } from "@/registry/themes"
import { ToolbarItem } from "@/app/(app)/design/components/toolbar"
import { designSystemSearchParams } from "@/app/(app)/design/lib/search-params"

export function ThemePicker({ themes }: { themes: readonly Theme[] }) {
  const [open, setOpen] = React.useState(false)
  const [params, setParams] = useQueryStates(designSystemSearchParams, {
    shallow: false,
  })

  const handleSelect = React.useCallback(
    (themeName: Theme["name"]) => {
      setParams({ theme: themeName })
      setOpen(false)
    },
    [setParams]
  )

  return (
    <ToolbarItem
      title="Theme"
      description={themes.find((theme) => theme.name === params.theme)?.title}
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
          <CommandGroup className="px-0">
            {themes.map((theme) => (
              <CommandItem
                key={theme.name}
                value={theme.title}
                onSelect={() => handleSelect(theme.name)}
                data-active={theme.name === params.theme}
                className="group/command-item"
              >
                {theme.title}
                <IconCheck className="ml-auto size-4 opacity-0 transition-opacity group-data-[active=true]/command-item:opacity-100" />
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </ToolbarItem>
  )
}
