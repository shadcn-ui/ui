import * as React from "react"

import { cn } from "@/lib/utils"

export type TextareaProps = React.ComponentProps<"textarea">

const Textarea: React.FC<TextareaProps> = ({ className, ...props }) => (
  <textarea
    className={cn(
      "border-input placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[60px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
)
Textarea.displayName = "Textarea"

export { Textarea }
