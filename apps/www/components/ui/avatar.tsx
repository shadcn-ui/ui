"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

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

interface AvatarBadgeProps extends React.ComponentProps<"div"> {
  color?: string
  placement?: "botttom-right" | "bottom-left" | "top-right" | "top-left"
}

const AvatarBadge = ({
  color = "green",
  placement = "botttom-right",
  className,
  ...props
}: AvatarBadgeProps) => {
  const [positionY, positionX] = placement.split("-")
  const placementClass = `${positionY}-0 ${positionX}-0`

  return (
    <div
      className={cn(
        "absolute bottom-0 right-0 box-border flex h-4 w-4 translate-x-[2px] translate-y-[2px] select-none items-center justify-center rounded-full border-2 border-background text-xs font-bold text-white",
        placementClass,
        `bg-${color}-500`,
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback, AvatarBadge }
