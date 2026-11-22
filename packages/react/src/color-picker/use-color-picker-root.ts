import * as React from "react"

import {
  formatColor,
  getColorFormat,
  parseColor,
  type ColorPickerFormat,
  type HsvaColor,
} from "./color"
import type {
  ColorPickerContextValue,
  ColorPickerDirection,
  ColorPickerRootProps,
} from "./types"
import { isSameColor, preserveHue } from "./utils"

const FALLBACK_VALUE = "#000000"
const FALLBACK_COLOR: HsvaColor = { h: 0, s: 0, v: 0, a: 1 }

type UseColorPickerRootOptions = Pick<
  ColorPickerRootProps,
  "defaultValue" | "dir" | "format" | "onValueChange" | "value"
> & {
  disabled: boolean
  invalid: boolean
}

// The value string is the source of truth. `internal.source` records which
// string `internal.color` was derived from, so the HSV color (which keeps hue
// for grays) is only re-derived when the value changes from outside.
function useColorPickerRoot({
  defaultValue,
  dir,
  disabled,
  format: formatProp,
  invalid,
  onValueChange,
  value,
}: UseColorPickerRootOptions) {
  const isControlled = value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    defaultValue ?? FALLBACK_VALUE
  )
  const currentValue = isControlled ? value : uncontrolledValue
  const format: ColorPickerFormat =
    formatProp ?? getColorFormat(currentValue) ?? "hex"

  const [internal, setInternal] = React.useState(() => ({
    color: parseColor(currentValue) ?? FALLBACK_COLOR,
    source: currentValue,
  }))
  let color = internal.color

  if (internal.source !== currentValue) {
    const parsed = parseColor(currentValue)

    color = parsed ? preserveHue(internal.color, parsed) : internal.color
    setInternal({ color, source: currentValue })
  }

  // Show the value as given until the user changes it, so a token such as
  // oklch(0.985 0.001 106.423) is never rewritten by rounding.
  const displayValue =
    getColorFormat(currentValue) === format && parseColor(currentValue)
      ? currentValue
      : formatColor(color, format)

  const rootRef = React.useRef<HTMLDivElement>(null)
  const [detectedDirection, setDetectedDirection] =
    React.useState<ColorPickerDirection>("ltr")
  const direction = dir ?? detectedDirection

  React.useLayoutEffect(() => {
    if (dir || !rootRef.current) {
      return
    }

    setDetectedDirection(
      getComputedStyle(rootRef.current).direction === "rtl" ? "rtl" : "ltr"
    )
  }, [dir])

  const setColor = React.useCallback(
    (next: HsvaColor) => {
      if (disabled || isSameColor(color, next)) {
        return
      }

      const nextValue = formatColor(next, format)

      setInternal({ color: next, source: nextValue })

      if (!isControlled) {
        setUncontrolledValue(nextValue)
      }

      if (nextValue !== currentValue) {
        onValueChange?.(nextValue)
      }
    },
    [color, currentValue, disabled, format, isControlled, onValueChange]
  )

  const context = React.useMemo<ColorPickerContextValue>(
    () => ({
      color,
      direction,
      disabled,
      format,
      invalid,
      setColor,
      value: displayValue,
    }),
    [color, direction, disabled, displayValue, format, invalid, setColor]
  )

  return { context, rootRef }
}

export { useColorPickerRoot }
