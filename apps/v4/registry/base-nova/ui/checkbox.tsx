"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui-components/react/checkbox"

import { cn } from "@/registry/bases/base/lib/utils"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "border-input bg-input/30 data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary aria-invalid:data-[state=checked]:border-primary aria-invalid:border-destructive size-4 rounded-[4px] border inset-shadow-2xs inset-shadow-white/25 transition-shadow data-[state=checked]:bg-linear-to-b data-[state=checked]:from-[color-mix(in_oklch,var(--primary)_85%,var(--background))] data-[state=checked]:to-(--primary) peer relative shrink-0 outline-none after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="[&>svg]:size-3.5 grid place-content-center text-current transition-none"
      >
        <IconPlaceholder
          lucide="CheckIcon"
          tabler="IconCheck"
          hugeicons="Tick02Icon"
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
