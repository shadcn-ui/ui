"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/styles/aria-nova/ui/button"
import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerHue,
  ColorPickerInput,
  ColorPickerSwatch,
} from "@/styles/aria-nova/ui/color-picker"
import { Popover, PopoverTrigger } from "@/styles/aria-nova/ui/popover"

export default function ColorPickerPopover() {
  const [color, setColor] = React.useState("#3b82f6")

  return (
    <ColorPicker value={color} onValueChange={setColor} className="w-fit">
      <PopoverTrigger>
        <Button variant="outline">
          <ColorPickerSwatch
            data-icon="inline-start"
            aria-hidden="true"
            className="size-4"
          />
          {color}
          <ChevronDownIcon data-icon="inline-end" />
        </Button>
        <Popover className="w-64">
          <ColorPickerArea />
          <ColorPickerHue />
          <ColorPickerInput aria-label="Color value" />
        </Popover>
      </PopoverTrigger>
    </ColorPicker>
  )
}
