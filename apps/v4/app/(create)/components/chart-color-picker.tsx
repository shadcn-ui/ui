"use client"

import * as React from "react"

import { useMounted } from "@/hooks/use-mounted"
import {
  BASE_COLORS,
  getThemesForBaseColor,
  type ChartColorName,
} from "@/registry/config"
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

export function ChartColorPicker({
  isMobile,
  anchorRef,
  collapsed = false,
}: {
  isMobile: boolean
  anchorRef: React.RefObject<HTMLDivElement | null>
  collapsed?: boolean
}) {
  const mounted = useMounted()
  const [params, setParams] = useDesignSystemSearchParams()
  const { desktopPickerSide } = useCustomizerLayout()

  const availableChartColors = React.useMemo(
    () => getThemesForBaseColor(params.baseColor),
    [params.baseColor]
  )

  const currentChartColor = React.useMemo(
    () =>
      availableChartColors.find((theme) => theme.name === params.chartColor),
    [availableChartColors, params.chartColor]
  )

  const currentChartColorIsBaseColor = React.useMemo(
    () => BASE_COLORS.find((baseColor) => baseColor.name === params.chartColor),
    [params.chartColor]
  )

  React.useEffect(() => {
    if (!currentChartColor && availableChartColors.length > 0) {
      setParams({ chartColor: availableChartColors[0].name })
    }
  }, [currentChartColor, availableChartColors, setParams])

  const chartColorIndicator = mounted ? (
    <div
      style={
        {
          "--color":
            currentChartColor?.cssVars?.dark?.[
              currentChartColorIsBaseColor ? "muted-foreground" : "primary"
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
          label="Chart Color"
          value={currentChartColor?.title}
          valueText={currentChartColor?.title}
          indicator={chartColorIndicator}
          collapsed={collapsed}
        />
        <PickerContent
          anchor={isMobile ? anchorRef : undefined}
          side={isMobile ? "top" : desktopPickerSide}
          align={isMobile ? "center" : "start"}
          className="max-h-92"
        >
          <PickerRadioGroup
            value={currentChartColor?.name}
            onValueChange={(value) => {
              setParams({ chartColor: value as ChartColorName })
            }}
          >
            <PickerGroup>
              {availableChartColors
                .filter((theme) =>
                  BASE_COLORS.find((baseColor) => baseColor.name === theme.name)
                )
                .map((theme) => (
                  <PickerRadioItem
                    key={theme.name}
                    value={theme.name}
                    closeOnClick={isMobile}
                  >
                    {theme.title}
                  </PickerRadioItem>
                ))}
            </PickerGroup>
            <PickerSeparator />
            <PickerGroup>
              {availableChartColors
                .filter(
                  (theme) =>
                    !BASE_COLORS.find(
                      (baseColor) => baseColor.name === theme.name
                    )
                )
                .map((theme) => (
                  <PickerRadioItem
                    key={theme.name}
                    value={theme.name}
                    closeOnClick={isMobile}
                  >
                    {theme.title}
                  </PickerRadioItem>
                ))}
            </PickerGroup>
          </PickerRadioGroup>
        </PickerContent>
      </Picker>
      {!collapsed ? (
        <LockButton
          param="chartColor"
          className="absolute top-1/2 right-8 -translate-y-1/2"
        />
      ) : null}
    </div>
  )
}
