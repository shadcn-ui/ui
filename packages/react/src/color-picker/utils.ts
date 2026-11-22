import type * as React from "react"

import { toCssColor, type HsvaColor } from "./color"
import type { ColorPickerChannel, ColorPickerDirection } from "./types"

const VISUALLY_HIDDEN_STYLE: React.CSSProperties = {
  border: 0,
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  margin: -1,
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  whiteSpace: "nowrap",
  width: 1,
}

// Transparent squares show the element's own background color. Styles can
// recolor the dark squares with --color-picker-checkerboard.
const CHECKERBOARD =
  "repeating-conic-gradient(var(--color-picker-checkerboard, #cccccc) 0 25%, transparent 0 50%)"
const CHECKERBOARD_SIZE = "8px 8px"

const CHANNEL_RANGE: Record<
  ColorPickerChannel,
  { max: number; page: number; step: number }
> = {
  alpha: { max: 100, page: 10, step: 1 },
  hue: { max: 360, page: 10, step: 1 },
}

// Hue stops for a full HSV turn at full saturation and brightness.
const HUE_STOPS = [0, 60, 120, 180, 240, 300, 360]

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function isAriaInvalid(value: React.AriaAttributes["aria-invalid"]) {
  return value !== undefined && value !== false && value !== "false"
}

function isSameColor(first: HsvaColor, second: HsvaColor) {
  return (
    first.h === second.h &&
    first.s === second.s &&
    first.v === second.v &&
    first.a === second.a
  )
}

// Black and grays have no hue, and black has no saturation either. Keep the
// previous values so the area and hue slider don't jump.
function preserveHue(previous: HsvaColor, next: HsvaColor): HsvaColor {
  if (next.v === 0) {
    return { ...next, h: previous.h, s: previous.s }
  }

  if (next.s === 0) {
    return { ...next, h: previous.h }
  }

  return next
}

// Browsers throw for a pointer that is not active, which is the case for
// synthetic events dispatched in tests.
function capturePointer(element: HTMLElement, pointerId: number) {
  try {
    element.setPointerCapture?.(pointerId)
  } catch {
    // Dragging still works while the pointer stays over the element.
  }
}

function releasePointer(element: HTMLElement, pointerId: number) {
  if (element.hasPointerCapture?.(pointerId)) {
    element.releasePointerCapture(pointerId)
  }
}

function getPointerRatio(
  event: { clientX: number; clientY: number },
  element: HTMLElement,
  direction: ColorPickerDirection
) {
  const rect = element.getBoundingClientRect()
  const x =
    rect.width > 0 ? clamp((event.clientX - rect.left) / rect.width, 0, 1) : 0
  const y =
    rect.height > 0 ? clamp((event.clientY - rect.top) / rect.height, 0, 1) : 0

  return { x: direction === "rtl" ? 1 - x : x, y }
}

// Keeps keyboard changes on whole percents of a 0-1 value.
function stepRatio(value: number, delta: number) {
  return clamp(Math.round(value * 100) + delta, 0, 100) / 100
}

function getChannelValue(color: HsvaColor, channel: ColorPickerChannel) {
  return channel === "hue" ? color.h : color.a * 100
}

function setChannelValue(
  color: HsvaColor,
  channel: ColorPickerChannel,
  value: number
): HsvaColor {
  const { max } = CHANNEL_RANGE[channel]
  const next = clamp(value, 0, max)

  return channel === "hue" ? { ...color, h: next } : { ...color, a: next / max }
}

function getAreaBackground(color: HsvaColor, direction: ColorPickerDirection) {
  const hue = toCssColor({ h: color.h, s: 1, v: 1 })
  const towardSaturated = direction === "rtl" ? "left" : "right"

  return `linear-gradient(to top, #000000, transparent), linear-gradient(to ${towardSaturated}, #ffffff, ${hue})`
}

function getSliderBackground(
  color: HsvaColor,
  channel: ColorPickerChannel,
  direction: ColorPickerDirection
): React.CSSProperties {
  const towardMax = direction === "rtl" ? "left" : "right"

  if (channel === "hue") {
    const stops = HUE_STOPS.map((hue) => toCssColor({ h: hue, s: 1, v: 1 }))

    return {
      backgroundImage: `linear-gradient(to ${towardMax}, ${stops.join(", ")})`,
    }
  }

  return {
    backgroundImage: `linear-gradient(to ${towardMax}, ${toCssColor(color, 0)}, ${toCssColor(color, 1)}), ${CHECKERBOARD}`,
    backgroundSize: `auto, ${CHECKERBOARD_SIZE}`,
  }
}

function getSwatchBackground(color: HsvaColor): React.CSSProperties {
  const css = toCssColor(color, color.a)

  return {
    backgroundImage: `linear-gradient(${css}, ${css}), ${CHECKERBOARD}`,
    backgroundSize: `auto, ${CHECKERBOARD_SIZE}`,
  }
}

export {
  CHANNEL_RANGE,
  VISUALLY_HIDDEN_STYLE,
  capturePointer,
  clamp,
  getAreaBackground,
  getChannelValue,
  getPointerRatio,
  getSliderBackground,
  getSwatchBackground,
  isAriaInvalid,
  isSameColor,
  preserveHue,
  releasePointer,
  setChannelValue,
  stepRatio,
}
