"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "@ark-ui/react/checkbox"

import { cn } from "@/registry/bases/ark/lib/utils"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn("cn-checkbox group/checkbox", className)}
      {...props}
    >
      <CheckboxPrimitive.Control className="cn-checkbox-control">
        <CheckboxPrimitive.Indicator>
          <IconPlaceholder
            lucide="CheckIcon"
            tabler="IconCheck"
            hugeicons="Tick02Icon"
            phosphor="CheckIcon"
            remixicon="RiCheckLine"
            className="cn-checkbox-indicator"
          />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Control>
      <CheckboxPrimitive.HiddenInput />
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
