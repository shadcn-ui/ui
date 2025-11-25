"use client"

import * as React from "react"

import { Label } from "@/registry/bases/radix/ui/label"
import { Slider } from "@/registry/bases/radix/ui/slider"
import Frame from "@/app/(design)/design/components/frame"

export default function SliderExample() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-6 lg:p-12">
      <div className="flex w-full max-w-lg flex-col gap-12">
        <SliderBasic />
        <SliderRange />
        <SliderMultiple />
        <SliderVertical />
        <SliderControlled />
        <SliderDisabled />
      </div>
    </div>
  )
}

function SliderBasic() {
  return (
    <Frame title="Basic">
      <Slider defaultValue={[50]} max={100} step={1} />
    </Frame>
  )
}

function SliderRange() {
  return (
    <Frame title="Range">
      <Slider defaultValue={[25, 50]} max={100} step={5} />
    </Frame>
  )
}

function SliderMultiple() {
  return (
    <Frame title="Multiple Thumbs">
      <Slider defaultValue={[10, 20, 70]} max={100} step={10} />
    </Frame>
  )
}

function SliderVertical() {
  return (
    <Frame title="Vertical">
      <div className="flex items-center gap-6">
        <Slider
          defaultValue={[50]}
          max={100}
          step={1}
          orientation="vertical"
          className="h-40"
        />
        <Slider
          defaultValue={[25]}
          max={100}
          step={1}
          orientation="vertical"
          className="h-40"
        />
      </div>
    </Frame>
  )
}

function SliderControlled() {
  const [value, setValue] = React.useState([0.3, 0.7])

  return (
    <Frame title="Controlled">
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
    </Frame>
  )
}

function SliderDisabled() {
  return (
    <Frame title="Disabled">
      <Slider defaultValue={[50]} max={100} step={1} disabled />
    </Frame>
  )
}
