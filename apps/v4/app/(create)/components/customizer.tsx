"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/examples/base/ui/card"
import { FieldGroup, FieldSeparator } from "@/examples/base/ui/field"
import { type RegistryItem } from "shadcn/schema"

import { useIsMobile } from "@/hooks/use-mobile"
import { getThemesForBaseColor, STYLES } from "@/registry/config"
import { MenuAccentPicker } from "@/app/(create)/components/accent-picker"
import { ActionMenu } from "@/app/(create)/components/action-menu"
import { BaseColorPicker } from "@/app/(create)/components/base-color-picker"
import { BasePicker } from "@/app/(create)/components/base-picker"
import { ChartColorPicker } from "@/app/(create)/components/chart-color-picker"
import { CopyPreset } from "@/app/(create)/components/copy-preset"
import { FontPicker } from "@/app/(create)/components/font-picker"
import { IconLibraryPicker } from "@/app/(create)/components/icon-library-picker"
import { MainMenu } from "@/app/(create)/components/main-menu"
import { MenuColorPicker } from "@/app/(create)/components/menu-picker"
import { RadiusPicker } from "@/app/(create)/components/radius-picker"
import { RandomButton } from "@/app/(create)/components/random-button"
import { ResetDialog } from "@/app/(create)/components/reset-button"
import { StylePicker } from "@/app/(create)/components/style-picker"
import { ThemePicker } from "@/app/(create)/components/theme-picker"
import { V0Button } from "@/app/(create)/components/v0-button"
import { FONT_HEADING_OPTIONS, FONTS } from "@/app/(create)/lib/fonts"
import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"

export function Customizer({
  itemsByBase,
}: {
  itemsByBase: Record<string, Pick<RegistryItem, "name" | "title" | "type">[]>
}) {
  const [params] = useDesignSystemSearchParams()
  const isMobile = useIsMobile()
  const anchorRef = React.useRef<HTMLDivElement | null>(null)

  const availableThemes = React.useMemo(
    () => getThemesForBaseColor(params.baseColor),
    [params.baseColor]
  )

  return (
    <Card
      className="dark top-24 right-12 isolate z-10 max-h-full min-h-0 w-full self-start rounded-2xl bg-card/90 shadow-xl backdrop-blur-xl md:w-(--customizer-width)"
      ref={anchorRef}
      size="sm"
    >
      <CardHeader className="hidden items-center justify-between gap-2 border-b group-data-reversed/layout:flex-row-reverse md:flex">
        <MainMenu />
      </CardHeader>
      <CardContent className="no-scrollbar min-h-0 flex-1 overflow-x-auto overflow-y-hidden md:overflow-y-auto">
        <FieldGroup className="flex-row gap-2.5 py-px **:data-[slot=field-separator]:-mx-4 **:data-[slot=field-separator]:w-auto md:flex-col md:gap-3.25">
          {isMobile && <BasePicker isMobile={isMobile} anchorRef={anchorRef} />}
          <StylePicker
            styles={STYLES}
            isMobile={isMobile}
            anchorRef={anchorRef}
          />
          <FieldSeparator className="hidden md:block" />
          <BaseColorPicker isMobile={isMobile} anchorRef={anchorRef} />
          <ThemePicker
            themes={availableThemes}
            isMobile={isMobile}
            anchorRef={anchorRef}
          />
          <ChartColorPicker isMobile={isMobile} anchorRef={anchorRef} />
          <FieldSeparator className="hidden md:block" />
          <FontPicker
            label="Heading"
            param="fontHeading"
            fonts={FONT_HEADING_OPTIONS}
            isMobile={isMobile}
            anchorRef={anchorRef}
          />
          <FontPicker
            label="Font"
            param="font"
            fonts={FONTS}
            isMobile={isMobile}
            anchorRef={anchorRef}
          />
          <FieldSeparator className="hidden md:block" />
          <IconLibraryPicker isMobile={isMobile} anchorRef={anchorRef} />
          <RadiusPicker isMobile={isMobile} anchorRef={anchorRef} />
          <FieldSeparator className="hidden md:block" />
          <MenuColorPicker isMobile={isMobile} anchorRef={anchorRef} />
          <MenuAccentPicker isMobile={isMobile} anchorRef={anchorRef} />
        </FieldGroup>
      </CardContent>
      <CardFooter className="flex min-w-0 gap-2 md:flex-col md:**:[button,a]:w-full">
        <CopyPreset className="flex-1 md:flex-none" />
        <RandomButton className="flex-1 md:flex-none" />
        <ActionMenu itemsByBase={itemsByBase} />
        <ResetDialog />
      </CardFooter>
    </Card>
  )
}
