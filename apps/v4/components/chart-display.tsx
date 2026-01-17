import * as React from "react"
import { type registryItemSchema } from "shadcn/schema"
import { type z } from "zod"

import { highlightCode } from "@/lib/highlight-code"
import { getRegistryItem } from "@/lib/registry"
import { cn } from "@/lib/utils"
import { ChartToolbar } from "@/components/chart-toolbar"
import { type Style } from "@/registry/_legacy-styles"

export type Chart = z.infer<typeof registryItemSchema> & {
  highlightedCode: string
}

export async function ChartDisplay({
  chart,
  children,
  className,
}: {
  chart: Chart
} & React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "themes-wrapper group relative flex flex-col overflow-hidden rounded-xl border transition-all duration-200 ease-in-out hover:z-30",
        className
      )}
    >
      <ChartToolbar
        chart={chart}
        className="bg-card text-card-foreground relative z-20 flex justify-end border-b px-3 py-2.5"
      >
        {children}
      </ChartToolbar>
      <div className="relative z-10 [&>div]:rounded-none [&>div]:border-none [&>div]:shadow-none">
        {children}
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
