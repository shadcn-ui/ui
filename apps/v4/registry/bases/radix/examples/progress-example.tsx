"use client"

import * as React from "react"

import { Progress } from "@/registry/bases/radix/ui/progress"

export default function ProgressDemo() {
  const [progress, setProgress] = React.useState(13)

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="bg-background min-h-screen p-4">
      <Progress value={progress} className="w-[60%]" />
    </div>
  )
}
