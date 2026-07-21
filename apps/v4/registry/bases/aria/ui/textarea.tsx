"use client"

import * as React from "react"
import {
  composeRenderProps,
  TextArea as TextareaPrimitive,
} from "react-aria-components"

import { cn } from "@/registry/bases/aria/lib/utils"

function Textarea({
  className,
  ...props
}: React.ComponentProps<typeof TextareaPrimitive>) {
  return (
    <TextareaPrimitive
      data-slot="textarea"
      className={composeRenderProps(className, (className) =>
        cn(
          "cn-textarea flex field-sizing-content min-h-16 w-full outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className
        )
      )}
      {...props}
    />
  )
}

export { Textarea }
