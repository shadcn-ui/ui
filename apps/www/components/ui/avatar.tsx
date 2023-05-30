"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { VariantProps, cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn("relative flex h-10 w-10 shrink-0 rounded-full", className)}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full rounded-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

const avatarBadgeVariants = cva(
  "absolute w-4 h-4 rounded-full bg-background flex items-stretch justify-stretch [&>*]:grow [&>*]:rounded-full",
  {
    variants: {
      position: {
        bottomLeft: "bottom-0 -left-1",
        bottomRight: "bottom-0 -right-1",
        topLeft: "top-0 -left-1",
        topRight: "top-0 -right-1",
      },
    },
    defaultVariants: {
      position: "bottomLeft",
    },
  }
)

export interface AvatarBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarBadgeVariants> {
  children?:
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | null
    | never[]
}

const AvatarBadge = ({ className, position, ...props }: AvatarBadgeProps) => (
  <div
    className={cn(avatarBadgeVariants({ position }), className)}
    {...props}
  />
)

type AvatarGroupContextValue = {
  count?: number
  limit?: number
  setCount?: React.Dispatch<React.SetStateAction<number>>
}

const AvatarGroupContext = React.createContext<AvatarGroupContextValue>({})

const AvatarGroupProvider = ({
  children,
  limit,
}: {
  children?: React.ReactNode
  limit?: number
}) => {
  const [count, setCount] = React.useState<number>(0)

  return (
    <AvatarGroupContext.Provider
      value={{
        count,
        setCount,
        limit,
      }}
    >
      {children}
    </AvatarGroupContext.Provider>
  )
}

const useAvatarGroupContext = () => React.useContext(AvatarGroupContext)

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  limit?: number
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ children, className, limit, ...props }, ref) => {
    return (
      <AvatarGroupProvider limit={limit}>
        <div
          ref={ref}
          className={cn(
            "flex items-center justify-end -space-x-4 relative",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </AvatarGroupProvider>
    )
  }
)
AvatarGroup.displayName = "AvatarGroup"

const AvatarGroupList = ({ children }: { children?: React.ReactNode }) => {
  const { limit, setCount } = useAvatarGroupContext()

  setCount?.(React.Children.count(children))

  return (
    <>{limit ? React.Children.toArray(children).slice(0, limit) : children}</>
  )
}

export interface AvatarOverflowIndicatorProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

const AvatarOverflowIndicator = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & AvatarOverflowIndicatorProps
>(({ className, ...props }, ref) => {
  const { limit, count } = useAvatarGroupContext()
  if (!limit || !count || count <= limit) return null
  return (
    <span
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted",
        className
      )}
      {...props}
    >
      +{count! - limit!}
    </span>
  )
})
AvatarOverflowIndicator.displayName = "AvatarOverflowIndicator"

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupList,
  AvatarOverflowIndicator,
}
