"use client"

import * as React from "react"
import { IconChevronRight } from "@tabler/icons-react"
import { useQueryStates } from "nuqs"

import { cn } from "@/lib/utils"
import { BASE_COLORS, Theme } from "@/registry/themes"
import {
  ToolbarItem,
  ToolbarPicker,
  ToolbarPickerGroup,
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
        hideSearchFilter
      >
        <ToolbarPickerGroup heading="Base Color">
          {BASE_COLORS.map((baseColor) => (
            <ToolbarPickerItem
              key={`base-color-${baseColor.name}`}
              value={baseColor.title}
              onSelect={() => handleSelect(baseColor.name)}
              isActive={baseColor.name === params.baseColor}
            >
              {baseColor.title}
            </ToolbarPickerItem>
          ))}
        </ToolbarPickerGroup>
        <ToolbarPickerGroup heading="Colors">
          {themes.map((theme) => (
            <ToolbarPickerItem
              key={`theme-${theme.name}`}
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
        </ToolbarPickerGroup>
      </ToolbarPicker>
    </ToolbarItem>
  )
}
