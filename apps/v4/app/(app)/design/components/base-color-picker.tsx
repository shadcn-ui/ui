"use client"

import * as React from "react"
import { IconChevronRight } from "@tabler/icons-react"
import { useQueryStates } from "nuqs"

import { BASE_COLORS, Theme } from "@/registry/themes"
import {
  ToolbarItem,
  ToolbarPicker,
  ToolbarPickerGroup,
  ToolbarPickerItem,
} from "@/app/(app)/design/components/toolbar"
import { designSystemSearchParams } from "@/app/(app)/design/lib/search-params"

export function BaseColorPicker() {
  const [open, setOpen] = React.useState(false)
  const [params, setParams] = useQueryStates(designSystemSearchParams, {
    shallow: false,
  })

  const handleSelect = React.useCallback(
    (baseColor: Theme["name"]) => {
      setParams({ baseColor })
      setOpen(false)
    },
    [setParams]
  )

  const currentBaseColor = React.useMemo(
    () => BASE_COLORS.find((baseColor) => baseColor.name === params.baseColor),
    [params.baseColor]
  )

  return (
    <ToolbarItem
      title="Base Color"
      description={currentBaseColor?.title}
      icon={<IconChevronRight />}
      open={open}
      onOpenChange={setOpen}
    >
      <ToolbarPicker currentValue={currentBaseColor?.title ?? null} open={open}>
        <ToolbarPickerGroup>
          {BASE_COLORS.map((baseColor) => (
            <ToolbarPickerItem
              key={baseColor.name}
              value={baseColor.title}
              onSelect={() => handleSelect(baseColor.name)}
              isActive={baseColor.name === params.baseColor}
            >
              {baseColor.title}
            </ToolbarPickerItem>
          ))}
        </ToolbarPickerGroup>
      </ToolbarPicker>
    </ToolbarItem>
  )
}
