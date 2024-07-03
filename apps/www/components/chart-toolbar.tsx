"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { BlockCopyButton } from "@/components/block-copy-button"
import { V0Button } from "@/components/v0-button"
import { Button } from "@/registry/new-york/ui/button"
import { Block } from "@/registry/schema"

export function ChartToolbar({
  chart,
  className,
}: { chart: Block } & React.ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        asChild
        variant="link"
        size="sm"
        className="-translate-x-1 gap-1 text-sm"
      >
        <Link href={`/docs/charts/${chart.category?.toLowerCase()}`}>
          Docs <ArrowRight className="h-3 w-3" />
        </Link>
      </Button>
      <div className="ml-auto flex items-center gap-2">
        <BlockCopyButton
          event="copy_block_code"
          name={chart.name}
          code={chart.code}
          className="[&_svg]-h-3 h-6 w-6 rounded-[6px] [&_svg]:w-3"
        />
        <V0Button
          id={`v0-button-${chart.name}`}
          block={{
            name: chart.name,
            description: chart.description || "Edit in v0",
            code: chart.code,
            style: chart.style,
          }}
          className="h-6"
        />
      </div>
    </div>
  )
}
