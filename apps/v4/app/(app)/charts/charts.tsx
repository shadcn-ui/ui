import * as React from "react"

import { ChartAreaAxes } from "@/registry/new-york-v4/charts/chart-area-axes"
import { ChartAreaDefault } from "@/registry/new-york-v4/charts/chart-area-default"
import { ChartAreaGradient } from "@/registry/new-york-v4/charts/chart-area-gradient"
import { ChartAreaIcons } from "@/registry/new-york-v4/charts/chart-area-icons"
import { ChartAreaInteractive } from "@/registry/new-york-v4/charts/chart-area-interactive"
import { ChartAreaLegend } from "@/registry/new-york-v4/charts/chart-area-legend"
import { ChartAreaLinear } from "@/registry/new-york-v4/charts/chart-area-linear"
import { ChartAreaStacked } from "@/registry/new-york-v4/charts/chart-area-stacked"
import { ChartAreaStackedExpand } from "@/registry/new-york-v4/charts/chart-area-stacked-expand"
import { ChartAreaStep } from "@/registry/new-york-v4/charts/chart-area-step"
import { ChartBarActive } from "@/registry/new-york-v4/charts/chart-bar-active"
import { ChartBarDefault } from "@/registry/new-york-v4/charts/chart-bar-default"
import { ChartBarHorizontal } from "@/registry/new-york-v4/charts/chart-bar-horizontal"
import { ChartBarInteractive } from "@/registry/new-york-v4/charts/chart-bar-interactive"
import { ChartBarLabel } from "@/registry/new-york-v4/charts/chart-bar-label"
import { ChartBarLabelCustom } from "@/registry/new-york-v4/charts/chart-bar-label-custom"
import { ChartBarMixed } from "@/registry/new-york-v4/charts/chart-bar-mixed"
import { ChartBarMultiple } from "@/registry/new-york-v4/charts/chart-bar-multiple"
import { ChartBarNegative } from "@/registry/new-york-v4/charts/chart-bar-negative"
import { ChartBarStacked } from "@/registry/new-york-v4/charts/chart-bar-stacked"
import { ChartLineDefault } from "@/registry/new-york-v4/charts/chart-line-default"
import { ChartLineDots } from "@/registry/new-york-v4/charts/chart-line-dots"
import { ChartLineDotsColors } from "@/registry/new-york-v4/charts/chart-line-dots-colors"
import { ChartLineDotsCustom } from "@/registry/new-york-v4/charts/chart-line-dots-custom"
import { ChartLineInteractive } from "@/registry/new-york-v4/charts/chart-line-interactive"
import { ChartLineLabel } from "@/registry/new-york-v4/charts/chart-line-label"
import { ChartLineLabelCustom } from "@/registry/new-york-v4/charts/chart-line-label-custom"
import { ChartLineLinear } from "@/registry/new-york-v4/charts/chart-line-linear"
import { ChartLineMultiple } from "@/registry/new-york-v4/charts/chart-line-multiple"
import { ChartLineStep } from "@/registry/new-york-v4/charts/chart-line-step"
import { ChartPieDonut } from "@/registry/new-york-v4/charts/chart-pie-donut"
import { ChartPieDonutActive } from "@/registry/new-york-v4/charts/chart-pie-donut-active"
import { ChartPieDonutText } from "@/registry/new-york-v4/charts/chart-pie-donut-text"
import { ChartPieInteractive } from "@/registry/new-york-v4/charts/chart-pie-interactive"
import { ChartPieLabel } from "@/registry/new-york-v4/charts/chart-pie-label"
import { ChartPieLabelCustom } from "@/registry/new-york-v4/charts/chart-pie-label-custom"
import { ChartPieLabelList } from "@/registry/new-york-v4/charts/chart-pie-label-list"
import { ChartPieLegend } from "@/registry/new-york-v4/charts/chart-pie-legend"
import { ChartPieSeparatorNone } from "@/registry/new-york-v4/charts/chart-pie-separator-none"
import { ChartPieSimple } from "@/registry/new-york-v4/charts/chart-pie-simple"
import { ChartPieStacked } from "@/registry/new-york-v4/charts/chart-pie-stacked"
import { ChartRadarDefault } from "@/registry/new-york-v4/charts/chart-radar-default"
import { ChartRadarDots } from "@/registry/new-york-v4/charts/chart-radar-dots"
import { ChartRadarGridCircle } from "@/registry/new-york-v4/charts/chart-radar-grid-circle"
import { ChartRadarGridCircleFill } from "@/registry/new-york-v4/charts/chart-radar-grid-circle-fill"
import { ChartRadarGridCircleNoLines } from "@/registry/new-york-v4/charts/chart-radar-grid-circle-no-lines"
import { ChartRadarGridCustom } from "@/registry/new-york-v4/charts/chart-radar-grid-custom"
import { ChartRadarGridFill } from "@/registry/new-york-v4/charts/chart-radar-grid-fill"
import { ChartRadarGridNone } from "@/registry/new-york-v4/charts/chart-radar-grid-none"
import { ChartRadarIcons } from "@/registry/new-york-v4/charts/chart-radar-icons"
import { ChartRadarLabelCustom } from "@/registry/new-york-v4/charts/chart-radar-label-custom"
import { ChartRadarLegend } from "@/registry/new-york-v4/charts/chart-radar-legend"
import { ChartRadarLinesOnly } from "@/registry/new-york-v4/charts/chart-radar-lines-only"
import { ChartRadarMultiple } from "@/registry/new-york-v4/charts/chart-radar-multiple"
import { ChartRadarRadius } from "@/registry/new-york-v4/charts/chart-radar-radius"
import { ChartRadialGrid } from "@/registry/new-york-v4/charts/chart-radial-grid"
import { ChartRadialLabel } from "@/registry/new-york-v4/charts/chart-radial-label"
import { ChartRadialShape } from "@/registry/new-york-v4/charts/chart-radial-shape"
import { ChartRadialSimple } from "@/registry/new-york-v4/charts/chart-radial-simple"
import { ChartRadialStacked } from "@/registry/new-york-v4/charts/chart-radial-stacked"
import { ChartRadialText } from "@/registry/new-york-v4/charts/chart-radial-text"
import { ChartTooltipAdvanced } from "@/registry/new-york-v4/charts/chart-tooltip-advanced"
import { ChartTooltipDefault } from "@/registry/new-york-v4/charts/chart-tooltip-default"
import { ChartTooltipFormatter } from "@/registry/new-york-v4/charts/chart-tooltip-formatter"
import { ChartTooltipIcons } from "@/registry/new-york-v4/charts/chart-tooltip-icons"
import { ChartTooltipIndicatorLine } from "@/registry/new-york-v4/charts/chart-tooltip-indicator-line"
import { ChartTooltipIndicatorNone } from "@/registry/new-york-v4/charts/chart-tooltip-indicator-none"
import { ChartTooltipLabelCustom } from "@/registry/new-york-v4/charts/chart-tooltip-label-custom"
import { ChartTooltipLabelFormatter } from "@/registry/new-york-v4/charts/chart-tooltip-label-formatter"
import { ChartTooltipLabelNone } from "@/registry/new-york-v4/charts/chart-tooltip-label-none"

type ChartComponent = React.ComponentType

interface ChartItem {
  id: string
  component: ChartComponent
  fullWidth?: boolean
}

interface ChartGroups {
  area: ChartItem[]
  bar: ChartItem[]
  line: ChartItem[]
  pie: ChartItem[]
  radar: ChartItem[]
  radial: ChartItem[]
  tooltip: ChartItem[]
}

export const charts: ChartGroups = {
  area: [
    {
      id: "chart-area-interactive",
      component: ChartAreaInteractive,
      fullWidth: true,
    },
    { id: "chart-area-default", component: ChartAreaDefault },
    { id: "chart-area-linear", component: ChartAreaLinear },
    { id: "chart-area-step", component: ChartAreaStep },
    { id: "chart-area-legend", component: ChartAreaLegend },
    { id: "chart-area-stacked", component: ChartAreaStacked },
    { id: "chart-area-stacked-expand", component: ChartAreaStackedExpand },
    { id: "chart-area-icons", component: ChartAreaIcons },
    { id: "chart-area-gradient", component: ChartAreaGradient },
    { id: "chart-area-axes", component: ChartAreaAxes },
  ],
  bar: [
    {
      id: "chart-bar-interactive",
      component: ChartBarInteractive,
      fullWidth: true,
    },
    { id: "chart-bar-default", component: ChartBarDefault },
    { id: "chart-bar-horizontal", component: ChartBarHorizontal },
    { id: "chart-bar-multiple", component: ChartBarMultiple },
    { id: "chart-bar-stacked", component: ChartBarStacked },
    { id: "chart-bar-label", component: ChartBarLabel },
    { id: "chart-bar-label-custom", component: ChartBarLabelCustom },
    { id: "chart-bar-mixed", component: ChartBarMixed },
    { id: "chart-bar-active", component: ChartBarActive },
    { id: "chart-bar-negative", component: ChartBarNegative },
  ],
  line: [
    {
      id: "chart-line-interactive",
      component: ChartLineInteractive,
      fullWidth: true,
    },
    { id: "chart-line-default", component: ChartLineDefault },
    { id: "chart-line-linear", component: ChartLineLinear },
    { id: "chart-line-step", component: ChartLineStep },
    { id: "chart-line-multiple", component: ChartLineMultiple },
    { id: "chart-line-dots", component: ChartLineDots },
    { id: "chart-line-dots-custom", component: ChartLineDotsCustom },
    { id: "chart-line-dots-colors", component: ChartLineDotsColors },
    { id: "chart-line-label", component: ChartLineLabel },
    { id: "chart-line-label-custom", component: ChartLineLabelCustom },
  ],
  pie: [
    { id: "chart-pie-simple", component: ChartPieSimple },
    { id: "chart-pie-separator-none", component: ChartPieSeparatorNone },
    { id: "chart-pie-label", component: ChartPieLabel },
    { id: "chart-pie-label-custom", component: ChartPieLabelCustom },
    { id: "chart-pie-label-list", component: ChartPieLabelList },
    { id: "chart-pie-legend", component: ChartPieLegend },
    { id: "chart-pie-donut", component: ChartPieDonut },
    { id: "chart-pie-donut-active", component: ChartPieDonutActive },
    { id: "chart-pie-donut-text", component: ChartPieDonutText },
    { id: "chart-pie-stacked", component: ChartPieStacked },
    { id: "chart-pie-interactive", component: ChartPieInteractive },
  ],
  radar: [
    { id: "chart-radar-default", component: ChartRadarDefault },
    { id: "chart-radar-dots", component: ChartRadarDots },
    { id: "chart-radar-lines-only", component: ChartRadarLinesOnly },
    { id: "chart-radar-label-custom", component: ChartRadarLabelCustom },
    { id: "chart-radar-grid-custom", component: ChartRadarGridCustom },
    { id: "chart-radar-grid-none", component: ChartRadarGridNone },
    { id: "chart-radar-grid-circle", component: ChartRadarGridCircle },
    {
      id: "chart-radar-grid-circle-no-lines",
      component: ChartRadarGridCircleNoLines,
    },
    { id: "chart-radar-grid-circle-fill", component: ChartRadarGridCircleFill },
    { id: "chart-radar-grid-fill", component: ChartRadarGridFill },
    { id: "chart-radar-multiple", component: ChartRadarMultiple },
    { id: "chart-radar-legend", component: ChartRadarLegend },
    { id: "chart-radar-icons", component: ChartRadarIcons },
    { id: "chart-radar-radius", component: ChartRadarRadius },
  ],
  radial: [
    { id: "chart-radial-simple", component: ChartRadialSimple },
    { id: "chart-radial-label", component: ChartRadialLabel },
    { id: "chart-radial-grid", component: ChartRadialGrid },
    { id: "chart-radial-text", component: ChartRadialText },
    { id: "chart-radial-shape", component: ChartRadialShape },
    { id: "chart-radial-stacked", component: ChartRadialStacked },
  ],
  tooltip: [
    { id: "chart-tooltip-default", component: ChartTooltipDefault },
    {
      id: "chart-tooltip-indicator-line",
      component: ChartTooltipIndicatorLine,
    },
    {
      id: "chart-tooltip-indicator-none",
      component: ChartTooltipIndicatorNone,
    },
    { id: "chart-tooltip-label-custom", component: ChartTooltipLabelCustom },
    {
      id: "chart-tooltip-label-formatter",
      component: ChartTooltipLabelFormatter,
    },
    { id: "chart-tooltip-label-none", component: ChartTooltipLabelNone },
    { id: "chart-tooltip-formatter", component: ChartTooltipFormatter },
    { id: "chart-tooltip-icons", component: ChartTooltipIcons },
    { id: "chart-tooltip-advanced", component: ChartTooltipAdvanced },
  ],
}

// Export individual components for backward compatibility
export {
  ChartAreaDefault,
  ChartAreaLinear,
  ChartAreaStep,
  ChartAreaLegend,
  ChartAreaStacked,
  ChartAreaStackedExpand,
  ChartAreaIcons,
  ChartAreaGradient,
  ChartAreaAxes,
  ChartAreaInteractive,
  ChartBarDefault,
  ChartBarHorizontal,
  ChartBarMultiple,
  ChartBarStacked,
  ChartBarLabel,
  ChartBarLabelCustom,
  ChartBarMixed,
  ChartBarActive,
  ChartBarNegative,
  ChartBarInteractive,
  ChartLineDefault,
  ChartLineLinear,
  ChartLineStep,
  ChartLineMultiple,
  ChartLineDots,
  ChartLineDotsCustom,
  ChartLineDotsColors,
  ChartLineLabel,
  ChartLineLabelCustom,
  ChartLineInteractive,
  ChartPieSimple,
  ChartPieSeparatorNone,
  ChartPieLabel,
  ChartPieLabelCustom,
  ChartPieLabelList,
  ChartPieLegend,
  ChartPieDonut,
  ChartPieDonutActive,
  ChartPieDonutText,
  ChartPieStacked,
  ChartPieInteractive,
  ChartRadarDefault,
  ChartRadarDots,
  ChartRadarLinesOnly,
  ChartRadarLabelCustom,
  ChartRadarGridCustom,
  ChartRadarGridNone,
  ChartRadarGridCircle,
  ChartRadarGridCircleNoLines,
  ChartRadarGridCircleFill,
  ChartRadarGridFill,
  ChartRadarMultiple,
  ChartRadarLegend,
  ChartRadarIcons,
  ChartRadarRadius,
  ChartRadialSimple,
  ChartRadialLabel,
  ChartRadialGrid,
  ChartRadialText,
  ChartRadialShape,
  ChartRadialStacked,
  ChartTooltipDefault,
  ChartTooltipIndicatorLine,
  ChartTooltipIndicatorNone,
  ChartTooltipLabelCustom,
  ChartTooltipLabelFormatter,
  ChartTooltipLabelNone,
  ChartTooltipFormatter,
  ChartTooltipIcons,
  ChartTooltipAdvanced,
}
