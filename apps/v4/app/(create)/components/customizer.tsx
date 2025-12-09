"use client"

import * as React from "react"
import { Settings05Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useQueryStates } from "nuqs"

import { getThemesForBaseColor, PRESETS, STYLES } from "@/registry/config"
import { FieldGroup, FieldSeparator } from "@/registry/new-york-v4/ui/field"
import { MenuAccentPicker } from "@/app/(create)/components/accent-picker"
import { BaseColorPicker } from "@/app/(create)/components/base-color-picker"
import { BasePicker } from "@/app/(create)/components/base-picker"
import { CustomizerControls } from "@/app/(create)/components/customizer-controls"
import { FontPicker } from "@/app/(create)/components/font-picker"
import { IconLibraryPicker } from "@/app/(create)/components/icon-library-picker"
import { MenuColorPicker } from "@/app/(create)/components/menu-picker"
import { PresetPicker } from "@/app/(create)/components/preset-picker"
import { RadiusPicker } from "@/app/(create)/components/radius-picker"
import { StylePicker } from "@/app/(create)/components/style-picker"
import { ThemePicker } from "@/app/(create)/components/theme-picker"
import { FONTS } from "@/app/(create)/lib/fonts"
import { designSystemSearchParams } from "@/app/(create)/lib/search-params"

export function Customizer() {
  const [params] = useQueryStates(designSystemSearchParams)

  const availableThemes = React.useMemo(
    () => getThemesForBaseColor(params.baseColor),
    [params.baseColor]
  )

  return (
    <div className="no-scrollbar flex h-[calc(100svh-var(--header-height)-2rem)] w-48 flex-col gap-4 overflow-y-auto p-1">
      <div className="mt-auto flex flex-col gap-2 p-2">
        <HugeiconsIcon icon={Settings05Icon} className="size-5" />
        <div className="relative flex flex-col gap-1 rounded-lg text-[13px]/snug">
          <div className="flex items-center gap-1 font-medium text-balance">
            Build your own shadcn/ui
          </div>
          <div>
            When you&apos;re done, click Create Project to start a new project.
          </div>
        </div>
      </div>
      <FieldGroup className="**:data-[slot=select-trigger]:hover:bg-muted **:data-[slot=select-trigger]:ring-foreground/10 dark:**:data-[slot=select-trigger]:hover:bg-muted **:data-[slot=select-trigger]:data-[state=open]:bg-muted dark:**:data-[slot=select-trigger]:data-[state=open]:bg-muted flex flex-1 flex-col gap-1 **:data-[slot=select-trigger]:w-full **:data-[slot=select-trigger]:rounded-lg **:data-[slot=select-trigger]:border-0 **:data-[slot=select-trigger]:bg-transparent **:data-[slot=select-trigger]:text-left **:data-[slot=select-trigger]:shadow-none **:data-[slot=select-trigger]:data-[size=default]:h-12 **:data-[slot=select-trigger]:data-[size=default]:px-2 dark:**:data-[slot=select-trigger]:bg-transparent **:[[data-slot=select-trigger]>svg]:hidden">
        <PresetPicker presets={PRESETS} />
        <FieldSeparator className="opacity-0" />
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
        <div className="mt-auto">
          <CustomizerControls />
        </div>
      </FieldGroup>
    </div>
  )
}
