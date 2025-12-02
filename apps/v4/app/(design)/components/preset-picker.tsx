"use client"

import * as React from "react"
import { useQueryStates } from "nuqs"

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/registry/bases/radix/ui/item"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import { type Preset } from "@/registry/presets"
import { designSystemSearchParams } from "@/app/(design)/lib/search-params"

export function PresetPicker({ presets }: { presets: readonly Preset[] }) {
  const [params, setParams] = useQueryStates(designSystemSearchParams, {
    shallow: false,
    history: "push",
  })

  const currentPreset = React.useMemo(() => {
    return presets.find(
      (preset) =>
        preset.style === params.style &&
        preset.baseColor === params.baseColor &&
        preset.theme === params.theme &&
        preset.iconLibrary === params.iconLibrary &&
        preset.font === params.font &&
        preset.accent === params.accent &&
        preset.menu === params.menu
    )
  }, [
    presets,
    params.style,
    params.baseColor,
    params.theme,
    params.iconLibrary,
    params.font,
    params.accent,
    params.menu,
  ])

  return (
    <Select
      value={currentPreset?.title}
      onValueChange={(value) => {
        const preset = presets.find((p) => p.title === value)
        if (preset) {
          setParams({
            style: preset.style,
            baseColor: preset.baseColor,
            theme: preset.theme,
            iconLibrary: preset.iconLibrary,
            font: preset.font,
            accent: preset.accent,
            menu: preset.menu,
            custom: false,
          })
        }
      }}
    >
      <SelectTrigger>
        <SelectValue
          placeholder={
            <div className="flex flex-col justify-start">
              <div className="text-muted-foreground text-xs">Preset</div>
              <div className="text-foreground text-sm">
                <div className="font-medium">
                  {currentPreset?.description ?? "Custom"}
                </div>
              </div>
            </div>
          }
        >
          <div className="flex flex-col justify-start">
            <div className="text-muted-foreground text-xs">Preset</div>
            <div className="text-foreground text-sm">
              <div className="font-medium">
                {currentPreset?.description ?? "Custom"}
              </div>
            </div>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        position="popper"
        side="left"
        align="start"
        className="ring-foreground/10 rounded-xl border-0 ring-1 data-[state=closed]:animate-none data-[state=open]:animate-none"
      >
        {presets.map((preset, index) => (
          <React.Fragment key={index}>
            <SelectItem
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
            </SelectItem>
            <SelectSeparator className="opacity-50 last:hidden" />
          </React.Fragment>
        ))}
      </SelectContent>
    </Select>
  )
}
