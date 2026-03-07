"use client"

import * as React from "react"
import {TextArea as TextareaPrimitive} from "react-aria-components"
import { cn } from "@/registry/bases/react-aria/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <TextareaPrimitive
      data-slot="textarea"
      className={cn(
        "cn-textarea flex field-sizing-content min-h-16 w-full outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
