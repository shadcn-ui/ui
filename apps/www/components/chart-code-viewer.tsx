import * as React from "react"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useThemesConfig } from "@/hooks/use-themes-config"
import { ChartCopyButton } from "@/components/chart-copy-button"
import { Chart } from "@/components/chart-display"
import { V0Button } from "@/components/v0-button"
import { Button } from "@/registry/new-york/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/registry/new-york/ui/drawer"
import { Sheet, SheetContent, SheetTrigger } from "@/registry/new-york/ui/sheet"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/new-york/ui/tabs"

export function ChartCodeViewer({
  chart,
  className,
  children,
}: {
  chart: Chart
} & React.ComponentProps<"div">) {
  const [tab, setTab] = React.useState("code")
  const { themesConfig } = useThemesConfig()
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const themeCode = React.useMemo(() => {
    return `\
@layer base {
  :root {
${Object.entries(themesConfig?.activeTheme.cssVars.light || {})
  .map(([key, value]) => `    ${key}: ${value};`)
  .join("\n")}
  }

  .dark {
${Object.entries(themesConfig?.activeTheme.cssVars.dark || {})
  .map(([key, value]) => `    ${key}: ${value};`)
  .join("\n")}
    }
}
`
  }, [themesConfig])

  const button = (
    <Button
      size="sm"
      variant="outline"
      className="h-6 rounded-[6px] border bg-transparent px-2 text-xs text-foreground shadow-none hover:bg-muted dark:text-foreground"
    >
      View Code
    </Button>
  )

  const content = (
    <>
      <div className="chart-wrapper hidden sm:block [&>div]:rounded-none [&>div]:border-0 [&>div]:border-b [&>div]:shadow-none [&_[data-chart]]:mx-auto [&_[data-chart]]:max-h-[35vh]">
        {children}
      </div>
      <Tabs
        defaultValue="code"
        className="relative flex h-full flex-1 flex-col overflow-hidden p-4"
        value={tab}
        onValueChange={setTab}
      >
        <div className="flex w-full items-center">
          <TabsList className="h-7 w-auto rounded-md p-0 px-[calc(theme(spacing.1)_-_2px)] py-[theme(spacing.1)]">
            <TabsTrigger
              value="code"
              className="h-[1.45rem] rounded-sm px-2 text-xs"
            >
              Code
            </TabsTrigger>
            <TabsTrigger
              value="theme"
              className="h-[1.45rem] rounded-sm px-2 text-xs"
            >
              Theme
            </TabsTrigger>
          </TabsList>
          {tab === "code" && (
            <div className="ml-auto flex items-center justify-center gap-2">
              <ChartCopyButton
                event="copy_chart_code"
                name={chart.name}
                code={chart.files?.[0]?.content ?? ""}
              />
              <V0Button
                id={`v0-button-${chart.name}`}
                name={chart.name}
                className="h-7"
              />
            </div>
          )}
          {tab === "theme" && (
            <ChartCopyButton
              event="copy_chart_theme"
              name={chart.name}
              code={themeCode}
              className="ml-auto"
            />
          )}
        </div>
        <TabsContent
          value="code"
          className="h-full flex-1 flex-col overflow-hidden data-[state=active]:flex"
        >
          <div className="relative overflow-auto rounded-lg bg-black">
            <div
              data-rehype-pretty-code-fragment
              dangerouslySetInnerHTML={{
                __html: chart.highlightedCode,
              }}
              className="w-full overflow-hidden [&_pre]:overflow-auto [&_pre]:!bg-black [&_pre]:py-6 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:leading-relaxed"
            />
          </div>
        </TabsContent>
        <TabsContent
          value="theme"
          className="h-full flex-1 flex-col overflow-hidden data-[state=active]:flex"
        >
          <div
            data-rehype-pretty-code-fragment
            className="relative overflow-auto rounded-lg bg-black py-6"
          >
            <pre className="bg-black font-mono text-sm leading-relaxed">
              <code data-line-numbers="">
                <span className="line text-zinc-700">{`/* ${themesConfig?.activeTheme.name} */`}</span>
                {themeCode.split("\n").map((line, index) => (
                  <span key={index} className="line">
                    {line}
                  </span>
                ))}
              </code>
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </>
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
          "flex flex-col gap-0 border-l-0 p-0 dark:border-l sm:max-w-sm md:w-[700px] md:max-w-[700px]",
          className
        )}
      >
        {content}
      </SheetContent>
    </Sheet>
  )
}
