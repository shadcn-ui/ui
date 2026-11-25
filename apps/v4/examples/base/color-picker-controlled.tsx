"use client"

import * as React from "react"

import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerHue,
} from "@/styles/base-nova/ui/color-picker"

export default function ColorPickerControlled() {
  const [color, setColor] = React.useState("oklch(0.865 0.127 207.078)")

  return (
    <div className="flex w-full max-w-64 flex-col gap-3">
      <ColorPicker value={color} onValueChange={setColor}>
        <ColorPickerArea aria-label="Accent" />
        <ColorPickerHue />
      </ColorPicker>
      <p className="text-sm text-muted-foreground tabular-nums">{color}</p>
    </div>
  )
}
