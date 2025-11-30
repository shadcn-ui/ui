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
        preset.font === params.font
    )
  }, [
    presets,
    params.style,
    params.baseColor,
    params.theme,
    params.iconLibrary,
    params.font,
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
            custom: false,
          })
        }
      }}
    >
      <SelectTrigger>
        <SelectValue
          placeholder={
            <div className="flex flex-col justify-start">
              <div className="text-muted-foreground text-xs font-medium">
                Preset
              </div>
              {currentPreset?.description ?? "Custom"}
            </div>
          }
        >
          <div className="flex flex-col justify-start">
            <div className="text-muted-foreground text-xs font-medium">
              Preset
            </div>
            {currentPreset?.description ?? "Custom"}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        position="popper"
        side="right"
        align="start"
        className="rounded-xl data-[state=closed]:animate-none data-[state=open]:animate-none"
      >
        {presets.map((preset) => (
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
        ))}
      </SelectContent>
    </Select>
  )
}
