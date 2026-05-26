"use client"

import * as React from "react"
import {
  Progress,
  ProgressRange,
  ProgressTrack,
} from "@/examples/ark/ui/progress"
import {
  Slider,
  SliderControl,
  SliderRange,
  SliderThumb,
  SliderTrack,
} from "@/examples/ark/ui/slider"

export function ProgressControlled() {
  const [value, setValue] = React.useState([50])

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Progress value={value[0]}>
        <ProgressTrack>
          <ProgressRange />
        </ProgressTrack>
      </Progress>
      <Slider
        value={value}
        onValueChange={(details) => setValue(details.value)}
        min={0}
        max={100}
        step={1}
      >
        <SliderControl>
          <SliderTrack>
            <SliderRange />
          </SliderTrack>
          <SliderThumb index={0} />
        </SliderControl>
      </Slider>
    </div>
  )
}
