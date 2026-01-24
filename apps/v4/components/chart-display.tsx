import * as React from "react"
import { type registryItemSchema } from "shadcn/schema"
import { type z } from "zod"

import { highlightCode } from "@/lib/highlight-code"
import { getRegistryItem } from "@/lib/registry"
import { cn } from "@/lib/utils"
import { ChartIframe } from "@/components/chart-iframe"
import { ChartToolbar } from "@/components/chart-toolbar"
import { type Style } from "@/registry/_legacy-styles"

export type Chart = z.infer<typeof registryItemSchema> & {
  highlightedCode: string
}

export function ChartDisplay({
  chart,
  style,
  className,
}: {
  chart: Chart
  style: string
} & React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "themes-wrapper group relative flex flex-col overflow-hidden rounded-xl transition-all duration-200 ease-in-out hover:z-30",
        className
      )}
    >
      <ChartToolbar
        chart={chart}
        className="relative z-20 flex justify-end px-3 py-2.5"
      />
      <div className="bg-background relative z-10 overflow-hidden rounded-xl">
        <ChartIframe
          src={`/view/${style}/${chart.name}`}
          height={460}
          title={chart.name}
        />
      </div>
    </div>
  )
}

// Exported for parallel prefetching in page components.
export const getCachedRegistryItem = React.cache(
  async (name: string, styleName: Style["name"]) => {
    return await getRegistryItem(name, styleName)
  }
)

export const getChartHighlightedCode = React.cache(async (content: string) => {
  return await highlightCode(content)
})
