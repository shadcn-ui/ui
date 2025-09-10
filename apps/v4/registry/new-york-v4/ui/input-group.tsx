import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/new-york-v4/ui/button"

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      className={cn(
        "group border-input dark:bg-input/30 relative isolate flex h-9 w-full items-stretch gap-2 rounded-md border px-3 shadow-xs transition-[color,box-shadow] outline-none",
        "has-[input[aria-invalid=true]]:ring-destructive/20 dark:has-[input[aria-invalid=true]]:ring-destructive/40 has-[input[aria-invalid=true]]:border-destructive",
        "has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-ring/50 has-[input:focus-visible]:ring-[3px]",
        "*:[input]:flex-1 *:[input]:rounded-none *:[input]:border-0 *:[input]:bg-transparent *:[input]:px-0 *:[input]:shadow-none *:[input]:focus-visible:ring-0 *:[input]:dark:bg-transparent",
        className
      )}
      {...props}
    />
  )
}

function InputGroupAddon({
  className,
  side = "left",
  ...props
}: React.ComponentProps<"div"> & {
  side?: "left" | "right"
}) {
  return (
    <div
      data-slot="input-group-addon"
      data-side={side}
      className={cn(
        "flex h-auto items-center justify-center py-1.5 text-sm select-none data-[side=left]:order-first data-[side=left]:has-[>button]:ml-[-0.45rem] data-[side=right]:order-last data-[side=right]:has-[>button]:mr-[-0.4rem] *:[svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function InputGroupButton({
  className,
  variant = "ghost",
  size = "default",
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-size={size}
      variant={variant}
      size={size}
      className={cn(
        className,
        "h-6 gap-1 px-1.5 shadow-none not-[.rounded-full]:rounded-[calc(var(--radius)-5px)] has-[>svg]:px-1.5 data-[size=icon]:size-6 data-[slot=button]:h-6 data-[slot=button]:gap-1 data-[slot=button]:px-1.5"
      )}
      {...props}
    />
  )
}

export { InputGroup, InputGroupAddon, InputGroupButton }
