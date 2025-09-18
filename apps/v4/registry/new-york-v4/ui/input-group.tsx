import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/new-york-v4/ui/button"

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      className={cn(
        "group border-input dark:bg-input/30 relative isolate flex h-9 w-full items-center gap-2 rounded-md border px-3 shadow-xs transition-[color,box-shadow] outline-none",

        // Error state.
        "has-[input[aria-invalid=true]]:ring-destructive/20 has-[input[aria-invalid=true]]:border-destructive dark:has-[input[aria-invalid=true]]:ring-destructive/40",

        // Focus state.
        "has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-ring/50 has-[input:focus-visible]:ring-[3px]",

        // Child input overrides (direct children only).
        "[&>input]:flex-1 [&>input]:rounded-none [&>input]:border-0 [&>input]:bg-transparent [&>input]:px-0 [&>input]:shadow-none dark:[&>input]:bg-transparent [&>input:focus-visible]:ring-0",

        className
      )}
      {...props}
    />
  )
}

function InputGroupAddon({
  className,
  align = "start",
  ...props
}: React.ComponentProps<"div"> & {
  align?: "start" | "end"
}) {
  return (
    <div
      data-slot="input-group-addon"
      data-align={align}
      className={cn(
        "text-muted-foreground flex h-auto items-center justify-center py-1.5 text-sm font-medium select-none",

        // Alignment and button adjustments.
        "data-[align=end]:order-last",
        "data-[align=end]:[&>button]:mr-[-0.4rem] data-[align=end]:[&>kbd]:mr-[-0.35rem]",
        "data-[align=start]:order-first",
        "data-[align=start]:[&>button]:ml-[-0.45rem] data-[align=start]:[&>kbd]:ml-[-0.35rem]",

        // Child SVGs without size class should default to size-4.
        "[&>svg:not([class*='size-'])]:size-4",
        "[&>kbd]:rounded-[calc(var(--radius)-5px)]",

        className
      )}
      {...props}
    />
  )
}

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      size={size}
      className={cn(
        "h-6 gap-1 px-1.5 text-sm shadow-none",
        "not-[.rounded-full]:rounded-[calc(var(--radius)-5px)]",
        "has-[>svg]:px-1.5",
        "data-[size=icon]:size-6",
        "data-[slot=button]:h-6",
        "data-[slot=button]:gap-1",
        "data-[slot=button]:px-1.5",
        className
      )}
      {...props}
    />
  )
}

export { InputGroup, InputGroupAddon, InputGroupButton }
