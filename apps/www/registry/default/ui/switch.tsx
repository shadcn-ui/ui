"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

/* eslint-disable tailwindcss/classnames-order */
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & {
    dir?: "ltr" | "rtl"
  }
>(({ className, dir = "ltr", ...props }, ref) => (
  <SwitchPrimitives.Root
    dir={dir}
    className={cn(
      "inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent peer disabled:cursor-not-allowed disabled:opacity-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      key={dir}
      className={cn(
        "block h-5 w-5 rounded-full bg-background shadow-lg ring-0 pointer-events-none transition-transform data-[state=unchecked]:translate-x-0",
        dir === "rtl"
          ? "data-[state=checked]:-translate-x-5"
          : "data-[state=checked]:translate-x-5"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName
/* eslint-enable tailwindcss/classnames-order */

export { Switch }
