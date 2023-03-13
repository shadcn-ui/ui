"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="bg-base-200 dark:bg-base-800 relative h-2 w-full grow overflow-hidden rounded-full">
      <SliderPrimitive.Range className="bg-base-900 dark:bg-base-400 absolute  h-full" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="border-base-900 focus:ring-ring dark:border-base-100 dark:bg-base-400 ring-offset-background block h-5 w-5 rounded-full border-2 bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none  disabled:opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
