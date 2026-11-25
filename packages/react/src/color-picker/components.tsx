import * as React from "react"

import { composeRefs, mergeProps, useRender } from "../use-render"
import {
  ColorPickerAreaContext,
  ColorPickerContext,
  ColorPickerSliderContext,
  useColorPickerAreaContext,
  useColorPickerContext,
  useColorPickerSliderContext,
} from "./context"
import type {
  ColorPickerAreaProps,
  ColorPickerAreaThumbProps,
  ColorPickerCopyProps,
  ColorPickerEyeDropperProps,
  ColorPickerInputProps,
  ColorPickerRootProps,
  ColorPickerSliderProps,
  ColorPickerSliderThumbProps,
  ColorPickerSwatchProps,
} from "./types"
import { useColorPickerArea } from "./use-color-picker-area"
import { useColorPickerCopy } from "./use-color-picker-copy"
import { useColorPickerEyeDropper } from "./use-color-picker-eye-dropper"
import { useColorPickerInput } from "./use-color-picker-input"
import { useColorPickerRoot } from "./use-color-picker-root"
import { useColorPickerSlider } from "./use-color-picker-slider"
import {
  getSwatchBackground,
  isAriaInvalid,
  VISUALLY_HIDDEN_STYLE,
} from "./utils"

function ColorPickerRoot({
  "aria-invalid": ariaInvalid,
  children,
  defaultValue,
  dir,
  disabled = false,
  format,
  name,
  onValueChange,
  ref,
  render,
  value,
  ...props
}: ColorPickerRootProps) {
  const invalid = isAriaInvalid(ariaInvalid)
  const { context, rootRef } = useColorPickerRoot({
    defaultValue,
    dir,
    disabled,
    format,
    invalid,
    onValueChange,
    value,
  })
  // aria-invalid is not valid on a group, so it goes to the controls instead.
  const element = useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        "aria-disabled": disabled || undefined,
        children: (
          <>
            {children}
            {name === undefined ? null : (
              <input
                disabled={disabled}
                name={name}
                type="hidden"
                value={context.value}
              />
            )}
          </>
        ),
        dir,
        ref: composeRefs(rootRef, ref),
        role: "group",
      },
      props
    ),
    render,
    state: { disabled, invalid },
  })

  return (
    <ColorPickerContext.Provider value={context}>
      {element}
    </ColorPickerContext.Provider>
  )
}

function ColorPickerArea({
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  getAriaValueText,
  render,
  ...props
}: ColorPickerAreaProps) {
  const { disabled, invalid } = useColorPickerContext("ColorPicker.Area")
  const { areaProps, context, dragging } = useColorPickerArea({
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    getAriaValueText,
  })
  const element = useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(areaProps, props),
    render,
    state: { disabled, dragging, invalid },
  })

  return (
    <ColorPickerAreaContext.Provider value={context}>
      {element}
    </ColorPickerAreaContext.Provider>
  )
}

function ColorPickerAreaThumb({
  children,
  render,
  ...props
}: ColorPickerAreaThumbProps) {
  const { disabled, invalid } = useColorPickerContext("ColorPicker.AreaThumb")
  const { dragging, getInputProps, thumbStyle } = useColorPickerAreaContext(
    "ColorPicker.AreaThumb"
  )

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        children: (
          <>
            {children}
            <input {...getInputProps("x")} style={VISUALLY_HIDDEN_STYLE} />
            <input {...getInputProps("y")} style={VISUALLY_HIDDEN_STYLE} />
          </>
        ),
        style: thumbStyle,
      },
      props
    ),
    render,
    state: { disabled, dragging, invalid },
  })
}

function ColorPickerSlider({
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  channel,
  getAriaValueText,
  render,
  ...props
}: ColorPickerSliderProps) {
  const { disabled, invalid } = useColorPickerContext("ColorPicker.Slider")
  const { context, dragging, sliderProps } = useColorPickerSlider({
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    channel,
    getAriaValueText,
  })
  const element = useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(sliderProps, props),
    render,
    state: { channel, disabled, dragging, invalid },
  })

  return (
    <ColorPickerSliderContext.Provider value={context}>
      {element}
    </ColorPickerSliderContext.Provider>
  )
}

function ColorPickerSliderThumb({
  children,
  render,
  ...props
}: ColorPickerSliderThumbProps) {
  const { disabled, invalid } = useColorPickerContext("ColorPicker.SliderThumb")
  const { channel, dragging, inputProps, thumbStyle } =
    useColorPickerSliderContext("ColorPicker.SliderThumb")

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        children: (
          <>
            {children}
            <input {...inputProps} style={VISUALLY_HIDDEN_STYLE} />
          </>
        ),
        style: thumbStyle,
      },
      props
    ),
    render,
    state: { channel, disabled, dragging, invalid },
  })
}

function ColorPickerInput({ render, ...props }: ColorPickerInputProps) {
  const { disabled, invalid } = useColorPickerContext("ColorPicker.Input")
  const { inputProps } = useColorPickerInput()

  return useRender({
    defaultTagName: "input",
    props: mergeProps<"input">(inputProps, props),
    render,
    state: { disabled, invalid },
  })
}

function ColorPickerCopy({ children, render, ...props }: ColorPickerCopyProps) {
  const { buttonProps, copied, disabled } = useColorPickerCopy()

  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        ...buttonProps,
        children: (
          <>
            {children}
            <span aria-live="polite" style={VISUALLY_HIDDEN_STYLE}>
              {copied ? "Copied" : ""}
            </span>
          </>
        ),
      },
      props
    ),
    render,
    state: { copied, disabled },
  })
}

function ColorPickerEyeDropper({
  render,
  ...props
}: ColorPickerEyeDropperProps) {
  const { buttonProps, disabled, picking, supported } =
    useColorPickerEyeDropper()
  const element = useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(buttonProps, props),
    render,
    state: { disabled, picking },
  })

  return supported ? element : null
}

function ColorPickerSwatch({ render, ...props }: ColorPickerSwatchProps) {
  const { color, value } = useColorPickerContext("ColorPicker.Swatch")

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        "aria-label": value,
        role: "img",
        style: getSwatchBackground(color),
      },
      props
    ),
    render,
    state: { alpha: color.a < 1 },
  })
}

export {
  ColorPickerArea,
  ColorPickerAreaThumb,
  ColorPickerCopy,
  ColorPickerEyeDropper,
  ColorPickerInput,
  ColorPickerRoot,
  ColorPickerSlider,
  ColorPickerSliderThumb,
  ColorPickerSwatch,
}
