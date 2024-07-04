"use client"

import Link from "next/link"

import { cn } from "@/lib/utils"
import { BlockCopyButton } from "@/components/block-copy-button"
import { V0Button } from "@/components/v0-button"
import { Button } from "@/registry/new-york/ui/button"
import { Separator } from "@/registry/new-york/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/registry/new-york/ui/sheet"
import { Block } from "@/registry/schema"

import "@/styles/mdx.css"
import { ChartCodeViewer } from "@/components/chart-code-viewer"

export function ChartToolbar({
  chart,
  className,
  children,
}: { chart: Block } & React.ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-2">
        <ChartCodeViewer chart={chart}>{children}</ChartCodeViewer>
        <Separator orientation="vertical" className="mx-0 hidden h-4 md:flex" />
        <Button
          asChild
          variant="link"
          size="sm"
          className="h-6 gap-1 rounded-[6px] px-1 text-xs text-foreground"
        >
          <Link href={`/docs/charts/${chart.subcategory?.toLowerCase()}`}>
            Docs
          </Link>
        </Button>
      </div>
      <div className="ml-auto flex items-center gap-2 [&>form]:flex">
        <BlockCopyButton
          event="copy_chart_code"
          name={chart.name}
          code={chart.code}
          className="[&_svg]-h-3 h-6 w-6 rounded-[6px] shadow-none [&_svg]:w-3"
        />
        <V0Button
          id={`v0-button-${chart.name}`}
          block={{
            name: chart.name,
            description: chart.description || "Edit in v0",
            code: chart.code,
            style: chart.style,
          }}
          className="h-[1.45rem] shadow-none disabled:cursor-not-allowed disabled:opacity-100"
          disabled
        />
      </div>
    </div>
  )
}
