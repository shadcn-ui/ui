"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
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
  base,
}: {
  presets: readonly Preset[]
  base: string
}) {
  const router = useRouter()
  const [params, setParams] = useQueryStates(designSystemSearchParams, {
    shallow: false,
    history: "push",
  })

  const currentPreset = React.useMemo(() => {
    return presets.find(
      (preset) =>
        preset.base === base &&
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
    base,
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

    // Build search params for the preset.
    const searchParams = new URLSearchParams({
      item: params.item,
      style: preset.style,
      baseColor: preset.baseColor,
      theme: preset.theme,
      iconLibrary: preset.iconLibrary,
      font: preset.font,
      menuAccent: preset.menuAccent,
      menuColor: preset.menuColor,
      radius: preset.radius,
      custom: "false",
    })

    // If base is different, navigate to the new base URL.
    if (preset.base !== base) {
      router.push(`/create/${preset.base}?${searchParams.toString()}`)
      return
    }

    // Same base, just update query params.
    setParams({
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
      <PickerTrigger className="hover:bg-muted data-popup-open:bg-muted relative rounded-lg p-2">
        <div className="flex flex-col justify-start text-left">
          <div className="text-muted-foreground text-xs">Preset</div>
          <div className="text-foreground text-sm font-medium">
            {currentPreset?.title ?? "Custom"}
          </div>
        </div>
      </PickerTrigger>
      <PickerContent
        side="left"
        align="start"
        className="ring-foreground/10 w-56 rounded-xl border-0 ring-1"
      >
        <PickerRadioGroup
          value={currentPreset?.title ?? ""}
          onValueChange={handlePresetChange}
        >
          <PickerGroup>
            {presets.map((preset, index) => (
              <React.Fragment key={index}>
                <PickerRadioItem
                  key={preset.title}
                  value={preset.title}
                  className="rounded-lg"
                >
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
