import * as React from "react"
import { ark } from "@ark-ui/react/factory"

import { cn } from "@/registry/ark-lyra/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<typeof ark.div>) {
  return (
    <ark.div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }
