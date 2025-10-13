"use client"

import * as React from "react"
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"

type AspectRatioProps = React.ComponentProps<typeof AspectRatioPrimitive.Root>

function AspectRatio({ ...props }: AspectRatioProps) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />
}

export { AspectRatio }

export type { AspectRatioProps }
