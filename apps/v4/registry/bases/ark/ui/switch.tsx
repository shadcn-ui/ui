"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "@ark-ui/react/switch"

import { cn } from "@/registry/bases/ark/lib/utils"

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
      className={cn("cn-switch", className)}
      {...props}
    >
      <SwitchPrimitive.Control className="cn-switch-control">
        <SwitchPrimitive.Thumb
          data-slot="switch-thumb"
          className="cn-switch-thumb"
        />
      </SwitchPrimitive.Control>
      <SwitchPrimitive.HiddenInput />
    </SwitchPrimitive.Root>
  )
}

const SwitchContext = SwitchPrimitive.Context
const SwitchRootProvider = SwitchPrimitive.RootProvider

export { Switch, SwitchContext, SwitchRootProvider }
export {
  useSwitch,
  useSwitchContext,
  type SwitchCheckedChangeDetails,
} from "@ark-ui/react/switch"
