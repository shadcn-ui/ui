"use client"

import * as React from "react"
import { useQueryStates } from "nuqs"
import { RegistryItem } from "shadcn/schema"

import { FONTS } from "@/registry/fonts"
import { FieldGroup, FieldSeparator } from "@/registry/new-york-v4/ui/field"
import { PRESETS } from "@/registry/presets"
import { STYLES } from "@/registry/styles"
import { AccentPicker } from "@/app/(design)/components/accent-picker"
import { BaseColorPicker } from "@/app/(design)/components/base-color-picker"
import { BasePicker } from "@/app/(design)/components/base-picker"
import { FontPicker } from "@/app/(design)/components/font-picker"
import { IconLibraryPicker } from "@/app/(design)/components/icon-library-picker"
import { InstallDialog } from "@/app/(design)/components/install-dialog"
import { ItemPicker } from "@/app/(design)/components/item-picker"
import { MenuPicker } from "@/app/(design)/components/menu-picker"
import { PresetPicker } from "@/app/(design)/components/preset-picker"
import { RadiusPicker } from "@/app/(design)/components/radius-picker"
import { SpacingPicker } from "@/app/(design)/components/spacing-picker"
import { StylePicker } from "@/app/(design)/components/style-picker"
import { ThemePicker } from "@/app/(design)/components/theme-picker"
import { designSystemSearchParams } from "@/app/(design)/lib/search-params"
import { getThemesForBaseColor } from "@/app/(design)/lib/utils"

export function Customizer({
  items,
}: {
  items: Pick<RegistryItem, "name" | "title" | "type">[]
}) {
  const [params] = useQueryStates(designSystemSearchParams)

  const availableThemes = React.useMemo(
    () => getThemesForBaseColor(params.baseColor),
    [params.baseColor]
  )

  return (
    <div className="no-scrollbar flex h-[calc(100svh-var(--header-height)-2rem)] w-48 flex-col gap-4 overflow-y-auto p-1">
      <FieldGroup className="**:data-[slot=select-trigger]:hover:bg-muted **:data-[slot=select-trigger]:ring-foreground/10 dark:**:data-[slot=select-trigger]:hover:bg-muted/50 **:data-[slot=select-trigger]:data-[state=open]:bg-muted/50 dark:**:data-[slot=select-trigger]:data-[state=open]:bg-muted/50 flex flex-1 flex-col gap-2 **:data-[slot=select-trigger]:w-full **:data-[slot=select-trigger]:rounded-lg **:data-[slot=select-trigger]:border-0 **:data-[slot=select-trigger]:bg-transparent **:data-[slot=select-trigger]:text-left **:data-[slot=select-trigger]:shadow-none **:data-[slot=select-trigger]:data-[size=default]:h-12 **:data-[slot=select-trigger]:data-[size=default]:px-2 dark:**:data-[slot=select-trigger]:bg-transparent **:[[data-slot=select-trigger]>svg]:hidden">
        <ItemPicker items={items} />
        <FieldSeparator className="opacity-0" />
        <PresetPicker presets={PRESETS} />
        <FieldSeparator className="opacity-0" />
        <BasePicker />
        <StylePicker styles={STYLES} />
        <BaseColorPicker />
        <ThemePicker themes={availableThemes} />
        <IconLibraryPicker />
        <FontPicker fonts={FONTS} />
        <FieldSeparator className="opacity-0" />
        <SpacingPicker />
        <RadiusPicker />
        <MenuPicker />
        <AccentPicker />
        <div className="sticky bottom-0 mt-auto">
          <InstallDialog />
        </div>
      </FieldGroup>
    </div>
  )
}
