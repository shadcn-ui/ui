"use client"

import * as React from "react"

function AspectRatio({
  ratio = 1 / 1,
  className,
  style,
  ...props
}: React.ComponentProps<"div"> & { ratio?: number }) {
  return (
    <div
      data-slot="aspect-ratio"
      style={{
        position: "relative",
        width: "100%",
        paddingBottom: `${100 / ratio}%`,
        ...style,
      }}
    >
      <div
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
    </div>
  )
}

export { AspectRatio }
