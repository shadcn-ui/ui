"use client"

import * as React from "react"

import { Label } from "@/styles/aria-nova/ui/label"
import { Slider } from "@/styles/aria-nova/ui/slider"

export function SliderControlled() {
  const [value, setValue] = React.useState([0.3, 0.7])

  return (
    <div className="mx-auto grid w-full max-w-xs gap-3">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor="slider-demo-temperature">Temperature</Label>
        <span className="text-sm text-muted-foreground">
          {value.join(", ")}
        </span>
      </div>
      <Slider
        aria-label="Temperature"
        id="slider-demo-temperature"
        value={value}
        onChange={(value) => setValue(value as number[])}
        minValue={0}
        maxValue={1}
        step={0.1}
      />
    </div>
  )
}
