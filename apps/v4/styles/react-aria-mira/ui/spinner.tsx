"use client"

import { Loader2Icon } from "lucide-react"
import { ProgressBar as ProgressBarPrimitive } from "react-aria-components"

import { cn } from "@/lib/utils"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <ProgressBarPrimitive
      isIndeterminate
      aria-label="Loading"
      className={cn("size-4", className)}
    >
      <Loader2Icon
        data-slot="spinner"
        className="size-full animate-spin"
        {...props}
      />
    </ProgressBarPrimitive>
  )
}

export { Spinner }
