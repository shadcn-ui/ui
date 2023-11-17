"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "group my-2 h-4 w-9 rounded-lg bg-border focus:outline-none disabled:cursor-not-allowed data-[state=checked]:bg-primary/50",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "-ml-0.5 -mt-0.5 block h-5 w-5 rounded-xl shadow-md ring-primary/10 transition-transform hover:ring-8 group-focus:ring-8 data-[disabled]:pointer-events-none data-[state=checked]:translate-x-5 data-[disabled]:bg-gray-600 data-[state=checked]:bg-primary data-[state=unchecked]:bg-background"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
