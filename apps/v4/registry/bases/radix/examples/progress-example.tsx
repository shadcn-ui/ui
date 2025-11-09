"use client"

import * as React from "react"

import { Progress } from "@/registry/bases/radix/ui/progress"
import { CanvaFrame } from "@/app/(design)/design/components/canva"

export default function ProgressDemo() {
  const [progress, setProgress] = React.useState(13)

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <CanvaFrame>
      <Progress value={progress} className="w-[60%]" />
    </CanvaFrame>
  )
}
