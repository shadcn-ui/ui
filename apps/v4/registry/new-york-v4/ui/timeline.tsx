"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// ============================================
// Context for position and index
// ============================================
const TimelineContext = React.createContext<{
  position: "left" | "right" | "alternate" | "center"
}>({
  position: "left",
})

const TimelineItemContext = React.createContext<{ index: number }>({ index: 0 })

// ============================================
// 1. Timeline
// ============================================
const timelineVariants = cva("flex flex-col list-none m-0 p-0", {
  variants: {
    position: {
      left: "gap-6",
      right: "gap-6",
      alternate: "gap-0",
      center: "gap-0",
    },
  },
  defaultVariants: {
    position: "left",
  },
})

interface TimelineProps
  extends React.ComponentProps<"ol">,
    VariantProps<typeof timelineVariants> {}

const Timeline = React.forwardRef<HTMLOListElement, TimelineProps>(
  ({ className, position, children, ...props }, ref) => {
    const timelinePosition = position ?? "left"

    // Wrap children to inject index for each TimelineItem
    // Non-element children (null, strings, etc.) are passed through unchanged
    const childrenWithIndex = React.Children.map(children, (child, index) => {
      if (React.isValidElement(child)) {
        return (
          <TimelineItemContext.Provider value={{ index }}>
            {child}
          </TimelineItemContext.Provider>
        )
      }
      return child
    })

    return (
      <TimelineContext.Provider value={{ position: timelinePosition }}>
        <ol
          ref={ref}
          role="list"
          data-slot="timeline"
          data-position={timelinePosition}
          className={cn(
            timelineVariants({ position: timelinePosition }),
            className
          )}
          {...props}
        >
          {childrenWithIndex}
        </ol>
      </TimelineContext.Provider>
    )
  }
)
Timeline.displayName = "Timeline"

// ============================================
// 2. TimelineItem
// ============================================
const TimelineItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, children, ...props }, ref) => {
  const { position } = React.useContext(TimelineContext)
  const { index } = React.useContext(TimelineItemContext)

  // Determine if this item should be on the right side
  const isRight =
    position === "right" || (position === "alternate" && index % 2 === 1)

  // Center mode - special layout with line in the middle
  if (position === "center") {
    const isEven = index % 2 === 0
    return (
      <li
        ref={ref}
        role="listitem"
        data-slot="timeline-item"
        data-position={isEven ? "left" : "right"}
        className={cn(
          "relative m-0 grid grid-cols-[1fr_auto_1fr] gap-4 p-0",
          className
        )}
        {...props}
      >
        {children}
      </li>
    )
  }

  return (
    <li
      ref={ref}
      role="listitem"
      data-slot="timeline-item"
      data-position={isRight ? "right" : "left"}
      className={cn(
        "relative m-0 flex gap-4 p-0",
        position === "alternate" && "justify-center",
        isRight && "flex-row-reverse",
        className
      )}
      {...props}
    >
      {children}
    </li>
  )
})
TimelineItem.displayName = "TimelineItem"

// ============================================
// 3. TimelineMarker
// ============================================
const timelineMarkerVariants = cva(
  "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border-2",
  {
    variants: {
      variant: {
        default: "border-border bg-background",
        primary: "border-primary bg-primary",
        success:
          "border-green-500 bg-green-500 dark:border-green-600 dark:bg-green-600",
        warning:
          "border-yellow-500 bg-yellow-500 dark:border-yellow-600 dark:bg-yellow-600",
        destructive:
          "border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const variantLabels = {
  default: "Event",
  primary: "Important",
  success: "Completed",
  warning: "Warning",
  destructive: "Error",
}

interface TimelineMarkerProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof timelineMarkerVariants> {
  icon?: React.ReactNode
}

const TimelineMarker = React.forwardRef<HTMLDivElement, TimelineMarkerProps>(
  ({ className, variant, icon, ...props }, ref) => {
    const { position } = React.useContext(TimelineContext)
    const ariaLabel = variantLabels[variant ?? "default"]

    return (
      <div
        className={cn(
          "relative flex flex-col items-center",
          position === "center" && "justify-start"
        )}
      >
        <div
          ref={ref}
          data-slot="timeline-marker"
          className={cn(timelineMarkerVariants({ variant }), className)}
          aria-label={ariaLabel}
          role="status"
          {...props}
        >
          {icon ? (
            <div className="flex size-3 items-center justify-center text-current">
              {icon}
            </div>
          ) : (
            <div
              className={cn(
                "size-2 rounded-full",
                variant === "default" ? "bg-muted-foreground" : "bg-current"
              )}
            />
          )}
        </div>
        {/* Line */}
        <div
          className="bg-border absolute -top-4 -bottom-4 left-1/2 w-px -translate-x-1/2 [li:first-child_&]:top-6 [li:last-child_&]:bottom-auto [li:last-child_&]:h-full"
          data-slot="timeline-line"
          aria-hidden="true"
        />
      </div>
    )
  }
)
TimelineMarker.displayName = "TimelineMarker"

// ============================================
// 4. TimelineContent
// ============================================
const TimelineContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  const { position } = React.useContext(TimelineContext)
  const { index } = React.useContext(TimelineItemContext)

  const isRight =
    position === "right" || (position === "alternate" && index % 2 === 1)

  // Center mode uses grid layout
  if (position === "center") {
    const isEven = index % 2 === 0
    return (
      <div
        ref={ref}
        data-slot="timeline-content"
        className={cn(
          "flex flex-col gap-1 pb-8",
          isEven ? "text-right" : "text-left",
          className
        )}
        {...props}
      />
    )
  }

  return (
    <div
      ref={ref}
      data-slot="timeline-content"
      className={cn(
        "flex flex-1 flex-col gap-1 pb-6",
        position === "alternate" && "w-1/2",
        position === "alternate" && (isRight ? "text-right" : "text-left"),
        className
      )}
      {...props}
    />
  )
})
TimelineContent.displayName = "TimelineContent"

// ============================================
// 5. TimelineSpacer
// ============================================
const TimelineSpacer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="timeline-spacer"
      className={cn("min-w-0 flex-1", className)}
      {...props}
    />
  )
})
TimelineSpacer.displayName = "TimelineSpacer"

// ============================================
// 6. TimelineTitle
// ============================================
const TimelineTitle = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<"p">
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      data-slot="timeline-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
})
TimelineTitle.displayName = "TimelineTitle"

// ============================================
// 7. TimelineDescription
// ============================================
const TimelineDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<"p">
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      data-slot="timeline-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
})
TimelineDescription.displayName = "TimelineDescription"

// ============================================
// 8. TimelineTime
// ============================================
const TimelineTime = React.forwardRef<
  HTMLTimeElement,
  React.ComponentProps<"time">
>(({ className, ...props }, ref) => {
  return (
    <time
      ref={ref}
      data-slot="timeline-time"
      className={cn("text-muted-foreground text-xs", className)}
      {...props}
    />
  )
})
TimelineTime.displayName = "TimelineTime"

// ============================================
// Export
// ============================================
export {
  Timeline,
  TimelineItem,
  TimelineMarker,
  TimelineContent,
  TimelineSpacer,
  TimelineTitle,
  TimelineDescription,
  TimelineTime,
}
