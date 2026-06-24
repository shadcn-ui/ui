import * as React from "react"

import { cn } from "@/registry/bases/base/lib/utils"
import { Skeleton } from "@/registry/bases/base/ui/skeleton"

function Textarea({
  className,
  isLoading = false,
  ...props
}: React.ComponentProps<"textarea"> & { isLoading?: boolean }) {
  if (isLoading) {
    return (
      <Skeleton
        className={cn(
          "cn-textarea flex field-sizing-content min-h-16 w-full outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props as any}
      />
    )
  }

  return (
    <textarea
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
