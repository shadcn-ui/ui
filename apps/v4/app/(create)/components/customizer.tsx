"use client"

import * as React from "react"
import { useQueryStates } from "nuqs"

import { getThemesForBaseColor, PRESETS, STYLES } from "@/registry/config"
import { FieldGroup, FieldSeparator } from "@/registry/new-york-v4/ui/field"
import { MenuAccentPicker } from "@/app/(create)/components/accent-picker"
import { BaseColorPicker } from "@/app/(create)/components/base-color-picker"
import { BasePicker } from "@/app/(create)/components/base-picker"
import { FontPicker } from "@/app/(create)/components/font-picker"
import { IconLibraryPicker } from "@/app/(create)/components/icon-library-picker"
import { MenuColorPicker } from "@/app/(create)/components/menu-picker"
import { PresetPicker } from "@/app/(create)/components/preset-picker"
import { RadiusPicker } from "@/app/(create)/components/radius-picker"
import { StylePicker } from "@/app/(create)/components/style-picker"
import { ThemePicker } from "@/app/(create)/components/theme-picker"
import { FONTS } from "@/app/(create)/lib/fonts"
import { designSystemSearchParams } from "@/app/(create)/lib/search-params"

export function Customizer({ base }: { base: string }) {
  const [params] = useQueryStates(designSystemSearchParams)

  const availableThemes = React.useMemo(
    () => getThemesForBaseColor(params.baseColor),
    [params.baseColor]
  )

  return (
    <div className="no-scrollbar flex h-[calc(100svh-var(--header-height)-2rem)] w-48 flex-col gap-4 overflow-y-auto p-1">
      <FieldGroup className="**:data-[slot=select-trigger]:hover:bg-muted **:data-[slot=select-trigger]:ring-foreground/10 dark:**:data-[slot=select-trigger]:hover:bg-muted/50 **:data-[slot=select-trigger]:data-[state=open]:bg-muted/50 dark:**:data-[slot=select-trigger]:data-[state=open]:bg-muted/50 flex flex-1 flex-col gap-1 **:data-[slot=select-trigger]:w-full **:data-[slot=select-trigger]:rounded-lg **:data-[slot=select-trigger]:border-0 **:data-[slot=select-trigger]:bg-transparent **:data-[slot=select-trigger]:text-left **:data-[slot=select-trigger]:shadow-none **:data-[slot=select-trigger]:data-[size=default]:h-12 **:data-[slot=select-trigger]:data-[size=default]:px-2 dark:**:data-[slot=select-trigger]:bg-transparent **:[[data-slot=select-trigger]>svg]:hidden">
        <PresetPicker presets={PRESETS} base={base} />
        <FieldSeparator className="my-px opacity-0" />
        <BasePicker />
        <StylePicker styles={STYLES} />
        <BaseColorPicker />
        <ThemePicker themes={availableThemes} />
        <IconLibraryPicker />
        <FontPicker fonts={FONTS} />
        <FieldSeparator className="opacity-0" />
        <RadiusPicker />
        <MenuColorPicker />
        <MenuAccentPicker />
      </FieldGroup>
    </div>
  )
}
