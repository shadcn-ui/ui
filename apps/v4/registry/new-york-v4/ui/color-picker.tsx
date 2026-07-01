"use client"

import * as React from "react"
import ColorStrip from "react-color-strip"

import { cn } from "@/lib/utils"

type ColorValue = {
  hex: string
  rgb: { r: number; g: number; b: number }
  hsl: { h: number; s: number; l: number }
}

interface ColorPickerProps {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onChangeComplete?: (value: string) => void
  disabled?: boolean
  showShade?: boolean
  className?: string
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  let h = 0
  let s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100
  l /= 100
  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  const toHex = (x: number) =>
    Math.round(255 * x)
      .toString(16)
      .padStart(2, "0")
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`
}

const POINTER_STYLE = {
  width: 14,
  height: 14,
  backgroundColor: "white",
  border: "1.5px solid hsl(var(--border))",
  borderRadius: "50%",
  boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.15), 0 0 0 1px rgb(0 0 0 / 0.04)",
  scaleOnDrag: true,
  dragScale: 1.15,
}

function ColorPicker({
  value,
  defaultValue = "#ef4444",
  onChange,
  onChangeComplete,
  disabled = false,
  showShade = false,
  className,
}: ColorPickerProps) {
  const [internalColor, setInternalColor] = React.useState(value ?? defaultValue)

  const containerRef = React.useRef<HTMLDivElement>(null)
  const [stripWidth, setStripWidth] = React.useState(300)

  React.useLayoutEffect(() => {
    if (containerRef.current) {
      setStripWidth(containerRef.current.offsetWidth)
    }
  }, [])

  React.useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      setStripWidth(Math.floor(entry.contentRect.width))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const currentColor = value ?? internalColor
  const { h } = hexToHsl(currentColor)
  const hueColor = hslToHex(h, 100, 50)

  const handleHueChange = (colorVal: ColorValue) => {
    const pureHue = hslToHex(colorVal.hsl.h, 100, 50)
    if (value === undefined) setInternalColor(pureHue)
    onChange?.(pureHue)
  }

  const handleHueChangeComplete = (colorVal: ColorValue) => {
    const pureHue = hslToHex(colorVal.hsl.h, 100, 50)
    if (value === undefined) setInternalColor(pureHue)
    onChangeComplete?.(pureHue)
  }

  const handleShadeChange = (colorVal: ColorValue) => {
    if (value === undefined) setInternalColor(colorVal.hex)
    onChange?.(colorVal.hex)
  }

  const handleShadeChangeComplete = (colorVal: ColorValue) => {
    if (value === undefined) setInternalColor(colorVal.hex)
    onChangeComplete?.(colorVal.hex)
  }

  return (
    <div ref={containerRef} className={cn("flex w-full flex-col gap-3", className)}>
      <ColorStrip
        value={hueColor}
        width={stripWidth}
        height={12}
        rounded={6}
        disabled={disabled}
        pointer={POINTER_STYLE}
        onChange={handleHueChange}
        onChangeComplete={handleHueChangeComplete}
      />
      {showShade && (
        <ColorStrip
          value={currentColor}
          customColor={hueColor}
          width={stripWidth}
          height={12}
          rounded={6}
          disabled={disabled}
          pointer={POINTER_STYLE}
          onChange={handleShadeChange}
          onChangeComplete={handleShadeChangeComplete}
        />
      )}
    </div>
  )
}

export { ColorPicker }
export type { ColorPickerProps, ColorValue }
