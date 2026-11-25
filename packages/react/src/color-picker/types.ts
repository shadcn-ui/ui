import type * as React from "react"

import type { UseRenderComponentProps } from "../use-render"
import type { ColorPickerFormat, HsvaColor } from "./color"

type ColorPickerDirection = "ltr" | "rtl"
type ColorPickerChannel = "hue" | "alpha"

type ColorPickerRootState = {
  disabled: boolean
  invalid: boolean
}

type ColorPickerRootProps = Omit<
  UseRenderComponentProps<"div", ColorPickerRootState>,
  "defaultValue" | "dir" | "onChange"
> & {
  // A hex (#rrggbb, #rrggbbaa) or oklch() string.
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  // The format emitted by onValueChange. Defaults to the format of the value.
  format?: ColorPickerFormat
  disabled?: boolean
  // Submits the value with native forms through a hidden input.
  name?: string
  dir?: ColorPickerDirection
}

type ColorPickerContextValue = {
  color: HsvaColor
  direction: ColorPickerDirection
  disabled: boolean
  format: ColorPickerFormat
  invalid: boolean
  setColor: (color: HsvaColor) => void
  value: string
}

type ColorPickerAreaState = {
  disabled: boolean
  dragging: boolean
  invalid: boolean
}

type ColorPickerAreaValueText = (values: {
  saturation: number
  brightness: number
}) => string

type ColorPickerAreaProps = UseRenderComponentProps<
  "div",
  ColorPickerAreaState
> & {
  // Labels the two hidden range inputs. Defaults to "Color".
  "aria-label"?: string
  "aria-labelledby"?: string
  getAriaValueText?: ColorPickerAreaValueText
}

type ColorPickerAreaContextValue = {
  dragging: boolean
  getInputProps: (axis: "x" | "y") => React.ComponentPropsWithRef<"input">
  thumbStyle: React.CSSProperties
}

type ColorPickerAreaThumbProps = UseRenderComponentProps<
  "div",
  ColorPickerAreaState
>

type ColorPickerSliderState = {
  channel: ColorPickerChannel
  disabled: boolean
  dragging: boolean
  invalid: boolean
}

type ColorPickerSliderProps = UseRenderComponentProps<
  "div",
  ColorPickerSliderState
> & {
  channel: ColorPickerChannel
  // Labels the hidden range input. Defaults to "Hue" or "Alpha".
  "aria-label"?: string
  "aria-labelledby"?: string
  getAriaValueText?: (value: number) => string
}

type ColorPickerSliderContextValue = {
  channel: ColorPickerChannel
  dragging: boolean
  inputProps: React.ComponentPropsWithRef<"input">
  thumbStyle: React.CSSProperties
}

type ColorPickerSliderThumbProps = UseRenderComponentProps<
  "div",
  ColorPickerSliderState
>

type ColorPickerInputState = {
  disabled: boolean
  invalid: boolean
}

type ColorPickerInputProps = Omit<
  UseRenderComponentProps<"input", ColorPickerInputState>,
  "defaultValue" | "type" | "value"
>

type ColorPickerSwatchState = {
  alpha: boolean
}

type ColorPickerEyeDropperState = {
  disabled: boolean
  picking: boolean
}

type ColorPickerEyeDropperProps = Omit<
  UseRenderComponentProps<"button", ColorPickerEyeDropperState>,
  "type"
>

type ColorPickerCopyState = {
  copied: boolean
  disabled: boolean
}

type ColorPickerCopyProps = Omit<
  UseRenderComponentProps<"button", ColorPickerCopyState>,
  "type"
>

// The EyeDropper API is not in TypeScript's DOM lib yet.
type EyeDropperConstructor = new () => {
  open: (options?: { signal?: AbortSignal }) => Promise<{ sRGBHex: string }>
}

type ColorPickerSwatchProps = UseRenderComponentProps<
  "div",
  ColorPickerSwatchState
>

export type {
  ColorPickerAreaContextValue,
  ColorPickerAreaProps,
  ColorPickerAreaState,
  ColorPickerAreaThumbProps,
  ColorPickerAreaValueText,
  ColorPickerChannel,
  ColorPickerContextValue,
  ColorPickerCopyProps,
  ColorPickerCopyState,
  ColorPickerDirection,
  ColorPickerEyeDropperProps,
  ColorPickerEyeDropperState,
  ColorPickerInputProps,
  ColorPickerInputState,
  ColorPickerRootProps,
  ColorPickerRootState,
  ColorPickerSliderContextValue,
  ColorPickerSliderProps,
  ColorPickerSliderState,
  ColorPickerSliderThumbProps,
  ColorPickerSwatchProps,
  ColorPickerSwatchState,
  EyeDropperConstructor,
}
