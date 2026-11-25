"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/styles/radix-nova/ui/button"
import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerHue,
  ColorPickerInput,
  ColorPickerSwatch,
} from "@/styles/radix-nova/ui/color-picker"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/styles/radix-nova/ui/popover"

export default function ColorPickerPopover() {
  const [color, setColor] = React.useState("#3b82f6")

  return (
    <ColorPicker value={color} onValueChange={setColor} className="w-fit">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <ColorPickerSwatch
              data-icon="inline-start"
              aria-hidden="true"
              className="size-4"
            />
            {color}
            <ChevronDownIcon data-icon="inline-end" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <ColorPickerArea />
          <ColorPickerHue />
          <ColorPickerInput aria-label="Color value" />
        </PopoverContent>
      </Popover>
    </ColorPicker>
  )
}
