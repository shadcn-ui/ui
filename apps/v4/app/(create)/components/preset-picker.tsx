"use client"

import * as React from "react"
import { useQueryStates } from "nuqs"

import { STYLES, type Preset } from "@/registry/config"
import {
  Picker,
  PickerContent,
  PickerGroup,
  PickerLabel,
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

  const groupedPresets = React.useMemo(() => {
    const groups = new Map<string, Preset[]>()
    for (const preset of presets) {
      const base = preset.base
      if (!groups.has(base)) {
        groups.set(base, [])
      }
      groups.get(base)!.push(preset)
    }
    return Array.from(groups.entries()).map(([base, presets]) => ({
      base,
      presets,
    }))
  }, [presets])

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
          <div className="text-foreground line-clamp-1 text-sm font-medium">
            {currentPreset?.description ?? "Custom"}
          </div>
        </div>
      </PickerTrigger>
      <PickerContent
        anchor={isMobile ? anchorRef : undefined}
        side={isMobile ? "top" : "right"}
        align={isMobile ? "center" : "start"}
        className="md:w-72"
      >
        <PickerRadioGroup
          value={currentPreset?.title ?? ""}
          onValueChange={handlePresetChange}
        >
          {groupedPresets.map((group, groupIndex) => (
            <React.Fragment key={group.base}>
              <PickerGroup>
                <PickerLabel>
                  {group.base.charAt(0).toUpperCase() + group.base.slice(1)}
                </PickerLabel>
                {group.presets.map((preset) => {
                  const style = STYLES.find((s) => s.name === preset.style)
                  return (
                    <PickerRadioItem key={preset.title} value={preset.title}>
                      <div className="flex items-center gap-2">
                        {style?.icon && (
                          <div className="flex size-4 shrink-0 items-center justify-center">
                            {React.cloneElement(style.icon, {
                              className: "size-4",
                            })}
                          </div>
                        )}
                        {preset.description}
                      </div>
                    </PickerRadioItem>
                  )
                })}
              </PickerGroup>
              {groupIndex < groupedPresets.length - 1 && (
                <PickerSeparator className="opacity-50" />
              )}
            </React.Fragment>
          ))}
        </PickerRadioGroup>
      </PickerContent>
    </Picker>
  )
}
