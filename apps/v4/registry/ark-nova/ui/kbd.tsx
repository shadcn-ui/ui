import * as React from "react"
import { ark } from "@ark-ui/react/factory"

import { cn } from "@/registry/ark-nova/lib/utils"

function Kbd({ className, ...props }: React.ComponentProps<typeof ark.kbd>) {
  return (
    <ark.kbd
      data-slot="kbd"
      className={cn(
        "in-data-[slot=tooltip-content]:bg-background/20 in-data-[slot=tooltip-content]:text-background dark:in-data-[slot=tooltip-content]:bg-background/10 w-fit min-w-5 [&_svg:not([class*='size-'])]:size-3 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100",
        className
      )}
      {...props}
    />
  )
}

function KbdGroup({ className, ...props }: React.ComponentProps<typeof ark.kbd>) {
  return (
    <ark.kbd
      data-slot="kbd-group"
      className={cn("gap-1 inline-flex items-center", className)}
      {...props}
    />
  )
}

export { Kbd, KbdGroup }
