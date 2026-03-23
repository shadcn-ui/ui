"use client"

import * as React from "react"

import { useMounted } from "@/hooks/use-mounted"
import {
  BASE_COLORS,
  getThemesForBaseColor,
  type ChartColorName,
} from "@/registry/config"
import { LockButton } from "@/app/(create)/components/lock-button"
import {
  Picker,
  PickerContent,
  PickerGroup,
  PickerRadioGroup,
  PickerRadioItem,
  PickerSeparator,
  PickerTrigger,
} from "@/app/(create)/components/picker"
import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"

export function ChartColorPicker({
  isMobile,
  anchorRef,
}: {
  isMobile: boolean
  anchorRef: React.RefObject<HTMLDivElement | null>
}) {
  const mounted = useMounted()
  const [params, setParams] = useDesignSystemSearchParams()

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

  return (
    <div className="group/picker relative">
      <Picker>
        <PickerTrigger>
          <div className="flex flex-col justify-start text-left">
            <div className="text-xs text-muted-foreground">Chart Color</div>
            <div className="text-sm font-medium text-foreground">
              {currentChartColor?.title}
            </div>
          </div>
          {mounted && (
            <div
              style={
                {
                  "--color":
                    currentChartColor?.cssVars?.dark?.[
                      currentChartColorIsBaseColor
                        ? "muted-foreground"
                        : "primary"
                    ],
                } as React.CSSProperties
              }
              className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 rounded-full bg-(--color) select-none md:right-2.5"
            />
          )}
        </PickerTrigger>
        <PickerContent
          anchor={isMobile ? anchorRef : undefined}
          side={isMobile ? "top" : "right"}
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
      <LockButton
        param="chartColor"
        className="absolute top-1/2 right-8 -translate-y-1/2"
      />
    </div>
  )
}
