import * as React from "react"

import { cn } from "@/registry/bases/radix/lib/utils"
import { Skeleton } from "@/registry/bases/radix/ui/skeleton"

function Input({ className, type, isLoading, ...props }: React.ComponentProps<"input"> & { isLoading?: boolean }) {
  if (isLoading) {
    return <Skeleton className="h-9 w-full" />
  }
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "cn-input w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
