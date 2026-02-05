"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "@ark-ui/react/switch"

import { cn } from "@/registry/bases/ark/lib/utils"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn("cn-switch", className)}
      {...props}
    >
      <SwitchPrimitive.Control className="cn-switch-control">
        <SwitchPrimitive.Thumb className="cn-switch-thumb" />
      </SwitchPrimitive.Control>
      <SwitchPrimitive.HiddenInput />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
