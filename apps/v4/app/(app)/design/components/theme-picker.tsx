"use client"

import * as React from "react"
import { IconChevronRight } from "@tabler/icons-react"
import { useQueryStates } from "nuqs"

import { cn } from "@/lib/utils"
import { Theme } from "@/registry/themes"
import {
  ToolbarItem,
  ToolbarPicker,
  ToolbarPickerItem,
} from "@/app/(app)/design/components/toolbar"
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
      <ToolbarPicker
        currentValue={
          themes.find((theme) => theme.name === params.theme)?.title ?? null
        }
        open={open}
      >
        {themes.map((theme) => (
          <ToolbarPickerItem
            key={theme.name}
            value={theme.title}
            onSelect={() => handleSelect(theme.name)}
            isActive={theme.name === params.theme}
          >
            {theme.title}{" "}
            <div
              className={cn(
                "bg-primary size-4 rounded-full border",
                `theme-${theme.name}`
              )}
            ></div>
          </ToolbarPickerItem>
        ))}
      </ToolbarPicker>
    </ToolbarItem>
  )
}
