"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const TimelineDirectionContext = React.createContext<"horizontal" | "vertical">(
  "vertical"
)

const Timeline = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    direction?: "horizontal" | "vertical"
  }
>(({ className, direction = "vertical", ...props }, ref) => (
  <TimelineDirectionContext.Provider value={direction}>
    <div
      ref={ref}
      className={cn(
        direction === "vertical" ? "space-y-4" : "flex space-x-4",
        className
      )}
      {...props}
    />
  </TimelineDirectionContext.Provider>
))
Timeline.displayName = "Timeline"

const TimelineItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const direction = React.useContext(TimelineDirectionContext)
  return (
    <div
      ref={ref}
      className={cn(
        direction === "vertical" ? "relative pl-8" : "relative pb-8",
        className
      )}
      {...props}
    />
  )
})
TimelineItem.displayName = "TimelineItem"

const TimelineDot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "success" | "error" | "warning"
  }
>(({ className, variant = "default", ...props }, ref) => {
  const direction = React.useContext(TimelineDirectionContext)
  return (
    <div
      ref={ref}
      className={cn(
        direction === "vertical"
          ? "absolute left-0 top-2"
          : "absolute left-[0.5px] top-0",
        "flex h-3 w-3 items-center justify-center rounded-full border",
        {
          "bg-background border-primary": variant === "default",
          "bg-green-50 border-green-600": variant === "success",
          "bg-red-50 border-red-600": variant === "error",
          "bg-yellow-50 border-yellow-600": variant === "warning",
        },
        className
      )}
      {...props}
    />
  )
})
TimelineDot.displayName = "TimelineDot"

const TimelineConnector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const direction = React.useContext(TimelineDirectionContext)
  return (
    <div
      ref={ref}
      className={cn(
        direction === "vertical"
          ? "absolute -bottom-4 left-1.5 top-5 h-full w-[1px] bg-border"
          : "absolute -right-4 left-[14px] top-1.5 h-[1px] bg-border",
        className
      )}
      {...props}
    />
  )
})
TimelineConnector.displayName = "TimelineConnector"

const TimelineContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const direction = React.useContext(TimelineDirectionContext)
  return (
    <div
      ref={ref}
      className={cn(direction === "vertical" ? "pt-1" : "pt-5", className)}
      {...props}
    />
  )
})
TimelineContent.displayName = "TimelineContent"

export {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
}
