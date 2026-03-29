"use client"

import { cn } from "@/examples/react-aria/lib/utils"
import { Loader2Icon } from "lucide-react"
import { ProgressBar as ProgressBarPrimitive } from "react-aria-components"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <ProgressBarPrimitive
      isIndeterminate
      aria-label="Loading"
      className={cn("size-4", className)}
    >
      <Loader2Icon className="size-full animate-spin" {...props} />
    </ProgressBarPrimitive>
  )
}

export { Spinner }
