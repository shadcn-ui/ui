"use client"

import * as React from "react"

import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerHue,
  ColorPickerInput,
  ColorPickerSwatch,
} from "@/styles/aria-nova/ui/color-picker"
import { Field, FieldLabel } from "@/styles/aria-nova/ui/field"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/styles/aria-nova/ui/toggle-group"

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
        disallowEmptySelection
        selectedKeys={[format]}
        onSelectionChange={(keys) => {
          const [key] = [...keys]

          if (key) {
            setFormat(key as ColorFormat)
          }
        }}
      >
        <ToggleGroupItem id="hex">HEX</ToggleGroupItem>
        <ToggleGroupItem id="oklch">OKLCH</ToggleGroupItem>
      </ToggleGroup>
    </Field>
  )
}
