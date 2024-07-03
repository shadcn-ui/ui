"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { BlockCopyButton } from "@/components/block-copy-button"
import { V0Button } from "@/components/v0-button"
import { Button } from "@/registry/new-york/ui/button"
import { Separator } from "@/registry/new-york/ui/separator"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "@/registry/new-york/ui/sheet"
import { Block } from "@/registry/schema"

export function ChartToolbar({
  chart,
  className,
  children,
}: { chart: Block } & React.ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-2">
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
            className="flex flex-col gap-0 p-0 sm:max-w-[700px] [&>button]:hidden"
          >
            <div className="[&>div]:rounded-none [&>div]:border-0 [&>div]:border-b [&>div]:shadow-none">
              {children}
            </div>
            <div className="relative h-full flex-1 overflow-hidden p-6">
              <BlockCopyButton
                event="copy_block_code"
                name={chart.name}
                code={chart.code}
                className="[&_svg]-h-3 absolute right-9 top-9 z-10 h-6 w-6 rounded-[6px] border-muted-foreground/50 bg-black text-white shadow-none [&_svg]:w-3"
              />
              <div className="relative h-full overflow-auto rounded-xl">
                <div className="relative overflow-auto ">
                  <div>
                    <div
                      data-rehype-pretty-code-fragment
                      dangerouslySetInnerHTML={{
                        __html: chart.highlightedCode,
                      }}
                      className="w-full overflow-hidden [&_pre]:my-0 [&_pre]:h-[--container-height] [&_pre]:overflow-auto [&_pre]:whitespace-break-spaces [&_pre]:p-6 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            </div>
            <SheetFooter className="border-t p-4">
              <SheetClose asChild>
                <Button variant="outline">Close</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
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
          event="copy_block_code"
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
