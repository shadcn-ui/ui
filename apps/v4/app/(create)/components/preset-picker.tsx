"use client"

import * as React from "react"
import { useQueryStates } from "nuqs"

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/registry/bases/radix/ui/item"
import { type Preset } from "@/registry/config"
import {
  Picker,
  PickerContent,
  PickerGroup,
  PickerRadioGroup,
  PickerRadioItem,
  PickerSeparator,
  PickerTrigger,
} from "@/app/(create)/components/picker"
import { designSystemSearchParams } from "@/app/(create)/lib/search-params"

export function PresetPicker({
  presets,
  isMobile,
  anchorRef,
}: {
  presets: readonly Preset[]
  isMobile: boolean
  anchorRef: React.RefObject<HTMLDivElement | null>
}) {
  const [params, setParams] = useQueryStates(designSystemSearchParams, {
    shallow: false,
    history: "push",
  })

  const currentPreset = React.useMemo(() => {
    return presets.find(
      (preset) =>
        preset.base === params.base &&
        preset.style === params.style &&
        preset.baseColor === params.baseColor &&
        preset.theme === params.theme &&
        preset.iconLibrary === params.iconLibrary &&
        preset.font === params.font &&
        preset.menuAccent === params.menuAccent &&
        preset.menuColor === params.menuColor &&
        preset.radius === params.radius
    )
  }, [
    presets,
    params.base,
    params.style,
    params.baseColor,
    params.theme,
    params.iconLibrary,
    params.font,
    params.menuAccent,
    params.menuColor,
    params.radius,
  ])

  const handlePresetChange = (value: string) => {
    const preset = presets.find((p) => p.title === value)
    if (!preset) {
      return
    }

    // Update all params including base.
    setParams({
      base: preset.base,
      style: preset.style,
      baseColor: preset.baseColor,
      theme: preset.theme,
      iconLibrary: preset.iconLibrary,
      font: preset.font,
      menuAccent: preset.menuAccent,
      menuColor: preset.menuColor,
      radius: preset.radius,
      custom: false,
    })
  }

  return (
    <Picker>
      <PickerTrigger>
        <div className="flex flex-col justify-start text-left">
          <div className="text-muted-foreground text-xs">Preset</div>
          <div className="text-foreground text-sm font-medium">
            {currentPreset?.title ?? "Custom"}
          </div>
        </div>
      </PickerTrigger>
      <PickerContent
        anchor={isMobile ? anchorRef : undefined}
        side={isMobile ? "top" : "right"}
        align={isMobile ? "center" : "start"}
      >
        <PickerRadioGroup
          value={currentPreset?.title ?? ""}
          onValueChange={handlePresetChange}
        >
          <PickerGroup>
            {presets.map((preset, index) => (
              <React.Fragment key={index}>
                <PickerRadioItem key={preset.title} value={preset.title}>
                  <Item size="xs">
                    <ItemContent>
                      <ItemTitle className="text-muted-foreground text-xs font-medium">
                        {preset.title}
                      </ItemTitle>
                      <ItemDescription>{preset.description}</ItemDescription>
                    </ItemContent>
                  </Item>
                </PickerRadioItem>
                <PickerSeparator className="opacity-50 last:hidden" />
              </React.Fragment>
            ))}
          </PickerGroup>
        </PickerRadioGroup>
      </PickerContent>
    </Picker>
  )
}
