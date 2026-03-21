"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "@ark-ui/react/slider"

import { cn } from "@/examples/ark/lib/utils"

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min],
    [value, defaultValue, min]
  )

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn("data-vertical:min-h-40", className)}
      {...props}
    >
      <SliderPrimitive.Control className="">
        <SliderPrimitive.Track className="rounded-full bg-muted data-horizontal:h-1 data-horizontal:w-full data-vertical:h-full data-vertical:w-1">
          <SliderPrimitive.Range className="bg-primary" />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            index={index}
            className="relative size-3 rounded-full border border-ring bg-white ring-ring/50 transition-[color,box-shadow] after:absolute after:-inset-2 hover:ring-3 focus-visible:ring-3 focus-visible:outline-hidden active:ring-3"
          />
        ))}
      </SliderPrimitive.Control>
      <SliderPrimitive.HiddenInput />
    </SliderPrimitive.Root>
  )
}

const SliderContext = SliderPrimitive.Context
const SliderRootProvider = SliderPrimitive.RootProvider

export { Slider, SliderContext, SliderRootProvider }
export {
  useSlider,
  useSliderContext,
  type SliderValueChangeDetails,
} from "@ark-ui/react/slider"
