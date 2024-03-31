"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  showSteps?: string;
  formatLabel?: (value: number) => string;
  formatLabelSide?: string;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, showSteps = 'none', formatLabel, formatLabelSide = 'top', ...props }, ref) => {
  const { min = 0, max = 100, step = 1, orientation, value, defaultValue, onValueChange } = props;
  const [hoveredThumbIndex, setHoveredThumbIndex] = React.useState<boolean>(false);
  const numberOfSteps = Math.floor((max - min) / step);
  const stepLines = Array.from({ length: numberOfSteps }, (_, index) => index * step + min);

  const initialValue = Array.isArray(value) ? value : (Array.isArray(defaultValue) ? defaultValue : [min, max]);
  const [localValues, setLocalValues] = React.useState<number[]>(initialValue);

  React.useEffect(() => {
    if (!isEqual(value, localValues)) {
      setLocalValues(Array.isArray(value) ? value : (Array.isArray(defaultValue) ? defaultValue : [min, max]));
    }
  }, [min, max, value]);

  const handleValueChange = (newValues: number[]) => {
    setLocalValues(newValues);
    if (onValueChange) {
      onValueChange(newValues);
    }
  };

  function isEqual(array1: number[] | undefined, array2: number[] | undefined) {
    array1 = array1 ?? [];
    array2 = array2 ?? [];

    if (array1.length !== array2.length) {
      return false;
    }

    for (let i = 0; i < array1.length; i++) {
      if (array1[i] !== array2[i]) {
        return false;
      }
    }

    return true;
  }

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex touch-none select-none cursor-pointer data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "data-[orientation='horizontal']:w-full data-[orientation='horizontal']:items-center",
        "data-[orientation='vertical']:h-full data-[orientation='vertical']:justify-center",
        className
      )}
      min={min}
      max={max}
      step={step}
      value={localValues}
      onValueChange={(value) => handleValueChange(value)}
      {...props}
      onFocus={() => setHoveredThumbIndex(true)}
      onBlur={() => setHoveredThumbIndex(false)}
    >
      <SliderPrimitive.Track className={cn(
        "relative grow overflow-hidden rounded-full bg-primary/20",
        "data-[orientation='horizontal']:h-1.5 data-[orientation='horizontal']:w-full",
        "data-[orientation='vertical']:h-full data-[orientation='vertical']:w-1.5"
      )}>
        <SliderPrimitive.Range className={cn(
          "absolute bg-primary",
          "data-[orientation='horizontal']:h-full",
          "data-[orientation='vertical']:w-full"
        )} />
        {showSteps !== undefined && showSteps !== 'none' && stepLines.map((value, index) => {
          if (value === min || value === max) {
            return null;
          }
          const positionPercentage = ((value - min) / (max - min)) * 100;
          const adjustedPosition = 50 + (positionPercentage - 50) * 0.96;
          return (
            <div
              key={index}
              className={cn(
                {'w-0.5 h-2': orientation !== 'vertical', 'w-2 h-0.5': orientation === 'vertical'},
                'absolute bg-muted-foreground',
                {
                  'left-1': orientation === 'vertical' && showSteps === 'half',
                  'top-1': orientation !== 'vertical' && showSteps === 'half',
                  'left-0': orientation === 'vertical' && showSteps === 'full',
                  'top-0': orientation !== 'vertical' && showSteps === 'full',
                  'transform -translate-x-1/2': orientation !== 'vertical',
                  'transform -translate-y-1/2': orientation === 'vertical',
                }
              )}
              style={{
                [orientation === 'vertical' ? 'bottom' : 'left']: `${adjustedPosition}%`
              }}
            />
          );
        })}

      </SliderPrimitive.Track>
      {localValues.map((numberStep, index) => (
        <SliderPrimitive.Thumb
          key={index}
          className={cn(
            "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          )}>
          {hoveredThumbIndex && formatLabel && (
            <div
              className={cn(
                {'bottom-8 left-1/2 transform -translate-x-1/2': formatLabelSide === 'top'},
                {'top-8 left-1/2 transform -translate-x-1/2': formatLabelSide === 'bottom'},
                {'right-8 transform -translate-y-1/4': formatLabelSide === 'left'},
                {'left-8 transform -translate-y-1/4': formatLabelSide === 'right'},
                "absolute z-30 rounded-md border bg-popover text-popover-foreground shadow-sm px-2 text-center items-center justify-items-center w-max py-1",
              )}
            >
              {formatLabel(numberStep)}
            </div>
          )}
        </SliderPrimitive.Thumb>
      ))}
    </SliderPrimitive.Root>
  )
})

Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
