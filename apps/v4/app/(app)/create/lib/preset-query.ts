import { V1_CHART_COLOR_MAP, type PresetConfig } from "shadcn/preset"

import { type ChartColorName, type FontHeadingValue } from "@/registry/config"

type SearchParamsLike = Pick<URLSearchParams, "get" | "has">

export function resolvePresetOverrides(
  searchParams: SearchParamsLike,
  decoded: Pick<PresetConfig, "theme" | "chartColor" | "fontHeading">
) {
  const hasFontHeadingOverride = searchParams.has("fontHeading")
  const hasChartColorOverride = searchParams.has("chartColor")

  const fontHeading = hasFontHeadingOverride
    ? ((searchParams.get("fontHeading") ??
        decoded.fontHeading) as FontHeadingValue)
    : decoded.fontHeading

  const chartColor = hasChartColorOverride
    ? ((searchParams.get("chartColor") ??
        decoded.chartColor ??
        V1_CHART_COLOR_MAP[decoded.theme] ??
        decoded.theme) as ChartColorName)
    : (decoded.chartColor ?? V1_CHART_COLOR_MAP[decoded.theme] ?? decoded.theme)

  return {
    fontHeading,
    chartColor,
  }
}
