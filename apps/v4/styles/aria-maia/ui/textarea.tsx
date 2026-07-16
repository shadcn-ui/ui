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
          "flex field-sizing-content min-h-16 w-full resize-none rounded-xl border border-input bg-input/30 px-3 py-3 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm data-invalid:border-destructive data-invalid:ring-[3px] data-invalid:ring-destructive/20 dark:data-invalid:border-destructive/50 dark:data-invalid:ring-destructive/40",
          className
        )
      )}
      {...props}
    />
  )
}

export { Textarea }
