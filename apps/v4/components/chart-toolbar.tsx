"use client"

import {
  AreaChartIcon,
  BarChartBigIcon,
  HexagonIcon,
  LineChartIcon,
  MousePointer2Icon,
  PieChartIcon,
  RadarIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { ChartCodeViewer } from "@/components/chart-code-viewer"
import { ChartCopyButton } from "@/components/chart-copy-button"
import { Chart } from "@/components/chart-display"
import { Separator } from "@/registry/new-york-v4/ui/separator"

export function ChartToolbar({
  chart,
  className,
  children,
}: {
  chart: Chart
} & React.ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="text-muted-foreground flex items-center gap-1.5 pl-1 text-[13px] [&>svg]:h-[0.9rem] [&>svg]:w-[0.9rem]">
        <ChartTitle chart={chart} />
      </div>
      <div className="ml-auto flex items-center gap-2 [&>form]:flex">
        <ChartCopyButton
          event="copy_chart_code"
          name={chart.name}
          code={chart.files?.[0]?.content ?? ""}
          className="[&_svg]-h-3 text-foreground hover:bg-muted dark:text-foreground h-6 w-6 rounded-[6px] bg-transparent shadow-none [&_svg]:w-3"
        />
        <Separator
          orientation="vertical"
          className="mx-0 hidden !h-4 md:flex"
        />
        <ChartCodeViewer chart={chart}>{children}</ChartCodeViewer>
      </div>
    </div>
  )
}

function ChartTitle({ chart }: { chart: Chart }) {
  if (chart.name.includes("charts-line")) {
    return (
      <>
        <LineChartIcon /> Line Chart
      </>
    )
  }

  if (chart.name.includes("chart-bar")) {
    return (
      <>
        <BarChartBigIcon /> Bar Chart
      </>
    )
  }

  if (chart.name.includes("chart-pie")) {
    return (
      <>
        <PieChartIcon /> Pie Chart
      </>
    )
  }

  if (chart.name.includes("chart-area")) {
    return (
      <>
        <AreaChartIcon /> Area Chart
      </>
    )
  }

  if (chart.name.includes("chart-radar")) {
    return (
      <>
        <HexagonIcon /> Radar Chart
      </>
    )
  }

  if (chart.name.includes("chart-radial")) {
    return (
      <>
        <RadarIcon /> Radial Chart
      </>
    )
  }

  if (chart.name.includes("chart-tooltip")) {
    return (
      <>
        <MousePointer2Icon />
        Tooltip
      </>
    )
  }

  return chart.name
}
