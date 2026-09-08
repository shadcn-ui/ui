"use client"

import * as React from "react"
import { useState } from "react"
import { CircularProgress } from "@/registry/default/ui/circular-progress"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

export default function CircularProgressExample() {
  const [progress, setProgress] = useState(75)

  return (
    <div className="flex flex-col items-center gap-4">
      <CircularProgress value={progress} size={150} strokeWidth={15} />
      <div className="w-full px-4">
        <Slider
          value={[progress]}
          max={100}
          step={1}
          onValueChange={(val) => setProgress(val[0])}
        />
        <div className="mt-2 text-center text-sm text-muted-foreground">
          Current Progress: {progress}%
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => setProgress(0)}>Reset</Button>
        <Button onClick={() => setProgress(100)}>Complete</Button>
      </div>
    </div>
  )
}
