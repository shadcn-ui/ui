import * as React from "react"

import { useColorPickerContext } from "./context"
import type {
  ColorPickerChannel,
  ColorPickerSliderContextValue,
  ColorPickerSliderProps,
} from "./types"
import {
  capturePointer,
  CHANNEL_RANGE,
  clamp,
  getChannelValue,
  getPointerRatio,
  getSliderBackground,
  releasePointer,
  setChannelValue,
} from "./utils"

const DEFAULT_LABEL: Record<ColorPickerChannel, string> = {
  alpha: "Alpha",
  hue: "Hue",
}

function defaultGetAriaValueText(channel: ColorPickerChannel) {
  return (value: number) =>
    channel === "hue" ? `${Math.round(value)}°` : `${Math.round(value)}%`
}

type UseColorPickerSliderOptions = Pick<
  ColorPickerSliderProps,
  "aria-label" | "aria-labelledby" | "channel" | "getAriaValueText"
>

function useColorPickerSlider({
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  channel,
  getAriaValueText = defaultGetAriaValueText(channel),
}: UseColorPickerSliderOptions) {
  const { color, direction, disabled, invalid, setColor } =
    useColorPickerContext("ColorPicker.Slider")
  const { max, page, step } = CHANNEL_RANGE[channel]
  const value = getChannelValue(color, channel)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const draggingRef = React.useRef(false)
  const [dragging, setDragging] = React.useState(false)

  const setValue = (next: number) => {
    setColor(setChannelValue(color, channel, next))
  }

  const updateFromPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    setValue(getPointerRatio(event, event.currentTarget, direction).x * max)
  }

  const stopDragging = () => {
    draggingRef.current = false
    setDragging(false)
  }

  const sliderProps: React.ComponentPropsWithRef<"div"> = {
    style: {
      ...getSliderBackground(color, channel, direction),
      position: "relative",
      touchAction: "none",
    },
    onPointerDown(event) {
      if (disabled || event.button !== 0) {
        return
      }

      event.preventDefault()
      capturePointer(event.currentTarget, event.pointerId)
      draggingRef.current = true
      setDragging(true)
      updateFromPointer(event)
      inputRef.current?.focus({ preventScroll: true })
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

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const delta = event.shiftKey ? page : step
    const forward = direction === "rtl" ? -1 : 1
    const current = Math.round(value)
    let next: number

    switch (event.key) {
      case "ArrowRight":
        next = current + delta * forward
        break
      case "ArrowLeft":
        next = current - delta * forward
        break
      case "ArrowUp":
        next = current + delta
        break
      case "ArrowDown":
        next = current - delta
        break
      case "PageUp":
        next = current + page
        break
      case "PageDown":
        next = current - page
        break
      case "Home":
        next = 0
        break
      case "End":
        next = max
        break
      default:
        return
    }

    event.preventDefault()
    setValue(clamp(next, 0, max))
  }

  const inputProps: React.ComponentPropsWithRef<"input"> = {
    "aria-invalid": invalid || undefined,
    "aria-label":
      ariaLabel ?? (ariaLabelledBy ? undefined : DEFAULT_LABEL[channel]),
    "aria-labelledby": ariaLabelledBy,
    "aria-valuetext": getAriaValueText(value),
    disabled,
    max,
    min: 0,
    onChange(event) {
      setValue(event.currentTarget.valueAsNumber)
    },
    onKeyDown,
    ref: inputRef,
    step,
    type: "range",
    value: Math.round(value),
  }

  const ratio = value / max
  const x = direction === "rtl" ? 1 - ratio : ratio
  const context: ColorPickerSliderContextValue = {
    channel,
    dragging,
    inputProps,
    thumbStyle: {
      left: `${x * 100}%`,
      position: "absolute",
      top: "50%",
      transform: "translate(-50%, -50%)",
    },
  }

  return { context, dragging, sliderProps, value }
}

export { useColorPickerSlider }
