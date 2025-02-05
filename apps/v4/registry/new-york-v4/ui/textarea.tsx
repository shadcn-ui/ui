import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 aria-invalid:outline-destructive/60 dark:aria-invalid:outline-destructive dark:aria-invalid:ring-destructive/40 aria-invalid:ring-destructive/20 aria-invalid:border-destructive/60 dark:aria-invalid:border-destructive dark:aria-invalid:ring-destructive/50 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:focus-visible:ring-[3px] aria-invalid:focus-visible:outline-none md:text-sm dark:aria-invalid:focus-visible:ring-4",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
