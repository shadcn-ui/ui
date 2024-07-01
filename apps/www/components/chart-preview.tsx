"use client"

import * as React from "react"

import { useConfig } from "@/hooks/use-config"
import { Icons } from "@/components/icons"
import { Tabs, TabsContent } from "@/registry/new-york/ui/tabs"
import { Block } from "@/registry/schema"

export function ChartPreview({ chart }: { chart: Block }) {
  const [config] = useConfig()
  const [isLoading, setIsLoading] = React.useState(true)

  if (config.style !== chart.style) {
    return null
  }

  return (
    <Tabs
      id={chart.name}
      defaultValue="preview"
      className="relative overflow-hidden rounded-xl border"
      style={
        {
          "--container-height": chart.container?.height,
        } as React.CSSProperties
      }
    >
      <TabsContent
        value="preview"
        className="relative after:absolute after:inset-0 after:right-3 after:z-0 after:rounded-lg after:bg-muted"
      >
        {isLoading ? (
          <div className="absolute inset-0 z-10 flex h-[--container-height] w-full items-center justify-center gap-2 text-sm text-muted-foreground">
            <Icons.spinner className="h-4 w-4 animate-spin" />
            Loading...
          </div>
        ) : null}
        <iframe
          src={`/blocks/${chart.style}/${chart.name}`}
          height={chart.container?.height}
          className="chunk-mode relative z-20 w-full bg-background"
          onLoad={() => {
            setIsLoading(false)
          }}
        />
      </TabsContent>
      <TabsContent value="code">
        <div
          data-rehype-pretty-code-fragment
          dangerouslySetInnerHTML={{ __html: chart.highlightedCode }}
          className="w-full overflow-hidden rounded-md [&_pre]:my-0 [&_pre]:h-[--container-height] [&_pre]:overflow-auto [&_pre]:whitespace-break-spaces [&_pre]:p-6 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:leading-relaxed"
        />
      </TabsContent>
    </Tabs>
  )
}
