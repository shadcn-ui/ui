import * as RadixProgress from "@radix-ui/react-progress"
import { forwardRef } from "react"
import type { ComponentPropsWithoutRef, ElementRef } from "react"

import "../../tokens.css"
import "./Progress.css"

export type ProgressSize = "sm" | "md" | "lg"
export type ProgressVariant = "default" | "success" | "warning" | "danger"

export interface ProgressProps
  extends Omit<
    ComponentPropsWithoutRef<typeof RadixProgress.Root>,
    "asChild"
  > {
  size?: ProgressSize
  variant?: ProgressVariant
}

export const Progress = forwardRef<
  ElementRef<typeof RadixProgress.Root>,
  ProgressProps
>(function Progress(
  {
    size = "md",
    variant = "default",
    value,
    max = 100,
    className,
    ...rest
  },
  ref
) {
  const isIndeterminate = value === null || value === undefined
  const percent = isIndeterminate
    ? 0
    : Math.max(0, Math.min(100, (value / max) * 100))
  const classes = ["lead-Progress", className].filter(Boolean).join(" ")
  return (
    <RadixProgress.Root
      ref={ref}
      {...rest}
      value={value}
      max={max}
      className={classes}
      data-size={size}
      data-variant={variant}
    >
      <RadixProgress.Indicator
        className="lead-Progress__indicator"
        style={
          isIndeterminate
            ? undefined
            : { transform: `translateX(-${100 - percent}%)` }
        }
      />
    </RadixProgress.Root>
  )
})
