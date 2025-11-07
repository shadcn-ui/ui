"use client"

import * as React from "react"
import { IconChevronRight } from "@tabler/icons-react"
import { useQueryStates } from "nuqs"

import { Font } from "@/registry/fonts"
import {
  CustomizerItem,
  CustomizerPicker,
  CustomizerPickerGroup,
  CustomizerPickerItem,
} from "@/app/(app)/design/components/customizer"
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

  const currentFont = React.useMemo(
    () => fonts.find((font) => font.value === params.font),
    [fonts, params.font]
  )

  return (
    <CustomizerItem
      title="Font"
      description={currentFont?.name}
      icon={<IconChevronRight />}
      open={open}
      onOpenChange={setOpen}
    >
      <CustomizerPicker
        currentValue={currentFont?.name ?? null}
        open={open}
        showSearch
      >
        <CustomizerPickerGroup>
          {fonts.map((font) => (
            <CustomizerPickerItem
              key={font.value}
              value={font.name}
              onSelect={() => handleSelect(font.value)}
              isActive={font.value === params.font}
              className="ring-border mb-2 ring-1"
            >
              <div className="flex flex-col gap-0.5 p-1">
                <span className="text-muted-foreground text-xs font-medium">
                  {font.name}
                </span>
                <span
                  className="text-sm"
                  style={{ fontFamily: font.font.style.fontFamily }}
                >
                  The quick brown fox jumps over the lazy dog.
                </span>
              </div>
            </CustomizerPickerItem>
          ))}
        </CustomizerPickerGroup>
      </CustomizerPicker>
    </CustomizerItem>
  )
}
