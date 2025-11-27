"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"

import { cn } from "@/registry/bases/radix/lib/cn"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "cn-switch peer focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 relative inline-flex items-center transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="cn-switch-thumb pointer-events-none block ring-0 transition-transform"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
