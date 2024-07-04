import * as React from "react"

import { cn } from "@/lib/utils"
import { useChartConfig } from "@/hooks/use-chart-config"
import { useConfig } from "@/hooks/use-config"
import { BlockCopyButton } from "@/components/block-copy-button"
import { Button } from "@/registry/new-york/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/registry/new-york/ui/sheet"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/new-york/ui/tabs"
import { Block } from "@/registry/schema"

export function ChartCodeViewer({
  chart,
  className,
  children,
}: { chart: Block } & React.ComponentProps<"div">) {
  const [tab, setTab] = React.useState("code")
  const { chartConfig } = useChartConfig()

  const themeCode = React.useMemo(() => {
    return `\
@layer base {
  :root {
${Object.entries(chartConfig.theme.cssVars.light)
  .map(([key, value]) => `    ${key}: ${value};`)
  .join("\n")}
  }

  .dark {
${Object.entries(chartConfig.theme.cssVars.dark)
  .map(([key, value]) => `    ${key}: ${value};`)
  .join("\n")}
  }
}
`
  }, [chartConfig])

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="hidden h-6 rounded-[6px] px-2 text-xs text-foreground shadow-none md:flex"
        >
          Code
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className={cn(
          "flex flex-col gap-0 p-0 md:max-w-[500px] lg:max-w-[700px]",
          className
        )}
      >
        <div className="[&>div]:rounded-none [&>div]:border-0 [&>div]:border-b [&>div]:shadow-none">
          {children}
        </div>
        <Tabs
          defaultValue="code"
          className="relative flex h-full flex-1 flex-col overflow-hidden p-4"
          value={tab}
          onValueChange={setTab}
        >
          <div className="flex w-full items-center">
            <TabsList className="hidden h-7 w-auto rounded-md p-0 px-[calc(theme(spacing.1)_-_2px)] py-[theme(spacing.1)] sm:flex">
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
              <BlockCopyButton
                event="copy_chart_code"
                name={chart.name}
                code={chart.code}
                className="ml-auto"
              />
            )}
            {tab === "theme" && (
              <BlockCopyButton
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
                  <span className="line text-zinc-700">{`/* ${chartConfig.theme.name} */`}</span>
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
      </SheetContent>
    </Sheet>
  )
}
