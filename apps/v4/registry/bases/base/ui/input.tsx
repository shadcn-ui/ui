import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/registry/bases/base/lib/utils"
import { Skeleton } from "@/registry/bases/base/ui/skeleton"

function Input({
  className,
  type,
  isLoading = false,
  ...props
}: React.ComponentProps<"input"> & { isLoading?: boolean }) {
  if (isLoading) {
    return (
      <Skeleton
        className={cn(
          "cn-input w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props as any}
      />
    )
  }

  return (
    <InputPrimitive
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
