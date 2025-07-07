"use client"

import * as React from "react"

import { Label } from "@/registry/new-york-v4/ui/label"
import { Slider } from "@/registry/new-york-v4/ui/slider"

export function SliderDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col flex-wrap gap-6 md:flex-row">
      <Slider defaultValue={[50]} max={100} step={1} />
      <Slider defaultValue={[25, 50]} max={100} step={1} />
      <Slider defaultValue={[10, 20]} max={100} step={10} />
      <div className="flex w-full items-center gap-6">
        <Slider defaultValue={[50]} max={100} step={1} orientation="vertical" />
        <Slider defaultValue={[25]} max={100} step={1} orientation="vertical" />
      </div>
      <SliderControlled />
    </div>
  )
}

function SliderControlled() {
  const [value, setValue] = React.useState([0.3, 0.7])

  return (
    <div className="grid w-full gap-3">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor="slider-demo-temperature">Temperature</Label>
        <span className="text-muted-foreground text-sm">
          {value.join(", ")}
        </span>
      </div>
      <Slider
        id="slider-demo-temperature"
        value={value}
        onValueChange={setValue}
        min={0}
        max={1}
        step={0.1}
      />
    </div>
  )
}
