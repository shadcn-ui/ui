import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* -----------------------------------------------------------------------------
 * Timeline (root container)
 * -------------------------------------------------------------------------- */

const timelineVariants = cva("flex", {
  variants: {
    orientation: {
      vertical: "flex-col",
      horizontal: "flex-row overflow-x-auto",
    },
    position: {
      left: "",
      right: "",
      alternate: "",
    },
  },
  defaultVariants: {
    orientation: "vertical",
    position: "left",
  },
})

interface TimelineProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof timelineVariants> {}

function Timeline({
  className,
  orientation,
  position,
  ...props
}: TimelineProps) {
  return (
    <div
      data-slot="timeline"
      data-orientation={orientation}
      data-position={position}
      className={cn(timelineVariants({ orientation, position }), className)}
      {...props}
    />
  )
}

/* -----------------------------------------------------------------------------
 * TimelineItem
 * -------------------------------------------------------------------------- */

const timelineItemVariants = cva("relative flex flex-col", {
  variants: {
    orientation: {
      vertical: "pb-8 last:pb-0",
      horizontal: "flex-1 items-center",
    },
    status: {
      default: "",
      completed: "",
      current: "",
      upcoming: "opacity-60",
    },
  },
  defaultVariants: {
    orientation: "vertical",
    status: "default",
  },
})

interface TimelineItemProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof timelineItemVariants> {}

function TimelineItem({
  className,
  orientation,
  status,
  ...props
}: TimelineItemProps) {
  return (
    <div
      data-slot="timeline-item"
      data-status={status}
      className={cn(timelineItemVariants({ orientation, status }), className)}
      {...props}
    />
  )
}

/* -----------------------------------------------------------------------------
 * TimelineConnector (the line connecting items)
 * -------------------------------------------------------------------------- */

const timelineConnectorVariants = cva("", {
  variants: {
    orientation: {
      vertical:
        "absolute left-[calc(var(--timeline-icon-size,2.5rem)/2)] top-[var(--timeline-icon-size,2.5rem)] h-[calc(100%-var(--timeline-icon-size,2.5rem))] w-px -translate-x-1/2",
      horizontal:
        "absolute top-3 left-[calc(50%+0.75rem)] h-px w-[calc(100%-1.5rem)]",
    },
    variant: {
      default: "bg-border",
      dashed: "border-l border-dashed border-border bg-transparent",
      dotted: "border-l border-dotted border-border bg-transparent",
    },
    status: {
      default: "",
      completed: "bg-primary",
      current: "bg-gradient-to-b from-primary to-border",
      upcoming: "bg-muted",
    },
  },
  defaultVariants: {
    orientation: "vertical",
    variant: "default",
    status: "default",
  },
})

interface TimelineConnectorProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof timelineConnectorVariants> {}

function TimelineConnector({
  className,
  orientation,
  variant,
  status,
  ...props
}: TimelineConnectorProps) {
  return (
    <div
      data-slot="timeline-connector"
      aria-hidden="true"
      className={cn(
        timelineConnectorVariants({ orientation, variant, status }),
        className
      )}
      {...props}
    />
  )
}

/* -----------------------------------------------------------------------------
 * TimelineHeader (contains icon and title row)
 * -------------------------------------------------------------------------- */

function TimelineHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="timeline-header"
      className={cn("flex items-center gap-3", className)}
      {...props}
    />
  )
}

/* -----------------------------------------------------------------------------
 * TimelineIcon (the dot/icon indicator)
 * -------------------------------------------------------------------------- */

const timelineIconVariants = cva(
  "relative z-10 flex shrink-0 items-center justify-center rounded-full border bg-background [--timeline-icon-size:2.5rem]",
  {
    variants: {
      size: {
        sm: "size-6 [--timeline-icon-size:1.5rem] [&>svg]:size-3",
        default: "size-10 [--timeline-icon-size:2.5rem] [&>svg]:size-4",
        lg: "size-12 [--timeline-icon-size:3rem] [&>svg]:size-5",
      },
      variant: {
        default: "border-border text-muted-foreground",
        primary: "border-primary bg-primary text-primary-foreground",
        secondary: "border-secondary bg-secondary text-secondary-foreground",
        destructive:
          "border-destructive bg-destructive text-destructive-foreground",
        outline: "border-border bg-background text-foreground",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
)

interface TimelineIconProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof timelineIconVariants> {}

function TimelineIcon({
  className,
  size,
  variant,
  ...props
}: TimelineIconProps) {
  return (
    <div
      data-slot="timeline-icon"
      className={cn(timelineIconVariants({ size, variant }), className)}
      {...props}
    />
  )
}

/* -----------------------------------------------------------------------------
 * TimelineContent (container for description, time, etc.)
 * -------------------------------------------------------------------------- */

function TimelineContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="timeline-content"
      className={cn("ms-[3.25rem] flex flex-col gap-1 pt-0.5 pb-2", className)}
      {...props}
    />
  )
}

/* -----------------------------------------------------------------------------
 * TimelineTitle
 * -------------------------------------------------------------------------- */

function TimelineTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="timeline-title"
      className={cn(
        "text-foreground leading-none font-medium tracking-tight",
        className
      )}
      {...props}
    />
  )
}

/* -----------------------------------------------------------------------------
 * TimelineDescription
 * -------------------------------------------------------------------------- */

function TimelineDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="timeline-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

/* -----------------------------------------------------------------------------
 * TimelineTime (timestamp display)
 * -------------------------------------------------------------------------- */

function TimelineTime({ className, ...props }: React.ComponentProps<"time">) {
  return (
    <time
      data-slot="timeline-time"
      className={cn("text-muted-foreground text-xs", className)}
      {...props}
    />
  )
}

/* -----------------------------------------------------------------------------
 * Exports
 * -------------------------------------------------------------------------- */

export {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineContent,
  TimelineTitle,
  TimelineDescription,
  TimelineTime,
  timelineVariants,
  timelineItemVariants,
  timelineConnectorVariants,
  timelineIconVariants,
}
