"use client"

import {
  SliderFill,
  Slider as SliderPrimitive,
  SliderThumb,
  SliderTrack,
  type SliderProps as SliderPrimitiveProps,
} from "react-aria-components"

import { cn } from "@/registry/bases/aria/lib/utils"

type SliderValue = number | number[]
type SliderProps<T extends SliderValue = SliderValue> = Omit<
  SliderPrimitiveProps<T>,
  "className"
> & {
  className?: string
}

function Slider<T extends SliderValue = SliderValue>({
  className,
  ...props
}: SliderProps<T>) {
  return (
    <SliderPrimitive
      className={cn(
        "cn-slider group relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:w-auto data-vertical:flex-col",
        className
      )}
      data-slot="slider"
      {...props}
    >
      {({ state }) => {
        return (
          <>
            <SliderTrack
              data-slot="slider-track"
              className="cn-slider-track relative grow overflow-hidden select-none"
            >
              <SliderFill
                data-slot="slider-range"
                className="cn-slider-range absolute select-none data-horizontal:h-full data-vertical:w-full"
              />
            </SliderTrack>
            {state.values.map((_, index) => (
              <SliderThumb
                data-slot="slider-thumb"
                key={index}
                index={index}
                className="cn-slider-thumb block shrink-0 select-none group-data-horizontal:top-[50%] group-data-vertical:left-[50%] disabled:pointer-events-none disabled:opacity-50"
              />
            ))}
          </>
        )
      }}
    </SliderPrimitive>
  )
}

export { Slider }
