"use client"

import { Progress } from "@/registry/default/ui/progress"
import * as React from "react"
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
    <div className="flex h-full w-full flex-col space-y-5">
      <Progress label="top" value={progressTop} className="w-[60%]" />
      <Separator />
      <Progress label="bottom" value={progressBottom} className="w-[60%]" />
    </div>
  )
}
