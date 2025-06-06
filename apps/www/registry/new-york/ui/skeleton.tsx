import React from "react"

import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  loading?: boolean
}

function Skeleton({
  className,
  children,
  loading = true,
  ...props
}: SkeletonProps) {
  if (!loading) return children

  return (
    <div className="relative inline-block">
      <div
        className={cn(
          "absolute inset-0 animate-pulse rounded-md bg-secondary",
          className
        )}
        {...props}
      />
      <div className="invisible">{children}</div>
    </div>
  )
}

export { Skeleton }
