"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/examples/base/ui/button"
import { ArrowLeftIcon } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { ModeSwitcher } from "@/components/mode-switcher"
import { getThemesForBaseColor, STYLES } from "@/registry/config"
import { FieldGroup } from "@/registry/new-york-v4/ui/field"
import { MenuAccentPicker } from "@/app/(create)/components/accent-picker"
import { BaseColorPicker } from "@/app/(create)/components/base-color-picker"
import { BasePicker } from "@/app/(create)/components/base-picker"
import { FontPicker } from "@/app/(create)/components/font-picker"
import { IconLibraryPicker } from "@/app/(create)/components/icon-library-picker"
import { MenuColorPicker } from "@/app/(create)/components/menu-picker"
import { RadiusPicker } from "@/app/(create)/components/radius-picker"
import { RandomButton } from "@/app/(create)/components/random-button"
import { ResetButton } from "@/app/(create)/components/reset-button"
import { StylePicker } from "@/app/(create)/components/style-picker"
import { ThemePicker } from "@/app/(create)/components/theme-picker"
import { FONTS } from "@/app/(create)/lib/fonts"
import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"

export function Customizer() {
  const [params] = useDesignSystemSearchParams()
  const isMobile = useIsMobile()
  const anchorRef = React.useRef<HTMLDivElement | null>(null)

  const availableThemes = React.useMemo(
    () => getThemesForBaseColor(params.baseColor),
    [params.baseColor]
  )

  return (
    <div
      className="no-scrollbar -mx-2.5 flex flex-col gap-4 overflow-y-auto rounded-2xl border p-4 md:mx-0 md:h-[calc(100svh---spacing(12))] md:w-72"
      ref={anchorRef}
    >
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          render={<Link href="/" />}
          nativeButton={false}
          role="link"
        >
          Exit
        </Button>
        <div className="ml-auto">
          <ModeSwitcher />
        </div>
      </div>
      <div className="no-scrollbar h-14 overflow-x-auto overflow-y-hidden p-px md:h-full md:overflow-x-hidden md:overflow-y-auto">
        <FieldGroup className="flex h-full flex-1 flex-row gap-2 md:flex-col md:gap-2">
          <BasePicker isMobile={isMobile} anchorRef={anchorRef} />
          <StylePicker
            styles={STYLES}
            isMobile={isMobile}
            anchorRef={anchorRef}
          />
          <BaseColorPicker isMobile={isMobile} anchorRef={anchorRef} />
          <ThemePicker
            themes={availableThemes}
            isMobile={isMobile}
            anchorRef={anchorRef}
          />
          <IconLibraryPicker isMobile={isMobile} anchorRef={anchorRef} />
          <FontPicker fonts={FONTS} isMobile={isMobile} anchorRef={anchorRef} />
          <RadiusPicker isMobile={isMobile} anchorRef={anchorRef} />
          <MenuColorPicker isMobile={isMobile} anchorRef={anchorRef} />
          <MenuAccentPicker isMobile={isMobile} anchorRef={anchorRef} />
        </FieldGroup>
      </div>
      <div className="flex flex-col gap-2">
        <ResetButton />
        <RandomButton />
      </div>
    </div>
  )
}
