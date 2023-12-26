import * as React from "react"

import { Slider } from "@/registry/new-york/ui/slider"

export default function SliderHorizontalDemo() {
  return (
    <Slider
      className="h-52"
      defaultValue={[33]}
      max={100}
      step={1}
      orientation="vertical"
    />
  )
}
