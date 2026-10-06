"use client"

import * as React from "react"

import { Progress } from "@/styles/aria-nova/ui/progress"

export default function ProgressDemo() {
  const [progress, setProgress] = React.useState(13)

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])

  return <Progress aria-label="Loading" value={progress} className="w-[60%]" />
}
