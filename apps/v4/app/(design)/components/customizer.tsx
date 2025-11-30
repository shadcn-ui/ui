"use client"

import * as React from "react"
import { useQueryStates } from "nuqs"
import { RegistryItem } from "shadcn/schema"

import { FONTS } from "@/registry/fonts"
import { FieldGroup, FieldSeparator } from "@/registry/new-york-v4/ui/field"
import { PRESETS } from "@/registry/presets"
import { STYLES } from "@/registry/styles"
import { BaseColorPicker } from "@/app/(design)/components/base-color-picker"
import { FontPicker } from "@/app/(design)/components/font-picker"
import { IconLibraryPicker } from "@/app/(design)/components/icon-library-picker"
import { InstallDialog } from "@/app/(design)/components/install-dialog"
import { ItemPicker } from "@/app/(design)/components/item-picker"
import { PresetPicker } from "@/app/(design)/components/preset-picker"
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
    <div className="no-scrollbar flex h-[calc(100svh-var(--header-height)-4rem)] w-54 flex-col gap-4 px-1">
      <FieldGroup className="**:data-[slot=select-trigger]:data-[state=open]:bg-muted/30 **:data-[slot=select-trigger]:dark:data-[state=open]:bg-muted **:[[data-slot=select-trigger]]:hover:bg-muted/30 flex flex-col gap-3 **:data-[slot=select-trigger]:w-full **:data-[slot=select-trigger]:rounded-lg **:data-[slot=select-trigger]:text-left **:data-[slot=select-trigger]:shadow-none **:data-[slot=select-trigger]:data-[size=default]:h-14 **:[[data-slot=select-trigger]>svg]:hidden">
        <ItemPicker items={items} />
        <FieldSeparator className="opacity-0" />
        <PresetPicker presets={PRESETS} />
        <FieldSeparator className="opacity-0" />
        <StylePicker styles={STYLES} />
        <BaseColorPicker />
        <ThemePicker themes={availableThemes} />
        <IconLibraryPicker />
        <FontPicker fonts={FONTS} />
        <FieldSeparator className="opacity-0" />
        <InstallDialog />
      </FieldGroup>
    </div>
  )
}
