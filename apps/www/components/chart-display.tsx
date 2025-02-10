import * as React from "react"
import { registryItemSchema } from "shadcn/registry"
import { z } from "zod"

import { highlightCode } from "@/lib/highlight-code"
import { getRegistryItem } from "@/lib/registry"
import { cn } from "@/lib/utils"
import { ChartToolbar } from "@/components/chart-toolbar"

export type Chart = z.infer<typeof registryItemSchema> & {
  highlightedCode: string
}

export async function ChartDisplay({
  name,
  children,
  className,
}: { name: string } & React.ComponentProps<"div">) {
  const chart = await getCachedRegistryItem(name)
  const highlightedCode = await getChartHighlightedCode(
    chart?.files?.[0]?.content ?? ""
  )

  if (!chart || !highlightedCode) {
    return null
  }

  return (
    <div
      className={cn(
        "themes-wrapper group relative flex flex-col overflow-hidden rounded-xl border shadow transition-all duration-200 ease-in-out hover:z-30",
        className
      )}
    >
      <ChartToolbar
        chart={{ ...chart, highlightedCode }}
        className="relative z-20 flex justify-end border-b bg-card px-3 py-2.5 text-card-foreground"
      >
        {children}
      </ChartToolbar>
      <div className="relative z-10 [&>div]:rounded-none [&>div]:border-none [&>div]:shadow-none">
        {children}
      </div>
    </div>
  )
}

const getCachedRegistryItem = React.cache(async (name: string) => {
  return await getRegistryItem(name)
})

const getChartHighlightedCode = React.cache(async (content: string) => {
  return await highlightCode(content)
})
