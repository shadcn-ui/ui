"use client"

import * as React from "react"

import { Progress } from "@/registry/default/ui/progress"

import { Label } from "../ui/label"
import { Separator } from "../ui/separator"

export default function ProgressDemo() {
  const [progressTop, setProgressTop] = React.useState(0)
  const [progressBottom, setProgressBottom] = React.useState(20)

  React.useEffect(() => {
    const timerTop = setTimeout(() => setProgressTop(40), 500)
    const timerBottom = setTimeout(() => setProgressBottom(80), 1000)

    return () => {
      clearTimeout(timerTop)
      clearTimeout(timerBottom)
    }
  }, [])

  return (
    <div className="flex flex-col w-full h-full space-y-5">
      <div className="flex flex-col items-center">
        <Label className="p-2">{progressTop}%</Label>
        <Progress value={progressTop} className="w-[60%]" />
      </div>
      <Separator />
      <div className="flex flex-col items-center">
        <Progress value={progressBottom} className="w-[60%]" />
        <Label className="p-2">{progressBottom}%</Label>
      </div>
    </div>
  )
}
