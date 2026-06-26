"use client"

import * as React from "react"

import { Button } from "@/styles/radix-rhea/ui/button"

export function ShimmerOnce() {
  const [key, setKey] = React.useState(0)

  return (
    <div className="flex flex-col items-center gap-4">
      <p
        key={key}
        className="shimmer text-sm text-muted-foreground shimmer-duration-1100 shimmer-once"
      >
        Generating response&hellip;
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setKey((value) => value + 1)}
      >
        Replay
      </Button>
    </div>
  )
}
