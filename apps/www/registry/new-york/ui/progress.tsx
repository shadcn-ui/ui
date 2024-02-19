"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"
import { Label } from "./label"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    label?: "top" | "bottom"
  }
>(({ className, value, label, ...props }, ref) => (
  <div className="flex h-auto w-full flex-col items-center">
    {label == "top" ? <Label className="p-2">{value}%</Label> : null}
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-primary/20",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
    {label == "bottom" ? <Label className="p-2">{value}%</Label> : null}
  </div>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
