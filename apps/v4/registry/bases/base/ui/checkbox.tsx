"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"

import { cn } from "@/registry/bases/base/lib/utils"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Skeleton } from "@/registry/bases/base/ui/skeleton"

function Checkbox({
  className,
  isLoading = false,
  ...props
}: CheckboxPrimitive.Root.Props & { isLoading?: boolean }) {
  if (isLoading) {
    return (
      <Skeleton
        className={cn("size-4 shrink-0 border border-input", className)}
        {...props as any}
      />
    )
  }

  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "cn-checkbox peer relative shrink-0 outline-none after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="cn-checkbox-indicator grid place-content-center text-current transition-none"
      >
        <IconPlaceholder
          lucide="CheckIcon"
          tabler="IconCheck"
          hugeicons="Tick02Icon"
          phosphor="CheckIcon"
          remixicon="RiCheckLine"
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
