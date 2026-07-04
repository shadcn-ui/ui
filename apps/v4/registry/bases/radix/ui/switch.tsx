"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"

import { cn } from "@/registry/bases/radix/lib/utils"

function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "cn-switch peer group/switch relative inline-flex items-center transition-colors outline-none after:absolute after:-inset-x-3 after:-inset-y-2 motion-reduce:transition-none data-disabled:cursor-not-allowed data-disabled:opacity-50", // [FORCE-UI] transition-colors (not -all) so the focus ring doesn't animate; WCAG 2.3.3 guard
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
