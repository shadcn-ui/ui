"use client"

import React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const Timeline = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => <div {...props} ref={ref} />)
Timeline.displayName = "Timeline"

const TimelineItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div {...props} ref={ref} className={cn("flex gap-x-3", className)} />
))
TimelineItem.displayName = "TimelineItem"

const TimelineItemLabel = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <div className="ps-2 my-2 first:mt-0">
    <h3
      {...props}
      ref={ref}
      className={cn(
        "text-xs font-medium uppercase text-muted-foreground",
        className
      )}
    />
  </div>
))
TimelineItemLabel.displayName = "TimelineItemLabel"

export interface TimelineConnectorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  hideLine?: boolean
}

const TimelineConnector = React.forwardRef<
  HTMLDivElement,
  TimelineConnectorProps
>(({ className, hideLine, ...props }, ref) => (
  <div
    {...props}
    ref={ref}
    className={cn(
      !hideLine &&
        "relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-input",
      className
    )}
  />
))
TimelineConnector.displayName = "TimelineConnector"

const timelineDotVariants = cva(
  "flex shrink-0 justify-center items-center rounded-full",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input bg-background",
        secondary: "bg-secondary text-secondary-foreground",
        accent: "bg-accent text-accent-foreground",
      },
      size: {
        default: "w-6 h-6",
        sm: "w-4 h-4",
        lg: "w-10 h-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface TimelineDotProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof timelineDotVariants> {}

const TimelineDot = React.forwardRef<HTMLDivElement, TimelineDotProps>(
  ({ className, variant, size, ...props }, ref) => (
    <div className="relative z-10 w-7 h-7 flex justify-center items-center">
      <div
        {...props}
        ref={ref}
        className={cn(timelineDotVariants({ variant, size, className }))}
      />
    </div>
  )
)
TimelineDot.displayName = "TimelineDot"

const TimelineContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div {...props} ref={ref} className={cn("grow pt-0.5 pb-8", className)} />
))
TimelineContent.displayName = "TimelineContent"

const TimelineContentLabel = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    {...props}
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
  />
))
TimelineContentLabel.displayName = "TimelineContentLabel"

const TimelineContentDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    {...props}
    ref={ref}
    className={cn("mt-1 text-sm text-muted-foreground", className)}
  />
))
TimelineContentDescription.displayName = "TimelineContentDescription"

export {
  Timeline,
  TimelineItem,
  TimelineItemLabel,
  TimelineConnector,
  TimelineDot,
  timelineDotVariants,
  TimelineContent,
  TimelineContentLabel,
  TimelineContentDescription,
}
