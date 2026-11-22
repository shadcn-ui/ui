"use client"

import * as React from "react"

import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerHue,
  ColorPickerInput,
  ColorPickerSwatch,
} from "@/styles/base-nova/ui/color-picker"
import { Field, FieldLabel } from "@/styles/base-nova/ui/field"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/styles/base-nova/ui/toggle-group"

type ColorFormat = "hex" | "oklch"

export default function ColorPickerFormat() {
  const [format, setFormat] = React.useState<ColorFormat>("oklch")

  return (
    <Field className="max-w-64">
      <FieldLabel htmlFor="color-picker-format">Primary</FieldLabel>
      <ColorPicker defaultValue="oklch(0.546 0.245 262.881)" format={format}>
        <ColorPickerArea />
        <ColorPickerHue />
        <div className="flex items-center gap-2">
          <ColorPickerSwatch />
          <ColorPickerInput id="color-picker-format" />
        </div>
      </ColorPicker>
      <ToggleGroup
        aria-label="Color format"
        variant="outline"
        size="sm"
        value={[format]}
        onValueChange={(value) => {
          if (value[0]) {
            setFormat(value[0] as ColorFormat)
          }
        }}
      >
        <ToggleGroupItem value="hex">HEX</ToggleGroupItem>
        <ToggleGroupItem value="oklch">OKLCH</ToggleGroupItem>
      </ToggleGroup>
    </Field>
  )
}
