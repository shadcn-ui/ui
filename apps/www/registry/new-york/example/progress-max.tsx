"use client"

import * as React from "react"

import { Progress } from "@/registry/new-york/ui/progress"

export default function ProgressDemo() {
  const [progress, setProgress] = React.useState(13)

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(40), 500)
    return () => clearTimeout(timer)
  }, [])

  return <Progress value={progress} max={50} className="w-[60%]" />
}
