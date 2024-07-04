"use client"

import { cn } from "@/lib/utils"
import { BlockCopyButton } from "@/components/block-copy-button"
import { ChartCodeViewer } from "@/components/chart-code-viewer"
import { Separator } from "@/registry/new-york/ui/separator"
import { Block } from "@/registry/schema"

import "@/styles/mdx.css"
import {
  AreaChart,
  BarChartBig,
  Hexagon,
  LineChart,
  PieChart,
  Radar,
} from "lucide-react"

export function ChartToolbar({
  chart,
  className,
  children,
}: { chart: Block } & React.ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-1.5 pl-1 text-[13px] text-muted-foreground [&>svg]:h-[0.9rem] [&>svg]:w-[0.9rem]">
        {chart.subcategory === "Line" && <LineChart />}
        {chart.subcategory === "Bar" && <BarChartBig />}
        {chart.subcategory === "Pie" && <PieChart />}
        {chart.subcategory === "Area" && <AreaChart />}
        {chart.subcategory === "Radar" && <Hexagon />}
        {chart.subcategory === "Radial" && <Radar />}
        {chart.subcategory} Chart
      </div>
      <div className="ml-auto flex items-center gap-2 [&>form]:flex">
        <BlockCopyButton
          event="copy_chart_code"
          name={chart.name}
          code={chart.code}
          className="[&_svg]-h-3 h-6 w-6 rounded-[6px] shadow-none [&_svg]:w-3"
        />
        <Separator orientation="vertical" className="mx-0 hidden h-4 md:flex" />
        <ChartCodeViewer chart={chart}>{children}</ChartCodeViewer>
      </div>
    </div>
  )
}
