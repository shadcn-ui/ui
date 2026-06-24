"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"

import { cn } from "@/registry/bases/base/lib/utils"
import { Skeleton } from "@/registry/bases/base/ui/skeleton"

function Switch({
  className,
  size = "default",
  isLoading = false,
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
  isLoading?: boolean
}) {
  if (isLoading) {
    return (
      <Skeleton
        className={cn(
          "cn-switch peer group/switch relative inline-flex items-center transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 data-disabled:cursor-not-allowed data-disabled:opacity-50",
          className
        )}
        data-size={size}
        {...props as any}
      />
    )
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
