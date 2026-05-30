"use client"

import * as React from "react"
import { TextArea as TextareaPrimitive } from "react-aria-components"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <TextareaPrimitive
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full resize-none rounded-none border border-transparent border-b-input bg-transparent px-0 py-3 text-base transition-[color,border-color] outline-none placeholder:text-muted-foreground focus-visible:border-b-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-b-destructive md:text-sm dark:aria-invalid:border-b-destructive/50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
