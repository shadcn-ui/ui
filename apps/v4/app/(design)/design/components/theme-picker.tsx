"use client"

import * as React from "react"
import { IconChevronRight } from "@tabler/icons-react"
import { useQueryStates } from "nuqs"

import { cn } from "@/lib/utils"
import { Theme } from "@/registry/themes"
import {
  CustomizerItem,
  CustomizerPicker,
  CustomizerPickerGroup,
  CustomizerPickerItem,
} from "@/app/(design)/design/components/customizer"
import { designSystemSearchParams } from "@/app/(design)/design/lib/search-params"

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
    <CustomizerItem
      title="Theme"
      description={currentTheme?.title}
      icon={<IconChevronRight />}
      open={open}
      onOpenChange={setOpen}
    >
      <CustomizerPicker currentValue={currentTheme?.title ?? null} open={open}>
        <CustomizerPickerGroup>
          {themes.map((theme) => (
            <CustomizerPickerItem
              key={`theme-${theme.name}`}
              value={theme.title}
              onSelect={() => handleSelect(theme.name)}
              isActive={theme.name === currentTheme?.name}
              className="mb-2 ring-1"
            >
              <div
                style={
                  {
                    "--color": theme.cssVars?.light?.primary,
                  } as React.CSSProperties
                }
                className="size-6 translate-x-[-2px] rounded-[4px] bg-(--color)"
              />
              {theme.title}{" "}
            </CustomizerPickerItem>
          ))}
        </CustomizerPickerGroup>
      </CustomizerPicker>
    </CustomizerItem>
  )
}
