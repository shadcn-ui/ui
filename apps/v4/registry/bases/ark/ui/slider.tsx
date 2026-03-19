"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "@ark-ui/react/slider"

import { cn } from "@/registry/bases/ark/lib/utils"

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
      className={cn("cn-slider", className)}
      {...props}
    >
      <SliderPrimitive.Control className="cn-slider-control">
        <SliderPrimitive.Track className="cn-slider-track">
          <SliderPrimitive.Range className="cn-slider-range" />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            index={index}
            className="cn-slider-thumb"
          />
        ))}
      </SliderPrimitive.Control>
      <SliderPrimitive.HiddenInput />
    </SliderPrimitive.Root>
  )
}

export { Slider }
