"use client"

import {
  Slider as SliderPrimitive,
  SliderThumb,
  SliderTrack,
  useLocale,
  type SliderProps as SliderPrimitiveProps,
} from "react-aria-components"

import { cn } from "@/registry/bases/react-aria/lib/utils"

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
  const {direction} = useLocale();
  return (
    <SliderPrimitive
      className={cn(
        "cn-slider group relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:w-auto data-vertical:flex-col",
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
              className="cn-slider-track relative grow overflow-hidden select-none"
            >
              <div
                data-slot="slider-range"
                className="cn-slider-range absolute select-none data-horizontal:h-full data-vertical:w-full"
                style={
                  orientation === "vertical"
                    ? {
                        bottom: `${startPercent}%`,
                        height: `${sizePercent}%`,
                        width: "100%",
                      }
                    : {
                        [direction === 'rtl' ? 'right' : 'left']: `${startPercent}%`,
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
