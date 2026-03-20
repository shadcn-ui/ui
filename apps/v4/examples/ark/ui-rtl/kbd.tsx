import * as React from "react"
import { ark } from "@ark-ui/react/factory"

import { cn } from "@/examples/ark/lib/utils"

function Kbd({ className, ...props }: React.ComponentProps<typeof ark.kbd>) {
  return (
    <ark.kbd
      data-slot="kbd"
      className={cn(
        "pointer-events-none inline-flex h-5 w-fit min-w-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 select-none in-data-[slot=tooltip-content]:bg-background/20 in-data-[slot=tooltip-content]:text-background dark:in-data-[slot=tooltip-content]:bg-background/10 [&_svg:not([class*='size-'])]:size-3",
        className
      )}
      {...props}
    />
  )
}

function KbdGroup({
  className,
  ...props
}: React.ComponentProps<typeof ark.kbd>) {
  return (
    <ark.kbd
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  )
}

export { Kbd, KbdGroup }
