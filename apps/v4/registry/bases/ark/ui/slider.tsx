"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "@ark-ui/react/slider"

import { cn } from "@/registry/bases/ark/lib/utils"

function Slider({
  className,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn("cn-slider", className)}
      {...props}
    >
      <SliderPrimitive.Control className="cn-slider-control">
        <SliderPrimitive.Track className="cn-slider-track">
          <SliderPrimitive.Range className="cn-slider-range" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb index={0} className="cn-slider-thumb" />
      </SliderPrimitive.Control>
      <SliderPrimitive.HiddenInput />
    </SliderPrimitive.Root>
  )
}

export { Slider }
