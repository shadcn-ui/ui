"use client"

import * as React from "react"
import { DirectionProvider } from "@/examples/base/ui/direction"

export default function DirectionDemo() {
  return (
    <DirectionProvider direction="ltr">
      <div className="rounded-md border px-3 py-2">Direction context</div>
    </DirectionProvider>
  )
}
