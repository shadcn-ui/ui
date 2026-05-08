import * as React from "react"

import { cn } from "@/lib/utils"
import { Skeleton } from "@/registry/new-york-v4/ui/skeleton"

function Card({
  className,
  isLoading = false,
  ...props
}: React.ComponentProps<"div"> & { isLoading?: boolean }) {
  if (isLoading) {
    return (
      <div
        data-slot="card"
        className={cn(
          "flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm",
          className
        )}
        {...props}
      >
        <div className="flex flex-col gap-2 px-6">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <div className="px-6">
          <Skeleton className="h-20 w-full" />
        </div>
        <div className="flex items-center px-6">
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    )
  }

  return (
    <div
      data-slot="card"
      className={cn(
        "flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
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
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
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
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
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
