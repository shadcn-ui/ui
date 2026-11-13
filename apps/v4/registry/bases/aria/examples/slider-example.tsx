"use client"

import * as React from "react"

import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/aria/components/example"
import { Label } from "@/registry/bases/aria/ui/label"
import { Slider } from "@/registry/bases/aria/ui/slider"

export default function SliderExample() {
  return (
    <ExampleWrapper>
      <SliderBasic />
      <SliderRange />
      <SliderMultiple />
      <SliderVertical />
      <SliderControlled />
      <SliderDisabled />
    </ExampleWrapper>
  )
}

function SliderBasic() {
  return (
    <Example title="Basic">
      <Slider
        aria-label="Basic slider"
        defaultValue={50}
        maxValue={100}
        step={1}
      />
    </Example>
  )
}

function SliderRange() {
  return (
    <Example title="Range">
      <Slider
        aria-label="Range slider"
        defaultValue={[25, 50]}
        maxValue={100}
        step={5}
      />
    </Example>
  )
}

function SliderMultiple() {
  return (
    <Example title="Multiple Thumbs">
      <Slider
        aria-label="Multiple thumbs slider"
        defaultValue={[10, 20, 70]}
        maxValue={100}
        step={10}
      />
    </Example>
  )
}

function SliderVertical() {
  return (
    <Example title="Vertical">
      <div className="flex items-center gap-6">
        <Slider
          aria-label="Vertical slider"
          defaultValue={[50]}
          maxValue={100}
          step={1}
          orientation="vertical"
          className="h-40"
        />
        <Slider
          aria-label="Vertical slider"
          defaultValue={[25]}
          maxValue={100}
          step={1}
          orientation="vertical"
          className="h-40"
        />
      </div>
    </Example>
  )
}

function SliderControlled() {
  const [value, setValue] = React.useState([0.3, 0.7])

  return (
    <Example title="Controlled">
      <div className="grid w-full gap-3">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="slider-demo-temperature">Temperature</Label>
          <span className="text-sm text-muted-foreground">
            {value.join(", ")}
          </span>
        </div>
        <Slider
          aria-label="Controlled slider"
          id="slider-demo-temperature"
          value={value}
          onChange={setValue}
          minValue={0}
          maxValue={1}
          step={0.1}
        />
      </div>
    </Example>
  )
}

function SliderDisabled() {
  return (
    <Example title="Disabled">
      <Slider
        aria-label="Disabled slider"
        defaultValue={[50]}
        maxValue={100}
        step={1}
        isDisabled
      />
    </Example>
  )
}
