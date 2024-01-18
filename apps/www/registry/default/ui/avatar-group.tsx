import React from "react"
import clsx from "clsx"

import { cn } from "@/lib/utils"

interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max: number
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, children, max = 1, ...props }, ref) => {
    const avatarItems = React.Children.toArray(children) as React.ReactElement[]

    const handleMargin = (index: number) => {
      return index * 10
    }

    const renderContent = React.useMemo(() => {
      return (
        <>
          {avatarItems.slice(0, max).map((child, index) => {
            return React.cloneElement(child, {
              className: clsx(
                child.props.className,
                "border-2 border-background"
              ),
              style: {
                right: handleMargin(index),
                ...child.props.style,
              },
            })
          })}
          {avatarItems.length > max && (
            <div
              className={clsx(
                "relative border-2 border-background h-10 w-10 flex items-center justify-center rounded-full bg-muted",
                avatarItems[0].props.className
              )}
              style={{ right: handleMargin(max) }}
            >
              <p>+{avatarItems.length - max}</p>
            </div>
          )}
        </>
      )
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [max])

    return (
      <div
        ref={ref}
        className={cn("relative flex flex-wrap", className)}
        {...props}
      >
        {renderContent}
      </div>
    )
  }
)

AvatarGroup.displayName = "AvatarGroup"

export { AvatarGroup }
