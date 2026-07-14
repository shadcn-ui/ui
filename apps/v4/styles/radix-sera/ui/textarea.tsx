import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  const { rows, ...textareaProps } = props
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex",
        rows === undefined && "field-sizing-content",
        "min-h-16 w-full resize-none rounded-none border border-transparent border-b-input bg-transparent px-0 py-3 text-base transition-[color,border-color] outline-none placeholder:text-muted-foreground focus-visible:border-b-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-b-destructive md:text-sm dark:aria-invalid:border-b-destructive/50",
        className
      )}
      rows={rows} {...textareaProps}
    />
  )
}

export { Textarea }
