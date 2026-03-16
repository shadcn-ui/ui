"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "@ark-ui/react/slider"

import { cn } from "@/examples/ark/lib/utils"

function Slider({
  className,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn("data-vertical:min-h-40", className)}
      {...props}
    >
      <SliderPrimitive.Control className="">
        <SliderPrimitive.Track className="rounded-full bg-muted data-horizontal:h-1 data-horizontal:w-full data-vertical:h-full data-vertical:w-1">
          <SliderPrimitive.Range className="bg-primary" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          index={0}
          className="relative size-3 rounded-full border border-ring bg-white ring-ring/50 transition-[color,box-shadow] after:absolute after:-inset-2 hover:ring-3 focus-visible:ring-3 focus-visible:outline-hidden active:ring-3"
        />
      </SliderPrimitive.Control>
      <SliderPrimitive.HiddenInput />
    </SliderPrimitive.Root>
  )
}

export { Slider }
