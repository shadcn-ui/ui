"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { getColors } from "@/lib/colors"
import { cn } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "@/registry/new-york-v4/ui/scroll-area"

export function ColorsNav({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const pathname = usePathname()
  const colors = getColors()

  return (
    <div className={cn("flex items-center", className)} {...props}>
      <ScrollArea className="max-w-[600px] lg:max-w-[940px]">
        <div className="flex items-center">
          {colors.map((colorPalette, index) => (
            <Link
              href={`/colors#${colorPalette.name}`}
              key={colorPalette.name}
              className={cn(
                "hover:text-primary flex h-7 shrink-0 items-center justify-center rounded-full px-4 text-center text-sm font-medium capitalize transition-colors",
                pathname?.startsWith(colorPalette.name) ||
                  (index === 0 && pathname === "/colors")
                  ? "bg-muted text-primary"
                  : "text-muted-foreground"
              )}
            >
              {colorPalette.name}
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  )
}
