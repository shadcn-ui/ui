import * as React from "react"

import { cn } from "@/lib/utils"

function TextLink({ className, ...props }: React.ComponentProps<"a">) {
  return (
    <a
      data-slot="text-link"
      className={cn(
        "inline-flex items-center gap-1 font-medium underline-offset-4 outline-none hover:underline focus-visible:underline",
        className
      )}
      {...props}
    />
  )
}

export { TextLink }
