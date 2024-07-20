import * as React from "react"

import { cn } from "@/lib/utils"

export type TextareaProps = React.ComponentProps<"textarea">

const Textarea: React.FC<TextareaProps> = ({ className, ...props }) => (
  <textarea
    className={cn(
      "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
)
Textarea.displayName = "Textarea"

export { Textarea }
