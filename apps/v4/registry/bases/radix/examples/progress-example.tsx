"use client"

import * as React from "react"

import { CanvaFrame } from "@/components/canva"
import { Field, FieldLabel } from "@/registry/bases/radix/ui/field"
import { Progress } from "@/registry/bases/radix/ui/progress"

export default function ProgressExample() {
  const [progress, setProgress] = React.useState(13)

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-6 lg:p-12">
      <div className="flex w-full max-w-lg flex-col gap-12">
        <ProgressValues />
        <ProgressWithLabel />
      </div>
    </div>
  )
}

function ProgressValues() {
  return (
    <CanvaFrame title="Progress Bar">
      <div className="flex w-full flex-col gap-4">
        <Progress value={0} className="w-full" />
        <Progress value={25} className="w-full" />
        <Progress value={50} className="w-full" />
        <Progress value={75} className="w-full" />
        <Progress value={100} className="w-full" />
      </div>
    </CanvaFrame>
  )
}

function ProgressWithLabel() {
  return (
    <CanvaFrame title="With Label">
      <Field>
        <FieldLabel htmlFor="progress-upload">
          <span>Upload progress</span>
          <span className="ml-auto">66%</span>
        </FieldLabel>
        <Progress value={66} className="w-full" id="progress-upload" />
      </Field>
    </CanvaFrame>
  )
}
