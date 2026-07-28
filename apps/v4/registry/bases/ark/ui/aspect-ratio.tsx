"use client"

import * as React from "react"
import { ark } from "@ark-ui/react/factory"

function AspectRatio({
  ratio = 1 / 1,
  className,
  style,
  ...props
}: React.ComponentProps<typeof ark.div> & { ratio?: number }) {
  return (
    <ark.div
      data-slot="aspect-ratio"
      style={{
        position: "relative",
        width: "100%",
        paddingBottom: `${100 / ratio}%`,
        ...style,
      }}
    >
      <ark.div
        className={className}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        }}
        {...props}
      />
    </ark.div>
  )
}

export { AspectRatio }
