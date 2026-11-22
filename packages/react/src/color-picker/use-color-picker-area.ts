import * as React from "react"

import { useColorPickerContext } from "./context"
import type {
  ColorPickerAreaContextValue,
  ColorPickerAreaProps,
  ColorPickerAreaValueText,
} from "./types"
import {
  capturePointer,
  getAreaBackground,
  getPointerRatio,
  releasePointer,
  stepRatio,
} from "./utils"

const STEP = 1
const PAGE_STEP = 10

const defaultGetAriaValueText: ColorPickerAreaValueText = ({
  brightness,
  saturation,
}) => `Saturation ${saturation}%, Brightness ${brightness}%`

type UseColorPickerAreaOptions = Pick<
  ColorPickerAreaProps,
  "aria-label" | "aria-labelledby" | "getAriaValueText"
>

function useColorPickerArea({
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  getAriaValueText = defaultGetAriaValueText,
}: UseColorPickerAreaOptions) {
  const { color, direction, disabled, invalid, setColor } =
    useColorPickerContext("ColorPicker.Area")
  const xInputRef = React.useRef<HTMLInputElement>(null)
  const yInputRef = React.useRef<HTMLInputElement>(null)
  const draggingRef = React.useRef(false)
  const [dragging, setDragging] = React.useState(false)

  const updateFromPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const { x, y } = getPointerRatio(event, event.currentTarget, direction)

    setColor({ ...color, s: x, v: 1 - y })
  }

  const stopDragging = () => {
    draggingRef.current = false
    setDragging(false)
  }

  const areaProps: React.ComponentPropsWithRef<"div"> = {
    style: {
      backgroundImage: getAreaBackground(color, direction),
      position: "relative",
      touchAction: "none",
    },
    onPointerDown(event) {
      if (disabled || event.button !== 0) {
        return
      }

      // Keep focus on the hidden input instead of the area or page.
      event.preventDefault()
      capturePointer(event.currentTarget, event.pointerId)
      draggingRef.current = true
      setDragging(true)
      updateFromPointer(event)
      xInputRef.current?.focus({ preventScroll: true })
    },
    onPointerMove(event) {
      if (draggingRef.current) {
        updateFromPointer(event)
      }
    },
    onPointerUp(event) {
      if (draggingRef.current) {
        releasePointer(event.currentTarget, event.pointerId)
        stopDragging()
      }
    },
    onPointerCancel: stopDragging,
    onLostPointerCapture: stopDragging,
  }

  // Mirrors React Aria's ColorArea: arrows step, Shift and Page keys take a
  // page step, Home and End move saturation, and RTL flips the x axis.
  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const step = event.shiftKey ? PAGE_STEP : STEP
    const forward = direction === "rtl" ? -1 : 1
    let { s, v } = color
    let axis: "x" | "y"

    switch (event.key) {
      case "ArrowRight":
        s = stepRatio(s, step * forward)
        axis = "x"
        break
      case "ArrowLeft":
        s = stepRatio(s, -step * forward)
        axis = "x"
        break
      case "End":
        s = stepRatio(s, PAGE_STEP * forward)
        axis = "x"
        break
      case "Home":
        s = stepRatio(s, -PAGE_STEP * forward)
        axis = "x"
        break
      case "ArrowUp":
        v = stepRatio(v, step)
        axis = "y"
        break
      case "ArrowDown":
        v = stepRatio(v, -step)
        axis = "y"
        break
      case "PageUp":
        v = stepRatio(v, PAGE_STEP)
        axis = "y"
        break
      case "PageDown":
        v = stepRatio(v, -PAGE_STEP)
        axis = "y"
        break
      default:
        return
    }

    event.preventDefault()
    setColor({ ...color, s, v })

    // Focus follows the changed axis so screen readers announce it.
    const input = axis === "x" ? xInputRef.current : yInputRef.current

    if (input && document.activeElement !== input) {
      input.focus()
    }
  }

  const getInputProps = (
    axis: "x" | "y"
  ): React.ComponentPropsWithRef<"input"> => {
    const saturation = Math.round(color.s * 100)
    const brightness = Math.round(color.v * 100)

    return {
      "aria-invalid": invalid || undefined,
      "aria-label": ariaLabel ?? (ariaLabelledBy ? undefined : "Color"),
      "aria-labelledby": ariaLabelledBy,
      "aria-orientation": axis === "x" ? "horizontal" : "vertical",
      "aria-roledescription": "2D slider",
      "aria-valuetext": getAriaValueText({ brightness, saturation }),
      disabled,
      max: 100,
      min: 0,
      onChange(event) {
        const next = event.currentTarget.valueAsNumber / 100

        setColor(axis === "x" ? { ...color, s: next } : { ...color, v: next })
      },
      onKeyDown: onInputKeyDown,
      ref: axis === "x" ? xInputRef : yInputRef,
      step: 1,
      // One tab stop: the y input only takes focus from vertical keys.
      tabIndex: axis === "x" ? undefined : -1,
      type: "range",
      value: axis === "x" ? saturation : brightness,
    }
  }

  const x = direction === "rtl" ? 1 - color.s : color.s
  const context: ColorPickerAreaContextValue = {
    dragging,
    getInputProps,
    thumbStyle: {
      left: `${x * 100}%`,
      position: "absolute",
      top: `${(1 - color.v) * 100}%`,
      transform: "translate(-50%, -50%)",
    },
  }

  return { areaProps, context, dragging }
}

export { useColorPickerArea }
