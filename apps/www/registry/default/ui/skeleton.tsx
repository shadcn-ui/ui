import * as React from "react"

import { cn } from "@/lib/utils"

const Skeleton: React.FC<React.ComponentProps<"div">> = ({
  className,
  ...props
}) => (
  <div
    className={cn("bg-muted animate-pulse rounded-md", className)}
    {...props}
  />
)

export { Skeleton }
