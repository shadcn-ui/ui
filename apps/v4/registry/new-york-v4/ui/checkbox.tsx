"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-[var(--radius-sm)] border border-[rgb(var(--border)/0.3)] bg-transparent transition-all duration-[100ms] active:scale-[0.95] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring)/0.4)] focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-40 data-[state=checked]:bg-[rgb(var(--primary))] data-[state=checked]:border-[rgb(var(--primary))] data-[state=checked]:text-white",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
