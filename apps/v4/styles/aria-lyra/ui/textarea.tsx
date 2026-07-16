"use client"

import * as React from "react"
import {
  composeRenderProps,
  TextArea as TextareaPrimitive,
} from "react-aria-components"

import { cn } from "@/lib/utils"

function Textarea({
  className,
  ...props
}: React.ComponentProps<typeof TextareaPrimitive>) {
  return (
    <TextareaPrimitive
      data-slot="textarea"
      className={composeRenderProps(className, (className) =>
        cn(
          "flex field-sizing-content min-h-16 w-full rounded-none border border-input bg-transparent px-2.5 py-2 text-xs transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-xs dark:bg-input/30 dark:disabled:bg-input/80 data-invalid:border-destructive data-invalid:ring-1 data-invalid:ring-destructive/20 dark:data-invalid:border-destructive/50 dark:data-invalid:ring-destructive/40",
          className
        )
      )}
      {...props}
    />
  )
}

export { Textarea }
