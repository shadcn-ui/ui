"use client"

import * as React from "react"

import { Progress } from "@/registry/bases/radix/ui/progress"
import Frame from "@/app/(design)/design/components/frame"

export default function ProgressExample() {
  const [progress, setProgress] = React.useState(13)

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-6 lg:p-12">
      <div className="flex w-full max-w-md gap-12 md:flex-col">
        <ProgressValues />
        <ProgressWithLabel />
      </div>
    </div>
  )
}

function ProgressValues() {
  return (
    <Frame title="Values">
      <div className="flex flex-col gap-4">
        <Progress value={0} className="w-full" />
        <Progress value={25} className="w-full" />
        <Progress value={50} className="w-full" />
        <Progress value={75} className="w-full" />
        <Progress value={100} className="w-full" />
      </div>
    </Frame>
  )
}

function ProgressWithLabel() {
  return (
    <Frame title="With Label">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm">
          <span>Upload progress</span>
          <span>66%</span>
        </div>
        <Progress value={66} className="w-full" />
      </div>
    </Frame>
  )
}
