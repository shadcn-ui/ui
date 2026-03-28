import * as React from "react"
import { cn } from "@/examples/ark/lib/utils"
import { ark } from "@ark-ui/react/factory"

function Skeleton({
  className,
  ...props
}: React.ComponentProps<typeof ark.div>) {
  return (
    <ark.div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-accent", className)}
      {...props}
    />
  )
}

export { Skeleton }
