"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"

import { cn } from "@/registry/bases/radix/lib/utils"
import { Skeleton } from "@/registry/bases/radix/ui/skeleton"

function Switch({
  className,
  size = "default",
  isLoading,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default"
  isLoading?: boolean
}) {
  if (isLoading) {
    return <Skeleton className="h-5 w-11 rounded-full" />
  }
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "cn-switch peer group/switch relative inline-flex items-center transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 data-disabled:cursor-not-allowed data-disabled:opacity-50",
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
