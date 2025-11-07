"use client"

import * as React from "react"
import { IconChevronRight } from "@tabler/icons-react"
import { useQueryStates } from "nuqs"

import { cn } from "@/lib/utils"
import { Theme } from "@/registry/themes"
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
    (theme: Theme["name"]) => {
      setParams({ theme })
      setOpen(false)
    },
    [setParams]
  )

  const currentTheme = React.useMemo(
    () => themes.find((theme) => theme.name === params.theme),
    [themes, params.theme]
  )

  return (
    <ToolbarItem
      title="Theme"
      description={currentTheme?.title}
      icon={<IconChevronRight />}
      open={open}
      onOpenChange={setOpen}
    >
      <ToolbarPicker
        currentValue={currentTheme?.title ?? null}
        open={open}
        hideSearchFilter
      >
        <ToolbarPickerGroup>
          {themes.map((theme) => (
            <ToolbarPickerItem
              key={`theme-${theme.name}`}
              value={theme.title}
              onSelect={() => handleSelect(theme.name)}
              isActive={theme.name === currentTheme?.name}
            >
              {theme.title}{" "}
              <div
                style={
                  {
                    "--primary": theme.cssVars?.light?.primary,
                  } as React.CSSProperties
                }
                className={cn("size-4 rounded-full border bg-(--primary)")}
              ></div>
            </ToolbarPickerItem>
          ))}
        </ToolbarPickerGroup>
      </ToolbarPicker>
    </ToolbarItem>
  )
}
