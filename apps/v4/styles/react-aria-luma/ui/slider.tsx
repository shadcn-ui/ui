"use client"

import {
  Slider as SliderPrimitive,
  SliderThumb,
  SliderTrack,
  useLocale,
  type SliderProps as SliderPrimitiveProps,
} from "react-aria-components"

import { cn } from "@/lib/utils"

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
  const { direction } = useLocale()
  return (
    <SliderPrimitive
      className={cn(
        "group relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col",
        className
      )}
      data-slot="slider"
      {...props}
    >
      {({ isDisabled, orientation, state }) => {
        const hasValues = state.values.length > 0
        const startPercent =
          hasValues && state.values.length > 1
            ? state.getThumbPercent(0) * 100
            : 0
        const endPercent = hasValues
          ? state.getThumbPercent(state.values.length - 1) * 100
          : 0
        const sizePercent = Math.max(0, endPercent - startPercent)

        return (
          <>
            <SliderTrack
              data-slot="slider-track"
              className="relative grow overflow-hidden rounded-full bg-input/90 select-none data-horizontal:h-2 data-horizontal:w-full data-vertical:h-full data-vertical:w-2"
            >
              <div
                data-slot="slider-range"
                className="absolute bg-primary select-none data-horizontal:h-full data-vertical:w-full"
                style={
                  orientation === "vertical"
                    ? {
                        bottom: `${startPercent}%`,
                        height: `${sizePercent}%`,
                        width: "100%",
                      }
                    : {
                        [direction === "rtl" ? "right" : "left"]:
                          `${startPercent}%`,
                        width: `${sizePercent}%`,
                        height: "100%",
                      }
                }
              />
            </SliderTrack>
            {state.values.map((_, index) => (
              <SliderThumb
                data-slot="slider-thumb"
                key={index}
                index={index}
                className="block h-4 w-6 shrink-0 rounded-full bg-white shadow-md ring-1 ring-black/10 transition-[color,box-shadow,background-color] select-none not-dark:bg-clip-padding group-data-horizontal:top-[50%] group-data-vertical:left-[50%] hover:ring-4 hover:ring-ring/30 focus-visible:ring-4 focus-visible:ring-ring/30 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 data-vertical:h-6 data-vertical:w-4"
              />
            ))}
          </>
        )
      }}
    </SliderPrimitive>
  )
}

export { Slider }
