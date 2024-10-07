import * as React from "react"

import { cn } from "@/lib/utils"

interface AvatarGroupProps {
  className?: string
  orientation?: "horizontal" | "vertical"
  limit?: number
  size?: "small" | "medium" | "large"
  spacing?: string
  children: React.ReactNode
}

interface AvatarWrapperProps {
  children: React.ReactNode
  index: number
}

const AvatarWrapper: React.FC<AvatarWrapperProps> = ({ children, index }) => {
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-background bg-background text-foreground"
      )}
      style={{
        zIndex: index !== 0 ? index : undefined,
      }}
      role="img"
      aria-label={`Avatar ${index + 1}`}
    >
      {children}
    </div>
  )
}

export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  (
    {
      children,
      className = "",
      orientation = "horizontal",
      limit,
      spacing = "0.75rem",
      ...props
    },
    ref
  ) => {
    const childrenArray = React.Children.toArray(children)
    const limitedChildren = limit
      ? childrenArray.slice(0, limit)
      : childrenArray

    const styledChildren = limitedChildren.map((child, index) => (
      <AvatarWrapper key={index} index={index}>
        {child}
      </AvatarWrapper>
    ))

    return (
      <div
        ref={ref}
        className={cn(
          "flex select-none",
          orientation === "horizontal"
            ? `flex-row -space-x-3`
            : `flex-col -space-y-3`,
          className
        )}
        {...props}
      >
        {styledChildren}
      </div>
    )
  }
)

AvatarGroup.displayName = "AvatarGroup"
