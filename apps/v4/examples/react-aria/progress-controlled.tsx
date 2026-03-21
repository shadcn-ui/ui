"use client"

import * as React from "react"
import { Progress } from "@/examples/react-aria/ui/progress"
import { Slider } from "@/examples/react-aria/ui/slider"

export function ProgressControlled() {
  const [value, setValue] = React.useState(50)

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Progress value={value} className="w-full" />
      <Slider
        value={value}
        onChange={(value) => setValue(value as number)}
        minValue={0}
        maxValue={100}
        step={1}
      />
    </div>
  )
}
