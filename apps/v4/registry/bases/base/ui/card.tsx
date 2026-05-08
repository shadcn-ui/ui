import * as React from "react"

import { cn } from "@/registry/bases/base/lib/utils"
import { Skeleton } from "@/registry/bases/base/ui/skeleton"

function Card({
  className,
  size = "default",
  isLoading = false,
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm"; isLoading?: boolean }) {
  if (isLoading) {
    return (
      <div
        data-slot="card"
        data-size={size}
        className={cn("cn-card group/card flex flex-col", className)}
        {...props}
      >
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <div className="flex flex-col gap-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    )
  }

  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn("cn-card group/card flex flex-col", className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "cn-card-header group/card-header @container/card-header grid auto-rows-min items-start has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("cn-card-title cn-font-heading", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("cn-card-description", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "cn-card-action col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("cn-card-content", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("cn-card-footer flex items-center", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
