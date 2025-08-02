"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      style={
				{
					"--switch-width": "2rem",
					"--switch-height": "calc(var(--switch-width) * (23 / 40))",
					"--switch-padding": "1px", // always set as a whole number to prevent visual bugs
					"--switch-thumb-size":
						"calc(var(--switch-height) - 2 * var(--switch-padding))",
					"--switch-thumb-travel":
						"calc(var(--switch-width) - 2 * var(--switch-padding) - var(--switch-thumb-size))",
				} as React.CSSProperties
			}
      data-slot="switch"
      className={cn(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex w-(--switch-width) h-(--switch-height) shrink-0 items-center rounded-full border-(length:--switch-padding) border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-(--switch-thumb-size) rounded-full ring-0 transition-transform data-[state=unchecked]:translate-x-0 data-[state=checked]:translate-x-(--switch-thumb-travel) rtl:data-[state=checked]:-translate-x-(--switch-thumb-travel)"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
