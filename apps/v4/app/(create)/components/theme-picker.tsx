"use client"

import * as React from "react"

import { useMounted } from "@/hooks/use-mounted"
import { BASE_COLORS, type Theme, type ThemeName } from "@/registry/config"
import { useCustomizerLayout } from "@/app/(create)/components/customizer-layout"
import { LockButton } from "@/app/(create)/components/lock-button"
import {
  Picker,
  PickerContent,
  PickerGroup,
  PickerRadioGroup,
  PickerRadioItem,
  PickerSeparator,
  PickerValueTrigger,
} from "@/app/(create)/components/picker"
import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"

export function ThemePicker({
  themes,
  isMobile,
  anchorRef,
  collapsed = false,
}: {
  themes: readonly Theme[]
  isMobile: boolean
  anchorRef: React.RefObject<HTMLDivElement | null>
  collapsed?: boolean
}) {
  const mounted = useMounted()
  const [params, setParams] = useDesignSystemSearchParams()
  const { desktopPickerSide } = useCustomizerLayout()

  const currentTheme = React.useMemo(
    () => themes.find((theme) => theme.name === params.theme),
    [themes, params.theme]
  )

  const currentThemeIsBaseColor = React.useMemo(
    () => BASE_COLORS.find((baseColor) => baseColor.name === params.theme),
    [params.theme]
  )

  React.useEffect(() => {
    if (!currentTheme && themes.length > 0) {
      setParams({ theme: themes[0].name })
    }
  }, [currentTheme, themes, setParams])

  const themeIndicator = mounted ? (
    <div
      style={
        {
          "--color":
            currentTheme?.cssVars?.dark?.[
              currentThemeIsBaseColor ? "muted-foreground" : "primary"
            ],
        } as React.CSSProperties
      }
      className="size-4 rounded-full bg-(--color)"
    />
  ) : null

  return (
    <div className="group/picker relative">
      <Picker>
        <PickerValueTrigger
          label="Theme"
          value={currentTheme?.title}
          valueText={currentTheme?.title}
          indicator={themeIndicator}
          collapsed={collapsed}
        />
        <PickerContent
          anchor={isMobile ? anchorRef : undefined}
          side={isMobile ? "top" : desktopPickerSide}
          align={isMobile ? "center" : "start"}
          className="max-h-92"
        >
          <PickerRadioGroup
            value={currentTheme?.name}
            onValueChange={(value) => {
              setParams({ theme: value as ThemeName })
            }}
          >
            <PickerGroup>
              {themes
                .filter((theme) =>
                  BASE_COLORS.find((baseColor) => baseColor.name === theme.name)
                )
                .map((theme) => {
                  return (
                    <PickerRadioItem
                      key={theme.name}
                      value={theme.name}
                      closeOnClick={isMobile}
                    >
                      {theme.title}
                    </PickerRadioItem>
                  )
                })}
            </PickerGroup>
            <PickerSeparator />
            <PickerGroup>
              {themes
                .filter(
                  (theme) =>
                    !BASE_COLORS.find(
                      (baseColor) => baseColor.name === theme.name
                    )
                )
                .map((theme) => {
                  return (
                    <PickerRadioItem
                      key={theme.name}
                      value={theme.name}
                      closeOnClick={isMobile}
                    >
                      {theme.title}
                    </PickerRadioItem>
                  )
                })}
            </PickerGroup>
          </PickerRadioGroup>
        </PickerContent>
      </Picker>
      {!collapsed ? (
        <LockButton
          param="theme"
          className="absolute top-1/2 right-8 -translate-y-1/2"
        />
      ) : null}
    </div>
  )
}
