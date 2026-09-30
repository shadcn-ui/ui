"use client"

import * as React from "react"

import { Progress } from "@/styles/aria-nova/ui/progress"
import { Slider } from "@/styles/aria-nova/ui/slider"

export function ProgressControlled() {
  const [value, setValue] = React.useState(50)

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Progress aria-label="Loading" value={value} className="w-full" />
      <Slider
        aria-label="Progress"
        value={value}
        onChange={(value) => setValue(value as number)}
        minValue={0}
        maxValue={100}
        step={1}
      />
    </div>
  )
}
