"use client"

import * as React from "react"
import {
  Slider as RACSlider,
  SliderOutput,
  SliderThumb,
  SliderTrack,
  type SliderProps,
} from "react-aria-components"

import { cn } from "@/registry/bases/react-aria/lib/utils"

function Slider({
  className,
  defaultValue,
  value,
  minValue = 0,
  maxValue = 100,
  ...props
}: SliderProps) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [minValue, maxValue],
    [value, defaultValue, minValue, maxValue]
  )

  return (
    <RACSlider
      className={cn(
        "data-[orientation=vertical]:h-full data-horizontal:w-full",
        className
      )}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      minValue={minValue}
      maxValue={maxValue}
      {...props}
    >
      <div className="cn-slider relative flex w-full touch-none items-center select-none data-[orientation=vertical]:h-full data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col data-disabled:opacity-50">
        <SliderTrack
          data-slot="slider-track"
          className="cn-slider-track relative grow overflow-hidden select-none"
        >
          <div
            data-slot="slider-range"
            className="cn-slider-range select-none data-[orientation=vertical]:w-full data-horizontal:h-full"
          />
        </SliderTrack>
        <SliderOutput />
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderThumb
            data-slot="slider-thumb"
            key={index}
            index={index}
            className="cn-slider-thumb top-0 left-0 block shrink-0 select-none disabled:pointer-events-none disabled:opacity-50"
          />
        ))}
      </div>
    </RACSlider>
  )
}

export { Slider }
