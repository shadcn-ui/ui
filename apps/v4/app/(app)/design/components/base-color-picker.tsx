"use client"

import * as React from "react"
import { IconChevronRight } from "@tabler/icons-react"
import { useQueryStates } from "nuqs"

import { BASE_COLORS, Theme } from "@/registry/themes"
import {
  CustomizerItem,
  CustomizerPicker,
  CustomizerPickerGroup,
  CustomizerPickerItem,
} from "@/app/(app)/design/components/customizer"
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
    <CustomizerItem
      title="Base Color"
      description={currentBaseColor?.title}
      icon={<IconChevronRight />}
      open={open}
      onOpenChange={setOpen}
    >
      <CustomizerPicker
        currentValue={currentBaseColor?.title ?? null}
        open={open}
      >
        <CustomizerPickerGroup>
          {BASE_COLORS.map((baseColor) => (
            <CustomizerPickerItem
              key={baseColor.name}
              value={baseColor.title}
              onSelect={() => handleSelect(baseColor.name)}
              isActive={baseColor.name === params.baseColor}
              className="mb-2 ring-1"
            >
              <div
                style={
                  {
                    "--color": baseColor.cssVars?.light?.["muted-foreground"],
                  } as React.CSSProperties
                }
                className="size-6 translate-x-[-2px] rounded-[4px] bg-(--color)"
              />
              {baseColor.title}
            </CustomizerPickerItem>
          ))}
        </CustomizerPickerGroup>
      </CustomizerPicker>
    </CustomizerItem>
  )
}
