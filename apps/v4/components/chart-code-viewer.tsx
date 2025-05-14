import * as React from "react"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { ChartCopyButton } from "@/components/chart-copy-button"
import { Chart } from "@/components/chart-display"
import { getIconForLanguageExtension } from "@/components/icons"
import { OpenInV0Button } from "@/components/open-in-v0-button"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/new-york-v4/ui/drawer"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/registry/new-york-v4/ui/sheet"

export function ChartCodeViewer({
  chart,
  className,
  children,
}: {
  chart: Chart
} & React.ComponentProps<"div">) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const button = (
    <Button
      size="sm"
      variant="outline"
      className="text-foreground hover:bg-muted dark:text-foreground h-6 rounded-[6px] border bg-transparent px-2 text-xs shadow-none"
    >
      View Code
    </Button>
  )

  const content = (
    <div className="flex min-h-0 flex-1 flex-col gap-0">
      <div className="chart-wrapper theme-container hidden sm:block [&_[data-chart]]:mx-auto [&_[data-chart]]:max-h-[35vh] [&>div]:rounded-none [&>div]:border-0 [&>div]:border-b [&>div]:shadow-none">
        {children}
      </div>
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden p-4">
        <figure
          data-rehype-pretty-code-figure=""
          className="mt-0 flex h-auto min-w-0 flex-1 flex-col overflow-hidden"
        >
          <figcaption
            className="text-foreground [&>svg]:text-foreground flex h-12 shrink-0 items-center gap-2 border-b py-2 pr-2 pl-4 [&>svg]:size-4 [&>svg]:opacity-70"
            data-language="tsx"
          >
            {getIconForLanguageExtension("tsx")}
            {chart.name}
            <div className="ml-auto flex items-center gap-2">
              <ChartCopyButton
                event="copy_chart_code"
                name={chart.name}
                code={chart.files?.[0]?.content ?? ""}
              />
              <OpenInV0Button name={chart.name} className="rounded-sm" />
            </div>
          </figcaption>
          <div
            dangerouslySetInnerHTML={{
              __html: chart.highlightedCode,
            }}
            className="no-scrollbar overflow-y-auto"
          />
        </figure>
      </div>
    </div>
  )

  if (!isDesktop) {
    return (
      <Drawer>
        <DrawerTrigger asChild>{button}</DrawerTrigger>
        <DrawerContent
          className={cn(
            "flex max-h-[80vh] flex-col sm:max-h-[90vh] [&>div.bg-muted]:shrink-0",
            className
          )}
        >
          <DrawerHeader className="sr-only">
            <DrawerTitle>Code</DrawerTitle>
            <DrawerDescription>View the code for the chart.</DrawerDescription>
          </DrawerHeader>
          <div className="flex h-full flex-col overflow-auto">{content}</div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{button}</SheetTrigger>
      <SheetContent
        side="right"
        className={cn(
          "flex flex-col gap-0 border-l-0 p-0 sm:max-w-sm md:w-[700px] md:max-w-[700px] dark:border-l",
          className
        )}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Code</SheetTitle>
          <SheetDescription>View the code for the chart.</SheetDescription>
        </SheetHeader>
        {content}
      </SheetContent>
    </Sheet>
  )
}
