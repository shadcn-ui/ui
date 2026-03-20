"use client"

import * as React from "react"
import Script from "next/script"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/examples/base/ui/card"
import { FieldGroup, FieldSeparator } from "@/examples/base/ui/field"
import { type RegistryItem } from "shadcn/schema"

import { cn } from "@/lib/utils"
import { getThemesForBaseColor, STYLES } from "@/registry/config"
import { MenuAccentPicker } from "@/app/(create)/components/accent-picker"
import { ActionMenu } from "@/app/(create)/components/action-menu"
import { BaseColorPicker } from "@/app/(create)/components/base-color-picker"
import { BasePicker } from "@/app/(create)/components/base-picker"
import { ChartColorPicker } from "@/app/(create)/components/chart-color-picker"
import { CopyPreset } from "@/app/(create)/components/copy-preset"
import { CustomizerLayoutProvider } from "@/app/(create)/components/customizer-layout"
import { FontPicker } from "@/app/(create)/components/font-picker"
import { IconLibraryPicker } from "@/app/(create)/components/icon-library-picker"
import { MainMenu } from "@/app/(create)/components/main-menu"
import { MenuColorPicker } from "@/app/(create)/components/menu-picker"
import { RadiusPicker } from "@/app/(create)/components/radius-picker"
import { RandomButton } from "@/app/(create)/components/random-button"
import { ResetDialog } from "@/app/(create)/components/reset-button"
import { StylePicker } from "@/app/(create)/components/style-picker"
import { ThemePicker } from "@/app/(create)/components/theme-picker"
import {
  CUSTOMIZER_POSITION_COOKIE_NAME,
  CUSTOMIZER_STATE_COOKIE_MAX_AGE,
  CUSTOMIZER_STATE_COOKIE_NAME,
  type CustomizerPosition,
} from "@/app/(create)/lib/customizer"
import { FONT_HEADING_OPTIONS, FONTS } from "@/app/(create)/lib/fonts"
import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"

export const CUSTOMIZER_TOGGLE_FORWARD_TYPE = "customizer-toggle-forward"

export function Customizer({
  itemsByBase,
  defaultCollapsed = false,
  defaultIsMobile = false,
  defaultPosition = "left",
}: {
  itemsByBase: Record<string, Pick<RegistryItem, "name" | "title" | "type">[]>
  defaultCollapsed?: boolean
  defaultIsMobile?: boolean
  defaultPosition?: CustomizerPosition
}) {
  const [params] = useDesignSystemSearchParams()
  const [isMobile, setIsMobile] = React.useState(defaultIsMobile)
  const anchorRef = React.useRef<HTMLDivElement | null>(null)
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)
  const [position, setPosition] =
    React.useState<CustomizerPosition>(defaultPosition)
  const isDesktopCollapsed = !isMobile && isCollapsed
  const toggleCollapse = React.useCallback(() => {
    setIsCollapsed((collapsed) => {
      const nextCollapsed = !collapsed
      document.cookie = `${CUSTOMIZER_STATE_COOKIE_NAME}=${nextCollapsed}; path=/; max-age=${CUSTOMIZER_STATE_COOKIE_MAX_AGE}`
      return nextCollapsed
    })
  }, [])
  const handlePositionChange = React.useCallback(
    (nextPosition: CustomizerPosition) => {
      setPosition(nextPosition)
    },
    []
  )

  const availableThemes = React.useMemo(
    () => getThemesForBaseColor(params.baseColor),
    [params.baseColor]
  )

  React.useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)")
    const onChange = () => {
      setIsMobile(window.innerWidth < 768)
    }

    mql.addEventListener("change", onChange)
    onChange()

    return () => {
      mql.removeEventListener("change", onChange)
    }
  }, [])

  React.useEffect(() => {
    document.cookie = `${CUSTOMIZER_POSITION_COOKIE_NAME}=${position}; path=/; max-age=${CUSTOMIZER_STATE_COOKIE_MAX_AGE}`

    const layout = document.querySelector<HTMLElement>('[data-slot="layout"]')
    const designer = document.querySelector<HTMLElement>(
      '[data-slot="designer"]'
    )

    if (layout) {
      layout.dataset.customizerPosition = position
    }

    if (designer) {
      designer.dataset.customizerPosition = position
    }
  }, [position])

  React.useEffect(() => {
    if (isMobile) {
      return
    }

    const down = (e: KeyboardEvent) => {
      if ((!e.metaKey && !e.ctrlKey) || e.shiftKey || e.altKey) {
        return
      }

      if (
        (e.target instanceof HTMLElement && e.target.isContentEditable) ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return
      }

      if (e.key.toLowerCase() !== "b") {
        return
      }

      e.preventDefault()
      toggleCollapse()
    }

    document.addEventListener("keydown", down)
    return () => {
      document.removeEventListener("keydown", down)
    }
  }, [isMobile, toggleCollapse])

  return (
    <CustomizerLayoutProvider position={position}>
      <Card
        ref={anchorRef}
        className={cn(
          "dark isolate z-10 max-h-full min-h-0 w-full self-start rounded-2xl bg-card/90 shadow-xl backdrop-blur-xl transition-[width] duration-300 ease-out md:w-(--customizer-width)",
          isDesktopCollapsed && "md:w-16"
        )}
        size="sm"
      >
        <CardHeader
          className={cn(
            "hidden items-center gap-2 border-b transition-[padding,border-color] duration-200 ease-out group-data-[customizer-position=right]/layout:flex-row-reverse md:flex",
            isDesktopCollapsed ? "justify-center" : "justify-between"
          )}
        >
          <MainMenu
            onToggleCollapse={toggleCollapse}
            onPositionChange={handlePositionChange}
            position={position}
            collapsed={isDesktopCollapsed}
          />
        </CardHeader>
        <CardContent className="no-scrollbar min-h-0 flex-1 overflow-x-auto overflow-y-hidden transition-[padding] duration-200 ease-out md:overflow-x-hidden md:overflow-y-auto">
          <FieldGroup
            className={cn(
              "flex-row gap-2.5 py-px transition-[gap] duration-200 ease-out **:data-[slot=field-separator]:-mx-4 **:data-[slot=field-separator]:w-auto md:flex-col md:gap-3.25",
              isDesktopCollapsed && "md:gap-2"
            )}
          >
            {isMobile && (
              <BasePicker isMobile={isMobile} anchorRef={anchorRef} />
            )}
            <StylePicker
              styles={STYLES}
              isMobile={isMobile}
              anchorRef={anchorRef}
              collapsed={isDesktopCollapsed}
            />
            <FieldSeparator
              className={cn(
                "hidden transition-opacity duration-150 ease-out md:block",
                isDesktopCollapsed && "pointer-events-none opacity-0"
              )}
            />
            <BaseColorPicker
              isMobile={isMobile}
              anchorRef={anchorRef}
              collapsed={isDesktopCollapsed}
            />
            <ThemePicker
              themes={availableThemes}
              isMobile={isMobile}
              anchorRef={anchorRef}
              collapsed={isDesktopCollapsed}
            />
            <ChartColorPicker
              isMobile={isMobile}
              anchorRef={anchorRef}
              collapsed={isDesktopCollapsed}
            />
            <FieldSeparator
              className={cn(
                "hidden transition-opacity duration-150 ease-out md:block",
                isDesktopCollapsed && "pointer-events-none opacity-0"
              )}
            />
            <FontPicker
              label="Heading"
              param="fontHeading"
              fonts={FONT_HEADING_OPTIONS}
              isMobile={isMobile}
              anchorRef={anchorRef}
              collapsed={isDesktopCollapsed}
            />
            <FontPicker
              label="Font"
              param="font"
              fonts={FONTS}
              isMobile={isMobile}
              anchorRef={anchorRef}
              collapsed={isDesktopCollapsed}
            />
            <FieldSeparator
              className={cn(
                "hidden transition-opacity duration-150 ease-out md:block",
                isDesktopCollapsed && "pointer-events-none opacity-0"
              )}
            />
            <IconLibraryPicker
              isMobile={isMobile}
              anchorRef={anchorRef}
              collapsed={isDesktopCollapsed}
            />
            <RadiusPicker
              isMobile={isMobile}
              anchorRef={anchorRef}
              collapsed={isDesktopCollapsed}
            />
            <FieldSeparator
              className={cn(
                "hidden transition-opacity duration-150 ease-out md:block",
                isDesktopCollapsed && "pointer-events-none opacity-0"
              )}
            />
            <MenuColorPicker
              isMobile={isMobile}
              anchorRef={anchorRef}
              collapsed={isDesktopCollapsed}
            />
            <MenuAccentPicker
              isMobile={isMobile}
              anchorRef={anchorRef}
              collapsed={isDesktopCollapsed}
            />
          </FieldGroup>
        </CardContent>
        <CardFooter
          className={cn(
            "flex min-w-0 gap-2 transition-[max-height,opacity,padding,border-color] duration-200 ease-out md:max-h-72 md:flex-col md:**:[button,a]:w-full",
            isDesktopCollapsed && "justify-center md:max-h-28 md:px-2 md:py-2"
          )}
        >
          <CopyPreset
            className="flex-1 md:flex-none"
            collapsed={isDesktopCollapsed}
          />
          <RandomButton
            className="flex-1 md:flex-none"
            collapsed={isDesktopCollapsed}
          />
          {!isDesktopCollapsed ? (
            <ActionMenu itemsByBase={itemsByBase} />
          ) : null}
          <ResetDialog />
        </CardFooter>
      </Card>
    </CustomizerLayoutProvider>
  )
}

export function CustomizerToggleScript() {
  return (
    <Script
      id="customizer-toggle-listener"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `
            (function() {
              document.addEventListener('keydown', function(e) {
                if ((!e.metaKey && !e.ctrlKey) || e.shiftKey || e.altKey) {
                  return;
                }
                if (
                  (e.target instanceof HTMLElement && e.target.isContentEditable) ||
                  e.target instanceof HTMLInputElement ||
                  e.target instanceof HTMLTextAreaElement ||
                  e.target instanceof HTMLSelectElement
                ) {
                  return;
                }
                if (e.key.toLowerCase() !== 'b') {
                  return;
                }
                e.preventDefault();
                if (window.parent && window.parent !== window) {
                  window.parent.postMessage({
                    type: '${CUSTOMIZER_TOGGLE_FORWARD_TYPE}',
                    key: e.key
                  }, '*');
                }
              });
            })();
          `,
      }}
    />
  )
}
